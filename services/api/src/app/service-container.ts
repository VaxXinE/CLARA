import type { Env } from "../config/env";
import { FixtureActivityRepository } from "../activity/activity-repository";
import { DrizzleActivityRepository } from "../activity/activity-db-repository";
import { ActivityQueryService } from "../activity/activity-service";
import {
  DrizzleAuditLogRepository,
  FixtureAuditLogRepository,
} from "../audit/audit-log-repository";
import { AuditLogService } from "../audit/audit-log-service";
import { FixtureAiDraftRepository } from "../ai-drafts/ai-draft-repository";
import { DrizzleAiDraftRepository } from "../ai-drafts/ai-draft-db-repository";
import { MockAiDraftProvider } from "../ai-drafts/mock-ai-draft-provider";
import { AiDraftService } from "../ai-drafts/ai-draft-service";
import { AiReplySuggestionService } from "../ai/ai-reply-suggestion-service";
import { MockAiReplySuggestionProvider } from "../ai/mock-ai-reply-suggestion-provider";
import { AiDraftReviewService } from "../ai/ai-draft-review-service";
import { AiFollowUpRecommendationService } from "../ai/ai-follow-up-recommendation-service";
import { MockAiFollowUpRecommendationProvider } from "../ai/mock-ai-follow-up-recommendation-provider";
import { AiConversationSummaryService } from "../ai/ai-conversation-summary-service";
import { MockAiConversationSummaryProvider } from "../ai/mock-ai-conversation-summary-provider";
import { AiCustomerNoteSuggestionService } from "../ai/ai-customer-note-suggestion-service";
import { MockAiCustomerNoteSuggestionProvider } from "../ai/mock-ai-customer-note-suggestion-provider";
import { AiAutomationGuardrailService } from "../ai/ai-automation-guardrail-service";
import {
  DrizzleWorkspaceMembershipRepository,
  FixtureWorkspaceMembershipRepository,
} from "../auth/workspace-membership-repository";
import { WorkspaceMembershipService } from "../auth/workspace-membership-service";
import {
  DrizzleUserRoleManagementRepository,
  FixtureUserRoleManagementRepository,
} from "../auth/user-role-management-repository";
import { UserRoleManagementService } from "../auth/user-role-management-service";
import { ChannelAccountService } from "../channels/channel-account-service";
import { DrizzleChannelAccountRepository } from "../channels/channel-account-db-repository";
import { FixtureChannelAccountRepository } from "../channels/channel-account-repository";
import { ChannelHealthService } from "../channels/channel-health-service";
import { ChannelRegistryService } from "../channels/channel-registry-service";
import { DrizzleWebchatInboundRepository } from "../channels/webchat/webchat-inbound-db-repository";
import { WebchatInboundMaterializationService } from "../channels/webchat/webchat-inbound-materialization-service";
import { WebchatInboundPersistenceService } from "../channels/webchat/webchat-inbound-persistence-service";
import { FixtureWebchatInboundRepository } from "../channels/webchat/webchat-inbound-repository";
import { DrizzleWebchatOutboundDeliveryRepository } from "../channels/webchat/webchat-outbound-delivery-db-repository";
import { FixtureWebchatOutboundDeliveryRepository } from "../channels/webchat/webchat-outbound-delivery-repository";
import { WebchatReplySendService } from "../channels/webchat/webchat-reply-send-service";
import { SimulatedWebchatReplyAdapter } from "../channels/webchat/simulated-webchat-reply-adapter";
import { DrizzleWhatsappInboundRepository } from "../channels/whatsapp/whatsapp-inbound-db-repository";
import { WhatsappInboundMaterializationService } from "../channels/whatsapp/whatsapp-inbound-materialization-service";
import { WhatsappInboundPersistenceService } from "../channels/whatsapp/whatsapp-inbound-persistence-service";
import { FixtureWhatsappInboundRepository } from "../channels/whatsapp/whatsapp-inbound-repository";
import { DrizzleWhatsappOutboundDeliveryRepository } from "../channels/whatsapp/whatsapp-outbound-delivery-db-repository";
import { FixtureWhatsappOutboundDeliveryRepository } from "../channels/whatsapp/whatsapp-outbound-delivery-repository";
import { WhatsappReplySendService } from "../channels/whatsapp/whatsapp-reply-send-service";
import { SimulatedWhatsappOutboundSendClient } from "../channels/whatsapp/simulated-whatsapp-outbound-send-client";
import { createDatabase } from "../db/client";
import { createFixtureAppStore } from "../db/fixtures/fixture-store";
import { FixtureConversationRepository } from "../conversations/conversation-repository";
import { DrizzleConversationRepository } from "../conversations/conversation-db-repository";
import { ConversationQueryService } from "../conversations/conversation-service";
import { FixtureCustomerRepository } from "../customers/customer-repository";
import { DrizzleCustomerRepository } from "../customers/customer-db-repository";
import { CustomerQueryService } from "../customers/customer-service";
import { CustomerProfileIntelligenceService } from "../customers/customer-intelligence-service";
import { DrizzleExtensionSnapshotRepository } from "../extension/extension-snapshot-db-repository";
import { ExtensionSnapshotPersistenceService } from "../extension/extension-snapshot-persistence-service";
import { FixtureExtensionSnapshotRepository } from "../extension/extension-snapshot-repository";
import { FixtureReplyRepository } from "../replies/reply-repository";
import { DrizzleReplyRepository } from "../replies/reply-db-repository";
import { ReplyService } from "../replies/reply-service";
import { SimulatedReplySendProvider } from "../replies/simulated-reply-send-provider";

export type AppServices = {
  conversations: ConversationQueryService;
  customers: CustomerQueryService;
  customerIntelligence?: CustomerProfileIntelligenceService;
  activity: ActivityQueryService;
  aiDrafts: AiDraftService;
  aiDraftReviews?: AiDraftReviewService;
  aiReplySuggestions?: AiReplySuggestionService;
  aiFollowUpRecommendations?: AiFollowUpRecommendationService;
  aiConversationSummaries?: AiConversationSummaryService;
  aiCustomerNoteSuggestions?: AiCustomerNoteSuggestionService;
  aiAutomationGuardrails?: AiAutomationGuardrailService;
  replies: ReplyService;
  channelRegistry?: ChannelRegistryService;
  channelAccounts?: ChannelAccountService;
  channelHealth?: ChannelHealthService;
  webchatInbound?: WebchatInboundMaterializationService;
  webchatReply?: WebchatReplySendService;
  whatsappInbound?: WhatsappInboundMaterializationService;
  whatsappReply?: WhatsappReplySendService;
  extensionSnapshots?: ExtensionSnapshotPersistenceService;
  userRoleManagement?: UserRoleManagementService;
};

export type AuthServices = {
  workspaceMemberships: WorkspaceMembershipService;
};

export type AppServiceContainer = {
  services: AppServices;
  auth: AuthServices;
  close?: () => Promise<void>;
};

function shouldUseDatabaseRepositories(env: Env): boolean {
  return Boolean(env.DATABASE_URL);
}

export function createAppServiceContainer(env: Env): AppServiceContainer {
  if (shouldUseDatabaseRepositories(env)) {
    const { db, pool } = createDatabase(env);
    const conversationRepository = new DrizzleConversationRepository(db);
    const customerRepository = new DrizzleCustomerRepository(db);
    const channelAccountRepository = new DrizzleChannelAccountRepository(db);
    const webchatReply = new WebchatReplySendService(
      channelAccountRepository,
      new DrizzleWebchatOutboundDeliveryRepository(db),
      new SimulatedWebchatReplyAdapter(),
    );
    const whatsappReply = new WhatsappReplySendService(
      channelAccountRepository,
      new DrizzleWhatsappOutboundDeliveryRepository(db),
      new SimulatedWhatsappOutboundSendClient(),
    );
    const auditLogs = new AuditLogService(new DrizzleAuditLogRepository(db));
    const aiDraftRepository = new DrizzleAiDraftRepository(db);
    const aiDraftReviews = new AiDraftReviewService(
      conversationRepository,
      aiDraftRepository,
      auditLogs,
    );

    return {
      services: {
        conversations: new ConversationQueryService(conversationRepository),
        customers: new CustomerQueryService(customerRepository),
        customerIntelligence: new CustomerProfileIntelligenceService(
          customerRepository,
          conversationRepository,
        ),
        activity: new ActivityQueryService(
          new DrizzleActivityRepository(db),
          conversationRepository,
        ),
        aiDrafts: new AiDraftService(
          conversationRepository,
          aiDraftRepository,
          new MockAiDraftProvider(),
          auditLogs,
        ),
        aiDraftReviews,
        aiReplySuggestions: new AiReplySuggestionService(
          conversationRepository,
          new MockAiReplySuggestionProvider(),
          auditLogs,
        ),
        aiFollowUpRecommendations: new AiFollowUpRecommendationService(
          conversationRepository,
          new MockAiFollowUpRecommendationProvider(),
          auditLogs,
        ),
        aiConversationSummaries: new AiConversationSummaryService(
          conversationRepository,
          new MockAiConversationSummaryProvider(),
          auditLogs,
        ),
        aiCustomerNoteSuggestions: new AiCustomerNoteSuggestionService(
          conversationRepository,
          new MockAiCustomerNoteSuggestionProvider(),
          auditLogs,
        ),
        aiAutomationGuardrails: new AiAutomationGuardrailService(auditLogs),
        replies: new ReplyService(
          conversationRepository,
          new DrizzleReplyRepository(db),
          new SimulatedReplySendProvider(),
          auditLogs,
          undefined,
          {
            service: webchatReply,
          },
          {
            service: whatsappReply,
          },
          aiDraftReviews,
        ),
        channelRegistry: new ChannelRegistryService(),
        channelAccounts: new ChannelAccountService(channelAccountRepository),
        channelHealth: new ChannelHealthService(
          new ChannelAccountService(channelAccountRepository),
        ),
        webchatInbound: new WebchatInboundMaterializationService(
          channelAccountRepository,
          new WebchatInboundPersistenceService(
            new DrizzleWebchatInboundRepository(db),
          ),
        ),
        webchatReply,
        whatsappInbound: new WhatsappInboundMaterializationService(
          channelAccountRepository,
          new WhatsappInboundPersistenceService(
            new DrizzleWhatsappInboundRepository(db),
          ),
        ),
        whatsappReply,
        extensionSnapshots: new ExtensionSnapshotPersistenceService(
          new DrizzleExtensionSnapshotRepository(db),
          auditLogs,
        ),
        userRoleManagement: new UserRoleManagementService(
          new DrizzleUserRoleManagementRepository(db),
        ),
      },
      auth: {
        workspaceMemberships: new WorkspaceMembershipService(
          new DrizzleWorkspaceMembershipRepository(db),
        ),
      },
      close: async () => {
        await pool.end();
      },
    };
  }

  if (env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL is required in production so conversation, customer, activity, and related APIs do not fall back to fixture data.",
    );
  }

  const fixtureStore = createFixtureAppStore();
  const conversationRepository = new FixtureConversationRepository(
    fixtureStore,
  );
  const customerRepository = new FixtureCustomerRepository(fixtureStore);
  const channelAccountRepository = new FixtureChannelAccountRepository(
    fixtureStore,
  );
  const webchatReply = new WebchatReplySendService(
    channelAccountRepository,
    new FixtureWebchatOutboundDeliveryRepository(fixtureStore),
    new SimulatedWebchatReplyAdapter(),
  );
  const whatsappReply = new WhatsappReplySendService(
    channelAccountRepository,
    new FixtureWhatsappOutboundDeliveryRepository(fixtureStore),
    new SimulatedWhatsappOutboundSendClient(),
  );
  const auditLogs = new AuditLogService(
    new FixtureAuditLogRepository(fixtureStore),
  );
  const aiDraftRepository = new FixtureAiDraftRepository(fixtureStore);
  const aiDraftReviews = new AiDraftReviewService(
    conversationRepository,
    aiDraftRepository,
    auditLogs,
  );

  return {
    services: {
      conversations: new ConversationQueryService(conversationRepository),
      customers: new CustomerQueryService(customerRepository),
      customerIntelligence: new CustomerProfileIntelligenceService(
        customerRepository,
        conversationRepository,
      ),
      activity: new ActivityQueryService(
        new FixtureActivityRepository(fixtureStore),
        conversationRepository,
      ),
      aiDrafts: new AiDraftService(
        conversationRepository,
        aiDraftRepository,
        new MockAiDraftProvider(),
        auditLogs,
      ),
      aiDraftReviews,
      aiReplySuggestions: new AiReplySuggestionService(
        conversationRepository,
        new MockAiReplySuggestionProvider(),
        auditLogs,
      ),
      aiFollowUpRecommendations: new AiFollowUpRecommendationService(
        conversationRepository,
        new MockAiFollowUpRecommendationProvider(),
        auditLogs,
      ),
      aiConversationSummaries: new AiConversationSummaryService(
        conversationRepository,
        new MockAiConversationSummaryProvider(),
        auditLogs,
      ),
      aiCustomerNoteSuggestions: new AiCustomerNoteSuggestionService(
        conversationRepository,
        new MockAiCustomerNoteSuggestionProvider(),
        auditLogs,
      ),
      aiAutomationGuardrails: new AiAutomationGuardrailService(auditLogs),
      replies: new ReplyService(
        conversationRepository,
        new FixtureReplyRepository(fixtureStore),
        new SimulatedReplySendProvider(),
        auditLogs,
        undefined,
        {
          service: webchatReply,
        },
        {
          service: whatsappReply,
        },
        aiDraftReviews,
      ),
      channelRegistry: new ChannelRegistryService(),
      channelAccounts: new ChannelAccountService(channelAccountRepository),
      channelHealth: new ChannelHealthService(
        new ChannelAccountService(channelAccountRepository),
      ),
      webchatInbound: new WebchatInboundMaterializationService(
        channelAccountRepository,
        new WebchatInboundPersistenceService(
          new FixtureWebchatInboundRepository(fixtureStore),
        ),
      ),
      webchatReply,
      whatsappInbound: new WhatsappInboundMaterializationService(
        channelAccountRepository,
        new WhatsappInboundPersistenceService(
          new FixtureWhatsappInboundRepository(fixtureStore),
        ),
      ),
      whatsappReply,
      extensionSnapshots: new ExtensionSnapshotPersistenceService(
        new FixtureExtensionSnapshotRepository(),
        auditLogs,
      ),
      userRoleManagement: new UserRoleManagementService(
        new FixtureUserRoleManagementRepository(),
      ),
    },
    auth: {
      workspaceMemberships: new WorkspaceMembershipService(
        new FixtureWorkspaceMembershipRepository(),
      ),
    },
  };
}
