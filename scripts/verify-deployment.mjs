const input = process.argv[2];

if (!input) {
  throw new Error('Gunakan: npm run deployment:verify -- https://preview.example');
}

const base = new URL(input);
if (base.protocol !== 'https:') throw new Error('Deployment harus menggunakan HTTPS.');

const routes = ['/', '/play', '/settings', '/manifest.webmanifest', '/sw.js'];
for (const route of routes) {
  const response = await fetch(new URL(route, base), { redirect: 'follow' });
  if (!response.ok) throw new Error(`${route} mengembalikan HTTP ${response.status}.`);
  console.log(`OK ${response.status} ${route}`);
}

const root = await fetch(base);
const expectedHeaders = [
  'content-security-policy',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy'
];
for (const header of expectedHeaders) {
  if (!root.headers.get(header)) throw new Error(`Header deployment hilang: ${header}`);
}

const worker = await fetch(new URL('/sw.js', base));
const workerCache = worker.headers.get('cache-control') ?? '';
if (!workerCache.includes('must-revalidate')) {
  throw new Error(`Cache-Control service worker tidak aman: ${workerCache || '(kosong)'}`);
}

const manifest = await (await fetch(new URL('/manifest.webmanifest', base))).json();
if (manifest.name !== 'Nusantara Farm' || !manifest.icons?.length) {
  throw new Error('Manifest deployment tidak lengkap.');
}

console.log(`Deployment verification lulus: ${base.origin}`);
