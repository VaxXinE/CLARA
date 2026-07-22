import type { ComponentProps } from "react";
import type {
  ConversationDetail,
  CustomerActionProposalResponse,
  CustomerFollowUpProposalResponse,
  CustomerLifecycleStatusReadinessResponse,
  CustomerOwnerAssignmentReadinessResponse,
  CustomerProfileIntelligenceResponse,
  CustomerProfileResponse,
  CustomerTimelineIntelligenceResponse,
} from "../api/types";
import { CustomerActionProposalPanel } from "./CustomerActionProposalPanel";
import { CustomerFollowUpProposalPanel } from "./CustomerFollowUpProposalPanel";
import { CustomerLifecycleStatusReadinessPanel } from "./CustomerLifecycleStatusReadinessPanel";
import { CustomerOwnerAssignmentReadinessPanel } from "./CustomerOwnerAssignmentReadinessPanel";
import { CustomerProfileIntelligencePanel } from "./CustomerProfileIntelligencePanel";
import { CustomerTimelineIntelligencePanel } from "./CustomerTimelineIntelligencePanel";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";
import { CrmActivityAuditReadinessPanel } from "./CrmActivityAuditReadinessPanel";
import { LeadWorkspacePanel } from "./LeadWorkspacePanel";

type CrmCustomerWorkspaceProps = {
  conversation: ConversationDetail | null;
  customer: CustomerProfileResponse["customer"] | null;
  customerIntelligence: CustomerProfileIntelligenceResponse | null;
  customerIntelligenceLoading: boolean;
  customerIntelligenceError: string | null;
  customerTimelineIntelligence: CustomerTimelineIntelligenceResponse | null;
  customerTimelineIntelligenceLoading: boolean;
  customerTimelineIntelligenceError: string | null;
  customerCrud?: Omit<
    ComponentProps<typeof CustomerWorkspacePanel>,
    "customer" | "readOnly"
  >;
  customerActionProposal: CustomerActionProposalResponse | null;
  customerActionProposalLoading: boolean;
  customerActionProposalError: string | null;
  customerFollowUpProposal: CustomerFollowUpProposalResponse | null;
  customerFollowUpProposalLoading: boolean;
  customerFollowUpProposalError: string | null;
  customerOwnerAssignmentReadiness: CustomerOwnerAssignmentReadinessResponse | null;
  customerOwnerAssignmentReadinessLoading: boolean;
  customerOwnerAssignmentReadinessError: string | null;
  customerLifecycleStatusReadiness: CustomerLifecycleStatusReadinessResponse | null;
  customerLifecycleStatusReadinessLoading: boolean;
  customerLifecycleStatusReadinessError: string | null;
  readOnly: boolean;
};

export function CrmCustomerWorkspace(props: CrmCustomerWorkspaceProps) {
  const customerCrud = props.customerCrud ?? {
    customers: props.customer ? [props.customer] : [],
    loading: false,
    error: null,
    successMessage: null,
    mutationError: null,
    isSaving: false,
    onSelectCustomer: () => {},
    onCreateCustomer: async () => {},
    onUpdateCustomer: async () => {},
  };

  return (
    <section
      className="crm-customer-workspace"
      aria-label="CRM and customer intelligence workspace"
    >
      <LeadWorkspacePanel
        conversation={props.conversation}
        readOnly={props.readOnly}
      />
      <CustomerWorkspacePanel
        customer={props.customer}
        readOnly={props.readOnly}
        {...customerCrud}
      />
      <CustomerProfileIntelligencePanel
        intelligence={props.customerIntelligence}
        loading={props.customerIntelligenceLoading}
        error={props.customerIntelligenceError}
      />
      <CustomerTimelineIntelligencePanel
        intelligence={props.customerTimelineIntelligence}
        loading={props.customerTimelineIntelligenceLoading}
        error={props.customerTimelineIntelligenceError}
      />
      <CustomerActionProposalPanel
        proposal={props.customerActionProposal}
        loading={props.customerActionProposalLoading}
        error={props.customerActionProposalError}
      />
      <CustomerFollowUpProposalPanel
        proposal={props.customerFollowUpProposal}
        loading={props.customerFollowUpProposalLoading}
        error={props.customerFollowUpProposalError}
      />
      <CustomerOwnerAssignmentReadinessPanel
        readiness={props.customerOwnerAssignmentReadiness}
        loading={props.customerOwnerAssignmentReadinessLoading}
        error={props.customerOwnerAssignmentReadinessError}
      />
      <CustomerLifecycleStatusReadinessPanel
        readiness={props.customerLifecycleStatusReadiness}
        loading={props.customerLifecycleStatusReadinessLoading}
        error={props.customerLifecycleStatusReadinessError}
      />
      <CrmActivityAuditReadinessPanel />
    </section>
  );
}
