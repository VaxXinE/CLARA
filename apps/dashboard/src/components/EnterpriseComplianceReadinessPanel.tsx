import type { ComponentProps } from "react";
import { AdminSecurityControlsReadinessPanel } from "./AdminSecurityControlsReadinessPanel";
import { ComplianceDashboardReadinessPanel } from "./ComplianceDashboardReadinessPanel";
import { SessionPolicyReadinessPanel } from "./SessionPolicyReadinessPanel";

type EnterpriseComplianceReadinessPanelProps = {
  adminSecurityControls?: ComponentProps<
    typeof AdminSecurityControlsReadinessPanel
  >;
  sessionPolicy?: ComponentProps<typeof SessionPolicyReadinessPanel>;
  complianceDashboard?: ComponentProps<
    typeof ComplianceDashboardReadinessPanel
  >;
};

export function EnterpriseComplianceReadinessPanel(
  props: EnterpriseComplianceReadinessPanelProps,
) {
  if (
    !props.adminSecurityControls ||
    !props.sessionPolicy ||
    !props.complianceDashboard
  ) {
    return (
      <section
        className="panel crm-skeleton-panel"
        aria-label="Enterprise Compliance Readiness"
      >
        <div className="panel-heading">
          <div>
            <p className="eyebrow">P10 enterprise readiness</p>
            <h2>Enterprise Compliance Readiness</h2>
          </div>
          <span className="badge">Read-only</span>
        </div>
        <div className="crm-facts-grid">
          {[
            "Tenant isolation",
            "Access control",
            "Data classification",
            "Audit readiness",
            "Retention readiness",
            "Incident response readiness",
            "Evidence readiness",
          ].map((label) => (
            <article className="state-card" key={label}>
              <strong>{label}</strong>
              <p>Compliance readiness only.</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <AdminSecurityControlsReadinessPanel {...props.adminSecurityControls} />
      <SessionPolicyReadinessPanel {...props.sessionPolicy} />
      <ComplianceDashboardReadinessPanel {...props.complianceDashboard} />
    </>
  );
}
