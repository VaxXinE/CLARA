import type { ComponentProps } from "react";
import { ActionInsightAdminWorkspace } from "./ActionInsightAdminWorkspace";
import { ConversationPane } from "./ConversationPane";
import { CrmCustomerWorkspace } from "./CrmCustomerWorkspace";
import { CustomerSidebar } from "./CustomerSidebar";
import { ChannelHealthPanel } from "./ChannelHealthPanel";
import { GmailSchedulerStatusPanel } from "./GmailSchedulerStatusPanel";
import { InboxPanel } from "./InboxPanel";

type ConversationWorkspaceProps = {
  scheduler: ComponentProps<typeof GmailSchedulerStatusPanel>;
  channelHealth?: ComponentProps<typeof ChannelHealthPanel>;
  inbox: ComponentProps<typeof InboxPanel>;
  conversation: ComponentProps<typeof ConversationPane>;
  customer: ComponentProps<typeof CustomerSidebar>;
  admin?: Omit<ComponentProps<typeof ActionInsightAdminWorkspace>, "readOnly">;
};

export function ConversationWorkspace(props: ConversationWorkspaceProps) {
  const readOnly =
    !props.conversation.canGenerateDraft && !props.conversation.canSendReply;

  return (
    <section
      className="conversation-workspace"
      aria-label="Conversation workspace"
    >
      <div className="workspace-status-strip">
        <GmailSchedulerStatusPanel {...props.scheduler} />
        <ChannelHealthPanel
          items={props.channelHealth?.items ?? []}
          loading={props.channelHealth?.loading ?? false}
          error={props.channelHealth?.error ?? null}
        />
      </div>

      <div className="workspace-queue-column" aria-label="Queue inbox">
        <InboxPanel {...props.inbox} />
      </div>

      <div
        className="workspace-conversation-column"
        aria-label="Active conversation"
      >
        <ConversationPane {...props.conversation} />
      </div>

      <div className="workspace-customer-column" aria-label="Customer context">
        <CustomerSidebar {...props.customer} />
      </div>

      <div className="workspace-crm-column">
        <CrmCustomerWorkspace
          conversation={props.conversation.conversation}
          customer={props.customer.customer}
          readOnly={readOnly}
        />
      </div>

      <div className="workspace-action-column">
        <ActionInsightAdminWorkspace readOnly={readOnly} {...props.admin} />
      </div>
    </section>
  );
}
