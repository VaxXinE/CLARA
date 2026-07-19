#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p8-crm-activity-audit-hardening" ]]; then
  echo "Expected branch feat/p8-crm-activity-audit-hardening, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/customers/customer-crm-activity-audit-types.ts"
  "services/api/src/customers/customer-crm-activity-audit-policy.ts"
  "services/api/src/customers/customer-crm-activity-audit-service.ts"
  "services/api/src/customers/customer-crm-activity-audit-redaction.ts"
  "services/api/tests/p8-crm-activity-audit-policy.test.ts"
  "services/api/tests/p8-crm-activity-audit-service.test.ts"
  "services/api/tests/p8-crm-activity-audit-redaction.test.ts"
  "services/api/tests/p8-crm-activity-audit-security.test.ts"
  "apps/dashboard/src/components/CrmActivityAuditReadinessPanel.tsx"
  "apps/dashboard/src/components/CrmActivityAuditReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p8-crm-activity-audit-security.test.tsx"
  "apps/extension/src/tests/p8-crm-activity-audit-extension-boundary.test.ts"
  "docs/product/CLARA-P8-CRM-ACTIVITY-AUDIT-HARDENING-SPEC.md"
  "scripts/validate-p8-crm-activity-audit-hardening.sh"
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
  "services/api/src/customers/customer-crm-activity-audit-types.ts"
  "services/api/src/customers/customer-crm-activity-audit-policy.ts"
  "services/api/src/customers/customer-crm-activity-audit-service.ts"
  "services/api/src/customers/customer-crm-activity-audit-redaction.ts"
  "apps/dashboard/src/components/CrmActivityAuditReadinessPanel.tsx"
  "apps/dashboard/src/components/CrmCustomerWorkspace.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token exposure" \
  "refresh_token exposure" \
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
  "rawPrompt exposure" \
  "OPENAI_API_KEY" \
  "GEMINI_API_KEY" \
  "ANTHROPIC_API_KEY" \
  "@ai-sdk" \
  "CRM mutation from audit" \
  "lifecycle/status mutation from audit" \
  "owner assignment from audit" \
  "task creation from audit" \
  "customer note write from audit" \
  "outbound send from audit" \
  "scheduler execution from audit" \
  "bypass human approval" \
  "cross-workspace CRM access"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P8 CRM activity audit runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P8-CRM-ACTIVITY-AUDIT-HARDENING-SPEC.md"
  "docs/product/CLARA-P8-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "CRM Activity Audit Hardening" \
  "audit-only" \
  "safe metadata" \
  "redaction" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "mutationExecuted=false" \
  "actionExecuted=false" \
  "reviewOnly=true" \
  "no CRM mutation" \
  "no lifecycle mutation" \
  "no status mutation" \
  "no owner assignment mutation" \
  "no task creation" \
  "no outbound send" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "P8-PR-08"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P8-PR-08 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin feat/p8-crm-activity-audit-hardening >/dev/null; then
    echo "Remote branch feat/p8-crm-activity-audit-hardening not found." >&2
    exit 1
  fi
fi

echo "CLARA P8-PR-08 VALIDATION PASSED"
