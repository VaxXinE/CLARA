import { describe, expect, it } from "vitest";
import {
  extensionBridgeAutomationLevel,
  extensionBridgeChannels,
  extensionBridgeLimits,
  extensionBridgeOfficialApi,
  extensionBridgeProvider,
  extensionBridgeRoutes,
  extensionBridgeSendMode,
  isExtensionBridgeChannel,
} from "../src/extension/extension-bridge-contract";

describe("Extension Bridge contract", () => {
  it("defines the P4.5 provider positioning and route contracts", () => {
    expect(extensionBridgeProvider).toBe("extension");
    expect(extensionBridgeOfficialApi).toBe(false);
    expect(extensionBridgeAutomationLevel).toBe(
      "active_conversation_auto_sync",
    );
    expect(extensionBridgeSendMode).toBe("manual_assisted");
    expect(extensionBridgeChannels).toEqual([
      "whatsapp",
      "instagram",
      "tiktok",
    ]);
    expect(extensionBridgeRoutes).toEqual({
      snapshots: "/api/v1/extension/:channel/snapshots",
      replySuggestions: "/api/v1/extension/:channel/reply-suggestions",
      manualSendConfirmations:
        "/api/v1/extension/:channel/manual-send-confirmations",
    });
  });

  it("keeps channel allowlisting and snapshot bounds explicit", () => {
    expect(isExtensionBridgeChannel("whatsapp")).toBe(true);
    expect(isExtensionBridgeChannel("instagram")).toBe(true);
    expect(isExtensionBridgeChannel("tiktok")).toBe(true);
    expect(isExtensionBridgeChannel("gmail")).toBe(false);
    expect(extensionBridgeLimits.maxMessagesPerSnapshot).toBeLessThanOrEqual(
      50,
    );
    expect(extensionBridgeLimits.maxMessageTextLength).toBeLessThanOrEqual(
      4_000,
    );
    expect(extensionBridgeLimits.minSnapshotHashLength).toBeGreaterThan(0);
  });
});
