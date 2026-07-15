import type {
  ConversationDetail,
  CustomerProfileIntelligenceResponse,
  CustomerProfileResponse,
} from "../api/types";
import { CustomerProfileIntelligencePanel } from "./CustomerProfileIntelligencePanel";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";
import { LeadWorkspacePanel } from "./LeadWorkspacePanel";

type CrmCustomerWorkspaceProps = {
  conversation: ConversationDetail | null;
  customer: CustomerProfileResponse["customer"] | null;
  customerIntelligence: CustomerProfileIntelligenceResponse | null;
  customerIntelligenceLoading: boolean;
  customerIntelligenceError: string | null;
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
    </section>
  );
}
