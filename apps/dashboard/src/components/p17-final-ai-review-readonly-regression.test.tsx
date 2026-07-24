import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import componentSource from "./ExtensionSnapshotAiAnalysisReviewPanel.tsx?raw";
import { ExtensionSnapshotAiAnalysisReviewPanel } from "./ExtensionSnapshotAiAnalysisReviewPanel";

describe("P17 final AI review readonly regression", () => {
  it("keeps viewer/read-only mode non-mutating and avoids unsafe HTML rendering", () => {
    render(
      <ExtensionSnapshotAiAnalysisReviewPanel
        loading={false}
        error={null}
        readOnly
        analysis={null}
      />,
    );
    expect(screen.getByText("Read-only")).toBeTruthy();
    expect(componentSource).not.toContain("dangerouslySetInnerHTML");
    expect(componentSource).not.toMatch(/onClick=.*send|autoSend/i);
  });
});
