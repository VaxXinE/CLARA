# CLARA P16 Snapshot Normalization Hardening

P15 Controlled Internal Beta Execution is complete. P16 Extension-Assisted
Channel Ingestion Hardening is current. P16-PR-01 is complete. P16-PR-02 is
current.

Active chat reading is internal/controlled/user-assisted. Readers only capture
active chat opened by an authorized operator. Readers only capture visible
active-chat message text and safe visible metadata needed for
analysis/dedup/linking.

Snapshot normalization strips unsafe fields. It constructs a fresh allowlisted
payload instead of forwarding reader input. The normalized payload keeps only:
channel, extension provider marker, official API false marker, captured
timestamp, snapshot hash, safe chat title/subtitle, safe source origin, message
id, direction, author, text, timestamp label, and reply-context text.

Normalization enforces max messages per snapshot, max message text length, max
title/display name length, whitespace normalization, empty message removal, and
safe incoming direction fallback for unsupported direction values.

Readers do not capture cookies/session tokens/auth headers/API
keys/localStorage/sessionStorage secrets. Readers do not capture raw DOM/raw
HTML/full page dumps. Readers do not capture hidden conversations/background
inboxes/mass scraped conversations. Readers do not auto-send replies.

Snapshot hashing is deterministic and privacy-safe.

Extension-assisted ingestion is not official WA/IG/TikTok API activation.
Official WA/IG/TikTok APIs remain not activated. Extension-assisted ingestion is
not public SaaS launch. Extension-assisted ingestion is not production
deployment claim unless separately executed.

Billing/payment remains deferred. Real AI provider calls remain not activated in
this PR. Provider/AI/outbound activation remains controlled. No outbound
auto-send is activated.

AuthContext and workspace membership remain source of truth. Client-supplied
workspaceId is not authoritative.
