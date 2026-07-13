---
project: "CLARA"
artifact: "P4.5 Extension Auto-Sync Engine Spec"
status: "implemented"
owner: "CLARA Engineering"
classification: "product-spec"
---

# CLARA P4.5 Extension Auto-Sync Engine Spec

## Purpose

P4.5-PR-03 adds the extension-side auto-sync engine for operator-visible active conversations.

The engine reads only the currently open conversation, creates a safe bounded snapshot, deduplicates by `snapshot_hash`, and posts changed snapshots to the CLARA backend snapshot intake route.

## Implemented

- `apps/extension` TypeScript package.
- WhatsApp Web active conversation reader for mocked/safe DOM text fields.
- Channel detection for WhatsApp, Instagram, and TikTok.
- Safe placeholder readers for Instagram and TikTok.
- Snapshot normalization with bounded message count and text length.
- Deterministic snapshot hashing.
- Auto-sync engine with unchanged-snapshot dedupe and minimum interval throttling.
- CLARA API client for `POST /api/v1/extension/:channel/snapshots`.
- CLARA session boundary that only accepts configured CLARA origins.
- Visible auto-sync status panel text renderer.
- Offline tests for hash, normalization, engine behavior, API client behavior, channel detection, WhatsApp reader behavior, and security rules.

## Security Boundaries

- CLARA authentication is required before sync.
- Provider cookies, browser session material, provider auth headers, and ChatGPT session material are not read or sent.
- Raw DOM, raw HTML, provider payloads, media blobs, and attachment files are not captured.
- Inbox lists and background conversations are not crawled.
- Auto-send is not implemented.
- ChatGPT Companion UI and context builder remain planned but are not part of this PR.

## Validation

```bash
cd apps/extension
npm install
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```

Backend snapshot intake remains the server-side source of truth for authentication, tenant scope, RBAC, validation, persistence, and audit logging.
