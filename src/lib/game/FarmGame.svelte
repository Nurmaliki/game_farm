<script lang="ts">
  import { onMount } from 'svelte';
  import type PhaserType from 'phaser';
  import { gameCommands, gameState, selectedTool } from '$lib/application/game-store';
  import type { GameState, Tool } from '$lib/domain/state';
  import type { PlotHover } from './farm-scene';

  let host: HTMLDivElement;
  let phaserGame: PhaserType.Game | null = null;
  let scene: PhaserType.Scene | null = null;
  let renderState: GameState;
  let activeTool: Tool = 'hoe';
  let hover: PlotHover | null = null;
  const shortcutTools: Tool[] = ['hoe', 'seed', 'water', 'fertilizer', 'hand', 'feed'];
  let unsubscribeState = gameState.subscribe((state) => { renderState = state; });
  let unsubscribeTool = selectedTool.subscribe((tool) => { activeTool = tool; });

  onMount(() => {
    let disposed = false;
    const tooltipsEnabled = localStorage.getItem('nusantara-tooltips') !== 'false';
    const onKeyDown = (event: KeyboardEvent) => {
      const tool = shortcutTools[Number(event.key) - 1];
      if (tool) selectedTool.set(tool);
    };
    window.addEventListener('keydown', onKeyDown);
    void import('./farm-scene').then(({ createFarmGame, drawWorld }) => {
      if (disposed) return;
      phaserGame = createFarmGame(host, {
        getState: () => renderState,
        getTool: () => activeTool,
        onScene: (nextScene) => { scene = nextScene; },
        onHover: (nextHover) => { hover = tooltipsEnabled ? nextHover : null; },
        move: (x, y) => gameCommands.move(x, y),
        toolAt: (index, tool) => gameCommands.toolAt(index, tool)
      });
      unsubscribeState();
      unsubscribeState = gameState.subscribe((state) => {
        renderState = state;
        if (scene) drawWorld(scene, state);
      });
    });
    return () => { disposed = true; window.removeEventListener('keydown', onKeyDown); phaserGame?.destroy(true); unsubscribeState(); unsubscribeTool(); };
  });
</script>

<div class="game-wrap">
  <div class="game-shell" bind:this={host} aria-label="Area permainan kebun"></div>
  {#if hover}
    <div class:invalid={!hover.valid} class="plot-tooltip" style={`left:${Math.min(82, Math.max(8, hover.x / 9.6))}%;top:${Math.min(78, Math.max(12, hover.y / 5.4))}%`}>
      <strong>{hover.title}</strong><span>{hover.detail}</span>
    </div>
  {/if}
</div>

<style>
  .game-wrap{position:relative}.game-shell { width: 100%; aspect-ratio: 16 / 9; background: #173d2d; border: 3px solid #e5bd62; border-radius: 18px; overflow: hidden; box-shadow: 0 22px 70px #020d0966,0 0 0 6px #173b2c,0 0 0 7px #f0cf7655; }
  :global(.game-shell canvas) { width: 100% !important; height: 100% !important; display: block; }
  .plot-tooltip{position:absolute;z-index:12;pointer-events:none;transform:translate(12px,-110%);min-width:150px;padding:9px 11px;border:1px solid #d9c477;border-radius:9px;background:#09251ee8;color:#fff5da;box-shadow:0 9px 28px #00140da8;backdrop-filter:blur(8px)}.plot-tooltip::after{content:'';position:absolute;left:14px;bottom:-5px;width:8px;height:8px;background:#09251e;border-right:1px solid #d9c477;border-bottom:1px solid #d9c477;transform:rotate(45deg)}.plot-tooltip strong,.plot-tooltip span{display:block}.plot-tooltip strong{font:800 .72rem Georgia,serif;color:#dff3ad}.plot-tooltip span{margin-top:3px;font:500 .58rem/1.35 system-ui;color:#c7d7cb}.plot-tooltip.invalid{border-color:#dc806f}.plot-tooltip.invalid strong{color:#ffb09f}
</style>
