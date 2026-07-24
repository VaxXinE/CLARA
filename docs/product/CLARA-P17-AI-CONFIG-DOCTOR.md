# CLARA P17 AI Config Doctor

P17 Real AI Analysis Activation is current.
P17-PR-01 is current.

AI provider config doctor exists. It reports only safe readiness fields:

```text
status
mode
provider
has_api_key
default_model
model_allowlist_count
reason_codes
```

AI provider secrets must not be logged, persisted, audited, or returned in API responses.
AI provider config fails closed by default.
