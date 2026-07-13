import { createHash } from "node:crypto";
import type { WhatsappOutboundSendClient } from "./whatsapp-outbound-send-client";
import type {
  WhatsappOutboundSendCommand,
  WhatsappOutboundSendResult,
} from "./whatsapp-outbound-send-types";

function stableId(input: WhatsappOutboundSendCommand): string {
  return createHash("sha256")
    .update(
      [
        input.scope.organizationId,
        input.scope.workspaceId,
        input.channelAccountId,
        input.conversationId,
        input.recipientExternalId,
        input.correlationId,
      ].join(":"),
    )
    .digest("hex")
    .slice(0, 24);
}

export class SimulatedWhatsappOutboundSendClient implements WhatsappOutboundSendClient {
  async send(
    command: WhatsappOutboundSendCommand,
  ): Promise<WhatsappOutboundSendResult> {
    return {
      status: "simulated",
      providerMessageId: `wamid_sim_${stableId(command)}`,
      sentAt: new Date("2026-07-13T00:00:00.000Z"),
      reasonCode: "simulated_send_completed",
    };
  }
}
