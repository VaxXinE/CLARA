---
project: "CLARA"
artifact: "P12 Release Candidate Readiness Policy"
status: "active"
owner: "CLARA Product and Engineering"
classification: "release-candidate-policy"
---

# CLARA P12 Release Candidate Readiness Policy

Release candidate readiness sits between Beta and GA. Beta and GA are different
gates: Beta validates controlled usage; release candidate validates production
readiness evidence; GA approves launch.

## Required Checks Before Release Candidate

- API, dashboard, and extension typecheck, test, build, and production dependency
  audit pass.
- Local/demo smoke passes.
- Production config validation passes without secrets printed.
- Auth, RBAC, and workspace isolation regression coverage passes.
- Provider, billing, AI, queue, alert, backup, restore, load-test, and evidence
  export surfaces remain restricted unless explicitly approved in later P12
  work.
- Known limitations and support path are published.
- Rollback plan draft exists for P12-PR-03.

## Release Candidate No-Go

No-go is mandatory for data exposure, failed auth/workspace isolation,
dangerous production config, unsafe payment/provider/AI activation, unresolved
critical test failure, or unowned rollback/support process.
