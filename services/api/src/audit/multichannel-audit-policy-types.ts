export type MultichannelAuditProvider =
  "gmail" | "email" | "webchat" | "whatsapp" | "instagram" | "tiktok";

export type MultichannelAuditMetadata = Record<
  string,
  string | number | boolean | null
>;
