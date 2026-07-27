---
project: "CLARA"
artifact: "P19 Real Conversation Customer Linking Workflow"
status: "current"
classification: "operator-runbook"
---

# P19 Real Conversation Customer Linking Workflow

Conversation-to-customer linking is explicit and workspace-scoped.

Operators link a conversation to an existing customer only when backend
permission allows customer update. The backend scopes both conversation and
customer by organization and workspace from AuthContext. client-supplied
workspaceId is not authoritative.

Unlinking must also be explicit. Cross-workspace resources return safe
not-found behavior.
