#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

current_branch="$(git branch --show-current)"
expected_branch="docs/post-p19-mark-real-internal-crm-complete-handoff"
if [[ "$current_branch" != "$expected_branch" ]]; then
  fail "expected branch ${expected_branch}, got ${current_branch}"
fi

tracked_files="$(git ls-files)"

grep -qE '(^|/)\.agents(/|$)' <<<"$tracked_files" && fail ".agents must not be tracked"
grep -q '^skills-lock\.json$' <<<"$tracked_files" && fail "skills-lock.json must not be tracked"
grep -qE '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files" && fail "real env files must not be tracked"
grep -qE '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files" && fail "dist/build/coverage artifacts must not be tracked"

required_docs=(
  "README.md"
  "docs/product/CLARA-P19-ROADMAP.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
)

for file in "${required_docs[@]}"; do
  [[ -f "$file" ]] || fail "missing required file: $file"
done

doc_bundle="$(cat "${required_docs[@]}" | tr '\n' ' ' | tr -s ' ')"
required_phrases=(
  "P19 is complete"
  "P19-PR-05 is complete"
  "Post-P19 handoff summary exists"
  "next phase requires separate explicit approval"
  "internal team usage must use provider auth"
  "mock/demo mode is dev/test only"
  "real workspace membership is required"
  "backend AuthContext/workspace membership is source of truth"
  "client-supplied workspaceId is not authoritative"
  "missing/inactive membership fails closed"
  "viewer is read-only"
  "owner/agent CRM mutation policy remains enforced"
  "CLARA is not public GA launch"
  "CLARA is not public SaaS launch"
  "CLARA is not production deployment"
  "billing/payment remains deferred"
  "official WA/IG/TikTok APIs remain not activated"
  "outbound auto-send remains disabled"
)

for phrase in "${required_phrases[@]}"; do
  grep -qiF "$phrase" <<<"$doc_bundle" || fail "missing docs phrase: $phrase"
done

if grep -qiE 'public GA launch is complete|public SaaS launch is complete|production deployment is complete|billing/payment is activated|outbound auto-send enabled' <<<"$doc_bundle"; then
  fail "unexpected launch/payment/automation completion claim"
fi

git diff --check
bash scripts/validate-repo-structure.sh

echo "CLARA POST-P19 REAL INTERNAL CRM COMPLETE HANDOFF VALIDATION PASSED"
