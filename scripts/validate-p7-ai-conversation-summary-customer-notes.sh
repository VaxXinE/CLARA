#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p7-ai-conversation-summary-customer-notes" ]]; then
  echo "Expected branch feat/p7-ai-conversation-summary-customer-notes, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/ai/ai-conversation-summary-types.ts"
  "services/api/src/ai/ai-conversation-summary-provider.ts"
  "services/api/src/ai/mock-ai-conversation-summary-provider.ts"
  "services/api/src/ai/ai-conversation-summary-policy.ts"
  "services/api/src/ai/ai-conversation-summary-service.ts"
  "services/api/src/ai/ai-conversation-summary-dto.ts"
  "services/api/src/ai/ai-customer-note-suggestion-types.ts"
  "services/api/src/ai/ai-customer-note-suggestion-provider.ts"
  "services/api/src/ai/mock-ai-customer-note-suggestion-provider.ts"
  "services/api/src/ai/ai-customer-note-suggestion-policy.ts"
  "services/api/src/ai/ai-customer-note-suggestion-service.ts"
  "services/api/src/ai/ai-customer-note-suggestion-dto.ts"
  "services/api/src/http/routes/ai-conversation-summaries.ts"
  "services/api/src/http/routes/ai-customer-note-suggestions.ts"
  "services/api/tests/p7-ai-conversation-summary-policy.test.ts"
  "services/api/tests/p7-ai-conversation-summary-service.test.ts"
  "services/api/tests/p7-ai-conversation-summary-route.test.ts"
  "services/api/tests/p7-ai-conversation-summary-security.test.ts"
  "services/api/tests/p7-ai-conversation-summary-audit.test.ts"
  "services/api/tests/p7-ai-customer-note-suggestion-policy.test.ts"
  "services/api/tests/p7-ai-customer-note-suggestion-service.test.ts"
  "services/api/tests/p7-ai-customer-note-suggestion-route.test.ts"
  "services/api/tests/p7-ai-customer-note-suggestion-security.test.ts"
  "services/api/tests/p7-ai-customer-note-suggestion-audit.test.ts"
  "apps/dashboard/src/components/AiConversationSummaryPanel.tsx"
  "apps/dashboard/src/components/AiConversationSummaryPanel.test.tsx"
  "apps/dashboard/src/components/AiCustomerNoteSuggestionPanel.tsx"
  "apps/dashboard/src/components/AiCustomerNoteSuggestionPanel.test.tsx"
  "apps/extension/src/tests/p7-ai-summary-note-boundary.test.ts"
  "docs/product/CLARA-P7-AI-CONVERSATION-SUMMARY-SPEC.md"
  "docs/product/CLARA-P7-AI-CUSTOMER-NOTE-SUGGESTION-SPEC.md"
  "docs/product/CLARA-P7-AI-SUMMARY-NOTES-SECURITY-RUNBOOK.md"
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
  scripts/validate-p7-ai-follow-up-recommendation.sh; do
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
  docs/product/CLARA-P7-AI-CONVERSATION-SUMMARY-SPEC.md
  docs/product/CLARA-P7-AI-CUSTOMER-NOTE-SUGGESTION-SPEC.md
  docs/product/CLARA-P7-AI-SUMMARY-NOTES-SECURITY-RUNBOOK.md
)

for pattern in \
  "AI Conversation Summary" \
  "AI Customer Note Suggestion" \
  "review-only" \
  "suggestion-only" \
  "requiresHumanApproval" \
  "no auto-write" \
  "no automatic customer note write" \
  "actionStatus" \
  "suggestion_only" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no raw DOM" \
  "no raw HTML" \
  "ai_conversation_summary_requested" \
  "ai_conversation_summary_generated" \
  "ai_customer_note_suggestion_requested" \
  "ai_customer_note_suggestion_generated"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected docs pattern: $pattern" >&2
    exit 1
  fi
done

if ! git ls-remote --exit-code --heads origin feat/p7-ai-conversation-summary-customer-notes >/dev/null 2>&1; then
  echo "Remote branch feat/p7-ai-conversation-summary-customer-notes does not exist yet. Push before final validation." >&2
  exit 1
fi

echo "CLARA P7-PR-06 VALIDATION PASSED"
