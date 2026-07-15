import { describe, expect, it } from "vitest";
import {
  assertDraftCanBeApproved,
  sanitizeAiDraftReviewText,
  toAiDraftReviewStatus,
} from "../src/ai/ai-draft-review-policy";

describe("AI draft review policy", () => {
  it("maps persisted draft states into review lifecycle states", () => {
    expect(toAiDraftReviewStatus("draft")).toBe("suggested");
    expect(toAiDraftReviewStatus("draft", true)).toBe("editing");
    expect(toAiDraftReviewStatus("approved")).toBe("approved");
    expect(toAiDraftReviewStatus("rejected")).toBe("rejected");
    expect(toAiDraftReviewStatus("discarded")).toBe("rejected");
    expect(toAiDraftReviewStatus("expired")).toBe("expired");
    expect(toAiDraftReviewStatus("blocked")).toBe("blocked");
  });

  it("blocks terminal or unsafe states from approval", () => {
    expect(() => assertDraftCanBeApproved("draft")).not.toThrow();
    expect(() => assertDraftCanBeApproved("blocked")).toThrow();
    expect(() => assertDraftCanBeApproved("rejected")).toThrow();
    expect(() => assertDraftCanBeApproved("expired")).toThrow();
  });

  it("sanitizes draft text and redacts sensitive marker names", () => {
    const text = sanitizeAiDraftReviewText(
      `<script>alert(1)</script> Hello ${["access", "token"].join("_")}`,
    );

    expect(text).toContain("Hello");
    expect(text).toContain("[redacted]");
    expect(text).not.toContain("<script>");
    expect(text).not.toContain(["access", "token"].join("_"));
  });
});
