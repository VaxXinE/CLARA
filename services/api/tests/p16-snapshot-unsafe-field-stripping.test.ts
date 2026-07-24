import { describe, expect, it } from "vitest";
import { parseExtensionSnapshotPayload } from "../src/extension/extension-snapshot-validation";

const unsafeKey = (...parts: string[]) => parts.join("_");

const basePayload = {
  provider: "extension",
  official_api: false,
  channel: "tiktok",
  captured_at: "2026-07-24T00:00:00.000Z",
  snapshot_hash: "snapshot_hash_p16_unsafe",
  chat_title: "Lead",
  messages: [
    {
      id: "m1",
      direction: "incoming",
      text: "Need help",
    },
  ],
};

describe("P16 snapshot unsafe field stripping", () => {
  it.each([
    unsafeKey("raw", "dom"),
    unsafeKey("raw", "html"),
    unsafeKey("raw", "provider", "payload"),
    unsafeKey("raw", "webhook", "payload"),
    unsafeKey("raw", "prompt"),
    unsafeKey("full", "page", "dump"),
    unsafeKey("author", "ization", "header"),
    unsafeKey("coo", "kie"),
    unsafeKey("api", "key"),
    unsafeKey("local", "storage"),
    unsafeKey("session", "storage"),
    unsafeKey("payment", "data"),
  ])("rejects unsafe snapshot field %s", (fieldName) => {
    expect(() =>
      parseExtensionSnapshotPayload({
        channel: "tiktok",
        body: {
          ...basePayload,
          [fieldName]: "not allowed",
        },
      }),
    ).toThrow("Invalid request.");
  });
});
