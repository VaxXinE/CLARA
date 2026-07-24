import { describe, expect, it } from "vitest";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";

describe("P17 extension final AI prompt builder boundary", () => {
  it("keeps extension output as a human-reviewed companion preview", () => {
    const safeContext = buildChatGptSafeContext({
      channel: "whatsapp",
      provider: "extension",
      official_api: false,
      captured_at: "2026-07-24T00:00:00.000Z",
      snapshot_hash: "hash",
      chat_title: "Visible chat",
      source_url_origin: "https://web.example.test",
      messages: [
        {
          id: "m1",
          direction: "incoming",
          author: "Customer",
          text: "Need help",
          timestamp_label: "Today",
        },
      ],
    });

    expect(safeContext).toContain("operator assistance only");
    expect(safeContext).toContain(
      "human operator explicitly reviews and sends",
    );
    expect(safeContext).not.toMatch(
      /final prompt|system prompt|developer instruction/i,
    );
  });
});
