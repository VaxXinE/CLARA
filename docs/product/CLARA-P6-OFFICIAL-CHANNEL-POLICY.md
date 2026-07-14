# CLARA P6 Official Channel Policy

Official Channel Policy for production provider integrations.

## Policy

- Production provider integrations must use official API only or an explicitly
  approved direct first-party channel.
- Scraping blocked.
- Session cookie blocked.
- session cookie blocked.
- Browser automation blocked as a production provider strategy.
- browser automation blocked.
- QR/session hijacking blocked.
- Unofficial provider client libraries are blocked unless security review
  explicitly approves them.
- Provider tokens and cookies must never be stored by the browser extension.
- Frontend must never receive provider secrets.
- Backend authorization source of truth is mandatory.
- Workspace scope must come from backend AuthContext or server-resolved channel
  account mapping.
- Extension bridge is a separate user-assisted convenience layer, not an
  official provider replacement and not a compliance substitute for official
  APIs.

## Channel Notes

- Gmail: official Gmail API path exists as a production foundation; P6-PR-02
  must harden credentials and health before production use.
- Webchat: first-party channel foundation exists; P6-PR-03 must harden webhook,
  outbox, retry, and idempotency.
- WhatsApp: production provider path must be official WhatsApp APIs only.
  Simulation and user-assisted extension snapshots are not production provider
  replacements.
- Instagram: planned official API only.
- TikTok: planned official API only.
- Browser Extension Bridge: active visible chat and user-assisted snapshot only.
- ChatGPT Companion: preview/copy/open/manual only, no auto-submit.
