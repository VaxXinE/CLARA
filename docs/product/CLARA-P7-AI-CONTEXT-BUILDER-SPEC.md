---
project: "CLARA"
artifact: "P7 AI Context Builder Spec"
status: "implemented"
owner: "CLARA Engineering, Security, and AI"
classification: "ai-security-spec"
---

# CLARA P7 AI Context Builder Spec

## Purpose

AI Context Builder creates the minimized, workspace-scoped context that a future AI Assistant may use. It is pure backend logic only and makes no real AI provider calls.

## Input Contract

Input must come from trusted backend services:

- backend AuthContext
- task type
- scoped conversation summary
- scoped customer summary when needed
- bounded recent messages
- safe channel health
- optional sanitized knowledge snippets

Client-supplied organization or workspace values are never authority.

## Output Contract

The builder returns:

- workspaceId and userId from backend AuthContext
- taskType
- conversationId
- nullable customerId
- channel
- sanitized customer display name
- sanitized recent messages
- sanitized safe channel status
- sanitized notes and snippets
- untrusted customer content blocks
- contextBudgetSummary
- policyVersion

## Data Minimization

Context includes only fields needed for the selected task. It does not pass full database rows, hidden provider metadata, provider credentials, or raw external payloads.

## Workspace Scope

Context is workspace-scoped. Cross-workspace conversation or customer data is rejected before context is built.

## Sanitization

AI context must contain no access token, no refresh token, no cookies, no raw provider payload, no raw webhook payload, no raw DOM, no raw HTML, no service role key, and no LLM API key.

HTML is converted to plain text. Customer/provider text remains untrusted customer content.

## Task Types

- conversation_summary
- reply_suggestion
- tone_rewrite
- follow_up_suggestion
- customer_note_summary
- operator_coaching

## Non-Goals

This PR adds no real AI provider integration, no OpenAI/Gemini/Claude SDK, no reply generation, no AI draft send flow, no automation execution, no CRM expansion, and no billing or role/user mutation.
