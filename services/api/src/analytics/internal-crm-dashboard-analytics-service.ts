import type { AuthContext } from "../auth/auth-context";
import type { AuditLogRepository } from "../audit/audit-log-repository";
import type { ConversationRepository } from "../conversations/conversation-repository";
import type { CustomerFollowUpTaskRepository } from "../customers/customer-follow-up-task-repository";
import type { CustomerRepository } from "../customers/customer-repository";
import type { WorkspaceScope } from "../workspace/workspace-scope";

export const internalCrmDashboardTimeWindows = ["7d", "30d", "90d"] as const;

export type InternalCrmDashboardTimeWindow =
  (typeof internalCrmDashboardTimeWindows)[number];

export type InternalCrmDashboardAnalyticsQuery = {
  timeWindow?: InternalCrmDashboardTimeWindow;
};

export type InternalCrmDashboardAnalyticsResponse = {
  workspaceId: string;
  generatedAt: string;
  timeWindow: InternalCrmDashboardTimeWindow;
  customers: {
    total: number;
    new: number;
    active: number;
  };
  lifecycle: {
    summary: Array<{ status: string; count: number }>;
  };
  owners: {
    summary: Array<{
      ownerUserId: string | null;
      totalCustomers: number;
      activeCustomers: number;
    }>;
  };
  conversations: {
    total: number;
    linkedToCustomer: number;
    unlinked: number;
  };
  followUps: {
    open: number;
    overdue: number;
    byAssignee: Array<{ assigneeUserId: string | null; openCount: number }>;
  };
  activity: {
    recentCrmActivityCount: number;
  };
  workflow: {
    reviewOnly: true;
    mutationAllowed: false;
    billingPaymentDeferred: true;
  };
  health: {
    status: "healthy" | "attention";
    reasonCodes: string[];
  };
  safety: {
    aggregated: true;
    workspaceScoped: true;
    readOnly: true;
    rawPayloadIncluded: false;
    tokensIncluded: false;
    billingPaymentIncluded: false;
    providerAiOutboundIncluded: false;
    heavyAnalyticsJobCreated: false;
    exportCreated: false;
  };
};

const windowDays: Record<InternalCrmDashboardTimeWindow, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export class InternalCrmDashboardAnalyticsService {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly conversations: ConversationRepository,
    private readonly followUpTasks: CustomerFollowUpTaskRepository,
    private readonly auditLogs: AuditLogRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async getDashboard(input: {
    auth: AuthContext;
    query?: InternalCrmDashboardAnalyticsQuery;
  }): Promise<InternalCrmDashboardAnalyticsResponse> {
    const timeWindow = input.query?.timeWindow ?? "30d";
    const scope = toScope(input.auth);
    const generatedAt = this.now();
    const since = new Date(
      generatedAt.getTime() - windowDays[timeWindow] * 24 * 60 * 60 * 1000,
    );

    const [customers, conversations, followUpTasks, auditLogs] =
      await Promise.all([
        this.customers.listScoped(scope),
        this.conversations.listScoped(scope, { limit: 1000 }),
        this.followUpTasks.listScoped(scope),
        this.auditLogs.listRecentScoped?.(scope, 100) ?? Promise.resolve([]),
      ]);

    const newCustomers = customers.filter(
      (customer) => customer.createdAt >= since,
    );
    const activeCustomers = customers.filter(
      (customer) => customer.status === "active",
    );
    const openTasks = followUpTasks.filter((task) =>
      ["open", "in_progress"].includes(task.status),
    );
    const overdueTasks = openTasks.filter(
      (task) => task.dueAt !== null && task.dueAt < generatedAt,
    );
    const linkedConversations = conversations.items.filter(
      (conversation) => conversation.customer !== null,
    );
    const recentCrmAuditLogs = auditLogs.filter(
      (log) =>
        log.createdAt >= since &&
        (log.action.startsWith("customer.") || log.resourceType === "customer"),
    );
    const reasonCodes = [
      linkedConversations.length < conversations.items.length
        ? "unlinked_conversations"
        : null,
      overdueTasks.length > 0 ? "overdue_follow_ups" : null,
    ].filter((reason): reason is string => reason !== null);

    return {
      workspaceId: input.auth.workspaceId,
      generatedAt: generatedAt.toISOString(),
      timeWindow,
      customers: {
        total: customers.length,
        new: newCustomers.length,
        active: activeCustomers.length,
      },
      lifecycle: { summary: countBy(customers, (customer) => customer.status) },
      owners: {
        summary: countOwners(customers),
      },
      conversations: {
        total: conversations.items.length,
        linkedToCustomer: linkedConversations.length,
        unlinked: conversations.items.length - linkedConversations.length,
      },
      followUps: {
        open: openTasks.length,
        overdue: overdueTasks.length,
        byAssignee: countOpenTasksByAssignee(openTasks),
      },
      activity: {
        recentCrmActivityCount: recentCrmAuditLogs.length,
      },
      workflow: {
        reviewOnly: true,
        mutationAllowed: false,
        billingPaymentDeferred: true,
      },
      health: {
        status: reasonCodes.length > 0 ? "attention" : "healthy",
        reasonCodes: reasonCodes.length > 0 ? reasonCodes : ["ok"],
      },
      safety: {
        aggregated: true,
        workspaceScoped: true,
        readOnly: true,
        rawPayloadIncluded: false,
        tokensIncluded: false,
        billingPaymentIncluded: false,
        providerAiOutboundIncluded: false,
        heavyAnalyticsJobCreated: false,
        exportCreated: false,
      },
    };
  }
}

function toScope(auth: AuthContext): WorkspaceScope {
  return {
    organizationId: auth.organizationId,
    workspaceId: auth.workspaceId,
  };
}

function countBy<T>(
  rows: T[],
  getKey: (row: T) => string,
): Array<{ status: string; count: number }> {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const key = getKey(row);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([status, count]) => ({ status, count }));
}

function countOwners(
  customers: Array<{ ownerUserId: string | null; status: string }>,
): InternalCrmDashboardAnalyticsResponse["owners"]["summary"] {
  const counts = new Map<
    string,
    {
      ownerUserId: string | null;
      totalCustomers: number;
      activeCustomers: number;
    }
  >();

  for (const customer of customers) {
    const key = customer.ownerUserId ?? "unassigned";
    const current = counts.get(key) ?? {
      ownerUserId: customer.ownerUserId,
      totalCustomers: 0,
      activeCustomers: 0,
    };

    current.totalCustomers += 1;
    if (customer.status === "active") current.activeCustomers += 1;
    counts.set(key, current);
  }

  return [...counts.values()].sort((left, right) =>
    (left.ownerUserId ?? "unassigned").localeCompare(
      right.ownerUserId ?? "unassigned",
    ),
  );
}

function countOpenTasksByAssignee(
  tasks: Array<{ assigneeUserId: string | null }>,
): InternalCrmDashboardAnalyticsResponse["followUps"]["byAssignee"] {
  const counts = new Map<
    string,
    { assigneeUserId: string | null; openCount: number }
  >();

  for (const task of tasks) {
    const key = task.assigneeUserId ?? "unassigned";
    const current = counts.get(key) ?? {
      assigneeUserId: task.assigneeUserId,
      openCount: 0,
    };

    current.openCount += 1;
    counts.set(key, current);
  }

  return [...counts.values()].sort((left, right) =>
    (left.assigneeUserId ?? "unassigned").localeCompare(
      right.assigneeUserId ?? "unassigned",
    ),
  );
}
