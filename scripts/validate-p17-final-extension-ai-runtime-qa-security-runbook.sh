#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "chore/p17-final-extension-ai-runtime-qa-security-runbook" ]]; then
  fail "expected branch chore/p17-final-extension-ai-runtime-qa-security-runbook, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P17-FINAL-AI-RUNTIME-QA-CHECKLIST.md"
  "docs/product/CLARA-P17-FINAL-AI-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-P17-FINAL-AI-OPERATOR-RUNBOOK.md"
  "docs/product/CLARA-P17-FINAL-AI-ADMIN-RUNBOOK.md"
  "docs/product/CLARA-P17-FINAL-AI-EVIDENCE-TEMPLATE.md"
  "docs/product/CLARA-P17-FINAL-AI-KNOWN-LIMITATIONS.md"
  "docs/product/CLARA-P17-FINAL-AI-INCIDENT-ROLLBACK-GUIDANCE.md"
  "docs/product/CLARA-P17-FINAL-EXTENSION-ASSISTED-AI-SMOKE-RUNBOOK.md"
  "docs/product/CLARA-P17-CLOSURE-SUMMARY.md"
  "docs/product/CLARA-P17-REAL-AI-ANALYSIS-ROADMAP.md"
  "docs/product/CLARA-P16-P17-COMPRESSED-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

required_tests=(
  "services/api/tests/p17-final-extension-assisted-ai-e2e-smoke.test.ts"
  "services/api/tests/p17-final-ai-provider-fail-closed-regression.test.ts"
  "services/api/tests/p17-final-ai-auth-workspace-boundary.test.ts"
  "services/api/tests/p17-final-ai-cross-workspace-regression.test.ts"
  "services/api/tests/p17-final-ai-prompt-injection-regression.test.ts"
  "services/api/tests/p17-final-ai-pii-redaction-regression.test.ts"
  "services/api/tests/p17-final-ai-safe-persistence-regression.test.ts"
  "services/api/tests/p17-final-ai-audit-privacy-regression.test.ts"
  "services/api/tests/p17-final-ai-no-raw-prompt-provider-payload-regression.test.ts"
  "services/api/tests/p17-final-ai-no-provider-billing-outbound-side-effect.test.ts"
  "services/api/tests/p17-final-runtime-qa-runbook.test.ts"
  "services/api/tests/p17-closure-summary.test.ts"
  "apps/dashboard/src/components/p17-final-ai-review-ui-regression.test.tsx"
  "apps/dashboard/src/components/p17-final-ai-review-security.test.tsx"
  "apps/dashboard/src/components/p17-final-ai-review-readonly-regression.test.tsx"
  "apps/extension/src/tests/p17-final-extension-ai-boundary.test.ts"
  "apps/extension/src/tests/p17-final-extension-no-ai-secret-exposure.test.ts"
  "apps/extension/src/tests/p17-final-extension-no-autosend-regression.test.ts"
)

for file in "${required_docs[@]}" "${required_tests[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

if grep -q 'P16-PR-04 Backend Ingestion Dedup + Conversation Linking + Runtime QA. Current.' docs/product/CLARA-FINAL-ROADMAP.md; then
  fail "stale P16-PR-04 current entry remains"
fi

p16_final_count="$(grep -c 'P16-PR-04 Backend Ingestion Dedup + Conversation Linking + Runtime QA' docs/product/CLARA-FINAL-ROADMAP.md || true)"
if [[ "$p16_final_count" -gt 2 ]]; then
  fail "duplicate P16-PR-04 roadmap entries remain"
fi

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P16 Extension-Assisted Channel Ingestion Hardening is complete"
  "P17 Real AI Analysis Activation is current"
  "P17-PR-01 is complete"
  "P17-PR-02 is complete"
  "P17-PR-03 is complete"
  "P17-PR-04 is current/final validation gate"
  "P17 is considered complete only after P17-PR-04 validates and merges"
  "controlled backend real AI analysis is active for extension-assisted AI-ready context"
  "Real AI analysis is server-only"
  "Real AI analysis uses only sanitized/redacted AI-ready context"
  "Real AI analysis fails closed when provider config is missing/invalid/disabled"
  "Model allowlist, cost guardrail, rate limit guardrail, timeout policy, and prompt-injection boundary are enforced"
  "Raw prompts are not persisted"
  "Raw customer messages are not persisted as AI prompts"
  "Raw AI provider payloads and responses are not persisted"
  "AI analysis persistence stores only safe/redacted result"
  "Dashboard review UI shows only safe AI analysis output"
  "Extension must not call AI providers directly"
  "AI provider secrets are server-only"
  "AI provider secrets must not be exposed to dashboard or extension"
  "Outbound auto-send remains disabled"
  "Official WA/IG/TikTok APIs remain not activated"
  "Billing/payment is deferred"
  "CLARA is not public SaaS launch"
  "CLARA is not production deployment claim unless separately executed"
  "AuthContext and workspace membership remain source of truth"
  "Client-supplied workspaceId is not authoritative"
  "Runtime QA evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data"
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

frontend_runtime_sources=()
while IFS= read -r file; do
  frontend_runtime_sources+=("$file")
done < <(
  find apps/dashboard/src apps/extension/src \
    -type f \( -name '*.ts' -o -name '*.tsx' \) \
    -not -name '*.test.ts' \
    -not -name '*.test.tsx' \
    -not -path 'apps/extension/src/tests/*'
)

if grep -nE '(^|[^A-Za-z])sk-[A-Za-z0-9_-]{12,}|AIza[0-9A-Za-z_-]{20,}' "${runtime_sources[@]}"; then
  fail "unexpected hard-coded AI/API key shaped value"
fi

if grep -nE 'VITE_AI_API_KEY|NEXT_PUBLIC_AI_API_KEY|PUBLIC_AI_API_KEY|AI_PROVIDER_API_KEY' "${frontend_runtime_sources[@]}"; then
  fail "unexpected frontend/public AI secret env var"
fi

if grep -nE 'persistRawPrompt|persistRawProviderPayload|persistRawProviderResponse|rawProviderPayloadRepository|rawProviderResponseRepository' "${runtime_sources[@]}"; then
  fail "unexpected raw AI prompt/provider payload persistence"
fi

if grep -nE 'console\.(log|info|warn|error)\(.*(prompt|rawProvider|rawAi|customerMessage|apiKey|Authorization)' "${runtime_sources[@]}"; then
  fail "unexpected sensitive AI logging"
fi

if grep -nE 'autoSendReply|clickSend|submitReplyAutomatically' "${runtime_sources[@]}"; then
  fail "unexpected outbound auto-send activation"
fi

if grep -nE 'officialWhatsApp|officialInstagram|officialTikTok|whatsappProviderApi|instagramProviderApi|tiktokProviderApi' "${runtime_sources[@]}"; then
  fail "unexpected official WA/IG/TikTok API activation"
fi

if grep -nE 'stripe|createCheckoutSession|createInvoice|chargeCustomer|createSubscription|paymentIntent|billingCharge' "${runtime_sources[@]}"; then
  fail "unexpected billing/payment activation"
fi

if grep -nE 'deployProduction|productionDeploy|rollbackProduction' "${runtime_sources[@]}"; then
  fail "unexpected production deployment automation"
fi

if grep -nE 'dangerouslySetInnerHTML' "${runtime_sources[@]}"; then
  fail "unexpected unsafe HTML rendering"
fi

if grep -nE 'api\.openai\.com|api\.anthropic\.com|AI_PROVIDER_API_KEY|VITE_AI_API_KEY|NEXT_PUBLIC_AI_API_KEY|PUBLIC_AI_API_KEY' "${frontend_runtime_sources[@]}"; then
  fail "unexpected frontend/extension AI provider call or secret boundary"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/extension/src/**/*.{ts,tsx}" --write
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if ! git ls-remote --exit-code --heads origin chore/p17-final-extension-ai-runtime-qa-security-runbook >/dev/null 2>&1; then
  fail "remote branch chore/p17-final-extension-ai-runtime-qa-security-runbook not found; push before final validation"
fi

echo "CLARA P17-PR-04 VALIDATION PASSED"
