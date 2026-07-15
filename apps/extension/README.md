# apps/extension/

CLARA browser extension auto-sync engine for operator-visible active conversations.

## Status

```text
P4.5-PR-03 Extension Auto-Sync Engine
```

## Scope

This package contains a small TypeScript implementation for:

- detecting WhatsApp, Instagram, and TikTok browser channels;
- reading the currently open WhatsApp Web conversation from safe text fields;
- normalizing a bounded snapshot payload;
- generating a deterministic `snapshot_hash`;
- syncing changed snapshots to `POST /api/v1/extension/:channel/snapshots`;
- rendering a simple visible auto-sync status panel string;
- building a bounded ChatGPT Companion safe context preview from the latest normalized snapshot;
- copying the safe context only after an explicit user action;
- opening the configured ChatGPT Companion URL only after an explicit user action.

Instagram and TikTok readers are safe placeholders in this PR. They detect the host but do not crawl inboxes or background chats.

## Security Rules

- Uses CLARA auth only.
- Browser Extension Bridge is user-assisted only and is not an official provider replacement.
- Does not read provider cookies, localStorage, sessionStorage, or tokens.
- Does not send provider auth headers.
- Does not persist raw DOM, raw HTML, media blobs, or attachment files.
- Does not crawl inbox lists or background conversations.
- Does not auto-send replies.
- Does not auto-submit context to ChatGPT.
- Does not read or store ChatGPT cookies, localStorage, sessionStorage, or tokens.
- P6 final observability/audit handoff keeps the extension bridge user-assisted and excludes provider cookies, raw DOM/HTML, and auto-send behavior.
- P7 AI assistant safety scope keeps ChatGPT Companion preview/copy/manual only and does not add auto-submit, auto-send, raw DOM/HTML capture, or provider token access.
- P7 AI context boundary keeps extension-provided context bounded, manual, and free of cookies, tokens, raw DOM, and raw HTML.

## ChatGPT Companion Config

```text
VITE_CLARA_CHATGPT_COMPANION_URL=https://chatgpt.com/
VITE_CLARA_CHATGPT_CONTEXT_MESSAGE_LIMIT=12
VITE_CLARA_CHATGPT_CONTEXT_TEXT_LIMIT=1200
VITE_CLARA_CHATGPT_CONTEXT_PROMPT_LIMIT=8000
```

Only `https://chatgpt.com` and `https://chat.openai.com` companion URLs are accepted. Query strings and fragments are stripped before opening.

## Commands

```bash
npm install
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high
```

Final P5 security audit from repo root:

```bash
bash scripts/validate-p5-final-security-audit.sh
```

P6 provider readiness policy from repo root:

```bash
bash scripts/validate-p6-provider-readiness-policy.sh
```

P6 final observability/audit validation from repo root:

```bash
bash scripts/validate-p6-final-observability-audit-runbook.sh
```

P7 AI assistant safety scope validation from repo root:

```bash
bash scripts/validate-p7-ai-assistant-safety-scope.sh
```

P7 AI context builder validation from repo root:

```bash
bash scripts/validate-p7-ai-context-builder-prompt-contract.sh
```

Build artifacts are intentionally not committed.
