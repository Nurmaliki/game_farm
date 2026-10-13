<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { listSaves, loadGame } from '$lib/persistence/database';
  import { gameCommands } from '$lib/application/game-store';
  import { createInitialState } from '$lib/domain/state';

  let hasSave = false;
  onMount(async () => { hasSave = (await listSaves()).length > 0; });
  function newGame() { gameCommands.replace(createInitialState()); goto('/play'); }
  async function continueGame() { const save = await loadGame(1); if (save) gameCommands.replace(save); goto('/play'); }
</script>

<svelte:head><title>Nusantara Farm</title><meta name="description" content="RPG bertani offline dengan suasana pedesaan tropis Indonesia." /></svelte:head>

<main>
  <section class="hero">
    <div class="eyebrow">SEBUAH WARISAN · SEBUAH AWAL BARU</div>
    <h1>NUSANTARA<br /><span>FARM</span></h1>
    <p>Hidupkan kembali kebun keluarga, rawat hewan, dan tumbuh bersama desa.</p>
    <div class="actions">
      <button class="primary" on:click={newGame}>Mulai Petualangan</button>
      {#if hasSave}<button on:click={continueGame}>Lanjutkan Hari Terakhir</button>{/if}
    </div>
    <small>Vertical slice v0.1 · progres tersimpan lokal · dapat dimainkan offline</small>
  </section>
  <div class="landscape" aria-hidden="true"><div class="sun"></div><div class="mountain one"></div><div class="mountain two"></div><div class="field"></div><div class="hut"></div></div>
</main>

<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { margin: 0; color: #f8f0d3; background: #102f2a; font-family: ui-monospace, 'Courier New', monospace; }
  main { min-height: 100dvh; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; background: radial-gradient(circle at 25% 20%, #315e4c, #102f2a 58%); }
  .hero { z-index: 2; display: flex; flex-direction: column; justify-content: center; max-width: 620px; padding: 8vw; }
  .eyebrow { color: #e0bf62; letter-spacing: .18em; font-size: .75rem; margin-bottom: 1.4rem; }
  h1 { margin: 0; line-height: .82; letter-spacing: -.07em; font: 900 clamp(4rem, 9vw, 8.5rem)/.82 Georgia, serif; text-shadow: 7px 7px 0 #0b251f; }
  h1 span { color: #edc75f; }
  p { max-width: 490px; font: 1.05rem/1.7 system-ui, sans-serif; color: #d5dec7; margin: 2rem 0; }
  .actions { display: flex; gap: .8rem; flex-wrap: wrap; }
  button { cursor: pointer; border: 2px solid #d9c887; padding: .95rem 1.2rem; color: #f8f0d3; background: #204b40; border-radius: 5px; font: 700 .85rem ui-monospace, monospace; box-shadow: 4px 4px 0 #071d18; }
  button:hover { transform: translate(-1px,-1px); box-shadow: 6px 6px 0 #071d18; }
  .primary { color: #19332c; background: #edc75f; }
  small { margin-top: 2rem; color: #91ae9d; }
  .landscape { position: relative; min-height: 100dvh; background: linear-gradient(#6da9a2 0 42%, #96b965 42%); border-left: 2px solid #d4c47444; overflow: hidden; }
  .sun { position: absolute; width: 100px; height: 100px; border-radius: 50%; background: #f2cc65; right: 14%; top: 11%; box-shadow: 0 0 0 18px #f2cc6522; }
  .mountain { position: absolute; width: 420px; height: 300px; background: #355e51; transform: rotate(45deg); top: 28%; }
  .mountain.one { left: -120px; } .mountain.two { right: -210px; background: #48775c; top: 34%; }
  .field { position: absolute; inset: 62% 0 0; background: repeating-linear-gradient(165deg,#5d8744 0 18px,#79a352 19px 34px); }
  .hut { position: absolute; width: 150px; height: 100px; background: #b77946; bottom: 14%; left: 30%; box-shadow: inset 0 -16px #865331; }
  .hut:before { content:''; position:absolute; width:180px; height:90px; background:#5c3b30; transform:rotate(8deg) skew(-22deg); left:-15px; top:-55px; }
  @media(max-width:800px){ main{grid-template-columns:1fr}.hero{padding:12vw 8vw}.landscape{position:absolute;inset:0;opacity:.22}h1{font-size:20vw} }
</style>
