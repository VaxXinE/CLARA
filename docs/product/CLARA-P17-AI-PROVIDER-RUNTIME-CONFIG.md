# CLARA P17 AI Provider Runtime Config

P16 Extension-Assisted Channel Ingestion Hardening is complete.
P16-PR-04 is complete.
P17 Real AI Analysis Activation is current.
P17-PR-01 is current.

P17-PR-01 prepares AI provider runtime configuration but does not yet execute extension snapshot AI analysis.

AI provider mode defaults to disabled. AI provider config fails closed by
default. Supported runtime states are disabled, mock, and configured.

Server-only placeholders:

```text
AI_PROVIDER_MODE=disabled
AI_PROVIDER=mock
AI_PROVIDER_API_KEY=
AI_MODEL_ALLOWLIST=
AI_DEFAULT_MODEL=
AI_REQUEST_TIMEOUT_MS=15000
AI_MAX_INPUT_CHARS=12000
AI_MAX_OUTPUT_TOKENS=1200
AI_DAILY_COST_BUDGET_CENTS=0
AI_WORKSPACE_DAILY_BUDGET_CENTS=0
AI_OPERATOR_DAILY_BUDGET_CENTS=0
```

AI provider secrets are server-only. AI provider secrets must not be exposed to
dashboard or extension. AI provider secrets must not be logged, persisted,
audited, or returned in API responses.

AuthContext and workspace membership remain source of truth.
Client-supplied workspaceId is not authoritative.
