import { describe, expect, it } from 'vitest';
import { createInitialState } from '../../src/lib/domain/state';
import { buyItem, careForAnimal, nextDay, sellItem, useTool } from '../../src/lib/domain/gameplay';

describe('vertical slice farming', () => {
  it('requires tilling before planting and never duplicates a harvest', () => {
    const state = createInitialState();
    const tile = state.plots[0];
    expect(useTool(state, tile, 'seed').ok).toBe(false);
    expect(useTool(state, tile, 'hoe').ok).toBe(true);
    expect(useTool(state, tile, 'seed').ok).toBe(true);
    for (let day = 0; day < 3; day += 1) { expect(useTool(state, tile, 'water').ok).toBe(true); nextDay(state); }
    expect(useTool(state, tile, 'hand').ok).toBe(true);
    expect(state.inventory.rice).toBe(1);
    expect(useTool(state, tile, 'hand').ok).toBe(false);
    expect(state.inventory.rice).toBe(1);
  });

  it('keeps currency and inventory nonnegative', () => {
    const state = createInitialState();
    state.coins = 0;
    expect(buyItem(state, 'rice_seed').ok).toBe(false);
    expect(state.coins).toBe(0);
    expect(sellItem(state, 'rice').ok).toBe(false);
    expect(state.inventory.rice).toBe(0);
  });

  it('produces one egg after a cared-for day', () => {
    const state = createInitialState();
    careForAnimal(state, 'chicken-1', 'feed');
    careForAnimal(state, 'chicken-1', 'pet');
    nextDay(state);
    expect(state.animals[0].productReady).toBe(true);
    expect(careForAnimal(state, 'chicken-1', 'collect').ok).toBe(true);
    expect(state.inventory.egg).toBe(1);
    expect(careForAnimal(state, 'chicken-1', 'pet').ok).toBe(true);
    expect(state.inventory.egg).toBe(1);
  });
});
