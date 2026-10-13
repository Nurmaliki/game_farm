# Deployment Nusantara Farm

## Prasyarat

- Node.js yang kompatibel dengan dependency lockfile dan Yarn 1.x.
- Repository telah terhubung ke project Vercel.
- Build command: `npm run build`.
- Output directory: `build`.
- Tidak ada environment variable atau secret yang dibutuhkan oleh client.

## Verifikasi sebelum deployment

Jalankan quality gate lengkap:

```bash
yarn install --frozen-lockfile
npm run release:verify
```

Jangan deploy apabila salah satu langkah gagal. Peringatan ukuran chunk Phaser harus dicatat, tetapi bukan kegagalan build saat ini.

## Deployment

1. Deploy commit kandidat ke Vercel Preview.
2. Jalankan checklist di `release-checklist.md` terhadap URL Preview.
3. Verifikasi header CSP dan header keamanan berasal dari `vercel.json`.
4. Verifikasi refresh langsung pada `/play` dan `/settings` tidak menghasilkan 404.
5. Promosikan deployment Preview yang sama ke Production setelah seluruh pemeriksaan lulus.
6. Catat commit, URL deployment, tanggal, browser, perangkat, dan hasil FPS.

Setelah memperoleh URL Preview, jalankan verifikasi HTTP otomatis:

```bash
npm run deployment:verify -- https://nama-project-git-branch.vercel.app
```

Verifier memeriksa HTTPS, `/`, `/play`, `/settings`, manifest, service worker, seluruh security header wajib, dan kebijakan revalidasi service worker.

## Smoke test produksi

- Buka menu utama dan mulai permainan.
- Simpan dua kali, pulihkan backup, lalu muat kembali save.
- Refresh `/play` secara langsung.
- Setelah satu kunjungan online, aktifkan mode offline dan buka ulang aplikasi.
- Pastikan impor save rusak ditolak.
- Pastikan tidak ada error kritis di console dan network panel.

Smoke test lokal terhadap output produksi dapat diulang dengan:

```bash
npm run build
npm run test:e2e:production
```

## Data pemain

Save tersimpan di IndexedDB pengguna, bukan Vercel. Deployment atau rollback aplikasi tidak memulihkan save yang telah dihapus dari browser. Sebelum migrasi schema berisiko, pertahankan kompatibilitas lama dan uji ekspor/impor menggunakan salinan save.
