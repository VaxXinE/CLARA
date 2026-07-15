import type { AuthContext } from "../auth/auth-context";
import type {
  customerTimelineEventSeverities,
  customerTimelineEventSources,
  customerTimelineEventTypes,
} from "./customer-timeline-intelligence-policy";

export type CustomerTimelineEventType =
  (typeof customerTimelineEventTypes)[number];

export type CustomerTimelineEventSource =
  (typeof customerTimelineEventSources)[number];

export type CustomerTimelineEventSeverity =
  (typeof customerTimelineEventSeverities)[number];

export type CustomerTimelineSafeMetadata = Record<
  string,
  string | number | boolean | null
>;

export type CustomerTimelineEvent = {
  id: string;
  occurredAt: string;
  type: CustomerTimelineEventType;
  source: CustomerTimelineEventSource;
  title: string;
  summary: string;
  channel: string | null;
  conversationId?: string;
  activityId?: string;
  replyId?: string;
  severity: CustomerTimelineEventSeverity;
  safeMetadata: CustomerTimelineSafeMetadata;
};

export type GetCustomerTimelineIntelligenceInput = {
  auth: AuthContext;
  customerId: string;
};

export type GetCustomerTimelineIntelligenceResult = {
  customerId: string;
  workspaceId: string;
  generatedAt: string;
  timeline: {
    events: CustomerTimelineEvent[];
  };
  intelligence: {
    keyMoments: string[];
    recentSignals: string[];
    riskFlags: string[];
    followUpHints: string[];
  };
  safety: {
    readOnly: true;
    mutationAllowed: false;
    requiresHumanApprovalForMutation: true;
    policyVersion: string;
  };
};
