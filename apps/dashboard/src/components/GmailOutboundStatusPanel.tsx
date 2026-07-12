import type { GmailOutboundDeliveryStatus } from "../api/types";
import { OutboundDeliveryStatusBadge } from "./OutboundDeliveryStatusBadge";

type GmailOutboundStatusPanelProps = {
  status: GmailOutboundDeliveryStatus | null;
  loading: boolean;
  error: string | null;
};

export function GmailOutboundStatusPanel(props: GmailOutboundStatusPanelProps) {
  if (props.loading) {
    return (
      <aside
        className="gmail-outbound-status"
        aria-label="Gmail outbound status"
      >
        <p className="eyebrow">Gmail outbound</p>
        <strong>Checking delivery status...</strong>
      </aside>
    );
  }

  if (props.error) {
    return (
      <aside
        className="gmail-outbound-status"
        aria-label="Gmail outbound status"
      >
        <p className="eyebrow">Gmail outbound</p>
        <strong>Status unavailable.</strong>
        <p>{props.error}</p>
      </aside>
    );
  }

  if (!props.status) {
    return null;
  }

  return (
    <aside className="gmail-outbound-status" aria-label="Gmail outbound status">
      <div className="status-row">
        <p className="eyebrow">Gmail outbound</p>
        <OutboundDeliveryStatusBadge status={props.status.status} />
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
        {props.status.provider_message_id ? (
          <div>
            <dt>Provider message</dt>
            <dd>{props.status.provider_message_id}</dd>
          </div>
        ) : null}
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
