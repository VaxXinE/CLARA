import { z } from "zod";
import { ValidationError } from "../errors/app-error";
import { aiAutomationSourceFeatures } from "./ai-automation-guardrail-types";

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const bodySchema = z
  .object({
    requestedAction: z.string().trim().min(1).max(160),
    conversationId: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .regex(safeIdPattern, "Invalid conversation ID.")
      .optional(),
    customerId: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .regex(safeIdPattern, "Invalid customer ID.")
      .optional(),
    operatorInstruction: z.string().trim().max(1000).optional(),
    aiOutput: z.string().trim().max(2000).optional(),
    sourceFeature: z.enum(aiAutomationSourceFeatures),
    clientWorkspaceId: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .regex(safeIdPattern, "Invalid workspace ID.")
      .optional(),
  })
  .strict();

export function parseAiAutomationGuardrailBody(body: unknown) {
  const parsed = bodySchema.safeParse(body ?? {});

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
