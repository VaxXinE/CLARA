import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureCustomerNoteRepository } from "../src/customers/customer-note-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const auth = buildAuthContext({
  userId: "usr_demo_agent",
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
  role: "agent",
});

describe("P13 customer activity timeline service", () => {
  it("builds safe timeline events from customer and note records", async () => {
    const store = createFixtureAppStore();
    const service = new CustomerQueryService(
      new FixtureCustomerRepository(store),
      undefined,
      new FixtureCustomerNoteRepository(store),
    );

    await service.createCustomerNote({
      auth,
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_timeline_note",
      payload: { body: "Hidden timeline note body." },
    });

    const timeline = await service.listCustomerActivityTimeline({
      auth,
      customerId: "cust_demo_budi",
    });

    expect(timeline.data.map((event) => event.type)).toEqual(
      expect.arrayContaining(["customer.created", "customer.note.created"]),
    );
    expect(
      (timeline.data[0]?.occurred_at ?? "") >=
        (timeline.data.at(-1)?.occurred_at ?? ""),
    ).toBe(true);
    expect(JSON.stringify(timeline)).not.toContain("Hidden timeline note body");
  });
});
