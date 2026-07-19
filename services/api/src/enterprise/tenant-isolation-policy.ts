export function getTenantIsolationPolicy() {
  return {
    workspaceScopedReads: true,
    workspaceScopedWrites: true,
    backendWorkspaceAuthority: true,
    clientWorkspaceIdAuthority: false,
    crossWorkspaceAccessDenied: true,
    safeNotFoundForCrossWorkspaceResource: true,
    auditWorkspaceScopeRequired: true,
    dashboardBoundaryIsUxOnly: true,
    extensionBoundaryMayNotReadInternals: true,
  } as const;
}
