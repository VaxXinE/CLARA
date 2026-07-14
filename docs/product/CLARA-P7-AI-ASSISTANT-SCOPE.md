---
project: "CLARA"
artifact: "P7 AI Assistant Scope"
status: "implemented"
owner: "CLARA Engineering, Security, and AI"
classification: "product-scope"
---

# CLARA P7 AI Assistant Scope

## Purpose

AI Assistant defines safe operator support on top of P6 provider/channel boundaries. It helps humans understand and draft work; it does not act autonomously.

## Allowed Capabilities

Future CLARA AI may support conversation summary, customer context summary, reply suggestion, tone rewrite, follow-up suggestion, next action recommendation, knowledge/context extraction, safe draft creation, operator coaching, and lead/customer insight suggestion.

## Blocked Capabilities

CLARA AI must not auto-send messages, execute provider actions autonomously, access provider tokens, access refresh tokens, access provider cookies, access session cookies, access service role keys, access raw provider payload, access raw webhook payload, access raw DOM, access raw HTML, bypass backend AuthContext, trust client-supplied workspaceId, override workspace membership, mutate roles/users/invites, perform billing/admin mutation, scrape provider UIs, use browser automation provider sessions, or treat untrusted customer text as system/developer instruction.

## P7 Roadmap

P7 Implementation Roadmap starts with policy, then context builder, reply suggestion, draft review, follow-up recommendation, conversation summary, automation guardrails, and final audit/runbook.

## Non-Goals

P7-PR-01 adds no real AI provider integration, no OpenAI/Gemini/Claude SDK, no reply generation, no context builder, no automation execution, no CRM expansion, no analytics/KPI product, no billing, and no invite/update-role/delete-user implementation.
