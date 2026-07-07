---
book: "Book III — Implementation Architecture"
appendix: "C"
title: "Security Checklist"
version: "1.0.0"
status: "official"
owner: "Athena Security Architecture Team"
last_updated: "2026-07-07"
classification: "security-checklist"
---

# APPENDIX C — Security Checklist

> *"Security is strongest when it is boring, repeated, and enforced by default."*

---

# Purpose

This checklist helps engineers implement Athena features securely.

Use it for:

- New features.
- Pull requests.
- API reviews.
- Data model reviews.
- Integration reviews.
- AI capability reviews.
- Production readiness reviews.

---

# Identity Checklist

- [ ] User identity is authenticated.
- [ ] Service identity is authenticated.
- [ ] Session/token validation is centralized.
- [ ] Expired sessions are rejected.
- [ ] MFA readiness is considered for high-risk actions.
- [ ] Account lifecycle is handled.
- [ ] Disabled users cannot access protected resources.

---

# Authorization Checklist

- [ ] Server-side authorization exists.
- [ ] Permission key is defined.
- [ ] Role/permission mapping is defined.
- [ ] Resource ownership is checked.
- [ ] Organization scope is enforced.
- [ ] Workspace scope is enforced where applicable.
- [ ] Elevated/admin actions require stronger review.
- [ ] Frontend permission checks are not used as final security.

---

# Tenant Isolation Checklist

- [ ] All queries include Organization scope.
- [ ] Workspace scope is included where applicable.
- [ ] Cache keys include tenant scope.
- [ ] Search filters include tenant scope.
- [ ] Vector metadata filters include tenant scope.
- [ ] Object storage metadata includes tenant scope.
- [ ] Audit logs include tenant scope.
- [ ] Tests cover cross-tenant denial.

---

# Input Validation Checklist

- [ ] Request body is validated.
- [ ] Query params are validated.
- [ ] Path params are validated.
- [ ] File uploads are validated.
- [ ] Webhook payloads are validated.
- [ ] AI tool arguments are validated.
- [ ] Unknown fields are handled intentionally.
- [ ] Dangerous characters are handled by context-aware encoding.

---

# Output Safety Checklist

- [ ] Sensitive fields are not returned.
- [ ] PII is minimized.
- [ ] Output is encoded in UI.
- [ ] HTML is sanitized when allowed.
- [ ] Error messages do not leak internals.
- [ ] Logs do not contain secrets.
- [ ] AI responses are treated as untrusted before display/action.

---

# Secrets Checklist

- [ ] No secrets in source code.
- [ ] No secrets in docs examples.
- [ ] No secrets in logs.
- [ ] No secrets in frontend bundle.
- [ ] Secrets come from managed secret provider.
- [ ] Secret access is least privilege.
- [ ] Rotation strategy exists for high-risk secrets.
- [ ] Emergency revocation path exists.

---

# Data Protection Checklist

- [ ] Data classification is defined.
- [ ] PII is identified.
- [ ] Sensitive data is encrypted where required.
- [ ] Retention policy is defined.
- [ ] Deletion/anonymization behavior is defined.
- [ ] Backup protection is considered.
- [ ] Export permissions are strict.
- [ ] Audit access is restricted.

---

# Integration Security Checklist

- [ ] Webhooks verify signatures.
- [ ] OAuth tokens are stored securely.
- [ ] Provider credentials are vaulted.
- [ ] External payloads are validated.
- [ ] SSRF risk is considered.
- [ ] Egress is restricted where possible.
- [ ] Idempotency exists for webhook and external writes.
- [ ] External provider errors do not leak sensitive data.

---

# AI Security Checklist

- [ ] Prompt injection risk is considered.
- [ ] AI context is permission-scoped.
- [ ] RAG retrieval uses tenant metadata filters.
- [ ] Tool execution requires authorization.
- [ ] Tool arguments are validated.
- [ ] AI output is not blindly executed.
- [ ] Sensitive data sent to model is minimized.
- [ ] AI requests and tool actions are audited where needed.

---

# Threat Modeling Mini Checklist

Ask:

1. What can go wrong?
2. Who can abuse this?
3. What data can leak?
4. What action can be performed illegally?
5. What tenant boundary can be crossed?
6. What external system can be abused?
7. What happens if AI output is malicious?
8. How do we detect abuse?
9. How do we recover?
10. What test proves the mitigation works?

---

# Navigation

**Back:** README.md
