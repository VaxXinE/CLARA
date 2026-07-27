---
project: "CLARA"
artifact: "P19 Missing Membership Troubleshooting"
status: "current"
owner: "CLARA Product and Engineering"
classification: "troubleshooting"
---

# P19 Missing Membership Troubleshooting

If provider login succeeds but CLARA shows workspace access required, the
provider identity is not mapped to exactly one active backend workspace
membership.

## Checks

1. Confirm the provider subject matches the CLARA user mapping.
2. Confirm the user is active.
3. Confirm the workspace membership is active.
4. Confirm only one active membership resolves for the user.
5. Confirm dashboard is using `VITE_AUTH_MODE=provider`.

Do not switch to demo/mock mode for real work. Mock/demo mode is dev/test only.

Missing/inactive membership fails closed. Backend AuthContext/workspace
membership is source of truth. client-supplied workspaceId is not
authoritative.
