# CLARA P19 Internal Database Migration Bootstrap Runbook

Database migrate/bootstrap runbook exists for internal deployment readiness.

Commands:

```sh
cd services/api
npm run db:ready
npm run db:migrate
npm run db:bootstrap-owner
```

`db:bootstrap-owner` requires explicit first-owner bootstrap identifiers from
environment config. These identifiers are not provider tokens or secrets. First
owner bootstrap must create or link organization, workspace, owner user, and
active owner workspace membership before internal team usage.

Internal deployment requires real workspace membership. Missing/inactive
membership fails closed.

