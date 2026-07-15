import { describe, expect, it } from "vitest";
import { classifyAiAutomationAction } from "../src/ai/ai-automation-action-classifier";

describe("AI automation action classifier", () => {
  it("allows safe preview-style actions", () => {
    expect(classifyAiAutomationAction("suggest_reply")).toEqual({
      actionType: "suggest_reply",
      category: "allowed",
    });
  });

  it("requires approval for draft-changing actions", () => {
    expect(classifyAiAutomationAction("create_draft")).toEqual({
      actionType: "create_draft",
      category: "restricted",
    });
  });

  it("blocks autonomous or sensitive actions", () => {
    expect(classifyAiAutomationAction("auto_send_email")).toEqual({
      actionType: "auto_send_email",
      category: "blocked",
    });
    expect(classifyAiAutomationAction("raw provider payload request")).toEqual({
      actionType: "raw_provider_payload_request",
      category: "blocked",
    });
  });
});
