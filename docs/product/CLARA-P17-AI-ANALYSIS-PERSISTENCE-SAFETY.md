# CLARA P17 AI Analysis Persistence Safety

P17-PR-03 persistence stores only safe/redacted result data.

Allowed persistence:

- scoped organization/workspace identifiers
- snapshot id/hash
- safe analysis status and reason code
- safe output contract fields
- provider name/model metadata
- timestamps

Disallowed persistence:

- raw prompts
- raw customer messages as AI prompts
- raw AI request payloads
- raw AI provider payloads and responses
- raw provider payloads
- tokens, cookies, auth headers, API keys, secrets, payment data

Dashboard review UI shows only safe AI analysis output.
