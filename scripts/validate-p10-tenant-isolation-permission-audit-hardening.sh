#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p10-tenant-isolation-permission-audit-hardening" ]]; then
  echo "Expected branch feat/p10-tenant-isolation-permission-audit-hardening, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/enterprise/tenant-isolation-readiness-types.ts"
  "services/api/src/enterprise/tenant-isolation-readiness-policy.ts"
  "services/api/src/enterprise/tenant-isolation-readiness-dto.ts"
  "services/api/src/enterprise/tenant-isolation-readiness-service.ts"
  "services/api/src/enterprise/permission-audit-types.ts"
  "services/api/src/enterprise/permission-audit-policy.ts"
  "services/api/src/enterprise/permission-audit-dto.ts"
  "services/api/src/enterprise/permission-audit-service.ts"
  "services/api/src/http/routes/enterprise-readiness-query.ts"
  "services/api/src/http/routes/enterprise-tenant-isolation-readiness.ts"
  "services/api/src/http/routes/enterprise-permission-audit-readiness.ts"
  "services/api/tests/p10-tenant-isolation-readiness-policy.test.ts"
  "services/api/tests/p10-tenant-isolation-readiness-service.test.ts"
  "services/api/tests/p10-tenant-isolation-readiness-route.test.ts"
  "services/api/tests/p10-tenant-isolation-cross-workspace-regression.test.ts"
  "services/api/tests/p10-client-workspace-spoofing-regression.test.ts"
  "services/api/tests/p10-permission-audit-policy.test.ts"
  "services/api/tests/p10-permission-audit-service.test.ts"
  "services/api/tests/p10-permission-audit-route.test.ts"
  "services/api/tests/p10-permission-audit-security-boundary.test.ts"
  "services/api/tests/p10-permission-audit-no-mutation.test.ts"
  "apps/dashboard/src/components/TenantIsolationReadinessPanel.tsx"
  "apps/dashboard/src/components/TenantIsolationReadinessPanel.test.tsx"
  "apps/dashboard/src/components/PermissionAuditReadinessPanel.tsx"
  "apps/dashboard/src/components/PermissionAuditReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p10-tenant-isolation-readiness-security.test.tsx"
  "apps/dashboard/src/components/p10-permission-audit-readiness-security.test.tsx"
  "apps/extension/src/tests/p10-tenant-isolation-permission-audit-extension-boundary.test.ts"
  "docs/product/CLARA-P10-TENANT-ISOLATION-PERMISSION-AUDIT-HARDENING-SPEC.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P10-TENANT-ISOLATION-POLICY.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-BASELINE.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p10-tenant-isolation-permission-audit-hardening.sh"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

bash -n scripts/validate-p10-enterprise-hardening-compliance-scope-policy.sh
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
  "services/api/src/enterprise/tenant-isolation-readiness-types.ts"
  "services/api/src/enterprise/tenant-isolation-readiness-policy.ts"
  "services/api/src/enterprise/tenant-isolation-readiness-dto.ts"
  "services/api/src/enterprise/tenant-isolation-readiness-service.ts"
  "services/api/src/enterprise/permission-audit-types.ts"
  "services/api/src/enterprise/permission-audit-policy.ts"
  "services/api/src/enterprise/permission-audit-dto.ts"
  "services/api/src/enterprise/permission-audit-service.ts"
  "services/api/src/http/routes/enterprise-readiness-query.ts"
  "services/api/src/http/routes/enterprise-tenant-isolation-readiness.ts"
  "services/api/src/http/routes/enterprise-permission-audit-readiness.ts"
  "apps/dashboard/src/components/TenantIsolationReadinessPanel.tsx"
  "apps/dashboard/src/components/PermissionAuditReadinessPanel.tsx"
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
  "roleMutationAllowed: true" \
  "permissionMutationAllowed: true" \
  "mutationAllowed: true" \
  "clientWorkspaceIdAuthoritative: true" \
  "clientWorkspaceAuthoritative: true" \
  "clientRoleAuthoritative: true" \
  "rawProviderPayloadIncluded: true" \
  "rawWebhookPayloadIncluded: true" \
  "rawAuditMetadataIncluded: true" \
  "rawCustomerMessagesIncluded: true" \
  "secretsIncluded: true"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P10-PR-02 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P10-TENANT-ISOLATION-PERMISSION-AUDIT-HARDENING-SPEC.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P10-TENANT-ISOLATION-POLICY.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-BASELINE.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Tenant Isolation + Permission Audit Hardening" \
  "P10 Enterprise Hardening / Compliance" \
  "P10-PR-02" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "tenant isolation" \
  "permission audit" \
  "least privilege" \
  "client-supplied" \
  "Client workspaceId is never authority" \
  "Frontend role guard is UX-only" \
  "Safe audit metadata" \
  "read-only" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no raw audit metadata" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no auth headers" \
  "no role mutation" \
  "no permission mutation" \
  "no CRM mutation" \
  "no outbound send" \
  "no real AI provider"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P10-PR-02 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin feat/p10-tenant-isolation-permission-audit-hardening >/dev/null; then
    echo "Remote branch feat/p10-tenant-isolation-permission-audit-hardening not found." >&2
    exit 1
  fi
fi

echo "CLARA P10-PR-02 VALIDATION PASSED"
