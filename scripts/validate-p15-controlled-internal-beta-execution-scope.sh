#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "docs/p15-controlled-internal-beta-execution-scope" ]]; then
  fail "expected branch docs/p15-controlled-internal-beta-execution-scope, got ${current_branch}"
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
  "docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-EXECUTION-SCOPE.md"
  "docs/product/CLARA-P15-INTERNAL-BETA-OPERATING-RULES.md"
  "docs/product/CLARA-P15-INTERNAL-BETA-PARTICIPANT-RULES.md"
  "docs/product/CLARA-P15-INTERNAL-BETA-EVIDENCE-LOG-POLICY.md"
  "docs/product/CLARA-P15-INTERNAL-BETA-ISSUE-CAPTURE-POLICY.md"
  "docs/product/CLARA-P15-INTERNAL-BETA-ESCALATION-RULES.md"
  "docs/product/CLARA-P15-INTERNAL-BETA-OPERATING-CHECKLIST.md"
  "docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "services/api/tests/p15-controlled-internal-beta-execution-scope.test.ts"
  "services/api/tests/p15-internal-beta-operating-rules.test.ts"
  "services/api/tests/p15-internal-beta-participant-rules.test.ts"
  "services/api/tests/p15-internal-beta-evidence-log-policy.test.ts"
  "services/api/tests/p15-internal-beta-issue-capture-policy.test.ts"
  "services/api/tests/p15-internal-beta-escalation-rules.test.ts"
  "services/api/tests/p15-internal-beta-operating-checklist.test.ts"
  "services/api/tests/p15-no-public-launch-regression.test.ts"
  "services/api/tests/p15-no-production-deploy-claim.test.ts"
  "services/api/tests/p15-no-provider-billing-ai-outbound-side-effect.test.ts"
  "apps/dashboard/src/components/p15-controlled-internal-beta-execution.test.tsx"
  "apps/dashboard/src/components/p15-internal-beta-operating-rules-security.test.tsx"
  "apps/extension/src/tests/p15-controlled-internal-beta-extension-boundary.test.ts"
)

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat \
  docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-EXECUTION-SCOPE.md \
  docs/product/CLARA-P15-INTERNAL-BETA-OPERATING-RULES.md \
  docs/product/CLARA-P15-INTERNAL-BETA-PARTICIPANT-RULES.md \
  docs/product/CLARA-P15-INTERNAL-BETA-EVIDENCE-LOG-POLICY.md \
  docs/product/CLARA-P15-INTERNAL-BETA-ISSUE-CAPTURE-POLICY.md \
  docs/product/CLARA-P15-INTERNAL-BETA-ESCALATION-RULES.md \
  docs/product/CLARA-P15-INTERNAL-BETA-OPERATING-CHECKLIST.md \
  docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-ROADMAP.md \
  docs/product/CLARA-FINAL-ROADMAP.md \
  docs/product/CLARA-DOCUMENTATION-INDEX.md \
  README.md \
  services/api/README.md \
  apps/dashboard/README.md \
  apps/extension/README.md | tr '\n' ' ' | tr -s ' ')"

required_phrases=(
  "P14 Internal Beta Rollout Preparation is complete"
  "P14-PR-01 is complete"
  "P14-PR-02 is complete"
  "P14-PR-03 is complete"
  "P14-PR-04 is complete"
  "P14-PR-05 is complete"
  "P14-PR-06 is complete"
  "P15 Controlled Internal Beta Execution is current"
  "P15-PR-01 is current"
  "controlled internal beta is internal-only"
  "controlled internal beta is not public SaaS launch"
  "controlled internal beta is not production deployment claim unless separately executed"
  "billing/payment is deferred"
  "provider/AI/outbound activation remains controlled"
  "feedback/support remains manual/local/repo-safe unless separately approved"
  "no external support tool integration is activated"
  "AuthContext and workspace membership remain source of truth"
  "client-supplied workspaceId is not authoritative"
  "secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data must not be included"
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

if git ls-remote --exit-code --heads origin docs/p15-controlled-internal-beta-execution-scope >/dev/null 2>&1; then
  :
else
  echo "WARN: remote branch docs/p15-controlled-internal-beta-execution-scope not found yet; push before final release validation." >&2
fi

echo "CLARA P15-PR-01 VALIDATION PASSED"
