import pg from "pg";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

function readDevVars() {
  const raw = readFileSync(join(root, ".dev.vars"), "utf8");
  const vars = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m) vars[m[1]] = m[2].trim();
  }
  return vars;
}

const client = new pg.Client({ connectionString: readDevVars().DATABASE_URL });
await client.connect();

const tables = await client.query(
  `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`,
);

for (const { table_name } of tables.rows) {
  const cols = await client.query(
    `SELECT column_name, data_type, is_nullable, column_default
     FROM information_schema.columns WHERE table_schema='public' AND table_name=$1
     ORDER BY ordinal_position`,
    [table_name],
  );
  const count = await client.query(`SELECT COUNT(*)::int AS n FROM "${table_name}"`);
  console.log(`\n== ${table_name} (${count.rows[0].n} rows) ==`);
  for (const c of cols.rows) {
    console.log(`   ${c.column_name.padEnd(24)} ${c.data_type.padEnd(20)} null=${c.is_nullable}`);
  }
}

await client.end();
