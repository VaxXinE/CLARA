# CLARA P16 Conversation Linking Policy

P15 Controlled Internal Beta Execution is complete.
P16 Extension-Assisted Channel Ingestion Hardening is current.
P16-PR-01 is complete.
P16-PR-02 is complete.
P16-PR-03 is complete.
P16-PR-04 is current.
P16 closes only after this PR validates.

Conversation linking is workspace-scoped. Extension snapshots may link to the
same conversation only when organization, workspace, channel, and conversation
fingerprint match.

Client-supplied workspaceId is not authoritative. AuthContext and workspace
membership remain source of truth. Cross-workspace spoofing must be rejected.

Extension-assisted ingestion is not official WA/IG/TikTok API activation.
Official WA/IG/TikTok APIs remain not activated. No outbound auto-send is
activated.
