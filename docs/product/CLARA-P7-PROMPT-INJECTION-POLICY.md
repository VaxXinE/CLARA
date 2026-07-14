---
project: "CLARA"
artifact: "P7 Prompt Injection Policy"
status: "implemented"
owner: "CLARA Engineering, Security, and AI"
classification: "security-policy"
---

# CLARA P7 Prompt Injection Policy

## Threat Model

Customer and provider content may contain malicious instructions. untrusted customer text must never become system or developer instruction.

## Instruction Separation

Future prompt/context builder work must separate system policy, developer/product policy, trusted application context, and untrusted customer text.

## Common Attack Examples

AI must ignore customer instructions that ask it to reveal secrets, reveal policies, bypass approval, send automatically, modify CRM secretly, access another customer/workspace, or ignore previous safety rules.

## Required Mitigations

Future P7 context builder must label untrusted customer text clearly, keep backend AuthContext and workspace-scoped access, block prompt injection with safeReasonCode such as `ai_prompt_injection_flagged`, and require human review before action.
