import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CrmCustomerWorkspace } from "./CrmCustomerWorkspace";

describe("P8 final CRM workflow UI regression", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders all P8 panels as read/review/readiness/audit-only surfaces", () => {
    render(
      <CrmCustomerWorkspace
        conversation={null}
        customer={null}
        customerIntelligence={null}
        customerIntelligenceLoading={false}
        customerIntelligenceError={null}
        customerTimelineIntelligence={null}
        customerTimelineIntelligenceLoading={false}
        customerTimelineIntelligenceError={null}
        customerActionProposal={null}
        customerActionProposalLoading={false}
        customerActionProposalError={null}
        customerFollowUpProposal={null}
        customerFollowUpProposalLoading={false}
        customerFollowUpProposalError={null}
        customerOwnerAssignmentReadiness={null}
        customerOwnerAssignmentReadinessLoading={false}
        customerOwnerAssignmentReadinessError={null}
        customerLifecycleStatusReadiness={null}
        customerLifecycleStatusReadinessLoading={false}
        customerLifecycleStatusReadinessError={null}
        readOnly
      />,
    );

    expect(screen.getAllByText("read-only").length).toBeGreaterThan(0);
    expect(screen.getAllByText("review-only").length).toBeGreaterThan(0);
    expect(screen.getAllByText("readiness-only").length).toBeGreaterThan(0);
    expect(screen.getByText("audit-only")).toBeInTheDocument();
  });
});
