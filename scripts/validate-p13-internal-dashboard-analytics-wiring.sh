#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "feat/p13-internal-dashboard-analytics-wiring" ]]; then
  fail "expected branch feat/p13-internal-dashboard-analytics-wiring, got ${current_branch}"
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
  "docs/product/CLARA-P13-INTERNAL-DASHBOARD-ANALYTICS-WIRING.md"
  "docs/product/CLARA-P13-INTERNAL-CRM-ACTIVATION-ROADMAP.md"
  "docs/product/CLARA-P13-BILLING-DEFERRED-POLICY.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "services/api/src/analytics/internal-crm-dashboard-analytics-service.ts"
  "services/api/src/http/routes/analytics-internal-crm-dashboard.ts"
  "services/api/tests/p13-internal-dashboard-analytics-route.test.ts"
  "services/api/tests/p13-internal-dashboard-analytics-service.test.ts"
  "services/api/tests/p13-internal-dashboard-analytics-workspace-boundary.test.ts"
  "services/api/tests/p13-internal-dashboard-analytics-input-validation.test.ts"
  "services/api/tests/p13-internal-dashboard-analytics-security-redaction.test.ts"
  "services/api/tests/p13-internal-dashboard-analytics-no-billing-side-effect.test.ts"
  "services/api/tests/p13-internal-dashboard-analytics-no-provider-ai-side-effect.test.ts"
  "services/api/tests/p13-internal-dashboard-analytics-no-background-job-side-effect.test.ts"
  "apps/dashboard/src/components/InternalCrmDashboardAnalyticsPanel.tsx"
  "apps/dashboard/src/components/p13-internal-dashboard-analytics-wiring.test.tsx"
  "apps/dashboard/src/components/p13-internal-dashboard-analytics-security.test.tsx"
  "apps/extension/src/tests/p13-internal-dashboard-analytics-extension-boundary.test.ts"
)

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat \
  docs/product/CLARA-P13-INTERNAL-DASHBOARD-ANALYTICS-WIRING.md \
  docs/product/CLARA-P13-INTERNAL-CRM-ACTIVATION-ROADMAP.md \
  docs/product/CLARA-P13-BILLING-DEFERRED-POLICY.md \
  docs/product/CLARA-FINAL-ROADMAP.md \
  docs/product/CLARA-DOCUMENTATION-INDEX.md \
  README.md \
  services/api/README.md \
  apps/dashboard/README.md)"

required_phrases=(
  "P13-PR-01 is complete"
  "P13-PR-02 is complete"
  "P13-PR-03 is complete"
  "P13-PR-04 is complete"
  "P13-PR-05 is complete"
  "P13-PR-06 is current"
  "internal CRM usage is the focus"
  "billing/payment is deferred"
  "analytics are safe aggregated workspace-scoped metrics"
  "this PR does not add billing/payment/provider/AI/outbound behavior"
  "this PR does not add heavy analytics jobs or exports"
  "CLARA is not production deployed yet"
  "CLARA is not public GA launched yet"
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

p13_runtime_sources=(
  services/api/src/analytics/internal-crm-dashboard-analytics-service.ts
  services/api/src/http/routes/analytics-internal-crm-dashboard.ts
  apps/dashboard/src/api/client.ts
  apps/dashboard/src/components/InternalCrmDashboardAnalyticsPanel.tsx
  apps/dashboard/src/components/ConversationWorkspace.tsx
)

if grep -nE 'stripe|checkout|invoice|chargeCustomer|subscriptionMutation|quotaEnforce' "${p13_runtime_sources[@]}"; then
  fail "unexpected billing/payment runtime activation"
fi

if grep -nE 'dangerouslySetInnerHTML|rawHtml|raw_provider_payload|access_token|refresh_token|client_secret|providerRawError|rawGmailPayload' "${p13_runtime_sources[@]}"; then
  fail "unsafe raw payload/token/html runtime pattern found"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if git ls-remote --exit-code --heads origin feat/p13-internal-dashboard-analytics-wiring >/dev/null 2>&1; then
  :
else
  echo "WARN: remote branch feat/p13-internal-dashboard-analytics-wiring not found yet; push before final release validation." >&2
fi

echo "CLARA P13-PR-06 VALIDATION PASSED"
