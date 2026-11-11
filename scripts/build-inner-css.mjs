import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Builds the marketing inner-page stylesheets from the chunks captured from the
 * live site (docs/research/tagmarkets/source/astro).
 *
 * Two kinds of output:
 *
 * - `inner-shared.css` — the chunk every page loads. Imported once by the
 *   `(pages)` layout, before `tagmarkets.css`.
 * - `inner-<page>.css` — the optional page-specific chunk. Imported only by
 *   that page, because chunks contain bare element selectors (e.g. `h1`) that
 *   would otherwise leak into every other page.
 *
 * Astro scoping attributes are removed so the captured markup and the cloned
 * markup share the same selectors.
 */

const root = process.cwd();
const astroDir = path.join(root, "docs/research/tagmarkets/source/astro");
const appDir = path.join(root, "src/app");

const shared = "account-types.aphhWkUl.css";
const pageChunks = {
  "account-types": "account-types.7oyeqHyf.css",
  amplify: "amplify.BuAIev0P.css",
  "deposit-methods": "deposit-methods.Ba8AlA8o.css",
  "copy-trade": "copy-trade.zR-yBC33.css",
  partners: "partners.D0lz1VmD.css",
  education: "education.DaseY2Ip.css",
};

/** `[data-astro-cid-abc123]` -> "" without touching the rest of the CSS. */
function stripAstro(css) {
  return css
    .replace(/\[data-astro-cid-[a-z0-9]+\]/g, "")
    .replace(/([},])\s+\./g, "$1.")
    .replace(/\s*>\s*/g, ">")
    .trimStart();
}

async function writeChunk(sourceFile, outFile) {
  const css = await readFile(path.join(astroDir, sourceFile), "utf8");
  const banner = `/* Generated from ${sourceFile} by scripts/build-inner-css.mjs — do not edit. */\n`;
  await writeFile(outFile, banner + stripAstro(css), "utf8");
  const bytes = (await readFile(outFile)).length;
  console.log(`${path.relative(root, outFile)} — ${bytes} bytes`);
}

await writeChunk(shared, path.join(appDir, "inner-shared.css"));

for (const [page, file] of Object.entries(pageChunks)) {
  await writeChunk(file, path.join(appDir, `inner-${page}.css`));
}
