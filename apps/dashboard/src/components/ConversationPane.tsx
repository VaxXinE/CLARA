import type { ConversationDetail } from "../api/types";
import { ComposerPanel } from "./ComposerPanel";

type ConversationPaneProps = {
  conversation: ConversationDetail | null;
  loading: boolean;
  error: string | null;
  composerValue: string;
  onComposerChange: (value: string) => void;
  onGenerateDraft: () => void;
  onSendReply: () => void;
  canGenerateDraft: boolean;
  canSendReply: boolean;
  isGeneratingDraft: boolean;
  isSendingReply: boolean;
  composerError: string | null;
  aiDraftLabel: string | null;
  readOnlyMessage: string | null;
};

function formatMessageTime(value: string): string {
  return new Date(value).toLocaleString();
}

function senderLabel(message: ConversationDetail["messages"][number]): string {
  if (message.sender_type === "customer") {
    return "Customer";
  }

  if (message.sender_type === "agent") {
    return "Agent";
  }

  return "System";
}

export function ConversationPane(props: ConversationPaneProps) {
  if (props.loading) {
    return (
      <section className="panel thread-panel">
        <div className="state-card">
          <strong>Loading conversation...</strong>
          <p>Fetching message history and composer context.</p>
        </div>
      </section>
    );
  }

  if (props.error) {
    return (
      <section className="panel thread-panel">
        <div className="state-card is-error">
          <strong>Conversation unavailable.</strong>
          <p>{props.error}</p>
        </div>
      </section>
    );
  }

  if (!props.conversation) {
    return (
      <section className="panel thread-panel">
        <div className="state-card">
          <strong>Select a conversation to view the message history.</strong>
          <p>The customer profile and activity timeline will appear on the right.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel thread-panel">
      <header className="panel-heading">
        <div>
          <p className="eyebrow">{props.conversation.source}</p>
          <h2>{props.conversation.customer.display_name}</h2>
        </div>
        <div className="thread-header-meta">
          <span className="badge">{props.conversation.status}</span>
          {props.conversation.assigned_user ? (
            <span className="subtle-copy">
              Assigned to {props.conversation.assigned_user.display_name}
            </span>
          ) : null}
        </div>
      </header>

      <div className="message-thread">
        {props.conversation.messages.map((message) => (
          <article
            key={message.id}
            className={
              message.direction === "outbound"
                ? "message-bubble is-outbound"
                : "message-bubble"
            }
          >
            <div className="message-meta">
              <strong>{senderLabel(message)}</strong>
              <span>{formatMessageTime(message.sent_at)}</span>
            </div>
            <p>{message.body}</p>
          </article>
        ))}
      </div>

      <ComposerPanel
        value={props.composerValue}
        onChange={props.onComposerChange}
        onGenerateDraft={props.onGenerateDraft}
        onSendReply={props.onSendReply}
        canGenerateDraft={props.canGenerateDraft}
        canSendReply={props.canSendReply}
        isGeneratingDraft={props.isGeneratingDraft}
        isSendingReply={props.isSendingReply}
        error={props.composerError}
        aiDraftLabel={props.aiDraftLabel}
        readOnlyMessage={props.readOnlyMessage}
      />
    </section>
  );
}
