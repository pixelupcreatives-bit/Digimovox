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

const r1 = await client.query(`SELECT * FROM works LIMIT 1`);
console.log("WORKS FULL:", JSON.stringify(r1.rows[0], null, 2));

const r2 = await client.query(`SELECT key, value, group_name, type FROM settings ORDER BY key`);
console.log("\nSETTINGS VALUES:", JSON.stringify(r2.rows, null, 2));

const r3 = await client.query(`SELECT * FROM project_updates LIMIT 2`);
console.log("\nPROJECT_UPDATES FULL:", JSON.stringify(r3.rows, null, 2));

const r4 = await client.query(`SELECT * FROM project_files LIMIT 3`);
console.log("\nPROJECT_FILES:", JSON.stringify(r4.rows, null, 2));

await client.end();
