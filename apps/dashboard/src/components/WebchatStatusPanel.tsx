import type { WebchatOutboundDeliveryStatus } from "../api/types";
import { WebchatDeliveryStatusBadge } from "./WebchatDeliveryStatusBadge";

type WebchatStatusPanelProps = {
  status: WebchatOutboundDeliveryStatus | null;
  loading: boolean;
  error: string | null;
};

export function WebchatStatusPanel(props: WebchatStatusPanelProps) {
  if (props.loading) {
    return (
      <aside className="gmail-outbound-status" aria-label="Webchat status">
        <p className="eyebrow">Webchat outbound</p>
        <strong>Checking delivery status...</strong>
      </aside>
    );
  }

  if (props.error) {
    return (
      <aside className="gmail-outbound-status" aria-label="Webchat status">
        <p className="eyebrow">Webchat outbound</p>
        <strong>Status unavailable.</strong>
        <p>{props.error}</p>
      </aside>
    );
  }

  if (!props.status) {
    return null;
  }

  return (
    <aside className="gmail-outbound-status" aria-label="Webchat status">
      <div className="status-row">
        <p className="eyebrow">Webchat outbound</p>
        <WebchatDeliveryStatusBadge status={props.status.status} />
      </div>
      <dl className="compact-facts">
        <div>
          <dt>Delivery</dt>
          <dd>{props.status.outbound_delivery_id}</dd>
        </div>
        <div>
          <dt>Conversation</dt>
          <dd>{props.status.conversation_id}</dd>
        </div>
        <div>
          <dt>Channel account</dt>
          <dd>{props.status.channel_account_id}</dd>
        </div>
        {props.status.reason_code ? (
          <div>
            <dt>Reason</dt>
            <dd>{props.status.reason_code}</dd>
          </div>
        ) : null}
      </dl>
    </aside>
  );
}
