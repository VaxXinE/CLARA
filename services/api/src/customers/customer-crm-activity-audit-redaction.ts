import type { AuditLogMetadata } from "../audit/audit-log-dto";
import {
  buildBaseCrmActivityAuditMetadata,
  crmActivityAuditMetadataKeys,
} from "./customer-crm-activity-audit-policy";
import type { CrmActivityAuditSafeMetadata } from "./customer-crm-activity-audit-types";

const sensitiveKeyParts = [
  "token",
  "cookie",
  "authorization",
  "secret",
  "providerpayload",
  "webhookpayload",
  "rawdom",
  "rawhtml",
  "rawprompt",
  "apikey",
];

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase().replaceAll(/[^a-z0-9]/g, "");

  return sensitiveKeyParts.some((part) => normalized.includes(part));
}

export function sanitizeCrmActivityAuditMetadata(
  metadata: Partial<CrmActivityAuditSafeMetadata> = {},
): {
  safeMetadata: CrmActivityAuditSafeMetadata;
  redactionApplied: boolean;
} {
  const allowed = new Set<string>(crmActivityAuditMetadataKeys);
  const entries = Object.entries(metadata).filter(([key]) => {
    return allowed.has(key) && !isSensitiveKey(key);
  });
  const dropped = Object.keys(metadata).length !== entries.length;
  const safeMetadata = buildBaseCrmActivityAuditMetadata(
    Object.fromEntries(entries) as Partial<CrmActivityAuditSafeMetadata>,
  );

  safeMetadata.redactionApplied =
    safeMetadata.redactionApplied === true || dropped;

  return {
    safeMetadata,
    redactionApplied: safeMetadata.redactionApplied,
  };
}

export function toAuditLogMetadata(
  metadata: CrmActivityAuditSafeMetadata,
  extra: {
    source: string;
    riskLevel: string;
    policyVersion: string;
    outcome: string;
  },
): AuditLogMetadata {
  return {
    source: extra.source,
    outcome: extra.outcome,
    risk_level: extra.riskLevel,
    policy_version: extra.policyVersion,
    proposal_type: metadata.proposalType ?? null,
    readiness_level: metadata.readinessLevel ?? null,
    recommended_action: metadata.recommendedAction ?? null,
    blocked_reason: metadata.blockedReason ?? null,
    redaction_applied: metadata.redactionApplied ?? false,
    mutation_executed: false,
    action_executed: false,
    review_only: true,
  };
}
