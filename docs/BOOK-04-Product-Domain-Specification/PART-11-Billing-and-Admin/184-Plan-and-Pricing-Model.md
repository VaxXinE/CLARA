---
book: "Book IV — Product & Domain Specification"
part: "PART-11 — Billing and Admin"
chapter: "184"
title: "Plan and Pricing Model"
version: "1.0.0"
status: "official"
owner: "CLARA Product Architecture Team"
last_updated: "2026-07-07"
classification: "product-domain-specification"
previous: "183-Billing-Account-Model.md"
next: "185-Subscription-Lifecycle.md"
---

# Plan and Pricing Model

> *"Defines product plan structure, pricing tiers, and how plan capabilities are represented."*

---

# Purpose

Defines product plan structure, pricing tiers, and how plan capabilities are represented.

---

# User / Product Problem

Hard-coded plan behavior becomes difficult to change and can cause inconsistent feature access.

---

# Product Decision

## Decision

CLARA Plan Model should define product tiers through explicit entitlements instead of hard-coded feature checks.

## Status

Accepted.

## Reason

- Gives organization owners and admins safe control over CLARA.
- Keeps plan access and feature availability consistent.
- Prevents billing and entitlement logic from being scattered.
- Protects sensitive admin and billing operations.
- Creates a foundation for enterprise governance.
- Makes product limits and administrative behavior auditable.

## Product Trade-offs

| Direction | Benefit | Trade-off |
|---|---|---|
| Admin console first | Better governance | More upfront product structure |
| Entitlements over hard-coded checks | Flexible plans | Requires access decision discipline |
| Usage counters early | Future billing ready | More data tracking |
| Payment automation later | Faster MVP | Manual billing may be needed early |
| Strong admin audit | Better accountability | More event design |

---

# Primary Users / Actors

- Organization Owner
- Billing Admin
- Product Team
- Engineering Team

---

# Domain Objects

- Plan
- Tier
- Pricing
- Feature Set
- Plan Code
- Plan Status

---

# Permission Baseline

| Permission | Meaning | Enforcement |
|---|---|---|
| `plan:read` | Product action permission | Protected by backend authorization |
| `billing:read` | Product action permission | Protected by backend authorization |

---

# Product Flow

```mermaid
flowchart TD
    Owner[Owner / Admin] --> AdminConsole[Admin Console]
    AdminConsole --> Permission[Permission Check]
    Permission --> Settings[Settings / Billing / Entitlements]
    Settings --> Decision[Apply Change]
    Decision --> Audit[Audit Event]
    Settings --> Usage[Usage / Limits]
    Settings --> FeatureAccess[Feature Access]
    FeatureAccess --> ProductModules[CLARA Product Modules]
```

---

# Admin Action Sequence

```mermaid
sequenceDiagram
    participant Admin as Owner / Admin
    participant UI as CLARA Admin UI
    participant API as CLARA API
    participant Auth as Authorization
    participant Domain as Admin/Billing Domain
    participant Audit as Audit Log

    Admin->>UI: Opens admin or billing setting
    UI->>API: Sends scoped admin request
    API->>Auth: Check identity, role, permission, organization scope
    Auth-->>API: Allow or deny
    API->>Domain: Execute admin/billing behavior
    Domain->>Audit: Record sensitive change
    API-->>UI: Return safe result
```

---

# MVP Behavior

MVP may use simple internal plans such as free, starter, pro, and enterprise without payment automation.

---

# Future Behavior

Future versions may support public pricing, trial plans, custom enterprise plans, coupons, and region-based pricing.

---

# Product Requirements

## Functional Requirements

- Admin capabilities must belong to an Organization.
- Sensitive admin actions must require explicit permission.
- Billing actions must require billing-specific permission.
- Plan and subscription state must be readable by authorized roles.
- Entitlement checks must be available to backend modules.
- Usage counters must be consistently named and scoped.
- Admin settings must be auditable when sensitive.
- AI and integration controls must be admin-governed.
- UI must clearly separate organization, workspace, billing, security, AI, and integration settings.

## Non-Functional Requirements

- Admin pages must not expose sensitive data to unauthorized roles.
- Billing records must be treated as sensitive business data.
- Entitlement checks must be deterministic and testable.
- Usage counters must avoid double-counting where possible.
- Admin action errors must be safe and understandable.
- Billing provider references must not expose secrets.
- Feature flags must fail safely.
- Audit logs must avoid unnecessary sensitive payloads.

---

# UX Expectations

- Owners and admins should understand what each admin section controls.
- Billing status should be easy to understand.
- Plan limits should be visible where relevant.
- Dangerous changes should require confirmation.
- Feature availability should explain whether access is blocked by role, plan, or configuration.
- Admin errors should not leak sensitive system details.
- AI and integration controls should clearly show impact before disabling.
- Usage warnings should be actionable.

---

# Security and Privacy Considerations

- Do not rely on Admin Console UI for final authorization.
- Do not expose billing data to non-billing roles.
- Do not allow entitlement override without audit.
- Do not store payment provider secrets in normal config.
- Do not expose full credential values in admin UI.
- Audit plan changes, billing updates, entitlement overrides, security setting changes, AI toggles, and integration changes.
- Require strong permissions for destructive or high-impact admin actions.
- Keep feature flags and plan checks server-enforced.

---

# Acceptance Criteria

- [ ] Admin scope is defined.
- [ ] Billing scope is defined.
- [ ] Plan behavior is defined.
- [ ] Entitlement behavior is defined.
- [ ] Usage limit behavior is defined.
- [ ] Primary users are defined.
- [ ] Permissions are named.
- [ ] Audit behavior is considered.
- [ ] MVP behavior is clear.
- [ ] Future behavior is separated from MVP.

---

# Anti-patterns

Avoid:

- Hard-coding plan logic throughout product modules.
- Letting Admin UI visibility act as authorization.
- Exposing billing information to every admin role by default.
- Storing payment or credential secrets in plain configuration.
- Allowing entitlement overrides without audit.
- Mixing organization settings and workspace settings.
- Adding payment complexity before product-market validation if not needed.
- Ignoring usage counters until pricing launch.

---

# Related Book III References

- ../../BOOK-03-Implementation-Architecture/PART-04-Data-Architecture/README.md
- ../../BOOK-03-Implementation-Architecture/PART-07-Security-Implementation/README.md
- ../../BOOK-03-Implementation-Architecture/PART-10-Operations-Architecture/README.md
- ../../BOOK-03-Implementation-Architecture/PART-11-Product-Implementation-Architecture/218-Billing-Admin-Module.md
- ../../BOOK-03-Implementation-Architecture/APPENDIX/APPENDIX-C-Security-Checklist.md

---

# Navigation

**Previous:** `183-Billing-Account-Model.md`

**Next:** `185-Subscription-Lifecycle.md`
