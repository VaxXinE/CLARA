---
project: "CLARA"
artifact: "P5.1 Legacy UI Upgrade Positioning"
status: "draft"
owner: "CLARA Product and Engineering"
classification: "product-spec"
---

# CLARA P5.1 Legacy UI Upgrade Positioning

P5.1 starts the Legacy UI Upgrade Track.

`project_Clara` is a product and UX reference only. CLARA v2 is the production-ready upgrade that keeps the current API, security, auth, test, audit, and provider-boundary foundation.

The p5.1 legacy ui gate is documentation and contract only; shell implementation comes later.

## Product Position

- Legacy project: sales operations platform reference.
- CLARA v2: production-ready, secure, multi-channel sales operations workspace.
- Keep the operator experience: queue, CRM, customer profile, action center, manager review, knowledge loop, and role-aware workspace navigation.
- Do not copy unsafe backend code, auth shortcuts, secrets, provider tokens, or environment files from the legacy repository.

## Upgrade Rule

Port product intent and visual language, not runtime trust assumptions.

Frontend role-aware navigation remains UX only. Backend authorization remains the source of truth for organization, workspace, role, and permission decisions.
