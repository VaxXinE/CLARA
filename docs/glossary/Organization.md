# Organization

> *"An organization is the highest business boundary within Clara."*

---

## Document Information

| Field | Value |
|---|---|
| Term | Organization |
| Category | Business / Platform |
| Status | Official |
| Owner | Clara Core Team |
| Last Updated | 2026-07-06 |

---

# Definition

An **Organization** is the highest-level business entity using Clara.

It represents a company, institution, team, agency, community, or operational entity that owns users, workspaces, data, workflows, configuration, billing, integrations, and governance policies within Clara.

---

# Purpose

The Organization exists to provide a clear boundary for:

- Ownership.
- Identity.
- Billing.
- Governance.
- Security.
- Data isolation.
- Workspace management.
- User management.
- Integration management.
- Platform configuration.

Most Clara resources should be traceable to an Organization either directly or indirectly.

---

# Usage in Clara

An Organization may contain:

- Workspaces.
- Users.
- Roles.
- Permissions.
- Teams.
- Departments.
- Customers.
- Conversations.
- Workflows.
- Knowledge.
- Integrations.
- Audit logs.
- Billing settings.
- Security policies.

---

# Relationship to Workspace

An Organization may contain one or more Workspaces.

A **Workspace** is an operational environment inside an Organization.

Example:

```text
Organization
└── Workspace
    ├── Users
    ├── Customers
    ├── Workflows
    └── Knowledge
```

In small deployments, an Organization may have only one Workspace.

In larger deployments, an Organization may separate Workspaces by department, branch, region, product line, or business unit.

---

# Relationship to Tenant

In many SaaS systems, an Organization may map closely to a **Tenant**.

However, Clara treats these terms carefully:

- **Organization** is a business concept.
- **Tenant** is a technical isolation concept.

A single Organization may map to one Tenant, but this should be decided by architecture and deployment strategy.

Do not use `Tenant` as a business-facing replacement for `Organization`.

---

# Security Considerations

Organization boundaries are security-sensitive.

Every request involving Organization-owned data must enforce:

- Authentication.
- Authorization.
- Tenant or workspace isolation.
- Auditability.
- Least privilege.

Client-provided organization identifiers must never be trusted without server-side authorization checks.

---

# Data Ownership

The Organization owns its business data.

Clara acts as the custodian of that data.

Organization-owned data may include:

- Customer records.
- Conversations.
- Documents.
- Workflows.
- Knowledge.
- Analytics.
- Integration settings.
- Audit history.

---

# Common Examples

Examples of Organizations:

- A startup using Clara as its CRM and support platform.
- A school managing admissions and student communication.
- A clinic managing patient-facing workflows.
- A logistics company managing customer support and operations.
- A government agency using Clara for internal service workflows.

---

# Related Terms

- Workspace
- Tenant
- User
- Role
- Permission
- Department
- Team
- Billing
- Audit Log
- Governance

---

# Preferred Usage

Use:

```text
Organization
```

Avoid using these as direct replacements:

```text
Company
Account
Client
Tenant
Customer
```

These terms may exist in specific domains, but they should not replace `Organization` in official platform documentation.

---

# References

- Book I — The Foundation
- Book II — Master Blueprint
- docs/standards/GLOSSARY-STANDARD.md
- docs/standards/NAMING-CONVENTION.md
