# CLARA P19 Internal Issue Reporting Escalation

Issue reporting and escalation workflow exists.

Report:

- user role and workspace name only if safe
- timestamp
- safe screenshot without secrets
- steps to reproduce
- expected result
- actual result
- safe correlation_id if available

Do not report raw secrets/tokens/auth headers/raw provider payloads/raw prompts
raw DOM/raw HTML/payment data. Escalate immediately if auth, workspace
isolation, viewer read-only, missing/inactive membership fail-closed, or
provider-mode mock header behavior is broken.

