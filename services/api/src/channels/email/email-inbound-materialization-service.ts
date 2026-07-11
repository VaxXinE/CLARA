import { EmailInboundPersistenceService } from "./email-inbound-persistence-service";
import type {
  EmailInboundMaterializer,
  MaterializeInboundEmailInput,
  MaterializeInboundEmailResult,
} from "./email-inbound-materialization-types";

export class EmailInboundMaterializationService implements EmailInboundMaterializer {
  constructor(
    private readonly persistence: Pick<
      EmailInboundPersistenceService,
      "persistInboundEmail"
    >,
  ) {}

  async materialize(
    input: MaterializeInboundEmailInput,
  ): Promise<MaterializeInboundEmailResult> {
    const persisted = await this.persistence.persistInboundEmail({
      scope: input.scope,
      email: input.envelope.email,
    });

    return {
      customerId: persisted.customerId,
      conversationId: persisted.conversationId,
      activityId: persisted.activityId,
      alreadyProcessed: persisted.alreadyProcessed,
    };
  }
}
