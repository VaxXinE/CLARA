import type {
  CustomerTimelineEvent,
  CustomerTimelineSafeMetadata,
} from "./customer-timeline-intelligence-types";

export function toSafeTimelineMetadata(
  metadata: CustomerTimelineSafeMetadata,
): CustomerTimelineSafeMetadata {
  return Object.fromEntries(
    Object.entries(metadata).filter(([, value]) => {
      return (
        value === null ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      );
    }),
  );
}

export function sortTimelineEvents(
  events: CustomerTimelineEvent[],
): CustomerTimelineEvent[] {
  return [...events].sort((left, right) => {
    const timeDelta =
      new Date(right.occurredAt).getTime() -
      new Date(left.occurredAt).getTime();

    if (timeDelta !== 0) {
      return timeDelta;
    }

    return right.id.localeCompare(left.id);
  });
}
