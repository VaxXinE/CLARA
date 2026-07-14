import type { CustomerProfileResponse } from "../api/types";

type CustomerWorkspacePanelProps = {
  customer: CustomerProfileResponse["customer"] | null;
};

function summarizeSource(customer: CustomerProfileResponse["customer"] | null) {
  if (!customer) {
    return "No channel context";
  }

  return customer.contact_identifier
    ? `${customer.source} · ${customer.contact_identifier}`
    : customer.source;
}

export function CustomerWorkspacePanel(props: CustomerWorkspacePanelProps) {
  const category = props.customer ? "Active account" : "Uncategorized";
  const temperature = props.customer ? "Warm" : "Unknown";
  const completeness = props.customer?.notes_summary
    ? "Profile has notes"
    : "Profile needs enrichment";

  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Customer intelligence preview"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Customer Intelligence</p>
          <h2>Customer workspace preview</h2>
        </div>
        <span className="badge">planned route</span>
      </div>

      <dl className="crm-facts-grid">
        <div>
          <dt>Customer</dt>
          <dd>{props.customer?.display_name ?? "No customer selected"}</dd>
        </div>
        <div>
          <dt>Account category</dt>
          <dd>{category}</dd>
        </div>
        <div>
          <dt>Temperature</dt>
          <dd>{temperature}</dd>
        </div>
        <div>
          <dt>Channel summary</dt>
          <dd>{summarizeSource(props.customer)}</dd>
        </div>
        <div>
          <dt>Profile completeness</dt>
          <dd>{completeness}</dd>
        </div>
      </dl>

      <div className="state-card">
        <strong>Merge candidate placeholder</strong>
        <p>
          Customer merge, enrichment, and category edits are disabled until
          dedicated backend authorization exists.
        </p>
      </div>
    </section>
  );
}
