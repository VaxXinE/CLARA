import type {
  ConversationDetail,
  AiConversationSummaryResponse,
  AiCustomerNoteSuggestionResponse,
  AiDraftReview,
  AiFollowUpRecommendationResponse,
  GmailOutboundDeliveryStatus,
  AiReplySuggestionResponse,
  WebchatOutboundDeliveryStatus,
} from "../api/types";
import { ComposerPanel } from "./ComposerPanel";
import { ConversationSourceBadge } from "./ConversationSourceBadge";
import { GmailOutboundStatusPanel } from "./GmailOutboundStatusPanel";
import { WebchatStatusPanel } from "./WebchatStatusPanel";

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
  aiReplySuggestion?: AiReplySuggestionResponse["data"]["suggestion"] | null;
  aiFollowUpRecommendation?:
    AiFollowUpRecommendationResponse["data"]["recommendation"] | null;
  aiConversationSummary?:
    AiConversationSummaryResponse["data"]["summary"] | null;
  aiCustomerNoteSuggestion?:
    AiCustomerNoteSuggestionResponse["data"]["noteSuggestion"] | null;
  isGeneratingFollowUp?: boolean;
  isGeneratingSummary?: boolean;
  isGeneratingNoteSuggestion?: boolean;
  followUpError?: string | null;
  summaryError?: string | null;
  noteSuggestionError?: string | null;
  onGenerateFollowUp?: () => void;
  onGenerateSummary?: () => void;
  onGenerateNoteSuggestion?: () => void;
  aiDraftReview?: AiDraftReview | null;
  aiDraftReviewLoading?: boolean;
  aiDraftReviewError?: string | null;
  onEditDraftReview?: (draftText: string) => void;
  onApproveDraftReview?: () => void;
  onRejectDraftReview?: () => void;
  isGeneratingSuggestion?: boolean;
  suggestionError?: string | null;
  onGenerateSuggestion?: () => void;
  gmailOutboundStatus: GmailOutboundDeliveryStatus | null;
  gmailOutboundStatusLoading: boolean;
  gmailOutboundStatusError: string | null;
  webchatOutboundStatus: WebchatOutboundDeliveryStatus | null;
  webchatOutboundStatusLoading: boolean;
  webchatOutboundStatusError: string | null;
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
          <p>
            The customer profile and activity timeline will appear on the right.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel thread-panel">
      <header className="panel-heading">
        <div>
          <p className="eyebrow">
            <ConversationSourceBadge
              source={props.conversation.source}
              provider={props.conversation.provider}
            />
          </p>
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

      <GmailOutboundStatusPanel
        status={props.gmailOutboundStatus}
        loading={props.gmailOutboundStatusLoading}
        error={props.gmailOutboundStatusError}
      />

      <WebchatStatusPanel
        status={props.webchatOutboundStatus}
        loading={props.webchatOutboundStatusLoading}
        error={props.webchatOutboundStatusError}
      />

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
        aiReplySuggestion={props.aiReplySuggestion}
        aiFollowUpRecommendation={props.aiFollowUpRecommendation}
        aiConversationSummary={props.aiConversationSummary}
        aiCustomerNoteSuggestion={props.aiCustomerNoteSuggestion}
        isGeneratingFollowUp={props.isGeneratingFollowUp}
        isGeneratingSummary={props.isGeneratingSummary}
        isGeneratingNoteSuggestion={props.isGeneratingNoteSuggestion}
        followUpError={props.followUpError}
        summaryError={props.summaryError}
        noteSuggestionError={props.noteSuggestionError}
        onGenerateFollowUp={props.onGenerateFollowUp}
        onGenerateSummary={props.onGenerateSummary}
        onGenerateNoteSuggestion={props.onGenerateNoteSuggestion}
        aiDraftReview={props.aiDraftReview}
        aiDraftReviewLoading={props.aiDraftReviewLoading}
        aiDraftReviewError={props.aiDraftReviewError}
        onEditDraftReview={props.onEditDraftReview}
        onApproveDraftReview={props.onApproveDraftReview}
        onRejectDraftReview={props.onRejectDraftReview}
        isGeneratingSuggestion={props.isGeneratingSuggestion}
        suggestionError={props.suggestionError}
        onGenerateSuggestion={props.onGenerateSuggestion}
      />
    </section>
  );
}
