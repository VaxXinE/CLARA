#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p11-rate-limit-quota-usage-metering-readiness" ]]; then
  echo "Expected branch feat/p11-rate-limit-quota-usage-metering-readiness, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/reliability/rate-limit-readiness-types.ts"
  "services/api/src/reliability/rate-limit-readiness-dto.ts"
  "services/api/src/reliability/rate-limit-readiness-policy.ts"
  "services/api/src/reliability/rate-limit-readiness-service.ts"
  "services/api/src/billing/quota-readiness-types.ts"
  "services/api/src/billing/quota-readiness-dto.ts"
  "services/api/src/billing/quota-readiness-policy.ts"
  "services/api/src/billing/quota-readiness-service.ts"
  "services/api/src/billing/usage-metering-readiness-types.ts"
  "services/api/src/billing/usage-metering-readiness-dto.ts"
  "services/api/src/billing/usage-metering-readiness-service.ts"
  "services/api/src/billing/usage-metering-safe-summary.ts"
  "services/api/src/billing/billing-safe-metadata-boundary.ts"
  "services/api/src/http/routes/rate-limit-quota-usage-readiness.ts"
  "services/api/tests/p11-rate-limit-readiness-policy.test.ts"
  "services/api/tests/p11-rate-limit-readiness-service.test.ts"
  "services/api/tests/p11-rate-limit-quota-usage-route.test.ts"
  "services/api/tests/p11-quota-readiness-policy.test.ts"
  "services/api/tests/p11-quota-readiness-service.test.ts"
  "services/api/tests/p11-usage-metering-readiness-service.test.ts"
  "services/api/tests/p11-usage-metering-safe-summary.test.ts"
  "services/api/tests/p11-billing-safe-metadata-boundary.test.ts"
  "services/api/tests/p11-rate-limit-quota-no-enforcement-regression.test.ts"
  "services/api/tests/p11-usage-metering-no-billing-mutation-regression.test.ts"
  "services/api/tests/p11-rate-limit-quota-usage-security-boundary.test.ts"
  "apps/dashboard/src/components/RateLimitQuotaUsageReadinessPanel.tsx"
  "apps/dashboard/src/components/RateLimitQuotaUsageReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p11-rate-limit-quota-usage-readiness-security.test.tsx"
  "apps/extension/src/tests/p11-rate-limit-quota-usage-metering-extension-boundary.test.ts"
  "docs/product/CLARA-P11-RATE-LIMIT-QUOTA-USAGE-METERING-READINESS-SPEC.md"
  "docs/product/CLARA-P11-RATE-LIMIT-QUOTA-RUNBOOK.md"
  "docs/product/CLARA-P11-USAGE-METERING-BILLING-READINESS-POLICY.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P11-SLO-RELIABILITY-BASELINE.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p11-rate-limit-quota-usage-metering-readiness.sh"
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
  "services/api/src/reliability/rate-limit-readiness-types.ts"
  "services/api/src/reliability/rate-limit-readiness-dto.ts"
  "services/api/src/reliability/rate-limit-readiness-policy.ts"
  "services/api/src/reliability/rate-limit-readiness-service.ts"
  "services/api/src/billing/quota-readiness-types.ts"
  "services/api/src/billing/quota-readiness-dto.ts"
  "services/api/src/billing/quota-readiness-policy.ts"
  "services/api/src/billing/quota-readiness-service.ts"
  "services/api/src/billing/usage-metering-readiness-types.ts"
  "services/api/src/billing/usage-metering-readiness-dto.ts"
  "services/api/src/billing/usage-metering-readiness-service.ts"
  "services/api/src/billing/usage-metering-safe-summary.ts"
  "services/api/src/billing/billing-safe-metadata-boundary.ts"
  "services/api/src/http/routes/rate-limit-quota-usage-readiness.ts"
  "apps/dashboard/src/components/RateLimitQuotaUsageReadinessPanel.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token" \
  "refresh_token" \
  "providerCookie" \
  "sessionCookie" \
  " rawUsageEvent:" \
  "raw_usage_event" \
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
  "stripe" \
  "midtrans" \
  "xendit" \
  "paypal" \
  "chargeCustomer(" \
  "createInvoice(" \
  "mutateSubscription(" \
  "upgradePlan(" \
  "downgradePlan(" \
  "cancelSubscription(" \
  "mutatePlan(" \
  "mutateEntitlement(" \
  "enforceQuota(" \
  "incrementUsageCounter(" \
  "recordUsageEvent(" \
  "customerLevelDrilldown(" \
  "runLoadTest(" \
  "mutateCrm(" \
  "createTask(" \
  "assignOwner(" \
  "updateLifecycle(" \
  "updateStatus(" \
  "writeCustomerNote(" \
  "sendOutbound"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P11-PR-03 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P11-RATE-LIMIT-QUOTA-USAGE-METERING-READINESS-SPEC.md"
  "docs/product/CLARA-P11-RATE-LIMIT-QUOTA-RUNBOOK.md"
  "docs/product/CLARA-P11-USAGE-METERING-BILLING-READINESS-POLICY.md"
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
  "Rate Limit" \
  "Quota" \
  "Usage Metering" \
  "billing readiness" \
  "readiness not billing launch" \
  "no quota enforcement" \
  "no payment provider integration" \
  "no charging customers" \
  "no invoice creation" \
  "no subscription mutation" \
  "no plan mutation" \
  "no entitlement mutation" \
  "aggregate-first" \
  "workspace-scoped" \
  "no raw usage events" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no CRM mutation" \
  "no outbound send" \
  "no real AI provider" \
  "P11-PR-03"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P11-PR-03 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin feat/p11-rate-limit-quota-usage-metering-readiness >/dev/null; then
    echo "Remote branch feat/p11-rate-limit-quota-usage-metering-readiness not found." >&2
    exit 1
  fi
fi

echo "CLARA P11-PR-03 VALIDATION PASSED"
