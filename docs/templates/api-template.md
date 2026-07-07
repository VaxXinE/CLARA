# Clara API Specification Template

> Use this template for every public, internal, or partner API exposed by Clara.

```yaml
---
title: "<API Name>"
version: "0.1.0"
status: "draft"
owner: "<Team>"
classification: "api"
last_updated: "YYYY-MM-DD"
---
```

# <API Name>

## Document Information

| Field | Value |
|---|---|
| API | <API Name> |
| Version | 0.1.0 |
| Status | Draft |
| Owner | <Team> |

---

# Purpose

Describe the API capability and the business problem it solves.

---

# Consumers

- Web Application
- Mobile Application
- Internal Services
- External Integrations

---

# Authentication

- Authentication method
- Token format
- Session behavior

---

# Authorization

Required roles and permissions.

| Endpoint | Permission |
|---|---|
| | |

---

# Base URL

```text
https://api.example.com/v1
```

---

# API Conventions

- JSON encoding
- UTF-8
- ISO-8601 timestamps
- Idempotency where applicable
- Pagination strategy

---

# Endpoints

## Example Endpoint

### Request

```http
GET /resource/{id}
```

### Headers

| Header | Required |
|---|---|
| Authorization | Yes |

### Path Parameters

| Name | Type | Description |
|---|---|---|
| id | UUID | Resource identifier |

### Query Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| | | | |

### Request Body

```json
{}
```

### Success Response

```json
{}
```

### Error Responses

| Status | Meaning |
|---|---|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|429|Rate Limited|
|500|Internal Error|

---

# Validation Rules

- Required fields
- Length limits
- Allowed values

---

# Rate Limiting

Document limits and retry guidance.

---

# Events

Published:

- Event A

Consumed:

- Event B

---

# Security Considerations

- Authentication
- Authorization
- Input validation
- Output encoding
- Secrets
- Audit logging

---

# Observability

- Logs
- Metrics
- Traces
- Audit events

---

# Versioning Strategy

Explain URI/header versioning and compatibility policy.

---

# Testing

- Unit
- Integration
- Contract
- Security
- Performance

---

# Changelog

## 0.1.0

### Added

- Initial API template.

---

# Related Documents

- PRD
- TDD
- Architecture
- ADR
- Runbook

---

# Navigation

Previous:

Next:
