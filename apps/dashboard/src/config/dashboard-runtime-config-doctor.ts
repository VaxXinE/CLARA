export type DashboardRuntimeConfigDoctorStatus = "pass" | "warn" | "fail";

export type DashboardRuntimeConfigDoctorCheck = {
  name: string;
  status: DashboardRuntimeConfigDoctorStatus;
  message: string;
};

export type DashboardRuntimeConfigDoctorResult = {
  status: DashboardRuntimeConfigDoctorStatus;
  checks: DashboardRuntimeConfigDoctorCheck[];
};

type DashboardRuntimeConfigInput = Record<string, string | undefined>;

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();

  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function hasPrivilegedProviderKey(env: DashboardRuntimeConfigInput): boolean {
  const privilegedName = ["service", "role"].join("_");

  return Object.entries(env).some(([key, value]) => {
    const normalizedKey = key.toLowerCase();
    const normalizedValue = value?.toLowerCase() ?? "";

    return (
      normalizedKey.includes(privilegedName) ||
      normalizedValue.includes(privilegedName)
    );
  });
}

function check(
  name: string,
  status: DashboardRuntimeConfigDoctorStatus,
  message: string,
): DashboardRuntimeConfigDoctorCheck {
  return {
    name,
    status,
    message,
  };
}

function summarize(
  checks: DashboardRuntimeConfigDoctorCheck[],
): DashboardRuntimeConfigDoctorStatus {
  if (checks.some((item) => item.status === "fail")) {
    return "fail";
  }

  if (checks.some((item) => item.status === "warn")) {
    return "warn";
  }

  return "pass";
}

export function runDashboardRuntimeConfigDoctor(
  env: DashboardRuntimeConfigInput,
): DashboardRuntimeConfigDoctorResult {
  const authMode = clean(env.VITE_AUTH_MODE) ?? "demo";
  const checks: DashboardRuntimeConfigDoctorCheck[] = [];

  checks.push(
    check(
      "dashboard.auth_mode",
      authMode === "demo" || authMode === "provider" ? "pass" : "fail",
      "Dashboard auth mode must be demo or provider.",
    ),
  );

  checks.push(
    check(
      "dashboard.provider_public_config",
      authMode === "provider" &&
        (!clean(env.VITE_SUPABASE_URL) || !clean(env.VITE_SUPABASE_ANON_KEY))
        ? "fail"
        : "pass",
      "Provider dashboard mode requires public Supabase URL and anon key.",
    ),
  );

  checks.push(
    check(
      "dashboard.privileged_keys",
      hasPrivilegedProviderKey(env) ? "fail" : "pass",
      "Frontend runtime config must not contain privileged provider keys.",
    ),
  );

  checks.push(
    check(
      "dashboard.api_base_url",
      authMode === "provider" && !clean(env.VITE_API_BASE_URL)
        ? "warn"
        : "pass",
      "Provider dashboard mode should set an explicit API base URL.",
    ),
  );

  checks.push(
    check(
      "dashboard.output_redaction",
      "pass",
      "Doctor output reports safe check names only and never prints secret values.",
    ),
  );

  return {
    status: summarize(checks),
    checks,
  };
}
