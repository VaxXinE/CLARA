---
project: "CLARA"
artifact: "MVP First Product Slice Demo Script"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Product, Engineering, Security, QA, AI, and Product Operations Team"
last_updated: "2026-07-08"
classification: "demo-script"
repository: "https://github.com/VaxXinE/CLARA"
based_on:
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-PRD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TDD/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-UX-UI-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-API-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-DATABASE-MIGRATION-SPEC/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-SECURITY-PRIVACY-CHECKLIST/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-TEST-PLAN/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-BACKLOG-TASK-BREAKDOWN/"
  - "docs/product/CLARA-MVP-FIRST-PRODUCT-SLICE-README-RUNBOOK/"
source_of_truth:
  - "README.md"
  - "AGENTS.md"
  - "SECURITY.md"
  - "docs/CLARA-MASTER-DOCUMENTATION-INDEX/"
  - "docs/BOOK-08-Implementation-Delivery-and-Production-Launch/"
  - "docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/"
---


# 05 — Step-by-Step Demo Flow

> *"A demo should move in a clean sequence: problem, workflow, trust, result."*

---

# Step 0 — Opening

Say:

```text
Today I’ll show the first CLARA MVP slice: a unified customer conversation workspace with customer context, AI-assisted reply draft, human review, and activity traceability.
```

---

# Step 1 — Open CLARA as Agent

Action:

```text
Open `http://127.0.0.1:5173` and select Agent Demo in the local role switcher.
```

Say:

```text
We are starting as an Agent, a support/sales operator who can view conversations, generate AI drafts, and send replies.
```

---

# Step 2 — Show Conversation Inbox

Action:

```text
Show left panel conversation inbox.
```

Point out:

```text
customer names
latest message snippet
source/channel
status
timestamp
```

Say:

```text
The inbox is the operator's work queue. For MVP, we keep it focused instead of trying to build every omnichannel feature on day one.
```

---

# Step 3 — Select Budi Conversation

Action:

```text
Click Budi conversation.
```

Point out:

```text
message history in center panel
customer profile in right panel
reply composer
```

Say:

```text
When we select a conversation, CLARA keeps the thread and customer context visible together. That reduces context switching.
```

---

# Step 4 — Generate AI Draft

Action:

```text
Click Generate AI Draft.
```

Say:

```text
AI drafts a suggested reply, but it is clearly marked as a draft. It is not sent automatically.
```

---

# Step 5 — Edit Draft

Action:

```text
Edit one sentence in the composer.
```

Say:

```text
This is the key trust boundary: AI assists, but the human remains responsible for the final message.
```

---

# Step 6 — Send Simulated Reply

Action:

```text
Click Send Reply.
```

Say:

```text
For MVP, this uses a simulated send adapter. That lets us validate the workflow before adding real provider complexity.
```

---

# Step 7 — Show Activity Timeline

Action:

```text
Show right panel activity timeline.
```

Say:

```text
Activity gives the team traceability. We can see that an AI draft was generated and a reply was sent by the user.
```

---

# Step 8 — Switch to Viewer

Action:

```text
Switch demo user to Viewer Demo using the dashboard role switcher.
```

Say:

```text
Viewer can observe, but cannot generate drafts or send replies. The backend also blocks direct API attempts, so this is not just a UI rule.
```

---

# Step 9 — Closing Summary

Say:

```text
This first slice proves the core CLARA loop: conversation, customer context, AI-assisted draft, human review, manual send, and traceable activity with role-based safety.
```

What not to claim in the demo:

```text
do not imply real provider delivery exists
do not imply production authentication exists
do not imply AI can send autonomously
```
