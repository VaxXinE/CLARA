# workers/AGENTS.md

Instructions for AI coding assistants working inside `workers/`.

---

## Rules

- Do not process cross-workspace data without explicit scope.
- Do not store secrets in job payloads.
- Do not log sensitive message bodies by default.
- Jobs must be idempotent where possible.
- Retries must be bounded.
- Use correlation/request/job IDs for traceability.
