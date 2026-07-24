import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getAuthContext } from "../../auth/auth-context";
import type { AuthProvider } from "../../auth/auth-provider";
import { requireAuth } from "../../auth/require-auth";
import type { Env } from "../../config/env";
import { ValidationError } from "../../errors/app-error";
import { parseExtensionSnapshotPayload } from "../../extension/extension-snapshot-validation";
import type { ExtensionSnapshotAiAnalysisService } from "../../ai/extension-snapshot-ai-analysis-service";
import { getWorkspaceScopeFromAuth } from "../../workspace/workspace-scope";
import { createScopedRateLimitPreHandler } from "../middleware/rate-limit";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const paramsSchema = z.object({
  snapshotId: z.string().trim().min(1).max(160).regex(safeIdPattern),
});

const postBodySchema = z
  .object({
    snapshot: z.unknown(),
    model: z.string().trim().min(1).max(160).optional(),
    workspaceId: z.never().optional(),
    organizationId: z.never().optional(),
  })
  .strict();

const emptyQuerySchema = z.object({}).strict();

function parseParams(params: unknown): { snapshotId: string } {
  const parsed = paramsSchema.safeParse(params);

  if (!parsed.success) {
    throw new ValidationError("Invalid request.", [
      { path: "snapshotId", message: "Invalid snapshot ID." },
    ]);
  }

  return parsed.data;
}

function parseEmptyQuery(query: unknown): void {
  const parsed = emptyQuerySchema.safeParse(query ?? {});

  if (!parsed.success) {
    throw new ValidationError("Invalid request.", [
      { path: "query", message: "Query parameters are not accepted." },
    ]);
  }
}

function parsePostBody(body: unknown) {
  const parsed = postBodySchema.safeParse(body ?? {});

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid request.",
      parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  return parsed.data;
}

export async function registerExtensionSnapshotAiAnalysisRoutes(
  app: FastifyInstance,
  authProvider: AuthProvider,
  service: ExtensionSnapshotAiAnalysisService,
  env: Pick<
    Env,
    | "RATE_LIMIT_ENABLED"
    | "RATE_LIMIT_WINDOW_MS"
    | "AI_DRAFT_RATE_LIMIT_MAX"
    | "REPLY_SEND_RATE_LIMIT_MAX"
  >,
): Promise<void> {
  app.post<{ Params: { snapshotId: string } }>(
    "/api/v1/extension-snapshots/:snapshotId/ai-analysis",
    {
      preHandler: [
        requireAuth(authProvider),
        createScopedRateLimitPreHandler({ scope: "ai_draft", env }),
      ],
    },
    async (request, reply) => {
      parseEmptyQuery(request.query);
      const params = parseParams(request.params);
      const body = parsePostBody(request.body);
      const snapshot = parseExtensionSnapshotPayload({
        channel:
          typeof body.snapshot === "object" &&
          body.snapshot &&
          "channel" in body.snapshot &&
          typeof body.snapshot.channel === "string"
            ? body.snapshot.channel
            : "",
        body: body.snapshot,
      });
      const auth = getAuthContext(request);

      const analyzeInput = {
        auth,
        scope: getWorkspaceScopeFromAuth(auth),
        snapshotId: params.snapshotId,
        snapshot,
        correlationId: request.id,
      };

      const result = await service.analyze(
        body.model ? { ...analyzeInput, model: body.model } : analyzeInput,
      );

      return reply
        .status(result.data.analysis.status === "generated" ? 201 : 200)
        .send(result);
    },
  );

  app.get<{ Params: { snapshotId: string } }>(
    "/api/v1/extension-snapshots/:snapshotId/ai-analysis",
    {
      preHandler: requireAuth(authProvider),
    },
    async (request) => {
      parseEmptyQuery(request.query);
      const params = parseParams(request.params);

      return service.getLatest({
        auth: getAuthContext(request),
        snapshotId: params.snapshotId,
      });
    },
  );
}
