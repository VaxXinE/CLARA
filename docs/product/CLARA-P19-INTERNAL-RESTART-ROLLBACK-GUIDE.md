# CLARA P19 Internal Restart Rollback Guide

Safe restart:

1. Stop dashboard static server.
2. Stop API process.
3. Confirm no migration is currently running.
4. Start API from the last validated build.
5. Start dashboard from the matching validated build.
6. Run health/ready smoke checks.

Rollback:

- Roll back application image/build first.
- Roll back env config only to a previously validated provider-auth config.
- Review database migrations before any rollback. Do not run destructive
  database rollback without explicit review.
- Record incident notes without secrets, tokens, cookies, Authorization headers,
  raw provider payloads, raw prompts, raw DOM, raw HTML, or payment data.

