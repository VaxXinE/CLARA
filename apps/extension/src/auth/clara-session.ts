import type { ExtensionConfig } from "../config/extension-config";

export class ClaraSession {
  constructor(
    private readonly input: {
      config: Pick<ExtensionConfig, "claraAllowedOrigins">;
      getToken?: () => Promise<string | null>;
    },
  ) {}

  isAllowedClaraOrigin(origin: string): boolean {
    return this.input.config.claraAllowedOrigins.includes(origin);
  }

  async getAccessToken(): Promise<string | null> {
    return this.input.getToken?.() ?? null;
  }
}
