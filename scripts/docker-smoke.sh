#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

echo "Validating Docker Compose example"
docker compose -f docker-compose.prod.example.yml config >/dev/null

echo "Building API image"
docker build -f services/api/Dockerfile -t clara-api:local .

echo "Building dashboard image"
docker build -f apps/dashboard/Dockerfile -t clara-dashboard:local .

echo "Docker smoke validation completed"
