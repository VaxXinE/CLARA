import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from "jose";

export type SupabaseJwksTestContext = {
  issuer: string;
  jwksUrl: string;
  jwks: ReturnType<typeof createLocalJWKSet>;
  signToken: (input: {
    subject: string;
    email?: string;
    issuer?: string;
    expirationTime?: string | number | Date;
  }) => Promise<string>;
};

export async function createSupabaseJwksTestContext(
  issuer = "https://clara.supabase.test/auth/v1",
): Promise<SupabaseJwksTestContext> {
  const { publicKey, privateKey } = await generateKeyPair("RS256");
  const publicJwk = await exportJWK(publicKey);

  publicJwk.kid = "test-supabase-key";
  publicJwk.alg = "RS256";
  publicJwk.use = "sig";

  return {
    issuer,
    jwksUrl: "https://clara.supabase.test/auth/v1/jwks",
    jwks: createLocalJWKSet({ keys: [publicJwk] }),
    signToken: async (input) => {
      const jwt = new SignJWT(input.email ? { email: input.email } : {})
        .setProtectedHeader({
          alg: "RS256",
          kid: "test-supabase-key",
        })
        .setSubject(input.subject)
        .setIssuer(input.issuer ?? issuer)
        .setIssuedAt()
        .setExpirationTime(input.expirationTime ?? "2h");

      return jwt.sign(privateKey);
    },
  };
}
