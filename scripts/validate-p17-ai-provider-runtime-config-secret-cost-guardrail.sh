#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "feat/p17-ai-provider-runtime-config-secret-cost-guardrail" ]]; then
  fail "expected branch feat/p17-ai-provider-runtime-config-secret-cost-guardrail, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P17-AI-PROVIDER-RUNTIME-CONFIG.md"
  "docs/product/CLARA-P17-AI-SECRET-BOUNDARY-POLICY.md"
  "docs/product/CLARA-P17-AI-MODEL-ALLOWLIST-POLICY.md"
  "docs/product/CLARA-P17-AI-COST-GUARDRAIL-POLICY.md"
  "docs/product/CLARA-P17-AI-RATE-LIMIT-ABUSE-GUARDRAIL.md"
  "docs/product/CLARA-P17-AI-TIMEOUT-FAIL-CLOSED-POLICY.md"
  "docs/product/CLARA-P17-AI-CONFIG-DOCTOR.md"
  "docs/product/CLARA-P17-AI-AUDIT-REDACTION-POLICY.md"
  "docs/product/CLARA-P17-REAL-AI-ANALYSIS-ROADMAP.md"
  "docs/product/CLARA-P16-CLOSURE-SUMMARY.md"
  "docs/product/CLARA-P16-P17-COMPRESSED-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

required_tests=(
  "services/api/tests/p17-ai-provider-runtime-config.test.ts"
  "services/api/tests/p17-ai-provider-config-fail-closed.test.ts"
  "services/api/tests/p17-ai-secret-boundary.test.ts"
  "services/api/tests/p17-ai-config-doctor-redaction.test.ts"
  "services/api/tests/p17-ai-model-allowlist.test.ts"
  "services/api/tests/p17-ai-cost-guardrail.test.ts"
  "services/api/tests/p17-ai-rate-limit-abuse-guardrail.test.ts"
  "services/api/tests/p17-ai-timeout-policy.test.ts"
  "services/api/tests/p17-ai-audit-redaction-policy.test.ts"
  "services/api/tests/p17-ai-no-raw-prompt-provider-payload-persistence.test.ts"
  "services/api/tests/p17-ai-no-extension-analysis-execution-yet.test.ts"
  "services/api/tests/p17-ai-no-provider-billing-outbound-side-effect.test.ts"
  "services/api/tests/p17-roadmap-opening.test.ts"
  "apps/dashboard/src/components/p17-ai-provider-config-readiness-security.test.tsx"
  "apps/dashboard/src/components/p17-ai-secret-boundary-ui-regression.test.tsx"
  "apps/extension/src/tests/p17-ai-provider-secret-boundary-extension.test.ts"
  "apps/extension/src/tests/p17-extension-no-direct-ai-provider-call.test.ts"
)

for file in "${required_docs[@]}" "${required_tests[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P16 Extension-Assisted Channel Ingestion Hardening is complete"
  "P16-PR-04 is complete"
  "P17 Real AI Analysis Activation is current"
  "P17-PR-01 is current"
  "P17-PR-01 prepares AI provider runtime configuration but does not yet execute extension snapshot AI analysis"
  "AI provider secrets are server-only"
  "AI provider secrets must not be exposed to dashboard or extension"
  "AI provider secrets must not be logged, persisted, audited, or returned in API responses"
  "AI provider config fails closed by default"
  "AI provider mode defaults to disabled"
  "AI model allowlist is required"
  "AI cost guardrails are required"
  "AI rate limit and abuse guardrails are required"
  "AI timeout policy is required"
  "AI audit redaction is required"
  "Raw prompts, raw customer messages, raw provider payloads, raw provider responses, tokens, cookies, auth headers, raw DOM, raw HTML, raw webhook payloads, and payment data must not be logged or stored"
  "Extension-assisted ingestion remains internal/controlled/user-assisted"
  "Official WA/IG/TikTok APIs remain not activated"
  "Outbound auto-send remains disabled"
  "Billing/payment remains deferred"
  "CLARA is not public SaaS launch"
  "CLARA is not production deployment claim unless separately executed"
  "AuthContext and workspace membership remain source of truth"
  "Client-supplied workspaceId is not authoritative"
  "P17-PR-02 is next: Extension Snapshot AI Context Builder + PII Redaction"
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

api_runtime_sources=()
while IFS= read -r file; do
  api_runtime_sources+=("$file")
done < <(
  find services/api/src/ai services/api/src/extension services/api/src/http/routes \
    -type f \( -name '*.ts' -o -name '*.tsx' \)
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

if grep -nE 'sk-[A-Za-z0-9_-]{12,}|AIza[0-9A-Za-z_-]{20,}' "${api_runtime_sources[@]}" "${frontend_runtime_sources[@]}"; then
  fail "unexpected hard-coded AI/API key shaped value"
fi

if grep -nE 'VITE_AI_API_KEY|NEXT_PUBLIC_AI_API_KEY|PUBLIC_AI_API_KEY|AI_PROVIDER_API_KEY' "${frontend_runtime_sources[@]}"; then
  fail "unexpected frontend/public AI secret env var"
fi

if grep -nE 'persistRawPrompt|persistRawProviderPayload|persistRawProviderResponse|rawProviderPayloadRepository|rawProviderResponseRepository' "${api_runtime_sources[@]}"; then
  fail "unexpected raw AI prompt/provider payload persistence"
fi

if grep -nE 'runAiAnalysis|analyzeExtensionSnapshot|executeExtensionSnapshotAiAnalysis' "${api_runtime_sources[@]}"; then
  fail "unexpected extension snapshot real AI analysis execution"
fi

if grep -nE 'autoSend|clickSend|submitReply|outboundProviderSend' "${api_runtime_sources[@]}" "${frontend_runtime_sources[@]}"; then
  fail "unexpected outbound auto-send activation"
fi

if grep -nE 'officialWhatsApp|officialInstagram|officialTikTok|whatsappProviderApi|instagramProviderApi|tiktokProviderApi' "${api_runtime_sources[@]}" "${frontend_runtime_sources[@]}"; then
  fail "unexpected official WA/IG/TikTok API activation"
fi

if grep -nE 'stripe|createCheckoutSession|createInvoice|chargeCustomer|createSubscription|paymentIntent|billingCharge' "${api_runtime_sources[@]}" "${frontend_runtime_sources[@]}"; then
  fail "unexpected billing/payment activation"
fi

if grep -nE 'dangerouslySetInnerHTML' "${frontend_runtime_sources[@]}"; then
  fail "unexpected unsafe HTML rendering"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/extension/src/**/*.{ts,tsx}" --write
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if ! git ls-remote --exit-code --heads origin feat/p17-ai-provider-runtime-config-secret-cost-guardrail >/dev/null 2>&1; then
  fail "remote branch feat/p17-ai-provider-runtime-config-secret-cost-guardrail not found; push before final validation"
fi

echo "CLARA P17-PR-01 VALIDATION PASSED"
