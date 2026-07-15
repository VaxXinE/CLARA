import { labelUntrustedCustomerText } from "./ai-prompt-injection-policy";
import type { AiUntrustedContentBlock } from "./ai-context-types";

export function toUntrustedContentBlock(
  block: AiUntrustedContentBlock,
): AiUntrustedContentBlock {
  return {
    ...block,
    text: labelUntrustedCustomerText(block.text),
  };
}
