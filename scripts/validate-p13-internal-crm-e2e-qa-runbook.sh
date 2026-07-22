#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "chore/p13-internal-crm-e2e-qa-runbook" ]]; then
  fail "expected branch chore/p13-internal-crm-e2e-qa-runbook, got ${current_branch}"
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
  "docs/product/CLARA-P13-INTERNAL-CRM-E2E-QA-RUNBOOK.md"
  "docs/product/CLARA-P13-INTERNAL-CRM-OPERATOR-RUNBOOK.md"
  "docs/product/CLARA-P13-INTERNAL-CRM-ADMIN-RUNBOOK.md"
  "docs/product/CLARA-P13-INTERNAL-CRM-SMOKE-CHECKLIST.md"
  "docs/product/CLARA-P13-INTERNAL-CRM-DEMO-SCRIPT.md"
  "docs/product/CLARA-P13-INTERNAL-CRM-KNOWN-LIMITATIONS.md"
  "docs/product/CLARA-P13-INTERNAL-CRM-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-P13-INTERNAL-CRM-HANDOFF-SUMMARY.md"
  "docs/product/CLARA-P13-INTERNAL-CRM-ACTIVATION-ROADMAP.md"
  "docs/product/CLARA-P13-BILLING-DEFERRED-POLICY.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "services/api/tests/p13-final-internal-crm-e2e-flow.test.ts"
  "services/api/tests/p13-final-internal-crm-workspace-boundary.test.ts"
  "services/api/tests/p13-final-internal-crm-readonly-policy.test.ts"
  "services/api/tests/p13-final-internal-crm-audit-timeline-safety.test.ts"
  "services/api/tests/p13-final-internal-crm-billing-deferred-regression.test.ts"
  "services/api/tests/p13-final-internal-crm-no-provider-ai-outbound-regression.test.ts"
  "services/api/tests/p13-final-internal-crm-no-background-job-regression.test.ts"
  "services/api/tests/p13-final-internal-crm-runbook-completeness.test.ts"
  "apps/dashboard/src/components/p13-final-internal-crm-e2e-qa.test.tsx"
  "apps/dashboard/src/components/p13-final-internal-crm-readonly-security.test.tsx"
  "apps/dashboard/src/components/p13-final-internal-crm-runbook-ui-regression.test.tsx"
  "apps/extension/src/tests/p13-final-internal-crm-extension-boundary.test.ts"
)

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat \
  docs/product/CLARA-P13-INTERNAL-CRM-E2E-QA-RUNBOOK.md \
  docs/product/CLARA-P13-INTERNAL-CRM-OPERATOR-RUNBOOK.md \
  docs/product/CLARA-P13-INTERNAL-CRM-ADMIN-RUNBOOK.md \
  docs/product/CLARA-P13-INTERNAL-CRM-SMOKE-CHECKLIST.md \
  docs/product/CLARA-P13-INTERNAL-CRM-DEMO-SCRIPT.md \
  docs/product/CLARA-P13-INTERNAL-CRM-KNOWN-LIMITATIONS.md \
  docs/product/CLARA-P13-INTERNAL-CRM-SECURITY-CHECKLIST.md \
  docs/product/CLARA-P13-INTERNAL-CRM-HANDOFF-SUMMARY.md \
  docs/product/CLARA-P13-INTERNAL-CRM-ACTIVATION-ROADMAP.md \
  docs/product/CLARA-P13-BILLING-DEFERRED-POLICY.md \
  docs/product/CLARA-FINAL-ROADMAP.md \
  docs/product/CLARA-DOCUMENTATION-INDEX.md \
  README.md \
  services/api/README.md \
  apps/dashboard/README.md \
  apps/extension/README.md)"

required_phrases=(
  "P13-PR-01 is complete"
  "P13-PR-02 is complete"
  "P13-PR-03 is complete"
  "P13-PR-04 is complete"
  "P13-PR-05 is complete"
  "P13-PR-06 is complete"
  "P13-PR-07 is current"
  "internal CRM usage is the focus"
  "P13 internal CRM activation is complete only after this PR validates"
  "billing/payment is deferred"
  "public SaaS launch is deferred"
  "CLARA is not production deployed yet"
  "CLARA is not public GA launched yet"
  "no real provider/payment/AI/outbound behavior is activated"
  "no real external provider credentials are required"
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

p13_runtime_sources=(
  services/api/src/customers/customer-service.ts
  services/api/src/conversations/conversation-service.ts
  services/api/src/analytics/internal-crm-dashboard-analytics-service.ts
  apps/dashboard/src/components/CustomerWorkspacePanel.tsx
  apps/dashboard/src/components/InternalCrmDashboardAnalyticsPanel.tsx
  apps/extension/src/api/clara-extension-api-client.ts
)

if grep -nE 'stripe|checkout|invoice|chargeCustomer|subscriptionMutation|quotaEnforce' "${p13_runtime_sources[@]}"; then
  fail "unexpected payment/billing runtime activation"
fi

if grep -nE 'OpenAI|Anthropic|GmailApi|WhatsAppApi|autoSend|sendExternal|enqueue|queue\.add|cron|worker|createExport|generateReport|downloadReport' "${p13_runtime_sources[@]}"; then
  fail "unexpected provider/AI/outbound/job/export runtime activation"
fi

if grep -nE 'dangerouslySetInnerHTML|rawHtml|raw_provider_payload|raw_webhook_payload|raw_audit_metadata|access_token|refresh_token|client_secret|Authorization header|rawGmailPayload' "${p13_runtime_sources[@]}"; then
  fail "unsafe raw payload/token/secret/html runtime pattern found"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if git ls-remote --exit-code --heads origin chore/p13-internal-crm-e2e-qa-runbook >/dev/null 2>&1; then
  :
else
  echo "WARN: remote branch chore/p13-internal-crm-e2e-qa-runbook not found yet; push before final release validation." >&2
fi

echo "CLARA P13-PR-07 VALIDATION PASSED"
