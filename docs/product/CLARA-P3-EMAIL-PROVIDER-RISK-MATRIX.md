---
project: "CLARA"
artifact: "P3 Email Provider Risk Matrix"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-10"
classification: "risk-matrix"
related_documents:
  - "./CLARA-P3-EMAIL-PROVIDER-INTEGRATION-DECISION.md"
  - "./CLARA-P3-EMAIL-CHANNEL-ADAPTER-SPEC.md"
  - "../../services/api/README.md"
---

# CLARA P3 Email Provider Risk Matrix

## Purpose

Matriks ini membantu membandingkan risiko dan trade-off opsi provider email nyata pertama untuk CLARA.

Skala penilaian:

```text
Low
Medium
High
```

## Risk Matrix

| Path                       | Inbound Support | Outbound Support | Security Risk | Operational Complexity | Vendor Coupling | Fit For CLARA Inbox MVP+ | Notes                                                                |
| -------------------------- | --------------- | ---------------- | ------------- | ---------------------- | --------------- | ------------------------ | -------------------------------------------------------------------- |
| Gmail API                  | Strong          | Strong           | Medium        | Medium                 | Medium          | High                     | Best first path for Google Workspace users and thread-aware workflow |
| IMAP + SMTP                | Strong          | Strong           | High          | High                   | Low-Medium      | Medium                   | Portable but harder to secure and operate well                       |
| SMTP-only                  | None            | Strong           | Medium        | Low-Medium             | Low             | Low                      | Outbound-only, not enough for inbox workflow                         |
| Transactional Provider API | Weak or None    | Strong           | Medium        | Medium                 | High            | Medium-Low               | Better as later outbound-focused enhancement                         |

## Security Risk Notes

### Gmail API

Key risks:

```text
OAuth token handling
scope overreach
refresh token storage
provider outage or quota behavior
```

Mitigation direction:

```text
encrypted token storage
least-privilege scopes
revoke path
provider error sanitization
```

### IMAP + SMTP

Key risks:

```text
credential-style mailbox access
broader secret exposure risk
inconsistent provider behavior
weaker thread identity consistency
```

Mitigation direction:

```text
avoid as first choice unless business need is strong
use only after stronger secret lifecycle and worker controls exist
```

### SMTP-only

Key risks:

```text
does not solve inbound trust chain
temptation to bolt it into product send path too early
```

Mitigation direction:

```text
reserve for later outbound-only use cases
keep human explicit send and delivery audit rules
```

### Transactional Provider API

Key risks:

```text
vendor-specific data model
outbound analytics/webhook coupling
possible mismatch with operator inbox workflow
```

Mitigation direction:

```text
keep adapter boundary strict
use allowlisted metadata only
defer until inbound path is stable
```

## Recommendation

Recommended choice:

```text
Gmail API first
IMAP + SMTP later if non-Google mailbox support becomes a real requirement
transactional provider API later as outbound-only enhancement
SMTP-only not as the first CLARA inbox integration path
```
