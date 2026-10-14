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
  let villageTab: 'npc' | 'quest' | 'museum' | 'calendar' = 'npc';
  let showPersonalization = false;
  let statusOpen = true;
  let guideOpen = true;
  let saving = false;
  const tools: Array<{ id: Tool; icon: string; label: string }> = [
    { id: 'hoe', icon: '⛏', label: 'Cangkul' }, { id: 'seed', icon: '🌱', label: 'Benih' },
    { id: 'water', icon: '💧', label: 'Siram' }, { id: 'fertilizer', icon: '✦', label: 'Pupuk' },
    { id: 'hand', icon: '🌾', label: 'Panen' }, { id: 'feed', icon: '🌽', label: 'Pakan' }
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
    <aside class:collapsed={!statusOpen} class="panel status">
      <button class="panel-toggle" aria-label="Tampilkan status petani" on:click={() => statusOpen = !statusOpen}><span>🧺</span><b>PETANI</b><i>{statusOpen ? '‹' : '›'}</i></button>
      <div class="panel-body">
      <div class="meter"><div class="meter-label">STAMINA <span>{$gameState.player.stamina}/100</span></div><i style={`width:${$gameState.player.stamina}%`}></i></div>
      <div class="meter xp"><div class="meter-label">XP <span>{$gameState.player.xp}</span></div><i style={`width:${Math.min(100,$gameState.player.xp)}%`}></i></div>
      <h3>TAS</h3>
      <ul><li>Benih {$selectedCrop} <b>{$gameState.inventory[`${$selectedCrop}_seed`] ?? 0}</b></li><li>Hasil panen <b>{Object.entries($gameState.inventory).filter(([id]) => CROPS[id] || id.startsWith('quality_')).reduce((sum, [,qty]) => sum + qty, 0)}</b></li><li>Pakan <b>{$gameState.inventory.chicken_feed ?? 0}</b></li><li>Pupuk <b>{$gameState.inventory.fertilizer ?? 0}</b></li></ul>
      <h3>BENIH AKTIF</h3><select bind:value={$selectedCrop} aria-label="Benih aktif">{#each Object.values(CROPS) as crop}<option value={crop.id}>{crop.name} ({$gameState.inventory[`${crop.id}_seed`] ?? 0})</option>{/each}</select>
      <h3>UPGRADE</h3><p>Cangkul Lv.{$gameState.upgrades.hoe} · Penyiram Lv.{$gameState.upgrades.wateringCan}</p>
      </div>
    </aside>

    <div class="game">
      <div class="scene-title"><small>LEMBAH ARJUNA</small><strong>Kebun Keluarga</strong></div>
      <div class="scene-help"><span>WASD</span> bergerak <i>•</i> klik petak untuk beraksi</div>
      <FarmGame />
      <div class="notice"><span class="notice-icon">✦</span>{$notice}</div>
    </div>

    <aside class:collapsed={!guideOpen} class="panel guide">
      <button class="panel-toggle" aria-label="Tampilkan misi" on:click={() => guideOpen = !guideOpen}><span>📜</span><b>MISI HARI INI</b><i>{guideOpen ? '›' : '‹'}</i></button>
      <div class="panel-body">
      <ol>
        <li class:done={$gameState.tutorialStep >= 1}>Gemburkan tanah</li><li class:done={$gameState.tutorialStep >= 2}>Tanam benih padi</li>
        <li class:done={$gameState.tutorialStep >= 3}>Siram setiap hari</li><li class:done={$gameState.tutorialStep >= 4}>Panen padi</li>
      </ol>
      <p class="hint">Klik petak dengan alat aktif. Setiap tanaman mengikuti musim, durasi tumbuh, regrowth, dan kualitasnya.</p>
      <button class="order-button" on:click={() => { villageTab = 'quest'; showVillage = true; }}>📋 Papan Pesanan</button>
      <button on:click={() => showShop = !showShop}>Kios Pak Jaya</button>
      <button on:click={() => showBarn = !showBarn}>Kelola Peternakan ({$gameState.animals.length})</button>
      <button on:click={() => showFishing = true}>Pergi Memancing</button>
      <button on:click={() => showForaging = true}>Jelajahi Hutan</button>
      <button on:click={() => showProduction = true}>Bangun & Produksi</button>
      <button on:click={() => showExploration = true}>Peta & Eksplorasi</button>
      <button on:click={() => showAdvanced = true}>Kebun Lanjutan</button>
      <button on:click={() => { villageTab = 'npc'; showVillage = true; }}>Desa & Kalender</button>
      <button on:click={() => showPersonalization = true}>Koleksi & Rumah</button>
      <button on:click={() => gameCommands.sleep()}>Tidur → Hari Baru</button>
      <div class="save"><button on:click={save}>{saving ? 'Menyimpan…' : 'Simpan'}</button><button on:click={load}>Muat</button></div><div class="save"><button on:click={downloadBackup}>Ekspor</button><button on:click={recover}>Pulihkan</button></div><label class="import">Impor Save<input type="file" accept="application/json" on:change={importFile}></label>
      </div>
    </aside>
  </section>

  <nav class="hotbar" aria-label="Alat">
    {#each tools as tool, index}<button aria-label={tool.label} title={tool.label} class:active={$selectedTool === tool.id} on:click={() => selectedTool.set(tool.id)}><kbd>{index + 1}</kbd><span class="tool-art" style={`background-position:${index * 20}% center`}>{tool.icon}</span><small>{tool.label}</small></button>{/each}
  </nav>

  {#if showShop}<div class="modal" role="dialog" aria-modal="true"><div class="shop wide"><button class="close" on:click={() => showShop=false}>×</button><small>KIOS BENIH & PERALATAN</small><h2>Pak Jaya</h2><div class="wares grid">{#each Object.values(CROPS) as crop}<button on:click={() => gameCommands.buy(`${crop.id}_seed`, 1)}><b>Benih {crop.name}</b><span>{crop.seedPrice} koin</span></button>{/each}<button on:click={() => gameCommands.buy('chicken_feed', 3)}><b>3× Pakan</b><span>24 koin</span></button><button on:click={() => gameCommands.buy('fertilizer', 2)}><b>2× Pupuk</b><span>30 koin</span></button></div><h3>JUAL HASIL</h3><div class="wares grid">{#each Object.entries($gameState.inventory).filter(([id, qty]) => qty > 0 && (CROPS[id] || id.startsWith('quality_') || id.startsWith('fish_') || FORAGE[id] || Object.values(ANIMALS).some((animal) => animal.productId === id))) as [id, qty]}<button on:click={() => gameCommands.sell(id)}><b>{id.replaceAll('_',' ')} ×{qty}</b><span>Jual satu</span></button>{/each}</div><h3>PERLENGKAPAN MEMANCING</h3><div class="wares grid"><button on:click={() => gameCommands.buy('bait',5)}><b>5× Umpan</b><span>30 koin</span></button><button on:click={() => gameCommands.buyRod('basic')}><b>Joran Dasar</b><span>250 koin</span></button><button on:click={() => gameCommands.buyRod('reinforced')}><b>Joran Diperkuat</b><span>600 koin</span></button><button on:click={() => gameCommands.buyRod('advanced')}><b>Joran Mahir</b><span>1200 koin</span></button></div><h3>UPGRADE ALAT</h3><div class="wares grid"><button on:click={() => gameCommands.upgrade('hoe')}><b>Cangkul Lv.{$gameState.upgrades.hoe + 1}</b><span>{150 * $gameState.upgrades.hoe} koin</span></button><button on:click={() => gameCommands.upgrade('wateringCan')}><b>Penyiram Lv.{$gameState.upgrades.wateringCan + 1}</b><span>{150 * $gameState.upgrades.wateringCan} koin</span></button></div></div></div>{/if}

  {#if showBarn}<div class="modal" role="dialog" aria-modal="true"><div class="shop wide"><button class="close" on:click={() => showBarn=false}>×</button><small>PETERNAKAN</small><h2>Rawat Ternak</h2><div class="animal-list">{#each $gameState.animals as animal}<article><h3>{animal.name} · {ANIMALS[animal.kind].name}</h3><p>{animal.aiState} · lapar {animal.hunger}% · senang {animal.happiness}% · sehat {animal.health}% · bersih {animal.cleanliness}%</p><div><button on:click={() => gameCommands.animal(animal.id,'feed')}>Pakan</button><button on:click={() => gameCommands.animal(animal.id,'pet')}>Belai</button><button on:click={() => gameCommands.animal(animal.id,'clean')}>Bersihkan</button><button disabled={!animal.productReady} on:click={() => gameCommands.animal(animal.id,'collect')}>Ambil {ANIMALS[animal.kind].productName}</button></div></article>{/each}</div><h3>BELI TERNAK</h3><div class="wares grid">{#each Object.values(ANIMALS) as animal}<button on:click={() => gameCommands.buyAnimal(animal.id)}><b>{animal.name}</b><span>{animal.buyPrice} koin</span></button>{/each}</div><div class="wares grid"><button on:click={() => gameCommands.upgrade('coop')}>Upgrade kandang ayam ({150 * $gameState.upgrades.coop})</button><button on:click={() => gameCommands.upgrade('barn')}>Upgrade lumbung ({150 * $gameState.upgrades.barn})</button></div></div></div>{/if}
  {#if showFishing}<FishingPanel close={()=>showFishing=false}/>{/if}
  {#if showForaging}<ForagingPanel close={()=>showForaging=false}/>{/if}
  {#if showProduction}<ProductionPanel close={()=>showProduction=false}/>{/if}
  {#if showExploration}<ExplorationPanel close={()=>showExploration=false}/>{/if}
  {#if showAdvanced}<AdvancedFarmPanel close={()=>showAdvanced=false}/>{/if}
  {#if showVillage}<VillagePanel initialTab={villageTab} close={()=>showVillage=false}/>{/if}
  {#if showPersonalization}<PersonalizationPanel close={()=>showPersonalization=false}/>{/if}
</main>

<style>
  :global(*){box-sizing:border-box}:global(body){margin:0;background:#071e19;color:#f8efd6;font-family:Inter,system-ui,sans-serif}button{font:inherit;cursor:pointer}
  main{min-height:100dvh;background:radial-gradient(circle at 50% 0,#315f49 0,#102f27 42%,#071e19 100%);padding-bottom:116px;overflow:hidden}main::before{content:'';position:fixed;inset:72px 0 0;pointer-events:none;background:linear-gradient(115deg,#ffd87b0b,transparent 35%),radial-gradient(circle at 20% 10%,#ffe49c12,transparent 25%)}header{height:72px;display:flex;align-items:center;gap:2rem;padding:0 2.5vw;border-bottom:1px solid #e0bd5d55;background:#09251fdd;backdrop-filter:blur(16px);box-shadow:0 10px 35px #00150f77;position:relative;z-index:4}.brand{border:0;background:none;color:#fff;letter-spacing:.12em;font:900 1rem Georgia,serif}.brand b{color:#f2c952}.day{margin-left:auto;text-align:center}.day span,.day strong{display:block}.day span{font-size:.62rem;color:#adc5b4;letter-spacing:.14em}.day strong{font-family:Georgia,serif;color:#fff0c8}.weather{color:#dce8d9}.coins{background:linear-gradient(135deg,#315b45,#1d4336);border:1px solid #e2bd55;padding:.6rem .9rem;border-radius:10px;color:#ffd967;font-weight:800;box-shadow:inset 0 1px #fff2}
  .workspace{display:grid;grid-template-columns:220px minmax(600px,960px) 246px;gap:20px;max-width:1490px;margin:26px auto;padding:0 20px;align-items:start;position:relative;z-index:2}.panel{background:linear-gradient(155deg,#1c493bfa,#102e27fa);border:1px solid #c49b4d99;border-radius:16px;padding:12px;box-shadow:0 18px 50px #00140fa3,inset 0 1px #ffffff12;backdrop-filter:blur(10px);transition:.25s}.panel-body{padding:5px}.panel.collapsed .panel-body{display:none}.panel-toggle{width:100%;display:flex;align-items:center;gap:8px;border:0;background:none;color:#f0cb68;padding:3px;font:800 .72rem Georgia,serif;letter-spacing:.12em}.panel-toggle span{font-size:1rem}.panel-toggle i{margin-left:auto;font:normal 1rem system-ui}.panel.collapsed{padding:10px}.panel.collapsed .panel-toggle b{display:none}.panel h3{font-size:.64rem;letter-spacing:.1em;color:#b6ccb9;border-bottom:1px solid #ffffff18;padding-bottom:7px;margin-top:18px}.panel ul{padding:0;list-style:none;font:.72rem/2 system-ui}.panel li{display:flex;justify-content:space-between}.panel select{width:100%;padding:9px;background:#09261f;color:#fff5da;border:1px solid #a98747;border-radius:7px}.meter-label{display:flex;justify-content:space-between;font-size:.62rem;margin-bottom:6px}.meter{display:block;background:#081f1a;height:31px;margin-bottom:10px;padding:8px;border-radius:7px;box-shadow:inset 0 2px 5px #0008}.meter i{display:block;height:6px;background:linear-gradient(90deg,#eaa842,#ffdb6e);border-radius:6px;box-shadow:0 0 9px #ffc95c88}.meter.xp i{background:linear-gradient(90deg,#4eaa7a,#88ddb0)}.panel p{font:.72rem/1.5 system-ui;color:#c7d7c9}.game{min-width:0;position:relative}.scene-title{position:absolute;z-index:5;left:22px;top:20px;display:flex;flex-direction:column;color:#fff;text-shadow:0 2px 8px #001b13}.scene-title small{font-size:.52rem;letter-spacing:.2em;color:#ffe18b}.scene-title strong{font:800 1.12rem Georgia,serif}.scene-help{position:absolute;z-index:5;right:20px;top:20px;padding:7px 10px;border:1px solid #fff3;border-radius:20px;background:#06241bb5;color:#dcebdc;font-size:.63rem;backdrop-filter:blur(8px)}.scene-help span{color:#ffe389;font-weight:900}.scene-help i{opacity:.4;margin:0 4px}.notice{margin:13px auto 0;max-width:88%;padding:11px 18px;text-align:center;background:linear-gradient(90deg,#f3e2b7,#fff3cf,#f3e2b7);color:#263a2b;border:1px solid #a67d3c;border-radius:10px;box-shadow:0 8px 24px #00181066;font:700 .76rem system-ui}.notice-icon{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:8px;border-radius:50%;background:#ca983e;color:#fff}.guide ol{padding-left:22px;font:.74rem/1.9 system-ui}.guide li.done{text-decoration:line-through;color:#83b789}.guide li.done::marker{content:'✓  '}.hint{border-left:3px solid #edc85d;padding-left:9px}.guide .panel-body>button,.save button{width:100%;margin-top:7px;padding:9px;color:#fff2d1;background:linear-gradient(135deg,#326b53,#25503f);border:1px solid #ae8e4e;border-radius:8px;transition:.18s transform,.18s filter}.guide .panel-body>button:hover,.save button:hover{transform:translateY(-2px);filter:brightness(1.16)}.save{display:flex;gap:6px}.import{display:block;margin-top:8px;padding:8px;text-align:center;background:#2c5c49;border:1px solid #a58a51;border-radius:8px;font-size:.7rem}.import input{display:none}.hotbar{position:fixed;z-index:8;bottom:18px;left:50%;transform:translateX(-50%);display:flex;gap:7px;padding:9px;background:#0b2922e8;border:1px solid #d6af55;border-radius:16px;box-shadow:0 14px 38px #000a,inset 0 1px #fff2;backdrop-filter:blur(14px)}.hotbar button{position:relative;width:72px;height:70px;background:linear-gradient(145deg,#2c5b48,#1c4034);border:1px solid #668773;color:#f1e7ca;border-radius:10px;transition:.18s}.hotbar button:hover{transform:translateY(-4px);filter:brightness(1.12)}.hotbar button.active{border:2px solid #f4ce62;background:linear-gradient(145deg,#45795c,#2e5d48);transform:translateY(-7px);box-shadow:0 7px 16px #0007,0 0 14px #e6c35344}.hotbar kbd{position:absolute;z-index:2;top:4px;left:6px;font-size:.52rem;color:#d9e7dc}.hotbar .tool-art{display:block;width:48px;height:43px;margin:0 auto;background-image:url('/assets/gameplay/tool-icons.webp');background-size:600% 100%;background-repeat:no-repeat;color:transparent;font-size:0;filter:drop-shadow(0 3px 3px #00150fa0)}.hotbar small{font-size:.56rem}
  .modal{position:fixed;z-index:10;inset:0;background:#071a16cc;display:grid;place-items:center;padding:20px}.shop{position:relative;width:min(520px,100%);max-height:90vh;overflow:auto;padding:30px;background:#f1e4bd;color:#263a2e;border:8px double #6d4b31;box-shadow:12px 12px 0 #071a16}.shop.wide{width:min(760px,100%)}.shop h2{font:900 2.2rem Georgia;margin:.2rem 0}.shop .close{position:absolute;right:10px;top:8px;border:0;background:none;font-size:1.7rem}.wares{display:grid;gap:8px}.wares.grid{grid-template-columns:repeat(2,1fr)}.wares button{display:flex;justify-content:space-between;padding:12px;background:#fff8df;border:2px solid #9c7f4e;color:#304233}.wares span{color:#8a5d20}.animal-list{display:grid;gap:10px}.animal-list article{background:#fff8df;border:2px solid #9c7f4e;padding:12px}.animal-list h3,.animal-list p{margin:0 0 8px}.animal-list article div{display:flex;gap:5px;flex-wrap:wrap}.animal-list button{padding:6px;background:#345d49;color:white;border:0}.animal-list button:disabled{opacity:.4}
  .exit-photo{position:fixed;z-index:30;right:14px;top:14px;padding:9px;background:#102d27;color:white;border:1px solid #e5c661}main.photo header,main.photo .panel,main.photo .notice,main.photo .hotbar{display:none}main.photo .workspace{grid-template-columns:minmax(350px,900px);justify-content:center;margin-top:0;padding-top:20px}
  @media(max-width:1250px){.workspace{grid-template-columns:190px minmax(540px,1fr)}.guide{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.guide .panel-toggle,.guide ol,.guide .hint{grid-column:span 1}.guide .panel-body>button{margin:0}.guide .save,.guide .import{display:none}}
  @media(max-width:850px){.workspace{grid-template-columns:1fr}.status{order:2}.guide{order:3;grid-template-columns:repeat(2,1fr)}.panel{box-shadow:none}.status ul{display:grid;grid-template-columns:1fr 1fr}.weather,.scene-help{display:none}}
  @media(max-width:560px){header{gap:.5rem;padding:0 10px}.brand{font-size:.68rem}.workspace{padding:0 8px;margin-top:10px}.scene-title{top:12px;left:14px}.scene-title strong{font-size:.85rem}.hotbar{bottom:5px;width:calc(100% - 10px);justify-content:center;gap:3px;padding:5px}.hotbar button{flex:1;max-width:70px;height:58px}.game{touch-action:none}.coins{font-size:.7rem}.guide{grid-template-columns:1fr 1fr}}
</style>
