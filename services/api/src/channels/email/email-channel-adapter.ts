import type {
  NormalizedInboundEmailMessage,
  SimulatedInboundEmailPayload,
} from "./email-channel-types";

export interface EmailChannelAdapter<TInboundMessage = unknown> {
  readonly provider: string;

  normalizeInboundMessage(
    input: TInboundMessage,
  ): Promise<NormalizedInboundEmailMessage>;
}

export type SimulatedEmailChannelAdapter =
  EmailChannelAdapter<SimulatedInboundEmailPayload>;

export interface EmailBatchLoadingAdapter<
  TInboundMessage = unknown,
> extends EmailChannelAdapter<TInboundMessage> {
  loadInboundMessages(): Promise<TInboundMessage[]>;
}
