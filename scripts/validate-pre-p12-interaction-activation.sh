#!/usr/bin/env bash
set -euo pipefail

EXPECTED_BRANCH="feat/pre-p12-core-demo-interaction-activation"
CURRENT_BRANCH="$(git branch --show-current)"

if [[ "$CURRENT_BRANCH" != "$EXPECTED_BRANCH" ]]; then
  echo "Expected branch $EXPECTED_BRANCH, got $CURRENT_BRANCH" >&2
  exit 1
fi

if git ls-files --error-unmatch .agents >/dev/null 2>&1; then
  echo ".agents/ must not be tracked" >&2
  exit 1
fi

if git ls-files --error-unmatch skills-lock.json >/dev/null 2>&1; then
  echo "skills-lock.json must not be tracked" >&2
  exit 1
fi

if git ls-files | grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' >/dev/null; then
  echo "Committed env files are not allowed" >&2
  exit 1
fi

if git ls-files | grep -E '(^|/)(dist|build|coverage)(/|$)' >/dev/null; then
  echo "Committed build artifacts are not allowed" >&2
  exit 1
fi

dashboard_runtime_files="$(find apps/dashboard/src -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' \) ! -name '*.test.ts' ! -name '*.test.tsx' ! -path '*/test/*')"

if grep -R "dangerouslySetInnerHTML\|\.innerHTML\|https://fonts.googleapis.com\|googletagmanager\|gtag(\|mixpanel\|segment.io" $dashboard_runtime_files >/dev/null; then
  echo "Unsafe dashboard rendering/tracking pattern found" >&2
  exit 1
fi

if grep -REi "from ['\"](@stripe|stripe|@paypal|paypal|midtrans|xendit)|loadStripe|redirectToCheckout|createCheckout|chargeCustomer|createInvoice|enforceQuota|runLoadTest|executeJob|sendAlert|runBackup|runRestore|autoSend" $dashboard_runtime_files >/dev/null; then
  echo "Unsafe production side-effect action found in dashboard runtime" >&2
  exit 1
fi

if grep -Ri "access_token.*display\|refresh_token.*display\|api key.*display\|secret.*display\|raw payload.*display\|raw html.*render" $dashboard_runtime_files >/dev/null; then
  echo "Unsafe token/secret/raw payload display pattern found" >&2
  exit 1
fi

grep -R "Copy suggestion to composer" apps/dashboard/src/components/*.test.tsx >/dev/null
grep -R "Copy draft" apps/dashboard/src/components/*.test.tsx >/dev/null
grep -R "Draft saved locally" apps/dashboard/src/components/*.test.tsx >/dev/null
grep -R "Queue / Chat Masuk" apps/dashboard/src/components/*.test.tsx >/dev/null
grep -R "intentionally disabled before P12" apps/dashboard/src/components/*.test.tsx >/dev/null

(cd apps/dashboard && npx --yes prettier "src/**/*.{ts,tsx}" --write && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  git ls-remote --exit-code --heads origin "$EXPECTED_BRANCH" >/dev/null
fi

echo "CLARA PRE-P12 INTERACTION ACTIVATION VALIDATION PASSED"
