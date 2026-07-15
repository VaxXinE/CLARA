import type { AiPromptContract } from "./ai-prompt-contract";

export type AiPromptMessage = {
  role: "system" | "developer" | "user";
  content: string;
};

export function buildAiPromptMessages(
  contract: AiPromptContract,
): AiPromptMessage[] {
  return [
    { role: "system", content: contract.systemPolicy },
    { role: "developer", content: contract.developerPolicy },
    {
      role: "user",
      content: JSON.stringify({
        trustedApplicationContext: contract.trustedApplicationContext,
        untrustedCustomerContent: contract.untrustedCustomerContent,
        taskInstruction: contract.taskInstruction,
        outputContract: contract.outputContract,
      }),
    },
  ];
}
