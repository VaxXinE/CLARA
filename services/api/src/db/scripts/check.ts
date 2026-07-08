import { demoSeedData } from '../fixtures/demo-data';
import {
  activityEventTypes,
  aiDraftStatuses,
  conversationStatuses,
  customerSources,
  dbSchema,
  messageDirections,
  workspaceMemberRoles
} from '../schema';

const requiredScopedTables = [
  'customers',
  'conversations',
  'messages',
  'replyDrafts',
  'aiDraftEvents',
  'activityEvents'
] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function runSchemaChecks(): void {
  for (const tableName of requiredScopedTables) {
    const table = dbSchema[tableName];
    const columns = Object.keys(table);

    assert(
      columns.includes('organizationId'),
      `${tableName} must include organizationId`
    );
    assert(columns.includes('workspaceId'), `${tableName} must include workspaceId`);
  }

  assert(workspaceMemberRoles.includes('owner'), 'role enum must include owner');
  assert(workspaceMemberRoles.includes('agent'), 'role enum must include agent');
  assert(workspaceMemberRoles.includes('viewer'), 'role enum must include viewer');
  assert(
    conversationStatuses.includes('open') &&
      conversationStatuses.includes('pending') &&
      conversationStatuses.includes('closed'),
    'conversation status enum is incomplete'
  );
  assert(
    messageDirections.includes('inbound') &&
      messageDirections.includes('outbound') &&
      messageDirections.includes('internal'),
    'message direction enum is incomplete'
  );
  assert(
    aiDraftStatuses.includes('succeeded') &&
      aiDraftStatuses.includes('failed'),
    'AI draft status enum is incomplete'
  );
}

function runFixtureChecks(): void {
  const allEmails = demoSeedData.users.map((user) => user.email);
  const allCustomerContacts = demoSeedData.customers
    .map((customer) => customer.contactIdentifier)
    .filter((value): value is string => typeof value === 'string');

  assert(
    demoSeedData.organizations.some((org) => org.id === 'org_demo'),
    'demo organization fixture is missing'
  );
  assert(
    demoSeedData.workspaces.some((workspace) => workspace.id === 'wks_demo_sales'),
    'demo workspace fixture is missing'
  );
  assert(
    demoSeedData.workspaces.some((workspace) => workspace.id === 'wks_demo_other'),
    'other workspace fixture is missing'
  );
  assert(
    demoSeedData.workspaceMemberships.some(
      (membership) => membership.role === 'owner'
    ) &&
      demoSeedData.workspaceMemberships.some(
        (membership) => membership.role === 'agent'
      ) &&
      demoSeedData.workspaceMemberships.some(
        (membership) => membership.role === 'viewer'
      ),
    'owner/agent/viewer fixtures are required'
  );

  for (const email of allEmails) {
    assert(email.endsWith('.test'), `fixture email must use .test domain: ${email}`);
  }

  for (const contact of allCustomerContacts) {
    assert(
      contact.endsWith('.test') || /^\+62000000000\d+$/.test(contact),
      `fixture contact identifier must be clearly fake: ${contact}`
    );
  }

  for (const customer of demoSeedData.customers) {
    assert(
      customerSources.includes(customer.source as (typeof customerSources)[number]),
      `customer source is invalid for ${customer.id}`
    );
  }

  for (const event of demoSeedData.activityEvents) {
    assert(
      activityEventTypes.includes(
        event.eventType as (typeof activityEventTypes)[number]
      ),
      `activity event type is invalid for ${event.id}`
    );
  }
}

runSchemaChecks();
runFixtureChecks();
