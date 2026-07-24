#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "feat/p17-extension-snapshot-ai-context-pii-redaction" ]]; then
  fail "expected branch feat/p17-extension-snapshot-ai-context-pii-redaction, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P17-EXTENSION-SNAPSHOT-AI-CONTEXT-BUILDER.md"
  "docs/product/CLARA-P17-EXTENSION-SNAPSHOT-PII-REDACTION-PIPELINE.md"
  "docs/product/CLARA-P17-AI-CONTEXT-BUDGET-POLICY.md"
  "docs/product/CLARA-P17-PROMPT-INJECTION-BOUNDARY-POLICY.md"
  "docs/product/CLARA-P17-AI-CONTEXT-AUDIT-PRIVACY-POLICY.md"
  "docs/product/CLARA-P17-AI-READY-CONTEXT-CONTRACT.md"
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
  "services/api/tests/p17-extension-snapshot-ai-context-builder.test.ts"
  "services/api/tests/p17-extension-snapshot-ai-context-unsafe-field-rejection.test.ts"
  "services/api/tests/p17-extension-snapshot-ai-context-auth-workspace-boundary.test.ts"
  "services/api/tests/p17-extension-snapshot-ai-context-cross-workspace-regression.test.ts"
  "services/api/tests/p17-extension-snapshot-pii-redaction.test.ts"
  "services/api/tests/p17-extension-snapshot-pii-redaction-secrets.test.ts"
  "services/api/tests/p17-extension-snapshot-pii-redaction-payment-like-values.test.ts"
  "services/api/tests/p17-extension-snapshot-prompt-injection-boundary.test.ts"
  "services/api/tests/p17-extension-snapshot-ai-context-budget.test.ts"
  "services/api/tests/p17-ai-ready-context-contract.test.ts"
  "services/api/tests/p17-ai-context-no-raw-prompt-provider-payload-persistence.test.ts"
  "services/api/tests/p17-ai-context-no-real-provider-call-yet.test.ts"
  "services/api/tests/p17-ai-context-no-provider-billing-outbound-side-effect.test.ts"
  "services/api/tests/p17-roadmap-context-builder.test.ts"
  "apps/dashboard/src/components/p17-ai-context-builder-readiness-security.test.tsx"
  "apps/dashboard/src/components/p17-ai-context-no-raw-prompt-rendering.test.tsx"
  "apps/extension/src/tests/p17-extension-ai-context-boundary.test.ts"
  "apps/extension/src/tests/p17-extension-no-final-ai-prompt-builder.test.ts"
  "apps/extension/src/tests/p17-extension-no-real-ai-analysis-call.test.ts"
)

required_runtime=(
  "services/api/src/ai/extension-snapshot-ai-context-builder.ts"
  "services/api/src/ai/extension-snapshot-ai-context-types.ts"
  "services/api/src/ai/extension-snapshot-pii-redaction.ts"
  "services/api/src/ai/extension-snapshot-ai-context-budget.ts"
)

for file in "${required_docs[@]}" "${required_tests[@]}" "${required_runtime[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P16 Extension-Assisted Channel Ingestion Hardening is complete"
  "P17 Real AI Analysis Activation is current"
  "P17-PR-01 is complete"
  "P17-PR-02 is current"
  "P17-PR-02 builds AI-ready context but does not yet execute real AI provider calls"
  "AI-ready context must come only from sanitized/redacted extension snapshots"
  "PII redaction is required before future AI provider calls"
  "Raw prompts must not be persisted"
  "Raw customer messages must not be persisted as AI prompts"
  "Raw AI provider payloads and responses must not be persisted"
  "Customer text is untrusted input and must be separated from system/developer instructions"
  "Prompt-injection boundaries are required"
  "AI context size budgets are required"
  "AI provider secrets are server-only"
  "AI provider secrets must not be exposed to dashboard or extension"
  "Extension must not call AI providers directly"
  "Extension-assisted ingestion remains internal/controlled/user-assisted"
  "Official WA/IG/TikTok APIs remain not activated"
  "Outbound auto-send remains disabled"
  "Billing/payment remains deferred"
  "CLARA is not public SaaS launch"
  "CLARA is not production deployment claim unless separately executed"
  "AuthContext and workspace membership remain source of truth"
  "Client-supplied workspaceId is not authoritative"
  "P17-PR-03 is next: Real AI Analysis Output + Persistence + Dashboard Review UI"
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

if grep -qF "P17-PR-01 is current" <<<"$doc_bundle"; then
  fail "P17-PR-01 must no longer be marked current in P17 docs"
fi

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

if grep -nE '(^|[^A-Za-z])sk-[A-Za-z0-9_-]{12,}|AIza[0-9A-Za-z_-]{20,}' "${runtime_sources[@]}"; then
  fail "unexpected hard-coded AI/API key shaped value"
fi

if grep -nE 'VITE_AI_API_KEY|NEXT_PUBLIC_AI_API_KEY|PUBLIC_AI_API_KEY' "${runtime_sources[@]}"; then
  fail "unexpected frontend/public AI secret env var"
fi

if grep -nE 'persistRawPrompt|persistRawProviderPayload|persistRawProviderResponse|rawProviderPayloadRepository|rawProviderResponseRepository' "${runtime_sources[@]}"; then
  fail "unexpected raw prompt/provider payload persistence"
fi

if grep -nE 'executeExtensionSnapshotAiAnalysis|analyzeExtensionSnapshotWithProvider|callAiProviderForExtensionSnapshot' "${runtime_sources[@]}"; then
  fail "unexpected real AI provider execution for extension snapshot"
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

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/extension/src/**/*.{ts,tsx}" --write
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if ! git ls-remote --exit-code --heads origin feat/p17-extension-snapshot-ai-context-pii-redaction >/dev/null 2>&1; then
  fail "remote branch feat/p17-extension-snapshot-ai-context-pii-redaction not found; push before final validation"
fi

echo "CLARA P17-PR-02 VALIDATION PASSED"
