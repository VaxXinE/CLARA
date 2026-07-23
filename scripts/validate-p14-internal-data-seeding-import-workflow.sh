#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "feat/p14-internal-data-seeding-import-workflow" ]]; then
  fail "expected branch feat/p14-internal-data-seeding-import-workflow, got ${current_branch}"
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
  "docs/product/CLARA-P14-INTERNAL-DATA-SEEDING-IMPORT-WORKFLOW.md"
  "docs/product/CLARA-P14-INTERNAL-DATA-IMPORT-FORMAT.md"
  "docs/product/CLARA-P14-INTERNAL-DATA-VALIDATION-POLICY.md"
  "docs/product/CLARA-P14-INTERNAL-DATA-ROLLBACK-CLEANUP-RUNBOOK.md"
  "docs/product/CLARA-P14-INTERNAL-DATA-POLICY.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md"
  "docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/src/customers/internal-data-import-policy.ts"
  "services/api/tests/p14-internal-data-seeding-import-workflow.test.ts"
  "services/api/tests/p14-internal-data-import-validation-policy.test.ts"
  "services/api/tests/p14-internal-data-import-workspace-boundary.test.ts"
  "services/api/tests/p14-internal-data-import-security-redaction.test.ts"
  "services/api/tests/p14-internal-data-import-readonly-regression.test.ts"
  "services/api/tests/p14-internal-data-import-no-billing-side-effect.test.ts"
  "services/api/tests/p14-internal-data-import-no-provider-ai-outbound-side-effect.test.ts"
  "services/api/tests/p14-internal-data-import-no-background-job-side-effect.test.ts"
  "apps/dashboard/src/components/p14-internal-data-import-guidance.test.tsx"
  "apps/dashboard/src/components/p14-internal-data-import-security.test.tsx"
  "apps/extension/src/tests/p14-internal-data-import-extension-boundary.test.ts"
)

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat \
  docs/product/CLARA-P14-INTERNAL-DATA-SEEDING-IMPORT-WORKFLOW.md \
  docs/product/CLARA-P14-INTERNAL-DATA-IMPORT-FORMAT.md \
  docs/product/CLARA-P14-INTERNAL-DATA-VALIDATION-POLICY.md \
  docs/product/CLARA-P14-INTERNAL-DATA-ROLLBACK-CLEANUP-RUNBOOK.md \
  docs/product/CLARA-P14-INTERNAL-DATA-POLICY.md \
  docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md \
  docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md \
  docs/product/CLARA-FINAL-ROADMAP.md \
  docs/product/CLARA-DOCUMENTATION-INDEX.md \
  README.md \
  services/api/README.md \
  apps/dashboard/README.md)"

required_phrases=(
  "P14-PR-01 is complete"
  "P14-PR-02 is complete"
  "P14-PR-03 is current"
  "Internal data seeding/import is for internal beta"
  "Import is workspace-scoped"
  "AuthContext and workspace membership remain source of truth"
  "Client-supplied workspaceId is not authoritative"
  "Secrets/tokens/cookies/raw provider payload/raw webhook payload/raw HTML/payment data must not be imported"
  "billing/payment is deferred"
  "public SaaS launch is deferred"
  "production deployment requires separate explicit action"
  "Provider/AI/outbound activation remains controlled"
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

runtime_sources=(
  services/api/src/customers/internal-data-import-policy.ts
  services/api/src/customers/customer-service.ts
  services/api/src/customers/customer-repository.ts
  services/api/src/db/scripts/seed.ts
  apps/dashboard/src/App.tsx
  apps/dashboard/src/components/ConversationWorkspace.tsx
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

if git ls-remote --exit-code --heads origin feat/p14-internal-data-seeding-import-workflow >/dev/null 2>&1; then
  :
else
  echo "WARN: remote branch feat/p14-internal-data-seeding-import-workflow not found yet; push before final release validation." >&2
fi

echo "CLARA P14-PR-03 VALIDATION PASSED"
