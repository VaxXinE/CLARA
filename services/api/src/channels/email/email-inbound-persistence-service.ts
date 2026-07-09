import type { WorkspaceScope } from "../../workspace/workspace-scope";
import type { NormalizedInboundEmailMessage } from "./email-channel-types";
import type {
  EmailInboundRepository,
  PersistInboundEmailResult,
} from "./email-inbound-repository";

export class EmailInboundPersistenceService {
  constructor(private readonly repository: EmailInboundRepository) {}

  async persistInboundEmail(input: {
    scope: WorkspaceScope;
    email: NormalizedInboundEmailMessage;
  }): Promise<PersistInboundEmailResult> {
    return this.repository.persistInboundEmail(input);
  }
}
