import { sanitizeAiPlainText } from "./ai-context-sanitizer";
import type {
  AiContextMessageInput,
  AiContextBudgetSummary,
} from "./ai-context-types";

export type AiContextBudget = {
  maxMessages: number;
  maxMessageChars: number;
  maxSnippetChars: number;
};

export const defaultAiContextBudget = {
  maxMessages: 12,
  maxMessageChars: 1200,
  maxSnippetChars: 1200,
} satisfies AiContextBudget;

export function applyAiContextBudget(input: {
  messages: AiContextMessageInput[];
  snippets: string[];
  budget?: Partial<AiContextBudget>;
}): {
  messages: AiContextMessageInput[];
  snippets: string[];
  summary: AiContextBudgetSummary;
} {
  const budget = { ...defaultAiContextBudget, ...input.budget };
  const messages = input.messages.slice(-budget.maxMessages).map((message) => ({
    ...message,
    body: sanitizeAiPlainText(message.body, budget.maxMessageChars),
  }));
  const snippets = input.snippets.map((snippet) =>
    sanitizeAiPlainText(snippet, budget.maxSnippetChars),
  );

  return {
    messages,
    snippets,
    summary: {
      maxMessages: budget.maxMessages,
      maxMessageChars: budget.maxMessageChars,
      maxSnippetChars: budget.maxSnippetChars,
      includedMessages: messages.length,
      truncatedMessages: Math.max(0, input.messages.length - messages.length),
      includedSnippets: snippets.length,
      truncatedSnippets: snippets.filter(
        (snippet, index) =>
          snippet.length <
          sanitizeAiPlainText(input.snippets[index] ?? "").length,
      ).length,
    },
  };
}
