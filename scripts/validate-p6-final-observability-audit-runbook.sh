#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "P6 final observability/audit validation failed: $*" >&2
  exit 1
}

[[ "$(git branch --show-current)" == "chore/p6-final-observability-audit-runbook" ]] ||
  fail "expected branch chore/p6-final-observability-audit-runbook"

expected_files=(
  "services/api/src/channels/observability/channel-observability-policy.ts"
  "services/api/src/channels/observability/channel-operational-event-types.ts"
  "services/api/src/channels/observability/channel-safe-diagnostics.ts"
  "services/api/src/audit/provider-channel-audit-policy.ts"
  "services/api/tests/p6-channel-observability-policy.test.ts"
  "services/api/tests/p6-provider-channel-audit-policy.test.ts"
  "services/api/tests/p6-final-security-audit.test.ts"
  "services/api/tests/p6-final-runbook-completeness.test.ts"
  "apps/extension/src/tests/p6-final-extension-security-regression.test.ts"
  "docs/product/CLARA-P6-OBSERVABILITY-SPEC.md"
  "docs/product/CLARA-P6-AUDIT-TRAIL-SPEC.md"
  "docs/product/CLARA-P6-FINAL-SECURITY-AUDIT.md"
  "docs/product/CLARA-P6-PRODUCTION-PROVIDER-RUNBOOK.md"
  "docs/product/CLARA-P6-GO-LIVE-CHECKLIST.md"
  "docs/product/CLARA-P6-TO-P7-HANDOFF.md"
  "scripts/validate-p6-final-observability-audit-runbook.sh"
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

  if grep -En "$pattern" $runtime_files >/tmp/clara-p6-pr04-scan.txt; then
    cat /tmp/clara-p6-pr04-scan.txt >&2
    fail "runtime source contains forbidden pattern: $label"
  fi
}

scan_runtime "dangerouslySetInnerHTML" "dangerouslySetInnerHTML"
scan_runtime "privileged secret names" "SUPABASE_SERVICE_ROLE|OPENAI_API_KEY"
scan_runtime "provider cookies" "providerCookie|sessionCookie"
scan_runtime "raw provider payload" "rawProviderPayload|raw_provider_payload"
scan_runtime "raw webhook payload" "rawWebhookPayload|raw_webhook_payload"
scan_runtime "raw DOM/HTML" "rawDom|rawHtml|raw_dom|raw_html"
scan_runtime "hardcoded bearer token" "Bearer [A-Za-z0-9._-]{8,}"
scan_runtime "scraping provider implementation" "puppeteer|playwright|chromedriver|whatsapp-web.js|instagram-private-api|tiktok-scraper"
scan_runtime "extension auto-send" "autoSend|auto-send|sendAutomatically"
scan_runtime "credential mutation UI" "CredentialMutation|credentialMutation|rotateCredential|deleteCredential"
scan_runtime "role/user mutation UI" "InviteUser|UpdateRole|DeleteUser|deleteUser|updateRole|inviteUser"

runtime_observability_files="$(
  {
    git ls-files services/api/src/channels/observability
    git ls-files services/api/src/audit/provider-channel-audit-policy.ts
    git ls-files apps/dashboard/src/api
    git ls-files apps/dashboard/src/components
    git ls-files apps/dashboard/src/App.tsx
  } | grep -Ev '(^|/)(tests?)/|\.test\.(ts|tsx)$|\.md$'
)"

if grep -En "access_token|refresh_token" $runtime_observability_files >/tmp/clara-p6-pr04-token-scan.txt; then
  cat /tmp/clara-p6-pr04-token-scan.txt >&2
  fail "DTO/UI/runtime observability contains provider token field literals"
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
    docs/product/CLARA-P6-OBSERVABILITY-SPEC.md \
    docs/product/CLARA-P6-AUDIT-TRAIL-SPEC.md \
    docs/product/CLARA-P6-FINAL-SECURITY-AUDIT.md \
    docs/product/CLARA-P6-PRODUCTION-PROVIDER-RUNBOOK.md \
    docs/product/CLARA-P6-GO-LIVE-CHECKLIST.md \
    docs/product/CLARA-P6-TO-P7-HANDOFF.md
)"

required_patterns=(
  "Observability"
  "Audit Trail"
  "safeReasonCode"
  "correlationId"
  "workspace-scoped"
  "backend AuthContext"
  "webhook_received_safe"
  "webhook_rejected_safe"
  "outbound_dead_lettered"
  "outbound_retry_scheduled"
  "provider_policy_blocked"
  "no raw provider payload"
  "no access token"
  "no refresh token"
  "no cookies"
  "extension bridge"
  "P6 complete"
  "P7 handoff"
)

for pattern in "${required_patterns[@]}"; do
  grep -Fq "$pattern" <<<"$p6_docs" || fail "missing docs pattern: $pattern"
done

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
bash scripts/validate-production-runtime-config.sh
bash -n scripts/validate-p6-provider-readiness-policy.sh
bash -n scripts/validate-p6-gmail-credential-channel-health.sh
bash -n scripts/validate-p6-webhook-outbox-hardening.sh
docker compose -f docker-compose.prod.example.yml config >/dev/null

if git ls-remote --exit-code --heads origin chore/p6-final-observability-audit-runbook >/dev/null 2>&1; then
  echo "Remote branch exists: origin/chore/p6-final-observability-audit-runbook"
else
  echo "Remote branch does not exist yet; run again after push for remote validation."
fi

echo "CLARA P6-PR-04 VALIDATION PASSED"
