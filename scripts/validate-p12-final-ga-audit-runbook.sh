#!/usr/bin/env bash
set -euo pipefail

EXPECTED_BRANCH="chore/p12-final-ga-audit-runbook"
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
  docs/product/CLARA-P12-FINAL-GA-AUDIT-RUNBOOK.md
  docs/product/CLARA-P12-FINAL-RELEASE-READINESS-SUMMARY.md
  docs/product/CLARA-P12-FINAL-GA-READINESS-CHECKLIST.md
  docs/product/CLARA-P12-FINAL-SECURITY-BOUNDARY-REVIEW.md
  docs/product/CLARA-P12-FINAL-OPERATIONAL-READINESS-REVIEW.md
  docs/product/CLARA-P12-FINAL-KNOWN-LIMITATIONS-REVIEW.md
  docs/product/CLARA-P12-FINAL-GO-NO-GO-DECISION-RECORD.md
  docs/product/CLARA-P12-FINAL-OPERATOR-RUNBOOK.md
  docs/product/CLARA-P12-FINAL-ADMIN-RUNBOOK.md
  docs/product/CLARA-P12-FINAL-SUPPORT-HANDOFF.md
  docs/product/CLARA-P12-FINAL-ROLLBACK-INCIDENT-HANDOFF.md
  docs/product/CLARA-P12-FINAL-EVIDENCE-CHECKLIST.md
  docs/product/CLARA-P12-POST-P12-HANDOFF.md
)

for doc in "${required_docs[@]}"; do
  [[ -f "$doc" ]] || {
    echo "Missing required P12 final doc: $doc" >&2
    exit 1
  }
done

p12_final_docs_text="$(mktemp)"
cat "${required_docs[@]}" > "$p12_final_docs_text"

for phrase in \
  "P12-PR-01 is complete" \
  "P12-PR-02 is complete" \
  "P12-PR-03 is complete" \
  "P12-PR-04 is complete" \
  "P12-PR-05 is current" \
  "P12 completion means release readiness complete" \
  "P12 completion does not mean production deployed" \
  "P12 completion does not mean public GA launch happened" \
  "Production deployment requires separate explicit approval and execution" \
  "Provider/payment/AI/outbound activation remains restricted unless future approved work enables it" \
  "Readiness-only/review-only/simulated/demo-safe boundaries remain intact"; do
  grep -q "$phrase" "$p12_final_docs_text"
done

for coverage in \
  "Roadmap completion" \
  "Beta scope criteria" \
  "GA release criteria" \
  "Release candidate validation" \
  "Smoke test matrix" \
  "Deployment checklist" \
  "Rollback drill" \
  "Beta feedback workflow" \
  "Support triage workflow" \
  "Known issues workflow" \
  "Auth/session" \
  "Workspace isolation" \
  "Provider readiness" \
  "AI review-only boundary" \
  "Billing readiness-only boundary" \
  "Analytics safe-summary boundary" \
  "Enterprise/compliance readiness" \
  "Extension safe active-chat boundary" \
  "Secret/env readiness" \
  "No raw payload exposure" \
  "No production side effects" \
  "No external support tool side effects" \
  "Final No-Go Blockers"; do
  grep -q "$coverage" "$p12_final_docs_text"
done

runtime_find=(find services/api/src apps/dashboard/src apps/extension/src -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' \) ! -name '*.test.ts' ! -name '*.test.tsx' ! -path '*/tests/*' ! -path '*/test/*' -print0)

if "${runtime_find[@]}" | xargs -0 grep -REi "dangerouslySetInnerHTML|\\.innerHTML|renderRawHtml|displayRawHtml|raw payload.*display|access_token.*display|refresh_token.*display|secret.*display" >/dev/null; then
  echo "Unsafe raw rendering/token display pattern found in runtime source" >&2
  exit 1
fi

if "${runtime_find[@]}" | xargs -0 grep -REi "zendesk|intercom|freshdesk|jira|createSupportTicket|createExternalTicket|sendEmailNotification|sendSlackMessage|sendDiscordMessage|webhookNotify|deployProduction|rollbackProduction|from ['\"](@stripe|stripe|@paypal|paypal|midtrans|xendit)|loadStripe|redirectToCheckout|createCheckout|chargeCustomer|createInvoice|mutateSubscription|enforceQuota|runLoadTest|executeJob|enqueueJob|sendAlert|runBackup|runRestore|autoSend|callRealAiProvider" >/dev/null; then
  echo "Unsafe support/production activation pattern found in runtime source" >&2
  exit 1
fi

(cd services/api && npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)
(cd apps/dashboard && npx --yes prettier "src/**/*.{ts,tsx}" --write && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)
(cd apps/extension && npx --yes prettier "src/**/*.ts" "src/**/*.tsx" --write && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  git ls-remote --exit-code --heads origin "$EXPECTED_BRANCH" >/dev/null
fi

echo "CLARA P12-PR-05 VALIDATION PASSED"
