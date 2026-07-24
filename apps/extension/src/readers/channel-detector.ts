import type { DetectedChannel } from "../types/channel";

export function detectExtensionChannel(url: string): DetectedChannel {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    return { supported: false, reasonCode: "unsupported_host" };
  }

  const host = parsedUrl.hostname.toLowerCase();
  const path = parsedUrl.pathname.toLowerCase();

  if (host === "web.whatsapp.com") {
    return { supported: true, channel: "whatsapp" };
  }

  if (host === "www.instagram.com" || host === "instagram.com") {
    return path.startsWith("/direct")
      ? { supported: true, channel: "instagram" }
      : { supported: false, reasonCode: "unsupported_context" };
  }

  if (host === "www.tiktok.com" || host === "tiktok.com") {
    return path.startsWith("/messages")
      ? { supported: true, channel: "tiktok" }
      : { supported: false, reasonCode: "unsupported_context" };
  }

  return { supported: false, reasonCode: "unsupported_host" };
}
