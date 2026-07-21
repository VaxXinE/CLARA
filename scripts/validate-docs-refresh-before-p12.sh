#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "docs/project-wide-refresh-before-p12" ]]; then
  echo "Expected branch docs/project-wide-refresh-before-p12, got ${BRANCH}" >&2
  exit 1
fi

required_files=(
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "docs/product/CLARA-VALIDATION-BASELINE.md"
  "docs/product/CLARA-SECURITY-BOUNDARY-SUMMARY.md"
  "docs/product/CLARA-PHASE-CLOSURE-SUMMARY.md"
  "docs/product/CLARA-RELEASE-READINESS-OVERVIEW.md"
  "docs/product/CLARA-P12-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P12-HANDOFF-FROM-P11.md"
  "docs/product/CLARA-RUNBOOK-INDEX.md"
  "docs/product/CLARA-TESTING-VALIDATION-INDEX.md"
  "scripts/validate-docs-refresh-before-p12.sh"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

find . -name '*.md' \
  -not -path './node_modules/*' \
  -not -path './*/node_modules/*' \
  -not -path './dist/*' \
  -not -path './*/dist/*' \
  -not -path './build/*' \
  -not -path './*/build/*' \
  -not -path './coverage/*' \
  -not -path './*/coverage/*' \
  -not -path './.git/*' >/dev/null

if [[ -x scripts/validate-repo-structure.sh ]]; then
  bash scripts/validate-repo-structure.sh
fi

if [[ -x scripts/validate-production-runtime-config.sh ]]; then
  bash scripts/validate-production-runtime-config.sh
fi

cd services/api
npm install
if [[ -x node_modules/.bin/prettier ]]; then
  node_modules/.bin/prettier "src/**/*.ts" "tests/**/*.ts" --write
else
  npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write
fi
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../../apps/dashboard
npm install
if [[ -x node_modules/.bin/prettier ]]; then
  node_modules/.bin/prettier "src/**/*.{ts,tsx}" --write
else
  npx --yes prettier "src/**/*.{ts,tsx}" --write
fi
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../extension
npm install
if [[ -x node_modules/.bin/prettier ]]; then
  node_modules/.bin/prettier "src/**/*.{ts,tsx}" --write
else
  npx --yes prettier "src/**/*.{ts,tsx}" --write
fi
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd "$ROOT_DIR"

tracked_env="$(git ls-files | grep -E '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' || true)"
if [[ -n "$tracked_env" ]]; then
  echo "Tracked env file found:" >&2
  echo "$tracked_env" >&2
  exit 1
fi

tracked_artifacts="$(git ls-files | grep -E '(^|/)(dist|build|coverage)/' || true)"
if [[ -n "$tracked_artifacts" ]]; then
  echo "Tracked build artifact found:" >&2
  echo "$tracked_artifacts" >&2
  exit 1
fi

active_docs=(
  "README.md"
  "services/api/README.md"
  "apps/dashboard/README.md"
  "apps/extension/README.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-MVP-GAP-REVIEW.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "docs/product/CLARA-VALIDATION-BASELINE.md"
  "docs/product/CLARA-SECURITY-BOUNDARY-SUMMARY.md"
  "docs/product/CLARA-PHASE-CLOSURE-SUMMARY.md"
  "docs/product/CLARA-RELEASE-READINESS-OVERVIEW.md"
  "docs/product/CLARA-P12-IMPLEMENTATION-ROADMAP.md"
  "docs/product/CLARA-P12-HANDOFF-FROM-P11.md"
  "docs/product/CLARA-RUNBOOK-INDEX.md"
  "docs/product/CLARA-TESTING-VALIDATION-INDEX.md"
)

for pattern in \
  "P11 complete" \
  "P12 Beta / GA Release Readiness" \
  "P12-PR-01" \
  "P12-PR-05" \
  "AuthContext" \
  "frontend role guard is UX-only" \
  "client workspaceId is never authority" \
  "workspace-scoped" \
  "no raw customer messages" \
  "no raw provider payload" \
  "no raw webhook payload" \
  "no raw usage events" \
  "no raw payment data" \
  "no raw telemetry" \
  "no access token" \
  "no refresh token" \
  "no cookies" \
  "no payment provider integration" \
  "no charging customers" \
  "no invoice creation" \
  "no quota enforcement" \
  "no real AI provider" \
  "no production deployment in this docs refresh" \
  "not GA-ready yet"; do
  if ! grep -R "$pattern" "${active_docs[@]}" >/dev/null; then
    echo "Missing expected docs refresh pattern: $pattern" >&2
    exit 1
  fi
done

for pattern in \
  "P10 is current" \
  "P11 is current" \
  "P11 is in progress" \
  "GA ready" \
  "billing launched" \
  "payment provider integrated"; do
  if grep -R "$pattern" "${active_docs[@]}" >/dev/null; then
    echo "Stale active docs phrase found: $pattern" >&2
    exit 1
  fi
done

for pattern in \
  "sk-live" \
  "sk_test" \
  "ghp_" \
  "service_role" \
  "BEGIN PRIVATE KEY" \
  "Bearer eyJ"; do
  if grep -R "$pattern" "${active_docs[@]}" >/dev/null; then
    echo "Potential secret-looking docs content found: $pattern" >&2
    exit 1
  fi
done

if [[ "${CLARA_REQUIRE_REMOTE_BRANCH:-false}" == "true" ]]; then
  git ls-remote --exit-code --heads origin docs/project-wide-refresh-before-p12 >/dev/null
fi

echo "CLARA DOCS REFRESH BEFORE P12 VALIDATION PASSED"
