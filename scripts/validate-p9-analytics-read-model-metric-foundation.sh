#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p9-analytics-read-model-metric-foundation" ]]; then
  echo "Expected branch feat/p9-analytics-read-model-metric-foundation, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/analytics/analytics-read-model-types.ts"
  "services/api/src/analytics/analytics-read-model-dto.ts"
  "services/api/src/analytics/analytics-read-model-policy.ts"
  "services/api/src/analytics/analytics-read-model-service.ts"
  "services/api/src/analytics/analytics-metric-registry.ts"
  "services/api/src/analytics/analytics-metric-contract.ts"
  "services/api/src/analytics/analytics-query-policy.ts"
  "services/api/src/http/routes/analytics-readiness.ts"
  "services/api/src/http/routes/analytics-metric-catalog.ts"
  "services/api/src/http/server.ts"
  "services/api/tests/p9-analytics-read-model-policy.test.ts"
  "services/api/tests/p9-analytics-read-model-service.test.ts"
  "services/api/tests/p9-analytics-readiness-route.test.ts"
  "services/api/tests/p9-analytics-metric-registry.test.ts"
  "services/api/tests/p9-analytics-metric-contract.test.ts"
  "services/api/tests/p9-analytics-query-policy.test.ts"
  "services/api/tests/p9-analytics-read-model-security.test.ts"
  "services/api/tests/p9-analytics-metric-catalog-route.test.ts"
  "apps/dashboard/src/api/types.ts"
  "apps/dashboard/src/api/client.ts"
  "apps/dashboard/src/components/AnalyticsReadModelFoundationPanel.tsx"
  "apps/dashboard/src/components/AnalyticsReadModelFoundationPanel.test.tsx"
  "apps/dashboard/src/components/AnalyticsReportingReadinessPanel.tsx"
  "apps/dashboard/src/components/p9-analytics-read-model-foundation-security.test.tsx"
  "apps/extension/src/tests/p9-analytics-read-model-extension-boundary.test.ts"
  "docs/product/CLARA-P9-ANALYTICS-READ-MODEL-METRIC-FOUNDATION-SPEC.md"
  "docs/product/CLARA-P9-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p9-analytics-read-model-metric-foundation.sh"
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
  "services/api/src/analytics/analytics-read-model-types.ts"
  "services/api/src/analytics/analytics-read-model-dto.ts"
  "services/api/src/analytics/analytics-read-model-policy.ts"
  "services/api/src/analytics/analytics-read-model-service.ts"
  "services/api/src/analytics/analytics-metric-registry.ts"
  "services/api/src/analytics/analytics-metric-contract.ts"
  "services/api/src/analytics/analytics-query-policy.ts"
  "services/api/src/http/routes/analytics-readiness.ts"
  "services/api/src/http/routes/analytics-metric-catalog.ts"
  "apps/dashboard/src/components/AnalyticsReadModelFoundationPanel.tsx"
  "apps/dashboard/src/components/AnalyticsReportingReadinessPanel.tsx"
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
  "raw audit metadata exposure" \
  "CRM mutation from analytics" \
  "task creation from analytics" \
  "owner assignment from analytics" \
  "lifecycle/status mutation from analytics" \
  "customer note write from analytics" \
  "outbound send from analytics" \
  "scheduler execution from analytics" \
  "report export from analytics foundation" \
  "customer-level drilldown"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P9 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P9-ANALYTICS-READ-MODEL-METRIC-FOUNDATION-SPEC.md"
  "docs/product/CLARA-P9-ANALYTICS-REPORTING-KPI-SCOPE-POLICY.md"
  "docs/product/CLARA-P9-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Analytics Read Model" \
  "Metric Foundation" \
  "P9 Analytics / Reporting / KPI" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "aggregate-first" \
  "metric registry" \
  "metric catalog" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no CRM mutation" \
  "no task creation" \
  "no outbound send" \
  "no real AI provider" \
  "no scheduled aggregation" \
  "no report export" \
  "P9-PR-02"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P9 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin feat/p9-analytics-read-model-metric-foundation >/dev/null; then
    echo "Remote branch feat/p9-analytics-read-model-metric-foundation not found." >&2
    exit 1
  fi
fi

echo "CLARA P9-PR-02 VALIDATION PASSED"
