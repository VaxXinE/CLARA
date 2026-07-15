export type AiAutomationAbuseFinding = {
  detected: boolean;
  flags: string[];
};

const phraseRules: Array<{ phrase: string; flag: string }> = [
  { phrase: "ignore previous instructions", flag: "prompt_override" },
  { phrase: "send automatically", flag: "send_without_review" },
  { phrase: "send without approval", flag: "send_without_review" },
  { phrase: "secretly update customer", flag: "hidden_customer_change" },
  { phrase: "write to crm automatically", flag: "hidden_customer_change" },
  { phrase: "create reminder automatically", flag: "task_change" },
  { phrase: "access another workspace", flag: "workspace_boundary" },
  { phrase: "reveal token", flag: "secret_request" },
  { phrase: "reveal cookie", flag: "secret_request" },
  { phrase: "reveal raw payload", flag: "provider_payload_request" },
  { phrase: "use session cookie", flag: "secret_request" },
  { phrase: "bypass human approval", flag: "approval_bypass" },
  { phrase: "disable audit", flag: "audit_bypass" },
  { phrase: "hide action", flag: "hidden_action" },
  { phrase: "pretend sent", flag: "false_completion" },
  { phrase: "claim completed", flag: "false_completion" },
  { phrase: "change role", flag: "admin_mutation" },
  { phrase: "invite user", flag: "admin_mutation" },
  { phrase: "delete user", flag: "admin_mutation" },
  { phrase: "change billing", flag: "billing_mutation" },
  { phrase: "connect provider", flag: "provider_mutation" },
  { phrase: "disconnect provider", flag: "provider_mutation" },
];

export function detectAiAutomationAbuse(input: {
  requestedAction: string;
  operatorInstruction?: string;
  aiOutput?: string;
}): AiAutomationAbuseFinding {
  const combined = [
    input.requestedAction,
    input.operatorInstruction ?? "",
    input.aiOutput ?? "",
  ]
    .join(" ")
    .toLowerCase();
  const flags = new Set<string>();

  for (const rule of phraseRules) {
    if (combined.includes(rule.phrase)) {
      flags.add(rule.flag);
    }
  }

  return {
    detected: flags.size > 0,
    flags: [...flags],
  };
}
