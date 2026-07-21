#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "chore/p11-final-scale-reliability-billing-audit-runbook" ]]; then
  echo "Expected branch chore/p11-final-scale-reliability-billing-audit-runbook, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "docs/product/CLARA-P11-FINAL-SCALE-RELIABILITY-BILLING-AUDIT.md"
  "docs/product/CLARA-P11-PRODUCTION-RUNBOOK.md"
  "docs/product/CLARA-P11-RELIABILITY-CHECKLIST.md"
  "docs/product/CLARA-P11-BILLING-READINESS-CHECKLIST.md"
  "docs/product/CLARA-P11-PERFORMANCE-CAPACITY-CHECKLIST.md"
  "docs/product/CLARA-P11-SECURITY-REGRESSION-CHECKLIST.md"
  "docs/product/CLARA-P11-OPERATOR-ADMIN-QA-CHECKLIST.md"
  "docs/product/CLARA-P11-P12-HANDOFF-NOTES.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "services/api/tests/p11-final-scale-reliability-billing-audit.test.ts"
  "services/api/tests/p11-final-reliability-auth-workspace-boundary.test.ts"
  "services/api/tests/p11-final-reliability-no-mutation-regression.test.ts"
  "services/api/tests/p11-final-billing-no-financial-side-effect-regression.test.ts"
  "services/api/tests/p11-final-performance-no-heavy-load-regression.test.ts"
  "services/api/tests/p11-final-observability-privacy-regression.test.ts"
  "services/api/tests/p11-final-p12-handoff-readiness.test.ts"
  "apps/dashboard/src/components/p11-final-reliability-dashboard-security.test.tsx"
  "apps/dashboard/src/components/p11-final-reliability-dashboard-ui-regression.test.tsx"
  "apps/dashboard/src/components/p11-final-reliability-dashboard-accessibility.test.tsx"
  "apps/extension/src/tests/p11-final-reliability-extension-boundary-regression.test.ts"
  "apps/extension/src/tests/p11-final-reliability-extension-security-regression.test.ts"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p11-final-scale-reliability-billing-audit-runbook.sh"
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
  "services/api/src/reliability/queue-job-reliability-service.ts"
  "services/api/src/reliability/rate-limit-readiness-service.ts"
  "services/api/src/reliability/observability-readiness-service.ts"
  "services/api/src/reliability/performance-readiness-service.ts"
  "services/api/src/billing/billing-readiness-service.ts"
  "services/api/src/http/routes/reliability-queue-job-readiness.ts"
  "services/api/src/http/routes/rate-limit-quota-usage-readiness.ts"
  "services/api/src/http/routes/reliability-observability-slo-alert-readiness.ts"
  "services/api/src/http/routes/billing-plan-entitlement-readiness.ts"
  "services/api/src/http/routes/performance-capacity-readiness.ts"
  "apps/dashboard/src/components/ScaleReliabilityBillingReadinessPanel.tsx"
  "apps/dashboard/src/components/QueueJobReliabilityReadinessPanel.tsx"
  "apps/dashboard/src/components/RateLimitQuotaUsageReadinessPanel.tsx"
  "apps/dashboard/src/components/ObservabilitySloAlertReadinessPanel.tsx"
  "apps/dashboard/src/components/BillingPlanEntitlementReadinessPanel.tsx"
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
  " rawPaymentData:" \
  "raw_payment_data" \
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
  "production-load" \
  "runLoadTest(" \
  "runBenchmark(" \
  "callExternalProvider(" \
  "chargeCustomer(" \
  "createInvoice(" \
  "createCheckout(" \
  "storePaymentMethod(" \
  "mutateSubscription(" \
  "mutatePlan(" \
  "mutateEntitlement(" \
  "enforceQuota(" \
  "recordUsageEvent(" \
  "executeJob(" \
  "sendAlert(" \
  "sendNotification(" \
  "mutateCrm(" \
  "createTask(" \
  "assignOwner(" \
  "updateLifecycle(" \
  "updateStatus(" \
  "writeCustomerNote(" \
  "sendOutbound"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P11-PR-07 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P11-FINAL-SCALE-RELIABILITY-BILLING-AUDIT.md"
  "docs/product/CLARA-P11-PRODUCTION-RUNBOOK.md"
  "docs/product/CLARA-P11-RELIABILITY-CHECKLIST.md"
  "docs/product/CLARA-P11-BILLING-READINESS-CHECKLIST.md"
  "docs/product/CLARA-P11-PERFORMANCE-CAPACITY-CHECKLIST.md"
  "docs/product/CLARA-P11-SECURITY-REGRESSION-CHECKLIST.md"
  "docs/product/CLARA-P11-OPERATOR-ADMIN-QA-CHECKLIST.md"
  "docs/product/CLARA-P11-P12-HANDOFF-NOTES.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Final P11" \
  "P11 Scale / Reliability / Billing" \
  "readiness not billing launch" \
  "Backend AuthContext" \
  "frontend role guard is UX-only" \
  "client workspaceId is never authority" \
  "workspace-scoped" \
  "aggregate-first" \
  "Queue / Job Reliability" \
  "Retry" \
  "Idempotency" \
  "Dead Letter" \
  "Rate Limit" \
  "Quota" \
  "Usage Metering" \
  "Observability" \
  "SLO Dashboard" \
  "Alert Readiness" \
  "Error Budget" \
  "Billing Readiness" \
  "Plan Entitlement" \
  "Performance" \
  "Load Test" \
  "Capacity" \
  "no payment provider integration" \
  "no charging customers" \
  "no invoice creation" \
  "no subscription mutation" \
  "no quota enforcement" \
  "no heavy load test in normal validation" \
  "no production target by default" \
  "no raw telemetry" \
  "no raw logs" \
  "no raw traces" \
  "no raw metric events" \
  "no raw usage events" \
  "no raw payment data" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no CRM mutation" \
  "no outbound send" \
  "no real AI provider" \
  "P11-PR-07" \
  "P12 Beta / GA Release Readiness"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P11-PR-07 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  git ls-remote --exit-code --heads origin chore/p11-final-scale-reliability-billing-audit-runbook >/dev/null
fi

echo "CLARA P11-PR-07 VALIDATION PASSED"
