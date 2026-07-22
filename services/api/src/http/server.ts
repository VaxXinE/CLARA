import fastify, {
  LogController,
  type FastifyInstance,
  type FastifyRequest,
} from "fastify";
import helmet from "@fastify/helmet";
import { createAuthProvider, type AuthProvider } from "../auth/auth-provider";
import type { Env } from "../config/env";
import {
  type AuthServices,
  createAppServiceContainer,
  type AppServices,
} from "../app/service-container";
import { createLoggerOptions } from "../logging/logger";
import {
  generateRequestId,
  registerCorrelationIdHook,
} from "./middleware/correlation-id";
import { getRequestBodyLimitBytes } from "./middleware/request-size-limit";
import { registerRequestLogging } from "./middleware/request-logging";
import { createGlobalRateLimitPreHandler } from "./middleware/rate-limit";
import { registerErrorHandlers } from "../errors/error-handler";
import { registerHealthRoutes } from "./routes/health";
import { registerMeRoutes } from "./routes/me";
import { registerConversationRoutes } from "./routes/conversations";
import { registerCustomerActionProposalRoutes } from "./routes/customer-action-proposals";
import { registerCustomerFollowUpProposalRoutes } from "./routes/customer-follow-up-proposals";
import { registerCustomerLifecycleStatusReadinessRoutes } from "./routes/customer-lifecycle-status-readiness";
import { registerCustomerOwnerAssignmentReadinessRoutes } from "./routes/customer-owner-assignment-readiness";
import { registerCustomerRoutes } from "./routes/customers";
import { registerCustomerIntelligenceRoutes } from "./routes/customer-intelligence";
import { registerCustomerTimelineIntelligenceRoutes } from "./routes/customer-timeline-intelligence";
import { registerActivityRoutes } from "./routes/activity";
import { registerAiDraftRoutes } from "./routes/ai-drafts";
import { registerAiDraftReviewRoutes } from "./routes/ai-draft-reviews";
import { registerAiReplySuggestionRoutes } from "./routes/ai-reply-suggestions";
import { registerAiFollowUpRecommendationRoutes } from "./routes/ai-follow-up-recommendations";
import { registerAiConversationSummaryRoutes } from "./routes/ai-conversation-summaries";
import { registerAiCustomerNoteSuggestionRoutes } from "./routes/ai-customer-note-suggestions";
import { registerAiAutomationGuardrailRoutes } from "./routes/ai-automation-guardrails";
import { registerReplyRoutes } from "./routes/replies";
import { registerChannelRoutes } from "./routes/channels";
import { AnalyticsReadModelService } from "../analytics/analytics-read-model-service";
import { registerAnalyticsReadinessRoutes } from "./routes/analytics-readiness";
import { registerAnalyticsMetricCatalogRoutes } from "./routes/analytics-metric-catalog";
import { ConversationVolumeMetricsService } from "../analytics/conversation-volume-metrics-service";
import { ResponseTimeSlaMetricsService } from "../analytics/response-time-sla-metrics-service";
import { ChannelPerformanceMetricsService } from "../analytics/channel-performance-metrics-service";
import { CrmWorkflowMetricsService } from "../analytics/crm-workflow-metrics-service";
import { KpiDashboardCardService } from "../analytics/kpi-dashboard-card-service";
import { registerAnalyticsConversationVolumeRoutes } from "./routes/analytics-conversation-volume";
import { registerAnalyticsResponseTimeSlaRoutes } from "./routes/analytics-response-time-sla";
import { registerAnalyticsChannelPerformanceRoutes } from "./routes/analytics-channel-performance";
import { registerAnalyticsOverviewRoutes } from "./routes/analytics-overview";
import { registerAnalyticsCrmWorkflowRoutes } from "./routes/analytics-crm-workflow";
import { registerAnalyticsKpiDashboardRoutes } from "./routes/analytics-kpi-dashboard";
import { PermissionAuditReadinessService } from "../enterprise/permission-audit-service";
import { TenantIsolationReadinessService } from "../enterprise/tenant-isolation-readiness-service";
import { AuditRetentionReadinessService } from "../enterprise/audit-retention-readiness-service";
import { AdminSecurityControlsService } from "../enterprise/admin-security-controls-service";
import { BackupRestoreReadinessService } from "../enterprise/backup-restore-readiness-service";
import { ComplianceDashboardService } from "../enterprise/compliance-dashboard-service";
import { DataClassificationRuntimeService } from "../enterprise/data-classification-runtime-service";
import { EvidenceReadinessService } from "../enterprise/evidence-readiness-service";
import { IncidentResponseReadinessService } from "../enterprise/incident-response-readiness-service";
import { RedactionHardeningService } from "../enterprise/redaction-hardening-service";
import { SessionPolicyReadinessService } from "../enterprise/session-policy-readiness-service";
import { registerReliabilityQueueJobReadinessRoutes } from "./routes/reliability-queue-job-readiness";
import { registerRateLimitQuotaUsageReadinessRoutes } from "./routes/rate-limit-quota-usage-readiness";
import { registerReliabilityObservabilitySloAlertReadinessRoutes } from "./routes/reliability-observability-slo-alert-readiness";
import { registerBillingPlanEntitlementReadinessRoutes } from "./routes/billing-plan-entitlement-readiness";
import { registerPerformanceCapacityReadinessRoutes } from "./routes/performance-capacity-readiness";
import { registerEnterpriseAdminSecurityControlsReadinessRoutes } from "./routes/enterprise-admin-security-controls-readiness";
import { registerEnterpriseAuditRetentionReadinessRoutes } from "./routes/enterprise-audit-retention-readiness";
import { registerEnterpriseBackupRestoreReadinessRoutes } from "./routes/enterprise-backup-restore-readiness";
import { registerEnterpriseComplianceDashboardRoutes } from "./routes/enterprise-compliance-dashboard";
import { registerEnterpriseDataClassificationReadinessRoutes } from "./routes/enterprise-data-classification-readiness";
import { registerEnterpriseEvidenceReadinessRoutes } from "./routes/enterprise-evidence-readiness";
import { registerEnterpriseIncidentResponseReadinessRoutes } from "./routes/enterprise-incident-response-readiness";
import { registerEnterprisePermissionAuditReadinessRoutes } from "./routes/enterprise-permission-audit-readiness";
import { registerEnterpriseRedactionHardeningReadinessRoutes } from "./routes/enterprise-redaction-hardening-readiness";
import { registerEnterpriseSessionPolicyReadinessRoutes } from "./routes/enterprise-session-policy-readiness";
import { registerEnterpriseTenantIsolationReadinessRoutes } from "./routes/enterprise-tenant-isolation-readiness";
import { registerWebchatRoutes } from "./routes/webchat";
import { registerWhatsappRoutes } from "./routes/whatsapp";
import { registerExtensionRoutes } from "./routes/extension";
import { registerUserRoleManagementRoutes } from "./routes/user-role-management";
import type { GmailOAuthConnectService } from "../channels/email/gmail-oauth-connect-service";
import type { GmailOAuthCallbackService } from "../channels/email/gmail-oauth-callback-service";
import type { GmailConnectionHealthService } from "../channels/email/gmail-connection-health-service";
import type { GmailInboundE2ESmokeService } from "../channels/email/gmail-inbound-e2e-smoke-service";
import type { GmailInboundSyncService } from "../channels/email/gmail-inbound-sync-service";
import type { GmailInboundSyncSchedulerRuntimeService } from "../channels/email/gmail-inbound-sync-scheduler-runtime-service";
import type { GmailOutboundSendService } from "../channels/email/gmail-outbound-send-service";
import type { EmailOutboundDeliveryService } from "../channels/email/email-outbound-delivery-service";
import type { AuditLogService } from "../audit/audit-log-service";
import { registerGmailIntegrationRoutes } from "./routes/gmail-integrations";
import { SimulatedWebchatChannelAdapter } from "../channels/webchat/simulated-webchat-channel-adapter";
import { readWhatsappProviderConfig } from "../channels/whatsapp/whatsapp-provider-config";
import { WhatsappWebhookVerificationService } from "../channels/whatsapp/whatsapp-webhook-verification-service";

export type CreateServerOptions = {
  env: Env;
  services?: AppServices;
  authServices?: AuthServices;
  authProvider?: AuthProvider;
  gmailOAuthConnectService?: GmailOAuthConnectService;
  gmailOAuthCallbackService?: GmailOAuthCallbackService;
  gmailConnectionHealthService?: GmailConnectionHealthService;
  gmailInboundSyncService?: Pick<GmailInboundSyncService, "syncMessages">;
  gmailInboundE2ESmokeService?: Pick<GmailInboundE2ESmokeService, "runSmoke">;
  gmailOutboundSendService?: Pick<GmailOutboundSendService, "send">;
  gmailOutboundDeliveryService?: Pick<
    EmailOutboundDeliveryService,
    "getGmailOutboundStatus"
  >;
  gmailInboundSyncSchedulerRuntime?: Pick<
    GmailInboundSyncSchedulerRuntimeService,
    "start" | "stop" | "isRunning" | "getStatus" | "tickNow"
  >;
  gmailInboundSyncSchedulerStatus?: Pick<
    GmailInboundSyncSchedulerRuntimeService,
    "getStatus"
  > &
    Partial<Pick<GmailInboundSyncSchedulerRuntimeService, "tickNow">>;
  gmailSchedulerAuditLogService?: Pick<
    AuditLogService,
    "recordGmailSchedulerOperatorAction"
  >;
  analyticsReadModelService?: AnalyticsReadModelService;
  tenantIsolationReadinessService?: TenantIsolationReadinessService;
  permissionAuditReadinessService?: PermissionAuditReadinessService;
  auditRetentionReadinessService?: AuditRetentionReadinessService;
  dataClassificationRuntimeService?: DataClassificationRuntimeService;
  redactionHardeningService?: RedactionHardeningService;
  adminSecurityControlsService?: AdminSecurityControlsService;
  sessionPolicyReadinessService?: SessionPolicyReadinessService;
  complianceDashboardService?: ComplianceDashboardService;
  backupRestoreReadinessService?: BackupRestoreReadinessService;
  incidentResponseReadinessService?: IncidentResponseReadinessService;
  evidenceReadinessService?: EvidenceReadinessService;
};

export type RequestWithRawBody = FastifyRequest & {
  rawBody?: string;
};

function registerJsonRawBodyParser(app: FastifyInstance): void {
  app.removeContentTypeParser("application/json");
  app.addContentTypeParser(
    "application/json",
    {
      parseAs: "string",
    },
    (request, body, done) => {
      const rawBody = typeof body === "string" ? body : body.toString("utf8");

      (request as RequestWithRawBody).rawBody = rawBody;

      try {
        done(null, rawBody.length > 0 ? JSON.parse(rawBody) : {});
      } catch (error) {
        done(error as Error, undefined);
      }
    },
  );
}

function parseAllowedCorsOrigins(value: string): Set<string> {
  return new Set(
    value
      .split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
  );
}

function registerCorsHook(app: FastifyInstance, env: Env): void {
  const allowedOrigins = parseAllowedCorsOrigins(env.CORS_ORIGIN);

  if (allowedOrigins.size === 0) {
    return;
  }

  app.addHook("onRequest", async (request, reply) => {
    const origin = request.headers.origin;

    if (origin && allowedOrigins.has(origin)) {
      reply.header("access-control-allow-origin", origin);
      reply.header("vary", "Origin");
      reply.header(
        "access-control-allow-methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      );
      reply.header(
        "access-control-allow-headers",
        [
          "authorization",
          "content-type",
          "x-correlation-id",
          "x-mock-organization-id",
          "x-mock-role",
          "x-mock-user-id",
          "x-mock-workspace-id",
        ].join(","),
      );
    }

    if (request.method === "OPTIONS") {
      return reply
        .status(origin && allowedOrigins.has(origin) ? 204 : 403)
        .send();
    }
  });
}

const disabledGmailSchedulerStatus: Pick<
  GmailInboundSyncSchedulerRuntimeService,
  "getStatus"
> = {
  getStatus: () => ({
    scheduler_enabled: false,
    scheduler_running: false,
    interval_ms: 300_000,
    max_accounts_per_tick: 10,
    max_messages_per_account: 25,
  }),
};

export async function createServer(
  options: CreateServerOptions,
): Promise<FastifyInstance> {
  const serviceContainer =
    options.services && (options.authServices || options.authProvider)
      ? undefined
      : createAppServiceContainer(options.env);
  const services = options.services ?? serviceContainer?.services;
  const authServices = options.authServices ?? serviceContainer?.auth;

  if (!services) {
    throw new Error("API services must be configured.");
  }

  if (!options.authProvider && !authServices) {
    throw new Error("Auth services must be configured for provider auth.");
  }

  const authProvider: AuthProvider = (() => {
    if (options.authProvider) {
      return options.authProvider;
    }

    if (!authServices) {
      throw new Error("Auth services must be configured for provider auth.");
    }

    return createAuthProvider(options.env, {
      workspaceMembershipService: authServices.workspaceMemberships,
    });
  })();
  const app = fastify({
    logger: createLoggerOptions(options.env),
    genReqId: generateRequestId,
    trustProxy: false,
    bodyLimit: getRequestBodyLimitBytes(options.env),
    logController: new LogController({
      disableRequestLogging: true,
    }),
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  registerJsonRawBodyParser(app);
  registerCorsHook(app, options.env);
  registerCorrelationIdHook(app);
  registerRequestLogging(app);
  registerErrorHandlers(app, options.env);
  app.addHook(
    "preHandler",
    createGlobalRateLimitPreHandler({
      env: options.env,
    }),
  );

  await registerHealthRoutes(app, options.env);
  await registerMeRoutes(app, authProvider);
  await registerConversationRoutes(app, authProvider, services.conversations);
  await registerCustomerRoutes(app, authProvider, services.customers);
  if (services.customerActionProposals) {
    await registerCustomerActionProposalRoutes(
      app,
      authProvider,
      services.customerActionProposals,
    );
  }
  if (services.customerFollowUpProposals) {
    await registerCustomerFollowUpProposalRoutes(
      app,
      authProvider,
      services.customerFollowUpProposals,
    );
  }
  if (services.customerOwnerAssignmentReadiness) {
    await registerCustomerOwnerAssignmentReadinessRoutes(
      app,
      authProvider,
      services.customerOwnerAssignmentReadiness,
    );
  }
  if (services.customerLifecycleStatusReadiness) {
    await registerCustomerLifecycleStatusReadinessRoutes(
      app,
      authProvider,
      services.customerLifecycleStatusReadiness,
    );
  }
  if (services.customerIntelligence) {
    await registerCustomerIntelligenceRoutes(
      app,
      authProvider,
      services.customerIntelligence,
    );
  }
  if (services.customerTimelineIntelligence) {
    await registerCustomerTimelineIntelligenceRoutes(
      app,
      authProvider,
      services.customerTimelineIntelligence,
    );
  }
  await registerActivityRoutes(app, authProvider, services.activity);
  await registerAiDraftRoutes(
    app,
    authProvider,
    services.aiDrafts,
    options.env,
  );
  if (services.aiDraftReviews) {
    await registerAiDraftReviewRoutes(
      app,
      authProvider,
      services.aiDraftReviews,
      options.env,
    );
  }
  if (services.aiReplySuggestions) {
    await registerAiReplySuggestionRoutes(
      app,
      authProvider,
      services.aiReplySuggestions,
      options.env,
    );
  }
  if (services.aiFollowUpRecommendations) {
    await registerAiFollowUpRecommendationRoutes(
      app,
      authProvider,
      services.aiFollowUpRecommendations,
      options.env,
    );
  }
  if (services.aiConversationSummaries) {
    await registerAiConversationSummaryRoutes(
      app,
      authProvider,
      services.aiConversationSummaries,
      options.env,
    );
  }
  if (services.aiCustomerNoteSuggestions) {
    await registerAiCustomerNoteSuggestionRoutes(
      app,
      authProvider,
      services.aiCustomerNoteSuggestions,
      options.env,
    );
  }
  if (services.aiAutomationGuardrails) {
    await registerAiAutomationGuardrailRoutes(
      app,
      authProvider,
      services.aiAutomationGuardrails,
      options.env,
    );
  }
  await registerReplyRoutes(app, authProvider, services.replies, options.env);
  const analyticsReadModelService =
    options.analyticsReadModelService ?? new AnalyticsReadModelService();
  await registerAnalyticsReadinessRoutes(
    app,
    authProvider,
    analyticsReadModelService,
  );
  await registerAnalyticsMetricCatalogRoutes(
    app,
    authProvider,
    analyticsReadModelService,
  );
  await registerEnterpriseTenantIsolationReadinessRoutes(
    app,
    authProvider,
    options.tenantIsolationReadinessService ??
      new TenantIsolationReadinessService(),
  );
  await registerEnterprisePermissionAuditReadinessRoutes(
    app,
    authProvider,
    options.permissionAuditReadinessService ??
      new PermissionAuditReadinessService(),
  );
  await registerEnterpriseAuditRetentionReadinessRoutes(
    app,
    authProvider,
    options.auditRetentionReadinessService ??
      new AuditRetentionReadinessService(),
  );
  await registerEnterpriseDataClassificationReadinessRoutes(
    app,
    authProvider,
    options.dataClassificationRuntimeService ??
      new DataClassificationRuntimeService(),
  );
  await registerEnterpriseRedactionHardeningReadinessRoutes(
    app,
    authProvider,
    options.redactionHardeningService ?? new RedactionHardeningService(),
  );
  await registerEnterpriseAdminSecurityControlsReadinessRoutes(
    app,
    authProvider,
    options.adminSecurityControlsService ?? new AdminSecurityControlsService(),
  );
  await registerEnterpriseSessionPolicyReadinessRoutes(
    app,
    authProvider,
    options.sessionPolicyReadinessService ??
      new SessionPolicyReadinessService(),
  );
  await registerEnterpriseComplianceDashboardRoutes(
    app,
    authProvider,
    options.complianceDashboardService ?? new ComplianceDashboardService(),
  );
  await registerEnterpriseBackupRestoreReadinessRoutes(
    app,
    authProvider,
    options.backupRestoreReadinessService ??
      new BackupRestoreReadinessService(),
  );
  await registerEnterpriseIncidentResponseReadinessRoutes(
    app,
    authProvider,
    options.incidentResponseReadinessService ??
      new IncidentResponseReadinessService(),
  );
  await registerEnterpriseEvidenceReadinessRoutes(
    app,
    authProvider,
    options.evidenceReadinessService ?? new EvidenceReadinessService(),
  );
  await registerReliabilityQueueJobReadinessRoutes(app, authProvider);
  await registerRateLimitQuotaUsageReadinessRoutes(app, authProvider);
  await registerReliabilityObservabilitySloAlertReadinessRoutes(
    app,
    authProvider,
  );
  await registerBillingPlanEntitlementReadinessRoutes(app, authProvider);
  await registerPerformanceCapacityReadinessRoutes(app, authProvider);
  if (services.channelHealth) {
    const conversationVolumeMetrics = new ConversationVolumeMetricsService(
      services.conversations,
    );
    const responseTimeSlaMetrics = new ResponseTimeSlaMetricsService(
      services.conversations,
    );
    const channelPerformanceMetrics = new ChannelPerformanceMetricsService(
      services.channelHealth,
    );
    const crmWorkflowMetrics = new CrmWorkflowMetricsService();
    const kpiDashboardCards = new KpiDashboardCardService(
      conversationVolumeMetrics,
      responseTimeSlaMetrics,
      channelPerformanceMetrics,
      crmWorkflowMetrics,
    );

    await registerAnalyticsConversationVolumeRoutes(
      app,
      authProvider,
      conversationVolumeMetrics,
    );
    await registerAnalyticsResponseTimeSlaRoutes(
      app,
      authProvider,
      responseTimeSlaMetrics,
    );
    await registerAnalyticsChannelPerformanceRoutes(
      app,
      authProvider,
      channelPerformanceMetrics,
    );
    await registerAnalyticsOverviewRoutes(app, authProvider, {
      conversationVolume: conversationVolumeMetrics,
      responseTimeSla: responseTimeSlaMetrics,
      channelPerformance: channelPerformanceMetrics,
    });
    await registerAnalyticsCrmWorkflowRoutes(
      app,
      authProvider,
      crmWorkflowMetrics,
    );
    await registerAnalyticsKpiDashboardRoutes(
      app,
      authProvider,
      kpiDashboardCards,
    );
  }
  if (services.channelRegistry && services.channelAccounts) {
    await registerChannelRoutes(
      app,
      authProvider,
      services.channelRegistry,
      services.channelAccounts,
      services.channelHealth,
    );
  }
  if (services.webchatInbound) {
    await registerWebchatRoutes(
      app,
      new SimulatedWebchatChannelAdapter(),
      services.webchatInbound,
      authProvider,
      services.webchatReply,
    );
  }
  if (services.whatsappInbound) {
    await registerWhatsappRoutes(
      app,
      new WhatsappWebhookVerificationService(
        readWhatsappProviderConfig(options.env),
      ),
      services.whatsappInbound,
    );
  }
  if (services.extensionSnapshots) {
    await registerExtensionRoutes(
      app,
      authProvider,
      services.extensionSnapshots,
    );
  }
  if (services.userRoleManagement) {
    await registerUserRoleManagementRoutes(
      app,
      authProvider,
      services.userRoleManagement,
    );
  }
  const gmailIntegrationServices: {
    connect?: GmailOAuthConnectService;
    callback?: GmailOAuthCallbackService;
    health?: GmailConnectionHealthService;
    sync?: Pick<GmailInboundSyncService, "syncMessages">;
    inboundSmoke?: Pick<GmailInboundE2ESmokeService, "runSmoke">;
    scheduler: Pick<GmailInboundSyncSchedulerRuntimeService, "getStatus"> &
      Partial<Pick<GmailInboundSyncSchedulerRuntimeService, "tickNow">>;
    auditLogs?: Pick<AuditLogService, "recordGmailSchedulerOperatorAction">;
    outboundSend?: Pick<GmailOutboundSendService, "send">;
    outboundDeliveries?: Pick<
      EmailOutboundDeliveryService,
      "getGmailOutboundStatus"
    >;
  } = {
    scheduler:
      options.gmailInboundSyncSchedulerStatus ??
      options.gmailInboundSyncSchedulerRuntime ??
      disabledGmailSchedulerStatus,
  };

  if (options.gmailOAuthConnectService) {
    gmailIntegrationServices.connect = options.gmailOAuthConnectService;
  }

  if (options.gmailOAuthCallbackService) {
    gmailIntegrationServices.callback = options.gmailOAuthCallbackService;
  }

  if (options.gmailConnectionHealthService) {
    gmailIntegrationServices.health = options.gmailConnectionHealthService;
  }

  if (options.gmailInboundSyncService) {
    gmailIntegrationServices.sync = options.gmailInboundSyncService;
  }

  if (options.gmailInboundE2ESmokeService) {
    gmailIntegrationServices.inboundSmoke = options.gmailInboundE2ESmokeService;
  }

  if (options.gmailOutboundSendService) {
    gmailIntegrationServices.outboundSend = options.gmailOutboundSendService;
  }

  if (options.gmailOutboundDeliveryService) {
    gmailIntegrationServices.outboundDeliveries =
      options.gmailOutboundDeliveryService;
  }

  if (options.gmailSchedulerAuditLogService) {
    gmailIntegrationServices.auditLogs = options.gmailSchedulerAuditLogService;
  }

  await registerGmailIntegrationRoutes(
    app,
    authProvider,
    gmailIntegrationServices,
  );

  if (options.gmailInboundSyncSchedulerRuntime) {
    const runtime = options.gmailInboundSyncSchedulerRuntime;
    let bootstrapAttempted = false;

    app.addHook("onReady", async () => {
      if (bootstrapAttempted) {
        return;
      }

      bootstrapAttempted = true;

      try {
        const started = runtime.start();
        app.log.info(
          {
            scheduler_enabled: started,
            scheduler_running: runtime.isRunning(),
            ...(started ? { started_at: new Date().toISOString() } : {}),
          },
          "Gmail inbound sync scheduler lifecycle bootstrap complete",
        );
      } catch (error) {
        app.log.error(
          {
            err: error,
            scheduler_enabled: false,
            scheduler_running: false,
          },
          "Gmail inbound sync scheduler lifecycle bootstrap failed",
        );
      }
    });

    app.addHook("onClose", async () => {
      try {
        runtime.stop();
        app.log.info(
          {
            scheduler_running: runtime.isRunning(),
            stopped_at: new Date().toISOString(),
          },
          "Gmail inbound sync scheduler lifecycle shutdown complete",
        );
      } catch (error) {
        app.log.error(
          {
            err: error,
            scheduler_running: false,
          },
          "Gmail inbound sync scheduler lifecycle shutdown failed",
        );
      }
    });
  }

  if (serviceContainer?.close) {
    app.addHook("onClose", async () => {
      await serviceContainer.close?.();
    });
  }

  return app;
}
