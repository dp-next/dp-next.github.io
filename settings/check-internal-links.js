const fs = require('fs');
const path = require('path');

const siteArg = process.argv[2] || '_site';
const siteDir = path.resolve(process.cwd(), siteArg);

if (!fs.existsSync(siteDir)) {
  console.error(`Site directory does not exist: ${siteDir}`);
  process.exit(1);
}

const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (entry.isFile() && fullPath.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

walk(siteDir);

const skipSchemes = ['http:', 'https:', 'mailto:', 'tel:', 'javascript:', 'data:'];
const missing = [];

function shouldSkip(link) {
  if (!link || link.startsWith('#')) return true;
  return skipSchemes.some((scheme) => link.startsWith(scheme));
}

function normalizeLink(rawLink) {
  return rawLink.split('#')[0].split('?')[0].trim();
}

function resolveCandidatePaths(filePath, linkPath) {
  const candidates = [];

  if (linkPath.startsWith('/')) {
    const rootRelative = linkPath.replace(/^\/+/, '');
    candidates.push(path.join(siteDir, rootRelative));
  } else {
    candidates.push(path.resolve(path.dirname(filePath), linkPath));
    candidates.push(path.join(siteDir, linkPath));
  }

  return candidates;
}

function hasExistingTarget(targetPath) {
  if (fs.existsSync(targetPath)) return true;

  if (!path.extname(targetPath)) {
    const htmlPath = `${targetPath}.html`;
    if (fs.existsSync(htmlPath)) return true;

    const indexPath = path.join(targetPath, 'index.html');
    if (fs.existsSync(indexPath)) return true;
  }

  return false;
}

const hrefRegex = /(?:href|src)\s*=\s*"([^"]+)"/gi;

for (const filePath of htmlFiles) {
  const html = fs.readFileSync(filePath, 'utf8');
  let match;

  while ((match = hrefRegex.exec(html)) !== null) {
    const rawLink = match[1];
    if (shouldSkip(rawLink)) continue;

    const linkPath = normalizeLink(rawLink);
    if (!linkPath) continue;
    if (linkPath.includes('site_libs/quarto-diagram/')) continue;

    const candidates = resolveCandidatePaths(filePath, linkPath);
    const found = candidates.some((candidatePath) => hasExistingTarget(candidatePath));

    if (!found) {
      missing.push({
        file: path.relative(siteDir, filePath),
        link: rawLink,
      });
    }
  }
}

if (missing.length > 0) {
  console.error(`Found ${missing.length} broken internal reference(s):`);
  for (const item of missing.slice(0, 200)) {
    console.error(`- ${item.file} -> ${item.link}`);
  }
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files. No broken internal href/src links found.`);
