import type { Env } from "../../config/env";

export type WhatsappProviderConfig = {
  verifyToken: string | null;
  appSecret: string | null;
};

export function readWhatsappProviderConfig(
  env: Pick<
    Env,
    "WHATSAPP_WEBHOOK_VERIFY_TOKEN" | "WHATSAPP_WEBHOOK_APP_SECRET"
  >,
): WhatsappProviderConfig {
  return {
    verifyToken: env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ?? null,
    appSecret: env.WHATSAPP_WEBHOOK_APP_SECRET ?? null,
  };
}
