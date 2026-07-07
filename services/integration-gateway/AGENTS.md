# services/integration-gateway/AGENTS.md

Instructions for integration gateway work.

---

## Rules

- Do not add real provider credentials to repo.
- Do not hard-code tokens.
- Use environment variables or secret manager for future secrets.
- Do not mix provider payloads directly into product domain.
- Normalize provider events before entering core services.
- Preserve tenant/workspace boundaries.
- Simulated send is acceptable for MVP.
