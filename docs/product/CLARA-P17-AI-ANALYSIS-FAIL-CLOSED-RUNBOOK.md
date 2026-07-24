# CLARA P17 AI Analysis Fail-Closed Runbook

Expected fail-closed cases:

- provider config missing/invalid/disabled
- model not allowlisted
- cost guardrail exceeded
- rate limit guardrail exceeded
- timeout policy exceeded
- prompt-injection boundary triggered
- AuthContext/workspace mismatch

Responses must be safe reason-code summaries only. Do not expose provider raw
errors, raw prompts, raw customer messages, tokens, secrets, or Authorization
headers.
