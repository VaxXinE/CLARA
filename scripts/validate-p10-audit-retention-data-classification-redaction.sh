#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p10-audit-retention-data-classification-redaction" ]]; then
  echo "Expected branch feat/p10-audit-retention-data-classification-redaction, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/enterprise/audit-retention-readiness-types.ts"
  "services/api/src/enterprise/audit-retention-readiness-dto.ts"
  "services/api/src/enterprise/audit-retention-readiness-policy.ts"
  "services/api/src/enterprise/audit-retention-readiness-service.ts"
  "services/api/src/enterprise/data-classification-runtime-types.ts"
  "services/api/src/enterprise/data-classification-runtime-policy.ts"
  "services/api/src/enterprise/data-classification-runtime-service.ts"
  "services/api/src/enterprise/redaction-hardening-types.ts"
  "services/api/src/enterprise/redaction-hardening-policy.ts"
  "services/api/src/enterprise/redaction-hardening-service.ts"
  "services/api/src/enterprise/sensitive-field-classifier.ts"
  "services/api/src/enterprise/compliance-safe-metadata-summary.ts"
  "services/api/src/http/routes/enterprise-audit-retention-readiness.ts"
  "services/api/src/http/routes/enterprise-data-classification-readiness.ts"
  "services/api/src/http/routes/enterprise-redaction-hardening-readiness.ts"
  "services/api/tests/p10-audit-retention-readiness-policy.test.ts"
  "services/api/tests/p10-audit-retention-readiness-service.test.ts"
  "services/api/tests/p10-audit-retention-readiness-route.test.ts"
  "services/api/tests/p10-data-classification-runtime-policy.test.ts"
  "services/api/tests/p10-data-classification-runtime-service.test.ts"
  "services/api/tests/p10-data-classification-readiness-route.test.ts"
  "services/api/tests/p10-redaction-hardening-policy.test.ts"
  "services/api/tests/p10-redaction-hardening-service.test.ts"
  "services/api/tests/p10-redaction-hardening-readiness-route.test.ts"
  "services/api/tests/p10-sensitive-field-classifier.test.ts"
  "services/api/tests/p10-compliance-safe-metadata-summary.test.ts"
  "services/api/tests/p10-audit-retention-redaction-security-boundary.test.ts"
  "services/api/tests/p10-audit-retention-redaction-no-mutation.test.ts"
  "apps/dashboard/src/components/AuditRetentionReadinessPanel.tsx"
  "apps/dashboard/src/components/AuditRetentionReadinessPanel.test.tsx"
  "apps/dashboard/src/components/DataClassificationReadinessPanel.tsx"
  "apps/dashboard/src/components/DataClassificationReadinessPanel.test.tsx"
  "apps/dashboard/src/components/RedactionHardeningReadinessPanel.tsx"
  "apps/dashboard/src/components/RedactionHardeningReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p10-audit-retention-readiness-security.test.tsx"
  "apps/dashboard/src/components/p10-data-classification-readiness-security.test.tsx"
  "apps/dashboard/src/components/p10-redaction-hardening-readiness-security.test.tsx"
  "apps/extension/src/tests/p10-audit-retention-data-classification-redaction-extension-boundary.test.ts"
  "docs/product/CLARA-P10-AUDIT-RETENTION-DATA-CLASSIFICATION-REDACTION-HARDENING-SPEC.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-BASELINE.md"
  "docs/product/CLARA-P10-DATA-CLASSIFICATION-POLICY.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p10-audit-retention-data-classification-redaction.sh"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

bash scripts/validate-repo-structure.sh
bash scripts/validate-production-runtime-config.sh

cd services/api
npm install
npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../../apps/dashboard
npm install
npx --yes prettier "src/**/*.{ts,tsx}" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../extension
npm install
npx --yes prettier "src/**/*.{ts,tsx}" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd "$ROOT_DIR"
docker compose -f docker-compose.prod.example.yml config >/dev/null

tracked_env="$(
  git ls-files | grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' || true
)"
if [[ -n "$tracked_env" ]]; then
  echo "Tracked env file found:" >&2
  echo "$tracked_env" >&2
  exit 1
fi

tracked_artifacts="$(
  git ls-files | grep -E '(^|/)(dist|build|coverage|node_modules)/' || true
)"
if [[ -n "$tracked_artifacts" ]]; then
  echo "Tracked build artifact found:" >&2
  echo "$tracked_artifacts" >&2
  exit 1
fi

runtime_files=(
  "services/api/src/enterprise/audit-retention-readiness-types.ts"
  "services/api/src/enterprise/audit-retention-readiness-dto.ts"
  "services/api/src/enterprise/audit-retention-readiness-policy.ts"
  "services/api/src/enterprise/audit-retention-readiness-service.ts"
  "services/api/src/enterprise/data-classification-runtime-types.ts"
  "services/api/src/enterprise/data-classification-runtime-policy.ts"
  "services/api/src/enterprise/data-classification-runtime-service.ts"
  "services/api/src/enterprise/redaction-hardening-types.ts"
  "services/api/src/enterprise/redaction-hardening-policy.ts"
  "services/api/src/enterprise/redaction-hardening-service.ts"
  "services/api/src/enterprise/sensitive-field-classifier.ts"
  "services/api/src/enterprise/compliance-safe-metadata-summary.ts"
  "services/api/src/http/routes/enterprise-audit-retention-readiness.ts"
  "services/api/src/http/routes/enterprise-data-classification-readiness.ts"
  "services/api/src/http/routes/enterprise-redaction-hardening-readiness.ts"
  "apps/dashboard/src/components/AuditRetentionReadinessPanel.tsx"
  "apps/dashboard/src/components/DataClassificationReadinessPanel.tsx"
  "apps/dashboard/src/components/RedactionHardeningReadinessPanel.tsx"
  "apps/dashboard/src/components/EnterpriseComplianceReadinessPanel.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token" \
  "refresh_token" \
  "client_secret" \
  "OPENAI_API_KEY" \
  "GEMINI_API_KEY" \
  "ANTHROPIC_API_KEY" \
  "@ai-sdk" \
  ">Export<" \
  ">Download<" \
  ">Execute<" \
  ">Apply<" \
  ">Delete Data<" \
  ">Legal Hold<" \
  ">Run Retention Job<" \
  "deletionExecuted: true" \
  "legalHoldExecuted: true" \
  "exportExecuted: true" \
  "deletionAutomationImplemented: true" \
  "legalHoldAutomationImplemented: true" \
  "retentionJobImplemented: true" \
  "exportImplemented: true" \
  "permissionMutationAllowed: true" \
  "roleMutationAllowed: true" \
  "mutationAllowed: true" \
  "clientWorkspaceIdAuthoritative: true" \
  "rawProviderPayloadIncluded: true" \
  "rawWebhookPayloadIncluded: true" \
  "rawAuditMetadataIncluded: true" \
  "rawCustomerMessagesIncluded: true" \
  "secretsIncluded: true"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P10-PR-03 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P10-AUDIT-RETENTION-DATA-CLASSIFICATION-REDACTION-HARDENING-SPEC.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-BASELINE.md"
  "docs/product/CLARA-P10-DATA-CLASSIFICATION-POLICY.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Audit Retention" \
  "Data Classification" \
  "Redaction Hardening" \
  "Sensitive Field Classifier" \
  "P10 Enterprise Hardening / Compliance" \
  "compliance readiness" \
  "not certification" \
  "Backend AuthContext" \
  "client workspaceId is never authority" \
  "workspace-scoped" \
  "safe audit metadata" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no raw audit metadata" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no permission mutation" \
  "no role mutation" \
  "no CRM mutation" \
  "no outbound send" \
  "no real AI provider" \
  "no deletion automation" \
  "no legal hold automation" \
  "no report export" \
  "P10-PR-03"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P10-PR-03 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin feat/p10-audit-retention-data-classification-redaction >/dev/null; then
    echo "Remote branch feat/p10-audit-retention-data-classification-redaction not found." >&2
    exit 1
  fi
fi

echo "CLARA P10-PR-03 VALIDATION PASSED"
