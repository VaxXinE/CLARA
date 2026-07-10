---
project: "CLARA"
artifact: "P3 Email Channel Adapter Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-09"
classification: "product-spec"
related_documents:
  - "../../services/api/README.md"
  - "./CLARA-MVP-GAP-REVIEW.md"
  - "./CLARA-P2-DEPLOYMENT-CONFIG-RUNBOOK.md"
  - "./CLARA-P2-STAGING-SMOKE-RUNBOOK.md"
  - "./CLARA-P2-RELEASE-CHECKLIST.md"
  - "./CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/"
  - "./CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/"
---

# CLARA P3 Email Channel Adapter Skeleton

## Purpose

This document defines the first backend-only email channel foundation for CLARA.

The goal in this PR is not real email delivery or real provider connectivity. The goal is to establish a safe normalization boundary so future Gmail, IMAP, or provider-specific adapters can plug into CLARA without bypassing security and tenant controls.

## Current Scope

This skeleton includes:

```text
email channel type definitions
adapter interface for inbound email normalization
simulated adapter for local/dev/test
service layer that converts normalized inbound email into CLARA internal message shape
inbound persistence foundation for customer/conversation/message/activity storage
outbound email reply adapter skeleton for simulated local/dev/test send
offline deterministic unit tests
environment config baseline through EMAIL_CHANNEL_MODE
```

This skeleton does not include:

```text
Gmail API integration
IMAP integration
SMTP send
OAuth flow
public webhook endpoint
attachment download
raw HTML rendering
queue or worker processing
workspace auto-assignment from provider payload
```

## Security Rules

Always enforce:

```text
do not commit email credentials, OAuth secrets, refresh tokens, SMTP passwords, or IMAP passwords
do not log full raw email content
do not log email auth headers or provider tokens
treat inbound email content as untrusted user input
do not render raw HTML from inbound email without future sanitization review
do not process or download attachments in this skeleton
do not trust organization_id, workspace_id, or role from email payload fields
backend remains the source of truth for auth, RBAC, and workspace scope
```

## Normalized Inbound Email Shape

Current normalized email object:

```text
provider_message_id
thread_id
from_email
from_name
to_email
subject
text_body
html_body_present
received_at
headers allowlist only
attachments_present
```

Header allowlist:

```text
message-id
in-reply-to
references
reply-to
```

## CLARA Internal Message Shape

After normalization, the service layer converts email into a CLARA internal channel message:

```text
channel=email
provider
external_message_id
external_thread_id
customer_identifier
customer_display_name
destination_identifier
subject
body_text
html_body_present
attachments_present
received_at
metadata.headers allowlist only
```

This keeps the adapter boundary explicit:

```text
provider payload -> normalized inbound email -> CLARA internal message
```

## Environment Baseline

Current env baseline:

```dotenv
EMAIL_CHANNEL_MODE=disabled
```

Supported values:

```text
disabled
simulated
```

Meaning:

```text
disabled  -> no email skeleton path is active by default
simulated -> local/dev/test simulated normalization path only
```

## Future Provider Plug-In Direction

Future adapters should plug in behind the same interface:

```text
Gmail API adapter
IMAP adapter
other provider-specific adapters
Gmail API or SMTP reply send adapters
```

Expected future flow:

```text
provider trust verified
provider-specific payload parsed
allowlisted metadata extracted
content normalized into CLARA email shape
trusted backend logic decides organization/workspace/customer routing
business processing continues only after tenant-safe resolution
```

## Testing Baseline

Current tests must stay offline and deterministic:

```text
normalization test
adapter/service conversion test
header allowlist test
invalid email negative test
raw HTML omission test
```

## Known Limitations

Current limitations:

```text
no real provider connectivity
no attachment handling
no HTML sanitization/rendering pipeline because raw HTML is not exposed
no inbound conversation creation flow yet
customer reuse and conversation persistence now exist only after trusted scope is provided server-side
no automatic customer/workspace matching from provider mailbox configuration yet
```
