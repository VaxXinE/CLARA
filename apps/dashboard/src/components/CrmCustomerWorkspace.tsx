import type {
  ConversationDetail,
  CustomerActionProposalResponse,
  CustomerProfileIntelligenceResponse,
  CustomerProfileResponse,
  CustomerTimelineIntelligenceResponse,
} from "../api/types";
import { CustomerActionProposalPanel } from "./CustomerActionProposalPanel";
import { CustomerProfileIntelligencePanel } from "./CustomerProfileIntelligencePanel";
import { CustomerTimelineIntelligencePanel } from "./CustomerTimelineIntelligencePanel";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";
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
  customerActionProposal: CustomerActionProposalResponse | null;
  customerActionProposalLoading: boolean;
  customerActionProposalError: string | null;
  readOnly: boolean;
};

export function CrmCustomerWorkspace(props: CrmCustomerWorkspaceProps) {
  return (
    <section
      className="crm-customer-workspace"
      aria-label="CRM and customer intelligence workspace"
    >
      <LeadWorkspacePanel
        conversation={props.conversation}
        readOnly={props.readOnly}
      />
      <CustomerWorkspacePanel customer={props.customer} />
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
    </section>
  );
}
