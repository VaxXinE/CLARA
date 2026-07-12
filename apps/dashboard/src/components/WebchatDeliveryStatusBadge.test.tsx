import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WebchatDeliveryStatusBadge } from "./WebchatDeliveryStatusBadge";

describe("WebchatDeliveryStatusBadge", () => {
  it("renders known Webchat delivery states", () => {
    const { rerender } = render(
      <WebchatDeliveryStatusBadge status="simulated" />,
    );

    expect(screen.getByText("Webchat simulated")).toBeInTheDocument();

    rerender(<WebchatDeliveryStatusBadge status="failed" />);

    expect(screen.getByText("Webchat failed")).toBeInTheDocument();
  });
});
