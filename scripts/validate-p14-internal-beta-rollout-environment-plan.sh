#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

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
  "docs/product/CLARA-P14-INTERNAL-BETA-ROLLOUT-SCOPE.md"
  "docs/product/CLARA-P14-INTERNAL-ENVIRONMENT-PLAN.md"
  "docs/product/CLARA-P14-INTERNAL-USER-ROLE-PLAN.md"
  "docs/product/CLARA-P14-INTERNAL-DATA-POLICY.md"
  "docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md"
  "docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "README.md"
  "services/api/tests/p14-internal-beta-rollout-environment-plan.test.ts"
)

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat \
  docs/product/CLARA-P14-INTERNAL-BETA-ROLLOUT-SCOPE.md \
  docs/product/CLARA-P14-INTERNAL-ENVIRONMENT-PLAN.md \
  docs/product/CLARA-P14-INTERNAL-USER-ROLE-PLAN.md \
  docs/product/CLARA-P14-INTERNAL-DATA-POLICY.md \
  docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md \
  docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md \
  docs/product/CLARA-FINAL-ROADMAP.md \
  docs/product/CLARA-DOCUMENTATION-INDEX.md \
  README.md)"

required_phrases=(
  "internal use first"
  "billing deferred"
  "public launch deferred"
  "production deployment requires separate explicit action"
  "Provider/AI/outbound activation remains controlled"
  "internal user roles are defined"
  "internal data policy exists"
  "security checklist exists"
  "P13 Internal CRM Product Activation is complete"
  "CLARA is not production deployed yet"
  "CLARA is not public GA launched yet"
)

for phrase in "${required_phrases[@]}"; do
  grep -qF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

npx --yes prettier "services/api/src/**/*.ts" "services/api/tests/**/*.ts" --write
(cd services/api && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

npx --yes prettier "apps/dashboard/src/**/*.{ts,tsx}" --write
(cd apps/dashboard && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

(cd apps/extension && npm run typecheck && npm run test && npm run build && npm audit --omit=dev --audit-level=high)

bash scripts/validate-repo-structure.sh

echo "CLARA P14-PR-01 VALIDATION PASSED"
