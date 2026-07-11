import { describe, expect, it } from "vitest";
import {
  redactValue,
  redactPaths,
  sanitizePath,
} from "../src/logging/redaction";

describe("logging redaction", () => {
  it("defines required redaction paths for sensitive request data", () => {
    expect(redactPaths).toEqual(
      expect.arrayContaining([
        "req.headers.authorization",
        "req.headers.cookie",
        "*.token",
        "*.secret",
      ]),
    );
  });

  it("redacts secret-like fields recursively", () => {
    const result = redactValue({
      authorization: "Bearer secret-token",
      nested: {
        refresh_token: "refresh-secret",
        api_key: "api-secret",
        provider_raw_error: "raw provider body",
        raw_payload: {
          message: "raw Gmail payload",
        },
        safe: "ok",
      },
      items: [
        {
          cookie: "session=abc",
        },
      ],
    });

    expect(result).toEqual({
      authorization: "[REDACTED]",
      nested: {
        refresh_token: "[REDACTED]",
        api_key: "[REDACTED]",
        provider_raw_error: "[REDACTED]",
        raw_payload: "[REDACTED]",
        safe: "ok",
      },
      items: [
        {
          cookie: "[REDACTED]",
        },
      ],
    });
  });

  it("strips query strings from logged paths", () => {
    expect(sanitizePath("/api/v1/reply?token=abc&workspace_id=wks_1")).toBe(
      "/api/v1/reply",
    );
  });
});
