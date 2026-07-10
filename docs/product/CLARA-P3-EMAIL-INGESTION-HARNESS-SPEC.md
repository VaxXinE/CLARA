---
project: "CLARA"
artifact: "P3 Email Ingestion Harness Spec"
version: "1.0.0"
status: "draft-for-review"
owner: "CLARA Engineering and Security Team"
last_updated: "2026-07-09"
classification: "product-spec"
related_documents:
  - "./CLARA-P3-EMAIL-CHANNEL-ADAPTER-SPEC.md"
  - "./CLARA-P3-EMAIL-INBOUND-PERSISTENCE-SPEC.md"
  - "../../services/api/README.md"
  - "./CLARA-MVP-GAP-REVIEW.md"
---

# CLARA P3 Email Ingestion Internal Harness

## Purpose

This document defines the internal-only email ingestion harness for CLARA.

The harness coordinates:

```text
adapter batch loading
message normalization
inbound persistence
safe batch summary reporting
```

## Current Scope

This PR adds:

```text
email ingestion service
batch result summary
safe per-item failure collection
simulated adapter support for local/dev/test
deterministic offline tests
```

This PR does not add:

```text
public webhook endpoint
background worker
cron scheduler
Gmail API integration
IMAP integration
SMTP send
OAuth flow
```

## Batch Summary

Current batch result fields:

```text
attempted_count
persisted_count
duplicate_count
failed_count
failures
```

Failure items are safe only:

```text
index
code
message
```

No raw body, raw headers, or provider payload may appear in failures.

## Processing Rules

Current harness behavior:

```text
load messages from a batch-capable adapter when available
normalize each item through the adapter boundary
persist each normalized message through the inbound persistence service
count duplicates through already_processed=true
continue after per-item failure
abort only when adapter-level batch loading fails before item processing starts
```

## Future Direction

Later implementations should reuse this harness from:

```text
provider webhook handler
background worker
secure provider polling process
```

That future caller must still provide:

```text
trusted provider identity
trusted organization/workspace scope
safe provider verification before any business persistence
```
