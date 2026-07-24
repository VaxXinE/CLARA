#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "chore/p15-combined-internal-beta-stabilization-handoff" ]]; then
  fail "expected branch chore/p15-combined-internal-beta-stabilization-handoff, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P15-INTERNAL-BETA-BUGFIX-TRIAGE-POLICY.md"
  "docs/product/CLARA-P15-INTERNAL-BETA-BUGFIX-TRIAGE-BATCH-1-CHECKLIST.md"
  "docs/product/CLARA-P15-INTERNAL-BETA-STABILIZATION-REVIEW.md"
  "docs/product/CLARA-P15-INTERNAL-BETA-KNOWN-ISSUE-DISPOSITION.md"
  "docs/product/CLARA-P15-INTERNAL-BETA-RISK-ACCEPTANCE-REGISTER.md"
  "docs/product/CLARA-P15-FINAL-INTERNAL-BETA-EXECUTION-HANDOFF.md"
  "docs/product/CLARA-P15-CLOSURE-SUMMARY.md"
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-INGESTION-TRANSITION-PLAN.md"
  "docs/product/CLARA-P16-P17-COMPRESSED-ROADMAP.md"
  "docs/product/CLARA-P15-CONTROLLED-INTERNAL-BETA-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

required_tests=(
  "services/api/tests/p15-internal-beta-bugfix-triage-policy.test.ts"
  "services/api/tests/p15-internal-beta-bugfix-triage-batch-1.test.ts"
  "services/api/tests/p15-internal-beta-stabilization-review.test.ts"
  "services/api/tests/p15-internal-beta-known-issue-disposition.test.ts"
  "services/api/tests/p15-internal-beta-risk-acceptance-register.test.ts"
  "services/api/tests/p15-final-internal-beta-execution-handoff.test.ts"
  "services/api/tests/p15-closure-summary.test.ts"
  "services/api/tests/p16-extension-assisted-transition-plan.test.ts"
  "services/api/tests/p16-p17-compressed-roadmap.test.ts"
  "services/api/tests/p15-final-no-provider-billing-ai-outbound-side-effect.test.ts"
  "apps/dashboard/src/components/p15-internal-beta-stabilization-handoff.test.tsx"
  "apps/dashboard/src/components/p16-extension-assisted-transition-security.test.tsx"
  "apps/extension/src/tests/p15-final-stabilization-handoff-extension-boundary.test.ts"
  "apps/extension/src/tests/p16-extension-assisted-transition-boundary.test.ts"
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
  "P15-PR-03 is complete"
  "P15-PR-04 is current"
  "P15 closes only after this PR validates"
  "P16 Extension-Assisted Channel Ingestion Hardening is next"
  "extension-assisted ingestion is internal/controlled and user-assisted"
  "extension-assisted ingestion is not official WA/IG/TikTok API activation"
  "extension-assisted ingestion is not public SaaS launch"
  "extension-assisted ingestion is not production deployment claim unless separately executed"
  "billing/payment is deferred"
  "official provider APIs remain not activated"
  "real AI provider calls remain not activated in this PR"
  "provider/AI/outbound activation remains controlled"
  "feedback/support remains manual/local/repo-safe unless separately approved"
  "no external support tool integration is activated"
  "AuthContext and workspace membership remain source of truth"
  "client-supplied workspaceId is not authoritative"
  "evidence/issue reports/handoff/stabilization docs must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data"
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
  apps/extension/src/auto-sync/auto-sync-engine.ts
)

if grep -nE 'officialWhatsApp|officialInstagram|officialTikTok|whatsappProviderApi|instagramProviderApi|tiktokProviderApi' "${runtime_sources[@]}"; then
  fail "unexpected official WA/IG/TikTok provider API activation"
fi

if grep -nE 'stripe|createCheckoutSession|createInvoice|chargeCustomer|createSubscription|subscriptionMutation|paymentIntent|enforceQuota' "${runtime_sources[@]}"; then
  fail "unexpected payment/billing/quota runtime activation"
fi

if grep -nE 'OpenAI|Anthropic|runAiAction|autonomousAi|autoSend|callAiProvider|realAiProvider' "${runtime_sources[@]}"; then
  fail "unexpected real AI/autonomous/outbound runtime activation"
fi

if grep -nE 'sendEmail|sendSlack|sendDiscord|sendWebhook|pushNotification|createSupportTicket|notifySupport|zendesk|intercom|freshdesk|jira' "${runtime_sources[@]}"; then
  fail "unexpected notification or external support activation"
fi

if grep -nE 'deployProduction|rollbackProduction|queue\.add|enqueue|cron\.schedule|new Worker|exportReport|generateReport|heavyAnalytics' "${runtime_sources[@]}"; then
  fail "unexpected deployment/job/export runtime activation"
fi

if grep -nE 'renderRaw|displayRaw|returnRaw|persistRaw|storeRaw|raw.*Provider.*response|raw.*Webhook.*response|raw.*Audit.*response|access_token.*return|refresh_token.*return|Authorization header.*return|dangerouslySetInnerHTML' "${runtime_sources[@]}"; then
  fail "unsafe raw payload/token/HTML response pattern found"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/extension/src/**/*.{ts,tsx}" --write
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if ! git ls-remote --exit-code --heads origin chore/p15-combined-internal-beta-stabilization-handoff >/dev/null 2>&1; then
  echo "WARN: remote branch chore/p15-combined-internal-beta-stabilization-handoff not found yet; push before final release validation." >&2
fi

echo "CLARA P15-PR-04 VALIDATION PASSED"
