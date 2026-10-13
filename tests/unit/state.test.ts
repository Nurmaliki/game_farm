import { describe, expect, it } from 'vitest';
import { createInitialState, GameStateSchema } from '../../src/lib/domain/state';

describe('game state schema', () => {
  it('accepts the initial state', () => expect(GameStateSchema.safeParse(createInitialState()).success).toBe(true));
  it('rejects negative money and malformed plot counts', () => {
    const state = createInitialState();
    state.coins = -1;
    state.plots.pop();
    expect(GameStateSchema.safeParse(state).success).toBe(false);
  });
});
