import { loadEnv } from "../../config/env";
import { verifyDatabaseConnection } from "../client";

async function run(): Promise<void> {
  const env = loadEnv();

  try {
    await verifyDatabaseConnection(env);
    console.log("Database connection is ready.");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error.";

    console.error(
      `Database connection check failed. ${message} Check local PostgreSQL and DATABASE_URL.`,
    );
    process.exitCode = 1;
  }
}

await run();
