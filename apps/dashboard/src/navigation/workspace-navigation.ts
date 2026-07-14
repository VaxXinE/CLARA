export type WorkspaceNavigationRole =
  "owner" | "agent" | "viewer" | "sales" | "manager" | "head" | "superadmin";

export type WorkspaceNavigationItemStatus =
  "active" | "available" | "planned" | "disabled";

export type WorkspaceNavigationItem = {
  id: string;
  label: string;
  route: string;
  status: WorkspaceNavigationItemStatus;
};

export type WorkspaceNavigationGroup = {
  label: string;
  items: WorkspaceNavigationItem[];
};

type NavigationDefinition = Omit<WorkspaceNavigationItem, "status"> & {
  group: string;
  planned?: boolean;
  roles: WorkspaceNavigationRole[];
};

const allRoles: WorkspaceNavigationRole[] = [
  "owner",
  "agent",
  "viewer",
  "sales",
  "manager",
  "head",
  "superadmin",
];

const operationalRoles: WorkspaceNavigationRole[] = [
  "owner",
  "agent",
  "viewer",
  "sales",
  "manager",
  "head",
  "superadmin",
];

const actionRoles: WorkspaceNavigationRole[] = [
  "owner",
  "agent",
  "sales",
  "manager",
  "head",
  "superadmin",
];

const oversightRoles: WorkspaceNavigationRole[] = [
  "owner",
  "manager",
  "head",
  "superadmin",
];

const adminRoles: WorkspaceNavigationRole[] = ["owner", "superadmin"];

const navigationDefinitions: NavigationDefinition[] = [
  {
    id: "workspace",
    group: "Workspace",
    label: "Workspace / Beranda",
    route: "#workspace",
    roles: allRoles,
  },
  {
    id: "queue",
    group: "Workspace",
    label: "Queue / Chat Masuk",
    route: "#queue",
    roles: operationalRoles,
  },
  {
    id: "crm",
    group: "Workspace",
    label: "CRM / Leads",
    route: "#crm",
    planned: true,
    roles: operationalRoles,
  },
  {
    id: "customers",
    group: "Workspace",
    label: "Customers",
    route: "#customers",
    planned: true,
    roles: operationalRoles,
  },
  {
    id: "follow-up",
    group: "Workspace",
    label: "Follow-up / Action Center",
    route: "#follow-up",
    planned: true,
    roles: actionRoles,
  },
  {
    id: "notifications",
    group: "Oversight",
    label: "Notifications / Alert Center",
    route: "#notifications",
    planned: true,
    roles: oversightRoles,
  },
  {
    id: "approvals",
    group: "Oversight",
    label: "Approvals / Chat Review",
    route: "#approvals",
    planned: true,
    roles: oversightRoles,
  },
  {
    id: "manager-insights",
    group: "Oversight",
    label: "Manager Insights",
    route: "#manager-insights",
    planned: true,
    roles: oversightRoles,
  },
  {
    id: "knowledge",
    group: "Oversight",
    label: "Knowledge",
    route: "#knowledge",
    planned: true,
    roles: oversightRoles,
  },
  {
    id: "kpi",
    group: "Oversight",
    label: "KPI",
    route: "#kpi",
    planned: true,
    roles: oversightRoles,
  },
  {
    id: "access-control",
    group: "Administration",
    label: "Access Control",
    route: "#admin-access",
    planned: true,
    roles: adminRoles,
  },
];

export function getRoleNavigationProfile(role: WorkspaceNavigationRole) {
  return {
    role,
    backendAuthorizationSourceOfTruth: true,
    futureCompatibility:
      role === "sales" ||
      role === "manager" ||
      role === "head" ||
      role === "superadmin",
  };
}

export function canShowNavigationItem(
  role: WorkspaceNavigationRole,
  item: Pick<NavigationDefinition, "roles">,
) {
  return item.roles.includes(role);
}

export function buildWorkspaceNavigation(input: {
  role: WorkspaceNavigationRole;
  activeItemId?: string;
}): WorkspaceNavigationGroup[] {
  const activeItemId = input.activeItemId ?? "workspace";
  const groups = new Map<string, WorkspaceNavigationItem[]>();

  for (const item of navigationDefinitions) {
    if (!canShowNavigationItem(input.role, item)) {
      continue;
    }

    const status =
      item.id === activeItemId
        ? "active"
        : item.planned
          ? "planned"
          : "available";

    const groupItems = groups.get(item.group) ?? [];
    groupItems.push({
      id: item.id,
      label: item.label,
      route: item.route,
      status,
    });
    groups.set(item.group, groupItems);
  }

  return Array.from(groups, ([label, items]) => ({ label, items }));
}
