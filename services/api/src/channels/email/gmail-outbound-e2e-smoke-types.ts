import type { AuthContext } from "../../auth/auth-context";

export type GmailOutboundE2ESmokeInput = {
  auth: AuthContext;
  conversationId: string;
  body: string;
  correlationId: string;
};

export type GmailOutboundE2ESmokeResult = {
  status: "sent" | "simulated" | "failed";
  provider: string;
  reply_id?: string;
  outbound_delivery_id?: string;
  provider_message_id?: string;
  reason_code?: string;
  correlation_id?: string;
};
