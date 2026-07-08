import { describe, expect, it } from "vitest";
import { AuthenticationError } from "../src/errors/app-error";
import { SupabaseJwtVerifier } from "../src/auth/supabase-jwt-verifier";
import { createSupabaseJwksTestContext } from "./support/supabase-jwt-test-helpers";

describe("SupabaseJwtVerifier", () => {
  it("returns a trusted provider identity for a valid JWT", async () => {
    const jwksContext = await createSupabaseJwksTestContext();
    const verifier = new SupabaseJwtVerifier(
      {
        mode: "provider",
        provider: "supabase",
        jwksUrl: jwksContext.jwksUrl,
        issuer: jwksContext.issuer,
      },
      jwksContext.jwks,
    );
    const token = await jwksContext.signToken({
      subject: "subject_demo_agent",
      email: "agent@example.test",
    });

    await expect(verifier.verifyAccessToken(token)).resolves.toEqual({
      provider: "supabase",
      subject: "subject_demo_agent",
      email: "agent@example.test",
    });
  });

  it("rejects an invalid JWT", async () => {
    const jwksContext = await createSupabaseJwksTestContext();
    const verifier = new SupabaseJwtVerifier(
      {
        mode: "provider",
        provider: "supabase",
        jwksUrl: jwksContext.jwksUrl,
        issuer: jwksContext.issuer,
      },
      jwksContext.jwks,
    );

    await expect(
      verifier.verifyAccessToken("not-a-jwt"),
    ).rejects.toBeInstanceOf(AuthenticationError);
  });

  it("rejects an expired JWT", async () => {
    const jwksContext = await createSupabaseJwksTestContext();
    const verifier = new SupabaseJwtVerifier(
      {
        mode: "provider",
        provider: "supabase",
        jwksUrl: jwksContext.jwksUrl,
        issuer: jwksContext.issuer,
      },
      jwksContext.jwks,
    );
    const token = await jwksContext.signToken({
      subject: "subject_demo_agent",
      expirationTime: -60,
    });

    await expect(verifier.verifyAccessToken(token)).rejects.toBeInstanceOf(
      AuthenticationError,
    );
  });

  it("rejects a JWT with the wrong issuer", async () => {
    const jwksContext = await createSupabaseJwksTestContext();
    const verifier = new SupabaseJwtVerifier(
      {
        mode: "provider",
        provider: "supabase",
        jwksUrl: jwksContext.jwksUrl,
        issuer: jwksContext.issuer,
      },
      jwksContext.jwks,
    );
    const token = await jwksContext.signToken({
      subject: "subject_demo_agent",
      issuer: "https://another-issuer.example.test/auth/v1",
    });

    await expect(verifier.verifyAccessToken(token)).rejects.toBeInstanceOf(
      AuthenticationError,
    );
  });
});
