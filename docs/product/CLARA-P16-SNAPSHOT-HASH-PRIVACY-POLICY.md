# CLARA P16 Snapshot Hash Privacy Policy

P15 Controlled Internal Beta Execution is complete. P16 Extension-Assisted
Channel Ingestion Hardening is current. P16-PR-01 is complete. P16-PR-02 is
current.

Active chat reading is internal/controlled/user-assisted. Readers only capture
active chat opened by an authorized operator. Readers only capture visible
active-chat message text and safe visible metadata needed for
analysis/dedup/linking.

Snapshot hashing is deterministic and privacy-safe. Hash material is stable,
bounded, and derived from normalized visible active-chat fields needed for
deduplication. The hash output is an opaque `snapshot_` value and does not
return raw message text, raw DOM, raw HTML, cookies, tokens, auth headers, API
keys, localStorage, sessionStorage, provider payloads, webhook payloads, or
payment data.

Snapshot normalization strips unsafe fields before snapshots are sent to CLARA.

Readers do not capture cookies/session tokens/auth headers/API
keys/localStorage/sessionStorage secrets. Readers do not capture raw DOM/raw
HTML/full page dumps. Readers do not capture hidden conversations/background
inboxes/mass scraped conversations. Readers do not auto-send replies.

Extension-assisted ingestion is not official WA/IG/TikTok API activation.
Official WA/IG/TikTok APIs remain not activated. Extension-assisted ingestion is
not public SaaS launch. Extension-assisted ingestion is not production
deployment claim unless separately executed.

Billing/payment remains deferred. Real AI provider calls remain not activated in
this PR. Provider/AI/outbound activation remains controlled. No outbound
auto-send is activated.

AuthContext and workspace membership remain source of truth. Client-supplied
workspaceId is not authoritative.
