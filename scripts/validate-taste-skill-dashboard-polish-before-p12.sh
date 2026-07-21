#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH_NAME="$(git -C "$ROOT_DIR" branch --show-current)"

fail() {
  echo "VALIDATION FAILED: $1" >&2
  exit 1
}

run_step() {
  echo
  echo "==> $1"
  shift
  "$@"
}

run_pkg_checks() {
  local package_dir="$1"
  local package_name="$2"
  local audit_pattern

  run_step "$package_name whitespace/format sanity" git -C "$ROOT_DIR" diff --check -- "$package_dir"
  run_step "$package_name typecheck" npm --prefix "$ROOT_DIR/$package_dir" run typecheck
  run_step "$package_name test" npm --prefix "$ROOT_DIR/$package_dir" run test
  run_step "$package_name build" npm --prefix "$ROOT_DIR/$package_dir" run build

  if npm --prefix "$ROOT_DIR/$package_dir" run | grep -qE '(^|[[:space:]])audit($|[[:space:]])'; then
    run_step "$package_name audit" npm --prefix "$ROOT_DIR/$package_dir" run audit
  else
    audit_pattern='dangerouslySetInnerHTML|innerHTML\s*=|http[s]?://fonts\.|googletagmanager|segmentio|analytics\.track|mixpanel|amplitude|posthog'

    if [ "$package_dir" = "services/api" ] || [ "$package_dir" = "apps/extension" ]; then
      audit_pattern='http[s]?://fonts\.|googletagmanager|segmentio|analytics\.track|mixpanel|amplitude|posthog'
    fi

    run_step "$package_name source audit" bash -lc "
      if rg -n --glob '!**/*.test.ts' --glob '!**/*.test.tsx' '$audit_pattern' '$ROOT_DIR/$package_dir/src'; then
        exit 1
      fi
    " || fail "$package_name source audit found forbidden pattern"
  fi
}

[ "$BRANCH_NAME" = "ui/taste-skill-dashboard-polish-before-p12" ] || fail "branch must be ui/taste-skill-dashboard-polish-before-p12, got $BRANCH_NAME"

for tracked_path in .agents skills-lock.json .env .env.local .env.production; do
  if git -C "$ROOT_DIR" ls-files --error-unmatch "$tracked_path" >/dev/null 2>&1; then
    fail "$tracked_path must not be tracked"
  fi
done

if git -C "$ROOT_DIR" ls-files | grep -Eq '(^|/)(dist|build|coverage)(/|$)'; then
  fail "dist/build/coverage artifacts must not be tracked"
fi

run_pkg_checks "apps/dashboard" "Dashboard"
run_pkg_checks "services/api" "API"
run_pkg_checks "apps/extension" "Extension"

DASHBOARD_SCAN_TARGETS=(
  "$ROOT_DIR/apps/dashboard/src/components"
  "$ROOT_DIR/apps/dashboard/src/App.tsx"
)

for scan_entry in \
  "dangerouslySetInnerHTML:::dangerouslySetInnerHTML" \
  "raw HTML rendering:::\\.innerHTML|DOMParser|createContextualFragment" \
  "external font CDN:::fonts\\.googleapis|fonts\\.gstatic|use\\.typekit" \
  "tracking SDK:::googletagmanager|gtag\\(|mixpanel|amplitude|segmentio|posthog" \
  "token/cookie/auth header/API key/secret display:::\\{[^}]*((access|refresh)Token|authHeader|apiKey|clientSecret|serviceRole|cookie)[^}]*\\}" \
  "raw payload display:::\\{[^}]*raw[A-Za-z]*(Payload|Telemetry|Logs|Traces|Metric)[^}]*\\}" \
  "charge/invoice/checkout actions:::\\b(chargeCustomer|createInvoice|startCheckout|openCheckout|createCheckoutSession)\\b|aria-label=\\\"[^\\\"]*(charge|invoice|checkout)" \
  "quota enforcement side effects:::\\b(enforceQuota|applyQuota|quotaExceededAction)\\b" \
  "outbound auto-send side effects:::\\b(autoSend|auto_send|sendOutboundAutomatically)\\b"
do
  label="${scan_entry%%:::*}"
  pattern="${scan_entry#*:::}"

  if rg -n -i "$pattern" "${DASHBOARD_SCAN_TARGETS[@]}" --glob '!**/*.test.ts' --glob '!**/*.test.tsx'; then
    fail "dashboard scan hit forbidden pattern: $label"
  fi
done

echo
echo "CLARA TASTE SKILL DASHBOARD POLISH VALIDATION PASSED"
