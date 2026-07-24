import { ValidationError } from "../errors/app-error";
import type { ExtensionSnapshot } from "../extension/extension-snapshot-types";
import { sanitizeAiPlainText } from "./ai-context-sanitizer";
import {
  detectPromptInjectionIntent,
  labelUntrustedCustomerText,
} from "./ai-prompt-injection-policy";
import { resolveExtensionSnapshotAiContextBudget } from "./extension-snapshot-ai-context-budget";
import type {
  BuildExtensionSnapshotAiContextInput,
  ExtensionSnapshotAiReadyContext,
} from "./extension-snapshot-ai-context-types";
import { redactExtensionSnapshotPii } from "./extension-snapshot-pii-redaction";

const allowedChannels = new Set<ExtensionSnapshot["channel"]>([
  "whatsapp",
  "instagram",
  "tiktok",
]);

const unsafeKeyPattern = new RegExp(
  [
    "raw",
    "cookie",
    "authorization",
    "token",
    "secret",
    "payload",
    "html",
    "dom",
  ].join("|"),
  "i",
);

function assertSafeShape(value: unknown, path = "snapshot"): void {
  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (unsafeKeyPattern.test(key)) {
      throw new ValidationError("Invalid request.", [
        { path: `${path}.${key}`, message: "Unsafe snapshot field rejected." },
      ]);
    }

    if (typeof child === "object") {
      assertSafeShape(child, `${path}.${key}`);
    }
  }
}

function assertBuildInput(input: BuildExtensionSnapshotAiContextInput): void {
  if (
    input.authContext.organizationId !== input.scope.organizationId ||
    input.authContext.workspaceId !== input.scope.workspaceId
  ) {
    throw new ValidationError("Invalid request.", [
      { path: "scope", message: "Scope must come from AuthContext." },
    ]);
  }

  if (
    input.snapshot.provider !== "extension" ||
    input.snapshot.officialApi !== false ||
    !allowedChannels.has(input.snapshot.channel)
  ) {
    throw new ValidationError("Invalid request.", [
      { path: "snapshot", message: "Unsupported extension snapshot." },
    ]);
  }

  assertSafeShape(input.snapshot);
}

function safeText(value: string | null, maxChars: number): string | null {
  if (!value) {
    return null;
  }

  return redactExtensionSnapshotPii(sanitizeAiPlainText(value, maxChars));
}

export function buildExtensionSnapshotAiContext(
  input: BuildExtensionSnapshotAiContextInput,
): ExtensionSnapshotAiReadyContext {
  assertBuildInput(input);

  const budget = resolveExtensionSnapshotAiContextBudget(input.budget);
  const messages = input.snapshot.messages.slice(-budget.maxMessages);

  return {
    policyVersion: "p17-extension-snapshot-ai-context-v1",
    organizationId: input.authContext.organizationId,
    workspaceId: input.authContext.workspaceId,
    userId: input.authContext.userId,
    provider: "extension",
    officialApi: false,
    channel: input.snapshot.channel,
    snapshotHash: input.snapshot.snapshotHash,
    capturedAt: input.snapshot.capturedAt.toISOString(),
    chatTitle: safeText(input.snapshot.chatTitle, 160) ?? "",
    chatSubtitle: safeText(input.snapshot.chatSubtitle, 160),
    sourceUrlOrigin: input.snapshot.sourceUrlOrigin,
    messages: messages.map((message) => {
      const text = safeText(message.text, budget.maxMessageChars) ?? "";

      return {
        id: sanitizeAiPlainText(message.id, 120),
        direction: message.direction,
        author: safeText(message.author, 120),
        text,
        untrustedText: labelUntrustedCustomerText(text),
        promptInjectionIntent: detectPromptInjectionIntent(text),
        timestampLabel: safeText(message.timestampLabel, 80),
      };
    }),
    contextBudgetSummary: {
      maxMessages: budget.maxMessages,
      maxMessageChars: budget.maxMessageChars,
      includedMessages: messages.length,
      truncatedMessages: Math.max(
        0,
        input.snapshot.messages.length - messages.length,
      ),
    },
  };
}
