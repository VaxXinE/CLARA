# CLARA P18 Runtime Trial Evidence Retention And Disposal

P18-PR-02 is current.

## Retention

- Keep only sanitized evidence needed for internal trial review.
- Store evidence in the approved internal repo-safe location or approved internal workspace.
- Keep known issue records until the P18 review closes or a shorter security decision requires disposal.
- Keep no secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data.

## Disposal

- Delete unsafe evidence immediately if discovered.
- Escalate blocker evidence exposure through the security review path.
- Record only a safe summary and reason_code after disposal.
- Re-run the smoke checklist after disposal if evidence integrity is affected.

## References

- `docs/product/CLARA-P18-RUNTIME-TRIAL-STOP-CRITERIA.md`
- `docs/product/CLARA-P18-RUNTIME-TRIAL-MANUAL-ROLLBACK-GUIDANCE.md`
