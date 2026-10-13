# Arsitektur Vertical Slice

Nusantara Farm memakai satu state authoritative di `application/game-store.ts`. Komponen Svelte dan scene Phaser hanya mengirim command; aturan farming, ekonomi, serta ranching berada di TypeScript murni pada layer domain. IndexedDB diakses melalui repository Dexie dan payload save divalidasi Zod.

Alur data: input pemain → application command → domain validation/mutation → store notification → Phaser/Svelte render. UI tidak memodifikasi state secara langsung.

## Status aset

Visual game saat ini dibentuk dari Phaser Graphics dan merupakan placeholder orisinal. Aset pixel-art premium, animasi lengkap, dan audio final masih merupakan release blocker untuk fase produksi.

## Scope v0.1

- Main menu dan farm playable
- Movement keyboard
- Cangkul, tanam padi, siram harian, panen
- Ayam dengan lapar/kebahagiaan, pakan, interaksi, telur
- Kios beli/jual dan transaksi atomic
- Satu save slot IndexedDB, service worker, manifest PWA
- Unit test aturan domain dan smoke test browser

Fitur Phase 2–11 belum boleh dianggap selesai atau production-ready.
