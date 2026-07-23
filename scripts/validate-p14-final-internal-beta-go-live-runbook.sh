#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "chore/p14-final-internal-beta-go-live-runbook" ]]; then
  fail "expected branch chore/p14-final-internal-beta-go-live-runbook, got ${current_branch}"
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
  "docs/product/CLARA-P14-FINAL-INTERNAL-BETA-GO-LIVE-RUNBOOK.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-GO-NO-GO-CHECKLIST.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-OPERATOR-HANDOFF.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-ADMIN-HANDOFF.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-SUPPORT-HANDOFF.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-ROLLBACK-HANDOFF.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-KNOWN-LIMITATIONS-REVIEW.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-FINAL-SECURITY-REVIEW.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-FINAL-HANDOFF-SUMMARY.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md"
  "docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "services/api/tests/p14-final-internal-beta-go-live-runbook.test.ts"
  "services/api/tests/p14-final-internal-beta-go-no-go-checklist.test.ts"
  "services/api/tests/p14-final-internal-beta-handoff-completeness.test.ts"
  "services/api/tests/p14-final-internal-beta-known-limitations-review.test.ts"
  "services/api/tests/p14-final-internal-beta-security-review.test.ts"
  "services/api/tests/p14-final-internal-beta-no-public-launch-regression.test.ts"
  "services/api/tests/p14-final-internal-beta-no-production-deploy-claim.test.ts"
  "services/api/tests/p14-final-internal-beta-no-billing-side-effect.test.ts"
  "services/api/tests/p14-final-internal-beta-no-provider-ai-outbound-side-effect.test.ts"
  "services/api/tests/p14-final-internal-beta-no-external-support-side-effect.test.ts"
  "apps/dashboard/src/components/p14-final-internal-beta-go-live-runbook.test.tsx"
  "apps/dashboard/src/components/p14-final-internal-beta-security.test.tsx"
  "apps/dashboard/src/components/p14-final-internal-beta-ui-regression.test.tsx"
  "apps/extension/src/tests/p14-final-internal-beta-extension-boundary.test.ts"
)

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat \
  docs/product/CLARA-P14-FINAL-INTERNAL-BETA-GO-LIVE-RUNBOOK.md \
  docs/product/CLARA-P14-INTERNAL-BETA-GO-NO-GO-CHECKLIST.md \
  docs/product/CLARA-P14-INTERNAL-BETA-OPERATOR-HANDOFF.md \
  docs/product/CLARA-P14-INTERNAL-BETA-ADMIN-HANDOFF.md \
  docs/product/CLARA-P14-INTERNAL-BETA-SUPPORT-HANDOFF.md \
  docs/product/CLARA-P14-INTERNAL-BETA-ROLLBACK-HANDOFF.md \
  docs/product/CLARA-P14-INTERNAL-BETA-KNOWN-LIMITATIONS-REVIEW.md \
  docs/product/CLARA-P14-INTERNAL-BETA-FINAL-SECURITY-REVIEW.md \
  docs/product/CLARA-P14-INTERNAL-BETA-FINAL-HANDOFF-SUMMARY.md \
  docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md \
  docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md \
  docs/product/CLARA-FINAL-ROADMAP.md \
  docs/product/CLARA-DOCUMENTATION-INDEX.md \
  README.md \
  services/api/README.md \
  apps/dashboard/README.md \
  apps/extension/README.md | tr '\n' ' ' | tr -s ' ')"

required_phrases=(
  "P14-PR-01 is complete"
  "P14-PR-02 is complete"
  "P14-PR-03 is complete"
  "P14-PR-04 is complete"
  "P14-PR-05 is complete"
  "P14-PR-06 is current"
  "P14 internal beta rollout preparation is complete only after this PR validates"
  "Internal beta go-live is controlled internal usage only"
  "Internal beta is not public SaaS launch"
  "Internal beta is not production deployment claim unless separately executed"
  "billing/payment is deferred"
  "provider/AI/outbound activation remains controlled"
  "Feedback/support remains manual/local/repo-safe unless separately approved"
  "no external support tool integration is activated"
  "AuthContext and workspace membership remain source of truth"
  "client-supplied workspaceId is not authoritative"
  "Secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data must not be included in handoff, feedback, logs, docs, or runbooks"
  "Known limitations must be reviewed before broader rollout"
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

if grep -nE 'stripe|createCheckoutSession|createInvoice|chargeCustomer|createSubscription|subscriptionMutation|paymentIntent' "${runtime_sources[@]}"; then
  fail "unexpected payment/billing runtime activation"
fi

if grep -nE 'OpenAI|Anthropic|runAiAction|autoSend|sendExternal|sendNotification|deployProduction|rollbackProduction|queue\.add|enqueue|cron\.schedule|new Worker|dangerouslySetInnerHTML' "${runtime_sources[@]}"; then
  fail "unexpected provider/AI/outbound/deployment/job/raw HTML runtime activation"
fi

if grep -nE 'sendSlack|sendDiscord|sendWebhook|pushNotification|createSupportTicket|notifySupport|zendesk|intercom|freshdesk|jira' "${runtime_sources[@]}"; then
  fail "unexpected external support or notification activation"
fi

if grep -nE 'renderRaw|displayRaw|returnRaw|persistRaw|storeRaw|raw.*Payload.*response|access_token.*return|refresh_token.*return|Authorization header.*return' "${runtime_sources[@]}"; then
  fail "unsafe raw payload/token response pattern found"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/extension/src/**/*.{ts,tsx}" --write
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if git ls-remote --exit-code --heads origin chore/p14-final-internal-beta-go-live-runbook >/dev/null 2>&1; then
  :
else
  echo "WARN: remote branch chore/p14-final-internal-beta-go-live-runbook not found yet; push before final release validation." >&2
fi

echo "CLARA P14-PR-06 VALIDATION PASSED"
