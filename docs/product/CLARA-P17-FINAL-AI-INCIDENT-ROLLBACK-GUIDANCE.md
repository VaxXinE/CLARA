# CLARA P17 Final AI Incident Rollback Guidance

If AI analysis behaves unsafely:
1. Disable AI provider runtime config.
2. Confirm analysis requests fail closed.
3. Preserve only safe evidence without secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data.
4. Review audit logs for safe metadata only.
5. Re-run P17 final validation before re-enabling internal use.

This is guidance only. CLARA is not production deployment claim unless separately executed.
