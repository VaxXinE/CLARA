#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

check_format_offline() {
  if command -v prettier >/dev/null 2>&1; then
    prettier --check \
      "services/api/src/**/*.ts" \
      "services/api/tests/**/*.ts" \
      "apps/dashboard/src/**/*.{ts,tsx}" \
      "apps/extension/src/**/*.{ts,tsx}"
    return
  fi

  local local_prettier
  local_prettier="$(find services apps -path '*/node_modules/.bin/prettier' -type f -print -quit)"
  if [[ -n "$local_prettier" ]]; then
    "$local_prettier" --check \
      "services/api/src/**/*.ts" \
      "services/api/tests/**/*.ts" \
      "apps/dashboard/src/**/*.{ts,tsx}" \
      "apps/extension/src/**/*.{ts,tsx}"
    return
  fi

  echo "Skipping repository-level Prettier check because Prettier is not installed locally."
}

run_npm_audit_offline_safe() {
  local workspace="$1"
  local output

  set +e
  output="$(cd "$workspace" && npm audit --omit=dev --audit-level=high 2>&1)"
  local status=$?
  set -e

  if [[ $status -eq 0 ]]; then
    printf '%s\n' "$output"
    return
  fi

  if grep -qE 'ENOTFOUND|EAI_AGAIN|ECONNRESET|ETIMEDOUT|audit endpoint returned an error|network request' <<<"$output"; then
    echo "Skipping npm audit for ${workspace} because npm registry is unavailable offline."
    return
  fi

  printf '%s\n' "$output" >&2
  return "$status"
}

check_remote_branch_offline_safe() {
  local branch="$1"
  local output

  set +e
  output="$(git ls-remote --exit-code --heads origin "$branch" 2>&1)"
  local status=$?
  set -e

  if [[ $status -eq 0 ]]; then
    return
  fi

  if grep -qE 'Could not resolve host|ENOTFOUND|EAI_AGAIN|network|unable to access' <<<"$output"; then
    echo "Skipping remote branch check because GitHub is unavailable offline."
    return
  fi

  printf '%s\n' "$output" >&2
  fail "remote branch ${branch} not found; push before final validation"
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "chore/p18-runtime-trial-execution-evidence-log" ]]; then
  fail "expected branch chore/p18-runtime-trial-execution-evidence-log, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P18-RUNTIME-TRIAL-EXECUTION-LOG.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-LOG.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-RUN-SUMMARY.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ISSUE-DISPOSITION.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-OPERATOR-SIGNOFF.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ADMIN-SIGNOFF.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-INDEX.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-PRIVACY-REVIEW.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-STOP-ROLLBACK-DECISION.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
)

required_tests=(
  "services/api/tests/p18-runtime-trial-execution-log.test.ts"
  "services/api/tests/p18-runtime-trial-evidence-log.test.ts"
  "services/api/tests/p18-runtime-trial-run-summary.test.ts"
  "services/api/tests/p18-runtime-trial-issue-disposition.test.ts"
  "services/api/tests/p18-runtime-trial-signoff-records.test.ts"
  "services/api/tests/p18-runtime-trial-evidence-privacy-review.test.ts"
  "services/api/tests/p18-runtime-trial-stop-rollback-decision.test.ts"
  "services/api/tests/p18-runtime-trial-roadmap-execution.test.ts"
  "services/api/tests/p18-runtime-trial-no-production-launch-regression.test.ts"
  "services/api/tests/p18-runtime-trial-no-provider-billing-outbound-side-effect.test.ts"
)

for file in "${required_docs[@]}" "${required_tests[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P18-PR-02 is complete"
  "P18-PR-03 is current"
  "P18 validates controlled internal runtime behavior only"
  "P18 is not public SaaS launch"
  "P18 is not production deployment"
  "Billing/payment remains deferred"
  "Official WA/IG/TikTok APIs remain not activated"
  "Outbound auto-send remains disabled"
  "AI analysis remains backend/server-side"
  "AI provider secrets remain server-only"
  "Extension must not call AI providers directly"
  "AuthContext and workspace membership remain source of truth"
  "Client-supplied workspaceId is not authoritative"
  "Runtime evidence/logs must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data"
  "execution log"
  "evidence log"
  "run summary"
  "issue disposition"
  "signoff records"
  "evidence privacy review"
  "stop/rollback decision record"
  "P18-PR-04 is next"
)

for phrase in "${required_phrases[@]}"; do
  grep -qiF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

runtime_sources=()
while IFS= read -r file; do
  runtime_sources+=("$file")
done < <(
  find services/api/src apps/dashboard/src apps/extension/src \
    -type f \( -name '*.ts' -o -name '*.tsx' \) \
    -not -name '*.test.ts' \
    -not -name '*.test.tsx' \
    -not -path 'apps/extension/src/tests/*'
)

frontend_runtime_sources=()
while IFS= read -r file; do
  frontend_runtime_sources+=("$file")
done < <(
  find apps/dashboard/src apps/extension/src \
    -type f \( -name '*.ts' -o -name '*.tsx' \) \
    -not -name '*.test.ts' \
    -not -name '*.test.tsx' \
    -not -path 'apps/extension/src/tests/*'
)

if grep -nE '(^|[^A-Za-z])sk-[A-Za-z0-9_-]{12,}|AIza[0-9A-Za-z_-]{20,}' "${runtime_sources[@]}"; then
  fail "unexpected hard-coded AI/API key shaped value"
fi

if grep -nE 'VITE_AI_API_KEY|NEXT_PUBLIC_AI_API_KEY|PUBLIC_AI_API_KEY|AI_PROVIDER_API_KEY' "${frontend_runtime_sources[@]}"; then
  fail "unexpected frontend/public AI secret env var"
fi

if grep -nE 'api\.openai\.com|api\.anthropic\.com|AI_PROVIDER_API_KEY|VITE_AI_API_KEY|NEXT_PUBLIC_AI_API_KEY|PUBLIC_AI_API_KEY' "${frontend_runtime_sources[@]}"; then
  fail "unexpected frontend/extension AI provider call or secret boundary"
fi

if grep -nE 'autoSendReply|clickSend|submitReplyAutomatically' "${runtime_sources[@]}"; then
  fail "unexpected outbound auto-send activation"
fi

if grep -nE 'officialWhatsApp|officialInstagram|officialTikTok|whatsappProviderApi|instagramProviderApi|tiktokProviderApi' "${runtime_sources[@]}"; then
  fail "unexpected official WA/IG/TikTok API activation"
fi

if grep -nE 'stripe|createCheckoutSession|createInvoice|chargeCustomer|createSubscription|paymentIntent|billingCharge' "${runtime_sources[@]}"; then
  fail "unexpected billing/payment activation"
fi

if grep -nE 'deployProduction|productionDeploy|rollbackProduction' "${runtime_sources[@]}"; then
  fail "unexpected production deployment automation"
fi

if grep -nE 'dangerouslySetInnerHTML' "${runtime_sources[@]}"; then
  fail "unexpected unsafe HTML rendering"
fi

check_format_offline
git diff --check

(cd services/api && npm run typecheck && npm run test && npm run build)
run_npm_audit_offline_safe "services/api"

(cd apps/dashboard && npm run typecheck && npm run test && npm run build)
run_npm_audit_offline_safe "apps/dashboard"

(cd apps/extension && npm run typecheck && npm run test && npm run build)
run_npm_audit_offline_safe "apps/extension"

bash scripts/validate-repo-structure.sh

check_remote_branch_offline_safe "chore/p18-runtime-trial-execution-evidence-log"

echo "CLARA P18-PR-03 VALIDATION PASSED"
