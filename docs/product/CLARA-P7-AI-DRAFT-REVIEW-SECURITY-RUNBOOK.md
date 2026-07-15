# CLARA P7 AI Draft Review Security Runbook

This runbook is the p7 production readiness gate for AI Draft Review and Human
Approval.

## Local Validation

```bash
cd services/api
npm install
npx --yes prettier "src/**/*.ts" "tests/**/*.ts" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../../apps/dashboard
npm install
npx --yes prettier "src/**/*.{ts,tsx}" --write
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../extension
npm install
npm run typecheck
npm run test
npm run build
npm audit --omit=dev --audit-level=high

cd ../..
bash scripts/validate-p7-ai-draft-review-human-approval.sh
```

## Security Checklist

- AI-created content starts as `suggested`.
- Human operators can edit, approve, or reject.
- Viewer role cannot mutate draft review state.
- Blocked, rejected, and expired drafts cannot be approved.
- Approval does not equal send.
- No auto-send exists.
- Backend AuthContext provides organization and workspace scope.
- Client `organization_id`, `workspace_id`, and `role` are not trusted.
- Cross-workspace access returns safe not-found behavior.
- AI draft review responses include `requiresHumanApproval=true`.
- no access token appears in API responses.
- no refresh token appears in API responses.
- no cookies appear in API responses.
- no Authorization header appears in API responses.
- no raw provider payload appears in API responses or audit metadata.
- no raw webhook payload appears in API responses or audit metadata.
- no raw DOM appears in API responses.
- no raw HTML appears in API responses.
- no provider raw error is exposed to clients.
- Audit events use safe IDs, statuses, and reason codes only.

## Troubleshooting

If approval returns `409`, check the current review status. The draft may be
`blocked`, `rejected`, or `expired`.

If reply send with a draft id returns not found, confirm the draft belongs to
the authenticated workspace and has status `approved`.

If dashboard send is disabled, approve the draft review first or write a manual
reply without using an AI draft id.
