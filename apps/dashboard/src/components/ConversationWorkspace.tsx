import type { ComponentProps } from "react";
import { ActionInsightAdminWorkspace } from "./ActionInsightAdminWorkspace";
import { ConversationPane } from "./ConversationPane";
import { CrmCustomerWorkspace } from "./CrmCustomerWorkspace";
import { CustomerSidebar } from "./CustomerSidebar";
import { ChannelHealthPanel } from "./ChannelHealthPanel";
import { GmailSchedulerStatusPanel } from "./GmailSchedulerStatusPanel";
import { AuditRetentionReadinessPanel } from "./AuditRetentionReadinessPanel";
import { DataClassificationReadinessPanel } from "./DataClassificationReadinessPanel";
import { EnterpriseComplianceReadinessPanel } from "./EnterpriseComplianceReadinessPanel";
import { PermissionAuditReadinessPanel } from "./PermissionAuditReadinessPanel";
import { RedactionHardeningReadinessPanel } from "./RedactionHardeningReadinessPanel";
import { TenantIsolationReadinessPanel } from "./TenantIsolationReadinessPanel";
import { AiAutomationGuardrailsPanel } from "./AiAutomationGuardrailsPanel";
import { InboxPanel } from "./InboxPanel";

type ConversationWorkspaceProps = {
  scheduler: ComponentProps<typeof GmailSchedulerStatusPanel>;
  tenantIsolation?: ComponentProps<typeof TenantIsolationReadinessPanel>;
  permissionAudit?: ComponentProps<typeof PermissionAuditReadinessPanel>;
  auditRetention?: ComponentProps<typeof AuditRetentionReadinessPanel>;
  dataClassification?: ComponentProps<typeof DataClassificationReadinessPanel>;
  redactionHardening?: ComponentProps<typeof RedactionHardeningReadinessPanel>;
  enterpriseCompliance?: ComponentProps<
    typeof EnterpriseComplianceReadinessPanel
  >;
  channelHealth?: ComponentProps<typeof ChannelHealthPanel>;
  inbox: ComponentProps<typeof InboxPanel>;
  conversation: ComponentProps<typeof ConversationPane>;
  customer: ComponentProps<typeof CustomerSidebar>;
  customerIntelligence: Omit<
    ComponentProps<typeof CrmCustomerWorkspace>,
    "conversation" | "customer" | "readOnly"
  >;
  automationGuardrails?: ComponentProps<typeof AiAutomationGuardrailsPanel>;
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
        <TenantIsolationReadinessPanel
          readiness={props.tenantIsolation?.readiness ?? null}
          loading={props.tenantIsolation?.loading ?? false}
          error={props.tenantIsolation?.error ?? null}
        />
        <PermissionAuditReadinessPanel
          readiness={props.permissionAudit?.readiness ?? null}
          loading={props.permissionAudit?.loading ?? false}
          error={props.permissionAudit?.error ?? null}
        />
        <AuditRetentionReadinessPanel
          readiness={props.auditRetention?.readiness ?? null}
          loading={props.auditRetention?.loading ?? false}
          error={props.auditRetention?.error ?? null}
        />
        <DataClassificationReadinessPanel
          readiness={props.dataClassification?.readiness ?? null}
          loading={props.dataClassification?.loading ?? false}
          error={props.dataClassification?.error ?? null}
        />
        <RedactionHardeningReadinessPanel
          readiness={props.redactionHardening?.readiness ?? null}
          loading={props.redactionHardening?.loading ?? false}
          error={props.redactionHardening?.error ?? null}
        />
        <EnterpriseComplianceReadinessPanel
          adminSecurityControls={
            props.enterpriseCompliance?.adminSecurityControls ?? {
              readiness: null,
              loading: false,
              error: null,
            }
          }
          sessionPolicy={
            props.enterpriseCompliance?.sessionPolicy ?? {
              readiness: null,
              loading: false,
              error: null,
            }
          }
          complianceDashboard={
            props.enterpriseCompliance?.complianceDashboard ?? {
              readiness: null,
              loading: false,
              error: null,
            }
          }
        />
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
          {...props.customerIntelligence}
        />
      </div>

      <div className="workspace-action-column">
        <AiAutomationGuardrailsPanel
          decision={props.automationGuardrails?.decision ?? null}
          loading={props.automationGuardrails?.loading ?? false}
          error={props.automationGuardrails?.error ?? null}
          canEvaluate={props.automationGuardrails?.canEvaluate ?? false}
          onEvaluate={props.automationGuardrails?.onEvaluate ?? (() => {})}
        />
        <ActionInsightAdminWorkspace readOnly={readOnly} {...props.admin} />
      </div>
    </section>
  );
}
