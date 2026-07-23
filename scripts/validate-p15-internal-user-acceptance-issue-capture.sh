#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "test/p15-internal-user-acceptance-issue-capture" ]]; then
  fail "expected branch test/p15-internal-user-acceptance-issue-capture, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P15-INTERNAL-UAT-SESSION-PLAN.md"
  "docs/product/CLARA-P15-INTERNAL-UAT-OPERATOR-SCRIPT.md"
  "docs/product/CLARA-P15-INTERNAL-UAT-ADMIN-SCRIPT.md"
  "docs/product/CLARA-P15-INTERNAL-UAT-VIEWER-SCRIPT.md"
  "docs/product/CLARA-P15-INTERNAL-UAT-ACCEPTANCE-CRITERIA.md"
  "docs/product/CLARA-P15-INTERNAL-UAT-ISSUE-CAPTURE-TEMPLATE.md"
  "docs/product/CLARA-P15-INTERNAL-UAT-USABILITY-FEEDBACK-TEMPLATE.md"
  "docs/product/CLARA-P15-INTERNAL-UAT-SEVERITY-PRIORITY-RULES.md"
  "docs/product/CLARA-P15-INTERNAL-UAT-EVIDENCE-SAFETY-RULES.md"
  "docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

required_tests=(
  "services/api/tests/p15-internal-uat-session-plan.test.ts"
  "services/api/tests/p15-internal-uat-operator-script.test.ts"
  "services/api/tests/p15-internal-uat-admin-script.test.ts"
  "services/api/tests/p15-internal-uat-viewer-script.test.ts"
  "services/api/tests/p15-internal-uat-acceptance-criteria.test.ts"
  "services/api/tests/p15-internal-uat-issue-capture-template.test.ts"
  "services/api/tests/p15-internal-uat-usability-feedback-template.test.ts"
  "services/api/tests/p15-internal-uat-severity-priority-rules.test.ts"
  "services/api/tests/p15-internal-uat-evidence-safety-rules.test.ts"
  "services/api/tests/p15-uat-no-provider-billing-ai-outbound-side-effect.test.ts"
  "apps/dashboard/src/components/p15-internal-uat-session.test.tsx"
  "apps/dashboard/src/components/p15-internal-uat-issue-capture-security.test.tsx"
  "apps/extension/src/tests/p15-internal-uat-extension-boundary.test.ts"
)

for file in "${required_docs[@]}" "${required_tests[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P14 Internal Beta Rollout Preparation is complete"
  "P15 Controlled Internal Beta Execution is current"
  "P15-PR-01 is complete"
  "P15-PR-02 is complete"
  "P15-PR-03 is current"
  "user acceptance session is internal-only"
  "UAT issue capture is manual/local/repo-safe unless separately approved"
  "UAT is not public SaaS launch"
  "UAT is not production deployment claim unless separately executed"
  "evidence and issue reports must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data"
  "billing/payment is deferred"
  "provider/AI/outbound activation remains controlled"
  "feedback/support remains manual/local/repo-safe unless separately approved"
  "no external support tool integration is activated"
  "AuthContext and workspace membership remain source of truth"
  "client-supplied workspaceId is not authoritative"
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

runtime_sources=(
  services/api/src/auth/permissions.ts
  services/api/src/auth/user-role-management-policy.ts
  services/api/src/customers/customer-service.ts
  services/api/src/conversations/conversation-service.ts
  services/api/src/http/routes/customers.ts
  services/api/src/http/routes/conversations.ts
  apps/dashboard/src/App.tsx
  apps/dashboard/src/components/ConversationWorkspace.tsx
  apps/extension/src/api/clara-extension-api-client.ts
)

if grep -nE 'stripe|createCheckoutSession|createInvoice|chargeCustomer|createSubscription|subscriptionMutation|paymentIntent|enforceQuota' "${runtime_sources[@]}"; then
  fail "unexpected payment/billing/quota runtime activation"
fi

if grep -nE 'OpenAI|Anthropic|runAiAction|autonomousAi|autoSend|sendExternal|sendNotification' "${runtime_sources[@]}"; then
  fail "unexpected provider/AI/outbound runtime activation"
fi

if grep -nE 'sendEmail|sendSlack|sendDiscord|sendWebhook|pushNotification|createSupportTicket|notifySupport|zendesk|intercom|freshdesk|jira' "${runtime_sources[@]}"; then
  fail "unexpected notification or external support activation"
fi

if grep -nE 'deployProduction|rollbackProduction|queue\.add|enqueue|cron\.schedule|new Worker|exportReport|generateReport|heavyAnalytics' "${runtime_sources[@]}"; then
  fail "unexpected deployment/job/export runtime activation"
fi

if grep -nE 'renderRaw|displayRaw|returnRaw|persistRaw|storeRaw|raw.*Payload.*response|raw.*Audit.*response|access_token.*return|refresh_token.*return|Authorization header.*return|dangerouslySetInnerHTML' "${runtime_sources[@]}"; then
  fail "unsafe raw payload/token/HTML response pattern found"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/extension/src/**/*.{ts,tsx}" --write
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if ! git ls-remote --exit-code --heads origin test/p15-internal-user-acceptance-issue-capture >/dev/null 2>&1; then
  echo "WARN: remote branch test/p15-internal-user-acceptance-issue-capture not found yet; push before final release validation." >&2
fi

echo "CLARA P15-PR-03 VALIDATION PASSED"
