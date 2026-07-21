export function getSafeBenchmarkScenarioPolicy() {
  return [
    "synthetic_auth_readiness_route_smoke",
    "api_read_only_endpoint_smoke",
    "dashboard_build_render_smoke",
    "extension_build_typecheck_smoke",
    "queue_retry_idempotency_conceptual_profile",
    "usage_metering_conceptual_profile",
    "billing_readiness_conceptual_profile",
  ] as const;
}
