# Rollback Plan

## Pemicu rollback

Rollback dilakukan apabila rilis menyebabkan aplikasi gagal dimuat, save tidak dapat dibaca, kehilangan progres, exploit ekonomi kritis, kegagalan offline untuk seluruh pengguna, atau regresi keamanan severity tinggi/kritis.

## Prosedur

1. Hentikan promosi deployment baru dan catat waktu serta gejala.
2. Di Vercel, pilih deployment produksi stabil sebelumnya lalu gunakan **Promote to Production**.
3. Verifikasi `/`, `/play`, service worker, dan load save pada deployment hasil rollback.
4. Informasikan bahwa pengguna tidak perlu menghapus site data; menghapus IndexedDB dapat menghilangkan progres.
5. Buat salinan JSON dari save terdampak sebelum mencoba perbaikan atau migrasi ulang.
6. Dokumentasikan root cause, versi terdampak, dan test regresi yang ditambahkan.

## Service worker dan cache

Rollback harus memakai nomor cache service worker yang berbeda dari rilis bermasalah. Jika kode rollback berasal dari versi lama, naikkan konstanta `VERSION` sebelum build agar client tidak terus memakai cache rusak. Jangan meminta pengguna membersihkan seluruh site data kecuali pemulihan terakhir dan setelah ekspor save.

## Batas pemulihan

Rollback deployment hanya mengganti aset aplikasi. Data pemain berada di IndexedDB perangkat dan tidak ikut di-rollback. Recovery data menggunakan backup per slot atau file ekspor pengguna.
