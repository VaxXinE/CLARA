#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p11-billing-readiness-plan-entitlement-policy" ]]; then
  echo "Expected branch feat/p11-billing-readiness-plan-entitlement-policy, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/billing/billing-readiness-types.ts"
  "services/api/src/billing/billing-readiness-dto.ts"
  "services/api/src/billing/billing-readiness-policy.ts"
  "services/api/src/billing/billing-readiness-service.ts"
  "services/api/src/billing/plan-catalog-readiness-types.ts"
  "services/api/src/billing/plan-catalog-readiness-policy.ts"
  "services/api/src/billing/plan-catalog-readiness-service.ts"
  "services/api/src/billing/entitlement-readiness-types.ts"
  "services/api/src/billing/entitlement-readiness-policy.ts"
  "services/api/src/billing/entitlement-readiness-service.ts"
  "services/api/src/billing/subscription-lifecycle-boundary-policy.ts"
  "services/api/src/billing/payment-provider-boundary-policy.ts"
  "services/api/src/billing/billing-readiness-safe-summary.ts"
  "services/api/src/http/routes/billing-plan-entitlement-readiness.ts"
  "services/api/tests/p11-billing-readiness-policy.test.ts"
  "services/api/tests/p11-billing-readiness-service.test.ts"
  "services/api/tests/p11-billing-plan-entitlement-route.test.ts"
  "services/api/tests/p11-plan-catalog-readiness-policy.test.ts"
  "services/api/tests/p11-plan-catalog-readiness-service.test.ts"
  "services/api/tests/p11-entitlement-readiness-policy.test.ts"
  "services/api/tests/p11-entitlement-readiness-service.test.ts"
  "services/api/tests/p11-subscription-lifecycle-boundary-policy.test.ts"
  "services/api/tests/p11-payment-provider-boundary-policy.test.ts"
  "services/api/tests/p11-billing-readiness-safe-summary.test.ts"
  "services/api/tests/p11-billing-no-payment-provider-regression.test.ts"
  "services/api/tests/p11-billing-no-charge-invoice-regression.test.ts"
  "services/api/tests/p11-billing-no-subscription-mutation-regression.test.ts"
  "services/api/tests/p11-billing-security-boundary.test.ts"
  "apps/dashboard/src/components/BillingPlanEntitlementReadinessPanel.tsx"
  "apps/dashboard/src/components/BillingPlanEntitlementReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p11-billing-plan-entitlement-readiness-security.test.tsx"
  "apps/extension/src/tests/p11-billing-plan-entitlement-extension-boundary.test.ts"
  "docs/product/CLARA-P11-BILLING-READINESS-PLAN-ENTITLEMENT-POLICY.md"
  "docs/product/CLARA-P11-BILLING-ENTITLEMENT-RUNBOOK.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P11-USAGE-METERING-BILLING-READINESS-POLICY.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p11-billing-readiness-plan-entitlement-policy.sh"
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
  "services/api/src/billing/billing-readiness-types.ts"
  "services/api/src/billing/billing-readiness-dto.ts"
  "services/api/src/billing/billing-readiness-policy.ts"
  "services/api/src/billing/billing-readiness-service.ts"
  "services/api/src/billing/plan-catalog-readiness-types.ts"
  "services/api/src/billing/plan-catalog-readiness-policy.ts"
  "services/api/src/billing/plan-catalog-readiness-service.ts"
  "services/api/src/billing/entitlement-readiness-types.ts"
  "services/api/src/billing/entitlement-readiness-policy.ts"
  "services/api/src/billing/entitlement-readiness-service.ts"
  "services/api/src/billing/subscription-lifecycle-boundary-policy.ts"
  "services/api/src/billing/payment-provider-boundary-policy.ts"
  "services/api/src/billing/billing-readiness-safe-summary.ts"
  "services/api/src/http/routes/billing-plan-entitlement-readiness.ts"
  "apps/dashboard/src/components/BillingPlanEntitlementReadinessPanel.tsx"
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
  " rawPaymentData:" \
  "raw_payment_data" \
  " rawCustomerMessage:" \
  "raw_customer_message" \
  " rawProviderPayload:" \
  "raw_provider_payload" \
  " rawWebhookPayload:" \
  "raw_webhook_payload" \
  " rawAuditMetadata:" \
  "raw_audit_metadata" \
  " rawEvidence:" \
  "raw_evidence" \
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
  "createCheckoutSession(" \
  "chargeCustomer(" \
  "createInvoice(" \
  "storePaymentMethod(" \
  "mutateSubscription(" \
  "upgradePlan(" \
  "downgradePlan(" \
  "cancelSubscription(" \
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
    echo "Unsafe P11-PR-05 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P11-BILLING-READINESS-PLAN-ENTITLEMENT-POLICY.md"
  "docs/product/CLARA-P11-BILLING-ENTITLEMENT-RUNBOOK.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P11-USAGE-METERING-BILLING-READINESS-POLICY.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "P11 Scale / Reliability / Billing" \
  "Billing Readiness" \
  "Plan Entitlement" \
  "Plan Catalog" \
  "Subscription Lifecycle" \
  "Payment Provider Boundary" \
  "readiness not billing launch" \
  "no payment provider integration" \
  "no charging customers" \
  "no invoice creation" \
  "no checkout session" \
  "no subscription mutation" \
  "no plan mutation" \
  "no entitlement mutation" \
  "no quota enforcement" \
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
  "P11-PR-05"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P11-PR-05 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin feat/p11-billing-readiness-plan-entitlement-policy >/dev/null; then
    echo "Remote branch feat/p11-billing-readiness-plan-entitlement-policy not found" >&2
    exit 1
  fi
fi

echo "CLARA P11-PR-05 VALIDATION PASSED"
