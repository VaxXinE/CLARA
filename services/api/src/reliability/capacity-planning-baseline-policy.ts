export function getCapacityPlanningBaselinePolicy() {
  return {
    capacityBaselineDefined: true,
    scalingAssumptionDefined: true,
    bottleneckChecklistDefined: true,
    databaseCapacityChecklistDefined: true,
    queueCapacityChecklistDefined: true,
    dashboardCapacityChecklistDefined: true,
    providerCapacityChecklistDefined: true,
  } as const;
}
