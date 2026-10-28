/**
 * Adopt the pre-existing MovoX schema.
 *
 * 1. Drops the duplicate tables created by the first migration (all empty).
 * 2. Resets admin@heymovox.com to a known password (PBKDF2-SHA256).
 * 3. Seeds the `blogs` table from the site's content if empty.
 *
 * Run: node scripts/adopt-existing.mjs
 * Env:   ADMIN_PASSWORD  (default MovoX@2026)
 */
import pg from "pg";
import crypto from "node:crypto";
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

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex"), iterations = 100000) {
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

const client = new pg.Client({ connectionString: vars.DATABASE_URL });
await client.connect();

// 1. Drop duplicate tables (created by schema.sql; all empty)
for (const t of ["blog", "files", "leads", "portfolio", "users"]) {
  await client.query(`DROP TABLE IF EXISTS "${t}"`);
  console.log(`dropped duplicate table: ${t}`);
}

// 2. Reset the admin password
const adminPassword = process.env.ADMIN_PASSWORD ?? "MovoX@2026";
const encoded = hashPassword(adminPassword);
const adminRes = await client.query(
  `UPDATE admin_users SET password_hash = $1, is_active = TRUE WHERE email = $2 RETURNING id, email, role`,
  [encoded, "admin@heymovox.com"],
);
if (adminRes.rows[0]) {
  console.log(`reset admin password for ${adminRes.rows[0].email} (role: ${adminRes.rows[0].role})`);
} else {
  console.warn("admin@heymovox.com not found — no password reset performed.");
}

// 3. Seed blogs from the site content when the table is empty
const content = JSON.parse(readFileSync(join(root, "src", "seed-content.json"), "utf8"));
const count = await client.query(`SELECT COUNT(*)::int AS n FROM blogs`);
if (Number(count.rows[0].n) === 0 && content.blog?.length) {
  for (const a of content.blog) {
    const minutes = Number(String(a.readTime ?? "5").replace(/\D/g, "")) || 5;
    await client.query(
      `INSERT INTO blogs (slug, title, excerpt, category, published_on, reading_minutes, image,
                         author, author_role, body, related_services, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (slug) DO NOTHING`,
      [
        a.slug, a.title, a.excerpt, a.category, a.publishedAt, minutes, a.image,
        a.author, "MovoX Team", JSON.stringify(a.content ?? []),
        a.related ?? [], true,
      ],
    );
  }
  console.log(`seeded ${content.blog.length} articles into blogs`);
} else {
  console.log(`blogs already populated (${count.rows[0].n}) — skipping seed`);
}

await client.end();
console.log("Done.");
