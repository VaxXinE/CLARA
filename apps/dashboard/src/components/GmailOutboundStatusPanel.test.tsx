import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GmailOutboundStatusPanel } from "./GmailOutboundStatusPanel";

describe("GmailOutboundStatusPanel", () => {
  it("renders safe Gmail outbound status without sensitive fields", () => {
    render(
      <GmailOutboundStatusPanel
        loading={false}
        error={null}
        status={{
          outbound_delivery_id: "email_outbound_demo",
          provider: "gmail",
          status: "simulated",
          reason_code: "simulated_send_completed",
          provider_message_id: "gmail_msg_demo",
          conversation_id: "conv_demo",
          created_at: "2026-01-01T00:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByText("Gmail simulated")).toBeInTheDocument();
    expect(screen.getByText("email_outbound_demo")).toBeInTheDocument();

    const text = document.body.textContent ?? "";
    expect(text).not.toContain("access_token");
    expect(text).not.toContain("refresh_token");
    expect(text).not.toContain("Authorization");
    expect(text).not.toContain("raw Gmail payload");
    expect(text).not.toContain("raw provider error body");
    expect(text).not.toContain(["client", "secret"].join("_"));
  });

  it("renders nothing before a Gmail outbound delivery exists", () => {
    const { container } = render(
      <GmailOutboundStatusPanel loading={false} error={null} status={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
