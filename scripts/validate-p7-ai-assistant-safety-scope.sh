#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "P7 AI assistant safety scope validation failed: $*" >&2
  exit 1
}

[[ "$(git branch --show-current)" == "docs/p7-ai-assistant-safety-scope" ]] ||
  fail "expected branch docs/p7-ai-assistant-safety-scope"

expected_files=(
  "services/api/src/ai/ai-assistant-safety-policy.ts"
  "services/api/src/ai/ai-assistant-scope.ts"
  "services/api/src/ai/ai-data-access-policy.ts"
  "services/api/src/ai/ai-prompt-injection-policy.ts"
  "services/api/src/ai/ai-human-approval-policy.ts"
  "services/api/src/ai/ai-audit-policy.ts"
  "services/api/tests/p7-ai-assistant-safety-policy.test.ts"
  "services/api/tests/p7-ai-data-access-policy.test.ts"
  "services/api/tests/p7-ai-prompt-injection-policy.test.ts"
  "services/api/tests/p7-ai-human-approval-policy.test.ts"
  "apps/extension/src/tests/p7-ai-extension-boundary-regression.test.ts"
  "docs/product/CLARA-P7-AI-ASSISTANT-SCOPE.md"
  "docs/product/CLARA-P7-AI-SAFETY-POLICY.md"
  "docs/product/CLARA-P7-AI-DATA-ACCESS-POLICY.md"
  "docs/product/CLARA-P7-PROMPT-INJECTION-POLICY.md"
  "docs/product/CLARA-P7-HUMAN-APPROVAL-POLICY.md"
  "docs/product/CLARA-P7-AI-AUDIT-POLICY.md"
  "docs/product/CLARA-P7-IMPLEMENTATION-ROADMAP.md"
  "scripts/validate-p7-ai-assistant-safety-scope.sh"
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

  if grep -En "$pattern" $runtime_files >/tmp/clara-p7-pr01-scan.txt; then
    cat /tmp/clara-p7-pr01-scan.txt >&2
    fail "runtime source contains forbidden pattern: $label"
  fi
}

scan_runtime "dangerouslySetInnerHTML" "dangerouslySetInnerHTML"
scan_runtime "privileged secret names" "SUPABASE_SERVICE_ROLE|OPENAI_API_KEY|GEMINI_API_KEY|ANTHROPIC_API_KEY"
scan_runtime "provider cookies" "providerCookie|sessionCookie"
scan_runtime "hardcoded bearer token" "Bearer [A-Za-z0-9._-]{8,}"
scan_runtime "AI auto-send behavior" "autoSend|auto-send|sendAutomatically"
scan_runtime "autonomous provider action execution" "executeProviderAction|autonomousProviderAction"
scan_runtime "scraping provider implementation" "puppeteer|playwright|chromedriver|whatsapp-web.js|instagram-private-api|tiktok-scraper"
scan_runtime "credential mutation UI" "CredentialMutation|credentialMutation|rotateCredential|deleteCredential"
scan_runtime "role/user mutation UI" "InviteUser|UpdateRole|DeleteUser|deleteUser|updateRole|inviteUser"

ai_context_files="$(
  {
    git ls-files services/api/src/ai
    git ls-files apps/dashboard/src/components
    git ls-files apps/dashboard/src/api
    git ls-files apps/extension/src
  } | grep -Ev '(^|/)(tests?)/|\.test\.(ts|tsx)$|\.md$'
)"

if grep -En "access_token|refresh_token|rawProviderPayload|raw_provider_payload|rawWebhookPayload|raw_webhook_payload|rawDom|rawHtml|raw_dom|raw_html" $ai_context_files >/tmp/clara-p7-pr01-context-scan.txt; then
  cat /tmp/clara-p7-pr01-context-scan.txt >&2
  fail "AI/dashboard/extension context source exposes token or raw provider fields"
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
    docs/product/CLARA-P7-AI-ASSISTANT-SCOPE.md \
    docs/product/CLARA-P7-AI-SAFETY-POLICY.md \
    docs/product/CLARA-P7-AI-DATA-ACCESS-POLICY.md \
    docs/product/CLARA-P7-PROMPT-INJECTION-POLICY.md \
    docs/product/CLARA-P7-HUMAN-APPROVAL-POLICY.md \
    docs/product/CLARA-P7-AI-AUDIT-POLICY.md \
    docs/product/CLARA-P7-IMPLEMENTATION-ROADMAP.md
)"

required_patterns=(
  "AI Assistant"
  "Safety Policy"
  "Data Access Policy"
  "Prompt Injection"
  "Human Approval"
  "no auto-send"
  "human-in-the-loop"
  "untrusted customer text"
  "backend AuthContext"
  "workspace-scoped"
  "no access token"
  "no refresh token"
  "no cookies"
  "no raw provider payload"
  "no raw webhook payload"
  "no raw DOM"
  "no raw HTML"
  "ai_policy_blocked"
  "ai_prompt_injection_flagged"
  "P7 Implementation Roadmap"
)

for pattern in "${required_patterns[@]}"; do
  grep -Fq "$pattern" <<<"$p7_docs" || fail "missing docs pattern: $pattern"
done

bash -n scripts/validate-p6-provider-readiness-policy.sh
bash -n scripts/validate-p6-gmail-credential-channel-health.sh
bash -n scripts/validate-p6-webhook-outbox-hardening.sh
bash -n scripts/validate-p6-final-observability-audit-runbook.sh

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

git ls-remote --exit-code --heads origin docs/p7-ai-assistant-safety-scope >/dev/null ||
  fail "remote branch docs/p7-ai-assistant-safety-scope does not exist yet; push before final PR validation"

echo "CLARA P7-PR-01 VALIDATION PASSED"
