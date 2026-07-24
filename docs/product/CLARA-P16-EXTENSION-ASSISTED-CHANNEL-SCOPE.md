# CLARA P16 Extension-Assisted Channel Scope

## Status

P15 Controlled Internal Beta Execution is complete. P15-PR-04 is complete. P16
Extension-Assisted Channel Ingestion Hardening is current. P16-PR-01 is complete. P16-PR-02 is complete. P16-PR-03 is current.

extension-assisted ingestion is internal/controlled/user-assisted.
extension-assisted ingestion captures only active chat opened by an authorized
operator. extension-assisted ingestion requires operator awareness/consent.
Extension-assisted ingestion must require operator awareness/consent.
extension-assisted ingestion is not official WA/IG/TikTok API activation.
official WA/IG/TikTok APIs remain not activated. extension-assisted ingestion is
not public SaaS launch. extension-assisted ingestion is not production
deployment claim unless separately executed.

billing/payment is deferred. real AI provider calls remain not activated in this
PR. provider/AI/outbound activation remains controlled. no outbound auto-send is
activated. no external support tool integration is activated. AuthContext and
workspace membership remain source of truth. client-supplied workspaceId is not
authoritative.

allowed capture is limited to visible active-chat message text, safe display
names/titles, channel identifier, direction, timestamps/timestamp labels,
selected conversation metadata needed for dedup/linking, and snapshot hash.

disallowed capture includes cookies/session tokens/auth headers/API
keys/localStorage/sessionStorage secrets/raw DOM/raw HTML/full page dumps/hidden
conversations/background inbox crawling/mass scraping/payment data/raw
prompts/raw provider payloads/raw webhook payloads/unnecessary
customer-sensitive data.

evidence/logs/docs/runbooks must not include secrets/tokens/cookies/auth
headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw
prompts/payment data. Evidence and issue reports should minimize
customer-sensitive data.

## Scope

- Capture is limited to the visible active conversation the operator has opened.
- Supported channels for this scope are WhatsApp, Instagram, and TikTok browser
  surfaces.
- Capture is a bridge for internal controlled use, not an official provider API
  replacement for public/commercial launch.
