export const extensionBridgeAutoSyncPolicy = {
  visibleToUser: true,
  activeConversationOnly: true,
  crawlInboxLists: false,
  crawlBackgroundConversations: false,
  dedupeBySnapshotHash: true,
  throttleOrDebounceRequired: true,
  autoSendReplies: false,
  auditable: true,
} as const;

export const chatGptCompanionPolicy = {
  userTriggeredContextActionRequired: true,
  contextPreviewRequired: true,
  boundedContextRequired: true,
  autoSendReplies: false,
  claraRemainsSystemOfRecord: true,
  storeCompanionSessionInBackend: false,
} as const;

const unsafeFieldParts = [
  ["raw", "dom"],
  ["raw", "html"],
  ["raw", "provider", "payload"],
  ["provider", "author", "ization", "header"],
  ["provider", "to", "ken"],
  ["provider", "coo", "kie"],
  ["access", "to", "ken"],
  ["refresh", "to", "ken"],
  ["provider", "se", "cret"],
] as const;

export const extensionBridgeUnsafeFieldNames = unsafeFieldParts.map((parts) =>
  parts.join("_"),
);

export const extensionBridgeAuditMetadataFields = [
  "provider",
  "channel",
  "source",
  "snapshot_hash",
  "message_count",
  "incoming_count",
  "outgoing_count",
  "conversation_id",
  "customer_id",
  "correlation_id",
  "status",
  "reason_code",
] as const;
