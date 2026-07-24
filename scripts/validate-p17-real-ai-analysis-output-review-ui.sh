#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "feat/p17-real-ai-analysis-output-review-ui" ]]; then
  fail "expected branch feat/p17-real-ai-analysis-output-review-ui, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P17-REAL-AI-ANALYSIS-OUTPUT-CONTRACT.md"
  "docs/product/CLARA-P17-REAL-AI-ANALYSIS-RUNTIME-POLICY.md"
  "docs/product/CLARA-P17-AI-ANALYSIS-PERSISTENCE-SAFETY.md"
  "docs/product/CLARA-P17-AI-ANALYSIS-DASHBOARD-REVIEW-UI.md"
  "docs/product/CLARA-P17-AI-ANALYSIS-AUDIT-PRIVACY-POLICY.md"
  "docs/product/CLARA-P17-AI-ANALYSIS-FAIL-CLOSED-RUNBOOK.md"
  "docs/product/CLARA-P17-REAL-AI-ANALYSIS-ROADMAP.md"
  "docs/product/CLARA-P16-P17-COMPRESSED-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

required_api_files=(
  "services/api/src/ai/extension-snapshot-ai-analysis-types.ts"
  "services/api/src/ai/extension-snapshot-ai-analysis-provider.ts"
  "services/api/src/ai/mock-ai-analysis-provider.ts"
  "services/api/src/ai/real-ai-analysis-provider.ts"
  "services/api/src/ai/extension-snapshot-ai-analysis-safe-output.ts"
  "services/api/src/ai/extension-snapshot-ai-analysis-repository.ts"
  "services/api/src/ai/extension-snapshot-ai-analysis-service.ts"
  "services/api/src/http/routes/extension-snapshot-ai-analysis.ts"
)

required_tests=(
  "services/api/tests/p17-real-ai-analysis-service.test.ts"
  "services/api/tests/p17-real-ai-analysis-fail-closed.test.ts"
  "services/api/tests/p17-real-ai-analysis-auth-workspace-boundary.test.ts"
  "services/api/tests/p17-real-ai-analysis-cross-workspace-regression.test.ts"
  "services/api/tests/p17-real-ai-analysis-model-allowlist.test.ts"
  "services/api/tests/p17-real-ai-analysis-cost-guardrail.test.ts"
  "services/api/tests/p17-real-ai-analysis-rate-limit-guardrail.test.ts"
  "services/api/tests/p17-real-ai-analysis-timeout-policy.test.ts"
  "services/api/tests/p17-real-ai-analysis-prompt-injection-boundary.test.ts"
  "services/api/tests/p17-real-ai-analysis-safe-output-contract.test.ts"
  "services/api/tests/p17-real-ai-analysis-persistence-safety.test.ts"
  "services/api/tests/p17-real-ai-analysis-audit-privacy.test.ts"
  "services/api/tests/p17-real-ai-analysis-no-raw-prompt-provider-payload-persistence.test.ts"
  "services/api/tests/p17-real-ai-analysis-no-provider-billing-outbound-side-effect.test.ts"
  "services/api/tests/p17-real-ai-analysis-route.test.ts"
  "services/api/tests/p17-real-ai-analysis-unsafe-snapshot-rejection.test.ts"
  "services/api/tests/p17-ai-analysis-no-official-provider-activation.test.ts"
  "services/api/tests/p17-roadmap-real-ai-analysis.test.ts"
  "apps/dashboard/src/components/ExtensionSnapshotAiAnalysisReviewPanel.tsx"
  "apps/dashboard/src/components/p17-real-ai-analysis-review-ui.test.tsx"
  "apps/dashboard/src/components/p17-real-ai-analysis-review-security.test.tsx"
  "apps/dashboard/src/components/p17-real-ai-analysis-readonly-regression.test.tsx"
  "apps/extension/src/tests/p17-extension-real-ai-analysis-boundary.test.ts"
  "apps/extension/src/tests/p17-extension-no-ai-provider-secret-exposure.test.ts"
  "apps/extension/src/tests/p17-extension-no-autonomous-analysis-autosend.test.ts"
)

for file in "${required_docs[@]}" "${required_api_files[@]}" "${required_tests[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P16 Extension-Assisted Channel Ingestion Hardening is complete"
  "P17 Real AI Analysis Activation is current"
  "P17-PR-01 is complete"
  "P17-PR-02 is complete"
  "P17-PR-03 is current"
  "controlled backend real AI analysis is activated for extension-assisted AI-ready context"
  "real AI analysis is server-only"
  "real AI analysis uses only sanitized/redacted AI-ready context"
  "real AI analysis fails closed when provider config is missing/invalid/disabled"
  "model allowlist, cost guardrail, rate limit guardrail, timeout policy, and prompt-injection boundary are enforced"
  "raw prompts are not persisted"
  "raw customer messages are not persisted as AI prompts"
  "raw AI provider payloads and responses are not persisted"
  "AI analysis persistence stores only safe/redacted result"
  "dashboard review UI shows only safe AI analysis output"
  "extension must not call AI providers directly"
  "AI provider secrets are server-only"
  "AI provider secrets must not be exposed to dashboard or extension"
  "outbound auto-send remains disabled"
  "official WA/IG/TikTok APIs remain not activated"
  "billing/payment is deferred"
  "CLARA is not public SaaS launch"
  "CLARA is not production deployment claim unless separately executed"
  "AuthContext and workspace membership remain source of truth"
  "Client-supplied workspaceId is not authoritative"
  "P17-PR-04 is next"
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

if grep -nE 'autoSendReply|clickSend|submitReplyAutomatically' "${runtime_sources[@]}"; then
  fail "unexpected outbound auto-send activation"
fi

if grep -nE 'officialWhatsApp|officialInstagram|officialTikTok|whatsappProviderApi|instagramProviderApi|tiktokProviderApi' "${runtime_sources[@]}"; then
  fail "unexpected official WA/IG/TikTok API activation"
fi

if grep -nE 'stripe|createCheckoutSession|createInvoice|chargeCustomer|createSubscription|paymentIntent|billingCharge' "${runtime_sources[@]}"; then
  fail "unexpected billing/payment activation"
fi

if grep -nE 'dangerouslySetInnerHTML' "${runtime_sources[@]}"; then
  fail "unexpected unsafe HTML rendering"
fi

if grep -nE 'openai|anthropic|api\.openai\.com|api\.anthropic\.com|AI_PROVIDER_API_KEY' "${frontend_runtime_sources[@]}"; then
  fail "unexpected frontend/extension AI provider call or secret boundary"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/extension/src/**/*.{ts,tsx}" --write
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if ! git ls-remote --exit-code --heads origin feat/p17-real-ai-analysis-output-review-ui >/dev/null 2>&1; then
  fail "remote branch feat/p17-real-ai-analysis-output-review-ui not found; push before final validation"
fi

echo "CLARA P17-PR-03 VALIDATION PASSED"
