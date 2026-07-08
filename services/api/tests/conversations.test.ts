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

describe('conversation APIs', () => {
  it('requires authentication for conversation list', async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/conversations'
    });

    await app.close();

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication is required.'
      }
    });
  });

  it('returns a paginated conversation list scoped to the authenticated workspace', async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: 'GET',
      url:
        '/api/v1/conversations?limit=10&organization_id=org_demo_other&workspace_id=wks_demo_other',
      headers: authHeaders({
        userId: 'usr_demo_agent',
        organizationId: 'org_demo',
        workspaceId: 'wks_demo_sales',
        role: 'agent'
      })
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-correlation-id']).toBeDefined();

    const body = response.json();

    expect(body.data).toHaveLength(2);
    expect(body.pagination).toEqual({
      limit: 10,
      next_cursor: null
    });
    expect(body.permissions).toMatchObject({
      can_view_conversation: true,
      can_generate_ai_draft: true,
      can_send_reply: true
    });
    expect(body.data[0]).toMatchObject({
      id: 'conv_demo_sari_followup',
      customer: {
        id: 'cust_demo_sari',
        display_name: 'Sari Wijaya'
      }
    });
    expect(body.data[1]).toMatchObject({
      id: 'conv_demo_budi_stock',
      customer: {
        id: 'cust_demo_budi',
        display_name: 'Budi Santoso'
      }
    });
    expect(body.data.map((item: { id: string }) => item.id)).not.toContain(
      'conv_other_workspace_secret'
    );
  });

  it('allows owner, agent, and viewer to read the conversation list', async () => {
    for (const role of ['owner', 'agent', 'viewer'] as const) {
      const app = await createServer({ env: testEnv });

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/conversations',
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
        can_view_conversation: true,
        can_generate_ai_draft: role !== 'viewer',
        can_send_reply: role !== 'viewer'
      });
    }
  });

  it('supports safe filters for conversation list', async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/conversations?status=open&assigned_to=usr_demo_agent&search=Budi',
      headers: authHeaders({
        userId: 'usr_demo_agent',
        organizationId: 'org_demo',
        workspaceId: 'wks_demo_sales',
        role: 'agent'
      })
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveLength(1);
    expect(response.json().data[0].id).toBe('conv_demo_budi_stock');
  });

  it('returns a next cursor for paginated conversation list results', async () => {
    const app = await createServer({ env: testEnv });

    const firstPage = await app.inject({
      method: 'GET',
      url: '/api/v1/conversations?limit=1',
      headers: authHeaders({
        userId: 'usr_demo_agent',
        organizationId: 'org_demo',
        workspaceId: 'wks_demo_sales',
        role: 'agent'
      })
    });

    expect(firstPage.statusCode).toBe(200);
    expect(firstPage.json().data).toHaveLength(1);
    expect(firstPage.json().pagination.next_cursor).toBeTruthy();

    const secondPage = await app.inject({
      method: 'GET',
      url: `/api/v1/conversations?limit=1&cursor=${encodeURIComponent(
        firstPage.json().pagination.next_cursor
      )}`,
      headers: authHeaders({
        userId: 'usr_demo_agent',
        organizationId: 'org_demo',
        workspaceId: 'wks_demo_sales',
        role: 'agent'
      })
    });

    await app.close();

    expect(secondPage.statusCode).toBe(200);
    expect(secondPage.json().data).toHaveLength(1);
    expect(secondPage.json().data[0].id).not.toBe(firstPage.json().data[0].id);
  });

  it('returns conversation detail with customer summary and scoped messages', async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/conversations/conv_demo_budi_stock',
      headers: authHeaders({
        userId: 'usr_demo_viewer',
        organizationId: 'org_demo',
        workspaceId: 'wks_demo_sales',
        role: 'viewer'
      })
    });

    await app.close();

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.permissions).toMatchObject({
      can_view_conversation: true,
      can_generate_ai_draft: false,
      can_send_reply: false
    });
    expect(body.conversation).toMatchObject({
      id: 'conv_demo_budi_stock',
      customer: {
        id: 'cust_demo_budi',
        display_name: 'Budi Santoso'
      }
    });
    expect(body.conversation.messages).toHaveLength(3);
    expect(body.conversation.messages[0]).toMatchObject({
      id: 'msg_demo_budi_1',
      direction: 'inbound'
    });
    expect(
      body.conversation.messages.some(
        (message: { id: string }) => message.id === 'msg_other_workspace_1'
      )
    ).toBe(false);
  });

  it('returns 404 for cross-workspace conversation access', async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/conversations/conv_other_workspace_secret',
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
        message: 'Conversation not found.'
      }
    });
  });

  it('returns 404 when a valid conversation id is not found', async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/conversations/conv_missing_01',
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

  it('returns safe validation errors for invalid list query or conversation id', async () => {
    const app = await createServer({ env: testEnv });

    const invalidStatusResponse = await app.inject({
      method: 'GET',
      url: '/api/v1/conversations?status=invalid_status',
      headers: authHeaders({
        userId: 'usr_demo_agent',
        organizationId: 'org_demo',
        workspaceId: 'wks_demo_sales',
        role: 'agent'
      })
    });

    const invalidIdResponse = await app.inject({
      method: 'GET',
      url: '/api/v1/conversations/invalid!id',
      headers: authHeaders({
        userId: 'usr_demo_agent',
        organizationId: 'org_demo',
        workspaceId: 'wks_demo_sales',
        role: 'agent'
      })
    });

    await app.close();

    expect(invalidStatusResponse.statusCode).toBe(400);
    expect(invalidStatusResponse.json().error.code).toBe('VALIDATION_ERROR');
    expect(invalidIdResponse.statusCode).toBe(400);
    expect(invalidIdResponse.json().error.code).toBe('VALIDATION_ERROR');
  });
});
