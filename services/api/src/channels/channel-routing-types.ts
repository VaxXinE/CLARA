export type RoutedChannelProvider =
  "gmail" | "webchat" | "whatsapp" | "default";

export type ChannelRoute = {
  provider: RoutedChannelProvider;
  source: string;
};
