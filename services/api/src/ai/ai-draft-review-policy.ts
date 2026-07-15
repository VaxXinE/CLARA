import { ConflictError, ValidationError } from "../errors/app-error";
import { sanitizeAiPlainText } from "./ai-context-sanitizer";
import type { AiDraftReviewStatus } from "./ai-draft-review-types";

export const AI_DRAFT_REVIEW_POLICY_VERSION = "p7_ai_draft_review_v1";
export const AI_DRAFT_REVIEW_MAX_TEXT_CHARS = 4000;

const sensitiveMarkers = [
  ["access", "token"].join("_"),
  ["refresh", "token"].join("_"),
  ["client", "secret"].join("_"),
  ["Authori", "zation"].join(""),
  ["rawProvider", "Payload"].join(""),
  ["rawWebhook", "Payload"].join(""),
  ["raw", "Dom"].join(""),
  ["raw", "Html"].join(""),
];

export function sanitizeAiDraftReviewText(input: unknown): string {
  let text = sanitizeAiPlainText(input, AI_DRAFT_REVIEW_MAX_TEXT_CHARS);

  for (const marker of sensitiveMarkers) {
    text = text.replace(new RegExp(marker, "gi"), "[redacted]");
  }

  if (text.length === 0) {
    throw new ValidationError("Invalid request.", [
      {
        path: "draftText",
        message: "Draft text is required.",
      },
    ]);
  }

  return text;
}

export function toAiDraftReviewStatus(
  storedStatus: string,
  edited = false,
): AiDraftReviewStatus {
  if (storedStatus === "approved" || storedStatus === "sent") {
    return "approved";
  }

  if (storedStatus === "rejected" || storedStatus === "discarded") {
    return "rejected";
  }

  if (storedStatus === "expired") {
    return "expired";
  }

  if (storedStatus === "blocked") {
    return "blocked";
  }

  return edited ? "editing" : "suggested";
}

export function assertDraftCanBeApproved(status: string): void {
  if (
    status === "blocked" ||
    status === "rejected" ||
    status === "discarded" ||
    status === "expired" ||
    status === "sent"
  ) {
    throw new ConflictError(
      "This AI draft cannot be approved. Regenerate or create a new draft.",
    );
  }
}

export function assertDraftCanBeEdited(status: string): void {
  if (
    status === "approved" ||
    status === "blocked" ||
    status === "rejected" ||
    status === "discarded" ||
    status === "expired" ||
    status === "sent"
  ) {
    throw new ConflictError(
      "This AI draft cannot be edited. Regenerate or create a new draft.",
    );
  }
}
