import { CROPS } from '../content/crops';
import { ANIMALS, type AnimalKind } from '../content/animals';
import { FISH } from '../content/fish';
import { FORAGE } from '../content/forage';
import type { FarmTile, GameState, Tool } from './state';

export type ActionResult = { ok: true; message: string } | { ok: false; message: string };
const success = (message: string): ActionResult => ({ ok: true, message });
const failure = (message: string): ActionResult => ({ ok: false, message });
const spendStamina = (state: GameState, amount: number): boolean => state.player.stamina >= amount && ((state.player.stamina -= amount) >= 0);

export function useTool(state: GameState, tile: FarmTile, tool: Tool, selectedCrop = 'rice'): ActionResult {
  if (tool === 'hoe') {
    if (tile.tilled) return failure('Tanah ini sudah digemburkan.');
    if (!spendStamina(state, Math.max(1, 3 - state.upgrades.hoe))) return failure('Stamina tidak cukup.');
    tile.tilled = true; state.tutorialStep = Math.max(state.tutorialStep, 1); return success('Tanah siap ditanami.');
  }
  if (tool === 'seed') {
    const crop = CROPS[selectedCrop];
    if (!crop) return failure('Jenis benih tidak dikenal.');
    if (!tile.tilled || tile.cropId) return failure('Benih perlu petak kosong yang sudah digemburkan.');
    if (!crop.seasons.includes(state.season)) return failure(`${crop.name} tidak cocok ditanam pada musim ${state.season}.`);
    const seedId = `${crop.id}_seed`;
    if ((state.inventory[seedId] ?? 0) < 1) return failure(`Benih ${crop.name} habis. Beli di kios.`);
    state.inventory[seedId] -= 1; tile.cropId = crop.id; tile.plantedDay = state.day; tile.wateredDays = 0; tile.harvested = false;
    state.tutorialStep = Math.max(state.tutorialStep, 2); return success(`Benih ${crop.name} ditanam.`);
  }
  if (tool === 'water') {
    if (!tile.tilled) return failure('Tidak ada tanah garapan di sini.');
    if (tile.watered) return failure('Petak ini sudah basah hari ini.');
    if (!spendStamina(state, Math.max(1, 2 - Math.floor(state.upgrades.wateringCan / 2)))) return failure('Stamina tidak cukup.');
    tile.watered = true; if (tile.cropId) tile.wateredDays += 1;
    state.tutorialStep = Math.max(state.tutorialStep, 3); return success('Tanaman disiram.');
  }
  if (tool === 'fertilizer') {
    if (!tile.tilled || !tile.cropId) return failure('Pupuk hanya dapat digunakan pada tanaman.');
    if (tile.fertilized) return failure('Tanaman ini sudah dipupuk.');
    if ((state.inventory.fertilizer ?? 0) < 1) return failure('Pupuk habis.');
    state.inventory.fertilizer -= 1; tile.fertilized = true; return success('Tanaman dipupuk; peluang kualitas meningkat.');
  }
  if (tool === 'hand') {
    if (!tile.cropId) return failure('Belum ada yang bisa dipanen.');
    const crop = CROPS[tile.cropId];
    if (tile.wateredDays < crop.growthDays) return failure(`${crop.name} perlu ${crop.growthDays - tile.wateredDays} hari siraman lagi.`);
    if (tile.harvested) return failure('Hasil petak ini sudah diambil.');
    const quality = tile.fertilized ? 'quality_' : '';
    const productId = `${quality}${crop.id}`;
    state.inventory[productId] = (state.inventory[productId] ?? 0) + 1; state.player.xp += crop.experience;
    tile.harvested = true; tile.watered = false; tile.fertilized = false;
    if (crop.regrowDays) { tile.wateredDays = crop.growthDays - crop.regrowDays; tile.harvested = false; }
    else { tile.cropId = null; tile.tilled = false; }
    state.tutorialStep = Math.max(state.tutorialStep, 4); return success(`Panen ${crop.name}${quality ? ' kualitas unggul' : ''} berhasil!`);
  }
  return failure('Gunakan pakan melalui panel kandang.');
}

export function nextDay(state: GameState): ActionResult {
  state.day += 1; state.timeMinutes = 360; state.player.stamina = 100;
  if (state.day > 28) state.season = (['semi', 'panas', 'gugur', 'hujan'] as const)[Math.floor((state.day - 1) / 28) % 4];
  state.plots.forEach((tile) => { if (state.weather === 'hujan' && tile.tilled && !tile.watered) { tile.watered = true; if (tile.cropId) tile.wateredDays += 1; } else tile.watered = false; });
  state.animals.forEach((animal) => {
    const caredFor = animal.fedToday && animal.health >= 40;
    animal.productReady = caredFor && animal.happiness >= 40;
    animal.hunger = Math.max(0, Math.min(100, animal.hunger + (animal.fedToday ? 25 : -15)));
    animal.happiness = Math.max(0, Math.min(100, animal.happiness + (animal.pettedToday ? 10 : -5)));
    animal.cleanliness = Math.max(0, Math.min(100, animal.cleanliness + (animal.cleanedToday ? 20 : -8)));
    animal.health = Math.max(25, Math.min(100, animal.health + (animal.hunger > 30 && animal.cleanliness > 25 ? 2 : -5)));
    animal.friendship = Math.min(100, animal.friendship + (animal.pettedToday ? 2 : 0));
    animal.aiState = animal.productReady ? 'PRODUCE' : animal.fedToday ? 'REST' : animal.hunger < 35 ? 'EAT' : state.day % 2 ? 'WANDER' : 'IDLE';
    animal.fedToday = false; animal.pettedToday = false; animal.cleanedToday = false;
  });
  return success(`Hari ke-${state.day} dimulai. Kebun dan ternak menantimu.`);
}

export function buyItem(state: GameState, item: string, amount = 1): ActionResult {
  const cropId = item.endsWith('_seed') ? item.slice(0, -5) : null;
  const unitPrice = cropId && CROPS[cropId] ? CROPS[cropId].seedPrice : item === 'chicken_feed' ? 8 : item === 'fertilizer' ? 15 : item === 'bait' ? 6 : 0;
  if (!unitPrice || amount < 1) return failure('Item tidak tersedia.');
  const cost = unitPrice * amount; if (state.coins < cost) return failure('Koin tidak cukup.');
  state.coins -= cost;
  if (item === 'bait') state.fishing.bait += amount; else state.inventory[item] = (state.inventory[item] ?? 0) + amount;
  return success(`Pembelian berhasil: ${amount} item.`);
}

export function sellItem(state: GameState, item: string): ActionResult {
  const quality = item.startsWith('quality_'); const base = quality ? item.slice(8) : item;
  const crop = CROPS[base]; const animalProduct = Object.values(ANIMALS).find((entry) => entry.productId === item);
  const fish = item.startsWith('fish_') ? FISH[item.slice(5)] : undefined; const forage = FORAGE[item];
  const price = crop ? Math.round(crop.salePrice * (quality ? 1.5 : 1)) : animalProduct?.productPrice ?? fish?.salePrice ?? forage?.salePrice ?? 0;
  if (!price || (state.inventory[item] ?? 0) < 1) return failure('Item ini tidak tersedia untuk dijual.');
  state.inventory[item] -= 1; state.coins += price; return success(`Produk terjual +${price} koin.`);
}

export function buyAnimal(state: GameState, kind: AnimalKind): ActionResult {
  const definition = ANIMALS[kind];
  const capacity = definition.housing === 'coop' ? state.upgrades.coop * 3 : state.upgrades.barn * 3;
  const occupancy = state.animals.filter((animal) => ANIMALS[animal.kind].housing === definition.housing).length;
  if (occupancy >= capacity) return failure(`Kapasitas ${definition.housing === 'coop' ? 'kandang ayam' : 'lumbung'} penuh.`);
  if (state.coins < definition.buyPrice) return failure('Koin tidak cukup.');
  state.coins -= definition.buyPrice;
  state.animals.push({ id: `${kind}-${state.day}-${state.animals.length}`, kind, name: `${definition.name} ${state.animals.length + 1}`, hunger: 60, happiness: 50, health: 100, cleanliness: 90, friendship: 0, fedToday: false, pettedToday: false, cleanedToday: false, productReady: false, aiState: 'IDLE' });
  return success(`${definition.name} baru tiba di peternakan.`);
}

export function careForAnimal(state: GameState, id: string, action: 'feed' | 'pet' | 'clean' | 'collect'): ActionResult {
  const animal = state.animals.find((entry) => entry.id === id); if (!animal) return failure('Ternak tidak ditemukan.');
  const definition = ANIMALS[animal.kind];
  if (action === 'collect') {
    if (!animal.productReady) return failure(`${animal.name} belum menghasilkan produk.`);
    animal.productReady = false; animal.aiState = 'IDLE'; state.inventory[definition.productId] = (state.inventory[definition.productId] ?? 0) + 1; return success(`${definition.productName} dikumpulkan.`);
  }
  if (action === 'feed') {
    if (animal.fedToday) return failure(`${animal.name} sudah makan.`);
    if ((state.inventory.chicken_feed ?? 0) < 1) return failure('Pakan ternak habis.');
    state.inventory.chicken_feed -= 1; animal.fedToday = true; animal.aiState = 'EAT'; return success(`${animal.name} makan dengan lahap.`);
  }
  if (action === 'pet') {
    if (animal.pettedToday) return failure(`${animal.name} sudah disapa.`);
    animal.pettedToday = true; animal.happiness = Math.min(100, animal.happiness + 5); return success(`${animal.name} tampak senang.`);
  }
  if (animal.cleanedToday) return failure(`${animal.name} sudah dibersihkan.`);
  animal.cleanedToday = true; animal.cleanliness = Math.min(100, animal.cleanliness + 15); return success(`${animal.name} kini bersih.`);
}

export function upgrade(state: GameState, target: keyof GameState['upgrades']): ActionResult {
  const level = state.upgrades[target]; if (level >= 3) return failure('Upgrade sudah maksimal.');
  const cost = 150 * level; if (state.coins < cost) return failure(`Perlu ${cost} koin.`);
  state.coins -= cost; state.upgrades[target] += 1; return success(`Upgrade ${target} kini level ${level + 1}.`);
}
