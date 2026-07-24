#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "feat/p16-active-chat-reader-snapshot-normalization" ]]; then
  fail "expected branch feat/p16-active-chat-reader-snapshot-normalization, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "docs/product/CLARA-P16-ACTIVE-CHAT-READER-HARDENING.md"
  "docs/product/CLARA-P16-WHATSAPP-ACTIVE-CHAT-READER.md"
  "docs/product/CLARA-P16-INSTAGRAM-ACTIVE-CHAT-READER.md"
  "docs/product/CLARA-P16-TIKTOK-ACTIVE-CHAT-READER.md"
  "docs/product/CLARA-P16-SNAPSHOT-NORMALIZATION-HARDENING.md"
  "docs/product/CLARA-P16-SNAPSHOT-HASH-PRIVACY-POLICY.md"
  "docs/product/CLARA-P16-CHANNEL-DETECTION-SAFETY-POLICY.md"
  "docs/product/CLARA-P16-ACTIVE-CHAT-READER-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-INGESTION-ROADMAP.md"
  "docs/product/CLARA-P16-P17-COMPRESSED-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "apps/extension/README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
)

required_tests=(
  "apps/extension/src/tests/p16-whatsapp-active-chat-reader-hardening.test.ts"
  "apps/extension/src/tests/p16-instagram-active-chat-reader-hardening.test.ts"
  "apps/extension/src/tests/p16-tiktok-active-chat-reader-hardening.test.ts"
  "apps/extension/src/tests/p16-channel-detector-active-chat-safety.test.ts"
  "apps/extension/src/tests/p16-snapshot-normalization-hardening.test.ts"
  "apps/extension/src/tests/p16-snapshot-hash-privacy.test.ts"
  "apps/extension/src/tests/p16-active-chat-reader-disallowed-capture-regression.test.ts"
  "apps/extension/src/tests/p16-active-chat-reader-no-autosend-regression.test.ts"
  "services/api/tests/p16-active-chat-reader-hardening-docs.test.ts"
  "services/api/tests/p16-snapshot-normalization-hardening-docs.test.ts"
  "services/api/tests/p16-active-chat-reader-no-official-provider-api.test.ts"
  "services/api/tests/p16-active-chat-reader-no-provider-billing-ai-outbound-side-effect.test.ts"
  "apps/dashboard/src/components/p16-active-chat-reader-hardening-guidance.test.tsx"
  "apps/dashboard/src/components/p16-snapshot-normalization-security.test.tsx"
)

for file in "${required_docs[@]}" "${required_tests[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P15 Controlled Internal Beta Execution is complete"
  "P16 Extension-Assisted Channel Ingestion Hardening is current"
  "P16-PR-01 is complete"
  "P16-PR-02 is current"
  "active chat reading is internal/controlled/user-assisted"
  "readers only capture active chat opened by an authorized operator"
  "readers only capture visible active-chat message text and safe visible metadata"
  "readers do not capture cookies/session tokens/auth headers/API keys/localStorage/sessionStorage secrets"
  "readers do not capture raw DOM/raw HTML/full page dumps"
  "readers do not capture hidden conversations/background inboxes/mass scraped conversations"
  "readers do not auto-send replies"
  "snapshot normalization strips unsafe fields"
  "snapshot hashing is deterministic and privacy-safe"
  "extension-assisted ingestion is not official WA/IG/TikTok API activation"
  "official WA/IG/TikTok APIs remain not activated"
  "extension-assisted ingestion is not public SaaS launch"
  "extension-assisted ingestion is not production deployment claim unless separately executed"
  "billing/payment is deferred"
  "real AI provider calls remain not activated in this PR"
  "provider/AI/outbound activation remains controlled"
  "no outbound auto-send is activated"
  "AuthContext and workspace membership remain source of truth"
  "client-supplied workspaceId is not authoritative"
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

runtime_extension_sources=(
  "apps/extension/src/api/clara-extension-api-client.ts"
  "apps/extension/src/auth/clara-session.ts"
  "apps/extension/src/background.ts"
  "apps/extension/src/chatgpt/chatgpt-companion-config.ts"
  "apps/extension/src/chatgpt/chatgpt-companion-url.ts"
  "apps/extension/src/chatgpt/chatgpt-safe-context-builder.ts"
  "apps/extension/src/components/AutoSyncStatusPanel.tsx"
  "apps/extension/src/components/ChatGptCompanionPanel.tsx"
  "apps/extension/src/components/SafeContextPreview.tsx"
  "apps/extension/src/config/extension-config.ts"
  "apps/extension/src/readers/channel-detector.ts"
  "apps/extension/src/readers/instagram-active-chat-reader.ts"
  "apps/extension/src/readers/tiktok-active-chat-reader.ts"
  "apps/extension/src/readers/whatsapp-active-chat-reader.ts"
  "apps/extension/src/sidepanel.tsx"
  "apps/extension/src/sync/auto-sync-engine.ts"
  "apps/extension/src/sync/auto-sync-storage.ts"
  "apps/extension/src/sync/snapshot-hash.ts"
  "apps/extension/src/sync/snapshot-normalization.ts"
)

if grep -nE 'document\.cookie|readCookies|captureCookies|readSessionToken|captureSessionToken|captureAuthHeaders|readAuthHeaders' "${runtime_extension_sources[@]}"; then
  fail "unexpected cookie/session token/auth header capture"
fi

if grep -nE 'readLocalStorage|readSessionStorage|localStorage\.getItem|sessionStorage\.getItem' "${runtime_extension_sources[@]}"; then
  fail "unexpected localStorage/sessionStorage secret capture"
fi

if grep -nE 'outerHTML|innerHTML|captureRawDom|captureRawHtml|dumpFullPage|serialize.*DOM|fullPageDump' "${runtime_extension_sources[@]}"; then
  fail "unexpected raw DOM/raw HTML/full page dump capture"
fi

if grep -nE 'crawlInbox|backgroundInbox|massScrapeConversations|hiddenConversation' "${runtime_extension_sources[@]}"; then
  fail "unexpected hidden inbox/background crawl/mass scrape capability"
fi

if grep -nE 'officialWhatsApp|officialInstagram|officialTikTok|whatsappProviderApi|instagramProviderApi|tiktokProviderApi' "${runtime_extension_sources[@]}"; then
  fail "unexpected official WA/IG/TikTok provider API activation"
fi

if grep -nE 'OpenAI|Anthropic|callAiProvider|realAiProvider|runAiAction|autonomousAi' "${runtime_extension_sources[@]}"; then
  fail "unexpected real AI provider activation"
fi

if grep -nE 'autoSend|sendReply|clickSend|submitReply|outboundProviderSend' "${runtime_extension_sources[@]}"; then
  fail "unexpected outbound auto-send behavior"
fi

if grep -nE 'stripe|createCheckoutSession|createInvoice|chargeCustomer|createSubscription|paymentIntent|billingCharge' "${runtime_extension_sources[@]}"; then
  fail "unexpected payment/billing runtime activation"
fi

if grep -nE 'sendSlack|sendDiscord|sendWebhook|pushNotification|createSupportTicket|notifySupport|zendesk|intercom|freshdesk|jira' "${runtime_extension_sources[@]}"; then
  fail "unexpected external support notification activation"
fi

if grep -nE 'dangerouslySetInnerHTML' "${runtime_extension_sources[@]}"; then
  fail "unexpected unsafe HTML rendering"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/extension/src/**/*.{ts,tsx}" --write
(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if ! git ls-remote --exit-code --heads origin feat/p16-active-chat-reader-snapshot-normalization >/dev/null 2>&1; then
  fail "remote branch feat/p16-active-chat-reader-snapshot-normalization not found; push before final validation"
fi

echo "CLARA P16-PR-02 VALIDATION PASSED"
