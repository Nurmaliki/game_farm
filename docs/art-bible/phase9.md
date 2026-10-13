# Phase 9 Visual Direction

Atlas `nusantara-atlas-v1.png` dibuat dengan built-in OpenAI image generation untuk proyek ini. Prompt meminta pixel art orisinal top-down 3/4 dengan tile logic 16 px, palet hijau tropis, emas padi, terracotta, turquoise, bamboo tan, tanpa teks/logo/watermark atau karakter berhak cipta.

Atlas berformat RGBA 1254×1254 dan memuat farmer directions, delapan crop, ternak, pets, lima pohon buah, bangunan, tiles, serta weather/environment particles. Phaser memakai nearest-neighbor rendering. Character dan farmhouse kini memakai crop atlas; shape rendering lama tetap menjadi fallback untuk entity yang frame-map-nya belum dipotong ke atlas JSON.

Lighting malam dan overlay hujan/badai dirender dinamis. Audio ambience bersifat procedural original dan baru aktif setelah input pemain untuk mematuhi browser autoplay policy.
