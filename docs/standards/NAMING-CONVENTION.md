# Athena Naming Convention

> *"Names are architecture. A clear name reduces confusion before documentation is even opened."*

---

## Document Information

| Field | Value |
|------|-------|
| Document | Athena Naming Convention |
| Version | 1.0.0 |
| Status | Official |
| Owner | Athena Core Team |
| Scope | Athena Engineering Library and Repository |
| Last Updated | 2026-07-06 |

---

# Purpose

This document defines naming conventions for the Athena Project.

Consistent naming helps Athena remain:

- Readable.
- Searchable.
- Maintainable.
- Reviewable.
- Scalable.
- AI-readable.
- Friendly to new contributors.

Naming is not cosmetic.

Names shape how engineers understand the system.

A poor name creates confusion.

A clear name communicates intent.

---

# Scope

This convention applies to:

- Repository folders.
- Markdown files.
- Book folders.
- Part folders.
- Chapter files.
- Standards files.
- Templates.
- Domain names.
- Service names.
- Module names.
- API resources.
- Events.
- Database concepts.
- Environment variables.
- Git branches.
- Pull requests.
- Commit messages.

Implementation-specific naming rules may be extended later in Book IV — Engineering Handbook.

---

# Core Principles

## 1. Clarity Over Brevity

Prefer clear names over short names.

## Good

```text
Customer-Support.md
Authentication-Service.md
```

## Avoid

```text
CS.md
AuthSvc.md
```

Short names are acceptable only for widely recognized terms such as API, HTTP, URL, ID, JWT, SDK, CLI, or AI.

---

## 2. Consistency Over Personal Preference

All contributors should follow the same naming style.

Do not introduce alternative names for the same concept.

## Good

```text
Organization
Workspace
User
Role
Permission
```

## Avoid Mixing

```text
Company
Tenant
Account
Client
Org
```

Use the official glossary when naming concepts.

---

## 3. Business Meaning Before Technical Detail

Names should reflect business meaning when naming domains, events, and capabilities.

## Good

```text
CustomerCreated
InvoicePaid
WorkflowCompleted
```

## Avoid

```text
DbRowInserted
PayloadReceived
HandlerExecuted
```

Business names are more stable than technical implementation names.

---

## 4. Predictable Names

A contributor should be able to guess where something belongs.

If one chapter uses numbered kebab-case, all similar chapters should use numbered kebab-case.

If one service uses `Service`, all platform services should follow the same naming convention.

---

# Repository Folder Naming

Use kebab-case for normal folders.

Use uppercase prefixes for official books and parts.

## Books

```text
BOOK-01-The-Foundation/
BOOK-02-Master-Blueprint/
BOOK-03-Architecture/
BOOK-04-Engineering-Handbook/
BOOK-05-AI-Bible/
BOOK-06-Operations/
BOOK-07-Product/
BOOK-08-Ecosystem/
```

## Parts

```text
PART-01-Platform-Vision/
PART-02-Organization-Layer/
PART-03-Business-Domains/
```

## Standard Folders

```text
docs/
standards/
templates/
metadata/
assets/
diagrams/
references/
appendices/
chapters/
```

## Avoid

```text
Book1/
book_1/
book one/
Part1/
platformVision/
docsNew/
```

---

# Markdown File Naming

Markdown files should use kebab-case.

Chapter files should begin with a numeric prefix.

## Chapter Files

```text
01-Executive-Overview.md
02-Athena-Big-Picture.md
03-Platform-Philosophy.md
```

## Supporting Files

Use uppercase names for conventional root-level documentation.

```text
README.md
SUMMARY.md
CHANGELOG.md
GLOSSARY.md
LICENSE.md
CONTRIBUTING.md
SECURITY.md
```

## Standards Files

```text
ADS.md
STYLE-GUIDE.md
NAMING-CONVENTION.md
DIAGRAM-STANDARD.md
REVIEW-CHECKLIST.md
SECURITY-DOCS-STANDARD.md
```

## Avoid

```text
chapter1.md
overview.md
executiveOverview.md
executive_overview.md
newfile.md
final-final.md
```

---

# Numbering Rules

Use two-digit numbers for chapter ordering.

## Good

```text
01-Preface.md
02-Why-Athena-Exists.md
10-Data-Philosophy.md
```

## Avoid

```text
1-Preface.md
2-Why-Athena-Exists.md
```

For books or large collections that may exceed 99 files, three-digit numbers may be used.

```text
001-Executive-Overview.md
120-Endgame.md
```

Book II currently uses chapter numbers from `01` to `120`.

---

# Book Naming

Use the official book names.

| Book | Folder | Title |
|-----|--------|-------|
| Book I | BOOK-01-The-Foundation | The Foundation |
| Book II | BOOK-02-Master-Blueprint | Master Blueprint |
| Book III | BOOK-03-Architecture | Architecture |
| Book IV | BOOK-04-Engineering-Handbook | Engineering Handbook |
| Book V | BOOK-05-AI-Bible | AI Bible |
| Book VI | BOOK-06-Operations | Operations |
| Book VII | BOOK-07-Product | Product |
| Book VIII | BOOK-08-Ecosystem | Ecosystem |

Do not rename official books without updating references, navigation, and changelogs.

---

# Part Naming

Use this format:

```text
PART-XX-Descriptive-Name/
```

## Example

```text
PART-01-Platform-Vision/
PART-02-Organization-Layer/
PART-04-AI-Platform/
```

Use singular or plural based on concept clarity.

Prefer:

```text
Organization-Layer
Business-Domains
Platform-Services
```

---

# Heading Naming

Use Title Case for headings.

## Good

```md
## Security Considerations

## Future Evolution

## Data Ownership
```

## Avoid

```md
## security considerations

## future evolution

## data ownership
```

Do not use vague headings:

```md
## Misc

## Other

## Stuff

## Things
```

---

# Domain Naming

Domain names should represent business capabilities.

Use singular nouns unless the domain naturally represents a collection.

## Preferred Domain Names

```text
Identity
Organization
Workspace
CRM
Customer
Lead
Sales
Marketing
Communication
Inbox
Customer Support
Knowledge
Document
Workflow
Automation
Task
Project
Calendar
Analytics
Finance
Billing
Inventory
HR
Custom Object
```

## Avoid

```text
UserStuff
CustomerModule
SalesThings
DataManager
BusinessLogic
```

---

# Service Naming

Platform services should use descriptive names followed by `Service` when used in architecture or implementation context.

## Examples

```text
Identity Service
Notification Service
Search Service
Audit Service
Event Bus
Queue Service
Scheduler Service
Config Service
Secrets Service
Storage Service
Cache Service
Reporting Service
Import Service
Export Service
```

Use `Service` for active platform capabilities.

Use specific nouns for infrastructure primitives:

```text
Event Bus
Message Queue
Object Storage
Vector Store
Search Index
```

---

# Module Naming

Modules should use business-friendly names.

## Good

```text
CRM Module
Knowledge Module
Automation Module
Billing Module
```

## Avoid

```text
CrmMgr
KnowledgeStuff
BillingSystemThing
```

---

# API Resource Naming

API resources should use lowercase kebab-case or plural nouns depending on API style.

For REST APIs, prefer plural resource names.

## REST Resource Examples

```text
/organizations
/workspaces
/users
/roles
/permissions
/customers
/leads
/workflows
/audit-logs
```

## Nested Resource Examples

```text
/organizations/{organizationId}/workspaces
/workspaces/{workspaceId}/users
/customers/{customerId}/conversations
```

Do not use verbs for resources.

## Avoid

```text
/createCustomer
/getUsers
/deleteWorkflow
```

Use HTTP methods for actions.

```text
POST /customers
GET /users
DELETE /workflows/{workflowId}
```

---

# API Field Naming

Use camelCase for JSON fields unless a specific external standard requires otherwise.

## Good

```json
{
  "organizationId": "org_123",
  "workspaceId": "wrk_123",
  "createdAt": "2026-07-06T00:00:00Z"
}
```

## Avoid

```json
{
  "organization_id": "org_123",
  "WorkspaceID": "wrk_123",
  "created_at": "2026-07-06T00:00:00Z"
}
```

If Athena later adopts a different API style, this must be documented in an ADR.

---

# Identifier Naming

Use stable prefixes for IDs.

## Recommended Prefixes

| Entity | Prefix | Example |
|------|--------|---------|
| Organization | org | org_01HABC |
| Workspace | wrk | wrk_01HABC |
| User | usr | usr_01HABC |
| Role | role | role_01HABC |
| Permission | perm | perm_01HABC |
| Customer | cus | cus_01HABC |
| Lead | lead | lead_01HABC |
| Workflow | wf | wf_01HABC |
| Event | evt | evt_01HABC |
| Audit Log | audit | audit_01HABC |
| Document | doc | doc_01HABC |
| File | file | file_01HABC |
| Agent | agent | agent_01HABC |
| Tool | tool | tool_01HABC |

IDs should be opaque.

Do not expose internal database IDs as public API identifiers.

---

# Event Naming

Events should describe business facts.

Use past-tense event names.

## Pattern

```text
DomainEntityActionPastTense
```

## Examples

```text
OrganizationCreated
WorkspaceCreated
UserInvited
CustomerCreated
LeadConverted
MessageReceived
TicketResolved
WorkflowStarted
WorkflowCompleted
InvoicePaid
AIRecommendationGenerated
DocumentIndexed
PermissionGranted
```

## Avoid

```text
CreateCustomer
DoWorkflow
MessageHandlerRan
DbUpdated
```

Events describe something that already happened.

Commands describe something requested.

---

# Command Naming

Commands should describe requested actions.

Use imperative or action-oriented names.

## Examples

```text
CreateCustomer
InviteUser
AssignRole
StartWorkflow
GenerateSummary
SendNotification
IndexDocument
```

Commands request work.

Events record completed facts.

---

# Database Naming

Database naming may vary by technology, but logical naming should remain consistent.

For relational databases, prefer snake_case.

## Table Examples

```text
organizations
workspaces
users
roles
permissions
customers
workflows
audit_logs
```

## Column Examples

```text
id
organization_id
workspace_id
created_at
updated_at
deleted_at
created_by
updated_by
```

Avoid ambiguous names:

```text
data
info
payload2
misc
stuff
```

Use `metadata` only for non-critical flexible data.

Do not hide core business fields inside metadata.

---

# Environment Variable Naming

Use uppercase snake_case.

Prefix Athena-specific variables with `ATHENA_`.

## Examples

```text
ATHENA_ENV
ATHENA_DATABASE_URL
ATHENA_REDIS_URL
ATHENA_JWT_SECRET
ATHENA_LOG_LEVEL
ATHENA_STORAGE_BUCKET
```

Secrets must not be committed to the repository.

Use `.env.example` for safe examples.

---

# Branch Naming

Use lowercase kebab-case.

## Patterns

```text
feature/<short-description>
fix/<short-description>
docs/<short-description>
chore/<short-description>
refactor/<short-description>
security/<short-description>
```

## Examples

```text
feature/customer-domain
fix/audit-log-navigation
docs/book-02-part-01
security/permission-checks
```

Avoid:

```text
mybranch
test
fixbug
new-feature
john-work
```

---

# Commit Message Naming

Use concise, descriptive commit messages.

Recommended format:

```text
type(scope): description
```

## Types

```text
docs
feat
fix
refactor
test
chore
security
build
ci
```

## Examples

```text
docs(book-02): add platform vision outline
feat(identity): add role assignment flow
fix(audit): correct audit log filtering
security(auth): enforce permission checks
```

Avoid:

```text
update
fix
wip
changes
final
```

---

# Pull Request Naming

Pull request titles should clearly describe the change.

## Examples

```text
docs(book-02): add Part I Platform Vision skeleton
feat(identity): implement workspace user invitation
security(api): add authorization checks for customer records
```

PR titles should be understandable from the changelog.

---

# Template Naming

Templates should use lowercase kebab-case and end with `-template.md`.

## Examples

```text
chapter-template.md
part-template.md
domain-template.md
service-template.md
ai-template.md
adr-template.md
api-template.md
runbook-template.md
```

---

# Diagram Naming

Diagrams should use kebab-case.

Use `.mmd` for Mermaid source files.

## Examples

```text
platform-big-map.mmd
data-knowledge-intelligence-flow.mmd
organization-layer-map.mmd
ai-context-engine-flow.mmd
security-trust-boundary.mmd
```

If exporting diagrams as images, keep the same base name.

```text
platform-big-map.mmd
platform-big-map.svg
```

---

# Asset Naming

Use kebab-case.

Include purpose in the name.

## Examples

```text
athena-logo.svg
book-02-cover.png
platform-overview-banner.svg
identity-domain-icon.svg
```

Avoid:

```text
image1.png
logo-final-final.png
new-diagram.png
```

---

# Reference Naming

References should include source type or topic.

## Examples

```text
domain-driven-design.md
zero-trust-architecture.md
owasp-api-security.md
event-driven-architecture.md
```

Do not store copyrighted books or proprietary material in the repository unless licensing allows it.

Use notes and citations instead.

---

# Acronym Rules

Use common acronyms only when widely understood or already defined.

Allowed common acronyms:

```text
AI
API
HTTP
HTTPS
URL
URI
JSON
YAML
SDK
CLI
SQL
JWT
OAuth
IAM
CRM
ERP
HR
CI
CD
SLA
SLO
```

Define less common acronyms on first use.

Example:

```text
Architecture Decision Record (ADR)
```

---

# Terms to Prefer

| Prefer | Avoid |
|------|------|
| Organization | Company, Client, Account |
| Workspace | Space, Environment |
| User | Member, Person |
| Role | User Type |
| Permission | Access Flag |
| Domain | Area, Group |
| Service | Manager, Helper |
| Event | Signal, Trigger |
| Audit Log | Activity History |
| Workflow | Process Flow |
| AI Agent | Bot |
| Context | Extra Data |
| Knowledge | Raw Information |
| Platform | App Collection |

---

# Anti-Patterns

Avoid names that are:

- Too generic.
- Too technical for business concepts.
- Too clever.
- Too abbreviated.
- Too dependent on implementation.
- Inconsistent with existing glossary.

## Bad Examples

```text
Manager
Processor
Handler
Helper
Thing
Stuff
Data
Info
Misc
Common
Utils
Core2
NewSystem
FinalVersion
```

These names usually hide unclear responsibilities.

If a name is hard to choose, the boundary may be unclear.

---

# Rename Policy

Renaming official documents, domains, services, or platform concepts requires care.

Before renaming:

- Check all references.
- Update navigation.
- Update glossary.
- Update changelog.
- Update diagrams.
- Update templates if affected.
- Consider whether an ADR is needed.

Renaming is not just cosmetic.

It can change how the system is understood.

---

# Review Checklist

Before accepting a name, ask:

- [ ] Is the name clear?
- [ ] Is it consistent with the glossary?
- [ ] Is it searchable?
- [ ] Is it free from unnecessary abbreviation?
- [ ] Does it reflect business meaning where appropriate?
- [ ] Does it avoid implementation leakage?
- [ ] Will future contributors understand it?
- [ ] Does it match folder and file conventions?
- [ ] Is it stable enough for long-term use?

---

# Final Rule

A good name should make the system easier to understand before the reader opens the file.

If a name requires explanation every time it appears, choose a better name.

---

# Navigation

**Related Standards:**

- `ADS.md`
- `STYLE-GUIDE.md`
- `DIAGRAM-STANDARD.md`
- `REVIEW-CHECKLIST.md`
