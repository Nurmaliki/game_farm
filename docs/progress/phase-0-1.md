# Progress Phase 0–1

Implementasi awal menyediakan fondasi SvelteKit, TypeScript strict, Phaser, Dexie, Zod, service worker, Vitest, Playwright, dan static adapter. Vertical slice dapat dimainkan tanpa backend.

Known gaps: mobile memakai input pointer untuk tool tetapi virtual joystick belum tersedia; autosave, multi-slot UI, ekspor/impor UI, simulasi waktu real-time, art/audio final, dan seluruh konten phase lanjutan belum diimplementasikan.

## Phase 2 — Core Farming and Ranching

- Delapan crop data-driven: padi, jagung, wortel, tomat, cabai, singkong, stroberi, dan semangka.
- Validasi musim, durasi growth, regrowth, pupuk, serta hasil kualitas unggul.
- Upgrade cangkul dan penyiram hingga level 3.
- Ayam, sapi, kambing, dan domba dengan hunger, happiness, health, cleanliness, friendship, state AI, kapasitas housing, dan produk unik.
- Pengelolaan ternak serta pembelian/penjualan terintegrasi ke UI dan ekonomi.
- Save schema v2 dengan migrasi otomatis dari save v1.

## Phase 3 — Fishing and Foraging

- Lima lokasi memancing, empat tingkat joran, umpan, skill, dan stamina.
- State machine `IDLE → AIMING → CASTING → WAITING → BITE → HOOKED → MINIGAME → CAUGHT/ESCAPED`.
- Minigame zona tangkap, gerakan ikan, progress, tension, kesulitan, dan modifier peralatan.
- Dua belas spesies ikan dengan lokasi, musim, cuaca, waktu, rarity, serta harga masing-masing.
- Fish encyclopedia menyimpan jumlah tangkapan dan rekor ukuran terbaik.
- Tujuh resource foraging dengan spawn deterministik berdasarkan hari, musim, cuaca, dan rarity.
- Koleksi foraging, konsumsi stamina, pencegahan duplicate reward, dan integrasi penjualan.
- Save schema v3 dan migrasi save v1/v2.

## Phase 4 — Building, Crafting, and Cooking

- Katalog dua belas bangunan dengan ukuran, biaya, level, dan prasyarat data-driven.
- Placement grid 12×8, validasi batas/collision, konfirmasi, relokasi, serta upgrade.
- Resource hanya dikurangi setelah placement tervalidasi.
- Lima resep crafting/processing dengan building requirement dan antrean berbasis hari game.
- Delapan resep masakan dengan bahan yang tersedia dari farming, ranching, fishing, dan foraging.
- Konsumsi makanan memulihkan stamina dan dapat memberikan buff.
- Pencegahan early collection, duplicate collection, inventory negatif, dan antrean berlebih.
- Save schema v4 dengan migrasi v1–v3.

## Phase 5 — Mining and Exploration

- Peta enam area: kebun, desa, hutan, tambang, pantai, dan sungai.
- Area unlock dengan prerequisite dan biaya atomic, transisi, serta visit records.
- Delapan node tambang deterministik per hari dengan respawn terkontrol.
- Batu, tembaga, besi, emas, batu bara, kristal, dan mineral langka.
- Hardness, stamina, pickaxe level 1–3, deterministic drop, XP, dan integrasi inventory.
- Node depleted tidak dapat memberi reward berulang.
- Save schema v5 dengan migrasi v1–v4.

## Phase 6 — Advanced Farm Systems

- Orchard mangga, pisang, kelapa, jeruk, dan jambu dengan growth, musim, health, harvest, serta regrowth.
- Pembelian bibit dan kapasitas orchard tervalidasi.
- Beehive dengan capacity level, flower influence, seasonal productivity, dan honey collection.
- Fish pond construction, stocking satu spesies, feeding, condition, capacity, reproduction, dan controlled harvest.
- Proses produksi hanya berjalan sekali per hari game dan tidak bergantung wall clock.
- Save schema v6 dengan migrasi v1–v5.

## Phase 7 — Village Life

- Enam NPC data-driven dengan role, schedule, dialogue, birthday, dan friendship harian.
- Dua puluh satu quest lintas tutorial, farming, ranching, fishing, mining, foraging, crafting, cooking, exploration, serta story.
- Acceptance, objective item transaction, claim idempotent, coin/reputation reward, dan relationship reward.
- Museum menerima ikan, serangga, mineral, dan tanaman langka dengan unique donation records.
- Village reputation terintegrasi dengan quest, museum, dan festival.
- Lima festival offline dengan kalender musim/hari dan reward sekali per tahun.
- Kalender menampilkan season day, festival, dan ulang tahun NPC.
- Save schema v7 dengan migrasi v1–v6.

## Phase 8 — Personalization and Collections

- Cat, dog, dan horse dengan adoption, persistence, friendship, serta daily interaction.
- Horse mounting state untuk integrasi travel speed.
- Enam serangga dengan spawn musim/cuaca/rarity, stamina cost, catch record, dan museum-compatible inventory.
- Home customization grid 8×6 dengan enam furniture, harga, collision validation, wallpaper, flooring, dan house level state.
- Enam achievements untuk farming, fishing, mining, reputation, museum, dan economy dengan reward idempotent.
- Photo mode menyembunyikan HUD dan menyediakan kontrol keluar; screenshot tetap melalui browser lokal.
- Save schema v8 dengan migrasi v1–v7.

## Phase 9 — Visual Polish

- Atlas pixel-art RGBA orisinal berisi karakter, crop, animals, pets, orchard, buildings, tiles, dan effects.
- Farmer dan farmhouse atlas terintegrasi ke Phaser dengan nearest-neighbor rendering.
- Overlay hujan/badai, pencahayaan malam, water/environment polish, dan responsive UI refinements.
- Procedural ambient audio original, user-gesture activation, volume control, dan autoplay compliance.
- Asset registry mencatat dimensi, frame estimate, source, license, serta production status.
- Frame-map/animasi penuh dan audio recording final tetap perlu inspeksi artistik manual sebelum release claim.

## Phase 10 — Production Hardening

- IndexedDB schema v2 menambahkan lima backup bergulir per slot; save utama dan backup ditulis dalam satu transaksi.
- Pemulihan backup terbaru, ekspor/impor JSON tervalidasi Zod, batas impor 1 MB, pesan storage quota, dan peringatan konflik multi-tab tersedia dari layar permainan.
- Service worker memakai cache bernomor versi, membersihkan cache lama, mengklaim client saat aktivasi, dan menyediakan fallback navigasi offline untuk shell yang pernah dicache.
- Header produksi mencakup CSP, anti-MIME-sniffing, referrer policy, permissions policy, frame restriction, dan cross-origin opener policy.
- Regresi Phase 10 menguji round-trip ekspor/impor, penolakan save rusak/besar, konfigurasi cache offline, serta header keamanan.
- Build produksi terverifikasi. Chunk Phaser adalah aset terbesar: 1.464,12 kB minified / 335,44 kB gzip; pengukuran FPS desktop/mobile pada perangkat representatif tetap menjadi pekerjaan release.
- Kompatibilitas otomatis saat ini hanya diverifikasi pada Chromium lokal; Firefox, WebKit, instalasi PWA, dan skenario offline nyata tetap perlu matriks perangkat pada Phase 11.

## Phase 11 — Release Preparation

- Manifest PWA memiliki metadata aplikasi dan ikon SVG maskable; ikon ikut dalam offline shell.
- Quality gate `release:verify` menggabungkan type-check, lint, unit test, validasi aset, build, pemeriksaan artefak, dan smoke test output produksi.
- Smoke test produksi memverifikasi startup online, aktivasi service worker, startup ulang dalam mode offline, serta metadata manifest.
- Dokumentasi mencakup setup Vercel, urutan deployment Preview ke Production, smoke test, perlindungan data pemain, release checklist, dan rollback.
- Stack framework diperbarui ke Svelte 5.57.2 dan SvelteKit 2.70.3. Audit turun dari 16 advisory menjadi 1 low transitive, tanpa critical/high/moderate.
- Verifikasi perangkat/browser nyata, hasil FPS, dan validasi deployment Vercel tetap wajib sebelum klaim production-ready.

## Post-Phase 11 — Performance Hardening

- Phaser tetap dimuat malas hanya saat farm scene dibuka dan tidak masuk initial menu bundle.
- Runtime memakai Phaser Core dengan Canvas renderer; physics, tilemap, Phaser audio, WebGL debug, dan plugin yang tidak digunakan dikeluarkan saat build.
- Chunk farm scene turun dari 1.470,10 kB / 336,88 kB gzip menjadi 652,06 kB / 157,10 kB gzip.
- Performance budget otomatis membatasi dynamic farm chunk maksimal 700 kB.
- Smoke test produksi mengukur `requestAnimationFrame` selama satu detik dan mensyaratkan minimal 30 FPS di Chromium headless; hasil perangkat nyata tetap diperlukan.

## Post-Phase 11 — Browser Compatibility Matrix

- Playwright diperbarui ke 1.64.0 dengan project Chromium, Firefox, dan WebKit desktop.
- Smoke gameplay lintas-browser memverifikasi canvas Phaser, save/backup/restore IndexedDB, dan panel gameplay; 3 dari 3 project lulus.
- Matriks build produksi memverifikasi startup online, service worker, startup offline, canvas, serta manifest; 7 test lulus dan 2 FPS gate dilewati sesuai desain pada Firefox/WebKit.
- FPS gate headless tetap khusus Chromium karena konfigurasi anti-throttling dan karakteristik `requestAnimationFrame` berbeda antar-engine.
- Ikon browser memakai aset PWA yang sama untuk mencegah request favicon kosong.
- Validasi manual pada browser serta perangkat fisik tetap diperlukan sebelum menandai checklist mobile/perangkat nyata.

## Post-Phase 11 — Deployment Readiness

- Vercel memberi cache immutable satu tahun untuk chunk build ber-hash dan mewajibkan revalidasi `sw.js` pada setiap kunjungan.
- Perintah `deployment:verify` memvalidasi HTTPS, direct routes, PWA resources, security headers, serta cache policy terhadap URL Preview/Production.
- Repository belum terhubung ke project Vercel (`.vercel/project.json` belum tersedia) dan CLI Vercel belum terpasang, sehingga deployment eksternal belum dilakukan tanpa akun/target milik pengguna.
