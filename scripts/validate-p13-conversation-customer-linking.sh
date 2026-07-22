#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "feat/p13-conversation-customer-linking" ]]; then
  fail "expected branch feat/p13-conversation-customer-linking, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

if grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files"; then
  fail ".agents must not be tracked"
fi

if grep -q '^skills-lock\.json$' <<<"$tracked_files"; then
  fail "skills-lock.json must not be tracked"
fi

if grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files"; then
  fail "real env files must not be tracked"
fi

if grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files"; then
  fail "dist/build/coverage artifacts must not be tracked"
fi

required_files=(
  "docs/product/CLARA-P13-CONVERSATION-CUSTOMER-LINKING.md"
  "docs/product/CLARA-P13-INTERNAL-CRM-ACTIVATION-ROADMAP.md"
  "docs/product/CLARA-P13-BILLING-DEFERRED-POLICY.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "services/api/tests/p13-conversation-customer-link-route.test.ts"
  "services/api/tests/p13-conversation-customer-link-service.test.ts"
  "services/api/tests/p13-conversation-customer-link-workspace-boundary.test.ts"
  "services/api/tests/p13-conversation-customer-link-input-validation.test.ts"
  "services/api/tests/p13-customer-linked-conversations-route.test.ts"
  "services/api/tests/p13-conversation-customer-link-activity-timeline.test.ts"
  "services/api/tests/p13-conversation-customer-link-no-billing-side-effect.test.ts"
  "services/api/tests/p13-conversation-customer-link-no-notification-side-effect.test.ts"
  "services/api/tests/p13-conversation-customer-link-no-provider-ai-side-effect.test.ts"
  "apps/dashboard/src/components/p13-conversation-customer-linking.test.tsx"
  "apps/dashboard/src/components/p13-conversation-customer-linking-security.test.tsx"
  "apps/extension/src/tests/p13-conversation-customer-linking-extension-boundary.test.ts"
)

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat \
  docs/product/CLARA-P13-CONVERSATION-CUSTOMER-LINKING.md \
  docs/product/CLARA-P13-INTERNAL-CRM-ACTIVATION-ROADMAP.md \
  docs/product/CLARA-P13-BILLING-DEFERRED-POLICY.md \
  docs/product/CLARA-FINAL-ROADMAP.md \
  docs/product/CLARA-DOCUMENTATION-INDEX.md \
  README.md \
  services/api/README.md \
  apps/dashboard/README.md)"

required_phrases=(
  "P13-PR-01 is complete"
  "P13-PR-02 is complete"
  "P13-PR-03 is complete"
  "P13-PR-04 is complete"
  "P13-PR-05 is current"
  "Internal CRM usage is the focus"
  "billing/payment is deferred"
  "Conversation-to-customer linking is workspace-scoped"
  "Linking is explicit user-approved internal CRM action"
  "This PR does not auto-create or auto-merge customers"
  "This PR does not activate real provider/payment/AI/outbound behavior"
  "CLARA is not production deployed yet"
  "CLARA is not public GA launched yet"
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

p13_runtime_sources=(
  services/api/src/conversations/conversation-service.ts
  services/api/src/conversations/conversation-repository.ts
  services/api/src/conversations/conversation-db-repository.ts
  services/api/src/http/routes/conversations.ts
  services/api/src/audit/audit-log-service.ts
  apps/dashboard/src/App.tsx
  apps/dashboard/src/api/client.ts
  apps/dashboard/src/components/ConversationPane.tsx
  apps/dashboard/src/components/CustomerWorkspacePanel.tsx
  apps/dashboard/src/components/InboxPanel.tsx
)

if grep -nE 'stripe|checkout|invoice|chargeCustomer|subscriptionMutation|quotaEnforce' "${p13_runtime_sources[@]}"; then
  fail "unexpected billing/payment runtime activation"
fi

surface_sources="$(
  find services/api/src/http/routes apps/dashboard/src/components apps/extension/src \
    -type f \( -name '*.ts' -o -name '*.tsx' \) \
    ! -path '*/tests/*' \
    ! -name '*.test.ts' \
    ! -name '*.test.tsx'
)"

if grep -nE 'dangerouslySetInnerHTML|rawHtml|raw_provider_payload|access_token|refresh_token|client_secret' $surface_sources; then
  fail "unsafe raw payload/token/html runtime pattern found"
fi

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

if git ls-remote --exit-code --heads origin feat/p13-conversation-customer-linking >/dev/null 2>&1; then
  :
else
  echo "WARN: remote branch feat/p13-conversation-customer-linking not found yet; push before final release validation." >&2
fi

echo "CLARA P13-PR-05 VALIDATION PASSED"
