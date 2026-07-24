# CLARA P18 Runtime Trial Stop Criteria

Stop the trial immediately if any condition is observed:
- Runtime evidence includes secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.
- Extension calls an AI provider directly.
- AI provider secrets are exposed to dashboard or extension.
- AuthContext or workspace membership is bypassed.
- Client-supplied workspaceId becomes authoritative.
- Outbound auto-send is enabled.
- Official WA/IG/TikTok APIs are activated.
- Billing/payment is activated.
- Public SaaS launch or production deployment is claimed.

Stop criteria are required before broader rollout.
