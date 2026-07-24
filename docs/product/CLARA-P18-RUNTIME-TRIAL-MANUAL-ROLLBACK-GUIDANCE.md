# CLARA P18 Runtime Trial Manual Rollback Guidance

Manual rollback guidance is required before broader rollout.

Manual stop/rollback steps:
1. Stop operator trial activity.
2. Disable controlled AI provider mode if configured for the trial.
3. Stop extension-assisted capture for affected users.
4. Preserve safe audit/evidence summaries only.
5. Review workspace attribution, dedup status, and safe persistence records.
6. Record the stop reason with safe reason code only.
7. Do not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.

This guidance is not production rollback automation and does not claim
production deployment.
