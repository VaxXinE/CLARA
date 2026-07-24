# CLARA P17 AI Model Allowlist Policy

P17 Real AI Analysis Activation is current.
P17-PR-01 is current.

AI model allowlist is required. Configured AI provider mode must use an
allowlisted model, and the default model must be present in the allowlist.

Unallowlisted model names fail closed. Model selection is server-side and must
not trust dashboard, extension, or client-supplied workspaceId as authority.
