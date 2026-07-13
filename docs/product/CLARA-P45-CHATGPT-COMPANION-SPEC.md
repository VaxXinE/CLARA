---
project: "CLARA"
artifact: "P4.5 ChatGPT Companion Spec"
status: "planned-contract"
classification: "product-security-spec"
last_updated: "2026-07-13"
---

# CLARA P4.5 ChatGPT Companion Spec

The ChatGPT Companion is an operator cockpit helper inside the future extension. CLARA remains the system of record.

## Safety Model

- ChatGPT context action must be user-triggered.
- Context must be previewable and copyable.
- Context must be bounded by message count and text length.
- Do not send all customer context to ChatGPT by default.
- Do not include provider cookies, provider tokens, raw DOM, raw HTML, raw provider payloads, or browser session material.
- Do not store ChatGPT session material in the CLARA backend.
- ChatGPT must not auto-send replies.

## Non-Goals

- No ChatGPT UI in this PR.
- No extension UI in this PR.
- No backend ChatGPT session storage.
- No autonomous customer reply sending.
