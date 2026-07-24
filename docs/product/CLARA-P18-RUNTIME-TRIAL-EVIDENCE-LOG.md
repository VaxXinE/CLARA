# CLARA P18 Runtime Trial Evidence Log

P18-PR-01 is complete.
P18-PR-02 is complete.
P18-PR-03 is current.
P18 validates controlled internal runtime behavior only.

## Evidence Rows

| Field | Safe value |
| --- | --- |
| evidence_id | `p18-evidence-YYYYMMDD-NN` |
| execution_id | matching execution log id |
| checklist_item | smoke checklist id |
| captured_by | role/name placeholder only |
| evidence_type | screenshot, terminal summary, API status summary, dashboard status summary |
| safe_summary | short redacted summary |
| pass_fail | `pass`, `fail`, `blocked`, or `skipped` |
| known_issue_id | optional issue id |
| retention_until | disposal date or review date |
| redaction_status | `redacted` or `rejected` |

Runtime evidence/logs must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.
Evidence must use placeholders/safe summaries only.
AuthContext and workspace membership remain source of truth.
Client-supplied workspaceId is not authoritative.
P18-PR-04 is next for final controlled runtime trial review and operational handoff.
