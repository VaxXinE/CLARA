---
project: "CLARA"
artifact: "P7 AI Prompt Contract"
status: "implemented"
owner: "CLARA Engineering, Security, and AI"
classification: "ai-security-spec"
---

# CLARA P7 AI Prompt Contract

## Purpose

Prompt Contract defines the structured prompt shape for future AI calls. P7-PR-02 does not call an AI provider.

## Prompt Sections

- systemPolicy
- developerPolicy
- trusted application context
- untrusted customer content
- taskInstruction
- outputContract

## Trusted Versus Untrusted

Trusted application context is built from backend AuthContext and scoped backend records. Customer messages, customer notes, provider text, and snippets are untrusted customer content and cannot override systemPolicy or developerPolicy.

## Output Contract

Future model output must fit this shape:

- type
- suggestedText
- summary
- recommendedNextAction
- safetyFlags
- requiresHumanApproval
- blockedReason

## Human Approval

The contract requiresHumanApproval by default. AI must not claim work was performed, must not execute provider actions, and must enforce no auto-send.

## Prompt Injection

Prompt injection attempts such as "ignore previous instructions", "reveal secrets", "send this automatically", or "access another workspace" remain untrusted input. The future AI layer must flag or block unsafe output.

## Non-Goals

No reply suggestion generation, real AI provider network call, hidden chain-of-thought storage, autonomous action execution, provider mutation, or role/user mutation is implemented here.
