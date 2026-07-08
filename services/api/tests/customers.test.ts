import { describe, expect, it } from 'vitest';
import { loadEnv } from '../src/config/env';
import { createServer } from '../src/http/server';

const testEnv = loadEnv({
  NODE_ENV: 'test',
  APP_NAME: 'clara-api-test',
  HOST: '127.0.0.1',
  PORT: '3000',
  LOG_LEVEL: 'silent',
  CORS_ORIGIN: ''
});

function authHeaders(input: {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: 'owner' | 'agent' | 'viewer';
}) {
  return {
    'x-mock-user-id': input.userId,
    'x-mock-organization-id': input.organizationId,
    'x-mock-workspace-id': input.workspaceId,
    'x-mock-role': input.role
  };
}

describe('customer APIs', () => {
  it('returns a scoped customer profile with safe fields', async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: 'GET',
      url:
        '/api/v1/customers/cust_demo_budi?organization_id=org_demo_other&workspace_id=wks_demo_other',
      headers: authHeaders({
        userId: 'usr_demo_agent',
        organizationId: 'org_demo',
        workspaceId: 'wks_demo_sales',
        role: 'agent'
      })
    });

    await app.close();

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.permissions).toMatchObject({
      can_view_customer_profile: true,
      can_generate_ai_draft: true
    });
    expect(body.customer).toMatchObject({
      id: 'cust_demo_budi',
      display_name: 'Budi Santoso',
      contact_identifier: '+620000000001',
      source: 'whatsapp_demo',
      status: 'new',
      notes_summary: 'Interested in product availability.'
    });
    expect(body.customer.organization_id).toBeUndefined();
    expect(body.customer.workspace_id).toBeUndefined();
  });

  it('allows owner, agent, and viewer to read a customer profile', async () => {
    for (const role of ['owner', 'agent', 'viewer'] as const) {
      const app = await createServer({ env: testEnv });

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/customers/cust_demo_sari',
        headers: authHeaders({
          userId:
            role === 'owner'
              ? 'usr_demo_owner'
              : role === 'agent'
                ? 'usr_demo_agent'
                : 'usr_demo_viewer',
          organizationId: 'org_demo',
          workspaceId: 'wks_demo_sales',
          role
        })
      });

      await app.close();

      expect(response.statusCode).toBe(200);
      expect(response.json().permissions).toMatchObject({
        can_view_customer_profile: true,
        can_generate_ai_draft: role !== 'viewer',
        can_send_reply: role !== 'viewer'
      });
    }
  });

  it('returns 404 for cross-workspace customer access', async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/customers/cust_other_workspace',
      headers: authHeaders({
        userId: 'usr_demo_agent',
        organizationId: 'org_demo',
        workspaceId: 'wks_demo_sales',
        role: 'agent'
      })
    });

    await app.close();

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: {
        code: 'NOT_FOUND',
        message: 'Customer not found.'
      }
    });
  });

  it('returns 404 when a valid customer id is not found', async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/customers/cust_missing_01',
      headers: authHeaders({
        userId: 'usr_demo_owner',
        organizationId: 'org_demo',
        workspaceId: 'wks_demo_sales',
        role: 'owner'
      })
    });

    await app.close();

    expect(response.statusCode).toBe(404);
  });

  it('returns safe validation error for invalid customer id', async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/customers/invalid!id',
      headers: authHeaders({
        userId: 'usr_demo_viewer',
        organizationId: 'org_demo',
        workspaceId: 'wks_demo_sales',
        role: 'viewer'
      })
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request.'
      }
    });
  });
});
