#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "P5 final security audit validation failed: $*" >&2
  exit 1
}

[[ "$(git branch --show-current)" == "chore/p5-final-security-audit" ]] ||
  fail "expected branch chore/p5-final-security-audit"

expected_files=(
  "services/api/tests/p5-final-security-audit.test.ts"
  "apps/dashboard/src/config/p5-final-dashboard-security.test.ts"
  "apps/extension/src/tests/p5-final-extension-security-regression.test.ts"
  "scripts/validate-p5-final-security-audit.sh"
  "docs/product/CLARA-P5-FINAL-SECURITY-AUDIT.md"
  "docs/product/CLARA-P5-PRODUCTION-AUTH-RUNBOOK.md"
  "docs/product/CLARA-P5-INCIDENT-RESPONSE-RUNBOOK.md"
  "docs/product/CLARA-P5-GO-LIVE-CHECKLIST.md"
)

for path in "${expected_files[@]}"; do
  [[ -f "$path" ]] || fail "missing expected file: $path"
done

upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
if [[ -n "$upstream" ]]; then
  remote_files="$(git ls-tree -r --name-only "$upstream")"
  for path in "${expected_files[@]}"; do
    grep -Fxq "$path" <<<"$remote_files" ||
      fail "expected file is not present on upstream $upstream: $path"
  done
else
  echo "No upstream branch configured yet; skipping remote file check before first push."
fi

runtime_files="$(
  {
    git ls-files services/api/src
    git ls-files apps/dashboard/src
    git ls-files apps/extension/src
  } | grep -Ev '(^|/)(tests?)/|\.test\.(ts|tsx)$|\.md$'
)"

scan_runtime() {
  local label="$1"
  local pattern="$2"

  if grep -En "$pattern" $runtime_files >/tmp/clara-p5-scan.txt; then
    cat /tmp/clara-p5-scan.txt >&2
    fail "runtime source contains forbidden pattern: $label"
  fi
}

scan_runtime "dangerouslySetInnerHTML" "dangerouslySetInnerHTML"
scan_runtime "privileged frontend or AI secret names" "SUPABASE_SERVICE_ROLE|OPENAI_API_KEY"
scan_runtime "raw provider payload" "rawProviderPayload|raw_provider_payload"
scan_runtime "provider cookies" "providerCookie|sessionCookie"
scan_runtime "provider tokens" "providerToken|provider_token"
scan_runtime "hardcoded bearer token" "Bearer [A-Za-z0-9._-]{8,}"
scan_runtime "role/user mutation handlers" "inviteUser|updateRole|deleteUser|deactivateUser|app\\.(post|put|patch|delete)\\(.*/api/v1/workspace/(members|roles)"
scan_runtime "route library imports" "react-router|next/router|next/navigation"

tracked_artifacts="$(
  git ls-files | grep -E '(^dist/|^build/|^apps/dashboard/dist/|^apps/dashboard/build/|^apps/extension/dist/|^apps/extension/build/)' || true
)"
[[ -z "$tracked_artifacts" ]] || fail "tracked build artifacts are not allowed: $tracked_artifacts"

env_files="$(
  git ls-files --others --exclude-standard --cached |
    grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' || true
)"
[[ -z "$env_files" ]] || fail "env files must not be committed or staged: $env_files"

(
  cd services/api
  npm install
  npm run typecheck
  npm run test
  npm run build
  npm audit --omit=dev --audit-level=high
)

(
  cd apps/dashboard
  npm install
  npm run typecheck
  npm run test
  npm run build
  npm audit --omit=dev --audit-level=high
)

(
  cd apps/extension
  npm install
  npm run typecheck
  npm run test
  npm run build
  npm audit --omit=dev --audit-level=high
)

bash scripts/validate-repo-structure.sh
docker compose -f docker-compose.prod.example.yml config >/dev/null
bash scripts/validate-production-runtime-config.sh
bash -n scripts/production-smoke-check.sh

echo "CLARA P5-PR-06 VALIDATION PASSED"
