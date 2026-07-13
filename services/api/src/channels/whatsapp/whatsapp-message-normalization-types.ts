import type { NormalizedWhatsappInboundMessage } from "./whatsapp-webhook-types";

export type WhatsappMessageNormalizationResult = {
  phoneNumberId: string;
  message: NormalizedWhatsappInboundMessage;
};
