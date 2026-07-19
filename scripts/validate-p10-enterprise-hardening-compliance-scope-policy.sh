#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "docs/p10-enterprise-hardening-compliance-scope-policy" ]]; then
  echo "Expected branch docs/p10-enterprise-hardening-compliance-scope-policy, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/enterprise/enterprise-hardening-scope-policy.ts"
  "services/api/src/enterprise/compliance-baseline-policy.ts"
  "services/api/src/enterprise/data-classification-policy.ts"
  "services/api/src/enterprise/tenant-isolation-policy.ts"
  "services/api/src/enterprise/audit-retention-baseline-policy.ts"
  "services/api/src/enterprise/enterprise-compliance-readiness-types.ts"
  "services/api/tests/p10-enterprise-hardening-scope-policy.test.ts"
  "services/api/tests/p10-compliance-baseline-policy.test.ts"
  "services/api/tests/p10-data-classification-policy.test.ts"
  "services/api/tests/p10-tenant-isolation-policy.test.ts"
  "services/api/tests/p10-audit-retention-baseline-policy.test.ts"
  "services/api/tests/p10-enterprise-compliance-security-boundary.test.ts"
  "apps/dashboard/src/components/EnterpriseComplianceReadinessPanel.tsx"
  "apps/dashboard/src/components/EnterpriseComplianceReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p10-enterprise-compliance-readiness-security.test.tsx"
  "apps/extension/src/tests/p10-enterprise-compliance-extension-boundary.test.ts"
  "docs/product/CLARA-P10-ENTERPRISE-HARDENING-COMPLIANCE-SCOPE-POLICY.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-BASELINE.md"
  "docs/product/CLARA-P10-DATA-CLASSIFICATION-POLICY.md"
  "docs/product/CLARA-P10-TENANT-ISOLATION-POLICY.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p10-enterprise-hardening-compliance-scope-policy.sh"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

for script in \
  scripts/validate-p9-final-analytics-reporting-audit-runbook.sh; do
  [[ -f "$script" ]] && bash -n "$script"
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
  "services/api/src/enterprise/enterprise-hardening-scope-policy.ts"
  "services/api/src/enterprise/compliance-baseline-policy.ts"
  "services/api/src/enterprise/data-classification-policy.ts"
  "services/api/src/enterprise/tenant-isolation-policy.ts"
  "services/api/src/enterprise/audit-retention-baseline-policy.ts"
  "services/api/src/enterprise/enterprise-compliance-readiness-types.ts"
  "apps/dashboard/src/components/EnterpriseComplianceReadinessPanel.tsx"
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
  "rawAuditMetadata" \
  "raw_audit_metadata" \
  "rawCustomerMessage" \
  "raw_customer_message" \
  "rawDom" \
  "rawHtml" \
  "raw_dom" \
  "raw_html" \
  "rawPrompt" \
  "OPENAI_API_KEY" \
  "GEMINI_API_KEY" \
  "ANTHROPIC_API_KEY" \
  "@ai-sdk" \
  "cross-workspace access" \
  "CRM mutation from enterprise policy" \
  "task creation from enterprise policy" \
  "owner assignment from enterprise policy" \
  "lifecycle/status mutation from enterprise policy" \
  "customer note write from enterprise policy" \
  "outbound send from enterprise policy" \
  "report export" \
  "customer-level drilldown" \
  "SOC 2 certified" \
  "ISO 27001 certified" \
  "GDPR compliant" \
  "HIPAA compliant" \
  "PCI compliant" \
  ">Export<" \
  ">Download<" \
  ">Execute<" \
  ">Apply<"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P10 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P10-ENTERPRISE-HARDENING-COMPLIANCE-SCOPE-POLICY.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-BASELINE.md"
  "docs/product/CLARA-P10-DATA-CLASSIFICATION-POLICY.md"
  "docs/product/CLARA-P10-TENANT-ISOLATION-POLICY.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "P10 Enterprise Hardening / Compliance" \
  "compliance readiness" \
  "not certification" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "tenant isolation" \
  "least privilege" \
  "data classification" \
  "audit readiness" \
  "retention readiness" \
  "incident response readiness" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no raw audit metadata" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no CRM mutation" \
  "no outbound send" \
  "no real AI provider"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P10 docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin docs/p10-enterprise-hardening-compliance-scope-policy >/dev/null; then
    echo "Remote branch docs/p10-enterprise-hardening-compliance-scope-policy not found." >&2
    exit 1
  fi
fi

echo "CLARA P10-PR-01 VALIDATION PASSED"
