# workers/

Background workers live here.

---

## Purpose

This directory will contain asynchronous/background processing.

Expected future workers:

```text
automation-worker
ingestion-worker
notification-worker
```

---

## Current MVP Status

Workers are not required for first implementation slice unless needed by chosen architecture.

---

## Security Rule

Workers must enforce tenant/workspace scope just like API services.
