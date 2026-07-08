export type TrustedProviderIdentity = {
  provider: "supabase" | "better-auth";
  subject: string;
  email?: string;
};

export interface ProviderIdentityVerifier {
  verifyAccessToken(token: string): Promise<TrustedProviderIdentity>;
}
