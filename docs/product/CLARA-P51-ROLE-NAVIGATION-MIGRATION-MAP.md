---
project: "CLARA"
artifact: "P5.1 Role Navigation Migration Map"
status: "draft"
owner: "CLARA Product and Engineering"
classification: "role-navigation-map"
---

# CLARA P5.1 Role Navigation Migration Map

| Legacy Role  | CLARA v2 Mapping                                                    | Notes                                          |
| ------------ | ------------------------------------------------------------------- | ---------------------------------------------- |
| `sales`      | `agent`                                                             | operator who handles conversations and replies |
| `manager`    | future `manager` or current `owner`/`agent` with scoped permissions | coaching and queue oversight                   |
| `head`       | future `admin`/`manager` layer                                      | cross-team review and intervention             |
| `superadmin` | `owner` plus future platform admin boundary                         | must remain server-authorized                  |

## Navigation Rule

Role-aware navigation labels can hide irrelevant UI, but they are never final authorization.

Current CLARA v2 roles:

- `owner`
- future `admin` or `manager` if supported later
- `agent`
- `viewer`

A future compatibility layer may map legacy `sales`, `manager`, `head`, and `superadmin` labels to CLARA v2 permissions.
