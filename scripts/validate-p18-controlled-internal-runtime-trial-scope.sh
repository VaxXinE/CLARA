#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "docs/p18-controlled-internal-runtime-trial-scope-evidence-plan" ]]; then
  fail "expected branch docs/p18-controlled-internal-runtime-trial-scope-evidence-plan, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P18-CONTROLLED-INTERNAL-RUNTIME-TRIAL-SCOPE.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-PARTICIPANT-RULES.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ENVIRONMENT-BOUNDARY.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-SUCCESS-METRICS.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-PLAN.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-TEMPLATE.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-PRIVACY-POLICY.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-RISK-REGISTER.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-STOP-CRITERIA.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-MANUAL-ROLLBACK-GUIDANCE.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-OPERATOR-CHECKLIST.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ADMIN-CHECKLIST.md"
  "docs/product/CLARA-P18-RUNTIME-TRIAL-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
)

required_tests=(
  "services/api/tests/p18-controlled-internal-runtime-trial-scope.test.ts"
  "services/api/tests/p18-runtime-trial-evidence-privacy.test.ts"
  "services/api/tests/p18-runtime-trial-no-production-launch-regression.test.ts"
  "services/api/tests/p18-runtime-trial-no-provider-billing-outbound-side-effect.test.ts"
  "services/api/tests/p18-runtime-trial-ai-boundary.test.ts"
  "services/api/tests/p18-runtime-trial-stop-rollback-guidance.test.ts"
  "services/api/tests/p18-roadmap-opening.test.ts"
)

for file in "${required_docs[@]}" "${required_tests[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P17 Real AI Analysis Activation is complete for controlled internal use"
  "P18 Controlled Internal Runtime Trial + Operational Readiness is current"
  "P18-PR-01 is current"
  "P18 validates controlled internal runtime behavior only"
  "P18 is not public SaaS launch"
  "P18 is not production deployment"
  "P18 does not activate billing/payment"
  "P18 does not activate official WA/IG/TikTok APIs"
  "P18 does not enable outbound auto-send"
  "extension-assisted ingestion remains internal/controlled/user-assisted"
  "AI analysis remains backend/server-side"
  "AI provider secrets remain server-only"
  "Extension must not call AI providers directly"
  "AuthContext and workspace membership remain source of truth"
  "Client-supplied workspaceId is not authoritative"
  "Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data"
  "Stop criteria are required before broader rollout"
  "Manual rollback guidance is required before broader rollout"
  "Known limitations must be reviewed before broader rollout"
  "P18-PR-02 Controlled Runtime Trial Smoke Checklist + Evidence Capture"
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

if grep -nE 'api\.openai\.com|api\.anthropic\.com|AI_PROVIDER_API_KEY|VITE_AI_API_KEY|NEXT_PUBLIC_AI_API_KEY|PUBLIC_AI_API_KEY' "${frontend_runtime_sources[@]}"; then
  fail "unexpected frontend/extension AI provider call or secret boundary"
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

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/extension/src/**/*.{ts,tsx}" --write
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if ! git ls-remote --exit-code --heads origin docs/p18-controlled-internal-runtime-trial-scope-evidence-plan >/dev/null 2>&1; then
  fail "remote branch docs/p18-controlled-internal-runtime-trial-scope-evidence-plan not found; push before final validation"
fi

echo "CLARA P18-PR-01 VALIDATION PASSED"
