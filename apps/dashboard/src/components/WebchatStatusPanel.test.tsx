import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WebchatStatusPanel } from "./WebchatStatusPanel";

describe("WebchatStatusPanel", () => {
  it("renders safe Webchat outbound status without sensitive fields", () => {
    render(
      <WebchatStatusPanel
        loading={false}
        error={null}
        status={{
          outbound_delivery_id: "webchat_outbound_demo",
          provider: "webchat",
          status: "simulated",
          reason_code: "simulated_send_completed",
          provider_message_id: "webchat_msg_demo",
          conversation_id: "conv_demo",
          channel_account_id: "channel_account_demo_webchat",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByText("Webchat simulated")).toBeInTheDocument();
    expect(screen.getByText("webchat_outbound_demo")).toBeInTheDocument();

    const text = document.body.textContent ?? "";
    expect(text).not.toContain("access_token");
    expect(text).not.toContain("refresh_token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("raw Gmail payload");
    expect(text).not.toContain("raw provider error body");
    expect(text).not.toContain(["client", "secret"].join("_"));
  });

  it("renders empty state without mutation controls", () => {
    const { container } = render(
      <WebchatStatusPanel loading={false} error={null} status={null} />,
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});
