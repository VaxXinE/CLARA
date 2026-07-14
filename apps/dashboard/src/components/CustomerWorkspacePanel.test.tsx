import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CustomerProfileResponse } from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";

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

describe("CustomerWorkspacePanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders customer intelligence skeleton fields safely", () => {
    render(<CustomerWorkspacePanel customer={customer} />);

    expect(screen.getByText("Customer workspace preview")).toBeInTheDocument();
    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.getByText("Active account")).toBeInTheDocument();
    expect(screen.getByText("Warm")).toBeInTheDocument();
    expect(screen.getByText("email · budi@example.test")).toBeInTheDocument();
    expect(screen.getByText("Merge candidate placeholder")).toBeInTheDocument();
  });

  it("handles missing customer data without unsafe mutation controls", () => {
    render(<CustomerWorkspacePanel customer={null} />);

    expect(screen.getByText("No customer selected")).toBeInTheDocument();
    expect(screen.getByText("Uncategorized")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.getByText("No channel context")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
