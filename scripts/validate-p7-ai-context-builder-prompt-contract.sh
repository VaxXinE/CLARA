#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "P7 AI context builder validation failed: $*" >&2
  exit 1
}

[[ "$(git branch --show-current)" == "feat/p7-ai-context-builder-prompt-contract" ]] ||
  fail "expected branch feat/p7-ai-context-builder-prompt-contract"

expected_files=(
  "services/api/src/ai/ai-context-types.ts"
  "services/api/src/ai/ai-context-builder.ts"
  "services/api/src/ai/ai-context-sanitizer.ts"
  "services/api/src/ai/ai-context-budget.ts"
  "services/api/src/ai/ai-prompt-contract.ts"
  "services/api/src/ai/ai-prompt-message-builder.ts"
  "services/api/src/ai/ai-untrusted-content.ts"
  "services/api/tests/p7-ai-context-builder.test.ts"
  "services/api/tests/p7-ai-context-sanitizer.test.ts"
  "services/api/tests/p7-ai-context-budget.test.ts"
  "services/api/tests/p7-ai-prompt-contract.test.ts"
  "services/api/tests/p7-ai-untrusted-content.test.ts"
  "services/api/tests/p7-ai-context-security-regression.test.ts"
  "apps/extension/src/tests/p7-ai-context-boundary-regression.test.ts"
  "docs/product/CLARA-P7-AI-CONTEXT-BUILDER-SPEC.md"
  "docs/product/CLARA-P7-AI-PROMPT-CONTRACT.md"
  "docs/product/CLARA-P7-AI-CONTEXT-SECURITY-RUNBOOK.md"
  "scripts/validate-p7-ai-context-builder-prompt-contract.sh"
)

for path in "${expected_files[@]}"; do
  [[ -f "$path" ]] || fail "missing expected file: $path"
done

for prior_validator in \
  scripts/validate-p6-provider-readiness-policy.sh \
  scripts/validate-p6-gmail-credential-channel-health.sh \
  scripts/validate-p6-webhook-outbox-hardening.sh \
  scripts/validate-p6-final-observability-audit-runbook.sh \
  scripts/validate-p7-ai-assistant-safety-scope.sh; do
  [[ -f "$prior_validator" ]] && bash -n "$prior_validator"
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

  if grep -En "$pattern" $runtime_files >/tmp/clara-p7-pr02-scan.txt; then
    cat /tmp/clara-p7-pr02-scan.txt >&2
    fail "runtime source contains forbidden pattern: $label"
  fi
}

scan_runtime "dangerouslySetInnerHTML" "dangerouslySetInnerHTML"
scan_runtime "privileged secret names" "SUPABASE_SERVICE_ROLE|OPENAI_API_KEY|GEMINI_API_KEY|ANTHROPIC_API_KEY"
scan_runtime "provider cookies" "providerCookie|sessionCookie"
scan_runtime "raw provider payload" "rawProviderPayload|raw_provider_payload"
scan_runtime "raw webhook payload" "rawWebhookPayload|raw_webhook_payload"
scan_runtime "raw DOM/HTML" "rawDom|rawHtml|raw_dom|raw_html"
scan_runtime "hardcoded bearer token" "Bearer [A-Za-z0-9._-]{8,}"
scan_runtime "AI provider network call" "api.openai.com|generativelanguage.googleapis.com|anthropic.com|chat/completions|responses.create|generateContent"
scan_runtime "AI auto-send behavior" "autoSend|auto-send|sendAutomatically"
scan_runtime "autonomous provider action execution" "executeProviderAction|autonomousProviderAction"
scan_runtime "scraping provider implementation" "puppeteer|playwright|chromedriver|whatsapp-web.js|instagram-private-api|tiktok-scraper"
scan_runtime "credential mutation UI" "CredentialMutation|credentialMutation|rotateCredential|deleteCredential"
scan_runtime "role/user mutation UI" "InviteUser|UpdateRole|DeleteUser|deleteUser|updateRole|inviteUser"

ai_context_files="$(
  {
    git ls-files services/api/src/ai/ai-context-*.ts
    git ls-files services/api/src/ai/ai-prompt-*.ts
    git ls-files services/api/src/ai/ai-untrusted-content.ts
    git ls-files apps/extension/src/chatgpt
  } | grep -Ev '(^|/)(tests?)/|\.test\.(ts|tsx)$|\.md$'
)"

if grep -En "access_token|refresh_token|providerCookie|sessionCookie|rawProviderPayload|raw_provider_payload|rawWebhookPayload|raw_webhook_payload|rawDom|rawHtml|raw_dom|raw_html" $ai_context_files >/tmp/clara-p7-pr02-context-scan.txt; then
  cat /tmp/clara-p7-pr02-context-scan.txt >&2
  fail "AI context runtime exposes token/cookie/raw provider fields"
fi

tracked_env="$(
  git ls-files --cached --others --exclude-standard |
    grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' || true
)"
[[ -z "$tracked_env" ]] || fail "env files must not be committed or staged: $tracked_env"

tracked_artifacts="$(
  git ls-files |
    grep -E '(^dist/|^build/|^apps/dashboard/dist/|^apps/dashboard/build/|^apps/extension/dist/|^apps/extension/build/|^services/api/dist/)' || true
)"
[[ -z "$tracked_artifacts" ]] || fail "tracked build artifacts are not allowed: $tracked_artifacts"

dangerous_secret_files="$(
  git ls-files |
    grep -Ei '(^|/)(id_rsa|id_ed25519|.*\.pem|.*\.key|.*client_secret.*|.*refresh_token.*)$' || true
)"
[[ -z "$dangerous_secret_files" ]] || fail "dangerous tracked secret filenames found: $dangerous_secret_files"

p7_docs="$(
  cat \
    docs/product/CLARA-P7-AI-CONTEXT-BUILDER-SPEC.md \
    docs/product/CLARA-P7-AI-PROMPT-CONTRACT.md \
    docs/product/CLARA-P7-AI-CONTEXT-SECURITY-RUNBOOK.md
)"

required_patterns=(
  "AI Context Builder"
  "Prompt Contract"
  "untrusted customer content"
  "trusted application context"
  "systemPolicy"
  "developerPolicy"
  "outputContract"
  "requiresHumanApproval"
  "no auto-send"
  "backend AuthContext"
  "workspace-scoped"
  "no access token"
  "no refresh token"
  "no cookies"
  "no raw provider payload"
  "no raw webhook payload"
  "no raw DOM"
  "no raw HTML"
  "prompt injection"
)

for pattern in "${required_patterns[@]}"; do
  grep -Fq "$pattern" <<<"$p7_docs" || fail "missing docs pattern: $pattern"
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
docker compose -f docker-compose.prod.example.yml config >/dev/null
bash scripts/validate-production-runtime-config.sh

git ls-remote --exit-code --heads origin feat/p7-ai-context-builder-prompt-contract >/dev/null ||
  fail "remote branch feat/p7-ai-context-builder-prompt-contract does not exist yet; push before final validation"

echo "CLARA P7-PR-02 VALIDATION PASSED"
