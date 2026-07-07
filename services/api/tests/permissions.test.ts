import { describe, expect, it } from 'vitest';
import { AuthorizationError } from '../src/errors/app-error';
import {
  assertPermission,
  getPermissionsForRole,
  hasPermission
} from '../src/auth/permissions';

describe('permissions', () => {
  it('grants owner all MVP permissions', () => {
    expect(getPermissionsForRole('owner')).toEqual([
      'conversation:read',
      'customer:read',
      'activity:read',
      'ai_draft:create',
      'reply:send'
    ]);
  });

  it('grants agent operational permissions including AI draft and reply send', () => {
    expect(hasPermission('agent', 'conversation:read')).toBe(true);
    expect(hasPermission('agent', 'ai_draft:create')).toBe(true);
    expect(hasPermission('agent', 'reply:send')).toBe(true);
  });

  it('keeps viewer read-only', () => {
    expect(hasPermission('viewer', 'conversation:read')).toBe(true);
    expect(hasPermission('viewer', 'customer:read')).toBe(true);
    expect(hasPermission('viewer', 'activity:read')).toBe(true);
    expect(hasPermission('viewer', 'ai_draft:create')).toBe(false);
    expect(hasPermission('viewer', 'reply:send')).toBe(false);
  });

  it('blocks viewer from AI draft creation permission', () => {
    expect(() => assertPermission('viewer', 'ai_draft:create')).toThrow(
      AuthorizationError
    );
  });

  it('blocks viewer from reply send permission', () => {
    expect(() => assertPermission('viewer', 'reply:send')).toThrow(
      AuthorizationError
    );
  });
});
