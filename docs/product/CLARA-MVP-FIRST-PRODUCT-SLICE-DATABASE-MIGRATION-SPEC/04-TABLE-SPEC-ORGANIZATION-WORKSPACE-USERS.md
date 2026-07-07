---
project: "CLARA"
artifact: "MVP First Product Slice Database Migration Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Backend, Data, Security, Product, and Product Operations Team"
last_updated: "2026-07-07"
classification: "database-migration-specification"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
source_of_truth:
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-04-Product-Domain-Specification/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-07-Operations-Observability-and-Reliability/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 04 — Table Spec: Organization, Workspace, Users

> *"Identity and workspace tables create the boundary for every later permission check."*

---

# Purpose

This document defines identity and workspace-related tables.

---

# Table: organizations

## Purpose

Stores top-level tenant organization.

## Columns

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | text/uuid | Yes | Primary key |
| `name` | text | Yes | Organization name |
| `status` | text | Yes | Default `active` |
| `created_at` | timestamptz | Yes | Default now |
| `updated_at` | timestamptz | Yes | Updated on change |

## Constraints

```text
primary key id
status in active, suspended, archived
name not empty
```

---

# Table: workspaces

## Purpose

Stores workspace inside organization.

## Columns

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | text/uuid | Yes | Primary key |
| `organization_id` | text/uuid | Yes | FK organizations.id |
| `name` | text | Yes | Workspace name |
| `status` | text | Yes | Default `active` |
| `created_at` | timestamptz | Yes | Default now |
| `updated_at` | timestamptz | Yes | Updated on change |

## Constraints

```text
primary key id
foreign key organization_id
status in active, archived
unique organization_id + name
```

---

# Table: users

## Purpose

Stores user identity profile.

Authentication provider details may be stored separately in future.

## Columns

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | text/uuid | Yes | Primary key |
| `organization_id` | text/uuid | Yes | FK organizations.id |
| `email` | text | Yes | Normalized lower-case |
| `display_name` | text | Yes | Human-readable name |
| `status` | text | Yes | Default `active` |
| `created_at` | timestamptz | Yes | Default now |
| `updated_at` | timestamptz | Yes | Updated on change |

## Constraints

```text
primary key id
foreign key organization_id
unique organization_id + email
status in active, disabled
```

## Security Notes

Do not store:

```text
password plaintext
session token
API token
OAuth access token
```

---

# Table: workspace_memberships

## Purpose

Maps users to workspaces and roles.

## Columns

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | text/uuid | Yes | Primary key |
| `organization_id` | text/uuid | Yes | FK organizations.id |
| `workspace_id` | text/uuid | Yes | FK workspaces.id |
| `user_id` | text/uuid | Yes | FK users.id |
| `role` | text | Yes | owner, agent, viewer |
| `created_at` | timestamptz | Yes | Default now |
| `updated_at` | timestamptz | Yes | Updated on change |

## Constraints

```text
primary key id
foreign key organization_id
foreign key workspace_id
foreign key user_id
unique workspace_id + user_id
role in owner, agent, viewer
```

---

# Indexes

```text
idx_workspaces_organization_id
idx_users_organization_email
idx_memberships_workspace_user
idx_memberships_user_workspace
idx_memberships_role
```

---

# Acceptance Criteria

- [ ] Organization can own workspaces.
- [ ] User belongs to organization.
- [ ] User role is workspace-specific.
- [ ] Owner/Agent/Viewer roles are supported.
- [ ] Secrets are not stored.
