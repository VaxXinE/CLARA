# CLARA P18 Runtime Trial Evidence Template

Use this template for each controlled internal runtime trial.

```text
trial_id:
date:
environment:
operator_user_id:
operator_role:
organization_id:
workspace_id:
checklist_item:
pipeline_checked:
  extension_snapshot:
  sanitization_redaction:
  workspace_operator_attribution:
  backend_ingestion_dedup:
  ai_ready_context:
  controlled_backend_real_ai_analysis:
  safe_persistence:
  dashboard_review_ui:
result:
safe_reason_code:
safe_counts:
known_issue_id:
severity:
blocker:
stop_criteria_triggered:
manual_rollback_used:
known_limitations_reviewed:
evidence_redacted:
retention_disposal_checked:
notes_safe_summary_only:
```

Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.
