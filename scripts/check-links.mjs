// Checks every internal link and asset reference in dist/ resolves to a built
// file, and that in-page #fragments exist. No dependencies. Run after a build.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = process.env.DIST_DIR ?? fileURLToPath(new URL('../dist/', import.meta.url));
const base = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');

/** @param {string} dir @returns {Promise<string[]>} */
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** @param {string} p */
const exists = (p) =>
  stat(p).then(
    () => true,
    () => false,
  );

/** @param {string} urlPath @returns {Promise<string | null>} */
async function resolveFile(urlPath) {
  if (!urlPath.startsWith(base)) return null;
  const rel = decodeURIComponent(urlPath.slice(base.length));
  for (const candidate of [rel, posix.join(rel, 'index.html'), `${rel}.html`]) {
    const full = join(dist, candidate);
    if ((await exists(full)) && (await stat(full)).isFile()) return full;
  }
  return null;
}

const ids = new Map();
/** @param {string} file */
async function idsOf(file) {
  if (!ids.has(file)) {
    const html = await readFile(file, 'utf8');
    ids.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return ids.get(file);
}

const pages = await walk(dist);
const problems = [];
let checked = 0;

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const pageUrl = new URL(base + relative(dist, page).replace(/index\.html$/, ''), 'http://site');
  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (!raw || /^(https?:|mailto:|tel:|data:|javascript:)/.test(raw) || raw.startsWith('//'))
      continue;
    const url = new URL(raw.replaceAll('&amp;', '&'), pageUrl);
    if (url.origin !== 'http://site') continue;
    checked++;
    const target = url.pathname === pageUrl.pathname ? page : await resolveFile(url.pathname);
    if (!target) {
      problems.push(`${relative(dist, page)}: ${attr}="${raw}" → missing`);
      continue;
    }
    const frag = decodeURIComponent(url.hash.slice(1));
    if (frag && target.endsWith('.html') && !(await idsOf(target)).has(frag)) {
      problems.push(`${relative(dist, page)}: ${attr}="${raw}" → no #${frag}`);
    }
  }
}

console.log(`Checked ${checked} internal references in ${pages.length} pages.`);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('All internal links resolve.');
