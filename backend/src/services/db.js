import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set — database features will fail");
}

export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : null;

/**
 * Helper: run a query, throw if DB not configured.
 */
export async function query(strings, ...values) {
  if (!sql) {
    throw Object.assign(new Error("Database not configured"), { status: 503 });
  }
  return sql(strings, ...values);
}
