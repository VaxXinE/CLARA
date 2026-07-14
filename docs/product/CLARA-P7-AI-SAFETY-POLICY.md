---
project: "CLARA"
artifact: "P7 AI Safety Policy"
status: "implemented"
owner: "CLARA Engineering and Security"
classification: "security-policy"
---

# CLARA P7 AI Safety Policy

## Secure-By-Design Principles

AI Assistant is suggestion-first, server-authorized, workspace-scoped, and minimized by default. backend AuthContext remains the source of truth.

## Human-In-The-Loop

All AI suggestions require human-in-the-loop review before becoming customer-visible or operational action.

## No Auto-Send

CLARA AI has no auto-send permission. Reply send requires explicit operator action through the approved application flow.

## No Autonomous Provider Actions

AI cannot connect/disconnect providers, send messages, trigger sync outside approved flows, mutate CRM secretly, change users/roles, or execute billing/admin actions.

## No Secret Access

AI context must include no access token, no refresh token, no cookies, no raw provider payload, no raw webhook payload, no raw DOM, no raw HTML, no service role key, and no LLM API key.

## Abuse Scenarios

Blocked abuse includes prompt injection, cross-workspace requests, policy reveal attempts, secret reveal attempts, approval bypass attempts, and autonomous provider action requests.
