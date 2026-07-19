#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "docs/p9-analytics-reporting-kpi-scope-policy" ]]; then
  echo "Expected branch docs/p9-analytics-reporting-kpi-scope-policy, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/analytics/analytics-scope-policy.ts"
  "services/api/src/analytics/analytics-kpi-policy.ts"
  "services/api/src/analytics/analytics-metric-types.ts"
  "services/api/src/analytics/analytics-privacy-policy.ts"
  "services/api/tests/p9-analytics-scope-policy.test.ts"
  "services/api/tests/p9-analytics-kpi-policy.test.ts"
  "services/api/tests/p9-analytics-privacy-boundary.test.ts"
  "services/api/tests/p9-analytics-security-boundary.test.ts"
  "apps/dashboard/src/components/AnalyticsReportingReadinessPanel.tsx"
  "apps/dashboard/src/components/AnalyticsReportingReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p9-analytics-reporting-readiness-security.test.tsx"
  "apps/extension/src/tests/p9-analytics-extension-boundary.test.ts"
  "docs/product/CLARA-P9-ANALYTICS-REPORTING-KPI-SCOPE-POLICY.md"
  "docs/product/CLARA-P9-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p9-analytics-reporting-kpi-scope-policy.sh"
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
  "services/api/src/analytics/analytics-scope-policy.ts"
  "services/api/src/analytics/analytics-kpi-policy.ts"
  "services/api/src/analytics/analytics-metric-types.ts"
  "services/api/src/analytics/analytics-privacy-policy.ts"
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
  "scheduler execution from analytics"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P9 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P9-ANALYTICS-REPORTING-KPI-SCOPE-POLICY.md"
  "docs/product/CLARA-P9-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Analytics & Reporting Scope" \
  "KPI Policy" \
  "P9 Analytics / Reporting / KPI" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "aggregate-first" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no raw customer messages" \
  "no CRM mutation" \
  "no task creation" \
  "no outbound send" \
  "no real AI provider" \
  "P9-PR-01"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P9 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin docs/p9-analytics-reporting-kpi-scope-policy >/dev/null; then
    echo "Remote branch docs/p9-analytics-reporting-kpi-scope-policy not found." >&2
    exit 1
  fi
fi

echo "CLARA P9-PR-01 VALIDATION PASSED"
