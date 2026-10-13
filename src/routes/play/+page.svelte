<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import FarmGame from '$lib/game/FarmGame.svelte';
  import { gameCommands, gameState, notice, selectedTool, selectedCrop } from '$lib/application/game-store';
  import { loadGame, saveGame, exportSave, importSave, restoreLatestBackup, onExternalSave } from '$lib/persistence/database';
  import type { Tool } from '$lib/domain/state';
  import { CROPS } from '$lib/content/crops';
  import { ANIMALS } from '$lib/content/animals';
  import { FORAGE } from '$lib/content/forage';
  import FishingPanel from '$lib/ui/FishingPanel.svelte';
  import ForagingPanel from '$lib/ui/ForagingPanel.svelte';
  import ProductionPanel from '$lib/ui/ProductionPanel.svelte';
  import ExplorationPanel from '$lib/ui/ExplorationPanel.svelte';
  import AdvancedFarmPanel from '$lib/ui/AdvancedFarmPanel.svelte';
  import VillagePanel from '$lib/ui/VillagePanel.svelte';
  import PersonalizationPanel from '$lib/ui/PersonalizationPanel.svelte';
  import AudioControl from '$lib/ui/AudioControl.svelte';

  let showShop = false;
  let showBarn = false;
  let showFishing = false;
  let showForaging = false;
  let showProduction = false;
  let showExploration = false;
  let showAdvanced = false;
  let showVillage = false;
  let showPersonalization = false;
  let saving = false;
  const tools: Array<{ id: Tool; icon: string; label: string }> = [
    { id: 'hoe', icon: '⌁', label: 'Cangkul' }, { id: 'seed', icon: '·:', label: 'Benih' },
    { id: 'water', icon: '≈', label: 'Siram' }, { id: 'fertilizer', icon: '+', label: 'Pupuk' },
    { id: 'hand', icon: '✦', label: 'Panen' }, { id: 'feed', icon: '▰', label: 'Pakan' }
  ];
  const formatTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2,'0')}:${String(minutes % 60).padStart(2,'0')}`;
  async function save() { saving = true; await saveGame(1, 'Kebun Keluarga', gameCommands.snapshot()); saving = false; notice.set('Permainan tersimpan di perangkat ini.'); }
  async function load() { const state = await loadGame(1); if (state) { gameCommands.replace(state); notice.set('Save berhasil dimuat.'); } else notice.set('Belum ada save di slot ini.'); }
  function downloadBackup(){const blob=new Blob([exportSave(gameCommands.snapshot())],{type:'application/json'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download='nusantara-farm-save.json';anchor.click();URL.revokeObjectURL(url);}
  async function importFile(event:Event){const file=(event.currentTarget as HTMLInputElement).files?.[0];if(!file)return;try{gameCommands.replace(importSave(await file.text()));notice.set('Save berhasil diimpor dan divalidasi.');}catch{notice.set('File save tidak valid atau terlalu besar.');}}
  async function recover(){const state=await restoreLatestBackup(1);if(state){gameCommands.replace(state);notice.set('Backup terakhir berhasil dipulihkan.');}else notice.set('Belum ada backup pemulihan.');}
  onMount(() => { const unsubscribe=onExternalSave(()=>notice.set('Peringatan: tab lain baru saja menyimpan slot ini. Muat ulang sebelum menimpa.'));return unsubscribe; });
</script>

<svelte:head><title>Kebun · Nusantara Farm</title></svelte:head>

<main class:photo={$gameState.personalization.photoMode}>
  {#if $gameState.personalization.photoMode}<button class="exit-photo" on:click={()=>gameCommands.photoMode()}>Keluar Photo Mode</button>{/if}
  <header>
    <button class="brand" on:click={() => goto('/')}>NUSANTARA <b>FARM</b></button>
    <div class="day"><span>HARI {$gameState.day}</span><strong>{$gameState.season.toUpperCase()}</strong></div>
    <div class="weather">☀ {$gameState.weather} · {formatTime($gameState.timeMinutes)}</div>
    <div class="coins">◉ {$gameState.coins}</div>
    <AudioControl />
  </header>

  <section class="workspace">
    <aside class="panel status">
      <h2>PETANI</h2>
      <div class="meter"><div class="meter-label">STAMINA <span>{$gameState.player.stamina}/100</span></div><i style={`width:${$gameState.player.stamina}%`}></i></div>
      <div class="meter xp"><div class="meter-label">XP <span>{$gameState.player.xp}</span></div><i style={`width:${Math.min(100,$gameState.player.xp)}%`}></i></div>
      <h3>TAS</h3>
      <ul><li>Benih {$selectedCrop} <b>{$gameState.inventory[`${$selectedCrop}_seed`] ?? 0}</b></li><li>Hasil panen <b>{Object.entries($gameState.inventory).filter(([id]) => CROPS[id] || id.startsWith('quality_')).reduce((sum, [,qty]) => sum + qty, 0)}</b></li><li>Pakan <b>{$gameState.inventory.chicken_feed ?? 0}</b></li><li>Pupuk <b>{$gameState.inventory.fertilizer ?? 0}</b></li></ul>
      <h3>BENIH AKTIF</h3><select bind:value={$selectedCrop} aria-label="Benih aktif">{#each Object.values(CROPS) as crop}<option value={crop.id}>{crop.name} ({$gameState.inventory[`${crop.id}_seed`] ?? 0})</option>{/each}</select>
      <h3>UPGRADE</h3><p>Cangkul Lv.{$gameState.upgrades.hoe} · Penyiram Lv.{$gameState.upgrades.wateringCan}</p>
    </aside>

    <div class="game"><FarmGame /><div class="notice">{$notice}</div></div>

    <aside class="panel guide">
      <h2>PANDUAN HARI INI</h2>
      <ol>
        <li class:done={$gameState.tutorialStep >= 1}>Gemburkan tanah</li><li class:done={$gameState.tutorialStep >= 2}>Tanam benih padi</li>
        <li class:done={$gameState.tutorialStep >= 3}>Siram setiap hari</li><li class:done={$gameState.tutorialStep >= 4}>Panen padi</li>
      </ol>
      <p class="hint">Klik petak dengan alat aktif. Setiap tanaman mengikuti musim, durasi tumbuh, regrowth, dan kualitasnya.</p>
      <button on:click={() => showShop = !showShop}>Kios Pak Jaya</button>
      <button on:click={() => showBarn = !showBarn}>Kelola Peternakan ({$gameState.animals.length})</button>
      <button on:click={() => showFishing = true}>Pergi Memancing</button>
      <button on:click={() => showForaging = true}>Jelajahi Hutan</button>
      <button on:click={() => showProduction = true}>Bangun & Produksi</button>
      <button on:click={() => showExploration = true}>Peta & Eksplorasi</button>
      <button on:click={() => showAdvanced = true}>Kebun Lanjutan</button>
      <button on:click={() => showVillage = true}>Desa & Kalender</button>
      <button on:click={() => showPersonalization = true}>Koleksi & Rumah</button>
      <button on:click={() => gameCommands.sleep()}>Tidur → Hari Baru</button>
      <div class="save"><button on:click={save}>{saving ? 'Menyimpan…' : 'Simpan'}</button><button on:click={load}>Muat</button></div><div class="save"><button on:click={downloadBackup}>Ekspor</button><button on:click={recover}>Pulihkan</button></div><label class="import">Impor Save<input type="file" accept="application/json" on:change={importFile}></label>
    </aside>
  </section>

  <nav class="hotbar" aria-label="Alat">
    {#each tools as tool, index}<button class:active={$selectedTool === tool.id} on:click={() => selectedTool.set(tool.id)}><kbd>{index + 1}</kbd><span>{tool.icon}</span><small>{tool.label}</small></button>{/each}
  </nav>

  {#if showShop}<div class="modal" role="dialog" aria-modal="true"><div class="shop wide"><button class="close" on:click={() => showShop=false}>×</button><small>KIOS BENIH & PERALATAN</small><h2>Pak Jaya</h2><div class="wares grid">{#each Object.values(CROPS) as crop}<button on:click={() => gameCommands.buy(`${crop.id}_seed`, 1)}><b>Benih {crop.name}</b><span>{crop.seedPrice} koin</span></button>{/each}<button on:click={() => gameCommands.buy('chicken_feed', 3)}><b>3× Pakan</b><span>24 koin</span></button><button on:click={() => gameCommands.buy('fertilizer', 2)}><b>2× Pupuk</b><span>30 koin</span></button></div><h3>JUAL HASIL</h3><div class="wares grid">{#each Object.entries($gameState.inventory).filter(([id, qty]) => qty > 0 && (CROPS[id] || id.startsWith('quality_') || id.startsWith('fish_') || FORAGE[id] || Object.values(ANIMALS).some((animal) => animal.productId === id))) as [id, qty]}<button on:click={() => gameCommands.sell(id)}><b>{id.replaceAll('_',' ')} ×{qty}</b><span>Jual satu</span></button>{/each}</div><h3>PERLENGKAPAN MEMANCING</h3><div class="wares grid"><button on:click={() => gameCommands.buy('bait',5)}><b>5× Umpan</b><span>30 koin</span></button><button on:click={() => gameCommands.buyRod('basic')}><b>Joran Dasar</b><span>250 koin</span></button><button on:click={() => gameCommands.buyRod('reinforced')}><b>Joran Diperkuat</b><span>600 koin</span></button><button on:click={() => gameCommands.buyRod('advanced')}><b>Joran Mahir</b><span>1200 koin</span></button></div><h3>UPGRADE ALAT</h3><div class="wares grid"><button on:click={() => gameCommands.upgrade('hoe')}><b>Cangkul Lv.{$gameState.upgrades.hoe + 1}</b><span>{150 * $gameState.upgrades.hoe} koin</span></button><button on:click={() => gameCommands.upgrade('wateringCan')}><b>Penyiram Lv.{$gameState.upgrades.wateringCan + 1}</b><span>{150 * $gameState.upgrades.wateringCan} koin</span></button></div></div></div>{/if}

  {#if showBarn}<div class="modal" role="dialog" aria-modal="true"><div class="shop wide"><button class="close" on:click={() => showBarn=false}>×</button><small>PETERNAKAN</small><h2>Rawat Ternak</h2><div class="animal-list">{#each $gameState.animals as animal}<article><h3>{animal.name} · {ANIMALS[animal.kind].name}</h3><p>{animal.aiState} · lapar {animal.hunger}% · senang {animal.happiness}% · sehat {animal.health}% · bersih {animal.cleanliness}%</p><div><button on:click={() => gameCommands.animal(animal.id,'feed')}>Pakan</button><button on:click={() => gameCommands.animal(animal.id,'pet')}>Belai</button><button on:click={() => gameCommands.animal(animal.id,'clean')}>Bersihkan</button><button disabled={!animal.productReady} on:click={() => gameCommands.animal(animal.id,'collect')}>Ambil {ANIMALS[animal.kind].productName}</button></div></article>{/each}</div><h3>BELI TERNAK</h3><div class="wares grid">{#each Object.values(ANIMALS) as animal}<button on:click={() => gameCommands.buyAnimal(animal.id)}><b>{animal.name}</b><span>{animal.buyPrice} koin</span></button>{/each}</div><div class="wares grid"><button on:click={() => gameCommands.upgrade('coop')}>Upgrade kandang ayam ({150 * $gameState.upgrades.coop})</button><button on:click={() => gameCommands.upgrade('barn')}>Upgrade lumbung ({150 * $gameState.upgrades.barn})</button></div></div></div>{/if}
  {#if showFishing}<FishingPanel close={()=>showFishing=false}/>{/if}
  {#if showForaging}<ForagingPanel close={()=>showForaging=false}/>{/if}
  {#if showProduction}<ProductionPanel close={()=>showProduction=false}/>{/if}
  {#if showExploration}<ExplorationPanel close={()=>showExploration=false}/>{/if}
  {#if showAdvanced}<AdvancedFarmPanel close={()=>showAdvanced=false}/>{/if}
  {#if showVillage}<VillagePanel close={()=>showVillage=false}/>{/if}
  {#if showPersonalization}<PersonalizationPanel close={()=>showPersonalization=false}/>{/if}
</main>

<style>
  :global(*){box-sizing:border-box}:global(body){margin:0;background:#102d27;color:#f4eccf;font-family:ui-monospace,'Courier New',monospace}button{font:inherit;cursor:pointer}
  main{min-height:100dvh;background:radial-gradient(circle at 50% 20%,#2d5748,#0e2823 75%);padding-bottom:104px}header{height:72px;display:flex;align-items:center;gap:2rem;padding:0 3vw;border-bottom:1px solid #d8bd6555;background:#102d27dd}.brand{border:0;background:none;color:#fff;letter-spacing:.08em;font-weight:900}.brand b{color:#e6c35e}.day{margin-left:auto;text-align:center}.day span,.day strong{display:block}.day span{font-size:.65rem;color:#a7baaa}.weather{color:#cad5bf}.coins{background:#284c3e;border:1px solid #d8bd65;padding:.55rem .8rem;border-radius:4px;color:#f0d06b;font-weight:bold}
  .workspace{display:grid;grid-template-columns:210px minmax(350px,760px) 230px;gap:18px;max-width:1280px;margin:24px auto;padding:0 18px;align-items:start}.panel{background:#193c32;border:2px solid #937b45;border-radius:6px;padding:16px;box-shadow:6px 6px 0 #071c17}.panel h2{font-size:.8rem;letter-spacing:.14em;color:#e5c661;margin:0 0 18px}.panel h3{font-size:.7rem;color:#a5bba9;border-bottom:1px solid #ffffff18;padding-bottom:6px;margin-top:20px}.panel ul{padding:0;list-style:none;font: .72rem/2 system-ui}.panel li{display:flex;justify-content:space-between}.panel select{width:100%;padding:7px;background:#102820;color:#f4eccf;border:1px solid #937b45}.meter-label{display:flex;justify-content:space-between;font-size:.65rem;margin-bottom:5px}.meter{display:block;background:#102820;height:30px;margin-bottom:10px;padding:7px}.meter i{display:block;height:6px;background:#e5b454}.meter.xp i{background:#6fb68d}.panel p{font: .72rem/1.5 system-ui;color:#bdccbd}.game{min-width:0}.notice{margin:10px auto 0;max-width:90%;padding:10px 16px;text-align:center;background:#f2e5be;color:#263a2b;border:3px double #8a6a3d;border-radius:3px;font:700 .78rem system-ui}.guide ol{padding-left:22px;font:.75rem/2 system-ui}.guide li.done{text-decoration:line-through;color:#83b789}.guide li.done::marker{content:'✓  '}.hint{border-left:3px solid #d7ba5a;padding-left:9px}.guide>button,.save button{width:100%;margin-top:8px;padding:9px;color:#eee4c7;background:#2c5c49;border:1px solid #a58a51}.save{display:flex;gap:6px}.import{display:block;margin-top:8px;padding:8px;text-align:center;background:#2c5c49;border:1px solid #a58a51;font-size:.7rem}.import input{display:none}.hotbar{position:fixed;z-index:8;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:5px;padding:7px;background:#132f28;border:2px solid #a58a4d;border-radius:7px;box-shadow:0 8px 25px #0008}.hotbar button{position:relative;width:68px;height:62px;background:#244d3e;border:1px solid #52715e;color:#f1e7ca}.hotbar button.active{border:3px solid #edcb64;background:#37654d;transform:translateY(-5px)}.hotbar kbd{position:absolute;top:2px;left:4px;font-size:.55rem}.hotbar span{display:block;font:700 1.5rem Georgia}.hotbar small{font-size:.58rem}
  .modal{position:fixed;z-index:10;inset:0;background:#071a16cc;display:grid;place-items:center;padding:20px}.shop{position:relative;width:min(520px,100%);max-height:90vh;overflow:auto;padding:30px;background:#f1e4bd;color:#263a2e;border:8px double #6d4b31;box-shadow:12px 12px 0 #071a16}.shop.wide{width:min(760px,100%)}.shop h2{font:900 2.2rem Georgia;margin:.2rem 0}.shop .close{position:absolute;right:10px;top:8px;border:0;background:none;font-size:1.7rem}.wares{display:grid;gap:8px}.wares.grid{grid-template-columns:repeat(2,1fr)}.wares button{display:flex;justify-content:space-between;padding:12px;background:#fff8df;border:2px solid #9c7f4e;color:#304233}.wares span{color:#8a5d20}.animal-list{display:grid;gap:10px}.animal-list article{background:#fff8df;border:2px solid #9c7f4e;padding:12px}.animal-list h3,.animal-list p{margin:0 0 8px}.animal-list article div{display:flex;gap:5px;flex-wrap:wrap}.animal-list button{padding:6px;background:#345d49;color:white;border:0}.animal-list button:disabled{opacity:.4}
  .exit-photo{position:fixed;z-index:30;right:14px;top:14px;padding:9px;background:#102d27;color:white;border:1px solid #e5c661}main.photo header,main.photo .panel,main.photo .notice,main.photo .hotbar{display:none}main.photo .workspace{grid-template-columns:minmax(350px,900px);justify-content:center;margin-top:0;padding-top:20px}
  @media(max-width:980px){.workspace{grid-template-columns:1fr}.status{order:2}.guide{order:3}.panel{box-shadow:none}.status ul{display:grid;grid-template-columns:1fr 1fr}.weather{display:none}}
  @media(max-width:560px){header{gap:.5rem;padding:0 10px}.brand{font-size:.68rem}.workspace{padding:0 8px;margin-top:10px}.hotbar{bottom:5px;width:calc(100% - 10px);justify-content:center}.hotbar button{flex:1;max-width:70px}.game{touch-action:none}.coins{font-size:.7rem}}
</style>
