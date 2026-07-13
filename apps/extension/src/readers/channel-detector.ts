import type { DetectedChannel } from "../types/channel";

export function detectExtensionChannel(url: string): DetectedChannel {
  const host = new URL(url).hostname.toLowerCase();

  if (host === "web.whatsapp.com")
    return { supported: true, channel: "whatsapp" };
  if (host.endsWith("instagram.com"))
    return { supported: true, channel: "instagram" };
  if (host.endsWith("tiktok.com"))
    return { supported: true, channel: "tiktok" };

  return { supported: false, reasonCode: "unsupported_host" };
}
