---
project: "CLARA"
artifact: "P4.5 Extension Bridge Operator Runbook"
status: "implemented"
owner: "CLARA Operations"
classification: "operator-runbook"
---

# CLARA P4.5 Extension Bridge Operator Runbook

## Local Setup

```bash
cd services/api
npm run dev

cd ../../apps/extension
npm install
npm run test
```

## Operator Flow

1. Open a supported provider page in the browser: whatsapp, instagram, or tiktok.
2. Open the active customer conversation.
3. Confirm the extension status panel shows auto-sync state.
4. Let the active conversation snapshot sync to CLARA.
5. Use ChatGPT Companion preview only when the operator chooses.
6. Copy safe context manually if needed.
7. Open ChatGPT manually if needed.

## Safety Boundaries

- Active conversation only.
- No inbox or background crawling.
- No provider credentials.
- No ChatGPT session access.
- No auto-send.
- No automatic ChatGPT submission.

## Troubleshooting

- `401`: sign in to CLARA again.
- `403`: role is not allowed to sync snapshots.
- `400`: payload failed validation or unsafe fields were present.
- No sync: confirm an active supported conversation is open and auto-sync is enabled.
- Duplicate/no-op sync: unchanged `snapshot_hash` was deduplicated.
