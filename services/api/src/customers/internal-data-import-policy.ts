import type { AuthContext } from "../auth/auth-context";
import { assertPermission } from "../auth/permissions";
import { ValidationError } from "../errors/app-error";
import type { CustomerMutationInput } from "./customer-service";

const allowedCustomerImportFields = new Set([
  "displayName",
  "contactIdentifier",
  "source",
  "status",
  "notesSummary",
]);

const unsafeFieldPatterns = [
  /token/i,
  /cookie/i,
  /authorization/i,
  /authHeader/i,
  /secret/i,
  /apiKey/i,
  /password/i,
  /rawProviderPayload/i,
  /rawWebhookPayload/i,
  /rawHtml/i,
  /rawDom/i,
  /rawPrompt/i,
  /payment/i,
  /card/i,
  /checkout/i,
];

export type InternalCustomerImportPayload = Record<string, unknown>;

export type ValidatedInternalCustomerImport = {
  workspaceId: string;
  customer: CustomerMutationInput;
};

function rejectUnsafeField(field: string): void {
  if (unsafeFieldPatterns.some((pattern) => pattern.test(field))) {
    throw new ValidationError("Unsafe import field.", [
      {
        path: field,
        message: "This field is not allowed for internal import.",
      },
    ]);
  }
}

function readOptionalString(
  payload: InternalCustomerImportPayload,
  field: string,
): string | null | undefined {
  const value = payload[field];

  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value !== "string") {
    throw new ValidationError("Invalid import field.", [
      { path: field, message: "Expected a string value." },
    ]);
  }

  return value;
}

export function validateInternalCustomerImport(
  auth: AuthContext,
  payload: InternalCustomerImportPayload,
): ValidatedInternalCustomerImport {
  assertPermission(auth.role, "customer:create");

  for (const field of Object.keys(payload)) {
    rejectUnsafeField(field);

    if (field === "workspaceId" || field === "workspace_id") {
      throw new ValidationError("Invalid import scope.", [
        {
          path: field,
          message: "Workspace scope must come from backend AuthContext.",
        },
      ]);
    }

    if (!allowedCustomerImportFields.has(field)) {
      throw new ValidationError("Unknown import field.", [
        {
          path: field,
          message: "Field is not in the customer import allowlist.",
        },
      ]);
    }
  }

  return {
    workspaceId: auth.workspaceId,
    customer: {
      displayName: readOptionalString(payload, "displayName") ?? undefined,
      contactIdentifier: readOptionalString(payload, "contactIdentifier"),
      source: readOptionalString(payload, "source") ?? undefined,
      status: readOptionalString(payload, "status") ?? undefined,
      notesSummary: readOptionalString(payload, "notesSummary"),
    },
  };
}
