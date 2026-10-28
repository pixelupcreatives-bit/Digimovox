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

const show = async (label, q) => {
  const r = await client.query(q);
  console.log(`\n== ${label} (${r.rows.length}) ==`);
  for (const row of r.rows) console.log(JSON.stringify(row, null, 0).slice(0, 600));
};

await show("admin_users", `SELECT id, email, name, role, is_active, company, client_of, phone FROM admin_users`);
await show("enquiries", `SELECT id, name, business, email, phone, service, budget, timeline, source, received_at, created_at FROM enquiries`);
await show("works", `SELECT id, slug, title, client, category, year, is_sample, published FROM works`);
await show("projects", `SELECT id, code, name, status, priority, client_id, progress, budget FROM projects`);
await show("project_updates", `SELECT id, project_id, kind, urgency, visibility, body FROM project_updates`);
await show("settings", `SELECT key, group_name, label, type FROM settings`);
await show("team_members", `SELECT id, name, role, email, is_active FROM team_members`);
await show("quotations", `SELECT id, number, title, client_name, status, amount FROM quotations`);

await client.end();
