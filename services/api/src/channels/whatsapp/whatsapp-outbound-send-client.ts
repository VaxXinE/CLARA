import type {
  WhatsappOutboundSendCommand,
  WhatsappOutboundSendResult,
} from "./whatsapp-outbound-send-types";

export interface WhatsappOutboundSendClient {
  send(
    command: WhatsappOutboundSendCommand,
  ): Promise<WhatsappOutboundSendResult>;
}
