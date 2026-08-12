import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const projectRoot = join(import.meta.dirname, '..');
const clientRoot = join(projectRoot, 'client', 'src');
const appPath = join(clientRoot, 'App.tsx');
const baseUrl = process.argv[2] || 'http://127.0.0.1:3000';

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [fullPath] : [];
  });
}

function normalizeSampleRoute(route) {
  return route
    .replace(':ideaId', '120002')
    .replace(':id', '1');
}

function pathMatchesRoute(target, route) {
  const pattern = `^${route.replace(/:[^/]+/g, '[^/]+').replace(/\//g, '\\/')}\\/?$`;
  return new RegExp(pattern).test(target);
}

const appSource = readFileSync(appPath, 'utf8');
const routes = [...appSource.matchAll(/<Route\s+path=[{]?["'](\/[^"']+)["']/g)]
  .map((match) => match[1])
  .filter((route) => route !== '/404')
  .sort();

const duplicateRoutes = [...new Set(routes.filter((route, index) => routes.indexOf(route) !== index))];

const sourceFiles = walk(clientRoot);
const internalLinks = [];
const linkPatterns = [
  /(?:href|to)\s*[:=]\s*[{]?["'](\/[^"'#?]+)["']/g,
  /(?:navigate|setLocation)\(["'](\/[^"'#?]+)["']/g,
];

for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8');
  for (const pattern of linkPatterns) {
    for (const match of source.matchAll(pattern)) {
      internalLinks.push({ target: match[1], file: relative(projectRoot, file) });
    }
  }
}

const uniqueLinks = [...new Map(internalLinks.map((link) => [`${link.target}:${link.file}`, link])).values()];
const staticAssetPattern = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i;
const unresolvedLinks = uniqueLinks.filter(({ target }) => !staticAssetPattern.test(target) && !routes.some((route) => pathMatchesRoute(target, route)));

const routeResults = [];
for (const route of routes) {
  const url = `${baseUrl.replace(/\/$/, '')}${normalizeSampleRoute(route)}`;
  try {
    const response = await fetch(url, { redirect: 'manual' });
    routeResults.push({ route, url, status: response.status, ok: response.status >= 200 && response.status < 400 });
  } catch (error) {
    routeResults.push({ route, url, status: null, ok: false, error: error.message });
  }
}

const report = {
  testedAt: new Date().toISOString(),
  baseUrl,
  routeCount: routes.length,
  passedRouteCount: routeResults.filter((result) => result.ok).length,
  failedRoutes: routeResults.filter((result) => !result.ok),
  internalLinkCount: uniqueLinks.length,
  unresolvedLinks,
  duplicateRoutes,
};

const reportDir = join(projectRoot, 'reports');
mkdirSync(reportDir, { recursive: true });
writeFileSync(join(reportDir, 'route-audit.json'), `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify({
  routeCount: report.routeCount,
  passedRouteCount: report.passedRouteCount,
  failedRouteCount: report.failedRoutes.length,
  internalLinkCount: report.internalLinkCount,
  unresolvedLinkCount: report.unresolvedLinks.length,
  duplicateRouteCount: report.duplicateRoutes.length,
}, null, 2));

if (report.failedRoutes.length || report.unresolvedLinks.length || report.duplicateRoutes.length) process.exitCode = 1;
