export function getLoadTestProfilePolicy() {
  return {
    scenarioCatalogDefined: true,
    smokeProfileDefined: true,
    baselineProfileDefined: true,
    stressProfileDefinedForManualUse: true,
    soakProfileDefinedForManualUse: true,
    ciHeavyLoadExecutionEnabled: false,
    externalProviderCallsAllowed: false,
  } as const;
}
