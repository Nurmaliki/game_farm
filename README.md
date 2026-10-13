# Nusantara Farm

Game farming RPG offline-first berbasis SvelteKit, Phaser 3, TypeScript, dan IndexedDB. Seluruh progres permainan disimpan lokal di perangkat; aplikasi tidak membutuhkan backend atau database remote.

## Menjalankan proyek

```bash
yarn install
npm run dev
```

Buka alamat yang ditampilkan Vite. Untuk memeriksa perubahan sebelum rilis:

```bash
npm run release:verify
```

Perintah tersebut menjalankan type-check, lint, unit test, validasi aset, build statis, pemeriksaan artefak rilis, dan smoke test build produksi termasuk startup offline.

## Build dan deployment

```bash
npm run build
npm run preview
```

Output statis berada di `build/`. Panduan Vercel, verifikasi, dan rollback tersedia di [docs/release/deployment.md](docs/release/deployment.md).

## Penyimpanan pemain

Save berada di IndexedDB browser. Pemain dapat mengekspor JSON dari layar permainan. Deployment versi baru tidak boleh menghapus IndexedDB atau mengganti nama database `nusantara-farm` tanpa migrasi.
