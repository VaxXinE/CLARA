# Security Policy

> "Clara must be secure by design, secure by default, and secure in operation."

---

# Supported Scope

This policy applies to:

- Documentation.
- Examples.
- Templates.
- Architecture decisions.
- Future source code.
- CI/CD configuration.
- Infrastructure configuration.
- AI prompts and tool definitions.
- Product operations processes.

---

# Do Not Commit

Never commit:

- API keys.
- Passwords.
- OAuth tokens.
- JWT secrets.
- Private keys.
- Production credentials.
- Customer data.
- Internal secrets.
- Sensitive screenshots.
- `.env` files with real values.
- Unredacted personal data.
- Provider tokens.
- Webhook secrets.

Use placeholders such as:

```text
example-token
example-api-key
example.com
customer@example.test
```

---

# Reporting Security Issues

If you find a security issue:

1. Do not open a public issue with sensitive details.
2. Contact the repository owner privately.
3. Include reproduction steps if safe.
4. Include impact assessment.
5. Avoid sharing exploit details publicly.

---

# Security Review Required

Security review is required for changes involving:

- Authentication.
- Authorization.
- Tenant isolation.
- Secrets.
- Encryption.
- Key management.
- AI tool execution.
- External integrations.
- Webhooks.
- OAuth.
- Production access.
- Audit logs.
- Sensitive data handling.

## P7 AI Assistant Security Closure

P7 complete means the AI layer remains suggestion-only, review-only, and
evaluation-only. It uses backend AuthContext, workspace-scoped data access,
`requiresHumanApproval`, no real LLM provider, no AI SDK, no auto-send, no
automatic customer note write, no automatic task creation, no automatic
scheduler, no access token, no refresh token, no cookies, no raw provider
payload, no raw webhook payload, no raw DOM, and no raw HTML.

## P8 CRM Workflow Security Baseline

P8 CRM & Workflow Intelligence starts with policy only. CRM Mutation Policy and
Workflow Intelligence Policy require Backend AuthContext, workspace-scoped
authorization, human approval for risky actions, audit log coverage, no
autonomous CRM mutation, no auto-write customer note, no auto-create task, no
cross-workspace CRM mutation, no raw provider payload, no raw webhook payload,
no raw DOM, and no raw HTML. P9 Analytics / Reporting / KPI remains later work.
- Billing/entitlements.
- Admin/superadmin workflows.
- Data export/import.
- Analytics collection.
- Prompt/RAG behavior.

---

# Secure Documentation Rules

Documentation must not include:

- Real tokens.
- Real credentials.
- Real customer data.
- Unredacted PII.
- Production infrastructure secrets.
- Private internal URLs if sensitive.
- Sensitive screenshots.
- Raw customer transcripts.

---

# Future Implementation Rules

Production code must enforce:

```text
server-side authorization
tenant/workspace scoping
input validation
output encoding
CSRF/session protections where applicable
rate limiting for risky endpoints
safe webhook verification
audit logging for privileged actions
privacy-safe logging
secrets through environment/secret manager
```

---

# AI Safety Rules

AI must be treated as untrusted.

AI-related features require:

```text
human oversight for high-impact actions
prompt/RAG versioning
evaluation strategy
guardrails
privacy review
observability
fallback/rollback
kill switch for risky automation
```

---

# References

```text
docs/BOOK-06-Security-Governance-and-Compliance/
docs/BOOK-08-Implementation-Delivery-and-Production-Launch/
docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/PART-08-Continuous-Security-and-Compliance-Operations/
docs/security/README.md
```
