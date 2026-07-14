import { describe, expect, it } from "vitest";
import {
  buildWorkspaceNavigation,
  getRoleNavigationProfile,
} from "./workspace-navigation";

const labelsFor = (
  role: Parameters<typeof buildWorkspaceNavigation>[0]["role"],
) =>
  buildWorkspaceNavigation({ role }).flatMap((group) =>
    group.items.map((item) => item.label),
  );

describe("workspace navigation model", () => {
  it("lets owner see all groups including administration", () => {
    const groups = buildWorkspaceNavigation({ role: "owner" });

    expect(groups.map((group) => group.label)).toEqual([
      "Workspace",
      "Oversight",
      "Administration",
    ]);
    expect(labelsFor("owner")).toContain("Access Control");
  });

  it("lets agent see operational workspace items but not access control", () => {
    const labels = labelsFor("agent");

    expect(labels).toEqual([
      "Workspace / Beranda",
      "Queue / Chat Masuk",
      "CRM / Leads",
      "Customers",
      "Follow-up / Action Center",
    ]);
    expect(labels).not.toContain("Access Control");
  });

  it("keeps viewer read-only by hiding action-heavy navigation", () => {
    const labels = labelsFor("viewer");

    expect(labels).toEqual([
      "Workspace / Beranda",
      "Queue / Chat Masuk",
      "CRM / Leads",
      "Customers",
    ]);
    expect(labels).not.toContain("Follow-up / Action Center");
    expect(labels).not.toContain("Access Control");
  });

  it("documents future legacy role compatibility metadata", () => {
    expect(getRoleNavigationProfile("sales").futureCompatibility).toBe(true);
    expect(getRoleNavigationProfile("manager").futureCompatibility).toBe(true);
    expect(getRoleNavigationProfile("head").futureCompatibility).toBe(true);
    expect(getRoleNavigationProfile("superadmin").futureCompatibility).toBe(
      true,
    );
  });

  it("marks current and planned items safely", () => {
    const items = buildWorkspaceNavigation({
      role: "owner",
      activeItemId: "queue",
    }).flatMap((group) => group.items);

    expect(items.find((item) => item.id === "queue")?.status).toBe("active");
    expect(items.find((item) => item.id === "crm")?.status).toBe("planned");
  });
});
