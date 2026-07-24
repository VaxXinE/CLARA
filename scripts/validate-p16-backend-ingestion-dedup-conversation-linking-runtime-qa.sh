#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "feat/p16-backend-ingestion-dedup-conversation-linking-runtime-qa" ]]; then
  fail "expected branch feat/p16-backend-ingestion-dedup-conversation-linking-runtime-qa, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P16-BACKEND-INGESTION-CONTRACT.md"
  "docs/product/CLARA-P16-SNAPSHOT-DEDUP-IDEMPOTENCY-POLICY.md"
  "docs/product/CLARA-P16-CONVERSATION-LINKING-POLICY.md"
  "docs/product/CLARA-P16-CUSTOMER-LINKING-READINESS-POLICY.md"
  "docs/product/CLARA-P16-INGESTION-AUDIT-EVIDENCE-POLICY.md"
  "docs/product/CLARA-P16-RUNTIME-QA-CHECKLIST.md"
  "docs/product/CLARA-P16-RUNTIME-QA-EVIDENCE-TEMPLATE.md"
  "docs/product/CLARA-P16-END-TO-END-SMOKE-RUNBOOK.md"
  "docs/product/CLARA-P16-CLOSURE-SUMMARY.md"
  "docs/product/CLARA-P17-REAL-AI-ANALYSIS-ACTIVATION-TRANSITION-PLAN.md"
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-INGESTION-ROADMAP.md"
  "docs/product/CLARA-P16-P17-COMPRESSED-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/README.md"
  "apps/extension/README.md"
  "apps/dashboard/README.md"
)

required_tests=(
  "services/api/tests/p16-backend-ingestion-contract.test.ts"
  "services/api/tests/p16-safe-snapshot-ingestion.test.ts"
  "services/api/tests/p16-ingestion-unsafe-field-rejection.test.ts"
  "services/api/tests/p16-snapshot-dedup-idempotency.test.ts"
  "services/api/tests/p16-conversation-linking-policy.test.ts"
  "services/api/tests/p16-customer-linking-readiness-policy.test.ts"
  "services/api/tests/p16-ingestion-auth-workspace-boundary.test.ts"
  "services/api/tests/p16-ingestion-cross-workspace-spoofing-regression.test.ts"
  "services/api/tests/p16-ingestion-audit-evidence-privacy.test.ts"
  "services/api/tests/p16-extension-ingestion-e2e-smoke.test.ts"
  "services/api/tests/p16-closure-summary.test.ts"
  "services/api/tests/p17-real-ai-analysis-transition-plan.test.ts"
  "services/api/tests/p16-final-no-provider-billing-ai-outbound-side-effect.test.ts"
  "apps/extension/src/tests/p16-backend-ingestion-contract-boundary.test.ts"
  "apps/extension/src/tests/p16-final-extension-assisted-ingestion-boundary.test.ts"
  "apps/dashboard/src/components/p16-backend-ingestion-runtime-qa.test.tsx"
  "apps/dashboard/src/components/p16-final-ingestion-security.test.tsx"
)

for file in "${required_docs[@]}" "${required_tests[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P15 Controlled Internal Beta Execution is complete."
  "P16 Extension-Assisted Channel Ingestion Hardening is current."
  "P16-PR-01 is complete."
  "P16-PR-02 is complete."
  "P16-PR-03 is complete."
  "P16-PR-04 is current."
  "P16 closes only after this PR validates."
  "Backend ingestion accepts only sanitized/redacted extension snapshots."
  "Deduplication and idempotency are required."
  "Conversation linking is workspace-scoped."
  "Customer linking is readiness-only unless existing safe patterns support it."
  "Client-supplied workspaceId is not authoritative."
  "AuthContext and workspace membership remain source of truth."
  "Cross-workspace spoofing must be rejected."
  "Runtime QA evidence must minimize customer-sensitive data."
  "Evidence/logs/docs/runbooks must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data."
  "Extension-assisted ingestion is not official WA/IG/TikTok API activation."
  "Official WA/IG/TikTok APIs remain not activated."
  "Extension-assisted ingestion is not public SaaS launch."
  "Extension-assisted ingestion is not production deployment claim unless separately executed."
  "Billing/payment is deferred."
  "Real AI provider calls remain not activated in this PR."
  "Provider/AI/outbound activation remains controlled."
  "No outbound auto-send is activated."
  "P17 real AI analysis activation is next."
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

runtime_sources=()
while IFS= read -r file; do
  runtime_sources+=("$file")
done < <(
  find services/api/src/extension apps/extension/src \
    -type f \( -name '*.ts' -o -name '*.tsx' \) \
    -not -path 'apps/extension/src/tests/*'
)
runtime_sources+=("services/api/src/http/routes/extension.ts")

if grep -nE 'client.*workspaceId.*authoritative|workspaceId.*from.*body|workspaceId.*from.*query' "${runtime_sources[@]}"; then
  fail "unexpected client-supplied workspaceId authority"
fi

if grep -nE 'crossWorkspaceBypass|skipWorkspaceScope|withoutWorkspaceScope' "${runtime_sources[@]}"; then
  fail "unexpected cross-workspace access bypass"
fi

if grep -nE 'persistRawSnapshot|rawSnapshot|raw_prompt|rawProviderPayload|rawWebhookPayload|rawHtml|rawDom|fullPageDump' "${runtime_sources[@]}"; then
  fail "unexpected unsafe/raw snapshot persistence"
fi

if grep -nE 'document\.cookie|readCookies|captureCookies|readSessionToken|captureSessionToken|captureAuthHeaders|readAuthHeaders' "${runtime_sources[@]}"; then
  fail "unexpected cookie/session token/auth header capture"
fi

if grep -nE 'readLocalStorage|readSessionStorage|localStorage\.getItem|sessionStorage\.getItem' "${runtime_sources[@]}"; then
  fail "unexpected localStorage/sessionStorage secret capture"
fi

if grep -nE 'outerHTML|innerHTML|captureRawDom|captureRawHtml|dumpFullPage|serialize.*DOM' "${runtime_sources[@]}"; then
  fail "unexpected raw DOM/raw HTML/full page dump capture"
fi

if grep -nE 'crawlInbox|backgroundInbox|massScrapeConversations|hiddenConversation' "${runtime_sources[@]}"; then
  fail "unexpected hidden inbox/background crawl/mass scrape capability"
fi

if grep -nE 'officialWhatsApp|officialInstagram|officialTikTok|whatsappProviderApi|instagramProviderApi|tiktokProviderApi' "${runtime_sources[@]}"; then
  fail "unexpected official WA/IG/TikTok provider API activation"
fi

if grep -nE 'OpenAI|Anthropic|callAiProvider|realAiProvider|runAiAction|autonomousAi' "${runtime_sources[@]}"; then
  fail "unexpected real AI provider activation"
fi

if grep -nE 'autoSend|clickSend|submitReply|outboundProviderSend' "${runtime_sources[@]}"; then
  fail "unexpected outbound auto-send behavior"
fi

if grep -nE 'stripe|createCheckoutSession|createInvoice|chargeCustomer|createSubscription|paymentIntent|billingCharge' "${runtime_sources[@]}"; then
  fail "unexpected payment/billing runtime activation"
fi

if grep -nE 'sendSlack|sendDiscord|sendWebhook|pushNotification|createSupportTicket|notifySupport|zendesk|intercom|freshdesk|jira' "${runtime_sources[@]}"; then
  fail "unexpected external support notification activation"
fi

dashboard_runtime_sources=()
while IFS= read -r file; do
  dashboard_runtime_sources+=("$file")
done < <(
  find apps/dashboard/src \
    -type f \( -name '*.ts' -o -name '*.tsx' \) \
    -not -name '*.test.ts' \
    -not -name '*.test.tsx'
)

if grep -nE 'dangerouslySetInnerHTML' "${dashboard_runtime_sources[@]}" "${runtime_sources[@]}"; then
  fail "unexpected unsafe HTML rendering"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/extension/src/**/*.{ts,tsx}" --write
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if ! git ls-remote --exit-code --heads origin feat/p16-backend-ingestion-dedup-conversation-linking-runtime-qa >/dev/null 2>&1; then
  fail "remote branch feat/p16-backend-ingestion-dedup-conversation-linking-runtime-qa not found; push before final validation"
fi

echo "CLARA P16-PR-04 VALIDATION PASSED"
