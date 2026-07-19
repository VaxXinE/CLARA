import type { AuthContext } from "../auth/auth-context";
import { buildAnalyticsReadinessResponse } from "./analytics-read-model-dto";
import { getAnalyticsWorkspaceScope } from "./analytics-read-model-policy";
import {
  listAnalyticsMetricCatalog,
  listAnalyticsMetricCategories,
} from "./analytics-metric-registry";
import {
  assertSafeAnalyticsMetricCatalogQuery,
  type AnalyticsMetricCatalogQuery,
} from "./analytics-query-policy";
import type {
  AnalyticsMetricCatalogResponse,
  AnalyticsReadinessResponse,
} from "./analytics-read-model-types";

export class AnalyticsReadModelService {
  getReadiness(input: { auth: AuthContext }): AnalyticsReadinessResponse {
    const scope = getAnalyticsWorkspaceScope(input.auth);
    const generatedAt = new Date().toISOString();

    return buildAnalyticsReadinessResponse({
      workspaceId: scope.workspaceId,
      generatedAt,
    });
  }

  getMetricCatalog(input: {
    auth: AuthContext;
    query?: AnalyticsMetricCatalogQuery;
  }): AnalyticsMetricCatalogResponse {
    const scope = getAnalyticsWorkspaceScope(input.auth);
    const query = input.query ?? {};

    assertSafeAnalyticsMetricCatalogQuery({
      query,
      authWorkspaceId: scope.workspaceId,
    });

    let metrics = listAnalyticsMetricCatalog();

    if (query.metricKey) {
      metrics = metrics.filter(
        (metric) => metric.metricKey === query.metricKey,
      );
    }

    if (query.category) {
      metrics = metrics.filter((metric) => metric.category === query.category);
    }

    if (query.valueType) {
      metrics = metrics.filter(
        (metric) => metric.valueType === query.valueType,
      );
    }

    if (query.aggregationLevel) {
      metrics = metrics.filter(
        (metric) => metric.aggregationLevel === query.aggregationLevel,
      );
    }

    return {
      workspaceId: scope.workspaceId,
      generatedAt: new Date().toISOString(),
      categories: listAnalyticsMetricCategories(),
      metrics,
    };
  }
}
