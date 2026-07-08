import type { ActivityResponse, CustomerProfileResponse } from "../api/types";

type CustomerSidebarProps = {
  customer: CustomerProfileResponse["customer"] | null;
  customerLoading: boolean;
  customerError: string | null;
  activity: ActivityResponse["data"]["items"];
  activityLoading: boolean;
  activityError: string | null;
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleString();
}

export function CustomerSidebar(props: CustomerSidebarProps) {
  return (
    <aside className="panel sidebar-panel">
      <section className="sidebar-section">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Customer</p>
            <h2>Profile</h2>
          </div>
        </div>

        {props.customerLoading ? (
          <div className="state-card">
            <strong>Loading customer...</strong>
            <p>Fetching sidebar context.</p>
          </div>
        ) : null}

        {props.customerError ? (
          <div className="state-card is-error">
            <strong>Customer profile unavailable.</strong>
            <p>{props.customerError}</p>
          </div>
        ) : null}

        {!props.customerLoading && !props.customerError && !props.customer ? (
          <div className="state-card">
            <strong>No customer selected.</strong>
            <p>Select a conversation to inspect customer details.</p>
          </div>
        ) : null}

        {props.customer ? (
          <dl className="profile-grid">
            <div>
              <dt>Name</dt>
              <dd>{props.customer.display_name}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{props.customer.contact_identifier ?? "Unavailable"}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>{props.customer.source}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{props.customer.status}</dd>
            </div>
            <div>
              <dt>Last interaction</dt>
              <dd>{formatDate(props.customer.last_interaction_at)}</dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>{props.customer.notes_summary ?? "Customer profile is incomplete."}</dd>
            </div>
          </dl>
        ) : null}
      </section>

      <section className="sidebar-section">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Timeline</p>
            <h2>Activity</h2>
          </div>
        </div>

        {props.activityLoading ? (
          <div className="state-card">
            <strong>Loading activity...</strong>
            <p>Fetching safe conversation timeline.</p>
          </div>
        ) : null}

        {props.activityError ? (
          <div className="state-card is-error">
            <strong>Activity unavailable.</strong>
            <p>{props.activityError}</p>
          </div>
        ) : null}

        {!props.activityLoading &&
        !props.activityError &&
        props.activity.length === 0 ? (
          <div className="state-card">
            <strong>No activity yet.</strong>
            <p>AI drafts and reply sends will appear here.</p>
          </div>
        ) : null}

        <div className="activity-list">
          {props.activity.map((item) => (
            <article key={item.id} className="activity-item">
              <div className="activity-top">
                <strong>{item.title}</strong>
                <span>{formatDate(item.created_at)}</span>
              </div>
              <p>{item.description}</p>
              <p className="activity-actor">
                {item.actor.name} · {item.type}
              </p>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}
