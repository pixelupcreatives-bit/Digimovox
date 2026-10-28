/**
 * Apply worker/src/schema.sql to Neon Postgres.
 *
 * Run: node scripts/migrate.mjs
 * Reads DATABASE_URL from worker/.dev.vars (local) or the environment.
 */
import pg from "pg";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

function readDevVars() {
  try {
    const raw = readFileSync(join(root, ".dev.vars"), "utf8");
    const vars = {};
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m) vars[m[1]] = m[2].trim();
    }
    return vars;
  } catch {
    return {};
  }
}

const vars = { ...readDevVars(), ...process.env };
const connectionString = vars.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set (check worker/.dev.vars).");
  process.exit(1);
}

const schema = readFileSync(join(root, "src", "schema.sql"), "utf8");

const client = new pg.Client({ connectionString });
await client.connect();
try {
  await client.query(schema);
  const tables = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`,
  );
  console.log("Schema applied. Tables:");
  for (const t of tables.rows) console.log(`  - ${t.table_name}`);
} finally {
  await client.end();
}
