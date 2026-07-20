#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "feat/p10-backup-restore-incident-evidence-readiness" ]]; then
  echo "Expected branch feat/p10-backup-restore-incident-evidence-readiness, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "services/api/src/enterprise/backup-restore-readiness-types.ts"
  "services/api/src/enterprise/backup-restore-readiness-dto.ts"
  "services/api/src/enterprise/backup-restore-readiness-policy.ts"
  "services/api/src/enterprise/backup-restore-readiness-service.ts"
  "services/api/src/enterprise/incident-response-readiness-types.ts"
  "services/api/src/enterprise/incident-response-readiness-dto.ts"
  "services/api/src/enterprise/incident-response-readiness-policy.ts"
  "services/api/src/enterprise/incident-response-readiness-service.ts"
  "services/api/src/enterprise/evidence-readiness-types.ts"
  "services/api/src/enterprise/evidence-readiness-dto.ts"
  "services/api/src/enterprise/evidence-readiness-policy.ts"
  "services/api/src/enterprise/evidence-readiness-service.ts"
  "services/api/src/enterprise/operational-resilience-summary.ts"
  "services/api/src/http/routes/enterprise-backup-restore-readiness.ts"
  "services/api/src/http/routes/enterprise-incident-response-readiness.ts"
  "services/api/src/http/routes/enterprise-evidence-readiness.ts"
  "services/api/tests/p10-backup-restore-readiness-policy.test.ts"
  "services/api/tests/p10-backup-restore-readiness-service.test.ts"
  "services/api/tests/p10-backup-restore-readiness-route.test.ts"
  "services/api/tests/p10-backup-restore-no-execution-regression.test.ts"
  "services/api/tests/p10-backup-restore-security-boundary.test.ts"
  "services/api/tests/p10-incident-response-readiness-policy.test.ts"
  "services/api/tests/p10-incident-response-readiness-service.test.ts"
  "services/api/tests/p10-incident-response-readiness-route.test.ts"
  "services/api/tests/p10-incident-response-no-automation-regression.test.ts"
  "services/api/tests/p10-incident-response-security-boundary.test.ts"
  "services/api/tests/p10-evidence-readiness-policy.test.ts"
  "services/api/tests/p10-evidence-readiness-service.test.ts"
  "services/api/tests/p10-evidence-readiness-route.test.ts"
  "services/api/tests/p10-evidence-no-export-regression.test.ts"
  "services/api/tests/p10-evidence-security-boundary.test.ts"
  "services/api/tests/p10-operational-resilience-summary.test.ts"
  "apps/dashboard/src/components/BackupRestoreReadinessPanel.tsx"
  "apps/dashboard/src/components/BackupRestoreReadinessPanel.test.tsx"
  "apps/dashboard/src/components/IncidentResponseReadinessPanel.tsx"
  "apps/dashboard/src/components/IncidentResponseReadinessPanel.test.tsx"
  "apps/dashboard/src/components/EvidenceReadinessPanel.tsx"
  "apps/dashboard/src/components/EvidenceReadinessPanel.test.tsx"
  "apps/dashboard/src/components/p10-backup-restore-readiness-security.test.tsx"
  "apps/dashboard/src/components/p10-incident-response-readiness-security.test.tsx"
  "apps/dashboard/src/components/p10-evidence-readiness-security.test.tsx"
  "apps/extension/src/tests/p10-backup-restore-incident-evidence-extension-boundary.test.ts"
  "docs/product/CLARA-P10-BACKUP-RESTORE-INCIDENT-RESPONSE-EVIDENCE-READINESS-SPEC.md"
  "docs/product/CLARA-P10-BACKUP-RESTORE-READINESS-RUNBOOK.md"
  "docs/product/CLARA-P10-INCIDENT-RESPONSE-READINESS-RUNBOOK.md"
  "docs/product/CLARA-P10-EVIDENCE-READINESS-CHECKLIST.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-BASELINE.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "scripts/validate-p10-backup-restore-incident-evidence-readiness.sh"
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
  "services/api/src/enterprise/backup-restore-readiness-types.ts"
  "services/api/src/enterprise/backup-restore-readiness-dto.ts"
  "services/api/src/enterprise/backup-restore-readiness-policy.ts"
  "services/api/src/enterprise/backup-restore-readiness-service.ts"
  "services/api/src/enterprise/incident-response-readiness-types.ts"
  "services/api/src/enterprise/incident-response-readiness-dto.ts"
  "services/api/src/enterprise/incident-response-readiness-policy.ts"
  "services/api/src/enterprise/incident-response-readiness-service.ts"
  "services/api/src/enterprise/evidence-readiness-types.ts"
  "services/api/src/enterprise/evidence-readiness-dto.ts"
  "services/api/src/enterprise/evidence-readiness-policy.ts"
  "services/api/src/enterprise/evidence-readiness-service.ts"
  "services/api/src/enterprise/operational-resilience-summary.ts"
  "services/api/src/http/routes/enterprise-backup-restore-readiness.ts"
  "services/api/src/http/routes/enterprise-incident-response-readiness.ts"
  "services/api/src/http/routes/enterprise-evidence-readiness.ts"
  "apps/dashboard/src/components/BackupRestoreReadinessPanel.tsx"
  "apps/dashboard/src/components/IncidentResponseReadinessPanel.tsx"
  "apps/dashboard/src/components/EvidenceReadinessPanel.tsx"
  "apps/dashboard/src/components/EnterpriseComplianceReadinessPanel.tsx"
  "apps/extension/src/background.ts"
)

for pattern in \
  "dangerouslySetInnerHTML" \
  "access_token" \
  "refresh_token" \
  "client_secret" \
  "providerCookie" \
  "sessionCookie" \
  "rawProviderPayload" \
  "raw_provider_payload" \
  "rawWebhookPayload" \
  "raw_webhook_payload" \
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
  ">Export<" \
  ">Download<" \
  ">Execute<" \
  ">Apply<" \
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
  ">Change Role<" \
  ">Grant Permission<" \
  "backupExecuted: true" \
  "restoreExecuted: true" \
  "dataDeleted: true" \
  "incidentCreated: true" \
  "escalationExecuted: true" \
  "notificationSent: true" \
  "legalHoldExecuted: true" \
  "exportEnabled: true" \
  "downloadEnabled: true" \
  "rawEvidenceIncluded: true" \
  "rawAuditMetadataIncluded: true" \
  "secretsIncluded: true" \
  "certificationClaimed: true" \
  "mutationAllowed: true"; do
  if grep -R "$pattern" "${runtime_files[@]}" >/dev/null; then
    echo "Unsafe P10-PR-05 runtime pattern found: $pattern" >&2
    exit 1
  fi
done

docs=(
  "docs/product/CLARA-P10-BACKUP-RESTORE-INCIDENT-RESPONSE-EVIDENCE-READINESS-SPEC.md"
  "docs/product/CLARA-P10-BACKUP-RESTORE-READINESS-RUNBOOK.md"
  "docs/product/CLARA-P10-INCIDENT-RESPONSE-READINESS-RUNBOOK.md"
  "docs/product/CLARA-P10-EVIDENCE-READINESS-CHECKLIST.md"
  "docs/product/CLARA-P10-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P10-COMPLIANCE-READINESS-BASELINE.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
)

for pattern in \
  "Backup / Restore" \
  "Incident Response" \
  "Evidence Readiness" \
  "Operational Resilience" \
  "P10 Enterprise Hardening / Compliance" \
  "compliance readiness" \
  "not certification" \
  "Backend AuthContext" \
  "client workspaceId is never authority" \
  "workspace-scoped" \
  "safe evidence summary" \
  "no raw evidence" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no raw audit metadata" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no backup execution" \
  "no restore execution" \
  "no data deletion automation" \
  "no legal hold automation" \
  "no evidence export" \
  "no CRM mutation" \
  "no outbound send" \
  "no real AI provider" \
  "P10-PR-05"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P10-PR-05 docs pattern: $pattern" >&2
    exit 1
  fi
done

if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  :
elif git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
  echo "Remote branch origin/${BRANCH} not found." >&2
  exit 1
fi

echo "CLARA P10-PR-05 VALIDATION PASSED"
