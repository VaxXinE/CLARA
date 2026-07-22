---
project: "CLARA"
artifact: "P12 Release Notes Beta Changelog Policy"
status: "active"
owner: "CLARA Product"
classification: "beta-changelog"
---

# CLARA P12 Release Notes / Beta Changelog Policy

P12-PR-01 is complete. P12-PR-02 is complete. P12-PR-03 is complete. P12-PR-04 is current.

CLARA is not GA yet.

Known issues must be reviewed before GA.

Feedback/support must not collect raw sensitive data.

No external support tool integration happens in this PR.

No auto-send or external ticket creation happens in this PR.

No provider/payment/AI/outbound activation happens in this PR.

## Policy

- Release notes summarize safe user-visible changes only.
- Known limitations must be transparent for beta users.
- Security fixes are summarized without exploit detail.
- Do not include raw customer messages, raw logs, provider payloads, secrets,
  tokens, payment data, raw prompts, or private personal data.
- P12-PR-05 consumes this changelog during final GA audit/runbook.
