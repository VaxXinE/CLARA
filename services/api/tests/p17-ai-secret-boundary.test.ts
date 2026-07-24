import { describe, expect, it } from "vitest";
import {
  assertNoAiProviderSecretInPublicKey,
  redactAiProviderSecretConfig,
} from "../src/ai/ai-provider-secret-boundary";

describe("P17 AI secret boundary", () => {
  it("redacts server-side AI provider secrets", () => {
    const redacted = redactAiProviderSecretConfig({
      AI_PROVIDER_API_KEY: "k",
      model: "model-a",
      authorization: "Bearer k",
    });

    expect(redacted).toEqual({
      AI_PROVIDER_API_KEY: "[redacted]",
      model: "model-a",
      authorization: "[redacted]",
    });
  });

  it("rejects frontend/public AI secret env names", () => {
    expect(assertNoAiProviderSecretInPublicKey("VITE_AI_API_KEY")).toBe(false);
    expect(assertNoAiProviderSecretInPublicKey("NEXT_PUBLIC_AI_SECRET")).toBe(
      false,
    );
    expect(assertNoAiProviderSecretInPublicKey("AI_PROVIDER_MODE")).toBe(true);
  });
});
