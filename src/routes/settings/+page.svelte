<script lang="ts">
  import { onMount } from 'svelte';
  import AudioControl from '$lib/ui/AudioControl.svelte';
  let lowEffects = false;
  let tooltips = true;
  onMount(() => {
    lowEffects = localStorage.getItem('nusantara-low-effects') === 'true';
    tooltips = localStorage.getItem('nusantara-tooltips') !== 'false';
  });
  function saveGraphics() {
    localStorage.setItem('nusantara-low-effects', String(lowEffects));
    localStorage.setItem('nusantara-tooltips', String(tooltips));
  }
</script>

<svelte:head><title>Pengaturan · Nusantara Farm</title></svelte:head>
<main>
  <a href="/">← Kembali ke beranda</a>
  <header><small>KONFIGURASI</small><h1>Pengaturan</h1><p>Sesuaikan pengalaman bermain dengan perangkatmu.</p></header>
  <section><div class="icon">♫</div><div><h2>Audio</h2><p>Audio dimulai setelah interaksi pertama mengikuti kebijakan browser.</p><AudioControl /></div></section>
  <section><div class="icon">✦</div><div><h2>Grafis</h2><label><input type="checkbox" bind:checked={lowEffects} on:change={saveGraphics}> Mode efek rendah</label><small>Mengurangi hujan, partikel, dan getaran kamera. Aktif setelah membuka ulang area kebun.</small><label><input type="checkbox" bind:checked={tooltips} on:change={saveGraphics}> Tooltip petak</label><small>Menampilkan nama tanaman, kebutuhan air, dan waktu panen saat pointer diarahkan.</small></div></section>
  <section><div class="icon">⌨</div><div><h2>Kontrol</h2><p><kbd>WASD</kbd> atau tombol panah untuk bergerak. Gunakan angka <kbd>1–6</kbd> untuk memilih alat dan klik petak untuk beraksi.</p></div></section>
</main>
<style>
  :global(body){margin:0;background:radial-gradient(circle at 50% 0,#315f49,#071e19 70%);color:#f7efd7;font-family:Inter,system-ui,sans-serif}main{max-width:760px;margin:5vh auto;padding:2rem}a{color:#f1cc65;text-decoration:none}header{margin:2rem 0}header small{letter-spacing:.2em;color:#d5b85f}h1{margin:.3rem 0;font:900 3rem Georgia,serif}header p{color:#bcd0c1}section{display:grid;grid-template-columns:52px 1fr;gap:15px;padding:1.3rem;margin:1rem 0;background:#12362ddb;border:1px solid #b18c4866;border-radius:15px;box-shadow:0 14px 35px #00150f66}section h2{margin:0 0 .5rem;font:800 1.15rem Georgia,serif;color:#f1d17b}section p,section small{color:#bdd0c1;line-height:1.5}.icon{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:#2c614a;color:#f3d274;font-size:1.3rem}label{display:flex;align-items:center;gap:10px;margin:1rem 0 .25rem;font-weight:700}input{width:19px;height:19px;accent-color:#d9b94e}kbd{padding:.15rem .4rem;border:1px solid #708f7b;border-radius:4px;background:#0a261f;color:#f6dc8c}@media(max-width:600px){main{padding:1rem}h1{font-size:2.2rem}section{grid-template-columns:1fr}.icon{display:none}}
</style>
