export const customerProfileIntelligencePolicyVersion =
  "customer-profile-intelligence-read-model-v1";

export function isOpenConversationStatus(status: string): boolean {
  return !["closed", "resolved", "archived"].includes(status.toLowerCase());
}

export function isCustomerIntelligenceReadOnlySafety(input: {
  readOnly: boolean;
  mutationAllowed: boolean;
  requiresHumanApprovalForMutation: boolean;
}): boolean {
  return (
    input.readOnly === true &&
    input.mutationAllowed === false &&
    input.requiresHumanApprovalForMutation === true
  );
}
