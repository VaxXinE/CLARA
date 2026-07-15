import { describe, expect, it, vi } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { buildSafeAiContext } from "../src/ai/ai-context-builder";

describe("P7 AI context security regression", () => {
  it("does not expose secrets/raw payload fields and does not call an LLM provider", () => {
    const llmProvider = vi.fn();
    const context = buildSafeAiContext({
      authContext: buildAuthContext({
        userId: "usr_1",
        organizationId: "org_1",
        workspaceId: "wks_1",
        role: "owner",
      }),
      taskType: "reply_suggestion",
      conversation: {
        id: "conv_1",
        organizationId: "org_1",
        workspaceId: "wks_1",
        source: "gmail",
      },
      recentMessages: [
        {
          id: "msg_1",
          direction: "incoming",
          senderType: "customer",
          body: "<main>Need help</main>",
        },
      ],
      optionalKnowledgeSnippets: ["<b>Safe FAQ</b>"],
    });
    const serialized = JSON.stringify(context);

    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("providerCookie");
    expect(serialized).not.toContain("sessionCookie");
    expect(serialized).not.toContain("rawProviderPayload");
    expect(serialized).not.toContain("rawWebhookPayload");
    expect(serialized).not.toContain("rawDom");
    expect(serialized).not.toContain("rawHtml");
    expect(serialized).not.toContain("serviceRoleKey");
    expect(serialized).not.toContain("<main>");
    expect(serialized).not.toContain("<b>");
    expect(llmProvider).not.toHaveBeenCalled();
  });
});
