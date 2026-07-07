---
project: "CLARA"
artifact: "MVP First Product Slice UX Flow + UI Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Product Design, Product, Engineering, Security, and AI Team"
last_updated: "2026-07-07"
classification: "ux-flow-ui-specification"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
source_of_truth:
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-02-Master-Blueprint/"
  - "docs/BOOK-04-Product-Domain-Specification/"
  - "docs/BOOK-06-Security-Governance-and-Compliance/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 05 — Component Specification

> *"Components should encode product safety rules, not just visual layout."*

---

# Component List

```text
AppShell
TopBar
ConversationInbox
ConversationFilters
ConversationRow
ConversationThread
MessageBubble
CustomerProfileCard
ActivityTimeline
ReplyComposer
AIDraftButton
SendReplyButton
PermissionNotice
EmptyState
LoadingState
ErrorBanner
```

---

# AppShell

Responsible for:

```text
layout
authenticated app frame
three-panel structure
responsive container
```

Props/inputs:

```text
currentUser
workspace
children
```

---

# TopBar

Shows:

```text
CLARA name/logo
workspace name
environment badge if demo/dev
current user
```

Security note:

```text
do not expose secret environment values
```

---

# ConversationInbox

Responsible for:

```text
display conversation list
show loading/empty states
handle selected conversation
```

States:

```text
loading
empty
loaded
error
```

---

# ConversationFilters

Filters:

```text
status: open/pending/closed
search
assigned_to optional P1
```

---

# ConversationRow

Displays:

```text
customer display name
latest message snippet
source/channel
status
updated time
unread indicator optional
```

Interaction:

```text
click selects conversation
keyboard enter selects conversation
```

---

# ConversationThread

Displays:

```text
conversation header
messages
message timestamps
reply composer
```

---

# MessageBubble

Displays:

```text
direction
sender
body
timestamp
delivery status if available
```

Security:

```text
render user-generated content safely
no raw HTML injection
```

---

# CustomerProfileCard

Displays:

```text
customer name
contact identifier
channel/source
status
last interaction
notes summary
tags optional
```

Privacy:

```text
only display fields authorized for current user
```

---

# ActivityTimeline

Displays:

```text
AI draft generated
reply sent
reply failed
status changed
```

---

# ReplyComposer

Responsible for:

```text
manual text entry
AI draft insertion
edit state
send state
error display
```

Must support:

```text
manual reply without AI
AI draft as editable text
preserve draft on send failure
```

---

# AIDraftButton

States:

```text
available
loading
disabled_by_permission
disabled_no_conversation
failed_retry_available
```

Text:

```text
Generate AI Draft
Generating...
Try AI Again
```

---

# SendReplyButton

States:

```text
enabled when text exists and permission allows
disabled when no text
loading when sending
hidden/disabled for viewer
```

Text:

```text
Send Reply
Sending...
```

---

# PermissionNotice

Used when:

```text
viewer cannot reply
user lacks AI permission
conversation inaccessible
```

---

# ErrorBanner

Should show safe copy:

```text
Something went wrong. Try again.
AI draft is unavailable right now. You can still write manually.
You do not have permission to perform this action.
```

Must not show:

```text
stack traces
SQL errors
provider raw errors
tokens
```

---

# Component Rule

```text
UI components may hide unavailable actions, but backend authorization remains mandatory.
```
