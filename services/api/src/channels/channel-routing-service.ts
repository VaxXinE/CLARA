import { ValidationError } from "../errors/app-error";
import type {
  ChannelRoute,
  RoutedChannelProvider,
} from "./channel-routing-types";

export class ChannelRoutingService {
  resolve(source: string): ChannelRoute {
    const normalized = source.trim().toLowerCase();
    const provider: RoutedChannelProvider =
      normalized === "email" ||
      normalized === "gmail" ||
      normalized.includes("gmail")
        ? "gmail"
        : normalized === "webchat"
          ? "webchat"
          : normalized === "whatsapp"
            ? "whatsapp"
            : "default";

    return {
      provider,
      source,
    };
  }

  assertProvider(source: string, expected: RoutedChannelProvider): void {
    const route = this.resolve(source);

    if (route.provider !== expected) {
      throw new ValidationError("Conversation source does not match provider.");
    }
  }
}
