import { describe, expect, it } from "vitest";
import { ClaraSession } from "../auth/clara-session";
import { buildAutoSyncStatusPanel } from "../components/AutoSyncStatusPanel";
import { extensionBackground } from "../background";

describe("extension auto-sync security", () => {
  it("does not allow provider session domains as Clara auth origins", () => {
    const session = new ClaraSession({
      config: { claraAllowedOrigins: ["https://clara.example.test"] },
    });

    expect(session.isAllowedClaraOrigin("https://clara.example.test")).toBe(
      true,
    );
    expect(session.isAllowedClaraOrigin("https://web.whatsapp.com")).toBe(
      false,
    );
    expect(session.isAllowedClaraOrigin("https://www.instagram.com")).toBe(
      false,
    );
    expect(session.isAllowedClaraOrigin("https://www.tiktok.com")).toBe(false);
    expect(session.isAllowedClaraOrigin("https://chat.openai.com")).toBe(false);
  });

  it("keeps status visible and has no unsafe HTML or send automation path", () => {
    const panel = buildAutoSyncStatusPanel({
      channel: "whatsapp",
      chatTitle: "Budi",
      status: {
        enabled: true,
        lastStatus: "synced",
        lastSyncAt: "2026-07-13T00:00:00.000Z",
        messageCount: 2,
      },
    });

    expect(panel).toContain("Auto-sync: ON");
    expect(panel).not.toContain(["dangerously", "SetInnerHTML"].join(""));
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
  });
});
