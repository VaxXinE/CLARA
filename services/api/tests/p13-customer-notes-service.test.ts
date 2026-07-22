import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { AuditLogService } from "../src/audit/audit-log-service";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { FixtureCustomerNoteRepository } from "../src/customers/customer-note-repository";
import { FixtureCustomerRepository } from "../src/customers/customer-repository";
import { CustomerQueryService } from "../src/customers/customer-service";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

function auth(role: "owner" | "agent" | "viewer" = "agent") {
  return buildAuthContext({
    userId: role === "viewer" ? "usr_demo_viewer" : "usr_demo_agent",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role,
  });
}

describe("P13 customer notes service", () => {
  it("creates a note and records safe audit metadata only", async () => {
    const store = createFixtureAppStore();
    const auditRepository = new FixtureAuditLogRepository(store);
    const service = new CustomerQueryService(
      new FixtureCustomerRepository(store),
      new AuditLogService(auditRepository),
      new FixtureCustomerNoteRepository(store),
    );

    const result = await service.createCustomerNote({
      auth: auth("agent"),
      customerId: "cust_demo_budi",
      correlationId: "corr_p13_note",
      payload: { body: "Private operator note for CRM follow-up." },
    });

    expect(result.note).toMatchObject({
      customer_id: "cust_demo_budi",
      author_user_id: "usr_demo_agent",
      body: "Private operator note for CRM follow-up.",
    });

    const audit = store.auditLogs.at(-1);
    expect(audit).toMatchObject({
      action: "customer.note.created",
      resourceType: "customer",
      resourceId: "cust_demo_budi",
    });
    expect(JSON.stringify(audit?.metadataJson)).toContain(result.note.id);
    expect(JSON.stringify(audit?.metadataJson)).not.toContain(
      "Private operator note",
    );
    expect(JSON.stringify(audit?.metadataJson)).not.toContain("access_token");
  });

  it("lets viewers read notes but not write notes", async () => {
    const store = createFixtureAppStore();
    const service = new CustomerQueryService(
      new FixtureCustomerRepository(store),
      undefined,
      new FixtureCustomerNoteRepository(store),
    );

    await expect(
      service.listCustomerNotes({
        auth: auth("viewer"),
        customerId: "cust_demo_budi",
      }),
    ).resolves.toMatchObject({
      data: [expect.objectContaining({ id: "note_demo_budi_intro" })],
    });

    await expect(
      service.createCustomerNote({
        auth: auth("viewer"),
        customerId: "cust_demo_budi",
        correlationId: "corr_p13_viewer_note",
        payload: { body: "Blocked." },
      }),
    ).rejects.toMatchObject({ statusCode: 403 });
  });
});
