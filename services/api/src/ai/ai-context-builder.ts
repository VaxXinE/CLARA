import { ValidationError } from "../errors/app-error";
import { applyAiContextBudget } from "./ai-context-budget";
import { sanitizeAiPlainText } from "./ai-context-sanitizer";
import type { AiContextBuilderInput, SafeAiContext } from "./ai-context-types";
import { toUntrustedContentBlock } from "./ai-untrusted-content";

function assertSameWorkspace(input: AiContextBuilderInput): void {
  const auth = input.authContext!;

  if (!auth) {
    throw new ValidationError("Invalid request.", [
      { path: "authContext", message: "Auth context is required." },
    ]);
  }

  if (
    input.conversation.organizationId !== auth.organizationId ||
    input.conversation.workspaceId !== auth.workspaceId
  ) {
    throw new ValidationError("Invalid request.", [
      { path: "conversation", message: "Conversation is outside workspace." },
    ]);
  }

  if (
    input.customer &&
    (input.customer.organizationId !== auth.organizationId ||
      input.customer.workspaceId !== auth.workspaceId)
  ) {
    throw new ValidationError("Invalid request.", [
      { path: "customer", message: "Customer is outside workspace." },
    ]);
  }
}

export function buildSafeAiContext(
  input: AiContextBuilderInput,
): SafeAiContext {
  assertSameWorkspace(input);

  const auth = input.authContext!;
  const budgeted = applyAiContextBudget({
    messages: input.recentMessages,
    snippets: input.optionalKnowledgeSnippets ?? [],
  });
  const customerNotes = sanitizeAiPlainText(
    input.customer?.notesSummary ?? null,
    1200,
  );

  return {
    policyVersion: "p7-ai-context-v1",
    workspaceId: auth.workspaceId,
    userId: auth.userId,
    taskType: input.taskType,
    conversationId: input.conversation.id,
    customerId: input.conversation.customerId ?? input.customer?.id ?? null,
    channel: sanitizeAiPlainText(input.conversation.source, 80),
    customerDisplayName: input.customer?.displayName
      ? sanitizeAiPlainText(input.customer.displayName, 120)
      : null,
    recentMessages: budgeted.messages.map((message) => ({
      id: message.id,
      direction: sanitizeAiPlainText(message.direction, 40),
      senderType: sanitizeAiPlainText(message.senderType, 40),
      body: message.body,
      sentAt: message.sentAt ?? null,
    })),
    safeChannelStatus: {
      provider: input.channelHealth?.provider
        ? sanitizeAiPlainText(input.channelHealth.provider, 80)
        : null,
      status: input.channelHealth?.status
        ? sanitizeAiPlainText(input.channelHealth.status, 80)
        : null,
      reasonCode: input.channelHealth?.reasonCode
        ? sanitizeAiPlainText(input.channelHealth.reasonCode, 80)
        : null,
    },
    customerNotes: customerNotes || null,
    knowledgeSnippets: budgeted.snippets,
    untrustedContent: [
      ...budgeted.messages.map((message) =>
        toUntrustedContentBlock({
          kind: "customer_message",
          text: message.body,
        }),
      ),
      ...budgeted.snippets.map((snippet) =>
        toUntrustedContentBlock({
          kind: "knowledge_snippet",
          text: snippet,
        }),
      ),
      ...(customerNotes
        ? [
            toUntrustedContentBlock({
              kind: "customer_note" as const,
              text: customerNotes,
            }),
          ]
        : []),
    ],
    contextBudgetSummary: budgeted.summary,
  };
}
