---
project: "CLARA"
artifact: "P7 AI Context Security Runbook"
status: "implemented"
owner: "CLARA Engineering, Security, and Operations"
classification: "security-runbook"
---

# CLARA P7 AI Context Security Runbook

## Scope

Use this runbook for suspected unsafe AI context, prompt injection, secret exposure, or cross-workspace context issues.

## Suspected Prompt Injection

1. Treat the customer/provider text as untrusted customer content.
2. Check whether the text asked to reveal secrets, ignore policy, auto-send, mutate provider settings, or access another workspace.
3. Record safe reason codes such as `ai_prompt_injection_flagged` or `ai_policy_blocked`.

## Suspected Secret In Context

AI context must include no access token, no refresh token, no cookies, no raw provider payload, no raw webhook payload, no raw DOM, no raw HTML, and no service role key.

If any secret-like field appears, disable the affected AI path, preserve sanitized logs, and investigate the builder input source.

## Cross-Workspace Suspicion

Verify that workspaceId comes from backend AuthContext and that conversation/customer records were loaded through workspace-scoped repositories. Client-supplied workspaceId is not authority.

## Unsafe AI Output Suspicion

Unsafe output includes claims that an action was already performed, requests to bypass approval, hidden provider actions, or instructions to send without review. Block the output and require human-in-the-loop review.

## Rollback And Escalation

1. Disable the affected AI feature flag or route if one exists.
2. Keep audit metadata sanitized.
3. Notify security review for AI tool execution or prompt/RAG behavior changes.
4. Do not add provider keys, real model credentials, or emergency bypasses.
