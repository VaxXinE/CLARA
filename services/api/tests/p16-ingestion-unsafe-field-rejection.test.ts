import { describe, expect, it } from "vitest";
import { parseExtensionSnapshotPayload } from "../src/extension/extension-snapshot-validation";

const unsafeKey = (...parts: string[]) => parts.join("_");

function validBody() {
  return {
    provider: "extension",
    official_api: false,
    channel: "tiktok",
    captured_at: "2026-07-24T00:00:00.000Z",
    snapshot_hash: "snapshot_hash_unsafe_rejection",
    chat_title: "Lead",
    messages: [
      {
        id: "m1",
        direction: "incoming",
        text: "safe visible text",
      },
    ],
  };
}

describe("P16 ingestion unsafe field rejection", () => {
  it("rejects raw and secret-like fields before persistence", () => {
    expect(() =>
      parseExtensionSnapshotPayload({
        channel: "tiktok",
        body: {
          ...validBody(),
          [unsafeKey("raw", "html")]: "<main>unsafe</main>",
        },
      }),
    ).toThrow("Invalid request.");

    expect(() =>
      parseExtensionSnapshotPayload({
        channel: "tiktok",
        body: {
          ...validBody(),
          messages: [
            {
              id: "m1",
              direction: "incoming",
              text: "safe visible text",
              [unsafeKey("client", "se", "cret")]: "csk",
            },
          ],
        },
      }),
    ).toThrow("Invalid request.");
  });
});
