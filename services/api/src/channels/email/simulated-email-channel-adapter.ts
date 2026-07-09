import type { EmailChannelAdapter } from "./email-channel-adapter";
import { normalizeInboundEmailPayload } from "./email-normalizer";
import type {
  NormalizedInboundEmailMessage,
  SimulatedInboundEmailPayload,
} from "./email-channel-types";

export class SimulatedEmailChannelAdapter implements EmailChannelAdapter<SimulatedInboundEmailPayload> {
  readonly provider = "simulated-email";

  async normalizeInboundMessage(
    input: SimulatedInboundEmailPayload,
  ): Promise<NormalizedInboundEmailMessage> {
    return normalizeInboundEmailPayload(input, this.provider);
  }
}
