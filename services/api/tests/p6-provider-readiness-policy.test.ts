import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { channelCapabilities } from "../src/channels/channel-capabilities";
import { socialDmProviderDecisions } from "../src/channels/social/social-dm-provider-decision";

const docs = [
  "../../docs/product/CLARA-P6-PROVIDER-HARDENING-PLAN.md",
  "../../docs/product/CLARA-P6-PROVIDER-READINESS-MATRIX.md",
  "../../docs/product/CLARA-P6-OFFICIAL-CHANNEL-POLICY.md",
  "../../docs/product/CLARA-P6-EXTENSION-BRIDGE-BOUNDARY.md",
]
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");

describe("P6 provider readiness policy", () => {
  it("documents the required P6 policy artifacts", () => {
    expect(docs).toContain("Provider Readiness Matrix");
    expect(docs).toContain("Official Channel Policy");
    expect(docs).toContain("official API only");
    expect(docs).toContain("scraping blocked");
    expect(docs).toContain("Session cookie blocked");
    expect(docs).toContain("Browser automation blocked");
    expect(docs).toContain("backend authorization source of truth");
    expect(docs).toContain("Workspace scope");
  });

  it("does not classify WhatsApp, Instagram, or TikTok as fully production-ready official providers", () => {
    const whatsapp = channelCapabilities.find(
      (item) => item.provider === "whatsapp",
    );
    const instagram = socialDmProviderDecisions.find(
      (item) => item.provider === "instagram",
    );
    const tiktok = socialDmProviderDecisions.find(
      (item) => item.provider === "tiktok",
    );

    expect(docs).toContain("WhatsApp");
    expect(docs).toContain("Instagram");
    expect(docs).toContain("TikTok");
    expect(docs).toContain("production-hardening-required");
    expect(docs).toContain("planned-official-api-only");
    expect(whatsapp?.safe_notes).toContain(
      "real provider send is not implemented",
    );
    expect(instagram?.productionAvailable).toBe(false);
    expect(tiktok?.productionAvailable).toBe(false);
  });

  it("keeps Gmail and Webchat as foundation or hardening-required, not complete", () => {
    expect(docs).toContain("Gmail / Email");
    expect(docs).toContain("Webchat");
    expect(docs).toContain("production foundation exists");
    expect(docs).toContain("foundation exists");
    expect(docs).toContain("production-hardening-required");
    expect(docs).not.toContain("Gmail / Email | production-ready");
    expect(docs).not.toContain("Webchat | production-ready");
  });

  it("states extension bridge is not an official provider replacement", () => {
    expect(docs).toContain("extension bridge");
    expect(docs).toContain("not an official provider replacement");
    expect(docs).toContain("user-assisted snapshot only");
    expect(docs).toContain("active visible chat");
    expect(docs).toContain("no auto-send");
  });
});
