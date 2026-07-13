export type MultichannelAuditProvider =
  | "gmail"
  | "email"
  | "webchat"
  | "whatsapp"
  | "instagram"
  | "tiktok"
  | "extension";

export type MultichannelAuditMetadata = Record<
  string,
  string | number | boolean | null
>;
