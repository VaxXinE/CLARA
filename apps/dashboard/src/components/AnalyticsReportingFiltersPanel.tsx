import type { AnalyticsReportingFilterSummary } from "../api/types";

type AnalyticsReportingFiltersPanelProps = {
  filters: AnalyticsReportingFilterSummary | null;
};

export function AnalyticsReportingFiltersPanel(
  props: AnalyticsReportingFiltersPanelProps,
) {
  const filters = props.filters;

  return (
    <section
      className="panel crm-skeleton-panel"
      aria-label="Reporting Filters"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">P9 Analytics</p>
          <h2>Reporting Filters</h2>
        </div>
        <span className="badge">role-gated operator filter</span>
      </div>

      {filters ? (
        <dl className="crm-facts-grid">
          <div>
            <dt>Time window</dt>
            <dd>{filters.appliedFilters.timeWindow}</dd>
          </div>
          <div>
            <dt>Channel</dt>
            <dd>{filters.appliedFilters.channel}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{filters.appliedFilters.category ?? "all"}</dd>
          </div>
          <div>
            <dt>Operator scoped</dt>
            <dd>{filters.appliedFilters.operatorScoped ? "yes" : "no"}</dd>
          </div>
        </dl>
      ) : (
        <p>No reporting filters applied.</p>
      )}

      <div className="state-card">
        <strong>Filter boundary</strong>
        <p>
          Filters stay aggregate-first and workspace-scoped. Customer filters,
          custom date ranges, raw reports, and per-customer detail views are not
          available in this view.
        </p>
      </div>
    </section>
  );
}
