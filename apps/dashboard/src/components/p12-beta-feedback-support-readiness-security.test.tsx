import appSource from "../App.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P12 beta feedback support dashboard security", () => {
  it("does not add external support tool, ticket, notification, or unsafe render actions", () => {
    for (const pattern of [
      "createZendeskTicket",
      "createIntercomTicket",
      "createJiraIssue",
      "sendSlackMessage",
      "sendDiscordMessage",
      "sendEmailNotification",
      "webhookNotify",
      "dangerouslySetInnerHTML",
    ]) {
      expect(appSource).not.toContain(pattern);
    }
  });
});
