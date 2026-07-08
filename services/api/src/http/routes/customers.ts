import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getAuthContext } from '../../auth/auth-context';
import type { Env } from '../../config/env';
import { CustomerQueryService } from '../../customers/customer-service';
import { ValidationError } from '../../errors/app-error';
import { requireAuth } from '../../auth/require-auth';

const safeIdPattern = /^[a-zA-Z0-9._:-]+$/;

const customerIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(safeIdPattern, 'Invalid customer ID.');

function parseCustomerId(customerId: string, path: string): string {
  const parsed = customerIdSchema.safeParse(customerId);

  if (!parsed.success) {
    throw new ValidationError('Invalid request.', [
      {
        path,
        message: parsed.error.issues[0]?.message ?? 'Invalid customer ID.'
      }
    ]);
  }

  return parsed.data;
}

export async function registerCustomerRoutes(
  app: FastifyInstance,
  env: Env,
  service: CustomerQueryService
): Promise<void> {
  app.get(
    '/api/v1/customers/:customer_id',
    {
      preHandler: requireAuth(env)
    },
    async (request) => {
      const auth = getAuthContext(request);
      const params = request.params as { customer_id?: string };
      const customerId = parseCustomerId(
        params.customer_id ?? '',
        'params.customer_id'
      );

      return service.getCustomerProfile({
        auth,
        customerId
      });
    }
  );
}
