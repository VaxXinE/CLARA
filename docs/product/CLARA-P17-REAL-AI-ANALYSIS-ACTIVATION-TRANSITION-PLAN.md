# CLARA P17 Real AI Analysis Activation Transition Plan

P15 Controlled Internal Beta Execution is complete.
P16 Extension-Assisted Channel Ingestion Hardening is current.
P16-PR-01 is complete.
P16-PR-02 is complete.
P16-PR-03 is complete.
P16-PR-04 is current.
P16 closes only after this PR validates.

P17 real AI analysis activation is next. P17 may only start after P16
validation confirms sanitized/redacted snapshots, workspace attribution,
deduplication, idempotency, conversation linking, and runtime QA.

Real AI provider calls remain not activated in this PR.
Provider/AI/outbound activation remains controlled.
No outbound auto-send is activated.

Future P17 work must keep AI output untrusted, require human approval for risky
actions, and avoid exposing secrets/tokens/cookies/auth headers/raw provider
payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data.
