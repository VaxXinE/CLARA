import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { Env } from "../config/env";
import { dbSchema } from "./schema";

export type Database = NodePgDatabase<typeof dbSchema>;

export function getDatabaseUrl(env: Pick<Env, "DATABASE_URL">): string {
  if (!env.DATABASE_URL) {
    throw new Error(
      "Invalid environment configuration: DATABASE_URL is required for database commands.",
    );
  }

  return env.DATABASE_URL;
}

export function createDatabasePool(env: Pick<Env, "DATABASE_URL">): Pool {
  return new Pool({
    connectionString: getDatabaseUrl(env),
    max: 10,
    idleTimeoutMillis: 30_000,
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
