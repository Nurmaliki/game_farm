import { existsSync, readFileSync, statSync } from 'node:fs';

const requiredBuildFiles = [
  'build/index.html',
  'build/play.html',
  'build/settings.html',
  'build/sw.js',
  'build/manifest.webmanifest',
  'build/assets/icons/nusantara-farm.svg'
];

const missing = requiredBuildFiles.filter((file) => !existsSync(file));
if (missing.length > 0) throw new Error(`Artefak build hilang: ${missing.join(', ')}`);

const manifest = JSON.parse(readFileSync('build/manifest.webmanifest', 'utf8'));
if (!manifest.icons?.length || manifest.display !== 'standalone') {
  throw new Error('Manifest PWA belum memiliki ikon atau standalone display.');
}

const deployment = JSON.parse(readFileSync('vercel.json', 'utf8'));
const headers = new Set(
  deployment.headers?.flatMap((rule) => rule.headers ?? []).map(({ key }) => key)
);
for (const key of ['Content-Security-Policy', 'X-Content-Type-Options', 'Permissions-Policy']) {
  if (!headers.has(key)) throw new Error(`Header keamanan hilang: ${key}`);
}

const buildBytes = requiredBuildFiles.reduce((sum, file) => sum + statSync(file).size, 0);
console.log(`Release check lulus: ${requiredBuildFiles.length} artefak inti (${buildBytes} byte).`);
