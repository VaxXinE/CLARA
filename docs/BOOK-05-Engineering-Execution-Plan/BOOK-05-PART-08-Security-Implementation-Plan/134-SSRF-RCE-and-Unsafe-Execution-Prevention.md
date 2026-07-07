---
book: "Book V — Engineering Execution Plan"
part: "PART-08 — Security Implementation Plan"
chapter: "134"
title: "SSRF RCE and Unsafe Execution Prevention"
version: "1.0.0"
status: "official"
owner: "CLARA Security Engineering Team"
last_updated: "2026-07-07"
classification: "engineering-execution-plan"
previous: "133-Injection-Prevention.md"
next: "135-Secret-Management-and-Secure-Configuration.md"
project: "CLARA"
---

# SSRF RCE and Unsafe Execution Prevention

> *"Defines implementation plan for preventing SSRF, unsafe URL fetching, remote code execution, unsafe file parsing, and unsafe workflow/integration execution."*

---

# Purpose

Defines implementation plan for preventing SSRF, unsafe URL fetching, remote code execution, unsafe file parsing, and unsafe workflow/integration execution.

---

# Security Problem

SSRF and RCE vulnerabilities can expose internal networks, metadata services, secrets, and infrastructure.

---

# Security Decision

## Decision

CLARA should treat URLs, webhooks, file uploads, integration callbacks, and workflow actions as potentially dangerous until validated and restricted.

## Status

Accepted.

---

# Security Implementation Rule

Every security-sensitive feature must be designed as:

```text
Threat -> Control -> Implementation -> Test -> Audit/Monitoring -> Release Gate
```

Security controls must exist in code, tests, review, and operations.

A checklist without enforcement is not enough.

---

# Recommended Security Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as Frontend
    participant API as Backend API
    participant Auth as AuthN/AuthZ
    participant Scope as Tenant/Workspace Scope
    participant Service as Domain Service
    participant Audit as Audit/Security Events
    participant Logs as Secure Logs

    User->>UI: Performs protected action
    UI->>API: Sends request
    API->>Auth: Authenticate and authorize
    Auth->>Scope: Verify organization/workspace/resource scope
    Scope-->>API: Allow or deny
    API->>Service: Validate input and execute domain logic
    Service->>Audit: Emit sensitive/security event if required
    API->>Logs: Write safe structured log
    API-->>UI: Return safe response or safe error
```

---

# Secure-by-Design Checklist

- [ ] Threat is identified.
- [ ] Asset being protected is clear.
- [ ] Actor and attacker model are clear.
- [ ] Backend authorization exists where needed.
- [ ] Organization/workspace scope is enforced.
- [ ] Input validation exists.
- [ ] Output safety is considered.
- [ ] Secrets are protected.
- [ ] Logs are redacted.
- [ ] Audit/security event is defined where relevant.
- [ ] Tests cover abuse/unauthorized cases.
- [ ] Release gate is defined.

---

# Acceptance Criteria

- [ ] Security control is actionable.
- [ ] Implementation guidance is clear.
- [ ] Testing expectations are included.
- [ ] Audit/monitoring expectations are included.
- [ ] MVP and future concerns are separated.
- [ ] AI and integration risks are considered where relevant.
- [ ] AI coding assistants can follow this safely.

---

# Anti-patterns

Avoid:

- Treating frontend checks as authorization.
- Adding security only after feature completion.
- Logging raw secrets, tokens, prompts, or provider payloads.
- Trusting external provider payloads.
- Building AI context without permission checks.
- Returning raw database errors to users.
- Using real customer data in development.
- Committing `.env` files or credentials.
- Shipping high-risk changes without security review.
- Creating tests only for happy paths.

---

# Related Documents

- ../PART-03-Backend-Implementation-Plan/README.md
- ../PART-05-Database-and-Migration-Plan/README.md
- ../PART-06-AI-Implementation-Plan/README.md
- ../PART-07-Integration-Implementation-Plan/README.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-PERMISSION-MAP.md
- ../../BOOK-04-Product-Domain-Specification/BOOK-04-Master-Index/BOOK-04-AI-GOVERNANCE-MAP.md

---

# Navigation

**Previous:** `133-Injection-Prevention.md`

**Next:** `135-Secret-Management-and-Secure-Configuration.md`

---

# SSRF Controls

Validate outbound URLs for:

```text
scheme allowlist: https/http only where needed
block localhost
block private IP ranges
block metadata service IPs
block file:// and internal protocols
DNS rebinding protections where practical
timeout and size limits
```

---

# RCE Controls

Avoid:

```text
eval
dynamic code execution
shell execution with user input
unsafe deserialization
running uploaded files
executing workflow scripts in MVP
```

---

# File Parsing Rule

Treat all imported files and attachments as untrusted.
