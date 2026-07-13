export const extensionChannels = ["whatsapp", "instagram", "tiktok"] as const;

export type ExtensionChannel = (typeof extensionChannels)[number];

export type DetectedChannel =
  | { supported: true; channel: ExtensionChannel }
  | { supported: false; reasonCode: "unsupported_host" };
