#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p11-queue-job-retry-idempotency-hardening" ]]; then
  echo "Expected branch feat/p11-queue-job-retry-idempotency-hardening, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/reliability/queue-job-reliability-types.ts"
  "services/api/src/reliability/queue-job-reliability-dto.ts"
  "services/api/src/reliability/queue-job-reliability-policy.ts"
  "services/api/src/reliability/queue-job-reliability-service.ts"
  "services/api/src/reliability/retry-backoff-hardening-policy.ts"
  "services/api/src/reliability/idempotency-hardening-policy.ts"
  "services/api/src/reliability/dead-letter-readiness-policy.ts"
  "services/api/src/reliability/job-failure-classification-policy.ts"
  "services/api/src/reliability/reliability-safe-summary.ts"
  "services/api/src/http/routes/reliability-queue-job-readiness.ts"
  "services/api/tests/p11-queue-job-reliability-policy.test.ts"
  "services/api/tests/p11-queue-job-reliability-service.test.ts"
  "services/api/tests/p11-queue-job-reliability-route.test.ts"
  "services/api/tests/p11-retry-backoff-hardening-policy.test.ts"
  "services/api/tests/p11-idempotency-hardening-policy.test.ts"
  "services/api/tests/p11-dead-letter-readiness-policy.test.ts"
  "services/api/tests/p11-job-failure-classification-policy.test.ts"
  "services/api/tests/p11-queue-job-no-worker-execution-regression.test.ts"
  "services/api/tests/p11-queue-job-no-mutation-regression.test.ts"
  "services/api/tests/p11-queue-job-security-boundary.test.ts"
  "apps/dashboard/src/components/QueueJobReliabilityReadinessPanel.tsx"
  "apps/dashboard/src/components/QueueJobReliabilityReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p11-queue-job-reliability-readiness-security.test.tsx"
  "apps/extension/src/tests/p11-queue-job-retry-idempotency-extension-boundary.test.ts"
  "docs/product/CLARA-P11-QUEUE-JOB-RETRY-IDEMPOTENCY-HARDENING-SPEC.md"
  "docs/product/CLARA-P11-QUEUE-JOB-RELIABILITY-RUNBOOK.md"
  "docs/product/CLARA-P11-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P11-SLO-RELIABILITY-BASELINE.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p11-queue-job-retry-idempotency-hardening.sh"
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
  "services/api/src/reliability/queue-job-reliability-types.ts"
  "services/api/src/reliability/queue-job-reliability-dto.ts"
  "services/api/src/reliability/queue-job-reliability-policy.ts"
  "services/api/src/reliability/queue-job-reliability-service.ts"
  "services/api/src/reliability/retry-backoff-hardening-policy.ts"
  "services/api/src/reliability/idempotency-hardening-policy.ts"
  "services/api/src/reliability/dead-letter-readiness-policy.ts"
  "services/api/src/reliability/job-failure-classification-policy.ts"
  "services/api/src/reliability/reliability-safe-summary.ts"
  "services/api/src/http/routes/reliability-queue-job-readiness.ts"
  "apps/dashboard/src/components/QueueJobReliabilityReadinessPanel.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token" \
  "refresh_token" \
  "providerCookie" \
  "sessionCookie" \
  " rawJobPayload:" \
  "raw_job_payload" \
  " rawProviderPayload:" \
  "raw_provider_payload" \
  " rawWebhookPayload:" \
  "raw_webhook_payload" \
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
  "enforceQuota(" \
  "executeJob(" \
  "enqueueJob(" \
  "retryJob(" \
  "replayJob(" \
  "purgeJob(" \
  "runScheduler(" \
  "runDestructiveCleanup(" \
  "sendOutbound" \
  "createTask(" \
  "assignOwner(" \
  "updateLifecycle(" \
  "updateStatus(" \
  "writeCustomerNote("; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P11-PR-02 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P11-QUEUE-JOB-RETRY-IDEMPOTENCY-HARDENING-SPEC.md"
  "docs/product/CLARA-P11-QUEUE-JOB-RELIABILITY-RUNBOOK.md"
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
  "Queue / Job Reliability" \
  "Retry" \
  "Idempotency" \
  "Dead Letter" \
  "readiness not launch" \
  "no worker execution" \
  "no job execution" \
  "no job enqueue" \
  "no retry execution" \
  "no replay" \
  "no purge" \
  "no raw job payload" \
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
  "P11-PR-02"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P11-PR-02 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin feat/p11-queue-job-retry-idempotency-hardening >/dev/null; then
    echo "Remote branch feat/p11-queue-job-retry-idempotency-hardening not found." >&2
    exit 1
  fi
fi

echo "CLARA P11-PR-02 VALIDATION PASSED"
