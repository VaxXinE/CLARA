---
project: "CLARA"
artifact: "P7 AI Data Access Policy"
status: "implemented"
owner: "CLARA Engineering, Security, and AI"
classification: "data-access-policy"
---

# CLARA P7 AI Data Access Policy

## Allowed With Minimization

AI may receive task-selected conversation text, customer display name if needed, channel name, safe channel status, safe conversation metadata, safe CRM/customer notes, prior operator-approved replies, and sanitized knowledge snippets.

## Restricted And Blocked

AI must not receive access_token, refresh_token, cookies, provider secrets, raw provider payload, raw webhook body, raw email MIME body unless sanitized/plain text extracted safely, raw DOM, raw HTML, authorization header, service role key, OpenAI/Gemini/LLM API key, cross-workspace data, or data from an unauthorized workspace.

## Workspace Scope

AI context is workspace-scoped and derived from backend AuthContext. Client-supplied workspaceId is never authority.

## Retention And Logging

AI context must follow data minimization. Logs and audit metadata must not include full prompts with secrets, provider internals, raw customer payloads, or unnecessary PII.
