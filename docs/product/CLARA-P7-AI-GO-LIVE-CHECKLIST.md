# CLARA P7 AI Go-Live Checklist

Go-Live Checklist for the P7 assistant layer.

## Required Gates

- [ ] Final AI Assistant Audit reviewed.
- [ ] AI Assistant Runbook reviewed.
- [ ] Incident Response runbook reviewed.
- [ ] `scripts/validate-p7-final-ai-assistant-audit-runbook.sh` passes.
- [ ] API tests pass.
- [ ] Dashboard tests pass.
- [ ] Extension tests pass.

## Security Gates

- [ ] no real LLM provider.
- [ ] no AI SDK.
- [ ] no API keys.
- [ ] no auto-send.
- [ ] no autonomous provider action.
- [ ] no automatic customer note write.
- [ ] no automatic task creation.
- [ ] no automatic scheduler.
- [ ] all endpoints auth-protected.
- [ ] backend AuthContext remains authority.
- [ ] workspace-scoped access verified.
- [ ] `requiresHumanApproval` verified.
- [ ] audit redaction verified.
- [ ] dashboard safe rendering verified.
- [ ] extension boundary verified.
- [ ] no access token.
- [ ] no refresh token.
- [ ] no cookies.
- [ ] no raw provider payload.
- [ ] no raw webhook payload.
- [ ] no raw DOM.
- [ ] no raw HTML.

## Handoff

P7 complete after this checklist passes. Next phase is P8 CRM & Workflow
Intelligence.
