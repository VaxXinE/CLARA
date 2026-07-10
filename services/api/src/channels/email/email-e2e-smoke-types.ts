import type { Role } from "../../auth/permissions";
import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type { EmailOutboundDeliveryRecord } from "./email-outbound-delivery-types";
import type { EmailReplyResult } from "./email-reply-types";

export type EmailE2ESmokeReplyInput = {
  actorUserId: string;
  actorRole: Role;
  fromEmail?: string;
  subject?: string;
  textBody: string;
  idempotencyKey?: string;
};

export type EmailE2ESmokeFailure = {
  index: number;
  code: string;
  message: string;
};

export type EmailE2ESmokeResult = {
  scope: WorkspaceScope;
  attemptedCount: number;
  persistedCount: number;
  duplicateCount: number;
  failedCount: number;
  failures: EmailE2ESmokeFailure[];
  reply: {
    actorUserId: string;
    actorRole: Role;
    conversationId: string;
    customerId: string;
    result: EmailReplyResult;
    delivery: EmailOutboundDeliveryRecord;
  };
};
