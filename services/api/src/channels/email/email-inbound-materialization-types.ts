import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type { GmailNormalizedInboundEmailEnvelope } from "./gmail-message-normalization-types";

export type MaterializeInboundEmailInput = {
  scope: WorkspaceScope;
  envelope: GmailNormalizedInboundEmailEnvelope;
};

export type MaterializeInboundEmailResult = {
  customerId: string;
  conversationId: string;
  activityId: string;
  alreadyProcessed: boolean;
};

export interface EmailInboundMaterializer {
  materialize(
    input: MaterializeInboundEmailInput,
  ): Promise<MaterializeInboundEmailResult>;
}
