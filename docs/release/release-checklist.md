# Release Checklist

## Otomatis

- [ ] `yarn install --frozen-lockfile` berhasil.
- [ ] `npm run release:verify` berhasil.
- [ ] Preview deployment berhasil dan tidak memiliki error build.
- [x] Dependency audit ditinjau; audit ulang 13 Oktober 2026 memiliki 0 critical/high/moderate dan 1 low transitive.

## Gameplay dan data

- [ ] Core loop farming, ranching, fishing, mining, quest, dan ekonomi diuji.
- [ ] Save, load, ekspor, impor, backup, dan restore diuji dengan data non-kosong.
- [ ] Migrasi save versi lama diuji menggunakan fixture representatif.
- [ ] Multi-tab warning dan storage quota error diuji.
- [ ] Refresh pada `/`, `/play`, dan `/settings` berhasil.

## PWA dan kompatibilitas

- [ ] Instalasi PWA berhasil pada browser target.
- [ ] Startup serta save/load offline berhasil setelah kunjungan online pertama.
- [x] Chromium, Firefox, dan WebKit desktop diverifikasi melalui Playwright; konfirmasi manual perangkat nyata tetap diperlukan.
- [ ] Perangkat Android dan iOS representatif diverifikasi.
- [ ] Keyboard, pointer, dan kontrol sentuh diverifikasi.

## Performa dan keamanan

- [ ] FPS desktop mencapai target 60 pada perangkat representatif.
- [ ] FPS mobile berada pada rentang target 30–60.
- [ ] Penggunaan memori setelah sesi panjang diperiksa.
- [ ] CSP dan security headers diverifikasi pada URL deployment.
- [ ] Tidak ada secret, credential, atau source map sensitif pada output client.

## Persetujuan rilis

- [ ] Known issues dan hasil matriks pengujian dicatat.
- [ ] Commit dan deployment ID kandidat dicatat.
- [ ] Rollback owner dan deployment stabil sebelumnya telah ditentukan.
- [ ] Product/art review untuk aset serta audio final selesai.
