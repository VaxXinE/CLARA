#!/usr/bin/env bash
set -euo pipefail

EXPECTED_BRANCH="chore/p12-production-deployment-checklist-rollback-drill"
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

required_docs=(
  docs/product/CLARA-P12-PRODUCTION-DEPLOYMENT-CHECKLIST.md
  docs/product/CLARA-P12-ROLLBACK-DRILL-RUNBOOK.md
  docs/product/CLARA-P12-PRODUCTION-CONFIG-READINESS-CHECKLIST.md
  docs/product/CLARA-P12-SECRETS-ENV-READINESS-CHECKLIST.md
  docs/product/CLARA-P12-DATABASE-MIGRATION-ROLLBACK-CHECKLIST.md
  docs/product/CLARA-P12-DNS-TLS-CORS-READINESS-CHECKLIST.md
  docs/product/CLARA-P12-DEPLOYMENT-CUTOVER-GO-NO-GO-POLICY.md
  docs/product/CLARA-P12-POST-DEPLOYMENT-SMOKE-CHECKLIST.md
  docs/product/CLARA-P12-ROLLBACK-EVIDENCE-CHECKLIST.md
)

for doc in "${required_docs[@]}"; do
  [[ -f "$doc" ]] || {
    echo "Missing required P12 deployment/rollback doc: $doc" >&2
    exit 1
  }
done

p12_deploy_docs_text="$(mktemp)"
cat "${required_docs[@]}" > "$p12_deploy_docs_text"

grep -q "P12-PR-01 is complete" "$p12_deploy_docs_text"
grep -q "P12-PR-02 is complete" "$p12_deploy_docs_text"
grep -q "P12-PR-03 is current" "$p12_deploy_docs_text"
grep -q "CLARA is not GA yet" "$p12_deploy_docs_text"
grep -q "CLARA is not production deployed yet" "$p12_deploy_docs_text"
grep -q "The deployment checklist is a readiness gate, not deployment execution" "$p12_deploy_docs_text"
grep -q "Rollback drill is not automatic production rollback" "$p12_deploy_docs_text"
grep -q "No real provider/payment/AI/outbound activation happens in this PR" "$p12_deploy_docs_text"

for area in API Dashboard Extension Auth Workspace Database Backup Secrets CORS TLS DNS "Logging/Redaction" "Rate Limit" "Provider readiness" "Billing readiness" "AI review-only" "Analytics safe-summary" "Extension boundary"; do
  grep -q "$area" docs/product/CLARA-P12-PRODUCTION-DEPLOYMENT-CHECKLIST.md
done

runtime_find=(find services/api/src apps/dashboard/src apps/extension/src -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' \) ! -name '*.test.ts' ! -name '*.test.tsx' ! -path '*/tests/*' ! -path '*/test/*' -print0)

if "${runtime_find[@]}" | xargs -0 grep -REi "dangerouslySetInnerHTML|\\.innerHTML|renderRawHtml|displayRawHtml|raw payload.*display|access_token.*display|refresh_token.*display|secret.*display" >/dev/null; then
  echo "Unsafe raw rendering/token display pattern found in runtime source" >&2
  exit 1
fi

if "${runtime_find[@]}" | xargs -0 grep -REi "deployProduction|rollbackProduction|from ['\"](@stripe|stripe|@paypal|paypal|midtrans|xendit)|loadStripe|redirectToCheckout|createCheckout|chargeCustomer|createInvoice|mutateSubscription|enforceQuota|runLoadTest|executeJob|enqueueJob|sendAlert|runBackup|runRestore|autoSend|callRealAiProvider" >/dev/null; then
  echo "Unsafe production deployment/activation pattern found in runtime source" >&2
  exit 1
fi

(cd services/api && npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)
(cd apps/dashboard && npx --yes prettier "src/**/*.{ts,tsx}" --write && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)
(cd apps/extension && npx --yes prettier "src/**/*.ts" "src/**/*.tsx" --write && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  git ls-remote --exit-code --heads origin "$EXPECTED_BRANCH" >/dev/null
fi

echo "CLARA P12-PR-03 VALIDATION PASSED"
