---
project: "CLARA"
artifact: "P4.5 Extension Bridge Final Security Checklist"
status: "implemented"
owner: "CLARA Security"
classification: "security-checklist"
---

# CLARA P4.5 Extension Bridge Final Security Checklist

## Allowed

- Active conversation snapshot sync.
- CLARA-authenticated backend snapshot intake.
- `provider: extension`.
- `official_api: false`.
- User-visible auto-sync status.
- User-triggered ChatGPT safe context preview, copy, and open.
- Safe bounded plain-text context.

## Forbidden

- Auto-send customer replies.
- Auto-submit context to ChatGPT.
- ChatGPT DOM automation.
- Provider official API impersonation.
- Provider cookie capture.
- Provider token storage.
- ChatGPT cookie/session/token access.
- Raw DOM persistence.
- Raw HTML persistence.
- Raw provider payload persistence.
- Inbox crawler.
- Background crawler.
- Media or attachment upload.

## Final Gate

Before release, confirm:

- API, dashboard, and extension validations are green.
- Production audits report no production dependency vulnerabilities.
- Secret/content scans do not find token, cookie, raw payload, or unsafe HTML patterns.
- Security review is requested because this touches browser extension behavior, customer conversations, and external-provider-adjacent workflows.
