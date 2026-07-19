#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p9-reporting-filters-analytics-audit-privacy" ]]; then
  echo "Expected branch feat/p9-reporting-filters-analytics-audit-privacy, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/analytics/analytics-reporting-filter-types.ts"
  "services/api/src/analytics/analytics-reporting-filter-dto.ts"
  "services/api/src/analytics/analytics-reporting-filter-policy.ts"
  "services/api/src/analytics/analytics-operator-filter-policy.ts"
  "services/api/src/analytics/analytics-audit-event-types.ts"
  "services/api/src/analytics/analytics-audit-policy.ts"
  "services/api/src/analytics/analytics-audit-service.ts"
  "services/api/src/analytics/analytics-sensitive-request-policy.ts"
  "services/api/src/analytics/analytics-privacy-hardening.ts"
  "services/api/src/analytics/analytics-safe-filter-summary.ts"
  "services/api/src/analytics/analytics-reporting-route-support.ts"
  "services/api/tests/p9-reporting-filter-policy.test.ts"
  "services/api/tests/p9-operator-filter-policy.test.ts"
  "services/api/tests/p9-analytics-audit-policy.test.ts"
  "services/api/tests/p9-analytics-audit-service.test.ts"
  "services/api/tests/p9-analytics-sensitive-request-policy.test.ts"
  "services/api/tests/p9-analytics-privacy-hardening.test.ts"
  "services/api/tests/p9-reporting-filters-route.test.ts"
  "services/api/tests/p9-reporting-filters-security.test.ts"
  "services/api/tests/p9-reporting-filters-cross-workspace.test.ts"
  "services/api/tests/p9-reporting-filters-no-mutation.test.ts"
  "apps/dashboard/src/components/AnalyticsReportingFiltersPanel.tsx"
  "apps/dashboard/src/components/AnalyticsReportingFiltersPanel.test.tsx"
  "apps/dashboard/src/components/AnalyticsAuditPrivacyPanel.tsx"
  "apps/dashboard/src/components/AnalyticsAuditPrivacyPanel.test.tsx"
  "apps/dashboard/src/components/p9-reporting-filters-security.test.tsx"
  "apps/dashboard/src/components/p9-analytics-audit-privacy-security.test.tsx"
  "apps/dashboard/src/components/AnalyticsDashboardWorkspace.tsx"
  "apps/dashboard/src/components/AnalyticsDashboardWorkspace.test.tsx"
  "apps/extension/src/tests/p9-reporting-filters-extension-boundary.test.ts"
  "apps/extension/src/tests/p9-analytics-audit-privacy-extension-boundary.test.ts"
  "docs/product/CLARA-P9-REPORTING-FILTERS-ANALYTICS-AUDIT-PRIVACY-SPEC.md"
  "docs/product/CLARA-P9-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p9-reporting-filters-analytics-audit-privacy.sh"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
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
  "services/api/src/analytics/analytics-audit-service.ts"
  "services/api/src/analytics/analytics-operator-filter-policy.ts"
  "services/api/src/analytics/analytics-reporting-route-support.ts"
  "services/api/src/http/routes/analytics-conversation-volume.ts"
  "services/api/src/http/routes/analytics-response-time-sla.ts"
  "services/api/src/http/routes/analytics-channel-performance.ts"
  "services/api/src/http/routes/analytics-crm-workflow.ts"
  "services/api/src/http/routes/analytics-kpi-dashboard.ts"
  "services/api/src/http/routes/analytics-overview.ts"
  "apps/dashboard/src/components/AnalyticsReportingFiltersPanel.tsx"
  "apps/dashboard/src/components/AnalyticsAuditPrivacyPanel.tsx"
  "apps/dashboard/src/components/AnalyticsDashboardWorkspace.tsx"
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
  "raw customer message exposure" \
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
    echo "Unsafe P9 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P9-REPORTING-FILTERS-ANALYTICS-AUDIT-PRIVACY-SPEC.md"
  "docs/product/CLARA-P9-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Reporting Filters" \
  "Analytics Audit Privacy" \
  "P9 Analytics / Reporting / KPI" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "aggregate-first" \
  "operator" \
  "role-gated" \
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
  "no real AI provider" \
  "no report export" \
  "no customer-level drilldown" \
  "P9-PR-05"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P9 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin feat/p9-reporting-filters-analytics-audit-privacy >/dev/null; then
    echo "Remote branch feat/p9-reporting-filters-analytics-audit-privacy not found." >&2
    exit 1
  fi
fi

echo "CLARA P9-PR-05 VALIDATION PASSED"
