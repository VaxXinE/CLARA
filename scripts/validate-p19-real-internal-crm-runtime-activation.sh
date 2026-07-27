#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
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

  if grep -qE 'ENOTFOUND|EAI_AGAIN|ECONNRESET|ETIMEDOUT|network request|audit endpoint returned an error' <<<"$output"; then
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
expected_branch="feat/p19-real-internal-crm-runtime-activation"
if [[ "$current_branch" != "$expected_branch" ]]; then
  fail "expected branch ${expected_branch}, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P19-REAL-INTERNAL-CRM-RUNTIME-ACTIVATION.md"
  "docs/product/CLARA-P19-MOCK-DEMO-USAGE-REMOVAL-GATE.md"
  "docs/product/CLARA-P19-PROVIDER-AUTH-INTERNAL-RUNTIME.md"
  "docs/product/CLARA-P19-FIRST-OWNER-WORKSPACE-BOOTSTRAP-RUNBOOK.md"
  "docs/product/CLARA-P19-INTERNAL-CRM-OPERATOR-RUNBOOK.md"
  "docs/product/CLARA-P19-INTERNAL-CRM-ADMIN-RUNBOOK.md"
  "docs/product/CLARA-P19-REAL-CRM-DATA-USAGE-POLICY.md"
  "docs/product/CLARA-P19-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
)

for file in "${required_docs[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "internal team usage must use provider auth"
  "mock/demo mode is dev/test only"
  "demo role switcher is not used in provider mode"
  "backend AuthContext/workspace membership is source of truth"
  "client-supplied workspaceId is not authoritative"
  "viewer is read-only"
  "owner/agent CRM mutation policy remains enforced"
  "CLARA is not public GA launch"
  "billing/payment remains deferred"
  "official WA/IG/TikTok APIs remain not activated"
  "outbound auto-send remains disabled"
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

frontend_sources=()
while IFS= read -r file; do
  frontend_sources+=("$file")
done < <(
  find apps/dashboard/src apps/extension/src \
    -type f \( -name '*.ts' -o -name '*.tsx' \) \
    -not -name '*.test.ts' \
    -not -name '*.test.tsx' \
    -not -path 'apps/extension/src/tests/*'
)

if grep -nE 'VITE_.*(SERVICE|SECRET|PRIVATE).*KEY|PLASMO_PUBLIC_.*(SERVICE|SECRET|PRIVATE).*KEY' "${frontend_sources[@]}"; then
  fail "unexpected frontend privileged secret env var"
fi

if grep -nE 'VITE_.*(OPENAI|ANTHROPIC|AI).*KEY|PLASMO_PUBLIC_.*(OPENAI|ANTHROPIC|AI).*KEY' "${frontend_sources[@]}"; then
  fail "unexpected frontend/public AI secret env var"
fi

if grep -nE 'api\.openai\.com|api\.anthropic\.com|responses\.create|chat/completions' "${frontend_sources[@]}"; then
  fail "unexpected direct frontend/extension AI provider call"
fi

if grep -nE 'dangerouslySetInnerHTML' "${runtime_sources[@]}"; then
  fail "unexpected unsafe HTML rendering"
fi

if grep -nE 'AUTO_SEND_ENABLED=true|autoSendEnabled: true|outboundAutoSend: true' "${runtime_sources[@]}"; then
  fail "unexpected outbound auto-send activation"
fi

if grep -nE 'OFFICIAL_WHATSAPP_ENABLED=true|OFFICIAL_INSTAGRAM_ENABLED=true|OFFICIAL_TIKTOK_ENABLED=true' "${runtime_sources[@]}"; then
  fail "unexpected official WA/IG/TikTok activation"
fi

if grep -nE 'BILLING_ENABLED=true|PAYMENTS_ENABLED=true|createCheckoutSession|chargeCustomer' "${runtime_sources[@]}"; then
  fail "unexpected billing/payment activation"
fi

if command -v prettier >/dev/null 2>&1; then
  prettier --check \
    "services/api/src/**/*.ts" \
    "services/api/tests/**/*.ts" \
    "apps/dashboard/src/**/*.{ts,tsx}" \
    "apps/extension/src/**/*.{ts,tsx}"
else
  local_prettier="$(find services apps -path '*/node_modules/.bin/prettier' -type f -print -quit)"
  if [[ -n "$local_prettier" ]]; then
    "$local_prettier" --check \
      "services/api/src/**/*.ts" \
      "services/api/tests/**/*.ts" \
      "apps/dashboard/src/**/*.{ts,tsx}" \
      "apps/extension/src/**/*.{ts,tsx}"
  else
    echo "Skipping repository-level Prettier check because Prettier is not installed locally."
  fi
fi

git diff --check

(cd services/api && npm run typecheck && npm run test && npm run build)
run_npm_audit_offline_safe "services/api"

(cd apps/dashboard && npm run typecheck && npm run test && npm run build)
run_npm_audit_offline_safe "apps/dashboard"

(cd apps/extension && npm run typecheck && npm run test && npm run build)
run_npm_audit_offline_safe "apps/extension"

bash scripts/validate-repo-structure.sh
check_remote_branch_offline_safe "$expected_branch"

echo "CLARA P19-PR-01 REAL INTERNAL CRM RUNTIME VALIDATION PASSED"
