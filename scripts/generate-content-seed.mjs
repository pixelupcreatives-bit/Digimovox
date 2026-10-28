/**
 * One-off generator: turns the site's content data (src/data/insights.ts and
 * src/data/projects.ts) into worker/src/seed-content.json, so the Worker seeds
 * the database from the exact same baseline content the public site uses.
 *
 * Run: node scripts/generate-content-seed.mjs
 */
import { transform } from "esbuild";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();

async function extract(file, exportName) {
  const src = readFileSync(join(root, file), "utf8");
  const { code } = await transform(src, { loader: "ts", format: "esm" });
  const dir = mkdtempSync(join(tmpdir(), "movox-seed-"));
  const tmp = join(dir, "mod.mjs");
  writeFileSync(tmp, code);
  const mod = await import(pathToFileURL(tmp).href);
  return mod[exportName];
}

const insights = await extract("src/data/insights.ts", "insights");
const projects = await extract("src/data/projects.ts", "projects");

writeFileSync(
  join(root, "worker/src/seed-content.json"),
  JSON.stringify({ blog: insights, portfolio: projects }, null, 2),
);

console.log(`Generated worker/src/seed-content.json — blog: ${insights.length}, portfolio: ${projects.length}`);
