import { describe, expect, it } from 'vitest';
import { buildAuthContext } from '../src/auth/auth-context';
import { loadEnv } from '../src/config/env';
import { AuthenticationError } from '../src/errors/app-error';
import { resolveMockAuthContext } from '../src/auth/mock-auth';
import { getWorkspaceScope } from '../src/workspace/workspace-scope';

describe('auth context', () => {
  it('builds a typed auth context with role permissions', () => {
    const context = buildAuthContext({
      userId: 'user_owner_01',
      organizationId: 'org_01',
      workspaceId: 'ws_01',
      role: 'owner'
    });

    expect(context).toMatchObject({
      userId: 'user_owner_01',
      organizationId: 'org_01',
      workspaceId: 'ws_01',
      role: 'owner',
      authMethod: 'mock'
    });
    expect(context.permissions).toContain('reply:send');
    expect(context.permissions).toContain('ai_draft:create');
  });

  it('rejects mock auth if required headers are missing', () => {
    const env = loadEnv({
      NODE_ENV: 'test',
      APP_NAME: 'clara-api-test',
      HOST: '127.0.0.1',
      PORT: '3000',
      LOG_LEVEL: 'silent',
      CORS_ORIGIN: ''
    });

    expect(() =>
      resolveMockAuthContext(
        {
          headers: {}
        } as never,
        env
      )
    ).toThrow(AuthenticationError);
  });

  it('rejects production configuration with mock auth enabled', () => {
    expect(() =>
      loadEnv({
        NODE_ENV: 'production',
        APP_NAME: 'clara-api',
        HOST: '127.0.0.1',
        PORT: '3000',
        LOG_LEVEL: 'info',
        CORS_ORIGIN: '',
        MOCK_AUTH_ENABLED: 'true'
      })
    ).toThrow('mock auth must be disabled in production');
  });

  it('takes workspace scope from auth context instead of request input', () => {
    const scope = getWorkspaceScope({
      auth: buildAuthContext({
        userId: 'user_agent_01',
        organizationId: 'org_from_auth',
        workspaceId: 'ws_from_auth',
        role: 'agent'
      }),
      query: {
        organization_id: 'org_from_query',
        workspace_id: 'ws_from_query'
      },
      body: {
        organization_id: 'org_from_body',
        workspace_id: 'ws_from_body'
      }
    } as never);

    expect(scope).toEqual({
      organizationId: 'org_from_auth',
      workspaceId: 'ws_from_auth'
    });
  });
});
