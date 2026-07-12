import type { WebchatOutboundDeliveryStatus } from "../api/types";

type WebchatDeliveryStatusBadgeProps = {
  status: WebchatOutboundDeliveryStatus["status"];
};

export function WebchatDeliveryStatusBadge(
  props: WebchatDeliveryStatusBadgeProps,
) {
  const label =
    props.status === "sent"
      ? "Webchat sent"
      : props.status === "simulated"
        ? "Webchat simulated"
        : props.status === "pending"
          ? "Webchat pending"
          : props.status === "skipped"
            ? "Webchat skipped"
            : "Webchat failed";

  return (
    <span className={`badge outbound-status-${props.status}`}>{label}</span>
  );
}
