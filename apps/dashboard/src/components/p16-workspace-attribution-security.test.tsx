import { describe, expect, it } from "vitest";
import rootReadme from "../../../../README.md?raw";

describe("P16 workspace attribution dashboard security", () => {
  it("states that client workspace identity is not the authorization source", () => {
    const readme = rootReadme.replace(/\s+/g, " ");

    expect(readme).toContain(
      "Client-supplied workspaceId is not authoritative.",
    );
    expect(readme).toContain(
      "AuthContext and workspace membership remain source of truth.",
    );
  });
});
