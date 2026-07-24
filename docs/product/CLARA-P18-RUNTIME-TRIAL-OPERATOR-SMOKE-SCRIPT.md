# CLARA P18 Runtime Trial Operator Smoke Script

P18-PR-02 is complete.
P18-PR-03 is current.

## Operator Steps

1. Confirm you are in the approved internal trial workspace.
2. Confirm the dashboard session resolves through backend AuthContext.
3. Open one approved active chat only; do not crawl inboxes or hidden conversations.
4. Run the extension-assisted capture for the visible active chat.
5. Confirm sanitization/redaction status before ingestion.
6. Confirm backend ingestion/dedup result uses the resolved workspace membership.
7. Confirm AI-ready context is generated from sanitized/redacted data.
8. Request controlled backend AI analysis only through the approved backend path.
9. Review safe analysis output in the dashboard review UI.
10. Record pass/fail evidence using the evidence template and known issue capture template.

## Operator Must Not

- Do not capture secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.
- Do not use client-supplied workspaceId as authority.
- Do not call AI providers from the extension.
- Do not auto-send replies.
- Do not activate official WA/IG/TikTok APIs.
- Do not treat this as public SaaS launch or production deployment.
