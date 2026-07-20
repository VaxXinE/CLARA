import type { AuthContext } from "../auth/auth-context";
import {
  complianceClassifications,
  getDataClassificationRules,
} from "./data-classification-runtime-policy";
import type { DataClassificationReadinessResponse } from "./data-classification-runtime-types";

export class DataClassificationRuntimeService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  getReadiness(input: {
    auth: AuthContext;
  }): DataClassificationReadinessResponse {
    return {
      workspaceId: input.auth.workspaceId,
      generatedAt: this.clock().toISOString(),
      phase: "p10",
      classifications: complianceClassifications,
      dataClasses: getDataClassificationRules(),
      safety: {
        readOnly: true,
        rawSensitiveExamplesIncluded: false,
        secretsIncluded: false,
        rawCustomerMessagesIncluded: false,
        rawProviderPayloadIncluded: false,
        rawWebhookPayloadIncluded: false,
        rawAuditMetadataIncluded: false,
      },
    };
  }
}
