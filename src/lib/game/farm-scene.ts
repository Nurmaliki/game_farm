import Phaser from 'phaser/src/phaser-core.js';
import type { GameState, Tool } from '$lib/domain/state';
import { ANIMALS } from '$lib/content/animals';

const tileSize = 42;
const farmX = 150;
const farmY = 105;

interface FarmSceneCallbacks {
  getState: () => GameState;
  getTool: () => Tool;
  onScene: (scene: Phaser.Scene) => void;
  move: (x: number, y: number) => void;
  toolAt: (index: number, tool: Tool) => void;
}

export function drawWorld(target: Phaser.Scene, state: GameState) {
  const graphics = (target as Phaser.Scene & { worldGraphics?: Phaser.GameObjects.Graphics })
    .worldGraphics;
  if (!graphics) return;
  graphics.clear();
  graphics.fillStyle(0x77a85b).fillRect(0, 0, 640, 430);
  graphics.fillStyle(0x5e954c).fillRect(0, 330, 640, 100);
  graphics.fillStyle(0x367b70).fillRect(0, 0, 70, 430);
  graphics.fillStyle(0xe8d6a8).fillRect(72, 0, 26, 430);
  graphics.fillStyle(0x152e27, 0.12).fillRect(0, 0, 640, 430);
  state.plots.forEach((tile, index) => {
    const x = farmX + tile.x * tileSize;
    const y = farmY + tile.y * tileSize;
    graphics
      .fillStyle(tile.watered ? 0x594836 : tile.tilled ? 0x795839 : 0x91b867)
      .fillRoundedRect(x + 2, y + 2, 38, 38, 4);
    graphics.lineStyle(1, 0x315c3a, 0.4).strokeRoundedRect(x + 2, y + 2, 38, 38, 4);
    if (tile.cropId) {
      const stage = Math.min(3, state.plots[index].wateredDays);
      graphics
        .fillStyle(stage >= 3 ? 0xe7c94a : 0x3b7d3c)
        .fillCircle(x + 21, y + 22, 5 + stage * 2);
      graphics.lineStyle(2, 0x2f6035).lineBetween(x + 21, y + 30, x + 21, y + 14);
    }
  });
  state.animals.forEach((animal, index) => {
    const x = 500 + (index % 3) * 42;
    const y = 270 + Math.floor(index / 3) * 42;
    const size = animal.kind === 'chicken' ? 12 : 17;
    graphics.fillStyle(ANIMALS[animal.kind].color).fillCircle(x, y, size);
    graphics
      .lineStyle(2, animal.productReady ? 0xe7c94a : 0x49382c)
      .strokeCircle(x, y, size);
    if (animal.aiState === 'EAT') graphics.fillStyle(0x47743d).fillCircle(x + size, y + size, 4);
  });
  if (state.weather === 'hujan' || state.weather === 'badai') {
    graphics.lineStyle(2, 0xaddbe3, state.weather === 'badai' ? 0.75 : 0.45);
    for (let index = 0; index < 35; index += 1) {
      const x = (index * 83 + state.day * 17) % 650;
      const y = (index * 47) % 430;
      graphics.lineBetween(x, y, x - 7, y + 16);
    }
    graphics.fillStyle(0x244b5b, 0.2).fillRect(0, 0, 640, 430);
  }
  if (state.timeMinutes > 1080) graphics.fillStyle(0x162546, 0.38).fillRect(0, 0, 640, 430);
}

class FarmScene extends Phaser.Scene {
  player!: Phaser.GameObjects.Image;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  keys!: Record<string, Phaser.Input.Keyboard.Key>;
  worldGraphics!: Phaser.GameObjects.Graphics;

  constructor(private callbacks: FarmSceneCallbacks) {
    super('farm');
  }

  preload() {
    this.load.image('nusantara-atlas', '/assets/pixel-art/nusantara-atlas-v1.png');
  }

  create() {
    const state = this.callbacks.getState();
    this.callbacks.onScene(this);
    this.worldGraphics = this.add.graphics();
    drawWorld(this, state);
    this.add
      .image(555, 65, 'nusantara-atlas')
      .setCrop(22, 875, 220, 180)
      .setDisplaySize(112, 92)
      .setDepth(2);
    this.player = this.add
      .image(state.player.x, state.player.y, 'nusantara-atlas')
      .setCrop(14, 8, 86, 142)
      .setDisplaySize(34, 54)
      .setDepth(4);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as Record<
      string,
      Phaser.Input.Keyboard.Key
    >;
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const tx = Math.floor((pointer.x - farmX) / tileSize);
      const ty = Math.floor((pointer.y - farmY) / tileSize);
      if (tx >= 0 && tx < 8 && ty >= 0 && ty < 6) {
        this.callbacks.toolAt(ty * 8 + tx, this.callbacks.getTool());
      }
    });
    this.cameras.main.setRoundPixels(true);
  }

  update(_: number, delta: number) {
    const speed = 0.16 * delta;
    let dx = 0;
    let dy = 0;
    if (this.cursors.left.isDown || this.keys.A.isDown) dx -= speed;
    if (this.cursors.right.isDown || this.keys.D.isDown) dx += speed;
    if (this.cursors.up.isDown || this.keys.W.isDown) dy -= speed;
    if (this.cursors.down.isDown || this.keys.S.isDown) dy += speed;
    if (dx || dy) {
      this.player.x = Phaser.Math.Clamp(this.player.x + dx, 108, 625);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy, 20, 415);
      this.callbacks.move(this.player.x, this.player.y);
    }
  }
}

export function createFarmGame(parent: HTMLDivElement, callbacks: FarmSceneCallbacks) {
  return new Phaser.Game({
    type: Phaser.CANVAS,
    parent,
    width: 640,
    height: 430,
    pixelArt: true,
    backgroundColor: '#77a85b',
    scene: new FarmScene(callbacks),
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
  });
}
