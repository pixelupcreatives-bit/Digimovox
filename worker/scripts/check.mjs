import pg from "pg";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const raw = readFileSync(join(root, ".dev.vars"), "utf8");
const vars = {};
for (const line of raw.split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
  if (m) vars[m[1]] = m[2].trim();
}

const client = new pg.Client({ connectionString: vars.DATABASE_URL });
await client.connect();
const r = await client.query(
  `SELECT name, business, email, service, budget, status, source, received_at FROM enquiries ORDER BY received_at DESC LIMIT 4`,
);
console.log("Latest enquiries in Neon:");
for (const row of r.rows) console.log(`  - ${row.name} / ${row.business} / ${row.service} / ${row.budget} / ${row.status} / ${row.source}`);
await client.end();
