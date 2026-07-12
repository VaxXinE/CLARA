import { channelRegistry } from "./channel-registry";
import type { ChannelCapability } from "./channel-registry-types";

export class ChannelRegistryService {
  listCapabilities(): ChannelCapability[] {
    return channelRegistry.capabilities.map((capability) => ({
      ...capability,
    }));
  }
}
