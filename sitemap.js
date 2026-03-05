#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function createSitemap(startDir) {
  const results = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === '.' || entry.name === '..') {
        continue;
      }

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name.toLowerCase() === 'index.html') {
        const rel = path.relative(startDir, fullPath).split(path.sep).join('/');

        if (rel === 'index.html') {
          continue;
        }

        results.push({
          url: './' + rel,
          label: labelFromRelativePath(rel)
        });
      }
    }
  }

  await walk(startDir);

  // Keep output stable for cleaner diffs.
  results.sort((a, b) => a.url.localeCompare(b.url));
  return results;
}

function labelFromRelativePath(relPath) {
  const clean = relPath.replace(/\\/g, '/');
  if (clean === 'index.html') {
    return 'Home';
  }

  const parts = clean.split('/');
  parts.pop();
  return parts[parts.length - 1] || 'Page';
}

async function writeJson(sitemap, outPath) {
  const payload = JSON.stringify(sitemap, null, 2) + '\n';
  await fs.writeFile(outPath, payload, 'utf8');
}

async function main() {
  const startDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  const outFile = process.argv[3]
    ? path.resolve(process.argv[3])
    : path.join(startDir, 'site-links.json');

  const map = await createSitemap(startDir);
  await writeJson(map, outFile);
  console.log('Wrote', outFile, `(${map.length} links)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
