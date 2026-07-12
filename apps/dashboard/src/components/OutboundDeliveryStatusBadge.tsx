import type { GmailOutboundDeliveryStatus } from "../api/types";

type OutboundDeliveryStatusBadgeProps = {
  status: GmailOutboundDeliveryStatus["status"];
};

export function OutboundDeliveryStatusBadge(
  props: OutboundDeliveryStatusBadgeProps,
) {
  const label =
    props.status === "sent"
      ? "Gmail sent"
      : props.status === "simulated"
        ? "Gmail simulated"
        : "Gmail failed";

  return (
    <span className={`badge outbound-status-${props.status}`}>{label}</span>
  );
}
