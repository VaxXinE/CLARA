#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "docs/p11-scale-reliability-billing-scope-slo-policy" ]]; then
  echo "Expected branch docs/p11-scale-reliability-billing-scope-slo-policy, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/reliability/p11-scale-reliability-scope-policy.ts"
  "services/api/src/reliability/slo-readiness-policy.ts"
  "services/api/src/reliability/reliability-baseline-policy.ts"
  "services/api/src/reliability/capacity-performance-target-policy.ts"
  "services/api/src/billing/usage-metering-readiness-policy.ts"
  "services/api/src/billing/billing-readiness-boundary-policy.ts"
  "services/api/src/reliability/scale-reliability-readiness-types.ts"
  "services/api/tests/p11-scale-reliability-scope-policy.test.ts"
  "services/api/tests/p11-slo-readiness-policy.test.ts"
  "services/api/tests/p11-reliability-baseline-policy.test.ts"
  "services/api/tests/p11-capacity-performance-target-policy.test.ts"
  "services/api/tests/p11-usage-metering-readiness-policy.test.ts"
  "services/api/tests/p11-billing-readiness-boundary-policy.test.ts"
  "services/api/tests/p11-scale-reliability-billing-security-boundary.test.ts"
  "apps/dashboard/src/components/ScaleReliabilityBillingReadinessPanel.tsx"
  "apps/dashboard/src/components/ScaleReliabilityBillingReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p11-scale-reliability-billing-readiness-security.test.tsx"
  "apps/extension/src/tests/p11-scale-reliability-billing-extension-boundary.test.ts"
  "docs/product/CLARA-P11-SCALE-RELIABILITY-BILLING-SCOPE-SLO-POLICY.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P11-SLO-RELIABILITY-BASELINE.md"
  "docs/product/CLARA-P11-USAGE-METERING-BILLING-READINESS-POLICY.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p11-scale-reliability-billing-scope-slo-policy.sh"
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
  "services/api/src/reliability/p11-scale-reliability-scope-policy.ts"
  "services/api/src/reliability/slo-readiness-policy.ts"
  "services/api/src/reliability/reliability-baseline-policy.ts"
  "services/api/src/reliability/capacity-performance-target-policy.ts"
  "services/api/src/billing/usage-metering-readiness-policy.ts"
  "services/api/src/billing/billing-readiness-boundary-policy.ts"
  "services/api/src/reliability/scale-reliability-readiness-types.ts"
  "apps/dashboard/src/components/ScaleReliabilityBillingReadinessPanel.tsx"
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
  " rawEvidence:" \
  "raw_evidence" \
  " rawPermissionInternals:" \
  "raw_permission_internals" \
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
  ">Export<" \
  ">Download<" \
  ">Execute<" \
  ">Apply<" \
  ">Charge<" \
  ">Create Invoice<" \
  ">Upgrade Plan<" \
  ">Downgrade Plan<" \
  ">Cancel Subscription<" \
  ">Enforce Quota<" \
  ">Run Load Test<" \
  ">Send Message<" \
  ">Run Job<" \
  "chargeCustomer(" \
  "createInvoice(" \
  "mutateSubscription(" \
  "upgradePlan(" \
  "downgradePlan(" \
  "cancelSubscription(" \
  "enforceQuota(" \
  "runLoadTest(" \
  "startJob(" \
  "createTask(" \
  "assignOwner(" \
  "updateLifecycle(" \
  "updateStatus(" \
  "writeCustomerNote(" \
  "sendOutbound" \
  "executeWorkflow("; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P11 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P11-SCALE-RELIABILITY-BILLING-SCOPE-SLO-POLICY.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P11-SLO-RELIABILITY-BASELINE.md"
  "docs/product/CLARA-P11-USAGE-METERING-BILLING-READINESS-POLICY.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "P11 Scale / Reliability / Billing" \
  "SLO readiness" \
  "reliability baseline" \
  "usage metering readiness" \
  "billing readiness" \
  "readiness not launch" \
  "no payment provider integration" \
  "no charging customers" \
  "no invoice creation" \
  "no subscription mutation" \
  "no quota enforcement" \
  "workspace-scoped" \
  "aggregate-first" \
  "raw customer messages" \
  "raw provider payload" \
  "raw webhook payload" \
  "access token" \
  "refresh token" \
  "cookies" \
  "no CRM mutation" \
  "no outbound send" \
  "no real AI provider" \
  "P11-PR-01"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P11 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin docs/p11-scale-reliability-billing-scope-slo-policy >/dev/null; then
    echo "Remote branch docs/p11-scale-reliability-billing-scope-slo-policy not found." >&2
    exit 1
  fi
fi

echo "CLARA P11-PR-01 VALIDATION PASSED"
