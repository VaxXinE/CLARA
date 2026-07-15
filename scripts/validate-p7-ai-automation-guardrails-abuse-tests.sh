#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p7-ai-automation-guardrails-abuse-tests" ]]; then
  echo "Expected branch feat/p7-ai-automation-guardrails-abuse-tests, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/ai/ai-automation-guardrail-types.ts"
  "services/api/src/ai/ai-automation-action-classifier.ts"
  "services/api/src/ai/ai-automation-abuse-detector.ts"
  "services/api/src/ai/ai-automation-risk-policy.ts"
  "services/api/src/ai/ai-automation-audit-policy.ts"
  "services/api/src/ai/ai-automation-guardrail-service.ts"
  "services/api/src/ai/ai-automation-guardrail-dto.ts"
  "services/api/src/http/routes/ai-automation-guardrails.ts"
  "services/api/tests/ai-automation-action-classifier.test.ts"
  "services/api/tests/ai-automation-abuse-detector.test.ts"
  "services/api/tests/ai-automation-risk-policy.test.ts"
  "services/api/tests/ai-automation-guardrail-service.test.ts"
  "services/api/tests/ai-automation-guardrail-route.test.ts"
  "services/api/tests/ai-automation-abuse-regression.test.ts"
  "apps/dashboard/src/components/AiAutomationGuardrailsPanel.tsx"
  "apps/dashboard/src/components/AiAutomationGuardrailsPanel.test.tsx"
  "apps/extension/src/tests/p7-ai-automation-guardrail-boundary.test.ts"
  "docs/product/CLARA-P7-AI-AUTOMATION-GUARDRAILS-SPEC.md"
  "docs/product/CLARA-P7-AI-AUTOMATION-ABUSE-TESTS.md"
  "docs/product/CLARA-P7-AI-AUTOMATION-SECURITY-RUNBOOK.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

for script in \
  scripts/validate-p6-provider-readiness-policy.sh \
  scripts/validate-p6-gmail-credential-channel-health.sh \
  scripts/validate-p6-webhook-outbox-hardening.sh \
  scripts/validate-p6-final-observability-audit-runbook.sh \
  scripts/validate-p7-ai-assistant-safety-scope.sh \
  scripts/validate-p7-ai-context-builder-prompt-contract.sh \
  scripts/validate-p7-ai-reply-suggestion-v1.sh \
  scripts/validate-p7-ai-draft-review-human-approval.sh \
  scripts/validate-p7-ai-follow-up-recommendation.sh \
  scripts/validate-p7-ai-conversation-summary-customer-notes.sh; do
  [[ -f "$script" ]] && bash -n "$script"
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

dangerous_files="$(
  git ls-files | grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$|\.pem$|\.key$|id_rsa|id_ed25519|refresh_token|client_secret' || true
)"
if [[ -n "$dangerous_files" ]]; then
  echo "Dangerous secret-like files are tracked:" >&2
  echo "$dangerous_files" >&2
  exit 1
fi

runtime_hits="$(
  {
    find services/api/src apps/dashboard/src apps/extension/src -type f \( -name '*.ts' -o -name '*.tsx' \) \
      ! -path '*/tests/*' \
      ! -name '*.test.ts' \
      ! -name '*.test.tsx' \
      -print0 |
      xargs -0 grep -nE 'dangerouslySetInnerHTML|SUPABASE_SERVICE_ROLE|OPENAI_API_KEY|GEMINI_API_KEY|ANTHROPIC_API_KEY|providerCookie|sessionCookie|rawProviderPayload|raw_provider_payload|rawWebhookPayload|raw_webhook_payload|rawDom|rawHtml|raw_dom|raw_html|rawPrompt|Bearer sk-|api\.openai\.com|generativelanguage\.googleapis\.com|anthropic\.com|auto-send|auto send|autonomous provider action|automatic customer note write|CRM/customer mutation|automatic task creation|automatic scheduler|automatic reminder|scraping provider|credential mutation UI|role/user mutation UI' || true
  }
)"
if [[ -n "$runtime_hits" ]]; then
  echo "Unsafe runtime pattern found:" >&2
  echo "$runtime_hits" >&2
  exit 1
fi

docs=(
  docs/product/CLARA-P7-AI-AUTOMATION-GUARDRAILS-SPEC.md
  docs/product/CLARA-P7-AI-AUTOMATION-ABUSE-TESTS.md
  docs/product/CLARA-P7-AI-AUTOMATION-SECURITY-RUNBOOK.md
)

for pattern in \
  "AI Automation Guardrails" \
  "Abuse Tests" \
  "evaluation-only" \
  "requiresHumanApproval" \
  "no auto-send" \
  "no automatic task creation" \
  "no automatic scheduler" \
  "no automatic customer note write" \
  "backend AuthContext" \
  "workspace-scoped" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no raw DOM" \
  "no raw HTML" \
  "ai_automation_guardrail_evaluated" \
  "ai_automation_action_blocked" \
  "ai_automation_abuse_detected"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected docs pattern: $pattern" >&2
    exit 1
  fi
done

if ! git ls-remote --exit-code --heads origin feat/p7-ai-automation-guardrails-abuse-tests >/dev/null 2>&1; then
  echo "Remote branch feat/p7-ai-automation-guardrails-abuse-tests does not exist yet. Push before final validation." >&2
  exit 1
fi

echo "CLARA P7-PR-07 VALIDATION PASSED"
