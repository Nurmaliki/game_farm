import { describe, expect, it } from 'vitest';
import { CROPS } from '../../src/lib/content/crops';
import { createInitialState, migrateState } from '../../src/lib/domain/state';
import { buyAnimal, careForAnimal, nextDay, sellItem, upgrade, useTool } from '../../src/lib/domain/gameplay';

describe('Phase 2 farming', () => {
  it('defines all eight requested crops', () => {
    expect(Object.keys(CROPS)).toEqual(expect.arrayContaining(['rice', 'corn', 'carrot', 'tomato', 'chili', 'cassava', 'strawberry', 'watermelon']));
  });

  it('enforces seasons and grants fertilized quality harvests', () => {
    const state = createInitialState();
    const tile = state.plots[0];
    useTool(state, tile, 'hoe');
    state.inventory.corn_seed = 1;
    expect(useTool(state, tile, 'seed', 'corn').ok).toBe(false);
    state.inventory.chili_seed = 1;
    expect(useTool(state, tile, 'seed', 'chili').ok).toBe(true);
    expect(useTool(state, tile, 'fertilizer').ok).toBe(true);
    tile.wateredDays = CROPS.chili.growthDays;
    expect(useTool(state, tile, 'hand').ok).toBe(true);
    expect(state.inventory.quality_chili).toBe(1);
    expect(sellItem(state, 'quality_chili').ok).toBe(true);
  });

  it('tool upgrades are atomic and reduce stamina cost', () => {
    const state = createInitialState();
    state.coins = 500;
    expect(upgrade(state, 'hoe').ok).toBe(true);
    const stamina = state.player.stamina;
    useTool(state, state.plots[0], 'hoe');
    expect(state.player.stamina).toBe(stamina - 1);
  });
});

describe('Phase 2 ranching', () => {
  it('supports purchasing and caring for all four animal kinds', () => {
    const state = createInitialState();
    state.coins = 10_000;
    for (const kind of ['chicken', 'cow', 'goat', 'sheep'] as const) expect(buyAnimal(state, kind).ok).toBe(true);
    expect(new Set(state.animals.map((animal) => animal.kind))).toEqual(new Set(['chicken', 'cow', 'goat', 'sheep']));
    const cow = state.animals.find((animal) => animal.kind === 'cow')!;
    careForAnimal(state, cow.id, 'feed'); careForAnimal(state, cow.id, 'pet'); careForAnimal(state, cow.id, 'clean');
    nextDay(state);
    expect(cow.productReady).toBe(true);
    expect(careForAnimal(state, cow.id, 'collect').ok).toBe(true);
    expect(state.inventory.milk).toBe(1);
  });

  it('migrates compatible version 1 saves', () => {
    const current = createInitialState();
    const legacy = { ...current, version: 1, chicken: { name: 'Cici', hunger: 50, happiness: 60, fedToday: false, pettedToday: false, productReady: false } };
    delete (legacy as Partial<typeof legacy>).animals;
    delete (legacy as Partial<typeof legacy>).upgrades;
    legacy.plots = legacy.plots.map((entry) => {
      const plot: Partial<typeof entry> = { ...entry };
      delete plot.fertilized;
      return plot as typeof entry;
    });
    const migrated = migrateState(legacy);
    expect(migrated.version).toBe(8);
    expect(migrated.animals[0].name).toBe('Cici');
    expect(migrated.plots[0].fertilized).toBe(false);
  });
});
