import type { WhatsappInboundRepository } from "./whatsapp-inbound-repository";
import type {
  PersistWhatsappInboundInput,
  PersistWhatsappInboundResult,
} from "./whatsapp-webhook-types";

export class WhatsappInboundPersistenceService {
  constructor(private readonly repository: WhatsappInboundRepository) {}

  persist(
    input: PersistWhatsappInboundInput,
  ): Promise<PersistWhatsappInboundResult> {
    return this.repository.persistInboundMessage(input);
  }
}
