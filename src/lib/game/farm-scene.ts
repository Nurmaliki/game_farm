import Phaser from 'phaser/src/phaser-core.js';
import type { GameState, FarmTile, Tool } from '$lib/domain/state';
import { CROPS } from '$lib/content/crops';
import { ANIMALS } from '$lib/content/animals';

const WORLD_W = 960;
const WORLD_H = 540;
const TILE = 42;
const BED_GAP = 16;
const FARM_X = 306;
const FARM_Y = 220;
const CROP_ROWS = ['rice', 'corn', 'carrot', 'tomato', 'chili', 'cassava', 'strawberry', 'watermelon'];

export interface PlotHover {
  x: number;
  y: number;
  title: string;
  detail: string;
  valid: boolean;
}

interface FarmSceneCallbacks {
  getState: () => GameState;
  getTool: () => Tool;
  onScene: (scene: Phaser.Scene) => void;
  onHover: (hover: PlotHover | null) => void;
  move: (x: number, y: number) => void;
  toolAt: (index: number, tool: Tool) => void;
}

const toolColors: Record<Tool, number> = {
  hoe: 0xc68b4d,
  seed: 0x8fd05f,
  water: 0x55c9f3,
  fertilizer: 0xf4e39b,
  hand: 0xffdc66,
  feed: 0xe99c54
};

function tilePosition(tile: Pick<FarmTile, 'x' | 'y'>) {
  return {
    x: FARM_X + tile.x * TILE + (tile.x >= 4 ? BED_GAP : 0),
    y: FARM_Y + tile.y * TILE + (tile.y >= 3 ? BED_GAP : 0)
  };
}

function tileAtPointer(x: number, y: number, state: GameState) {
  return state.plots.findIndex((tile) => {
    const position = tilePosition(tile);
    return x >= position.x && x <= position.x + TILE - 4 && y >= position.y && y <= position.y + TILE - 4;
  });
}

function actionIsValid(tile: FarmTile, tool: Tool) {
  if (tool === 'hoe') return !tile.tilled;
  if (tool === 'seed') return tile.tilled && !tile.cropId;
  if (tool === 'water') return tile.tilled && !tile.watered;
  if (tool === 'fertilizer') return tile.tilled && !tile.fertilized;
  if (tool === 'hand') return Boolean(tile.cropId);
  return false;
}

function plotDescription(tile: FarmTile) {
  if (!tile.tilled) return { title: 'Rumput liar', detail: 'Cangkul untuk membuka lahan' };
  if (!tile.cropId) return { title: tile.watered ? 'Tanah lembap' : 'Tanah siap tanam', detail: tile.fertilized ? 'Sudah dipupuk' : 'Belum ditanami' };
  const crop = CROPS[tile.cropId];
  const remaining = Math.max(0, crop.growthDays - tile.wateredDays);
  return { title: crop.name, detail: remaining === 0 ? 'Siap dipanen!' : `${remaining} hari lagi · ${tile.watered ? 'sudah disiram' : 'butuh air'}` };
}

export function drawWorld(target: Phaser.Scene, state: GameState) {
  const scene = target as FarmScene;
  if (!scene.worldGraphics) return;
  const graphics = scene.worldGraphics;
  graphics.clear();

  // The painted isometric beds stay fully visible. Only changed plots receive
  // a state layer, while untouched plots remain part of the environment.
  state.plots.forEach((tile) => {
    const { x, y } = tilePosition(tile);
    if (tile.tilled) {
      const soil = tile.watered ? 0x40342e : 0x70482e;
      graphics.fillStyle(0x17271e, 0.28).fillEllipse(x + 19, y + 35, 37, 9);
      graphics.fillStyle(soil, 0.98).fillRoundedRect(x + 2, y + 2, TILE - 6, TILE - 6, 9);
      graphics.lineStyle(1, tile.fertilized ? 0xf6dc78 : 0x2f251f, tile.fertilized ? 0.72 : 0.35);
      for (let row = 0; row < 3; row += 1) graphics.lineBetween(x + 8, y + 11 + row * 9, x + 31, y + 11 + row * 9);
      if (tile.watered) {
        graphics.fillStyle(0x98e8f6, 0.32).fillEllipse(x + 19, y + 32, 24, 3);
        graphics.fillStyle(0xd5f8ff, 0.52).fillCircle(x + 29, y + 9, 1.5);
      }
    }
  });

  if (state.tutorialStep < 4) {
    const tutorialIndex = Math.max(0, state.plots.findIndex((tile) =>
      state.tutorialStep === 0 ? !tile.tilled : state.tutorialStep === 1 ? tile.tilled && !tile.cropId : Boolean(tile.cropId)
    ));
    const position = tilePosition(state.plots[tutorialIndex]);
    const pulse = 0.5 + Math.sin(scene.animationTime * 0.005) * 0.25;
    graphics.lineStyle(3, 0xffe879, pulse).strokeRoundedRect(position.x - 2, position.y - 2, TILE, TILE, 10);
  }

  scene.syncCrops(state);
  state.animals.forEach((animal, index) => {
    const x = 765 + (index % 3) * 46;
    const y = 350 + Math.floor(index / 3) * 44 + Math.sin(scene.animationTime * 0.003 + index) * 2;
    const size = animal.kind === 'chicken' ? 11 : 15;
    graphics.fillStyle(0x10251d, 0.24).fillEllipse(x, y + size, size * 2.3, 7);
    graphics.fillStyle(ANIMALS[animal.kind].color).fillEllipse(x, y, size * 2, size * 1.55);
    graphics.fillStyle(0xfff0d3).fillCircle(x + size * 0.68, y - size * 0.46, size * 0.55);
    graphics.fillStyle(0x1b241e).fillCircle(x + size * 0.85, y - size * 0.55, 1.5);
    if (animal.productReady) graphics.fillStyle(0xffd85e).fillCircle(x, y - size - 7, 4);
  });

  if (state.weather === 'berawan') graphics.fillStyle(0x9ab7bb, 0.14).fillRect(0, 0, WORLD_W, WORLD_H);
}

class FarmScene extends Phaser.Scene {
  player!: Phaser.GameObjects.Image;
  playerShadow!: Phaser.GameObjects.Ellipse;
  worldGraphics!: Phaser.GameObjects.Graphics;
  atmosphereGraphics!: Phaser.GameObjects.Graphics;
  hoverGraphics!: Phaser.GameObjects.Graphics;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  keys!: Record<string, Phaser.Input.Keyboard.Key>;
  animationTime = 0;
  private lastAtmosphereFrame = 0;
  private activePlot = -1;
  private hoverTool: Tool | null = null;
  private actionLocked = false;
  private cropSprites: Array<Phaser.GameObjects.Image | undefined> = [];
  private motes: Array<{ x: number; y: number; speed: number; phase: number }> = [];
  private reducedEffects = false;

  constructor(private callbacks: FarmSceneCallbacks) { super('farm'); }

  preload() {
    this.load.image('farm-morning', '/assets/environment/nusantara-farm-isometric.webp');
    this.load.image('crop-growth', '/assets/gameplay/crop-growth-atlas.webp');
    this.load.image('nusantara-atlas', '/assets/pixel-art/nusantara-atlas-v1.png');
  }

  create() {
    const state = this.callbacks.getState();
    this.reducedEffects = globalThis.localStorage?.getItem('nusantara-low-effects') === 'true';
    this.callbacks.onScene(this);
    this.add.image(WORLD_W / 2, WORLD_H / 2, 'farm-morning').setDisplaySize(WORLD_W, WORLD_H).setDepth(0);
    this.worldGraphics = this.add.graphics().setDepth(2);
    this.cropSprites = Array.from({ length: state.plots.length });
    this.hoverGraphics = this.add.graphics().setDepth(6);
    this.atmosphereGraphics = this.add.graphics().setDepth(8);
    this.motes = Array.from({ length: this.reducedEffects ? 8 : 24 }, (_, index) => ({
      x: (index * 149) % WORLD_W,
      y: 110 + (index * 83) % 370,
      speed: 0.012 + (index % 4) * 0.004,
      phase: index * 0.71
    }));
    drawWorld(this, state);

    this.playerShadow = this.add.ellipse(state.player.x, state.player.y + 23, 32, 10, 0x122219, 0.3).setDepth(4);
    this.player = this.add.image(state.player.x, state.player.y, 'nusantara-atlas')
      .setCrop(14, 8, 86, 142).setDisplaySize(39, 64).setDepth(5);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => this.updateHover(pointer));
    this.input.on('pointerout', () => this.clearHover());
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.beginAction(pointer));
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.fadeIn(700, 19, 41, 31);
  }

  syncCrops(state: GameState) {
    state.plots.forEach((tile, index) => {
      let sprite = this.cropSprites[index];
      if (!tile.cropId) { sprite?.setVisible(false); return; }
      if (!sprite) {
        sprite = this.add.image(0, 0, 'crop-growth').setDepth(3);
        this.cropSprites[index] = sprite;
      }
      const row = Math.max(0, CROP_ROWS.indexOf(tile.cropId));
      const crop = CROPS[tile.cropId];
      const stage = Math.min(3, Math.floor((tile.wateredDays / Math.max(1, crop.growthDays)) * 4));
      const { x, y } = tilePosition(tile);
      sprite.setCrop(stage * 128, row * 96, 128, 96)
        .setDisplaySize(48 + stage * 2, 54 + stage * 4)
        .setPosition(x + 19, y + 15)
        .setOrigin(0.5, 0.72)
        .setVisible(true);
    });
  }

  private updateHover(pointer: Phaser.Input.Pointer) {
    const state = this.callbacks.getState();
    const index = tileAtPointer(pointer.x, pointer.y, state);
    const tool = this.callbacks.getTool();
    if (index === this.activePlot && tool === this.hoverTool) return;
    this.activePlot = index;
    this.hoverTool = tool;
    this.hoverGraphics.clear();
    if (index < 0) { this.callbacks.onHover(null); return; }
    const tile = state.plots[index];
    const position = tilePosition(tile);
    const valid = actionIsValid(tile, tool);
    const description = plotDescription(tile);
    this.hoverGraphics.fillStyle(valid ? 0x8ee878 : 0xed806c, 0.16).fillRoundedRect(position.x, position.y, TILE - 4, TILE - 4, 8);
    this.hoverGraphics.lineStyle(2, valid ? 0xd8ff9d : 0xffa08f, 0.95).strokeRoundedRect(position.x, position.y, TILE - 4, TILE - 4, 8);
    this.callbacks.onHover({ x: pointer.x, y: pointer.y, ...description, valid });
  }

  private clearHover() {
    this.activePlot = -1;
    this.hoverTool = null;
    this.hoverGraphics.clear();
    this.callbacks.onHover(null);
  }

  private beginAction(pointer: Phaser.Input.Pointer) {
    if (this.actionLocked) return;
    const state = this.callbacks.getState();
    const index = tileAtPointer(pointer.x, pointer.y, state);
    if (index < 0) return;
    const tile = state.plots[index];
    const tool = this.callbacks.getTool();
    const position = tilePosition(tile);
    if (!actionIsValid(tile, tool)) {
      this.cameras.main.shake(80, 0.001);
      this.createToolBurst(position.x + 19, position.y + 18, 0xef7867);
      return;
    }
    this.actionLocked = true;
    const targetX = Phaser.Math.Clamp(position.x - 22, 100, 900);
    const targetY = Phaser.Math.Clamp(position.y + 48, 150, 505);
    this.player.setFlipX(targetX < this.player.x);
    this.tweens.add({
      targets: [this.player, this.playerShadow], x: targetX, y: targetY,
      duration: this.reducedEffects ? 90 : 260, ease: 'Sine.easeInOut',
      onComplete: () => {
        this.tweens.add({ targets: this.player, angle: tool === 'water' ? -12 : 10, yoyo: true, duration: 110, repeat: 1 });
        this.time.delayedCall(this.reducedEffects ? 20 : 180, () => {
          this.callbacks.toolAt(index, tool);
          this.createToolBurst(position.x + 19, position.y + 18, toolColors[tool]);
          this.actionLocked = false;
        });
      }
    });
  }

  private createToolBurst(x: number, y: number, color: number) {
    const count = this.reducedEffects ? 3 : 9;
    for (let index = 0; index < count; index += 1) {
      const particle = this.add.circle(x, y, 2 + index % 2, color, 0.95).setDepth(10);
      const angle = Math.PI * 2 * index / count;
      this.tweens.add({
        targets: particle, x: x + Math.cos(angle) * 25, y: y + Math.sin(angle) * 21,
        alpha: 0, scale: 0.2, duration: 430, ease: 'Cubic.easeOut', onComplete: () => particle.destroy()
      });
    }
    if (!this.reducedEffects) this.cameras.main.shake(80, 0.0015);
  }

  private drawAtmosphere(state: GameState) {
    const graphics = this.atmosphereGraphics;
    graphics.clear();
    this.motes.forEach((mote, index) => {
      const x = (mote.x + this.animationTime * mote.speed) % WORLD_W;
      const y = mote.y + Math.sin(this.animationTime * 0.0015 + mote.phase) * 7;
      graphics.fillStyle(index % 5 === 0 ? 0xa8db69 : 0xffe58e, index % 5 === 0 ? 0.48 : 0.35);
      if (index % 5 === 0) graphics.fillEllipse(x, y, 6, 3); else graphics.fillCircle(x, y, 1.4);
    });
    graphics.lineStyle(2, 0xc6fbff, 0.55);
    for (let index = 0; index < 6; index += 1) {
      const y = 180 + (index * 67 + this.animationTime * 0.035) % 340;
      graphics.beginPath().moveTo(32, y).lineTo(54, y - 3).lineTo(72, y + 1).strokePath();
    }
    if (!this.reducedEffects) {
      const birdX = (this.animationTime * 0.025) % 1100 - 70;
      graphics.lineStyle(2, 0x193c31, 0.42);
      graphics.beginPath().moveTo(birdX, 92).lineTo(birdX + 7, 88).lineTo(birdX + 14, 92).strokePath();
      graphics.beginPath().moveTo(birdX + 34, 112).lineTo(birdX + 40, 108).lineTo(birdX + 46, 112).strokePath();
    }
    if (state.weather === 'hujan' || state.weather === 'badai') {
      graphics.lineStyle(2, 0xc7ecf5, state.weather === 'badai' ? 0.75 : 0.48);
      const offset = this.animationTime * 0.38 % 42;
      const drops = this.reducedEffects ? 18 : 58;
      for (let index = 0; index < drops; index += 1) {
        const x = (index * 89 + state.day * 17) % (WORLD_W + 30);
        const y = (index * 53 + offset) % WORLD_H;
        graphics.lineBetween(x, y, x - 8, y + 19);
      }
      graphics.fillStyle(0x244b5b, 0.14).fillRect(0, 0, WORLD_W, WORLD_H);
    }
    const nightAlpha = Phaser.Math.Clamp((state.timeMinutes - 990) / 420, 0, 0.48);
    if (nightAlpha > 0) {
      graphics.fillStyle(0x0a1840, nightAlpha).fillRect(0, 0, WORLD_W, WORLD_H);
      for (let index = 0; index < 10; index += 1) {
        const glow = 0.35 + Math.sin(this.animationTime * 0.003 + index) * 0.2;
        graphics.fillStyle(0xffe779, glow).fillCircle(110 + (index * 83) % 760, 170 + (index * 57) % 310, 1.5);
      }
    }
  }

  update(time: number, delta: number) {
    this.animationTime = time;
    const state = this.callbacks.getState();
    const speed = 0.18 * delta;
    let dx = 0, dy = 0;
    if (!this.actionLocked) {
      if (this.cursors.left.isDown || this.keys.A.isDown) dx -= speed;
      if (this.cursors.right.isDown || this.keys.D.isDown) dx += speed;
      if (this.cursors.up.isDown || this.keys.W.isDown) dy -= speed;
      if (this.cursors.down.isDown || this.keys.S.isDown) dy += speed;
    }
    if (dx || dy) {
      this.player.x = Phaser.Math.Clamp(this.player.x + dx, 92, 910);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy, 145, 500);
      this.player.setFlipX(dx < 0);
      this.player.rotation = Math.sin(time * 0.018) * 0.035;
      this.callbacks.move(this.player.x, this.player.y);
    } else if (!this.actionLocked) {
      this.player.y += Math.sin(time * 0.004) * 0.025;
      this.player.rotation *= 0.82;
    }
    this.playerShadow.setPosition(this.player.x, this.player.y + 25);
    if (this.activePlot >= 0 && this.hoverTool !== this.callbacks.getTool()) this.updateHover(this.input.activePointer);
    if (time - this.lastAtmosphereFrame > 80) {
      this.drawAtmosphere(state);
      this.lastAtmosphereFrame = time;
    }
  }
}

export function createFarmGame(parent: HTMLDivElement, callbacks: FarmSceneCallbacks) {
  return new Phaser.Game({
    type: Phaser.CANVAS,
    parent,
    width: WORLD_W,
    height: WORLD_H,
    backgroundColor: '#173d2d',
    scene: new FarmScene(callbacks),
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
  });
}
