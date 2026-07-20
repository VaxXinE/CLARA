import { classifySensitiveField } from "./sensitive-field-classifier";

export type ComplianceSafeMetadataSummary = {
  allowedKeys: string[];
  redactedKeys: string[];
  blockedKeys: string[];
  safe: boolean;
};

export function summarizeComplianceMetadata(
  metadata: Record<string, unknown>,
): ComplianceSafeMetadataSummary {
  const summary: ComplianceSafeMetadataSummary = {
    allowedKeys: [],
    redactedKeys: [],
    blockedKeys: [],
    safe: true,
  };

  for (const key of Object.keys(metadata)) {
    const classification = classifySensitiveField(key);

    if (classification.action === "block") {
      summary.blockedKeys.push(key);
      summary.safe = false;
      continue;
    }

    if (classification.action === "redact") {
      summary.redactedKeys.push(key);
      summary.safe = false;
      continue;
    }

    summary.allowedKeys.push(key);
  }

  return summary;
}
