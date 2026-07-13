import { describe, expect, it } from "vitest";
import { ExtensionSnapshotMaterializationService } from "../src/extension/extension-snapshot-materialization-service";
import { ExtensionSnapshotPersistenceService } from "../src/extension/extension-snapshot-persistence-service";

describe("ExtensionSnapshotMaterializationService", () => {
  it("uses the persistence implementation as the materialization boundary", () => {
    expect(ExtensionSnapshotMaterializationService).toBe(
      ExtensionSnapshotPersistenceService,
    );
  });
});
