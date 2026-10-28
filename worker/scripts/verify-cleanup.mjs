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

const works = await client.query(`SELECT slug, title, published FROM works ORDER BY sort_order`);
console.log("WORKS in Neon:");
for (const w of works.rows) console.log(`  - ${w.slug} · ${w.title} · published=${w.published}`);

// Remove the temporary rows created during verification.
const delWork = await client.query(`DELETE FROM works WHERE slug = 'temp-uuid-test-work' RETURNING slug`);
console.log(`\ndeleted temp work: ${delWork.rows.length}`);

const delLeads = await client.query(
  `DELETE FROM enquiries WHERE email IN ('dbtest@example.com','dbtest2@example.com','wizarddb@test.com') RETURNING email`,
);
console.log(`deleted test enquiries: ${delLeads.rows.length}`);

await client.end();
