import type { ConversationDetail } from "../api/types";

type LeadWorkspacePanelProps = {
  conversation: ConversationDetail | null;
  readOnly: boolean;
};

function valueOrPlaceholder(
  value: string | null | undefined,
  fallback: string,
) {
  return value && value.trim().length > 0 ? value : fallback;
}

export function LeadWorkspacePanel(props: LeadWorkspacePanelProps) {
  const stage = props.conversation
    ? props.conversation.status
    : "No active lead";
  const owner = props.conversation?.assigned_user?.display_name ?? "Unassigned";
  const nextFollowUp = props.conversation
    ? "Planned follow-up placeholder"
    : "Select a conversation first";
  const priority = props.conversation ? "Normal priority" : "Not scored";
  const activityReadiness = props.conversation
    ? "Conversation context available"
    : "Waiting for conversation context";

  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="CRM leads preview"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">CRM / Leads</p>
          <h2>Lead workspace preview</h2>
        </div>
        <span className="badge">planned route</span>
      </div>

      <dl className="crm-facts-grid">
        <div>
          <dt>Stage</dt>
          <dd>{valueOrPlaceholder(stage, "No active lead")}</dd>
        </div>
        <div>
          <dt>Owner / PIC</dt>
          <dd>{owner}</dd>
        </div>
        <div>
          <dt>Next follow-up</dt>
          <dd>{nextFollowUp}</dd>
        </div>
        <div>
          <dt>Priority</dt>
          <dd>{priority}</dd>
        </div>
        <div>
          <dt>Activity readiness</dt>
          <dd>{activityReadiness}</dd>
        </div>
      </dl>

      <div className="state-card">
        <strong>Pipeline placeholder</strong>
        <p>
          Full CRM pipeline, assignment changes, and follow-up actions are not
          enabled in this skeleton.
        </p>
      </div>

      {props.readOnly ? (
        <p className="helper-copy">
          Viewer mode is read-only. Future CRM write actions must stay disabled
          until backend permissions allow them.
        </p>
      ) : null}
    </section>
  );
}
