#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p10-admin-security-session-compliance-dashboard" ]]; then
  echo "Expected branch feat/p10-admin-security-session-compliance-dashboard, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/enterprise/admin-security-controls-types.ts"
  "services/api/src/enterprise/admin-security-controls-dto.ts"
  "services/api/src/enterprise/admin-security-controls-policy.ts"
  "services/api/src/enterprise/admin-security-controls-service.ts"
  "services/api/src/enterprise/session-policy-readiness-types.ts"
  "services/api/src/enterprise/session-policy-readiness-dto.ts"
  "services/api/src/enterprise/session-policy-readiness-policy.ts"
  "services/api/src/enterprise/session-policy-readiness-service.ts"
  "services/api/src/enterprise/compliance-dashboard-types.ts"
  "services/api/src/enterprise/compliance-dashboard-dto.ts"
  "services/api/src/enterprise/compliance-dashboard-policy.ts"
  "services/api/src/enterprise/compliance-dashboard-service.ts"
  "services/api/src/enterprise/enterprise-compliance-summary.ts"
  "services/api/src/http/routes/enterprise-admin-security-controls-readiness.ts"
  "services/api/src/http/routes/enterprise-session-policy-readiness.ts"
  "services/api/src/http/routes/enterprise-compliance-dashboard.ts"
  "services/api/tests/p10-admin-security-controls-policy.test.ts"
  "services/api/tests/p10-admin-security-controls-service.test.ts"
  "services/api/tests/p10-admin-security-controls-route.test.ts"
  "services/api/tests/p10-admin-security-controls-security-boundary.test.ts"
  "services/api/tests/p10-admin-security-controls-no-mutation.test.ts"
  "services/api/tests/p10-session-policy-readiness-policy.test.ts"
  "services/api/tests/p10-session-policy-readiness-service.test.ts"
  "services/api/tests/p10-session-policy-readiness-route.test.ts"
  "services/api/tests/p10-session-policy-no-revocation-regression.test.ts"
  "services/api/tests/p10-compliance-dashboard-policy.test.ts"
  "services/api/tests/p10-compliance-dashboard-service.test.ts"
  "services/api/tests/p10-compliance-dashboard-route.test.ts"
  "services/api/tests/p10-compliance-dashboard-security-boundary.test.ts"
  "apps/dashboard/src/components/AdminSecurityControlsReadinessPanel.tsx"
  "apps/dashboard/src/components/AdminSecurityControlsReadinessPanel.test.tsx"
  "apps/dashboard/src/components/SessionPolicyReadinessPanel.tsx"
  "apps/dashboard/src/components/SessionPolicyReadinessPanel.test.tsx"
  "apps/dashboard/src/components/ComplianceDashboardReadinessPanel.tsx"
  "apps/dashboard/src/components/ComplianceDashboardReadinessPanel.test.tsx"
  "apps/dashboard/src/components/EnterpriseComplianceReadinessPanel.tsx"
  "apps/dashboard/src/components/p10-admin-security-controls-readiness-security.test.tsx"
  "apps/dashboard/src/components/p10-session-policy-readiness-security.test.tsx"
  "apps/dashboard/src/components/p10-compliance-dashboard-readiness-security.test.tsx"
  "apps/extension/src/tests/p10-admin-security-session-compliance-extension-boundary.test.ts"
  "docs/product/CLARA-P10-ADMIN-SECURITY-SESSION-COMPLIANCE-DASHBOARD-SPEC.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-BASELINE.md"
  "docs/product/CLARA-P10-TENANT-ISOLATION-POLICY.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p10-admin-security-session-compliance-dashboard.sh"
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
  "services/api/src/enterprise/admin-security-controls-types.ts"
  "services/api/src/enterprise/admin-security-controls-dto.ts"
  "services/api/src/enterprise/admin-security-controls-policy.ts"
  "services/api/src/enterprise/admin-security-controls-service.ts"
  "services/api/src/enterprise/session-policy-readiness-types.ts"
  "services/api/src/enterprise/session-policy-readiness-dto.ts"
  "services/api/src/enterprise/session-policy-readiness-policy.ts"
  "services/api/src/enterprise/session-policy-readiness-service.ts"
  "services/api/src/enterprise/compliance-dashboard-types.ts"
  "services/api/src/enterprise/compliance-dashboard-dto.ts"
  "services/api/src/enterprise/compliance-dashboard-policy.ts"
  "services/api/src/enterprise/compliance-dashboard-service.ts"
  "services/api/src/enterprise/enterprise-compliance-summary.ts"
  "services/api/src/http/routes/enterprise-admin-security-controls-readiness.ts"
  "services/api/src/http/routes/enterprise-session-policy-readiness.ts"
  "services/api/src/http/routes/enterprise-compliance-dashboard.ts"
  "apps/dashboard/src/components/AdminSecurityControlsReadinessPanel.tsx"
  "apps/dashboard/src/components/SessionPolicyReadinessPanel.tsx"
  "apps/dashboard/src/components/ComplianceDashboardReadinessPanel.tsx"
  "apps/dashboard/src/components/EnterpriseComplianceReadinessPanel.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token" \
  "refresh_token" \
  "client_secret" \
  "providerCookie" \
  "sessionCookie" \
  "rawProviderPayload" \
  "raw_provider_payload" \
  "rawWebhookPayload" \
  "raw_webhook_payload" \
  "rawCustomerMessage" \
  "raw_customer_message" \
  "rawDom" \
  "rawHtml" \
  "raw_dom" \
  "raw_html" \
  "rawPrompt" \
  "OPENAI_API_KEY" \
  "GEMINI_API_KEY" \
  "ANTHROPIC_API_KEY" \
  "@ai-sdk" \
  ">Export<" \
  ">Download<" \
  ">Execute<" \
  ">Apply<" \
  ">Revoke Session<" \
  ">Force Logout<" \
  ">Enable SSO<" \
  ">Enable MFA<" \
  ">Delete Data<" \
  ">Legal Hold<" \
  ">Create Task<" \
  ">Assign Owner<" \
  ">Update Status<" \
  ">Send Message<" \
  ">Write Note<" \
  ">Change Role<" \
  ">Grant Permission<" \
  "roleMutationImplemented: true" \
  "permissionMutationImplemented: true" \
  "ssoImplemented: true" \
  "mfaImplemented: true" \
  "forceLogoutImplemented: true" \
  "sessionRevocationImplemented: true" \
  "mfaStepUpImplemented: true" \
  "roleMutationAllowed: true" \
  "permissionMutationAllowed: true" \
  "mutationAllowed: true" \
  "sessionRevoked: true" \
  "forceLogoutExecuted: true" \
  "exportEnabled: true" \
  "evidenceDownloadEnabled: true" \
  "rawEvidenceIncluded: true" \
  "rawAuditMetadataIncluded: true" \
  "secretsIncluded: true" \
  "certificationClaimed: true"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P10-PR-04 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P10-ADMIN-SECURITY-SESSION-COMPLIANCE-DASHBOARD-SPEC.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-BASELINE.md"
  "docs/product/CLARA-P10-TENANT-ISOLATION-POLICY.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Admin Security Controls" \
  "Session Policy" \
  "Compliance Dashboard" \
  "P10 Enterprise Hardening / Compliance" \
  "compliance readiness" \
  "not certification" \
  "Backend AuthContext" \
  "client workspaceId is never authority" \
  "workspace-scoped" \
  "least privilege" \
  "frontend role guard is UX-only" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no raw audit metadata" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no permission mutation" \
  "no role mutation" \
  "no session revocation" \
  "no force logout" \
  "no SSO implementation" \
  "no MFA implementation" \
  "no CRM mutation" \
  "no outbound send" \
  "no real AI provider" \
  "no evidence export" \
  "P10-PR-04"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P10-PR-04 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin feat/p10-admin-security-session-compliance-dashboard >/dev/null; then
    echo "Remote branch feat/p10-admin-security-session-compliance-dashboard not found." >&2
    exit 1
  fi
fi

echo "CLARA P10-PR-04 VALIDATION PASSED"
