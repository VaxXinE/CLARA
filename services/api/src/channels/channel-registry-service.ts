import { channelCapabilities } from "./channel-capabilities";
import type { ChannelCapability } from "./channel-registry-types";

export class ChannelRegistryService {
  listCapabilities(): ChannelCapability[] {
    return channelCapabilities.map((capability) => ({ ...capability }));
  }
}
