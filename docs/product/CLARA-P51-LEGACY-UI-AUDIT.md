---
project: "CLARA"
artifact: "P5.1 Legacy UI Audit"
status: "draft"
owner: "CLARA Product and Engineering"
classification: "product-audit"
---

# CLARA P5.1 Legacy UI Audit

The legacy `project_Clara` dashboard should guide CLARA v2 layout and workflow, not backend implementation.

## Legacy Product Areas To Preserve

- Sales queue for active conversations.
- Conversation detail with customer context.
- CRM and lead detail workflows.
- Customer profile pages.
- Follow-up and notification work queues.
- Approval and manager insight surfaces.
- Knowledge publishing from real conversations.
- KPI and admin access views.

## Visual Language To Preserve

- Premium dark workspace shell.
- Gold accent.
- Left sidebar.
- Grouped navigation.
- Top bar.
- Responsive mobile sidebar.
- Account menu.
- Card-based workspace surfaces.
- Source/channel badges.
- Role-aware navigation labels.
- Operator-first dashboard.

## Explicit Rejections

- No legacy auth behavior.
- No copied secrets.
- No raw provider payload display.
- No direct provider token handling in the frontend.
- No ChatGPT/OpenAI API key in frontend.
