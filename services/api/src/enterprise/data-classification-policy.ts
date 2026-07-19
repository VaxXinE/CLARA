import type { ClassifiedDataItem } from "./enterprise-compliance-readiness-types";

export const classifiedDataItems: ClassifiedDataItem[] = [
  {
    name: "public documentation",
    classification: "public",
    handling: "safe to publish",
  },
  {
    name: "workspace metadata",
    classification: "internal",
    handling: "workspace-scoped",
  },
  {
    name: "user profile metadata",
    classification: "confidential",
    handling: "least-privilege",
  },
  {
    name: "role and permission data",
    classification: "restricted",
    handling: "server-authorized",
  },
  {
    name: "customer profile data",
    classification: "confidential",
    handling: "workspace-scoped",
  },
  {
    name: "conversation metadata",
    classification: "confidential",
    handling: "workspace-scoped",
  },
  {
    name: "customer message content",
    classification: "restricted",
    handling: "minimize and redact",
  },
  {
    name: "provider payloads",
    classification: "restricted",
    handling: "normalize before use",
  },
  {
    name: "webhook payloads",
    classification: "restricted",
    handling: "verify and minimize",
  },
  {
    name: "audit logs",
    classification: "restricted",
    handling: "allowlisted metadata only",
  },
  {
    name: "analytics aggregates",
    classification: "internal",
    handling: "aggregate-first",
  },
  {
    name: "AI prompt/context material",
    classification: "restricted",
    handling: "human-approved and minimized",
  },
  {
    name: "tokens, secrets, API keys, cookies, auth headers",
    classification: "secret",
    handling: "secret manager only",
  },
];

export function classifyDataItem(name: string) {
  return classifiedDataItems.find((item) => item.name === name) ?? null;
}
