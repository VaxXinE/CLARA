#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "chore/p9-final-analytics-reporting-audit-runbook" ]]; then
  echo "Expected branch chore/p9-final-analytics-reporting-audit-runbook, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/tests/p9-final-analytics-reporting-audit.test.ts"
  "services/api/tests/p9-final-analytics-auth-workspace-boundary.test.ts"
  "services/api/tests/p9-final-analytics-privacy-redaction.test.ts"
  "services/api/tests/p9-final-analytics-no-mutation-regression.test.ts"
  "services/api/tests/p9-final-analytics-no-export-drilldown-regression.test.ts"
  "apps/dashboard/src/components/p9-final-analytics-dashboard-security.test.tsx"
  "apps/dashboard/src/components/p9-final-analytics-dashboard-ui-regression.test.tsx"
  "apps/dashboard/src/components/p9-final-analytics-dashboard-accessibility.test.tsx"
  "apps/extension/src/tests/p9-final-analytics-extension-boundary-regression.test.ts"
  "apps/extension/src/tests/p9-final-analytics-extension-security-regression.test.ts"
  "docs/product/CLARA-P9-FINAL-ANALYTICS-REPORTING-AUDIT.md"
  "docs/product/CLARA-P9-PRODUCTION-RUNBOOK.md"
  "docs/product/CLARA-P9-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-P9-OPERATOR-QA-CHECKLIST.md"
  "docs/product/CLARA-P9-REGRESSION-ACCEPTANCE-CHECKLIST.md"
  "docs/product/CLARA-P9-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p9-final-analytics-reporting-audit-runbook.sh"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

for script in \
  scripts/validate-p9-analytics-reporting-kpi-scope-policy.sh \
  scripts/validate-p9-analytics-read-model-metric-foundation.sh \
  scripts/validate-p9-core-operational-metrics-pack.sh \
  scripts/validate-p9-crm-workflow-metrics-kpi-dashboard.sh \
  scripts/validate-p9-reporting-filters-analytics-audit-privacy.sh; do
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
  "services/api/src/analytics/analytics-scope-policy.ts"
  "services/api/src/analytics/analytics-kpi-policy.ts"
  "services/api/src/analytics/analytics-read-model-service.ts"
  "services/api/src/analytics/analytics-metric-registry.ts"
  "services/api/src/analytics/conversation-volume-metrics-service.ts"
  "services/api/src/analytics/response-time-sla-metrics-service.ts"
  "services/api/src/analytics/channel-performance-metrics-service.ts"
  "services/api/src/analytics/crm-workflow-metrics-service.ts"
  "services/api/src/analytics/kpi-dashboard-card-service.ts"
  "services/api/src/analytics/analytics-audit-service.ts"
  "services/api/src/analytics/analytics-operator-filter-policy.ts"
  "services/api/src/analytics/analytics-reporting-route-support.ts"
  "services/api/src/http/routes/analytics-readiness.ts"
  "services/api/src/http/routes/analytics-metric-catalog.ts"
  "services/api/src/http/routes/analytics-overview.ts"
  "services/api/src/http/routes/analytics-conversation-volume.ts"
  "services/api/src/http/routes/analytics-response-time-sla.ts"
  "services/api/src/http/routes/analytics-channel-performance.ts"
  "services/api/src/http/routes/analytics-crm-workflow.ts"
  "services/api/src/http/routes/analytics-kpi-dashboard.ts"
  "apps/dashboard/src/components/AnalyticsDashboardWorkspace.tsx"
  "apps/dashboard/src/components/AnalyticsReportingReadinessPanel.tsx"
  "apps/dashboard/src/components/AnalyticsReadModelFoundationPanel.tsx"
  "apps/dashboard/src/components/CoreOperationalMetricsPanel.tsx"
  "apps/dashboard/src/components/KpiDashboardCardsPanel.tsx"
  "apps/dashboard/src/components/CrmWorkflowMetricsPanel.tsx"
  "apps/dashboard/src/components/AnalyticsReportingFiltersPanel.tsx"
  "apps/dashboard/src/components/AnalyticsAuditPrivacyPanel.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token exposure in analytics output" \
  "refresh_token exposure in analytics output" \
  "providerCookie" \
  "sessionCookie" \
  "rawProviderPayload" \
  "raw_provider_payload" \
  "rawWebhookPayload" \
  "raw_webhook_payload" \
  "rawAuditMetadata" \
  "raw_audit_metadata" \
  "rawCustomerMessage" \
  "raw_customer_message" \
  "rawDom" \
  "rawHtml" \
  "raw_dom" \
  "raw_html" \
  "rawPrompt exposure" \
  "OPENAI_API_KEY" \
  "GEMINI_API_KEY" \
  "ANTHROPIC_API_KEY" \
  "@ai-sdk" \
  "cross-workspace analytics access" \
  "CRM mutation from analytics" \
  "task creation from analytics" \
  "owner assignment from analytics" \
  "lifecycle/status mutation from analytics" \
  "customer note write from analytics" \
  "outbound send from analytics" \
  "scheduler execution from analytics" \
  "report export" \
  "customer-level drilldown" \
  ">Export<" \
  ">Download<"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P9 final runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P9-FINAL-ANALYTICS-REPORTING-AUDIT.md"
  "docs/product/CLARA-P9-PRODUCTION-RUNBOOK.md"
  "docs/product/CLARA-P9-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-P9-OPERATOR-QA-CHECKLIST.md"
  "docs/product/CLARA-P9-REGRESSION-ACCEPTANCE-CHECKLIST.md"
  "docs/product/CLARA-P9-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Final P9 Audit" \
  "Production Runbook" \
  "Security Checklist" \
  "Operator QA Checklist" \
  "P9 Analytics / Reporting / KPI" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "aggregate-first" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no raw audit metadata" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no CRM mutation" \
  "no task creation" \
  "no outbound send" \
  "no report export" \
  "no customer-level drilldown" \
  "P9 COMPLETE" \
  "P10 Enterprise Hardening / Compliance"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P9 final docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin chore/p9-final-analytics-reporting-audit-runbook >/dev/null; then
    echo "Remote branch chore/p9-final-analytics-reporting-audit-runbook not found." >&2
    exit 1
  fi
fi

echo "CLARA P9-PR-06 VALIDATION PASSED"
