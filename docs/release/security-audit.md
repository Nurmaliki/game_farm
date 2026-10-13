# Dependency Security Audit

Audit awal dan audit ulang setelah upgrade dijalankan pada 13 Oktober 2026 dengan:

```bash
npm run release:audit
```

Hasil awal: **16 advisory — 1 high, 12 moderate, 3 low** pada Svelte 4.2.15 dan SvelteKit 2.5.7.

Dependency kemudian diperbarui ke Svelte 5.57.2, SvelteKit 2.70.3, adapter-static 3.0.10, vite-plugin-svelte 5.1.1, Vite 6.4.4, dan svelte-check 4.7.6. Audit ulang menghasilkan **1 advisory low, 0 moderate, 0 high, 0 critical**.

## Keputusan rilis

Blocker high telah selesai. Temuan low tersisa berasal dari package transitive `cookie` di bawah SvelteKit. Aplikasi memakai static adapter, `ssr=false`, tidak memiliki backend, dan tidak membaca atau menulis cookie sehingga jalur terdampak tidak digunakan. Temuan tetap dipantau sampai SvelteKit mengambil versi transitive patched.

## Remediasi

1. Pantau pembaruan transitive `cookie` dari SvelteKit.
2. Jalankan `npm run release:audit` pada setiap kandidat release; target wajib tidak ada high/critical.
3. Ulangi tes save migration, offline service worker, CSP, dan matriks browser sebelum deployment.
