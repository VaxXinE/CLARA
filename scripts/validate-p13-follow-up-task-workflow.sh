#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH_NAME="$(git -C "$ROOT_DIR" branch --show-current)"
EXPECTED_BRANCH="feat/p13-follow-up-task-workflow"

if [[ "$BRANCH_NAME" != "$EXPECTED_BRANCH" ]]; then
  echo "Expected branch $EXPECTED_BRANCH, got $BRANCH_NAME" >&2
  exit 1
fi

required_paths=(
  "docs/product/CLARA-P13-FOLLOW-UP-TASK-WORKFLOW.md"
  "docs/product/CLARA-P13-INTERNAL-CRM-ACTIVATION-ROADMAP.md"
  "docs/product/CLARA-P13-BILLING-DEFERRED-POLICY.md"
  "docs/product/CLARA-FINAL-ROADMAP.md"
  "docs/product/CLARA-DOCUMENTATION-INDEX.md"
  "services/api/tests/p13-follow-up-task-route.test.ts"
  "services/api/tests/p13-follow-up-task-service.test.ts"
  "services/api/tests/p13-follow-up-task-workspace-boundary.test.ts"
  "services/api/tests/p13-follow-up-task-input-validation.test.ts"
  "services/api/tests/p13-follow-up-task-assignee-boundary.test.ts"
  "services/api/tests/p13-follow-up-task-activity-timeline.test.ts"
  "services/api/tests/p13-follow-up-task-no-billing-side-effect.test.ts"
  "services/api/tests/p13-follow-up-task-no-notification-side-effect.test.ts"
  "apps/dashboard/src/components/p13-follow-up-task-workflow.test.tsx"
  "apps/dashboard/src/components/p13-follow-up-task-security.test.tsx"
  "apps/extension/src/tests/p13-follow-up-task-extension-boundary.test.ts"
)

for path in "${required_paths[@]}"; do
  if [[ ! -f "$ROOT_DIR/$path" ]]; then
    echo "Missing required P13-PR-04 artifact: $path" >&2
    exit 1
  fi
done

tracked_files="$(git -C "$ROOT_DIR" ls-files)"

if grep -Eq '(^|/)\.agents(/|$)' <<<"$tracked_files"; then
  echo ".agents/ must not be tracked" >&2
  exit 1
fi

if grep -Eq '(^|/)skills-lock\.json$' <<<"$tracked_files"; then
  echo "skills-lock.json must not be tracked" >&2
  exit 1
fi

if grep -Eq '(^|/)\.env$|(^|/)\.env\.local$|(^|/)\.env\.production$' <<<"$tracked_files"; then
  echo "Committed .env file detected" >&2
  exit 1
fi

if grep -Eq '(^|/)(dist|build|coverage)(/|$)' <<<"$tracked_files"; then
  echo "Committed build artifact detected" >&2
  exit 1
fi

docs_blob="$(
  cat \
    "$ROOT_DIR/docs/product/CLARA-P13-FOLLOW-UP-TASK-WORKFLOW.md" \
    "$ROOT_DIR/docs/product/CLARA-P13-INTERNAL-CRM-ACTIVATION-ROADMAP.md" \
    "$ROOT_DIR/docs/product/CLARA-P13-BILLING-DEFERRED-POLICY.md" \
    "$ROOT_DIR/docs/product/CLARA-FINAL-ROADMAP.md" \
    "$ROOT_DIR/docs/product/CLARA-DOCUMENTATION-INDEX.md" \
    "$ROOT_DIR/docs/product/CLARA-MVP-GAP-REVIEW.md" \
    "$ROOT_DIR/README.md" \
    "$ROOT_DIR/services/api/README.md" \
    "$ROOT_DIR/apps/dashboard/README.md"
)"

required_phrases=(
  "P13-PR-01 is complete"
  "P13-PR-02 is complete"
  "P13-PR-03 is complete"
  "P13-PR-04 is current"
  "internal CRM usage is the focus"
  "billing/payment is deferred"
  "follow-up tasks are workspace-scoped internal CRM features"
  "task assignee requires valid workspace membership"
  "this PR does not auto-send external notifications"
  "CLARA is not production deployed yet"
  "CLARA is not public GA launched yet"
)

for phrase in "${required_phrases[@]}"; do
  if ! grep -Fq "$phrase" <<<"$docs_blob"; then
    echo "Missing required P13-PR-04 doc phrase: $phrase" >&2
    exit 1
  fi
done

runtime_blob="$(
  find "$ROOT_DIR/services/api/src" "$ROOT_DIR/apps/dashboard/src" "$ROOT_DIR/apps/extension/src" \
    -type f \( -name '*.ts' -o -name '*.tsx' \) \
    -not -name '*.test.ts' \
    -not -name '*.test.tsx' \
    -not -path '*/tests/*' \
    -print0 | xargs -0 cat
)"

for pattern in \
  "stripe" \
  "createCheckout" \
  "chargeCustomer" \
  "createInvoice" \
  "mutateSubscription" \
  "enforceQuota" \
  "openai.chat.completions" \
  "autonomousAiAction" \
  "autoSend" \
  "sendSlack" \
  "sendDiscord" \
  "sendWebhookNotification" \
  "deployProduction" \
  "rollbackProduction" \
  "zendesk" \
  "intercom" \
  "dangerouslySetInnerHTML"; do
  if grep -Fq "$pattern" <<<"$runtime_blob"; then
    echo "Forbidden runtime activation pattern detected: $pattern" >&2
    exit 1
  fi
done

if grep -Eq 'raw.*(payload|token|secret).*display|display.*raw.*(payload|token|secret)' <<<"$runtime_blob"; then
  echo "Forbidden raw payload/token/secret display pattern detected" >&2
  exit 1
fi

(
  cd "$ROOT_DIR/services/api"
  npm install
  npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write
  npm run typecheck
  npm run test
  npm run build
  npm audit --omit=dev --audit-level=high
)

(
  cd "$ROOT_DIR/apps/dashboard"
  npm install
  npx --yes prettier "src/**/*.{ts,tsx}" --write
  npm run typecheck
  npm run test
  npm run build
  npm audit --omit=dev --audit-level=high
)

(
  cd "$ROOT_DIR/apps/extension"
  npm install
  npx --yes prettier "src/**/*.{ts,tsx}" --write
  npm run typecheck
  npm run test
  npm run build
  npm audit --omit=dev --audit-level=high
)

if git -C "$ROOT_DIR" ls-remote --exit-code --heads origin "$EXPECTED_BRANCH" >/dev/null 2>&1; then
  echo "Remote branch exists: $EXPECTED_BRANCH"
else
  echo "Remote branch not found yet; push after commit to complete remote check."
fi

echo "CLARA P13-PR-04 VALIDATION PASSED"
