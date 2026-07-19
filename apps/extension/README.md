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
- P7 AI Reply Suggestion keeps ChatGPT Companion preview/copy/manual only; it does not add auto-submit, auto-send, cookies, tokens, raw DOM, or raw HTML.
- P7 AI Draft Review keeps the extension boundary preview/copy/manual only. The extension does not approve drafts, reject drafts, send replies, read tokens, read cookies, capture raw DOM, capture raw HTML, or auto-send.
- P7 AI Follow-up Recommendation keeps the extension boundary preview/copy/manual only. The extension does not create tasks, schedule reminders, send messages, read tokens, read cookies, capture raw DOM, or capture raw HTML.
- P7 AI Conversation Summary and AI Customer Note Suggestion keep the extension boundary preview/copy/manual only. The extension does not auto-write notes, mutate customer records, read tokens, read cookies, capture raw DOM, or capture raw HTML.
- P7 Final AI Assistant Audit keeps ChatGPT Companion preview/copy/manual only. The extension does not auto-send, auto-submit, auto-write customer notes, capture cookies, capture access token, capture refresh token, capture raw provider payload, capture raw webhook payload, capture raw DOM, or capture raw HTML.
- P8 CRM & Workflow Intelligence keeps extension handoff manual. The extension does not perform autonomous CRM mutation, auto-write customer note, auto-create task, auto-assign owner, read tokens, read cookies, capture raw DOM, or capture raw HTML.
- P8 extension guardrails: no autonomous CRM mutation, no auto-write customer note, no auto-create task, no auto-assign owner.
- P8 Customer Profile Intelligence stays in the backend/dashboard read model. The extension does not compute intelligence, mutate CRM data, create tasks, assign owners, read tokens, capture raw provider payloads, capture raw DOM, or capture raw HTML.
- P8 Customer Timeline Intelligence stays in the backend/dashboard read model. The extension does not mutate CRM data, create tasks, assign owners, auto-write customer note, change lifecycle/status, read access token, read refresh token, read cookies, capture raw provider payload, capture raw webhook payload, capture raw DOM, or capture raw HTML.
- P8 Reviewable CRM Action Proposal stays in the backend/dashboard proposal-only read model. The extension does not execute proposals, mutate CRM data, auto-create task, auto-write customer note, perform owner assignment mutation, perform lifecycle/status mutation, read access token, read refresh token, read cookies, capture raw provider payload, capture raw webhook payload, capture raw DOM, or capture raw HTML.
- P8 Task / Follow-up Workflow Proposal stays in the backend/dashboard proposal-only read model. The extension does not create tasks, execute follow-up workflow, schedule tasks, send outbound messages, mutate CRM data, read access token, read refresh token, read cookies, capture raw provider payload, capture raw webhook payload, capture raw DOM, or capture raw HTML.
- P8 Owner Assignment Readiness stays in the backend/dashboard read-only model. The extension does not assign owners, execute CRM workflow, mutate CRM data, create tasks, write notes, change status/lifecycle, read access token, read refresh token, read cookies, capture raw provider payload, capture raw webhook payload, capture raw DOM, or capture raw HTML.
- P8 Lifecycle / Status Update Readiness stays in the backend/dashboard readiness-only model. The extension does not update lifecycle, update status, execute CRM workflow, mutate CRM data, create tasks, send outbound messages, run a scheduler, read access token, read refresh token, read cookies, capture raw provider payload, capture raw webhook payload, capture raw DOM, or capture raw HTML.
- P8 CRM Activity Audit Hardening stays in the backend audit boundary. The extension does not read CRM audit internals, write CRM audit events directly, bypass audit policy, execute CRM actions, read access token, read refresh token, read cookies, capture raw provider payload, capture raw webhook payload, capture raw DOM, or capture raw HTML.
- P8-PR-09 closes P8 extension boundary regression. P8 complete keeps extension
  behavior manual-assisted only: no CRM mutation, no task creation, no owner
  assignment mutation, no lifecycle mutation, no status mutation, no outbound
  send, no real AI provider, no raw provider payload, no raw webhook payload,
  no access token, no refresh token, and no cookies. P9 Analytics / Reporting /
  KPI remains outside the extension.

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

P7 AI Reply Suggestion extension boundary:

```bash
cd apps/extension
npm run test -- p7-ai-reply-suggestion
```

P7 AI Automation Guardrails keep the extension preview/copy/manual only. Abuse
Tests cover no auto-send, no automatic task creation, no automatic scheduler,
no automatic customer note write, no access token, no refresh token, no cookies,
no raw provider payload, no raw webhook payload, no raw DOM, and no raw HTML.

Build artifacts are intentionally not committed.

P9-PR-01 keeps Analytics / Reporting / KPI out of the extension. The extension
does not read analytics internals, request cross-workspace metrics, receive raw
KPI data, capture analytics secrets/tokens, capture raw provider payload, raw
webhook payload, raw DOM, or raw HTML.

P9-PR-02 keeps the Analytics Read Model and Metric Foundation out of the
extension runtime. The extension does not read metric registry internals,
request metric catalog data, request cross-workspace analytics, receive raw
metric data, capture raw provider payload, raw webhook payload, raw DOM, raw
HTML, access token, refresh token, cookies, or analytics secrets.

P9-PR-03 keeps the Core Operational Metrics Pack out of the extension runtime.
The extension does not request analytics overview, Conversation Volume Metrics,
Response Time / SLA, Channel Performance Metrics, cross-workspace analytics,
raw provider payload, raw webhook payload, raw DOM, raw HTML, access token,
refresh token, cookies, customer-level drilldown data, or analytics secrets.

P9-PR-04 keeps CRM Workflow Metrics and KPI Dashboard Cards out of the
extension runtime. The extension does not request CRM workflow analytics, KPI
dashboard cards, cross-workspace analytics, raw metric data, raw provider
payload, raw webhook payload, raw audit metadata, raw DOM, raw HTML, access
token, refresh token, cookies, customer-level drilldown data, or analytics
secrets.

P9-PR-05 keeps Reporting Filters and Analytics Audit Privacy internals out of
the extension runtime. The extension does not request reporting filters,
operator analytics filters, analytics audit events, report export data,
customer-level drilldown, cross-workspace analytics, raw provider payload, raw
webhook payload, raw audit metadata, raw DOM, raw HTML, access token, refresh
token, cookies, or analytics secrets.

P9-PR-06 adds final extension boundary and security regression coverage for
Analytics / Reporting / KPI. P9 COMPLETE after P9-PR-06 merge and handoff moves
to P10 Enterprise Hardening / Compliance.

P10-PR-01 keeps Enterprise Hardening / Compliance internals out of the
extension runtime. The extension does not read compliance evidence, audit
evidence, tenant isolation internals, raw customer messages, raw provider
payload, raw webhook payload, raw DOM, raw HTML, raw prompts, access token,
refresh token, cookies, auth headers, API keys, or secrets.
