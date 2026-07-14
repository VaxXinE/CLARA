export type RuntimeConfigDoctorStatus = "pass" | "warn" | "fail";

export type RuntimeConfigDoctorCheck = {
  name: string;
  status: RuntimeConfigDoctorStatus;
  message: string;
};

export type RuntimeConfigDoctorResult = {
  status: RuntimeConfigDoctorStatus;
  checks: RuntimeConfigDoctorCheck[];
};

type RuntimeConfigInput = Record<string, string | undefined>;

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();

  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function check(
  name: string,
  status: RuntimeConfigDoctorStatus,
  message: string,
): RuntimeConfigDoctorCheck {
  return {
    name,
    status,
    message,
  };
}

function summarize(
  checks: RuntimeConfigDoctorCheck[],
): RuntimeConfigDoctorStatus {
  if (checks.some((item) => item.status === "fail")) {
    return "fail";
  }

  if (checks.some((item) => item.status === "warn")) {
    return "warn";
  }

  return "pass";
}

export function runApiRuntimeConfigDoctor(
  env: RuntimeConfigInput,
): RuntimeConfigDoctorResult {
  const nodeEnv = clean(env.NODE_ENV) ?? "development";
  const authMode = clean(env.AUTH_MODE) ?? "mock";
  const authProvider = clean(env.AUTH_PROVIDER);
  const mockAuthEnabled = clean(env.MOCK_AUTH_ENABLED);
  const isProduction = nodeEnv === "production";
  const checks: RuntimeConfigDoctorCheck[] = [];

  checks.push(
    check(
      "api.auth_mode",
      isProduction && authMode !== "provider" ? "fail" : "pass",
      isProduction
        ? "Production API must use provider auth mode."
        : "Non-production API may use local mock auth.",
    ),
  );

  checks.push(
    check(
      "api.mock_auth",
      isProduction && mockAuthEnabled === "true" ? "fail" : "pass",
      "Production API must not enable mock auth.",
    ),
  );

  checks.push(
    check(
      "api.auth_provider",
      authMode === "provider" && !authProvider ? "fail" : "pass",
      "Provider auth mode requires an explicit provider.",
    ),
  );

  checks.push(
    check(
      "api.supabase_provider",
      authMode === "provider" &&
        authProvider === "supabase" &&
        (!clean(env.SUPABASE_AUTH_JWKS_URL) || !clean(env.SUPABASE_AUTH_ISSUER))
        ? "fail"
        : "pass",
      "Supabase provider mode requires issuer and JWKS configuration.",
    ),
  );

  checks.push(
    check(
      "api.database_url",
      isProduction && !clean(env.DATABASE_URL) ? "fail" : "pass",
      "Production API requires DATABASE_URL.",
    ),
  );

  const corsOrigins = (clean(env.CORS_ORIGIN) ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  checks.push(
    check(
      "api.cors_origin",
      isProduction && (corsOrigins.length === 0 || corsOrigins.includes("*"))
        ? "fail"
        : "pass",
      "Production API requires explicit non-wildcard CORS origins.",
    ),
  );

  checks.push(
    check(
      "api.log_level",
      isProduction &&
        ["debug", "trace", "silent"].includes(clean(env.LOG_LEVEL) ?? "info")
        ? "fail"
        : "pass",
      "Production API must not use debug, trace, or silent logging.",
    ),
  );

  checks.push(
    check(
      "api.output_redaction",
      "pass",
      "Doctor output reports safe check names only and never prints secret values.",
    ),
  );

  return {
    status: summarize(checks),
    checks,
  };
}
