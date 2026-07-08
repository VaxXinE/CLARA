import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://clara_user:clara_password_dev_only@127.0.0.1:5432/clara_api_dev",
  },
  strict: true,
  verbose: true,
});
