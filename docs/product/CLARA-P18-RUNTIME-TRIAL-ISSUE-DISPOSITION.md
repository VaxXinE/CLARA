# CLARA P18 Runtime Trial Issue Disposition

P18-PR-01 is complete.
P18-PR-02 is complete.
P18-PR-03 is current.
P18 validates controlled internal runtime behavior only.

## Workflow

1. Record each issue with a safe issue id and safe summary.
2. Assign severity using blocker severity rules.
3. Link only redacted evidence ids.
4. Mark disposition as `accept_for_internal_trial`, `fix_before_next_run`, `block_broader_rollout`, or `duplicate`.
5. Review known limitations before broader rollout.

## Issue Fields

| Field | Safe value |
| --- | --- |
| known_issue_id | `p18-issue-YYYYMMDD-NN` |
| source_execution_id | execution log id |
| severity | `critical`, `high`, `medium`, `low` |
| blocker | `yes` or `no` |
| reason_code | safe reason code |
| safe_summary | redacted issue summary |
| owner_role | operator/admin placeholder |
| disposition | safe disposition |

Runtime evidence/logs must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.
Evidence must use placeholders/safe summaries only.
Known limitations must be reviewed before broader rollout.
Stop criteria and manual rollback references must remain visible.
P18-PR-04 is next for final controlled runtime trial review and operational handoff.
