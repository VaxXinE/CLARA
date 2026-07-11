import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GmailSchedulerStatusPanel } from "./GmailSchedulerStatusPanel";

describe("GmailSchedulerStatusPanel", () => {
  it("renders disabled scheduler status safely", () => {
    render(
      <GmailSchedulerStatusPanel
        loading={false}
        error={null}
        status={{
          scheduler_enabled: false,
          scheduler_running: false,
          interval_ms: 300000,
          max_accounts_per_tick: 10,
          max_messages_per_account: 25,
          last_reason_code: "runtime_disabled",
        }}
      />,
    );

    expect(screen.getByText("Disabled")).toBeInTheDocument();
    expect(screen.getByText("Stopped")).toBeInTheDocument();
    expect(screen.getByText("runtime_disabled")).toBeInTheDocument();
  });

  it("renders enabled running status without sensitive fields", () => {
    render(
      <GmailSchedulerStatusPanel
        loading={false}
        error={null}
        status={{
          scheduler_enabled: true,
          scheduler_running: true,
          interval_ms: 120000,
          max_accounts_per_tick: 3,
          max_messages_per_account: 4,
          last_tick_status: "completed",
          last_tick_started_at: "2026-07-11T10:00:00.000Z",
          last_tick_finished_at: "2026-07-11T10:01:00.000Z",
        }}
      />,
    );

    const serialized = document.body.textContent ?? "";

    expect(screen.getByText("Enabled")).toBeInTheDocument();
    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw Gmail");
  });
});
