# Security Policy

> "Athena must be secure by design, secure by default, and secure in operation."

---

# Supported Scope

This repository currently contains Athena documentation and will later contain implementation code.

Security policy applies to:

- Documentation.
- Examples.
- Templates.
- Architecture decisions.
- Future source code.
- CI/CD configuration.
- Infrastructure configuration.
- AI prompts and tool definitions.

---

# Do Not Commit

Never commit:

- API keys.
- Passwords.
- OAuth tokens.
- Private keys.
- Production credentials.
- Customer data.
- Internal secrets.
- Sensitive screenshots.
- `.env` files with real values.

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

---

# Documentation Security

Documentation must not include:

- Real tokens.
- Real credentials.
- Real customer data.
- Unredacted PII.
- Production infrastructure secrets.
- Private internal URLs if sensitive.

Use placeholders:

```text
example-token
example-api-key
example.com
customer@example.test
```

---

# References

```text
docs/BOOK-03-Implementation-Architecture/PART-07-Security-Implementation/
docs/BOOK-03-Implementation-Architecture/APPENDIX/APPENDIX-C-Security-Checklist.md
docs/security/README.md
```
