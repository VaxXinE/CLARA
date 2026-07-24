#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "feat/p16-snapshot-sanitization-redaction-workspace-attribution" ]]; then
  fail "expected branch feat/p16-snapshot-sanitization-redaction-workspace-attribution, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P16-SNAPSHOT-SANITIZATION-PIPELINE.md"
  "docs/product/CLARA-P16-SNAPSHOT-REDACTION-PIPELINE.md"
  "docs/product/CLARA-P16-WORKSPACE-ATTRIBUTION-POLICY.md"
  "docs/product/CLARA-P16-OPERATOR-ATTRIBUTION-POLICY.md"
  "docs/product/CLARA-P16-CLIENT-WORKSPACE-ID-NON-AUTHORITY-POLICY.md"
  "docs/product/CLARA-P16-CROSS-WORKSPACE-SPOOFING-REGRESSION-POLICY.md"
  "docs/product/CLARA-P16-SNAPSHOT-EVIDENCE-PRIVACY-POLICY.md"
  "docs/product/CLARA-P16-SANITIZATION-REDACTION-SECURITY-CHECKLIST.md"
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
  "services/api/tests/p16-snapshot-sanitization-pipeline.test.ts"
  "services/api/tests/p16-snapshot-redaction-pipeline.test.ts"
  "services/api/tests/p16-snapshot-unsafe-field-stripping.test.ts"
  "services/api/tests/p16-workspace-attribution-policy.test.ts"
  "services/api/tests/p16-operator-attribution-policy.test.ts"
  "services/api/tests/p16-client-workspace-id-non-authority.test.ts"
  "services/api/tests/p16-cross-workspace-spoofing-regression.test.ts"
  "services/api/tests/p16-snapshot-evidence-privacy.test.ts"
  "services/api/tests/p16-snapshot-redaction-no-provider-billing-ai-outbound-side-effect.test.ts"
  "apps/extension/src/tests/p16-snapshot-sanitization-boundary.test.ts"
  "apps/extension/src/tests/p16-snapshot-redaction-boundary.test.ts"
  "apps/extension/src/tests/p16-workspace-attribution-extension-boundary.test.ts"
  "apps/extension/src/tests/p16-no-expanded-capture-regression.test.ts"
  "apps/dashboard/src/components/p16-snapshot-sanitization-redaction-guidance.test.tsx"
  "apps/dashboard/src/components/p16-workspace-attribution-security.test.tsx"
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
  "P16-PR-03 is current."
  "Snapshot sanitization and redaction are required before storage and future AI analysis."
  "Client-supplied workspaceId is not authoritative."
  "AuthContext and workspace membership remain source of truth."
  "Snapshot attribution binds to authenticated operator and resolved workspace."
  "Cross-workspace spoofing must be rejected."
  "Snapshots must not include secrets/tokens/cookies/auth headers/API keys/localStorage/sessionStorage secrets/raw DOM/raw HTML/full page dumps/raw prompts/raw provider payloads/raw webhook payloads/payment data."
  "Snapshot evidence must minimize customer-sensitive data."
  "Extension-assisted ingestion is not official WA/IG/TikTok API activation."
  "Official WA/IG/TikTok APIs remain not activated."
  "Extension-assisted ingestion is not public SaaS launch."
  "Extension-assisted ingestion is not production deployment claim unless separately executed."
  "Billing/payment remains deferred."
  "Real AI provider calls remain not activated in this PR."
  "Provider/AI/outbound activation remains controlled."
  "No outbound auto-send is activated."
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

lowercase_phrases=(
  "snapshot sanitization and redaction are required before storage and future AI analysis"
  "client-supplied workspaceId is not authoritative"
  "billing/payment is deferred"
)

for phrase in "${lowercase_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing lowercase docs phrase: $phrase"
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

if grep -RInE 'document\.cookie|readCookies|captureCookies|readSessionToken|captureSessionToken|captureAuthHeaders|readAuthHeaders' "${runtime_sources[@]}"; then
  fail "unexpected cookie/session token/auth header capture"
fi

if grep -RInE 'readLocalStorage|readSessionStorage|localStorage\.getItem|sessionStorage\.getItem' "${runtime_sources[@]}"; then
  fail "unexpected localStorage/sessionStorage secret capture"
fi

if grep -RInE 'outerHTML|innerHTML|captureRawDom|captureRawHtml|dumpFullPage|serialize.*DOM|fullPageDump' "${runtime_sources[@]}"; then
  fail "unexpected raw DOM/raw HTML/full page dump capture"
fi

if grep -RInE 'crawlInbox|backgroundInbox|massScrapeConversations|hiddenConversation' "${runtime_sources[@]}"; then
  fail "unexpected hidden inbox/background crawl/mass scrape capability"
fi

if grep -RInE 'officialWhatsApp|officialInstagram|officialTikTok|whatsappProviderApi|instagramProviderApi|tiktokProviderApi' "${runtime_sources[@]}"; then
  fail "unexpected official WA/IG/TikTok provider API activation"
fi

if grep -RInE 'OpenAI|Anthropic|callAiProvider|realAiProvider|runAiAction|autonomousAi' "${runtime_sources[@]}"; then
  fail "unexpected real AI provider activation"
fi

if grep -RInE 'autoSend|clickSend|submitReply|outboundProviderSend' "${runtime_sources[@]}"; then
  fail "unexpected outbound auto-send behavior"
fi

if grep -RInE 'stripe|createCheckoutSession|createInvoice|chargeCustomer|createSubscription|paymentIntent|billingCharge' "${runtime_sources[@]}"; then
  fail "unexpected payment/billing runtime activation"
fi

if grep -RInE 'sendSlack|sendDiscord|sendWebhook|pushNotification|createSupportTicket|notifySupport|zendesk|intercom|freshdesk|jira' "${runtime_sources[@]}"; then
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

if ! git ls-remote --exit-code --heads origin feat/p16-snapshot-sanitization-redaction-workspace-attribution >/dev/null 2>&1; then
  fail "remote branch feat/p16-snapshot-sanitization-redaction-workspace-attribution not found; push before final validation"
fi

echo "CLARA P16-PR-03 VALIDATION PASSED"
