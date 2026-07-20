#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "chore/p10-final-enterprise-hardening-compliance-audit-runbook" ]]; then
  echo "Expected branch chore/p10-final-enterprise-hardening-compliance-audit-runbook, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/tests/p10-final-enterprise-hardening-audit.test.ts"
  "services/api/tests/p10-final-enterprise-auth-workspace-boundary.test.ts"
  "services/api/tests/p10-final-enterprise-no-mutation-regression.test.ts"
  "services/api/tests/p10-final-enterprise-no-automation-regression.test.ts"
  "services/api/tests/p10-final-enterprise-no-export-regression.test.ts"
  "services/api/tests/p10-final-enterprise-privacy-redaction.test.ts"
  "services/api/tests/p10-final-enterprise-compliance-readiness.test.ts"
  "apps/dashboard/src/components/p10-final-enterprise-dashboard-security.test.tsx"
  "apps/dashboard/src/components/p10-final-enterprise-dashboard-ui-regression.test.tsx"
  "apps/dashboard/src/components/p10-final-enterprise-dashboard-accessibility.test.tsx"
  "apps/extension/src/tests/p10-final-enterprise-extension-boundary-regression.test.ts"
  "apps/extension/src/tests/p10-final-enterprise-extension-security-regression.test.ts"
  "docs/product/CLARA-P10-FINAL-ENTERPRISE-HARDENING-COMPLIANCE-AUDIT.md"
  "docs/product/CLARA-P10-PRODUCTION-RUNBOOK.md"
  "docs/product/CLARA-P10-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-EVIDENCE-SUMMARY.md"
  "docs/product/CLARA-P10-OPERATOR-ADMIN-QA-CHECKLIST.md"
  "docs/product/CLARA-P10-REGRESSION-ACCEPTANCE-CHECKLIST.md"
  "docs/product/CLARA-P10-P11-HANDOFF-NOTES.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p10-final-enterprise-hardening-compliance-audit-runbook.sh"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

for script in \
  scripts/validate-p10-enterprise-hardening-compliance-scope-policy.sh \
  scripts/validate-p10-tenant-isolation-permission-audit-hardening.sh \
  scripts/validate-p10-audit-retention-data-classification-redaction.sh \
  scripts/validate-p10-admin-security-session-compliance-dashboard.sh \
  scripts/validate-p10-backup-restore-incident-evidence-readiness.sh; do
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
  "services/api/src/enterprise/compliance-dashboard-dto.ts"
  "services/api/src/enterprise/backup-restore-readiness-dto.ts"
  "services/api/src/enterprise/backup-restore-readiness-service.ts"
  "services/api/src/enterprise/incident-response-readiness-dto.ts"
  "services/api/src/enterprise/incident-response-readiness-service.ts"
  "services/api/src/enterprise/evidence-readiness-dto.ts"
  "services/api/src/enterprise/evidence-readiness-service.ts"
  "services/api/src/enterprise/operational-resilience-summary.ts"
  "services/api/src/http/routes/enterprise-backup-restore-readiness.ts"
  "services/api/src/http/routes/enterprise-incident-response-readiness.ts"
  "services/api/src/http/routes/enterprise-evidence-readiness.ts"
  "apps/dashboard/src/components/EnterpriseComplianceReadinessPanel.tsx"
  "apps/dashboard/src/components/BackupRestoreReadinessPanel.tsx"
  "apps/dashboard/src/components/IncidentResponseReadinessPanel.tsx"
  "apps/dashboard/src/components/EvidenceReadinessPanel.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token" \
  "refresh_token" \
  "providerCookie" \
  "sessionCookie" \
  "rawProviderPayload:" \
  "raw_provider_payload" \
  "rawWebhookPayload:" \
  "raw_webhook_payload" \
  "rawAuditMetadata:" \
  "raw_audit_metadata" \
  "rawCustomerMessage:" \
  "raw_customer_message" \
  "rawEvidence:" \
  "raw_evidence" \
  "rawPermissionInternals:" \
  "raw_permission_internals" \
  "rawDom:" \
  "rawHtml:" \
  "raw_dom" \
  "raw_html" \
  "rawPrompt:" \
  "OPENAI_API_KEY" \
  "GEMINI_API_KEY" \
  "ANTHROPIC_API_KEY" \
  "@ai-sdk" \
  ">Export<" \
  ">Download<" \
  ">Execute<" \
  ">Apply<" \
  ">Revoke Session<" \
  ">Force Logout<" \
  ">Enable SSO<" \
  ">Enable MFA<" \
  ">Run Backup<" \
  ">Run Restore<" \
  ">Delete Data<" \
  ">Legal Hold<" \
  ">Create Incident<" \
  ">Escalate Incident<" \
  ">Send Notification<" \
  ">Generate Report<" \
  ">Create Task<" \
  ">Assign Owner<" \
  ">Update Status<" \
  ">Send Message<" \
  ">Write Note<" \
  "changeRole(" \
  "grantPermission(" \
  "revokeSession(" \
  "forceLogout(" \
  "enableSso(" \
  "enableMfa(" \
  "enrollMfa(" \
  "executeBackup(" \
  "runBackup(" \
  "executeRestore(" \
  "runRestore(" \
  "deleteData(" \
  "applyLegalHold(" \
  "createIncident(" \
  "escalateIncident(" \
  "sendNotification(" \
  "exportEvidence(" \
  "downloadEvidence(" \
  "generateReport(" \
  "createTask(" \
  "assignOwner(" \
  "updateLifecycle(" \
  "updateStatus(" \
  "writeCustomerNote(" \
  "sendOutbound" \
  "executeWorkflow(" \
  "customerLevelDrilldown" \
  "certificationClaimed: true"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P10 final runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P10-FINAL-ENTERPRISE-HARDENING-COMPLIANCE-AUDIT.md"
  "docs/product/CLARA-P10-PRODUCTION-RUNBOOK.md"
  "docs/product/CLARA-P10-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-EVIDENCE-SUMMARY.md"
  "docs/product/CLARA-P10-OPERATOR-ADMIN-QA-CHECKLIST.md"
  "docs/product/CLARA-P10-REGRESSION-ACCEPTANCE-CHECKLIST.md"
  "docs/product/CLARA-P10-P11-HANDOFF-NOTES.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Final P10" \
  "Enterprise Hardening / Compliance" \
  "compliance readiness" \
  "not certification" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "client workspaceId is never authority" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no raw audit metadata" \
  "no raw evidence" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no CRM mutation" \
  "no outbound send" \
  "no real AI provider" \
  "P10 COMPLETE" \
  "P11 Scale / Reliability / Billing"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P10 final docs pattern: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  if ! git ls-remote --exit-code --heads origin chore/p10-final-enterprise-hardening-compliance-audit-runbook >/dev/null; then
    echo "Remote branch chore/p10-final-enterprise-hardening-compliance-audit-runbook not found." >&2
    exit 1
  fi
fi

echo "CLARA P10-PR-06 VALIDATION PASSED"
