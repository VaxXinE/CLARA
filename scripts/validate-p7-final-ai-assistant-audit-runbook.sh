#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "chore/p7-final-ai-assistant-audit-runbook" ]]; then
  echo "Expected branch chore/p7-final-ai-assistant-audit-runbook, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/tests/p7-final-ai-assistant-audit.test.ts"
  "services/api/tests/p7-final-ai-security-regression.test.ts"
  "services/api/tests/p7-final-ai-prompt-injection-regression.test.ts"
  "services/api/tests/p7-final-ai-audit-redaction.test.ts"
  "services/api/tests/p7-final-ai-auth-workspace-boundary.test.ts"
  "services/api/tests/p7-final-ai-no-provider-call-regression.test.ts"
  "apps/dashboard/src/components/p7-final-ai-ui-regression.test.tsx"
  "apps/dashboard/src/components/p7-final-ai-security.test.tsx"
  "apps/dashboard/src/components/p7-final-ai-accessibility.test.tsx"
  "apps/extension/src/tests/p7-final-ai-extension-security-regression.test.ts"
  "apps/extension/src/tests/p7-final-ai-companion-boundary-regression.test.ts"
  "docs/product/CLARA-P7-FINAL-AI-ASSISTANT-AUDIT.md"
  "docs/product/CLARA-P7-FINAL-AI-ASSISTANT-RUNBOOK.md"
  "docs/product/CLARA-P7-AI-INCIDENT-RESPONSE-RUNBOOK.md"
  "docs/product/CLARA-P7-AI-GO-LIVE-CHECKLIST.md"
  "docs/product/CLARA-P7-AI-SECURITY-REVIEW.md"
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
  scripts/validate-p7-ai-conversation-summary-customer-notes.sh \
  scripts/validate-p7-ai-automation-guardrails-abuse-tests.sh; do
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

tracked_env="$(
  git ls-files | grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' || true
)"
if [[ -n "$tracked_env" ]]; then
  echo "Tracked env file found:" >&2
  echo "$tracked_env" >&2
  exit 1
fi

tracked_artifacts="$(
  git ls-files | grep -E '(^|/)(dist|build|coverage|node_modules)/' || true
)"
if [[ -n "$tracked_artifacts" ]]; then
  echo "Tracked build artifact found:" >&2
  echo "$tracked_artifacts" >&2
  exit 1
fi

dangerous_files="$(
  git ls-files | grep -E '\.pem$|\.key$|id_rsa|id_ed25519|refresh_token|client_secret|OPENAI_API_KEY|GEMINI_API_KEY|ANTHROPIC_API_KEY' || true
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
      xargs -0 grep -nE 'dangerouslySetInnerHTML|SUPABASE_SERVICE_ROLE|OPENAI_API_KEY|GEMINI_API_KEY|ANTHROPIC_API_KEY|access_token exposure|refresh_token exposure|providerCookie|sessionCookie|rawProviderPayload|raw_provider_payload|rawWebhookPayload|raw_webhook_payload|rawDom|rawHtml|raw_dom|raw_html|rawPrompt exposure|Bearer sk-|api\.openai\.com|generativelanguage\.googleapis\.com|anthropic\.com|from ["'\'']openai["'\'']|@google/generative-ai|@anthropic-ai/sdk|ai auto-send execution|autonomous provider action execution|automatic customer note write|CRM/customer mutation from AI|automatic task creation|automatic scheduler|automatic reminder creation|provider/user/role/billing mutation from AI|unofficial scraping provider implementation|browser automation provider session|credential mutation UI|role/user mutation UI' || true
  }
)"
if [[ -n "$runtime_hits" ]]; then
  echo "Unsafe runtime pattern found:" >&2
  echo "$runtime_hits" >&2
  exit 1
fi

docs=(
  docs/product/CLARA-P7-FINAL-AI-ASSISTANT-AUDIT.md
  docs/product/CLARA-P7-FINAL-AI-ASSISTANT-RUNBOOK.md
  docs/product/CLARA-P7-AI-INCIDENT-RESPONSE-RUNBOOK.md
  docs/product/CLARA-P7-AI-GO-LIVE-CHECKLIST.md
  docs/product/CLARA-P7-AI-SECURITY-REVIEW.md
  docs/product/CLARA-P7-IMPLEMENTATION-ROADMAP.md
  docs/product/CLARA-MVP-GAP-REVIEW.md
)

for pattern in \
  "Final AI Assistant Audit" \
  "AI Assistant Runbook" \
  "Incident Response" \
  "Go-Live Checklist" \
  "suggestion-only" \
  "review-only" \
  "evaluation-only" \
  "requiresHumanApproval" \
  "no auto-send" \
  "no automatic customer note write" \
  "no automatic task creation" \
  "no automatic scheduler" \
  "no real LLM provider" \
  "no AI SDK" \
  "backend AuthContext" \
  "workspace-scoped" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no raw DOM" \
  "no raw HTML" \
  "P7 complete" \
  "P8 CRM & Workflow Intelligence"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected docs pattern: $pattern" >&2
    exit 1
  fi
done

if ! git ls-remote --exit-code --heads origin chore/p7-final-ai-assistant-audit-runbook >/dev/null 2>&1; then
  echo "Remote branch chore/p7-final-ai-assistant-audit-runbook does not exist yet. Push before final validation." >&2
  exit 1
fi

echo "CLARA P7-PR-08 VALIDATION PASSED"
