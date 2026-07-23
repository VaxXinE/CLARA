#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "test/p14-internal-access-qa-security-review" ]]; then
  fail "expected branch test/p14-internal-access-qa-security-review, got ${current_branch}"
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
  "docs/product/CLARA-P14-INTERNAL-ACCESS-QA-CHECKLIST.md"
  "docs/product/CLARA-P14-INTERNAL-SECURITY-REVIEW.md"
  "docs/product/CLARA-P14-INTERNAL-ROLE-ACCESS-REVIEW.md"
  "docs/product/CLARA-P14-WORKSPACE-ISOLATION-QA.md"
  "docs/product/CLARA-P14-INTERNAL-DATA-IMPORT-SECURITY-REVIEW.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md"
  "docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/tests/p14-internal-access-qa-security-review.test.ts"
  "services/api/tests/p14-internal-role-access-boundary.test.ts"
  "services/api/tests/p14-internal-viewer-readonly-access-qa.test.ts"
  "services/api/tests/p14-internal-operator-access-boundary.test.ts"
  "services/api/tests/p14-internal-admin-owner-access-boundary.test.ts"
  "services/api/tests/p14-internal-workspace-isolation-qa.test.ts"
  "services/api/tests/p14-internal-access-client-workspace-spoofing.test.ts"
  "services/api/tests/p14-internal-access-no-secret-payload-exposure.test.ts"
  "services/api/tests/p14-internal-access-no-billing-side-effect.test.ts"
  "services/api/tests/p14-internal-access-no-provider-ai-outbound-side-effect.test.ts"
  "apps/dashboard/src/components/p14-internal-access-qa-security-review.test.tsx"
  "apps/dashboard/src/components/p14-internal-role-access-security.test.tsx"
  "apps/dashboard/src/components/p14-internal-viewer-readonly-security.test.tsx"
  "apps/extension/src/tests/p14-internal-access-qa-extension-boundary.test.ts"
)

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat \
  docs/product/CLARA-P14-INTERNAL-ACCESS-QA-CHECKLIST.md \
  docs/product/CLARA-P14-INTERNAL-SECURITY-REVIEW.md \
  docs/product/CLARA-P14-INTERNAL-ROLE-ACCESS-REVIEW.md \
  docs/product/CLARA-P14-WORKSPACE-ISOLATION-QA.md \
  docs/product/CLARA-P14-INTERNAL-DATA-IMPORT-SECURITY-REVIEW.md \
  docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md \
  docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md \
  docs/product/CLARA-FINAL-ROADMAP.md \
  docs/product/CLARA-DOCUMENTATION-INDEX.md \
  README.md \
  services/api/README.md \
  apps/dashboard/README.md \
  apps/extension/README.md | tr '\n' ' ' | tr -s ' ')"

required_phrases=(
  "P14-PR-01 is complete"
  "P14-PR-02 is complete"
  "P14-PR-03 is complete"
  "P14-PR-04 is current"
  "Internal access QA is for internal beta"
  "Owner/admin/operator/viewer access boundaries are reviewed"
  "Viewer/read-only mutation blocking is required"
  "AuthContext and workspace membership remain source of truth"
  "client-supplied workspaceId is not authoritative"
  "Internal data import remains workspace-scoped and safe"
  "Secrets/tokens/cookies/raw provider payload/raw webhook payload/raw HTML/payment data must not be imported or exposed"
  "billing/payment is deferred"
  "public SaaS launch is deferred"
  "production deployment requires separate explicit action"
  "provider/AI/outbound activation remains controlled"
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

runtime_sources=(
  services/api/src/auth/permissions.ts
  services/api/src/auth/user-role-management-policy.ts
  services/api/src/auth/user-role-management-service.ts
  services/api/src/auth/workspace-membership-service.ts
  services/api/src/customers/customer-service.ts
  services/api/src/customers/internal-data-import-policy.ts
  services/api/src/conversations/conversation-service.ts
  services/api/src/http/routes/customers.ts
  services/api/src/http/routes/conversations.ts
  services/api/src/http/routes/user-role-management.ts
  apps/dashboard/src/App.tsx
  apps/dashboard/src/components/ConversationWorkspace.tsx
  apps/dashboard/src/components/UserRoleManagementReadinessPanel.tsx
  apps/extension/src/api/clara-extension-api-client.ts
)

if grep -nE 'stripe|createCheckoutSession|createInvoice|chargeCustomer|createSubscription|subscriptionMutation|enforceQuota' "${runtime_sources[@]}"; then
  fail "unexpected payment/billing runtime activation"
fi

if grep -nE 'OpenAI|Anthropic|autoSend|sendExternal|sendNotification|deployProduction|rollbackProduction|queue\.add|enqueue|cron\.schedule|new Worker|dangerouslySetInnerHTML' "${runtime_sources[@]}"; then
  fail "unexpected provider/AI/outbound/deployment/job/raw HTML runtime activation"
fi

if grep -nE 'renderRaw|displayRaw|returnRaw|persistRaw|storeRaw|raw.*Payload.*response|access_token.*return|refresh_token.*return|Authorization header.*return' "${runtime_sources[@]}"; then
  fail "unsafe raw payload/token response pattern found"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/extension/src/**/*.{ts,tsx}" --write
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if git ls-remote --exit-code --heads origin test/p14-internal-access-qa-security-review >/dev/null 2>&1; then
  :
else
  echo "WARN: remote branch test/p14-internal-access-qa-security-review not found yet; push before final release validation." >&2
fi

echo "CLARA P14-PR-04 VALIDATION PASSED"
