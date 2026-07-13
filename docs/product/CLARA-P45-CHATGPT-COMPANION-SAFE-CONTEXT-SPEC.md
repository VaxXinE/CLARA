---
project: "CLARA"
artifact: "P4.5 ChatGPT Companion Safe Context Spec"
status: "implemented"
owner: "CLARA Engineering"
classification: "product-spec"
---

# CLARA P4.5 ChatGPT Companion Safe Context Spec

## Purpose

P4.5-PR-04 adds the extension-side ChatGPT Companion safe context builder and user-triggered preview/copy/open helpers.

This is the p4.5 ChatGPT Companion checkpoint for safe manual operator assistance.

## Implemented

- Bounded plain-text safe context builder from a normalized extension snapshot.
- Safe context preview helper.
- Copy-to-clipboard helper that runs only when called by user-driven UI code.
- ChatGPT Companion URL resolver with safe HTTPS allowlist.
- Open helper for user-triggered navigation to ChatGPT.
- Tests for bounded context, URL handling, copy/open behavior, and security exclusions.

## Safe Context Contents

The prompt includes:

- channel;
- `provider: extension`;
- `official_api: false`;
- chat title and optional subtitle;
- recent bounded visible messages;
- operator-assistance instruction text.

The prompt excludes raw DOM, raw HTML, provider payloads, browser storage values, cookies, auth headers, tokens, debug payloads, and non-contract fields.

## Security Boundaries

- No automatic ChatGPT message submission.
- No ChatGPT DOM automation.
- No ChatGPT cookies, localStorage, sessionStorage, or tokens are read or stored.
- No OpenAI API call is made from the extension.
- No customer reply is auto-sent.
- Clara remains the system of record.

## Validation

```bash
cd apps/extension
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```
