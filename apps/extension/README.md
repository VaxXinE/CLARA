# apps/extension/

CLARA browser extension auto-sync engine for operator-visible active conversations.

## Status

```text
P1-P13 complete; P14 Internal Beta Rollout Preparation current
```

## Scope

The extension boundary is current through P14. P14-PR-01 is complete.
P14-PR-02 is complete. P14-PR-03 is complete. P14-PR-04 is complete.
P14-PR-05 is complete. P14-PR-06 is current. P14 internal beta rollout
preparation is complete only after this PR validates. Internal beta go-live is
controlled internal usage only. Internal beta is not public SaaS launch.
Internal beta is not production deployment claim unless separately executed.
Internal usage feedback loop is for internal beta
rollout. Feedback triage is manual/local/repo-safe unless separately approved.
Feedback must not include secrets/tokens/cookies/auth headers/raw provider
payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data. Feedback
should minimize customer-sensitive data. Known limitations must be reviewed
before broader rollout. Known issues workflow is internal beta
only. no external support tool integration is activated. Internal access QA is
complete for internal beta rollout. Owner/admin/operator/viewer access
boundaries are reviewed. Viewer/read-only mutation blocking is required.
Operator CRM access is scoped. Admin/owner elevated actions require workspace
membership and proper role. AuthContext and workspace membership remain source
of truth. Client-supplied workspaceId is not authoritative. Internal data import
remains workspace-scoped and safe. Secrets/tokens/cookies/raw provider
payload/raw webhook payload/raw HTML/payment data must not be imported or
exposed. billing/payment is deferred. public SaaS launch is deferred.
production deployment requires separate explicit action. Provider/AI/outbound
activation remains controlled.

The extension boundary is current through P11. P12-PR-01 is complete. P12-PR-02
is complete. P12-PR-03 is complete. P12-PR-04 is complete. P12-PR-05 is current work. P12 extension work is release readiness
only: no background crawling, no billing/reliability/internal access, no
production deployment in this PR, no automatic rollback, and CLARA is not
GA-ready yet.
P12-PR-04 does not add support tool integration, external ticket creation, or
notification sending to the extension.
P12 completion means release readiness complete. P12 completion does not mean
production deployed. P12 completion does not mean public GA launch happened.
P13-PR-01 is complete. P13-PR-02 is complete. P13-PR-03 is complete.
P13-PR-04 is complete. P13-PR-05 is complete. P13-PR-06 is complete.
P13-PR-07 is current. P13 internal CRM activation is complete only after this
PR validates. internal CRM usage is the focus. CLARA is usable for internal CRM
workflow after P13. billing/payment is deferred. Public SaaS launch is deferred.
CLARA is not production deployed yet. CLARA is not public GA launched yet. no
real provider/payment/AI/outbound behavior is activated. no real external
provider credentials are required. The extension boundary remains non-mutating
for CRM state except existing safe snapshot bridge behavior.

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
- Does not capture cookie/token/auth header material.
- Does not export raw DOM, raw HTML, raw prompt, raw provider payload, raw
  webhook payload, raw customer messages, raw usage events, raw payment data, or
  raw telemetry.
- Does not access billing/reliability internals.
- Does not call a real AI provider.
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

P10-PR-02 keeps Tenant Isolation + Permission Audit Hardening out of the
extension runtime. The extension does not become authority for organization,
workspace, user, role, tenant isolation, permission audit, audit evidence, role
mutation, permission mutation, raw customer messages, raw provider payload, raw
webhook payload, raw audit metadata, access token, refresh token, cookies, auth
headers, API keys, or secrets.

P10-PR-03 keeps Audit Retention, Data Classification, Redaction Hardening,
Sensitive Field Classifier, and raw compliance data out of the extension
runtime. The extension does not request cross-workspace enterprise data and
does not capture access token, refresh token, cookies, auth headers, raw
provider payload, raw webhook payload, raw audit metadata, raw DOM, raw HTML,
raw prompts, API keys, secrets, permission mutation, role mutation, CRM
mutation, outbound send, deletion automation, legal hold automation, or report
export behavior.

P10-PR-04 keeps Admin Security Controls, Session Policy, and Compliance
Dashboard internals out of the extension runtime. The extension does not read
admin security internals, session policy internals, compliance dashboard
internals, compliance evidence, cross-workspace enterprise data, raw customer
messages, raw provider payload, raw webhook payload, raw audit metadata,
access token, refresh token, cookies, auth headers, API keys, secrets, raw DOM,
raw HTML, raw prompts, permission mutation, role mutation, session revocation,
force logout, CRM mutation, outbound send, evidence export, SSO implementation,
MFA implementation, or real AI provider behavior.

P10-PR-05 keeps Backup / Restore, Incident Response, Evidence Readiness, and
Operational Resilience internals out of the extension runtime. The extension
does not request backup/restore internals, incident response internals,
evidence internals, raw compliance evidence, cross-workspace enterprise data,
raw customer messages, raw provider payload, raw webhook payload, raw audit
metadata, raw evidence, raw DOM, raw HTML, raw prompts, access token, refresh
token, cookies, auth headers, API keys, secrets, backup execution, restore
execution, data deletion automation, legal hold automation, evidence export,
CRM mutation, outbound send, or real AI provider behavior.

P10-PR-06 closes Final P10 Enterprise Hardening / Compliance as audit/runbook
and regression coverage only. The extension remains active-conversation-only
and manual-assisted. It does not request enterprise readiness internals, raw
evidence, raw permission internals, tokens, cookies, auth headers, raw provider
payload, raw webhook payload, raw DOM, raw HTML, raw prompts, automation,
export/download, CRM mutation, outbound send, or real AI provider behavior.

P11-PR-01 keeps Scale / Reliability / Billing internals out of the extension
runtime. The extension does not request reliability internals, SLO readiness,
usage metering internals, billing readiness, raw usage data, payment provider
config, quota enforcement, raw provider payload, raw webhook payload, raw audit
metadata, access token, refresh token, cookies, auth headers, API keys, secrets,
CRM mutation, outbound send, job execution, load-test execution, or real AI
provider behavior.

P11-PR-02 keeps Queue / Job Reliability, Retry, Idempotency, and Dead Letter
internals out of the extension runtime. The extension does not request queue
internals, retry execution, idempotency internals, job enqueue, job execution,
replay, purge, raw job payload, raw customer messages, raw provider payload,
raw webhook payload, access token, refresh token, cookies, auth headers,
payment provider integration, charging customers, subscription mutation, or
real AI provider behavior.

P11-PR-03 keeps Rate Limit, Quota, Usage Metering, and billing metadata
internals out of the extension runtime. The extension does not request quota
internals, usage metering internals, raw usage data, raw usage events, raw
customer messages, raw provider payload, raw webhook payload, raw audit
metadata, access token, refresh token, cookies, auth headers, API keys,
secrets, payment provider integration, charging customers, invoice creation,
subscription mutation, plan mutation, entitlement mutation, CRM mutation,
outbound send, or real AI provider behavior.

P11-PR-04 keeps Observability, SLO Dashboard, Alert Readiness, Error Budget,
safe telemetry summary, alert execution, notification send, vendor provider
integration, raw telemetry, raw logs, raw traces, raw metric events, raw
customer messages, raw provider payload, raw webhook payload, access token,
refresh token, cookies, auth headers, API keys, secrets, payment provider
integration, charging customers, and subscription mutation out of the extension
runtime.

P11-PR-05 keeps Billing Readiness, Plan Entitlement, Plan Catalog,
Subscription Lifecycle, Payment Provider Boundary, payment data, raw usage
events, raw customer messages, raw provider payload, raw webhook payload, raw
audit metadata, raw evidence, access token, refresh token, cookies, auth
headers, API keys, secrets, raw DOM, raw HTML, raw prompts, payment provider
integration, customer charging, invoice creation, checkout session,
subscription mutation, plan mutation, entitlement mutation, quota enforcement,
CRM mutation, outbound send, and real AI provider behavior out of the extension
runtime.

P11-PR-06 keeps Performance, Load Test, Capacity, capacity planning, safe
benchmark, raw telemetry, raw logs, raw traces, raw metric events, raw customer
messages, raw provider payload, raw webhook payload, access token, refresh
token, cookies, auth headers, API keys, secrets, raw DOM, raw HTML, raw
prompts, load-test execution, benchmark execution, production target behavior,
external provider calls, payment provider integration, customer charging,
invoice creation, subscription mutation, CRM mutation, outbound send, and real
AI provider behavior out of the extension runtime.

P11-PR-07 keeps Final P11 Scale / Reliability / Billing audit, production
runbook, reliability checklist, billing-readiness checklist, performance and
capacity checklist, security regression checklist, operator/admin QA checklist,
and P12 Beta / GA Release Readiness handoff out of the extension runtime. The
extension remains active-conversation/manual-assisted only and exposes no raw
telemetry, no raw logs, no raw traces, no raw metric events, no raw usage
events, no raw payment data, no raw customer messages, no raw provider payload,
no raw webhook payload, no access token, no refresh token, no cookies, no CRM
mutation, no outbound send, no payment provider integration, no charging
customers, no invoice creation, no subscription mutation, no quota enforcement,
no heavy load test in normal validation, no production target by default, and no
real AI provider.
