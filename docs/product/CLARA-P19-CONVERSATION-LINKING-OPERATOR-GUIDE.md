# CLARA P19 Conversation Linking Operator Guide

Conversation-to-customer linking is explicit and workspace-scoped.

Operators must link only when the conversation and customer belong to the same
resolved workspace from backend AuthContext. client-supplied workspaceId is not
authoritative. Cross-workspace linking must remain safe-not-found or forbidden
according to backend policy.

Mock/demo mode is dev/test only. Internal team usage must use provider auth.

