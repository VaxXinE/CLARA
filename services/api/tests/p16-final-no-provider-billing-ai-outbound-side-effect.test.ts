import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const extensionRoute = readFileSync(
  join(process.cwd(), "src/http/routes/extension.ts"),
  "utf8",
);
const persistenceService = readFileSync(
  join(
    process.cwd(),
    "src/extension/extension-snapshot-persistence-service.ts",
  ),
  "utf8",
);
const source = `${extensionRoute}\n${persistenceService}`;

describe("P16 final no provider billing AI outbound side effect", () => {
  it("keeps snapshot ingestion free of official provider, billing, AI, and outbound activation", () => {
    expect(source).not.toMatch(/gmail|openai|anthropic|stripe|checkout/i);
    expect(source).not.toMatch(/sendEmail|sendSlack|sendDiscord|autoSend/);
    expect(source).toContain("parseExtensionSnapshotPayload");
    expect(source).toContain("ExtensionSnapshotPersistenceService");
  });
});
