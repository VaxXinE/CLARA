import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PoolClient } from "pg";
import { createDatabasePool } from "../client";
import { loadEnv } from "../../config/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, "../../../drizzle");

type MigrationFile = {
  filename: string;
  sql: string;
  hash: string;
};

async function loadMigrationFiles(): Promise<MigrationFile[]> {
  const entries = await readdir(migrationsDir, { withFileTypes: true });

  const migrationFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort();

  return Promise.all(
    migrationFiles.map(async (filename) => {
      const sql = await readFile(path.join(migrationsDir, filename), "utf8");

      return {
        filename,
        sql,
        hash: createHash("sha256").update(sql).digest("hex"),
      };
    }),
  );
}

async function ensureMigrationTable(connection: PoolClient): Promise<void> {
  await connection.query(`
    create table if not exists __clara_schema_migrations (
      id bigserial primary key,
      filename text not null unique,
      hash text not null,
      applied_at timestamptz not null default now()
    );
  `);
}

async function run(): Promise<void> {
  const env = loadEnv();
  const pool = createDatabasePool(env);
  const connection = await pool.connect();

  try {
    await ensureMigrationTable(connection);

    const appliedRows = await connection.query<{
      filename: string;
      hash: string;
    }>(
      "select filename, hash from __clara_schema_migrations order by filename asc",
    );
    const appliedByFilename = new Map(
      appliedRows.rows.map((row) => [row.filename, row.hash]),
    );

    const migrationFiles = await loadMigrationFiles();

    for (const migrationFile of migrationFiles) {
      const appliedHash = appliedByFilename.get(migrationFile.filename);

      if (appliedHash) {
        if (appliedHash !== migrationFile.hash) {
          throw new Error(
            `Migration hash mismatch for ${migrationFile.filename}.`,
          );
        }

        continue;
      }

      await connection.query("begin");

      try {
        await connection.query(migrationFile.sql);
        await connection.query(
          `
            insert into __clara_schema_migrations (filename, hash)
            values ($1, $2)
          `,
          [migrationFile.filename, migrationFile.hash],
        );
        await connection.query("commit");
      } catch (error) {
        await connection.query("rollback");
        throw error;
      }
    }
  } finally {
    connection.release();
    await pool.end();
  }
}

await run();
