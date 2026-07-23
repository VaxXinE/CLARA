# CLARA P14 Internal User Onboarding Checklist

## Status

P14-PR-01 is complete. P14-PR-02 is current. This checklist is for internal beta
rollout only.

## Checklist

- [ ] Confirm internal use first.
- [ ] Confirm billing/payment is deferred.
- [ ] Confirm public SaaS launch is deferred.
- [ ] Confirm production deployment requires separate explicit action.
- [ ] Confirm Provider/AI/outbound activation remains controlled.
- [ ] Confirm owner/admin/operator/viewer roles are defined.
- [ ] Confirm Backend AuthContext and workspace membership remain source of
  truth.
- [ ] Confirm client supplied workspaceId is not authoritative.
- [ ] Confirm each internal user has the minimum role needed.
- [ ] Confirm viewer read-only behavior remains non-mutating.
- [ ] Confirm operator CRM access is workspace-scoped.
- [ ] Confirm admin security responsibilities are readiness/review only.
- [ ] Confirm no secrets, tokens, cookies, Authorization headers, raw DOM, raw
  HTML, raw prompts, raw provider payloads, or payment data are exposed.

## Completion Rule

Internal onboarding is complete only when owner/admin signoff is recorded in
the team process. This checklist does not create production deployment,
billing, provider activation, AI activation, or outbound activation.
