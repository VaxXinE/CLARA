import type { EmailBatchLoadingAdapter } from "./email-channel-adapter";
import { normalizeInboundEmailPayload } from "./email-normalizer";
import type {
  NormalizedInboundEmailMessage,
  SimulatedInboundEmailPayload,
} from "./email-channel-types";

export class SimulatedEmailChannelAdapter implements EmailBatchLoadingAdapter<SimulatedInboundEmailPayload> {
  readonly provider = "simulated-email";

  constructor(
    private readonly inboundMessages: SimulatedInboundEmailPayload[] = [],
  ) {}

  async loadInboundMessages(): Promise<SimulatedInboundEmailPayload[]> {
    return structuredClone(this.inboundMessages);
  }

  async normalizeInboundMessage(
    input: SimulatedInboundEmailPayload,
  ): Promise<NormalizedInboundEmailMessage> {
    return normalizeInboundEmailPayload(input, this.provider);
  }
}
