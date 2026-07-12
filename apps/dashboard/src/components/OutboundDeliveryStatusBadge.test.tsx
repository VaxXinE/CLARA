import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OutboundDeliveryStatusBadge } from "./OutboundDeliveryStatusBadge";

describe("OutboundDeliveryStatusBadge", () => {
  it("renders safe labels for known Gmail outbound statuses", () => {
    render(<OutboundDeliveryStatusBadge status="failed" />);

    expect(screen.getByText("Gmail failed")).toBeInTheDocument();
  });
});
