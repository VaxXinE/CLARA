#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p11-observability-slo-dashboard-alert-readiness" ]]; then
  echo "Expected branch feat/p11-observability-slo-dashboard-alert-readiness, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/reliability/observability-readiness-types.ts"
  "services/api/src/reliability/observability-readiness-dto.ts"
  "services/api/src/reliability/observability-readiness-policy.ts"
  "services/api/src/reliability/observability-readiness-service.ts"
  "services/api/src/reliability/slo-dashboard-readiness-types.ts"
  "services/api/src/reliability/slo-dashboard-readiness-policy.ts"
  "services/api/src/reliability/slo-dashboard-readiness-service.ts"
  "services/api/src/reliability/alert-readiness-types.ts"
  "services/api/src/reliability/alert-readiness-policy.ts"
  "services/api/src/reliability/alert-readiness-service.ts"
  "services/api/src/reliability/error-budget-readiness-policy.ts"
  "services/api/src/reliability/incident-linkage-readiness-policy.ts"
  "services/api/src/reliability/safe-telemetry-summary.ts"
  "services/api/src/http/routes/reliability-observability-slo-alert-readiness.ts"
  "services/api/tests/p11-observability-readiness-policy.test.ts"
  "services/api/tests/p11-observability-readiness-service.test.ts"
  "services/api/tests/p11-observability-slo-alert-route.test.ts"
  "services/api/tests/p11-slo-dashboard-readiness-policy.test.ts"
  "services/api/tests/p11-slo-dashboard-readiness-service.test.ts"
  "services/api/tests/p11-alert-readiness-policy.test.ts"
  "services/api/tests/p11-alert-readiness-service.test.ts"
  "services/api/tests/p11-error-budget-readiness-policy.test.ts"
  "services/api/tests/p11-incident-linkage-readiness-policy.test.ts"
  "services/api/tests/p11-safe-telemetry-summary.test.ts"
  "services/api/tests/p11-observability-no-alert-execution-regression.test.ts"
  "services/api/tests/p11-observability-no-vendor-sdk-regression.test.ts"
  "services/api/tests/p11-observability-security-boundary.test.ts"
  "apps/dashboard/src/components/ObservabilitySloAlertReadinessPanel.tsx"
  "apps/dashboard/src/components/ObservabilitySloAlertReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p11-observability-slo-alert-readiness-security.test.tsx"
  "apps/extension/src/tests/p11-observability-slo-alert-extension-boundary.test.ts"
  "docs/product/CLARA-P11-OBSERVABILITY-SLO-DASHBOARD-ALERT-READINESS-SPEC.md"
  "docs/product/CLARA-P11-OBSERVABILITY-ALERT-RUNBOOK.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P11-SLO-RELIABILITY-BASELINE.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p11-observability-slo-dashboard-alert-readiness.sh"
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
  "services/api/src/reliability/observability-readiness-types.ts"
  "services/api/src/reliability/observability-readiness-dto.ts"
  "services/api/src/reliability/observability-readiness-policy.ts"
  "services/api/src/reliability/observability-readiness-service.ts"
  "services/api/src/reliability/slo-dashboard-readiness-types.ts"
  "services/api/src/reliability/slo-dashboard-readiness-policy.ts"
  "services/api/src/reliability/slo-dashboard-readiness-service.ts"
  "services/api/src/reliability/alert-readiness-types.ts"
  "services/api/src/reliability/alert-readiness-policy.ts"
  "services/api/src/reliability/alert-readiness-service.ts"
  "services/api/src/reliability/error-budget-readiness-policy.ts"
  "services/api/src/reliability/incident-linkage-readiness-policy.ts"
  "services/api/src/reliability/safe-telemetry-summary.ts"
  "services/api/src/http/routes/reliability-observability-slo-alert-readiness.ts"
  "apps/dashboard/src/components/ObservabilitySloAlertReadinessPanel.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token" \
  "refresh_token" \
  "providerCookie" \
  "sessionCookie" \
  " rawTelemetry:" \
  "raw_telemetry" \
  " rawLog:" \
  "raw_log" \
  " rawTrace:" \
  "raw_trace" \
  " rawMetricEvent:" \
  "raw_metric_event" \
  " rawProviderPayload:" \
  "raw_provider_payload" \
  " rawWebhookPayload:" \
  "raw_webhook_payload" \
  " rawAuditMetadata:" \
  "raw_audit_metadata" \
  " rawCustomerMessage:" \
  "raw_customer_message" \
  " rawDom:" \
  " rawHtml:" \
  "raw_dom" \
  "raw_html" \
  " rawPrompt:" \
  "OPENAI_API_KEY" \
  "GEMINI_API_KEY" \
  "ANTHROPIC_API_KEY" \
  "@ai-sdk" \
  "datadog" \
  "newrelic" \
  "honeycomb" \
  "grafana" \
  "opentelemetry/exporter" \
  "pagerduty" \
  "slack/webhook" \
  "discord/webhook" \
  "stripe" \
  "midtrans" \
  "xendit" \
  "paypal" \
  "sendAlert(" \
  "sendNotification(" \
  "executeEscalation(" \
  "createIncident(" \
  "exportTelemetry(" \
  "enforceSlo(" \
  "chargeCustomer(" \
  "createInvoice(" \
  "mutateSubscription(" \
  "upgradePlan(" \
  "downgradePlan(" \
  "cancelSubscription(" \
  "mutatePlan(" \
  "mutateEntitlement(" \
  "enforceQuota(" \
  "recordUsageEvent(" \
  "runLoadTest(" \
  "mutateCrm(" \
  "createTask(" \
  "assignOwner(" \
  "updateLifecycle(" \
  "updateStatus(" \
  "writeCustomerNote(" \
  "sendOutbound"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P11-PR-04 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P11-OBSERVABILITY-SLO-DASHBOARD-ALERT-READINESS-SPEC.md"
  "docs/product/CLARA-P11-OBSERVABILITY-ALERT-RUNBOOK.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P11-SLO-RELIABILITY-BASELINE.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "P11 Scale / Reliability / Billing" \
  "Observability" \
  "SLO Dashboard" \
  "Alert Readiness" \
  "Error Budget" \
  "safe telemetry summary" \
  "readiness not SLA launch" \
  "no alert execution" \
  "no notification send" \
  "no vendor provider integration" \
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
  "no payment provider integration" \
  "no charging customers" \
  "no subscription mutation" \
  "workspace-scoped" \
  "P11-PR-04"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P11-PR-04 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin feat/p11-observability-slo-dashboard-alert-readiness >/dev/null; then
    echo "Remote branch feat/p11-observability-slo-dashboard-alert-readiness not found." >&2
    exit 1
  fi
fi

echo "CLARA P11-PR-04 VALIDATION PASSED"
