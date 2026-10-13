import { describe, expect, it } from 'vitest';
import { createInitialState, migrateState } from '../../src/lib/domain/state';
import { advanceFishing, availableFish, beginFishing, resolveTick } from '../../src/lib/domain/fishing';
import { collectForage, generateForage } from '../../src/lib/domain/foraging';
import { FISH } from '../../src/lib/content/fish';
import { FORAGE } from '../../src/lib/content/forage';

const hash = (text:string) => [...text].reduce((value,char) => (value * 31 + char.charCodeAt(0)) >>> 0, 2166136261);

describe('Phase 3 fishing', () => {
  it('filters fish by location, season, weather, and time', () => {
    const state=createInitialState();
    const pool=availableFish(state,'river');
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every((fish)=>fish.locations.includes('river')&&fish.seasons.includes('hujan')&&fish.weather.includes('cerah'))).toBe(true);
  });

  it('runs the complete state machine and records a catch once', () => {
    const state=createInitialState();
    expect(beginFishing(state,'river').ok).toBe(true);
    for(let step=0;step<5;step+=1) advanceFishing(state);
    expect(state.fishing.session.phase).toBe('MINIGAME');
    const session=state.fishing.session; const fish=FISH[session.fishId!];
    session.progress=99; session.tension=0;
    const nextTick=session.tick+1;
    session.zonePosition=50+Math.sin((nextTick+hash(fish.id)%7)*(0.55+fish.difficulty*.12))*42;
    expect(resolveTick(state).ok).toBe(true);
    expect(session.phase).toBe('CAUGHT');
    expect(state.fishRecords[fish.id].caught).toBe(1);
    expect(state.inventory[`fish_${fish.id}`]).toBe(1);
  });
});

describe('Phase 3 foraging', () => {
  it('generates deterministic valid spawns and prevents duplicate collection', () => {
    const state=createInitialState();
    expect(generateForage(state).ok).toBe(true);
    expect(state.forageSpawns.length).toBeGreaterThan(0);
    expect(state.forageSpawns.every((spawn)=>FORAGE[spawn.itemId])).toBe(true);
    const spawn=state.forageSpawns[0];
    expect(collectForage(state,spawn.id).ok).toBe(true);
    expect(collectForage(state,spawn.id).ok).toBe(false);
    expect(state.forageRecords[spawn.itemId]).toBe(1);
  });

  it('migrates Phase 2 saves into Phase 3 state', () => {
    const current=createInitialState();
    const legacy={...current,version:2};
    delete (legacy as Partial<typeof legacy>).fishing; delete (legacy as Partial<typeof legacy>).fishRecords; delete (legacy as Partial<typeof legacy>).forageSpawns; delete (legacy as Partial<typeof legacy>).forageRecords;
    const migrated=migrateState(legacy);
    expect(migrated.version).toBe(8);
    expect(migrated.fishing.rod).toBe('bamboo');
  });
});
