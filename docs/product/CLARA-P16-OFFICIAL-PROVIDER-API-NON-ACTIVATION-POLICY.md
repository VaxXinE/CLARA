# CLARA P16 Official Provider API Non-Activation Policy

## Status

P15 Controlled Internal Beta Execution is complete. P15-PR-04 is complete. P16
Extension-Assisted Channel Ingestion Hardening is current. P16-PR-01 is complete. P16-PR-02 is current.

extension-assisted ingestion is internal/controlled/user-assisted.
extension-assisted ingestion captures only active chat opened by an authorized
operator. extension-assisted ingestion requires operator awareness/consent.
extension-assisted ingestion is not official WA/IG/TikTok API activation.
official WA/IG/TikTok APIs remain not activated. extension-assisted ingestion is
not public SaaS launch. extension-assisted ingestion is not production
deployment claim unless separately executed.

billing/payment is deferred. real AI provider calls remain not activated in this
PR. provider/AI/outbound activation remains controlled. no outbound auto-send is
activated. no external support tool integration is activated. AuthContext and
workspace membership remain source of truth. client-supplied workspaceId is not
authoritative.

evidence/logs/docs/runbooks must not include secrets/tokens/cookies/auth
headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw
prompts/payment data.

## Policy

- P16 does not activate official WhatsApp APIs.
- P16 does not activate official Instagram APIs.
- P16 does not activate official TikTok APIs.
- Extension-assisted ingestion is an internal controlled bridge, not a public
  commercial provider integration.

