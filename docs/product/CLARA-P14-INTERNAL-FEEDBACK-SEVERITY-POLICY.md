# CLARA P14 Internal Feedback Severity Policy

## Status

P14-PR-05 is current for internal beta feedback triage.

## Severity

| Severity | Meaning | Example |
| --- | --- | --- |
| S1 | Internal beta cannot continue safely | Workspace isolation, auth, or data exposure concern |
| S2 | Core CRM workflow blocked for a role | Owner/agent cannot complete required internal CRM task |
| S3 | Workflow degraded but usable | Confusing UI, missing copy, non-blocking validation gap |
| S4 | Cosmetic or documentation improvement | Wording, labels, checklist clarity |

## Priority

| Priority | Response |
| --- | --- |
| P0 | Stop internal rollout until reviewed |
| P1 | Fix before expanding internal users |
| P2 | Schedule in the next internal iteration |
| P3 | Backlog for later polish |

Security, tenant isolation, secrets, payment data, raw provider payload, raw
webhook payload, raw HTML, raw DOM, raw prompts, and authorization concerns must
be treated as at least S1/P0 until reviewed.
