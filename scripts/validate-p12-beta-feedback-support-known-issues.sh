#!/usr/bin/env bash
set -euo pipefail

EXPECTED_BRANCH="chore/p12-beta-feedback-support-known-issues-workflow"
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
  docs/product/CLARA-P12-BETA-FEEDBACK-WORKFLOW.md
  docs/product/CLARA-P12-BETA-FEEDBACK-PRIVACY-BOUNDARY.md
  docs/product/CLARA-P12-SUPPORT-TRIAGE-RUNBOOK.md
  docs/product/CLARA-P12-BETA-SUPPORT-SLA-POLICY.md
  docs/product/CLARA-P12-KNOWN-ISSUES-WORKFLOW.md
  docs/product/CLARA-P12-BLOCKER-ISSUE-CLASSIFICATION.md
  docs/product/CLARA-P12-BETA-INCIDENT-ESCALATION-POLICY.md
  docs/product/CLARA-P12-USER-FEEDBACK-INTAKE-TEMPLATE.md
  docs/product/CLARA-P12-SUPPORT-EVIDENCE-CHECKLIST.md
  docs/product/CLARA-P12-RELEASE-NOTES-BETA-CHANGELOG-POLICY.md
  docs/product/CLARA-P12-GA-BLOCKER-REVIEW-CHECKLIST.md
)

for doc in "${required_docs[@]}"; do
  [[ -f "$doc" ]] || {
    echo "Missing required P12 feedback/support doc: $doc" >&2
    exit 1
  }
done

p12_feedback_docs_text="$(mktemp)"
cat "${required_docs[@]}" > "$p12_feedback_docs_text"

grep -q "P12-PR-01 is complete" "$p12_feedback_docs_text"
grep -q "P12-PR-02 is complete" "$p12_feedback_docs_text"
grep -q "P12-PR-03 is complete" "$p12_feedback_docs_text"
grep -q "P12-PR-04 is current" "$p12_feedback_docs_text"
grep -q "CLARA is not GA yet" "$p12_feedback_docs_text"
grep -q "The beta feedback workflow is controlled and privacy-safe" "$p12_feedback_docs_text"
grep -q "Known issues must be reviewed before GA" "$p12_feedback_docs_text"
grep -q "Feedback/support must not collect raw sensitive data" "$p12_feedback_docs_text"
grep -q "No external support tool integration happens in this PR" "$p12_feedback_docs_text"
grep -q "No auto-send or external ticket creation happens in this PR" "$p12_feedback_docs_text"
grep -q "No provider/payment/AI/outbound activation happens in this PR" "$p12_feedback_docs_text"

for phrase in "feedback id" "Forbidden Feedback Data" "Support Severity" "Known Issue Lifecycle" "GA Blocker Categories" "Evidence Checklist"; do
  grep -q "$phrase" "$p12_feedback_docs_text"
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

echo "CLARA P12-PR-04 VALIDATION PASSED"
