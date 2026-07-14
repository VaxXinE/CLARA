import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { ActivityResponse, CustomerProfileResponse } from "../api/types";
import { CustomerSidebar } from "./CustomerSidebar";

const customer: CustomerProfileResponse["customer"] = {
  id: "cust_001",
  display_name: "Budi",
  contact_identifier: "budi@example.test",
  source: "email",
  status: "active",
  notes_summary: "Prefers concise updates.",
  last_interaction_at: "2026-01-01T00:00:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const activity: ActivityResponse["data"]["items"] = [
  {
    id: "act_001",
    type: "conversation.created",
    title: "Conversation created",
    description: "Conversation was created from a safe event.",
    actor: {
      type: "system",
      id: null,
      name: "System",
    },
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

function renderSidebar(
  overrides: Partial<Parameters<typeof CustomerSidebar>[0]> = {},
) {
  const props: Parameters<typeof CustomerSidebar>[0] = {
    customer,
    customerLoading: false,
    customerError: null,
    activity,
    activityLoading: false,
    activityError: null,
  };

  return render(<CustomerSidebar {...props} {...overrides} />);
}

describe("CustomerSidebar", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders customer intelligence and activity as safe text", () => {
    renderSidebar();

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.getByText("budi@example.test")).toBeInTheDocument();
    expect(screen.getByText("Prefers concise updates.")).toBeInTheDocument();
    expect(screen.getByText("Conversation created")).toBeInTheDocument();
    expect(
      screen.getByText("System · conversation.created"),
    ).toBeInTheDocument();
  });

  it("renders loading and error states", () => {
    const { rerender } = renderSidebar({
      customer: null,
      customerLoading: true,
      activity: [],
      activityLoading: true,
    });

    expect(screen.getByText("Loading customer...")).toBeInTheDocument();
    expect(screen.getByText("Loading activity...")).toBeInTheDocument();

    rerender(
      <CustomerSidebar
        customer={null}
        customerLoading={false}
        customerError="Customer unavailable safely."
        activity={[]}
        activityLoading={false}
        activityError="Activity unavailable safely."
      />,
    );

    expect(
      screen.getByText("Customer unavailable safely."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Activity unavailable safely."),
    ).toBeInTheDocument();
  });

  it("renders empty states", () => {
    renderSidebar({
      customer: null,
      activity: [],
    });

    expect(screen.getByText("No customer selected.")).toBeInTheDocument();
    expect(screen.getByText("No activity yet.")).toBeInTheDocument();
  });
});
