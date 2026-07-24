# CLARA P16 WhatsApp Active Chat Reader

P15 Controlled Internal Beta Execution is complete. P16 Extension-Assisted
Channel Ingestion Hardening is current. P16-PR-01 is complete. P16-PR-02 is
complete. P16-PR-03 is current.

Active chat reading is internal/controlled/user-assisted. Readers only capture
active chat opened by an authorized operator. Readers only capture visible
active-chat message text and safe visible metadata needed for
analysis/dedup/linking.

The WhatsApp reader is limited to the currently open WhatsApp Web active chat.
It fails closed when a safe active chat title or visible message cannot be
found. It does not crawl inboxes, inspect hidden conversations, read cookies, or
use WhatsApp official APIs.

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
