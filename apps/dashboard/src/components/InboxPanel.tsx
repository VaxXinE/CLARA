import type { ConversationSummary } from "../api/types";
import { ConversationSourceBadge } from "./ConversationSourceBadge";

type InboxPanelProps = {
  conversations: ConversationSummary[];
  selectedConversationId: string | null;
  statusFilter: string;
  search: string;
  loading: boolean;
  error: string | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSelectConversation: (conversationId: string) => void;
};

function formatTimestamp(value: string | null): string {
  if (!value) {
    return "No messages yet";
  }

  return new Date(value).toLocaleString();
}

export function InboxPanel(props: InboxPanelProps) {
  return (
    <aside className="panel inbox-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Inbox</p>
          <h2>Conversations</h2>
        </div>
      </div>

      <label className="field">
        <span className="field-label">Search</span>
        <input
          className="text-input"
          type="search"
          value={props.search}
          onChange={(event) => props.onSearchChange(event.target.value)}
          placeholder="Search customer or contact"
        />
      </label>

      <label className="field">
        <span className="field-label">Status</span>
        <select
          className="text-input"
          value={props.statusFilter}
          onChange={(event) => props.onStatusChange(event.target.value)}
          disabled={props.loading}
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </select>
      </label>

      {props.loading ? (
        <div className="state-card">
          <strong>Loading conversations...</strong>
          <p>Fetching workspace inbox.</p>
        </div>
      ) : null}

      {props.error ? (
        <div className="state-card is-error">
          <strong>Unable to load conversations.</strong>
          <p>{props.error}</p>
        </div>
      ) : null}

      {!props.loading && !props.error && props.conversations.length === 0 ? (
        <div className="state-card">
          <strong>No conversations yet.</strong>
          <p>Import demo data or connect your first channel to start.</p>
        </div>
      ) : null}

      <div className="conversation-list" role="list">
        {props.conversations.map((conversation) => {
          const selected = conversation.id === props.selectedConversationId;

          return (
            <button
              key={conversation.id}
              type="button"
              role="listitem"
              className={
                selected ? "conversation-row is-selected" : "conversation-row"
              }
              onClick={() => props.onSelectConversation(conversation.id)}
            >
              <div className="conversation-row-top">
                <strong>{conversation.customer.display_name}</strong>
                <span className="badge">{conversation.status}</span>
              </div>
              <p className="conversation-meta">
                <ConversationSourceBadge
                  source={conversation.source}
                  provider={conversation.provider}
                />{" "}
                · {formatTimestamp(conversation.last_message_at)}
              </p>
              <p className="conversation-snippet">
                {conversation.snippet ?? "No message preview available."}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
