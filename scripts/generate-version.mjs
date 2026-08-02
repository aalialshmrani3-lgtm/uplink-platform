import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'dist', 'public');

try {
  mkdirSync(outDir, { recursive: true });
} catch {}

const version = {
  buildId: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  builtAt: new Date().toISOString()
};

writeFileSync(join(outDir, 'version.json'), JSON.stringify(version));
console.log('[version] Generated:', version.buildId);
