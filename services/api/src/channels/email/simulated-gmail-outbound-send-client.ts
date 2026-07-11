import { randomUUID } from "node:crypto";
import type {
  GmailOutboundSendClient,
  GmailOutboundSendClientCommand,
  GmailOutboundSendClientResult,
} from "./gmail-outbound-send-client-types";

export class SimulatedGmailOutboundSendClient implements GmailOutboundSendClient {
  async send(
    _command: GmailOutboundSendClientCommand,
  ): Promise<GmailOutboundSendClientResult> {
    return {
      status: "simulated",
      providerMessageId: `gmail_msg_${randomUUID()}`,
      sentAt: new Date(),
    };
  }
}
