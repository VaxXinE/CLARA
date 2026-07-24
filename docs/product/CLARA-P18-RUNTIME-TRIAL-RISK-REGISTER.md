# CLARA P18 Runtime Trial Risk Register

P18 Controlled Internal Runtime Trial + Operational Readiness is current.

| Risk | Control | Stop trigger |
| --- | --- | --- |
| Sensitive evidence captured | Evidence privacy policy and redaction review | Any secret/token/raw prompt/raw customer message as prompt appears |
| Workspace spoofing | Backend AuthContext and membership source of truth | Client-supplied workspaceId affects authorization |
| Direct extension AI call | Extension boundary review | Extension calls AI provider directly |
| Provider/channel expansion | Explicit non-goal | Official WA/IG/TikTok APIs are activated |
| Outbound action | Explicit human review-only flow | Outbound auto-send is enabled |
| Launch confusion | Environment boundary | Public launch or production deployment is claimed |

Known limitations must be reviewed before broader rollout.
Stop criteria are required before broader rollout.
Manual rollback guidance is required before broader rollout.
