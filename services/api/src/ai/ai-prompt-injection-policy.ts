export const aiPromptInjectionBlockedIntents = [
  "ignore_previous_instructions",
  "reveal_secrets",
  "bypass_human_approval",
  "send_automatically",
  "secret_crm_mutation",
  "cross_workspace_access",
] as const;

const promptInjectionPatterns: Array<{
  intent: (typeof aiPromptInjectionBlockedIntents)[number];
  pattern: RegExp;
}> = [
  {
    intent: "ignore_previous_instructions",
    pattern: /ignore (all )?(previous|prior) instructions/i,
  },
  {
    intent: "reveal_secrets",
    pattern: /(reveal|show|print).*(secret|token|key|password)/i,
  },
  {
    intent: "bypass_human_approval",
    pattern: /(bypass|skip).*(approval|review)/i,
  },
  {
    intent: "send_automatically",
    pattern: /(send|submit).*(automatically|without approval)/i,
  },
  {
    intent: "secret_crm_mutation",
    pattern: /(modify|update|delete).*(crm|customer).*(secretly|silently)/i,
  },
  {
    intent: "cross_workspace_access",
    pattern: /(another|other).*(workspace|customer|tenant)/i,
  },
];

export function detectPromptInjectionIntent(text: string): string | null {
  const normalized = text.trim();

  for (const item of promptInjectionPatterns) {
    if (item.pattern.test(normalized)) {
      return item.intent;
    }
  }

  return null;
}

export function labelUntrustedCustomerText(text: string): string {
  return `<untrusted_customer_text>\n${text}\n</untrusted_customer_text>`;
}
