import type { AuthContext } from "../auth/auth-context";
import { getRedactionClassifierRules } from "./redaction-hardening-policy";
import type { RedactionHardeningReadinessResponse } from "./redaction-hardening-types";

export class RedactionHardeningService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  getReadiness(input: {
    auth: AuthContext;
  }): RedactionHardeningReadinessResponse {
    return {
      workspaceId: input.auth.workspaceId,
      generatedAt: this.clock().toISOString(),
      phase: "p10",
      redaction: {
        tokenRedactionRequired: true,
        cookieRedactionRequired: true,
        authHeaderRedactionRequired: true,
        apiKeyRedactionRequired: true,
        providerPayloadRedactionRequired: true,
        webhookPayloadRedactionRequired: true,
        auditMetadataRedactionRequired: true,
        customerMessageRedactionRequiredForComplianceViews: true,
      },
      classifiers: getRedactionClassifierRules(),
      safety: {
        readOnly: true,
        mutationAllowed: false,
        rawBeforeAfterSamplesIncluded: false,
        secretsIncluded: false,
      },
    };
  }
}
