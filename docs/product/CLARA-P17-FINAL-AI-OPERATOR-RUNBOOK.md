# CLARA P17 Final AI Operator Runbook

Use this runbook only for internal controlled runtime QA.

1. Confirm P17-PR-04 is current/final validation gate.
2. Confirm real AI analysis is server-only.
3. Capture only an active visible chat through extension-assisted ingestion.
4. Verify the backend stores sanitized/redacted snapshot data.
5. Trigger backend AI analysis only through authenticated CLARA API flow.
6. Review dashboard output as safe AI analysis output.
7. Confirm outbound auto-send remains disabled.

Stop the test if provider config is missing/invalid/disabled and the API does not fail closed.
