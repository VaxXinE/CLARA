import { NotFoundError } from "../../errors/app-error";
import type { ChannelAccountRepository } from "../channel-account-repository";
import type { WebchatInboundPersistenceService } from "./webchat-inbound-persistence-service";
import type {
  NormalizedWebchatInboundMessage,
  PersistWebchatInboundResult,
} from "./webchat-inbound-types";

export class WebchatInboundMaterializationService {
  constructor(
    private readonly channelAccounts: Pick<
      ChannelAccountRepository,
      "findByProviderExternalAccount"
    >,
    private readonly persistence: Pick<
      WebchatInboundPersistenceService,
      "persistInboundMessage"
    >,
  ) {}

  async materialize(input: {
    message: NormalizedWebchatInboundMessage;
  }): Promise<PersistWebchatInboundResult> {
    const account = await this.channelAccounts.findByProviderExternalAccount(
      "webchat",
      input.message.channelPublicKey,
    );

    if (!account || account.status !== "connected") {
      throw new NotFoundError("Webchat channel account not found.");
    }

    return this.persistence.persistInboundMessage({
      scope: {
        organizationId: account.organizationId,
        workspaceId: account.workspaceId,
      },
      channelAccountId: account.id,
      message: input.message,
    });
  }
}
