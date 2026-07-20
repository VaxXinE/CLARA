export function buildReliabilitySafeSummary() {
  return {
    readOnly: true,
    workspaceScoped: true,
    clientScopeIgnored: true,
    mutationAllowed: false,
    jobEnqueueAllowed: false,
    jobExecutionAllowed: false,
    retryExecutionAllowed: false,
    replayAllowed: false,
    purgeAllowed: false,
    rawJobPayloadIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    outboundSendAllowed: false,
    billingSideEffectsAllowed: false,
    aiProviderCallAllowed: false,
  } as const;
}
