#!/usr/bin/env bash
set -euo pipefail

EXPECTED_BRANCH="docs/p12-beta-ga-scope-release-criteria"
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
  docs/product/CLARA-P12-BETA-GA-SCOPE-RELEASE-CRITERIA.md
  docs/product/CLARA-P12-IMPLEMENTATION-ROADMAP.md
  docs/product/CLARA-P12-BETA-ELIGIBILITY-CHECKLIST.md
  docs/product/CLARA-P12-GA-RELEASE-CRITERIA.md
  docs/product/CLARA-P12-RELEASE-CANDIDATE-READINESS-POLICY.md
  docs/product/CLARA-P12-GO-NO-GO-CHECKLIST.md
  docs/product/CLARA-P12-LAUNCH-RISK-REGISTER.md
  docs/product/CLARA-P12-KNOWN-LIMITATIONS.md
  docs/product/CLARA-P12-SUPPORT-FEEDBACK-READINESS-BOUNDARY.md
)

for doc in "${required_docs[@]}"; do
  [[ -f "$doc" ]] || {
    echo "Missing required P12 doc: $doc" >&2
    exit 1
  }
done

p12_docs_text="$(mktemp)"
cat "${required_docs[@]}" > "$p12_docs_text"

grep -q "P12 is current" "$p12_docs_text"
grep -q "P12-PR-01 is current work" "$p12_docs_text"
grep -q "CLARA is not GA yet" "$p12_docs_text"
grep -q "CLARA is not production deployed yet" "$p12_docs_text"
grep -q "Beta and GA are different gates" "$p12_docs_text"
grep -qi "payment provider integration" "$p12_docs_text"
grep -qi "AI activation" "$p12_docs_text"
grep -qi "provider activation" "$p12_docs_text"
grep -qi "billing" "$p12_docs_text"

runtime_find=(find services/api/src apps/dashboard/src apps/extension/src -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' \) ! -name '*.test.ts' ! -name '*.test.tsx' ! -path '*/tests/*' ! -path '*/test/*' -print0)

if "${runtime_find[@]}" | xargs -0 grep -REi "dangerouslySetInnerHTML|\\.innerHTML|renderRawHtml|displayRawHtml|raw payload.*display|access_token.*display|refresh_token.*display|secret.*display" >/dev/null; then
  echo "Unsafe raw rendering/token display pattern found in runtime source" >&2
  exit 1
fi

if "${runtime_find[@]}" | xargs -0 grep -REi "from ['\"](@stripe|stripe|@paypal|paypal|midtrans|xendit)|loadStripe|redirectToCheckout|createCheckout|chargeCustomer|createInvoice|mutateSubscription|enforceQuota|runLoadTest|executeJob|enqueueJob|sendAlert|runBackup|runRestore|autoSend|callRealAiProvider" >/dev/null; then
  echo "Unsafe production activation pattern found in runtime source" >&2
  exit 1
fi

(cd services/api && npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)
(cd apps/dashboard && npx --yes prettier "src/**/*.{ts,tsx}" --write && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)
(cd apps/extension && npx --yes prettier "src/**/*.ts" "src/**/*.tsx" --write && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  git ls-remote --exit-code --heads origin "$EXPECTED_BRANCH" >/dev/null
fi

echo "CLARA P12-PR-01 VALIDATION PASSED"
