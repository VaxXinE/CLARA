# CLARA P17 AI Analysis Audit Privacy Policy

P17-PR-03 audit logging records safe metadata only for AI analysis request and
result events.

Safe metadata may include provider, model, channel, snapshot_id, snapshot_hash,
status, and safe_reason_code. Audit metadata must not include raw prompts, raw
customer messages, raw AI provider payloads and responses, tokens, cookies,
auth headers, API keys, secrets, or payment data.
