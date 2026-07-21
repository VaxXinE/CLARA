export function getPerformanceRiskClassificationPolicy() {
  return {
    latencyRiskClassified: true,
    throughputRiskClassified: true,
    providerLimitRiskClassified: true,
    databaseRiskClassified: true,
    queueBacklogRiskClassified: true,
    productionReadinessRisk: "medium",
  } as const;
}
