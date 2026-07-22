import appSource from "../App.tsx?raw";
import dashboardStyles from "../styles.css?raw";
import { describe, expect, it } from "vitest";

describe("P12 dashboard Beta / GA security boundary", () => {
  it("does not add unsafe rendering or launch actions to dashboard runtime", () => {
    const source = `${appSource}\n${dashboardStyles}`;

    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("redirectToCheckout");
    expect(source).not.toContain("autoSend");
    expect(source).not.toContain("runBackup");
    expect(source).not.toContain("runRestore");
  });
});
