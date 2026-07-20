import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = [
  "../src/enterprise/backup-restore-readiness-service.ts",
  "../src/enterprise/incident-response-readiness-service.ts",
  "../src/enterprise/evidence-readiness-service.ts",
  "../src/enterprise/operational-resilience-summary.ts",
]
  .map((path) => readFileSync(new URL(path, import.meta.url), "utf8"))
  .join("\n");

describe("P10 final enterprise no-automation regression", () => {
  it("does not execute backup, restore, deletion, legal hold, incident, escalation, notification, report, or workflow automation", () => {
    for (const pattern of [
      "executeBackup(",
      "runBackup(",
      "executeRestore(",
      "runRestore(",
      "deleteData(",
      "applyLegalHold(",
      "createIncident(",
      "escalateIncident(",
      "sendNotification(",
      "generateReport(",
      "executeWorkflow(",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
