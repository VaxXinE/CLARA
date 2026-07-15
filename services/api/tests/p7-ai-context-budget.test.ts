import { describe, expect, it } from "vitest";
import { applyAiContextBudget } from "../src/ai/ai-context-budget";

describe("P7 AI context budget", () => {
  it("keeps newest bounded messages and truncates long content", () => {
    const result = applyAiContextBudget({
      messages: Array.from({ length: 4 }, (_, index) => ({
        id: `msg_${index}`,
        direction: "incoming",
        senderType: "customer",
        body: "x".repeat(20),
      })),
      snippets: ["y".repeat(20)],
      budget: {
        maxMessages: 2,
        maxMessageChars: 5,
        maxSnippetChars: 6,
      },
    });

    expect(result.messages.map((message) => message.id)).toEqual([
      "msg_2",
      "msg_3",
    ]);
    expect(result.messages[0]?.body).toBe("xxxxx");
    expect(result.snippets).toEqual(["yyyyyy"]);
    expect(result.summary.truncatedMessages).toBe(2);
  });
});
