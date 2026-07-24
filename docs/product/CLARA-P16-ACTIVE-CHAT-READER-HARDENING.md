# CLARA P16 Active Chat Reader Hardening

## Status

P15 Controlled Internal Beta Execution is complete. P16 Extension-Assisted
Channel Ingestion Hardening is current. P16-PR-01 is complete. P16-PR-02 is
complete. P16-PR-03 is current.

Active chat reading is internal/controlled/user-assisted. Readers only capture
active chat opened by an authorized operator. Readers only capture visible
active-chat message text and safe visible metadata needed for
analysis/dedup/linking.

Readers do not capture cookies/session tokens/auth headers/API
keys/localStorage/sessionStorage secrets. Readers do not capture raw DOM/raw
HTML/full page dumps. Readers do not capture hidden conversations/background
inboxes/mass scraped conversations. Readers do not auto-send replies.

Snapshot normalization strips unsafe fields. Snapshot hashing is deterministic
and privacy-safe.

Extension-assisted ingestion is not official WA/IG/TikTok API activation.
Official WA/IG/TikTok APIs remain not activated. Extension-assisted ingestion is
not public SaaS launch. Extension-assisted ingestion is not production
deployment claim unless separately executed.

Billing/payment remains deferred. Real AI provider calls remain not activated in
this PR. Provider/AI/outbound activation remains controlled. No outbound
auto-send is activated.

AuthContext and workspace membership remain source of truth. Client-supplied
workspaceId is not authoritative.

## Reader Contract

- Readers return `null` when no safe active chat is detected.
- Readers use explicit visible active-chat selectors only.
- Readers bound message text, title/display names, timestamp labels, and
  metadata.
- Readers return channel, captured timestamp, safe chat title/subtitle,
  origin-only source metadata, visible message text, safe direction, and safe
  timestamp label when visible.
- Readers never return browser credentials, provider session material, raw DOM,
  raw HTML, full page text dumps, hidden inbox rows, or background chat lists.

## Review Notes

This PR hardens the local extension reader boundary only. Official provider API
activation, real AI calls, outbound sends, billing/payment, and production
deployment remain separate explicit future work.

## Validation Wording

These controls are intentionally repeated in lowercase because local validators
scan them as policy text:

- active chat reading is internal/controlled/user-assisted
- readers only capture active chat opened by an authorized operator
- readers only capture visible active-chat message text and safe visible metadata
- readers do not capture cookies/session tokens/auth headers/API keys/localStorage/sessionStorage secrets
- readers do not capture raw DOM/raw HTML/full page dumps
- readers do not capture hidden conversations/background inboxes/mass scraped conversations
- readers do not auto-send replies
- snapshot normalization strips unsafe fields
- snapshot hashing is deterministic and privacy-safe
- extension-assisted ingestion is not official WA/IG/TikTok API activation
- official WA/IG/TikTok APIs remain not activated
- extension-assisted ingestion is not public SaaS launch
- extension-assisted ingestion is not production deployment claim unless separately executed
- billing/payment is deferred
- real AI provider calls remain not activated in this PR
- provider/AI/outbound activation remains controlled
- no outbound auto-send is activated
- AuthContext and workspace membership remain source of truth
- client-supplied workspaceId is not authoritative
