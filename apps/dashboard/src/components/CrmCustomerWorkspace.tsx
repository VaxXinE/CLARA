import type { ConversationDetail, CustomerProfileResponse } from "../api/types";
import { CustomerWorkspacePanel } from "./CustomerWorkspacePanel";
import { LeadWorkspacePanel } from "./LeadWorkspacePanel";

type CrmCustomerWorkspaceProps = {
  conversation: ConversationDetail | null;
  customer: CustomerProfileResponse["customer"] | null;
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
    </section>
  );
}
