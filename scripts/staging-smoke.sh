#!/usr/bin/env bash

set -euo pipefail

api_base_url="${CLARA_API_BASE_URL:-http://127.0.0.1:3000}"
dashboard_base_url="${CLARA_DASHBOARD_BASE_URL:-http://127.0.0.1:8080}"

require_command() {
  local command_name="$1"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing required command: $command_name" >&2
    exit 1
  fi
}

check_status() {
  local label="$1"
  local url="$2"
  local expected_status="$3"

  local status
  status="$(curl -sS -o /tmp/clara-smoke-body.$$ -w "%{http_code}" "$url")"

  if [[ "$status" != "$expected_status" ]]; then
    echo "FAIL: $label expected HTTP $expected_status, got $status" >&2
    cat /tmp/clara-smoke-body.$$ >&2
    rm -f /tmp/clara-smoke-body.$$
    exit 1
  fi

  echo "PASS: $label -> HTTP $status"
  rm -f /tmp/clara-smoke-body.$$
}

require_command "curl"

echo "CLARA staging smoke"
echo "API: $api_base_url"
echo "Dashboard: $dashboard_base_url"

check_status "API health" "$api_base_url/health" "200"
check_status "API ready" "$api_base_url/ready" "200"
check_status "Protected API unauthenticated" "$api_base_url/api/v1/me" "401"
check_status "Dashboard root" "$dashboard_base_url/" "200"

echo "Smoke checks completed successfully."
