export type EnterpriseComplianceSummary = {
  phase: "p10";
  label: string;
  notCertification: true;
  workspaceScoped: true;
};

export function getEnterpriseComplianceSummary(): EnterpriseComplianceSummary {
  return {
    phase: "p10",
    label: "P10 Enterprise Hardening / Compliance readiness",
    notCertification: true,
    workspaceScoped: true,
  };
}
