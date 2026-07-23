#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "test/p15-internal-runtime-smoke-evidence-log" ]]; then
  fail "expected branch test/p15-internal-runtime-smoke-evidence-log, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P15-INTERNAL-RUNTIME-SMOKE-EXECUTION-RUNBOOK.md"
  "docs/product/CLARA-P15-INTERNAL-RUNTIME-EVIDENCE-LOG-TEMPLATE.md"
  "docs/product/CLARA-P15-API-SMOKE-EXECUTION-CHECKLIST.md"
  "docs/product/CLARA-P15-DASHBOARD-SMOKE-EXECUTION-CHECKLIST.md"
  "docs/product/CLARA-P15-EXTENSION-SMOKE-EXECUTION-CHECKLIST.md"
  "docs/product/CLARA-P15-EVIDENCE-PRIVACY-BOUNDARY.md"
  "docs/product/CLARA-P15-EVIDENCE-RETENTION-HANDLING-POLICY.md"
  "docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

required_tests=(
  "services/api/tests/p15-internal-runtime-smoke-execution-runbook.test.ts"
  "services/api/tests/p15-internal-runtime-evidence-log-template.test.ts"
  "services/api/tests/p15-api-smoke-execution-checklist.test.ts"
  "services/api/tests/p15-dashboard-smoke-execution-checklist.test.ts"
  "services/api/tests/p15-extension-smoke-execution-checklist.test.ts"
  "services/api/tests/p15-evidence-privacy-boundary.test.ts"
  "services/api/tests/p15-evidence-retention-handling-policy.test.ts"
  "services/api/tests/p15-runtime-smoke-no-public-launch-regression.test.ts"
  "services/api/tests/p15-runtime-smoke-no-production-deploy-claim.test.ts"
  "services/api/tests/p15-runtime-smoke-no-provider-billing-ai-outbound-side-effect.test.ts"
  "apps/dashboard/src/components/p15-internal-runtime-smoke-execution.test.tsx"
  "apps/dashboard/src/components/p15-evidence-privacy-security.test.tsx"
  "apps/extension/src/tests/p15-internal-runtime-smoke-extension-boundary.test.ts"
)

for file in "${required_docs[@]}" "${required_tests[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P14 Internal Beta Rollout Preparation is complete"
  "P15 Controlled Internal Beta Execution is current"
  "P15-PR-01 is complete"
  "P15-PR-02 is current"
  "runtime smoke execution is internal-only"
  "runtime smoke execution is not public SaaS launch"
  "runtime smoke execution is not production deployment claim unless separately executed"
  "evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data"
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

if ! git ls-remote --exit-code --heads origin test/p15-internal-runtime-smoke-evidence-log >/dev/null 2>&1; then
  echo "WARN: remote branch test/p15-internal-runtime-smoke-evidence-log not found yet; push before final release validation." >&2
fi

echo "CLARA P15-PR-02 VALIDATION PASSED"
