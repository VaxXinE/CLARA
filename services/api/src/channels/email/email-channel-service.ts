import type { EmailChannelAdapter } from "./email-channel-adapter";
import { toClaraInboundChannelMessage } from "./email-normalizer";
import type {
  ClaraInboundChannelMessage,
  NormalizedInboundEmailMessage,
} from "./email-channel-types";

export class EmailChannelService<TInboundMessage = unknown> {
  constructor(private readonly adapter: EmailChannelAdapter<TInboundMessage>) {}

  async normalizeInboundMessage(
    input: TInboundMessage,
  ): Promise<NormalizedInboundEmailMessage> {
    return this.adapter.normalizeInboundMessage(input);
  }

  async toClaraMessage(
    input: TInboundMessage,
  ): Promise<ClaraInboundChannelMessage> {
    const normalized = await this.normalizeInboundMessage(input);

    return toClaraInboundChannelMessage(normalized);
  }
}
