export const gmailConnectionHealthStatuses = [
  "healthy",
  "degraded",
  "disconnected",
  "action_required",
] as const;

export const gmailConnectionHealthReasonCodes = [
  "ok",
  "provider_account_revoked",
  "token_reference_missing",
  "token_reference_unavailable",
  "access_token_expired",
  "refresh_token_missing",
  "token_refresh_failed",
  "provider_rejected",
  "provider_unavailable",
  "profile_email_mismatch",
  "profile_check_failed",
] as const;

export type GmailConnectionHealthStatus =
  (typeof gmailConnectionHealthStatuses)[number];

export type GmailConnectionHealthReasonCode =
  (typeof gmailConnectionHealthReasonCodes)[number];

export type GmailConnectionHealthDto = {
  provider_account_id: string;
  provider: "gmail";
  status: GmailConnectionHealthStatus;
  reason_code: GmailConnectionHealthReasonCode;
  email_address?: string;
  last_verified_at?: string;
  token_expires_at?: string;
  checked_at: string;
};
