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
if [[ "$current_branch" != "chore/p18-final-runtime-trial-review-operational-handoff" ]]; then
  fail "expected branch chore/p18-final-runtime-trial-review-operational-handoff, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P18-FINAL-CONTROLLED-RUNTIME-TRIAL-REVIEW.md"
  "docs/product/CLARA-P18-FINAL-OPERATIONAL-HANDOFF.md"
  "docs/product/CLARA-P18-FINAL-TRIAL-DECISION-RECORD.md"
  "docs/product/CLARA-P18-FINAL-KNOWN-LIMITATIONS-REVIEW.md"
  "docs/product/CLARA-P18-FINAL-EVIDENCE-PRIVACY-REVIEW.md"
  "docs/product/CLARA-P18-FINAL-ISSUE-DISPOSITION-SUMMARY.md"
  "docs/product/CLARA-P18-FINAL-OPERATOR-ADMIN-SIGNOFF-SUMMARY.md"
  "docs/product/CLARA-P18-FINAL-POST-P18-RECOMMENDATION.md"
  "docs/product/CLARA-P18-FINAL-FOLLOW-UP-BACKLOG.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
)

required_tests=(
  "services/api/tests/p18-final-runtime-trial-review.test.ts"
  "services/api/tests/p18-final-operational-handoff.test.ts"
  "services/api/tests/p18-final-trial-decision-record.test.ts"
  "services/api/tests/p18-final-known-limitations-review.test.ts"
  "services/api/tests/p18-final-evidence-privacy-review.test.ts"
  "services/api/tests/p18-final-issue-disposition-summary.test.ts"
  "services/api/tests/p18-final-signoff-summary.test.ts"
  "services/api/tests/p18-final-post-p18-recommendation.test.ts"
  "services/api/tests/p18-final-follow-up-backlog.test.ts"
  "services/api/tests/p18-final-no-production-launch-regression.test.ts"
  "services/api/tests/p18-final-no-provider-billing-outbound-side-effect.test.ts"
  "services/api/tests/p18-final-roadmap-handoff.test.ts"
)

for file in "${required_docs[@]}" "${required_tests[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P18-PR-03 is complete"
  "P18-PR-04 is current/final handoff gate"
  "P18 is considered complete only after P18-PR-04 validates and merges"
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
  "final runtime trial review"
  "operational handoff"
  "decision record"
  "known limitations review"
  "evidence privacy review"
  "issue disposition summary"
  "signoff summary"
  "post-P18 recommendation"
  "follow-up backlog"
  "The next phase requires separate explicit approval"
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

check_remote_branch_offline_safe "chore/p18-final-runtime-trial-review-operational-handoff"

echo "CLARA P18-PR-04 VALIDATION PASSED"
