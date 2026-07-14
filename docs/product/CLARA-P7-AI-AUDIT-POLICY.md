---
project: "CLARA"
artifact: "P7 AI Audit Policy"
status: "implemented"
owner: "CLARA Engineering and Security"
classification: "audit-policy"
---

# CLARA P7 AI Audit Policy

## Event Taxonomy

- `ai_suggestion_requested`
- `ai_suggestion_generated`
- `ai_suggestion_rejected`
- `ai_suggestion_accepted`
- `ai_draft_created`
- `ai_context_built_safe`
- `ai_prompt_injection_flagged`
- `ai_policy_blocked`
- `ai_human_approval_required`

## Required Fields

Audit events should include workspaceId, userId, conversationId if applicable, customerId if applicable, action type, model/provider label if safe, safeReasonCode, createdAt, correlationId, and sanitized metadata only.

## Sanitized Metadata

Audit must include no provider tokens, no cookies, no raw provider payload, no raw webhook body, no raw DOM/HTML, no service role key, no LLM API key, no full prompt with secrets, and no cross-workspace data.

## Investigation Usage

AI audit is for security investigation, prompt injection review, approval traceability, and abuse analysis. It is not a customer analytics product.
