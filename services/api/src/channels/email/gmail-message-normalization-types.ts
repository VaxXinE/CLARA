import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type { NormalizedInboundEmailMessage } from "./email-channel-types";

export type GmailNormalizedInboundEmailEnvelope = {
  provider: "gmail";
  provider_account_id: string;
  provider_message_id: string;
  provider_thread_id: string | null;
  message_id: string | null;
  in_reply_to: string | null;
  references: string | null;
  snippet: string | null;
  label_ids: string[];
  cc: string[];
  bcc: string[];
  email: NormalizedInboundEmailMessage;
};

export type PersistGmailNormalizedInboundEmailInput = {
  scope: WorkspaceScope;
  envelope: GmailNormalizedInboundEmailEnvelope;
};

export type PersistGmailNormalizedInboundEmailResult = {
  alreadyProcessed: boolean;
};

export interface GmailNormalizedInboundEmailPersister {
  persistNormalizedEmail(
    input: PersistGmailNormalizedInboundEmailInput,
  ): Promise<PersistGmailNormalizedInboundEmailResult>;
}
