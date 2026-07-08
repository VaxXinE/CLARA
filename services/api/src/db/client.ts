import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { Env } from "../config/env";
import { dbSchema } from "./schema";

export type Database = NodePgDatabase<typeof dbSchema>;
export type DatabasePoolOptions = {
  appName?: string;
};

export function getDatabaseUrl(env: Pick<Env, "DATABASE_URL">): string {
  if (!env.DATABASE_URL) {
    throw new Error(
      "Invalid environment configuration: DATABASE_URL is required for database commands.",
    );
  }

  return env.DATABASE_URL;
}

export function createDatabasePool(
  env: Pick<Env, "DATABASE_URL">,
  options: DatabasePoolOptions = {},
): Pool {
  return new Pool({
    connectionString: getDatabaseUrl(env),
    application_name: options.appName ?? "clara-api",
    max: 10,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    allowExitOnIdle: true,
  });
}

export function createDatabase(env: Pick<Env, "DATABASE_URL">): {
  db: Database;
  pool: Pool;
} {
  const pool = createDatabasePool(env);

  return {
    db: drizzle(pool, {
      schema: dbSchema,
    }),
    pool,
  };
}

export async function verifyDatabaseConnection(
  env: Pick<Env, "DATABASE_URL">,
): Promise<void> {
  const pool = createDatabasePool(env, {
    appName: "clara-api-db-ready",
  });

  try {
    await pool.query("select 1");
  } finally {
    await pool.end();
  }
}
