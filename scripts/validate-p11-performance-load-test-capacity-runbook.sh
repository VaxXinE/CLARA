#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "chore/p11-performance-load-test-capacity-runbook" ]]; then
  echo "Expected branch chore/p11-performance-load-test-capacity-runbook, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/reliability/performance-readiness-types.ts"
  "services/api/src/reliability/performance-readiness-dto.ts"
  "services/api/src/reliability/performance-readiness-policy.ts"
  "services/api/src/reliability/performance-readiness-service.ts"
  "services/api/src/reliability/load-test-profile-policy.ts"
  "services/api/src/reliability/capacity-planning-baseline-policy.ts"
  "services/api/src/reliability/performance-risk-classification-policy.ts"
  "services/api/src/reliability/safe-benchmark-scenario-policy.ts"
  "services/api/src/reliability/performance-capacity-safe-summary.ts"
  "services/api/src/http/routes/performance-capacity-readiness.ts"
  "services/api/tests/p11-performance-readiness-policy.test.ts"
  "services/api/tests/p11-performance-readiness-service.test.ts"
  "services/api/tests/p11-performance-capacity-route.test.ts"
  "services/api/tests/p11-load-test-profile-policy.test.ts"
  "services/api/tests/p11-capacity-planning-baseline-policy.test.ts"
  "services/api/tests/p11-performance-risk-classification-policy.test.ts"
  "services/api/tests/p11-safe-benchmark-scenario-policy.test.ts"
  "services/api/tests/p11-performance-capacity-safe-summary.test.ts"
  "services/api/tests/p11-performance-no-heavy-load-regression.test.ts"
  "services/api/tests/p11-performance-no-production-target-regression.test.ts"
  "services/api/tests/p11-performance-no-mutation-regression.test.ts"
  "services/api/tests/p11-performance-security-boundary.test.ts"
  "apps/dashboard/src/components/PerformanceCapacityReadinessPanel.tsx"
  "apps/dashboard/src/components/PerformanceCapacityReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p11-performance-capacity-readiness-security.test.tsx"
  "apps/extension/src/tests/p11-performance-capacity-extension-boundary.test.ts"
  "docs/product/CLARA-P11-PERFORMANCE-LOAD-TEST-CAPACITY-RUNBOOK.md"
  "docs/product/CLARA-P11-PERFORMANCE-CAPACITY-READINESS-SPEC.md"
  "docs/product/CLARA-P11-LOAD-TEST-SCENARIOS.md"
  "docs/product/CLARA-P11-CAPACITY-PLANNING-BASELINE.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p11-performance-load-test-capacity-runbook.sh"
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
if [[ -x node_modules/.bin/prettier ]]; then
  node_modules/.bin/prettier "src/**/*.ts" "tests/**/*.ts" --write
else
  npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write
fi
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../../apps/dashboard
npm install
if [[ -x node_modules/.bin/prettier ]]; then
  node_modules/.bin/prettier "src/**/*.{ts,tsx}" --write
else
  npx --yes prettier "src/**/*.{ts,tsx}" --write
fi
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../extension
npm install
if [[ -x node_modules/.bin/prettier ]]; then
  node_modules/.bin/prettier "src/**/*.{ts,tsx}" --write
else
  npx --yes prettier "src/**/*.{ts,tsx}" --write
fi
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd "$ROOT_DIR"
docker compose -f docker-compose.prod.example.yml config >/dev/null

tracked_env="$(git ls-files | grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' || true)"
if [[ -n "$tracked_env" ]]; then
  echo "Tracked env file found:" >&2
  echo "$tracked_env" >&2
  exit 1
fi

tracked_artifacts="$(git ls-files | grep -E '(^|/)(dist|build|coverage|node_modules)/' || true)"
if [[ -n "$tracked_artifacts" ]]; then
  echo "Tracked build artifact found:" >&2
  echo "$tracked_artifacts" >&2
  exit 1
fi

runtime_files=(
  "services/api/src/reliability/performance-readiness-types.ts"
  "services/api/src/reliability/performance-readiness-dto.ts"
  "services/api/src/reliability/performance-readiness-policy.ts"
  "services/api/src/reliability/performance-readiness-service.ts"
  "services/api/src/reliability/load-test-profile-policy.ts"
  "services/api/src/reliability/capacity-planning-baseline-policy.ts"
  "services/api/src/reliability/performance-risk-classification-policy.ts"
  "services/api/src/reliability/safe-benchmark-scenario-policy.ts"
  "services/api/src/reliability/performance-capacity-safe-summary.ts"
  "services/api/src/http/routes/performance-capacity-readiness.ts"
  "apps/dashboard/src/components/PerformanceCapacityReadinessPanel.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token" \
  "refresh_token" \
  "providerCookie" \
  "sessionCookie" \
  " rawProviderPayload:" \
  "raw_provider_payload" \
  " rawWebhookPayload:" \
  "raw_webhook_payload" \
  " rawAuditMetadata:" \
  "raw_audit_metadata" \
  " rawCustomerMessage:" \
  "raw_customer_message" \
  " rawUsageEvent:" \
  "raw_usage_event" \
  " rawTelemetry:" \
  "raw_telemetry" \
  " rawLog:" \
  "raw_log" \
  " rawTrace:" \
  "raw_trace" \
  " rawMetricEvent:" \
  "raw_metric_event" \
  " rawDom:" \
  " rawHtml:" \
  "raw_dom" \
  "raw_html" \
  " rawPrompt:" \
  "OPENAI_API_KEY" \
  "GEMINI_API_KEY" \
  "ANTHROPIC_API_KEY" \
  "@ai-sdk" \
  "stripe" \
  "midtrans" \
  "xendit" \
  "paypal" \
  "k6" \
  "artillery" \
  "locust" \
  "jmeter" \
  "production-load" \
  "runLoadTest(" \
  "runBenchmark(" \
  "callExternalProvider(" \
  "chargeCustomer(" \
  "createInvoice(" \
  "mutateSubscription(" \
  "mutatePlan(" \
  "mutateEntitlement(" \
  "enforceQuota(" \
  "recordUsageEvent(" \
  "mutateCrm(" \
  "createTask(" \
  "assignOwner(" \
  "updateLifecycle(" \
  "updateStatus(" \
  "writeCustomerNote(" \
  "sendOutbound"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P11-PR-06 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P11-PERFORMANCE-LOAD-TEST-CAPACITY-RUNBOOK.md"
  "docs/product/CLARA-P11-PERFORMANCE-CAPACITY-READINESS-SPEC.md"
  "docs/product/CLARA-P11-LOAD-TEST-SCENARIOS.md"
  "docs/product/CLARA-P11-CAPACITY-PLANNING-BASELINE.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "P11 Scale / Reliability / Billing" \
  "Performance" \
  "Load Test" \
  "Capacity" \
  "capacity planning" \
  "safe benchmark" \
  "readiness not execution" \
  "no heavy load test in normal validation" \
  "no production target by default" \
  "no external provider call" \
  "no payment provider integration" \
  "no charging customers" \
  "no invoice creation" \
  "no subscription mutation" \
  "no raw telemetry" \
  "no raw logs" \
  "no raw traces" \
  "no raw metric events" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no CRM mutation" \
  "no outbound send" \
  "no real AI provider" \
  "P11-PR-06"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P11-PR-06 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  git ls-remote --exit-code --heads origin chore/p11-performance-load-test-capacity-runbook >/dev/null
fi

echo "CLARA P11-PR-06 VALIDATION PASSED"
