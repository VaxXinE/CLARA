#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "docs/p8-crm-workflow-intelligence-scope-policy" ]]; then
  echo "Expected branch docs/p8-crm-workflow-intelligence-scope-policy, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "docs/product/CLARA-P8-CRM-WORKFLOW-INTELLIGENCE-SCOPE.md"
  "docs/product/CLARA-P8-CRM-MUTATION-POLICY.md"
  "docs/product/CLARA-P8-WORKFLOW-INTELLIGENCE-POLICY.md"
  "docs/product/CLARA-P8-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P8-SECURITY-RUNBOOK.md"
  "services/api/tests/p8-crm-workflow-scope.test.ts"
  "services/api/tests/p8-crm-mutation-policy.test.ts"
  "services/api/tests/p8-workflow-intelligence-policy.test.ts"
  "services/api/tests/p8-crm-security-boundary.test.ts"
  "apps/dashboard/src/components/p8-crm-workflow-readiness.test.tsx"
  "apps/extension/src/tests/p8-crm-extension-boundary.test.ts"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

for script in \
  scripts/validate-p7-ai-assistant-safety-scope.sh \
  scripts/validate-p7-ai-context-builder-prompt-contract.sh \
  scripts/validate-p7-ai-automation-guardrails-abuse-tests.sh \
  scripts/validate-p7-final-ai-assistant-audit-runbook.sh; do
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

dangerous_files="$(
  git ls-files | grep -E '\.pem$|\.key$|id_rsa|id_ed25519|refresh_token|client_secret|OPENAI_API_KEY|GEMINI_API_KEY|ANTHROPIC_API_KEY' || true
)"
if [[ -n "$dangerous_files" ]]; then
  echo "Dangerous secret-like files are tracked:" >&2
  echo "$dangerous_files" >&2
  exit 1
fi

runtime_hits="$(
  {
    find services/api/src apps/dashboard/src apps/extension/src -type f \( -name '*.ts' -o -name '*.tsx' \) \
      ! -path '*/tests/*' \
      ! -name '*.test.ts' \
      ! -name '*.test.tsx' \
      -print0 |
      xargs -0 grep -nE 'dangerouslySetInnerHTML|autonomous CRM mutation execution|auto-write customer note execution|auto-create task execution|auto-assign owner execution|cross-workspace CRM mutation bypass|client workspaceId authority|rawProviderPayload|raw_provider_payload|rawWebhookPayload|raw_webhook_payload|rawDom|rawHtml|raw_dom|raw_html|SUPABASE_SERVICE_ROLE|OPENAI_API_KEY|GEMINI_API_KEY|ANTHROPIC_API_KEY|access_token exposure|refresh_token exposure|providerCookie|sessionCookie' || true
  }
)"
if [[ -n "$runtime_hits" ]]; then
  echo "Unsafe runtime pattern found:" >&2
  echo "$runtime_hits" >&2
  exit 1
fi

docs=(
  docs/product/CLARA-P8-CRM-WORKFLOW-INTELLIGENCE-SCOPE.md
  docs/product/CLARA-P8-CRM-MUTATION-POLICY.md
  docs/product/CLARA-P8-WORKFLOW-INTELLIGENCE-POLICY.md
  docs/product/CLARA-P8-IMPLEMENTATION-ROADMAP.md
  docs/product/CLARA-P8-SECURITY-RUNBOOK.md
  docs/product/CLARA-MVP-GAP-REVIEW.md
  README.md
  SECURITY.md
  services/api/README.md
  apps/dashboard/README.md
)

for pattern in \
  "P8 CRM & Workflow Intelligence" \
  "CRM Mutation Policy" \
  "Workflow Intelligence Policy" \
  "Backend AuthContext" \
  "workspace-scoped" \
  "human approval" \
  "audit log" \
  "no autonomous CRM mutation" \
  "no auto-write customer note" \
  "no auto-create task" \
  "no cross-workspace CRM mutation" \
  "P7 complete" \
  "P9 Analytics / Reporting / KPI"; do
  if ! grep -R "$pattern" "${docs[@]}" >/dev/null; then
    echo "Missing expected P8 docs pattern: $pattern" >&2
    exit 1
  fi
done

if ! git ls-remote --exit-code --heads origin docs/p8-crm-workflow-intelligence-scope-policy >/dev/null 2>&1; then
  echo "Remote branch docs/p8-crm-workflow-intelligence-scope-policy does not exist yet. Push before final validation." >&2
  exit 1
fi

echo "CLARA P8-PR-01 VALIDATION PASSED"
