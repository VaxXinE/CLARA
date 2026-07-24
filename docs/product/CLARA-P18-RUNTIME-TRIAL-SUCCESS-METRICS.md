# CLARA P18 Runtime Trial Success Metrics

P18 validates controlled internal runtime behavior only.

Success metrics:
- Authorized operator can complete the pipeline from extension snapshot to safe
  dashboard review UI.
- Sanitization/redaction runs before backend ingestion.
- Workspace/operator attribution is present in evidence.
- Backend ingestion/dedup prevents duplicate evidence records.
- AI-ready context contains no raw prompts or raw customer messages as prompts.
- Controlled backend real AI analysis returns safe review output.
- Safe persistence stores no raw provider payloads or raw AI provider responses.
- Stop criteria and manual rollback guidance are reviewed before broader rollout.

Failure metrics:
- Any token, cookie, auth header, raw provider payload, raw webhook payload, raw
  HTML, raw DOM, raw prompt, raw customer message as prompt, or payment data
  appears in evidence.
- Extension calls an AI provider directly.
- Client-supplied workspaceId becomes authoritative.
- Outbound auto-send is enabled.
- Official WA/IG/TikTok APIs are activated.
- Billing/payment is activated.
