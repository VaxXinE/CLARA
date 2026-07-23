#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "feat/p14-internal-user-bootstrap-role-setup" ]]; then
  fail "expected branch feat/p14-internal-user-bootstrap-role-setup, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

if grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files"; then
  fail ".agents must not be tracked"
fi

if grep -q '^skills-lock\.json$' <<<"$tracked_files"; then
  fail "skills-lock.json must not be tracked"
fi

if grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files"; then
  fail "real env files must not be tracked"
fi

if grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files"; then
  fail "dist/build/coverage artifacts must not be tracked"
fi

required_files=(
  "docs/product/CLARA-P14-INTERNAL-BETA-ROLLOUT-SCOPE.md"
  "docs/product/CLARA-P14-INTERNAL-ENVIRONMENT-PLAN.md"
  "docs/product/CLARA-P14-INTERNAL-USER-ROLE-PLAN.md"
  "docs/product/CLARA-P14-INTERNAL-DATA-POLICY.md"
  "docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md"
  "docs/product/CLARA-P14-INTERNAL-USER-BOOTSTRAP-ROLE-SETUP.md"
  "docs/product/CLARA-P14-INTERNAL-ROLE-PERMISSION-MATRIX.md"
  "docs/product/CLARA-P14-INTERNAL-USER-ONBOARDING-CHECKLIST.md"
  "docs/product/CLARA-P14-INTERNAL-OWNER-ADMIN-RUNBOOK.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/tests/p14-internal-user-bootstrap-role-setup.test.ts"
  "services/api/tests/p14-internal-role-permission-boundary.test.ts"
  "services/api/tests/p14-internal-viewer-readonly-regression.test.ts"
  "services/api/tests/p14-internal-user-bootstrap-no-billing-side-effect.test.ts"
  "services/api/tests/p14-internal-user-bootstrap-no-provider-ai-outbound-side-effect.test.ts"
  "apps/dashboard/src/components/p14-internal-user-role-setup.test.tsx"
  "apps/dashboard/src/components/p14-internal-user-role-security.test.tsx"
  "apps/extension/src/tests/p14-internal-user-role-extension-boundary.test.ts"
)

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat \
  docs/product/CLARA-P14-INTERNAL-BETA-ROLLOUT-SCOPE.md \
  docs/product/CLARA-P14-INTERNAL-ENVIRONMENT-PLAN.md \
  docs/product/CLARA-P14-INTERNAL-USER-ROLE-PLAN.md \
  docs/product/CLARA-P14-INTERNAL-DATA-POLICY.md \
  docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md \
  docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md \
  docs/product/CLARA-P14-INTERNAL-USER-BOOTSTRAP-ROLE-SETUP.md \
  docs/product/CLARA-P14-INTERNAL-ROLE-PERMISSION-MATRIX.md \
  docs/product/CLARA-P14-INTERNAL-USER-ONBOARDING-CHECKLIST.md \
  docs/product/CLARA-P14-INTERNAL-OWNER-ADMIN-RUNBOOK.md \
  docs/product/CLARA-FINAL-ROADMAP.md \
  docs/product/CLARA-DOCUMENTATION-INDEX.md \
  README.md \
  services/api/README.md \
  apps/dashboard/README.md)"

required_phrases=(
  "P14-PR-01 is complete"
  "P14-PR-02 is current"
  "Internal user setup is for internal beta"
  "owner/admin/operator/viewer roles are defined"
  "Backend AuthContext and workspace membership remain source of truth"
  "billing/payment is deferred"
  "public SaaS launch is deferred"
  "production deployment requires separate explicit action"
  "Provider/AI/outbound activation remains controlled"
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

runtime_sources=(
  services/api/src/auth/owner-bootstrap-service.ts
  services/api/src/auth/user-role-management-policy.ts
  services/api/src/auth/user-role-management-service.ts
  services/api/src/auth/workspace-membership-service.ts
  services/api/src/http/routes/user-role-management.ts
  apps/dashboard/src/components/UserRoleManagementReadinessPanel.tsx
  apps/extension/src/api/clara-extension-api-client.ts
)

if grep -nE 'stripe|checkout|invoice|chargeCustomer|createSubscription|subscriptionMutation|quotaEnforce|enforceQuota' "${runtime_sources[@]}"; then
  fail "unexpected payment/billing runtime activation"
fi

if grep -nE 'OpenAI|Anthropic|GmailApi|WhatsAppApi|autoSend|sendExternal|sendNotification|deployProduction|rollbackProduction|queue\.add|cron|worker|dangerouslySetInnerHTML|rawHtml' "${runtime_sources[@]}"; then
  fail "unexpected provider/AI/outbound/deployment/job/raw HTML runtime activation"
fi

if grep -nE 'raw_provider_payload|raw_webhook_payload|raw_audit_metadata|access_token|refresh_token|Authorization header|cookie|api_key|secret' "${runtime_sources[@]}"; then
  fail "unsafe raw payload/token/secret/cookie runtime pattern found"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if git ls-remote --exit-code --heads origin feat/p14-internal-user-bootstrap-role-setup >/dev/null 2>&1; then
  :
else
  echo "WARN: remote branch feat/p14-internal-user-bootstrap-role-setup not found yet; push before final release validation." >&2
fi

echo "CLARA P14-PR-02 VALIDATION PASSED"
