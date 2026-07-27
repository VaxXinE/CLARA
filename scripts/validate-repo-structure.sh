#!/usr/bin/env bash
set -euo pipefail

required_paths=(
  "apps"
  "apps/dashboard"
  "apps/web"
  "services"
  "services/api"
  "services/ai-gateway"
  "services/integration-gateway"
  "workers"
  "workers/automation-worker"
  "workers/ingestion-worker"
  "workers/notification-worker"
  "packages"
  "packages/shared"
  "packages/config"
  "packages/validation"
  "packages/types"
  "packages/ui"
  "infra"
  "infra/local"
  "infra/docker"
  "infra/deployment"
  "scripts"
  "tests"
  "tests/e2e"
  "tests/integration"
  "tests/fixtures"
  "tools"
  ".github/workflows"
)

missing=0

for path in "${required_paths[@]}"; do
  if [[ ! -e "$path" ]]; then
    echo "Missing required path: $path"
    missing=1
  fi
done

tracked_files="$(git ls-files)"

if grep -qE '(^|/)\.env$' <<<"$tracked_files"; then
  echo "Security check failed: .env file found. Do not commit .env files."
  missing=1
fi

if grep -qE '(^|/)\.env\.local$' <<<"$tracked_files"; then
  echo "Security check failed: .env.local file found. Do not commit local env files."
  missing=1
fi

if grep -qE '(^|/)\.env\.production$' <<<"$tracked_files"; then
  echo "Security check failed: .env.production file found. Do not commit production env files."
  missing=1
fi

if grep -qE '(^|/)\.DS_Store$' <<<"$tracked_files"; then
  echo "Repository hygiene check failed: .DS_Store file found."
  missing=1
fi

if grep -qE '\.pem$|\.key$|(^|/)id_rsa$|(^|/)id_ed25519$' <<<"$tracked_files"; then
  echo "Security check failed: possible private key file found."
  missing=1
fi

if [[ "$missing" -ne 0 ]]; then
  echo "CLARA repository structure validation failed."
  exit 1
fi

echo "CLARA repository structure validation passed."
