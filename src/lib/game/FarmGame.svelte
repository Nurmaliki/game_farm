<script lang="ts">
  import { onMount } from 'svelte';
  import type PhaserType from 'phaser';
  import { gameCommands, gameState, selectedTool } from '$lib/application/game-store';
  import type { GameState, Tool } from '$lib/domain/state';

  let host: HTMLDivElement;
  let phaserGame: PhaserType.Game | null = null;
  let scene: PhaserType.Scene | null = null;
  let renderState: GameState;
  let activeTool: Tool = 'hoe';
  let unsubscribeState = gameState.subscribe((state) => { renderState = state; });
  let unsubscribeTool = selectedTool.subscribe((tool) => { activeTool = tool; });

  onMount(() => {
    let disposed = false;
    void import('./farm-scene').then(({ createFarmGame, drawWorld }) => {
      if (disposed) return;
      phaserGame = createFarmGame(host, {
        getState: () => renderState,
        getTool: () => activeTool,
        onScene: (nextScene) => { scene = nextScene; },
        move: (x, y) => gameCommands.move(x, y),
        toolAt: (index, tool) => gameCommands.toolAt(index, tool)
      });
      unsubscribeState();
      unsubscribeState = gameState.subscribe((state) => {
        renderState = state;
        if (scene) drawWorld(scene, state);
      });
    });
    return () => { disposed = true; phaserGame?.destroy(true); unsubscribeState(); unsubscribeTool(); };
  });
</script>

<div class="game-shell" bind:this={host} aria-label="Area permainan kebun"></div>

<style>
  .game-shell { width: 100%; aspect-ratio: 640 / 430; background: #77a85b; border: 4px solid #d6b96a; border-radius: 8px; overflow: hidden; image-rendering: pixelated; box-shadow: 0 12px 40px #071d1855; }
  :global(.game-shell canvas) { width: 100% !important; height: 100% !important; display: block; }
</style>
