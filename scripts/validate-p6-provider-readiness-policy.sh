#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "P6 provider readiness policy validation failed: $*" >&2
  exit 1
}

[[ "$(git branch --show-current)" == "docs/p6-provider-readiness-policy" ]] ||
  fail "expected branch docs/p6-provider-readiness-policy"

expected_files=(
  "docs/product/CLARA-P6-PROVIDER-HARDENING-PLAN.md"
  "docs/product/CLARA-P6-PROVIDER-READINESS-MATRIX.md"
  "docs/product/CLARA-P6-OFFICIAL-CHANNEL-POLICY.md"
  "docs/product/CLARA-P6-EXTENSION-BRIDGE-BOUNDARY.md"
  "services/api/tests/p6-provider-readiness-policy.test.ts"
  "apps/extension/src/tests/p6-extension-boundary-regression.test.ts"
  "scripts/validate-p6-provider-readiness-policy.sh"
)

for path in "${expected_files[@]}"; do
  [[ -f "$path" ]] || fail "missing expected file: $path"
done

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

  if grep -En "$pattern" $runtime_files >/tmp/clara-p6-scan.txt; then
    cat /tmp/clara-p6-scan.txt >&2
    fail "runtime source contains forbidden pattern: $label"
  fi
}

scan_runtime "dangerouslySetInnerHTML" "dangerouslySetInnerHTML"
scan_runtime "provider cookies" "providerCookie|sessionCookie"
scan_runtime "raw provider payload" "rawProviderPayload|raw_provider_payload"
scan_runtime "raw DOM/HTML" "rawDom|rawHtml|raw_dom|raw_html"
scan_runtime "privileged secret names" "SUPABASE_SERVICE_ROLE|OPENAI_API_KEY"
scan_runtime "hardcoded bearer token" "Bearer [A-Za-z0-9._-]{8,}"
scan_runtime "route library imports" "react-router|next/router|next/navigation"

tracked_env="$(
  git ls-files --cached --others --exclude-standard |
    grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' || true
)"
[[ -z "$tracked_env" ]] || fail "env files must not be committed or staged: $tracked_env"

tracked_artifacts="$(
  git ls-files |
    grep -E '(^dist/|^build/|^apps/dashboard/dist/|^apps/dashboard/build/|^apps/extension/dist/|^apps/extension/build/)' || true
)"
[[ -z "$tracked_artifacts" ]] || fail "tracked build artifacts are not allowed: $tracked_artifacts"

dangerous_secret_files="$(
  git ls-files |
    grep -Ei '(^|/)(id_rsa|id_ed25519|.*\.pem|.*\.key|.*client_secret.*|.*refresh_token.*)$' || true
)"
[[ -z "$dangerous_secret_files" ]] || fail "dangerous tracked secret filenames found: $dangerous_secret_files"

p6_docs="$(cat docs/product/CLARA-P6-PROVIDER-HARDENING-PLAN.md docs/product/CLARA-P6-PROVIDER-READINESS-MATRIX.md docs/product/CLARA-P6-OFFICIAL-CHANNEL-POLICY.md docs/product/CLARA-P6-EXTENSION-BRIDGE-BOUNDARY.md)"
required_patterns=(
  "Provider Readiness Matrix"
  "Official Channel Policy"
  "official API only"
  "scraping blocked"
  "session cookie blocked"
  "browser automation blocked"
  "extension bridge"
  "user-assisted"
  "active visible chat"
  "no auto-send"
  "backend authorization source of truth"
  "workspace scope"
  "Gmail"
  "Webchat"
  "WhatsApp"
  "Instagram"
  "TikTok"
)

for pattern in "${required_patterns[@]}"; do
  grep -Fq "$pattern" <<<"$p6_docs" || fail "missing docs pattern: $pattern"
done

if git ls-remote --exit-code --heads origin docs/p6-provider-readiness-policy >/dev/null 2>&1; then
  echo "Remote branch exists: origin/docs/p6-provider-readiness-policy"
else
  echo "Remote branch does not exist yet; run again after push for remote validation."
fi

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

echo "CLARA P6-PR-01 VALIDATION PASSED"
