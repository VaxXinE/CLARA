#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "P6 Gmail credential/channel health validation failed: $*" >&2
  exit 1
}

[[ "$(git branch --show-current)" == "feat/p6-gmail-credential-channel-health" ]] ||
  fail "expected branch feat/p6-gmail-credential-channel-health"

expected_files=(
  "services/api/src/channels/channel-health-types.ts"
  "services/api/src/channels/channel-health-service.ts"
  "services/api/src/channels/channel-health-dto.ts"
  "services/api/src/channels/email/gmail-credential-boundary-policy.ts"
  "services/api/tests/p6-gmail-credential-boundary.test.ts"
  "services/api/tests/p6-channel-health-service.test.ts"
  "services/api/tests/p6-channel-health-route.test.ts"
  "apps/dashboard/src/components/ChannelHealthPanel.tsx"
  "apps/dashboard/src/components/ChannelHealthPanel.test.tsx"
  "docs/product/CLARA-P6-GMAIL-CREDENTIAL-BOUNDARY-SPEC.md"
  "docs/product/CLARA-P6-CHANNEL-HEALTH-SPEC.md"
  "docs/product/CLARA-P6-CHANNEL-HEALTH-RUNBOOK.md"
  "scripts/validate-p6-gmail-credential-channel-health.sh"
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

  if grep -En "$pattern" $runtime_files >/tmp/clara-p6-pr02-scan.txt; then
    cat /tmp/clara-p6-pr02-scan.txt >&2
    fail "runtime source contains forbidden pattern: $label"
  fi
}

scan_runtime "dangerouslySetInnerHTML" "dangerouslySetInnerHTML"
scan_runtime "privileged secret names" "SUPABASE_SERVICE_ROLE|OPENAI_API_KEY"
scan_runtime "provider cookies" "providerCookie|sessionCookie"
scan_runtime "raw provider payload" "rawProviderPayload|raw_provider_payload"
scan_runtime "raw DOM/HTML" "rawDom|rawHtml|raw_dom|raw_html"
scan_runtime "hardcoded bearer token" "Bearer [A-Za-z0-9._-]{8,}"
scan_runtime "credential mutation UI" "CredentialMutation|credentialMutation|rotateCredential|deleteCredential"
scan_runtime "scraping provider implementation" "puppeteer|playwright|chromedriver|whatsapp-web.js|instagram-private-api|tiktok-scraper"

dashboard_dto_ui_files="$(
  {
    git ls-files apps/dashboard/src/api
    git ls-files apps/dashboard/src/components
    git ls-files apps/dashboard/src/App.tsx
  } | grep -Ev '(^|/)(tests?)/|\.test\.(ts|tsx)$|\.md$'
)"

if grep -En "access_token|refresh_token" $dashboard_dto_ui_files >/tmp/clara-p6-pr02-dashboard-scan.txt; then
  cat /tmp/clara-p6-pr02-dashboard-scan.txt >&2
  fail "dashboard DTO/UI contains provider token field literals"
fi

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

p6_docs="$(
  cat \
    docs/product/CLARA-P6-GMAIL-CREDENTIAL-BOUNDARY-SPEC.md \
    docs/product/CLARA-P6-CHANNEL-HEALTH-SPEC.md \
    docs/product/CLARA-P6-CHANNEL-HEALTH-RUNBOOK.md
)"

required_patterns=(
  "Gmail Credential Boundary"
  "Channel Health"
  "connected"
  "disconnected"
  "degraded"
  "auth_required"
  "rate_limited"
  "safeReasonCode"
  "backend AuthContext"
  "workspace-scoped"
  "no raw provider payload"
  "no access token"
  "no refresh token"
  "official API required"
)

for pattern in "${required_patterns[@]}"; do
  grep -Fq "$pattern" <<<"$p6_docs" || fail "missing docs pattern: $pattern"
done

(
  cd services/api
  npm install
  npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write
  npm run typecheck
  npm run test
  npm run build
  npm audit --omit=dev --audit-level=high
)

(
  cd apps/dashboard
  npm install
  npx --yes prettier "src/**/*.{ts,tsx}" --write
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
bash scripts/validate-production-runtime-config.sh
bash -n scripts/validate-p6-provider-readiness-policy.sh
docker compose -f docker-compose.prod.example.yml config >/dev/null

if git ls-remote --exit-code --heads origin feat/p6-gmail-credential-channel-health >/dev/null 2>&1; then
  echo "Remote branch exists: origin/feat/p6-gmail-credential-channel-health"
else
  echo "Remote branch does not exist yet; run again after push for remote validation."
fi

echo "CLARA P6-PR-02 VALIDATION PASSED"
