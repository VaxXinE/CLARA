#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p8-customer-timeline-intelligence" ]]; then
  echo "Expected branch feat/p8-customer-timeline-intelligence, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/customers/customer-timeline-intelligence-types.ts"
  "services/api/src/customers/customer-timeline-intelligence-dto.ts"
  "services/api/src/customers/customer-timeline-intelligence-policy.ts"
  "services/api/src/customers/customer-timeline-intelligence-service.ts"
  "services/api/src/http/routes/customer-timeline-intelligence.ts"
  "services/api/tests/p8-customer-timeline-intelligence-policy.test.ts"
  "services/api/tests/p8-customer-timeline-intelligence-service.test.ts"
  "services/api/tests/p8-customer-timeline-intelligence-route.test.ts"
  "services/api/tests/p8-customer-timeline-intelligence-security.test.ts"
  "apps/dashboard/src/components/CustomerTimelineIntelligencePanel.tsx"
  "apps/dashboard/src/components/CustomerTimelineIntelligencePanel.test.tsx"
  "apps/dashboard/src/components/p8-customer-timeline-intelligence-security.test.tsx"
  "apps/extension/src/tests/p8-customer-timeline-intelligence-extension-boundary.test.ts"
  "docs/product/CLARA-P8-CUSTOMER-TIMELINE-INTELLIGENCE-SPEC.md"
  "scripts/validate-p8-customer-timeline-intelligence.sh"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
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

tracked_env="$(
  git ls-files | grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' || true
)"
if [[ -n "$tracked_env" ]]; then
  echo "Tracked env file found:" >&2
  echo "$tracked_env" >&2
  exit 1
fi

tracked_artifacts="$(
  git ls-files | grep -E '(^|/)(dist|build|coverage|node_modules)/' || true
)"
if [[ -n "$tracked_artifacts" ]]; then
  echo "Tracked build artifact found:" >&2
  echo "$tracked_artifacts" >&2
  exit 1
fi

runtime_files=(
  "services/api/src/customers/customer-timeline-intelligence-types.ts"
  "services/api/src/customers/customer-timeline-intelligence-dto.ts"
  "services/api/src/customers/customer-timeline-intelligence-policy.ts"
  "services/api/src/customers/customer-timeline-intelligence-service.ts"
  "services/api/src/http/routes/customer-timeline-intelligence.ts"
  "apps/dashboard/src/components/CustomerTimelineIntelligencePanel.tsx"
  "apps/dashboard/src/components/CrmCustomerWorkspace.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token" \
  "refresh_token" \
  "providerCookie" \
  "sessionCookie" \
  "rawProviderPayload" \
  "raw_provider_payload" \
  "rawWebhookPayload" \
  "raw_webhook_payload" \
  "rawDom" \
  "rawHtml" \
  "raw_dom" \
  "raw_html" \
  "rawPrompt" \
  "OPENAI_API_KEY" \
  "GEMINI_API_KEY" \
  "ANTHROPIC_API_KEY" \
  "@ai-sdk" \
  "autoCreateTask" \
  "autoWriteCustomerNote" \
  "autoAssignOwner" \
  "autoChangeLifecycle" \
  "autoChangeStatus"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe customer timeline intelligence runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P8-CUSTOMER-TIMELINE-INTELLIGENCE-SPEC.md"
  "docs/product/CLARA-P8-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Customer Timeline Intelligence" \
  "read-only" \
  "review-only" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "no CRM mutation" \
  "no auto-create task" \
  "no auto-write customer note" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "P8-PR-03"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P8-PR-03 docs pattern: $pattern" >&2
    exit 1
  fi
done

if ! git ls-remote --exit-code --heads origin feat/p8-customer-timeline-intelligence >/dev/null 2>&1; then
  echo "Remote branch feat/p8-customer-timeline-intelligence does not exist yet. Push before final validation." >&2
  exit 1
fi

echo "CLARA P8-PR-03 VALIDATION PASSED"
