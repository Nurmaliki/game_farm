import { z } from 'zod';

export const TileSchema = z.object({
  x: z.number().int().min(0).max(7), y: z.number().int().min(0).max(5), tilled: z.boolean(), watered: z.boolean(), fertilized: z.boolean(),
  cropId: z.string().nullable(), plantedDay: z.number().int().nonnegative(), wateredDays: z.number().int().nonnegative(), harvested: z.boolean()
});
export const AnimalSchema = z.object({
  id: z.string(), kind: z.enum(['chicken', 'cow', 'goat', 'sheep']), name: z.string().min(1).max(24),
  hunger: z.number().min(0).max(100), happiness: z.number().min(0).max(100), health: z.number().min(0).max(100), cleanliness: z.number().min(0).max(100), friendship: z.number().int().min(0).max(100),
  fedToday: z.boolean(), pettedToday: z.boolean(), cleanedToday: z.boolean(), productReady: z.boolean(), aiState: z.enum(['IDLE', 'WANDER', 'EAT', 'REST', 'PRODUCE'])
});
export const GameStateSchema = z.object({
  version: z.literal(8),
  player: z.object({ x: z.number(), y: z.number(), stamina: z.number().min(0).max(100), level: z.number().int().positive(), xp: z.number().int().nonnegative() }),
  day: z.number().int().positive(), season: z.enum(['semi', 'panas', 'gugur', 'hujan']),
  timeMinutes: z.number().int().min(360).max(1560), weather: z.enum(['cerah', 'berawan', 'hujan', 'badai']), coins: z.number().int().nonnegative(), inventory: z.record(z.number().int().nonnegative()),
  plots: z.array(TileSchema).length(48), animals: z.array(AnimalSchema).max(12),
  upgrades: z.object({ hoe: z.number().int().min(1).max(3), wateringCan: z.number().int().min(1).max(3), coop: z.number().int().min(1).max(3), barn: z.number().int().min(1).max(3) }),
  fishing: z.object({ rod: z.enum(['bamboo','basic','reinforced','advanced']), bait: z.number().int().nonnegative(), skill: z.number().int().nonnegative(), totalCaught: z.number().int().nonnegative(),
    session: z.object({ phase:z.enum(['IDLE','AIMING','CASTING','WAITING','BITE','HOOKED','MINIGAME','CAUGHT','ESCAPED']), location:z.enum(['river','lake','forest_pond','beach','farm_pond']), fishId:z.string().nullable(), progress:z.number().min(0).max(100), tension:z.number().min(0).max(100), fishPosition:z.number().min(0).max(100), zonePosition:z.number().min(0).max(100), tick:z.number().nonnegative() }) }),
  fishRecords: z.record(z.object({ caught: z.number().int().positive(), bestSize: z.number().positive() })),
  forageSpawns: z.array(z.object({ id:z.string(), itemId:z.string(), collected:z.boolean() })),
  forageRecords: z.record(z.number().int().nonnegative()),
  buildings: z.array(z.object({ id:z.string(), type:z.string(), x:z.number().int().min(0).max(11), y:z.number().int().min(0).max(7), level:z.number().int().min(1).max(3) })),
  productionQueue: z.array(z.object({ id:z.string(), recipeId:z.string(), readyDay:z.number().int().positive(), collected:z.boolean() })).max(12),
  cooking: z.object({ cooked:z.record(z.number().int().nonnegative()), activeBuff:z.string().nullable() }),
  exploration: z.object({ currentArea:z.enum(['farm','village','forest','mine','beach','river']), unlocked:z.array(z.enum(['farm','village','forest','mine','beach','river'])), visited:z.record(z.number().int().nonnegative()) }),
  mining: z.object({ pickaxe:z.number().int().min(1).max(3), floor:z.number().int().min(1).max(20), nodes:z.array(z.object({id:z.string(),mineral:z.enum(['stone','copper','iron','coal','gold','crystal','rare_mineral']),hits:z.number().int().nonnegative(),depleted:z.boolean()})), lastGeneratedDay:z.number().int().nonnegative() }),
  orchard:z.array(z.object({id:z.string(),type:z.enum(['mango','banana','coconut','orange','guava']),plantedDay:z.number().int().positive(),health:z.number().min(0).max(100),lastHarvestDay:z.number().int().nonnegative()})).max(20),
  apiary:z.object({hives:z.number().int().min(0).max(12),level:z.number().int().min(1).max(3),honeyReady:z.number().int().nonnegative(),lastProducedDay:z.number().int().nonnegative()}),
  fishPond:z.object({built:z.boolean(),level:z.number().int().min(1).max(3),fishId:z.string().nullable(),stock:z.number().int().nonnegative(),fedToday:z.boolean(),condition:z.number().min(0).max(100),lastProducedDay:z.number().int().nonnegative()}),
  village:z.object({relationships:z.record(z.number().int().min(0).max(100)),talkedToday:z.array(z.string()),reputation:z.number().int().nonnegative(),claimedQuests:z.array(z.string()),acceptedQuests:z.array(z.string()),museum:z.record(z.boolean()),festivalClaims:z.array(z.string())}),
  personalization:z.object({pets:z.array(z.object({type:z.enum(['cat','dog','horse']),name:z.string(),friendship:z.number().int().min(0).max(100),interactedToday:z.boolean()})),mounted:z.boolean(),insects:z.record(z.number().int().nonnegative()),insectSpawns:z.array(z.object({id:z.string(),type:z.string(),caught:z.boolean()})),furniture:z.array(z.object({id:z.string(),type:z.string(),x:z.number().int().min(0).max(7),y:z.number().int().min(0).max(5)})),wallpaper:z.string(),flooring:z.string(),houseLevel:z.number().int().min(1).max(3),achievements:z.array(z.string()),photoMode:z.boolean()}),
  tutorialStep: z.number().int().min(0).max(8), lastSavedAt: z.number().int().nonnegative()
});

export type GameState = z.infer<typeof GameStateSchema>;
export type FarmTile = z.infer<typeof TileSchema>;
export type Animal = z.infer<typeof AnimalSchema>;
export type Tool = 'hoe' | 'seed' | 'water' | 'fertilizer' | 'hand' | 'feed';

export function createInitialState(): GameState {
  return {
    version: 8, player: { x: 320, y: 230, stamina: 100, level: 1, xp: 0 }, day: 1, season: 'hujan', timeMinutes: 360, weather: 'cerah', coins: 350,
    inventory: { rice_seed: 6, rice: 0, chicken_feed: 4, fertilizer: 2, egg: 0, bamboo:8, fallen_branch:8 },
    plots: Array.from({ length: 48 }, (_, index) => ({ x: index % 8, y: Math.floor(index / 8), tilled: false, watered: false, fertilized: false, cropId: null, plantedDay: 0, wateredDays: 0, harvested: false })),
    animals: [{ id: 'chicken-1', kind: 'chicken', name: 'Cici', hunger: 55, happiness: 50, health: 100, cleanliness: 85, friendship: 0, fedToday: false, pettedToday: false, cleanedToday: false, productReady: false, aiState: 'IDLE' }],
    upgrades: { hoe: 1, wateringCan: 1, coop: 1, barn: 1 },
    fishing: { rod:'bamboo', bait:3, skill:0, totalCaught:0, session:{phase:'IDLE',location:'river',fishId:null,progress:0,tension:30,fishPosition:50,zonePosition:50,tick:0} }, fishRecords:{}, forageSpawns:[], forageRecords:{},
    buildings:[], productionQueue:[], cooking:{cooked:{},activeBuff:null},
    exploration:{currentArea:'farm',unlocked:['farm','village','forest'],visited:{farm:1}}, mining:{pickaxe:1,floor:1,nodes:[],lastGeneratedDay:0},
    orchard:[],apiary:{hives:0,level:1,honeyReady:0,lastProducedDay:0},fishPond:{built:false,level:1,fishId:null,stock:0,fedToday:false,condition:100,lastProducedDay:0},
    village:{relationships:{pak_jaya:0,bu_sari:0,raka:0,naya:0,dimas:0,lila:0},talkedToday:[],reputation:0,claimedQuests:[],acceptedQuests:[],museum:{},festivalClaims:[]},
    personalization:{pets:[],mounted:false,insects:{},insectSpawns:[],furniture:[],wallpaper:'bambu',flooring:'kayu',houseLevel:1,achievements:[],photoMode:false},
    tutorialStep: 0, lastSavedAt: 0
  };
}

export function migrateState(input: unknown): GameState {
  type LegacyState = Record<string, unknown> & { version?: number; plots?: Array<Record<string, unknown>>; chicken?: Record<string, unknown>; animals?: unknown; upgrades?: unknown; fishing?:unknown; fishRecords?:unknown; forageSpawns?:unknown; forageRecords?:unknown; buildings?:unknown; productionQueue?:unknown; cooking?:unknown;exploration?:unknown;mining?:unknown;orchard?:unknown;apiary?:unknown;fishPond?:unknown;village?:unknown };
  const parsed = input as LegacyState;
  const version = parsed.version ?? 0;
  if (parsed?.version === 8) return GameStateSchema.parse(input);
  if (![1,2,3,4,5,6,7].includes(version)) throw new Error('Versi save tidak didukung.');
  const fresh = createInitialState();
  return GameStateSchema.parse({ ...fresh, ...parsed, version: 8,
    plots: (parsed.plots ?? []).map((plot) => ({ fertilized:false, ...plot })),
    animals: parsed.version === 1 && parsed.chicken ? [{ ...fresh.animals[0], ...parsed.chicken, id: 'chicken-1', kind: 'chicken', health: 100, cleanliness: 85, friendship: 0, cleanedToday: false, aiState: 'IDLE' }] : parsed.animals ?? fresh.animals,
    upgrades: parsed.upgrades ?? fresh.upgrades,
    fishing:parsed.fishing ?? fresh.fishing, fishRecords:parsed.fishRecords ?? fresh.fishRecords, forageSpawns:parsed.forageSpawns ?? fresh.forageSpawns, forageRecords:parsed.forageRecords ?? fresh.forageRecords,
    buildings:parsed.version===4?(parsed.buildings??fresh.buildings):fresh.buildings,productionQueue:parsed.version===4?(parsed.productionQueue??fresh.productionQueue):fresh.productionQueue,cooking:parsed.version===4?(parsed.cooking??fresh.cooking):fresh.cooking,
    exploration:parsed.version===5?(parsed.exploration??fresh.exploration):fresh.exploration,mining:parsed.version===5?(parsed.mining??fresh.mining):fresh.mining,
    orchard:version>=6?(parsed.orchard??fresh.orchard):fresh.orchard,apiary:version>=6?(parsed.apiary??fresh.apiary):fresh.apiary,fishPond:version>=6?(parsed.fishPond??fresh.fishPond):fresh.fishPond,village:version===7?(parsed.village??fresh.village):fresh.village,personalization:fresh.personalization
  });
}
