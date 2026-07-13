import type { ChannelAccountRepository } from "../channel-account-repository";
import { NotFoundError } from "../../errors/app-error";
import type { WhatsappInboundPersistenceService } from "./whatsapp-inbound-persistence-service";
import type {
  NormalizedWhatsappInboundMessage,
  PersistWhatsappInboundResult,
} from "./whatsapp-webhook-types";

export class WhatsappInboundMaterializationService {
  constructor(
    private readonly channelAccounts: Pick<
      ChannelAccountRepository,
      "findByProviderExternalAccount"
    >,
    private readonly persistence: Pick<
      WhatsappInboundPersistenceService,
      "persist"
    >,
  ) {}

  async materialize(input: {
    phoneNumberId: string;
    message: NormalizedWhatsappInboundMessage;
  }): Promise<PersistWhatsappInboundResult> {
    const account = await this.channelAccounts.findByProviderExternalAccount(
      "whatsapp",
      input.phoneNumberId,
    );

    if (!account || account.status !== "connected") {
      throw new NotFoundError("WhatsApp channel account not found.");
    }

    return this.persistence.persist({
      scope: {
        organizationId: account.organizationId,
        workspaceId: account.workspaceId,
      },
      channelAccountId: account.id,
      message: input.message,
    });
  }
}
