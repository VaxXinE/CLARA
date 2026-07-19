#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "chore/p8-final-crm-workflow-audit-runbook" ]]; then
  echo "Expected branch chore/p8-final-crm-workflow-audit-runbook, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/tests/p8-final-crm-workflow-audit.test.ts"
  "services/api/tests/p8-final-crm-workflow-security-regression.test.ts"
  "services/api/tests/p8-final-crm-workflow-auth-workspace-boundary.test.ts"
  "services/api/tests/p8-final-crm-workflow-no-mutation-regression.test.ts"
  "services/api/tests/p8-final-crm-workflow-audit-redaction.test.ts"
  "apps/dashboard/src/components/p8-final-crm-workflow-ui-regression.test.tsx"
  "apps/dashboard/src/components/p8-final-crm-workflow-security.test.tsx"
  "apps/dashboard/src/components/p8-final-crm-workflow-accessibility.test.tsx"
  "apps/extension/src/tests/p8-final-crm-workflow-extension-security-regression.test.ts"
  "apps/extension/src/tests/p8-final-crm-workflow-boundary-regression.test.ts"
  "docs/product/CLARA-P8-FINAL-CRM-WORKFLOW-INTELLIGENCE-AUDIT.md"
  "docs/product/CLARA-P8-PRODUCTION-RUNBOOK.md"
  "docs/product/CLARA-P8-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-P8-OPERATOR-QA-CHECKLIST.md"
  "docs/product/CLARA-P8-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p8-final-crm-workflow-audit-runbook.sh"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

for script in \
  scripts/validate-p8-crm-workflow-intelligence-scope-policy.sh \
  scripts/validate-p8-customer-profile-intelligence-read-model.sh \
  scripts/validate-p8-customer-timeline-intelligence.sh \
  scripts/validate-p8-reviewable-crm-action-proposal.sh \
  scripts/validate-p8-task-follow-up-workflow-proposal.sh \
  scripts/validate-p8-owner-assignment-readiness.sh \
  scripts/validate-p8-lifecycle-status-update-readiness.sh \
  scripts/validate-p8-crm-activity-audit-hardening.sh; do
  [[ -f "$script" ]] && bash -n "$script"
done

bash scripts/validate-repo-structure.sh
bash scripts/validate-production-runtime-config.sh

cd services/api
npm install
npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../../apps/dashboard
npm install
npx --yes prettier "src/**/*.{ts,tsx}" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../extension
npm install
npx --yes prettier "src/**/*.{ts,tsx}" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd "$ROOT_DIR"
docker compose -f docker-compose.prod.example.yml config >/dev/null

tracked_env="$(
  git ls-files | grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' || true
)"
if [[ -n "$tracked_env" ]]; then
  echo "Tracked env file found:" >&2
  echo "$tracked_env" >&2
  exit 1
fi

tracked_artifacts="$(
  git ls-files | grep -E '(^|/)(dist|build|coverage|node_modules)/' || true
)"
if [[ -n "$tracked_artifacts" ]]; then
  echo "Tracked build artifact found:" >&2
  echo "$tracked_artifacts" >&2
  exit 1
fi

runtime_files=(
  "services/api/src/customers/customer-intelligence-service.ts"
  "services/api/src/customers/customer-timeline-intelligence-service.ts"
  "services/api/src/customers/customer-action-proposal-service.ts"
  "services/api/src/customers/customer-follow-up-proposal-service.ts"
  "services/api/src/customers/customer-owner-assignment-readiness-service.ts"
  "services/api/src/customers/customer-lifecycle-status-readiness-service.ts"
  "services/api/src/customers/customer-crm-activity-audit-service.ts"
  "services/api/src/customers/customer-crm-activity-audit-redaction.ts"
  "apps/dashboard/src/components/CrmCustomerWorkspace.tsx"
  "apps/dashboard/src/components/CustomerProfileIntelligencePanel.tsx"
  "apps/dashboard/src/components/CustomerTimelineIntelligencePanel.tsx"
  "apps/dashboard/src/components/CustomerActionProposalPanel.tsx"
  "apps/dashboard/src/components/CustomerFollowUpProposalPanel.tsx"
  "apps/dashboard/src/components/CustomerOwnerAssignmentReadinessPanel.tsx"
  "apps/dashboard/src/components/CustomerLifecycleStatusReadinessPanel.tsx"
  "apps/dashboard/src/components/CrmActivityAuditReadinessPanel.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token exposure" \
  "refresh_token exposure" \
  "providerCookie" \
  "sessionCookie" \
  "rawProviderPayload" \
  "raw_provider_payload" \
  "rawWebhookPayload" \
  "raw_webhook_payload" \
  "rawDom" \
  "rawHtml" \
  "raw_dom" \
  "raw_html" \
  "rawPrompt exposure" \
  "OPENAI_API_KEY" \
  "GEMINI_API_KEY" \
  "ANTHROPIC_API_KEY" \
  "@ai-sdk" \
  "CRM mutation from P8" \
  "lifecycle/status mutation from P8" \
  "owner assignment from P8" \
  "task creation from P8" \
  "customer note write from P8" \
  "outbound send from P8" \
  "scheduler execution from P8" \
  "hidden execution" \
  "bypass human approval" \
  "cross-workspace CRM access"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P8 final runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P8-FINAL-CRM-WORKFLOW-INTELLIGENCE-AUDIT.md"
  "docs/product/CLARA-P8-PRODUCTION-RUNBOOK.md"
  "docs/product/CLARA-P8-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-P8-OPERATOR-QA-CHECKLIST.md"
  "docs/product/CLARA-P8-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Final CRM & Workflow Intelligence Audit" \
  "P8 complete" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "read-only" \
  "review-only" \
  "readiness-only" \
  "audit-only" \
  "mutationExecuted=false" \
  "actionExecuted=false" \
  "no CRM mutation" \
  "no task creation" \
  "no owner assignment mutation" \
  "no lifecycle mutation" \
  "no status mutation" \
  "no outbound send" \
  "no real AI provider" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "P9 Analytics / Reporting / KPI" \
  "P8-PR-09"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P8 final docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin chore/p8-final-crm-workflow-audit-runbook >/dev/null; then
    echo "Remote branch chore/p8-final-crm-workflow-audit-runbook not found." >&2
    exit 1
  fi
fi

echo "CLARA P8-PR-09 VALIDATION PASSED"
