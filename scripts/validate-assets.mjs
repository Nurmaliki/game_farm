import { existsSync, readFileSync } from 'node:fs';

const registry = 'static/assets/registry.json';
if (!existsSync(registry)) throw new Error('Asset registry tidak ditemukan');
const entries = JSON.parse(readFileSync(registry, 'utf8'));
for (const asset of entries) {
  if (!asset.id || !asset.status || !asset.license) throw new Error(`Metadata aset tidak lengkap: ${asset.id ?? 'tanpa id'}`);
  if (asset.path && !existsSync(`static/${asset.path}`)) throw new Error(`Aset tidak ditemukan: ${asset.path}`);
}
console.log(`Valid: ${entries.length} entri aset`);
