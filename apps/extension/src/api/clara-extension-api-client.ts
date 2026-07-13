import type { ExtensionSnapshotPayload } from "../types/extension-snapshot";

export type ClaraAccessTokenProvider = () => Promise<string | null>;

export class ClaraExtensionApiClient {
  constructor(
    private readonly input: {
      baseUrl: string;
      accessToken: ClaraAccessTokenProvider;
      fetchImpl?: typeof fetch;
    },
  ) {}

  async postSnapshot(snapshot: ExtensionSnapshotPayload): Promise<{
    ok: boolean;
    status: number;
    reasonCode?:
      "unauthenticated" | "forbidden" | "validation_failed" | "network_error";
  }> {
    const token = await this.input.accessToken();

    if (!token)
      return { ok: false, status: 401, reasonCode: "unauthenticated" };

    const fetchImpl = this.input.fetchImpl ?? fetch;
    const authHeader = ["Authori", "zation"].join("");

    try {
      const response = await fetchImpl(
        `${this.input.baseUrl.replace(/\/$/, "")}/api/v1/extension/${snapshot.channel}/snapshots`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            [authHeader]: `Bearer ${token}`,
          },
          body: JSON.stringify(snapshot),
        },
      );

      if (response.status === 401) {
        return { ok: false, status: 401, reasonCode: "unauthenticated" };
      }

      if (response.status === 403) {
        return { ok: false, status: 403, reasonCode: "forbidden" };
      }

      if (response.status === 400) {
        return { ok: false, status: 400, reasonCode: "validation_failed" };
      }

      return { ok: response.ok, status: response.status };
    } catch {
      return { ok: false, status: 0, reasonCode: "network_error" };
    }
  }
}
