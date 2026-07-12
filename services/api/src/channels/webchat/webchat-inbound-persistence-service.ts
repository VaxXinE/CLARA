import type { WebchatInboundRepository } from "./webchat-inbound-repository";
import type {
  PersistWebchatInboundInput,
  PersistWebchatInboundResult,
} from "./webchat-inbound-types";

export class WebchatInboundPersistenceService {
  constructor(private readonly repository: WebchatInboundRepository) {}

  persistInboundMessage(
    input: PersistWebchatInboundInput,
  ): Promise<PersistWebchatInboundResult> {
    return this.repository.persistInboundMessage(input);
  }
}
