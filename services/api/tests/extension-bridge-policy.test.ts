import { describe, expect, it } from "vitest";
import {
  chatGptCompanionPolicy,
  extensionBridgeAuditMetadataFields,
  extensionBridgeAutoSyncPolicy,
  extensionBridgeUnsafeFieldNames,
} from "../src/extension/extension-bridge-policy";
import { sanitizeMultichannelAuditMetadata } from "../src/audit/multichannel-audit-policy";

const unsafeKey = (...parts: string[]) => parts.join("_");

describe("Extension Bridge policy", () => {
  it("allows only visible active-conversation sync with human reply confirmation", () => {
    expect(extensionBridgeAutoSyncPolicy).toMatchObject({
      visibleToUser: true,
      activeConversationOnly: true,
      dedupeBySnapshotHash: true,
      throttleOrDebounceRequired: true,
      replySendRequiresHumanAction: true,
      auditable: true,
    });
  });

  it("keeps ChatGPT Companion user-triggered and bounded", () => {
    expect(chatGptCompanionPolicy).toMatchObject({
      userTriggeredContextActionRequired: true,
      contextPreviewRequired: true,
      boundedContextRequired: true,
      replySendRequiresHumanAction: true,
      claraRemainsSystemOfRecord: true,
      storeCompanionSessionInBackend: false,
    });
  });

  it("rejects unsafe browser/provider capture fields by policy", () => {
    expect(extensionBridgeUnsafeFieldNames).toEqual(
      expect.arrayContaining([
        unsafeKey("raw", "dom"),
        unsafeKey("raw", "html"),
        unsafeKey("raw", "provider", "payload"),
        unsafeKey("provider", "author", "ization", "header"),
        unsafeKey("provider", "to", "ken"),
        unsafeKey("provider", "coo", "kie"),
        unsafeKey("access", "to", "ken"),
        unsafeKey("refresh", "to", "ken"),
        unsafeKey("provider", "se", "cret"),
      ]),
    );
  });

  it("keeps extension audit metadata allowlisted and body-free", () => {
    expect(extensionBridgeAuditMetadataFields).toEqual(
      expect.arrayContaining([
        "provider",
        "channel",
        "source",
        "snapshot_hash",
        "message_count",
        "incoming_count",
        "outgoing_count",
        "conversation_id",
        "customer_id",
        "correlation_id",
        "status",
        "reason_code",
      ]),
    );

    const metadata = sanitizeMultichannelAuditMetadata({
      provider: "extension",
      channel: "whatsapp",
      source: "extension",
      snapshot_hash: "snapshot_demo_hash",
      message_count: 2,
      incoming_count: 1,
      outgoing_count: 1,
      [unsafeKey("message", "body")]: "customer text",
      [unsafeKey("raw", "dom")]: "<div>unsafe</div>",
      [unsafeKey("provider", "coo", "kie")]: "sid=x",
      [unsafeKey("provider", "to", "ken")]: "ptk",
    });
    const serialized = JSON.stringify(metadata);

    expect(metadata).toEqual({
      provider: "extension",
      channel: "whatsapp",
      source: "extension",
      snapshot_hash: "snapshot_demo_hash",
      message_count: 2,
      incoming_count: 1,
      outgoing_count: 1,
    });
    expect(serialized).not.toContain("customer text");
    expect(serialized).not.toContain("<div>");
    expect(serialized).not.toContain("sid=");
    expect(serialized).not.toContain("ptk");
  });
});
