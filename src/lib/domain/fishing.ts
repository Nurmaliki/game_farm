import { FISH, RODS, type FishingLocation, type RodId } from '../content/fish';
import type { GameState } from './state';
import type { ActionResult } from './gameplay';

const ok = (message:string):ActionResult => ({ok:true,message});
const fail = (message:string):ActionResult => ({ok:false,message});
const hash = (text:string) => [...text].reduce((value,char) => (value * 31 + char.charCodeAt(0)) >>> 0, 2166136261);

export function availableFish(state:GameState, location:FishingLocation) {
  const hour = Math.floor(state.timeMinutes / 60);
  return Object.values(FISH).filter((fish) => fish.locations.includes(location) && fish.seasons.includes(state.season) && fish.weather.includes(state.weather) && hour >= fish.startHour && hour <= fish.endHour);
}

export function beginFishing(state:GameState, location:FishingLocation):ActionResult {
  if (state.fishing.session.phase !== 'IDLE' && !['CAUGHT','ESCAPED'].includes(state.fishing.session.phase)) return fail('Selesaikan lemparan saat ini.');
  if (state.player.stamina < 3) return fail('Stamina tidak cukup untuk memancing.');
  state.fishing.session = {phase:'AIMING',location,fishId:null,progress:0,tension:30,fishPosition:50,zonePosition:50,tick:0};
  return ok('Arahkan lemparan, lalu lanjutkan.');
}

export function advanceFishing(state:GameState):ActionResult {
  const session = state.fishing.session;
  const next = { AIMING:'CASTING', CASTING:'WAITING', WAITING:'BITE', BITE:'HOOKED', HOOKED:'MINIGAME' } as const;
  if (!(session.phase in next)) return fail('Tidak ada tahap yang dapat dilanjutkan.');
  if (session.phase === 'WAITING') {
    const pool = availableFish(state, session.location);
    if (!pool.length) { session.phase = 'ESCAPED'; return fail('Tidak ada ikan aktif pada kondisi ini. Coba lokasi atau waktu lain.'); }
    const baitBonus = state.fishing.bait > 0 ? 7 : 0;
    const index = hash(`${state.day}-${session.location}-${state.fishing.totalCaught + baitBonus}`) % pool.length;
    session.fishId = pool[index].id; if (state.fishing.bait > 0) state.fishing.bait -= 1;
  }
  session.phase = next[session.phase as keyof typeof next];
  if (session.phase === 'MINIGAME') state.player.stamina -= 3;
  return ok(`Memancing: ${session.phase}.`);
}

export function moveCatchZone(state:GameState, direction:-1|1):ActionResult {
  const session = state.fishing.session; if (session.phase !== 'MINIGAME' || !session.fishId) return fail('Minigame belum dimulai.');
  session.zonePosition = Math.max(0,Math.min(100,session.zonePosition + direction * (9 + RODS[state.fishing.rod].power * 2)));
  return resolveTick(state);
}

export function resolveTick(state:GameState):ActionResult {
  const session = state.fishing.session; if (!session.fishId) return fail('Ikan tidak ditemukan.');
  const fish = FISH[session.fishId]; session.tick += 1;
  session.fishPosition = 50 + Math.sin((session.tick + hash(fish.id)%7) * (0.55 + fish.difficulty * .12)) * 42;
  const distance = Math.abs(session.zonePosition - session.fishPosition);
  const zoneSize = 20 + RODS[state.fishing.rod].power * 5 + Math.min(10,state.fishing.skill/10);
  if (distance <= zoneSize) { session.progress = Math.min(100,session.progress + 12 + RODS[state.fishing.rod].power * 2); session.tension = Math.max(0,session.tension - 6); }
  else { session.progress = Math.max(0,session.progress - fish.difficulty * 2); session.tension = Math.min(100,session.tension + 8 + fish.difficulty); }
  if (session.progress >= 100) return finishCatch(state);
  if (session.tension >= 100 || session.tick >= 35) { session.phase='ESCAPED'; return fail(`${fish.name} berhasil lepas.`); }
  return ok(distance <= zoneSize ? 'Ikan berada di zona tangkap!' : 'Kejar posisi ikan dan jaga tali.');
}

function finishCatch(state:GameState):ActionResult {
  const session = state.fishing.session; const fish = FISH[session.fishId!]; const size = 20 + (hash(`${state.day}-${fish.id}-${session.tick}`)%800)/10;
  state.inventory[`fish_${fish.id}`] = (state.inventory[`fish_${fish.id}`] ?? 0) + 1;
  const record = state.fishRecords[fish.id]; state.fishRecords[fish.id] = {caught:(record?.caught ?? 0)+1,bestSize:Math.max(record?.bestSize ?? 0,size)};
  state.fishing.totalCaught += 1; state.fishing.skill += fish.difficulty * 3; state.player.xp += fish.difficulty * 5; session.phase='CAUGHT';
  return ok(`${fish.name} tertangkap! Ukuran ${size.toFixed(1)} cm.`);
}

export function resetFishing(state:GameState):ActionResult { state.fishing.session = {...state.fishing.session,phase:'IDLE',fishId:null,progress:0,tension:30,tick:0}; return ok('Siap melempar kembali.'); }
export function buyRod(state:GameState, rod:RodId):ActionResult { const info=RODS[rod]; if(state.coins<info.price)return fail('Koin tidak cukup.'); if(RODS[state.fishing.rod].power>=info.power)return fail('Joran ini bukan peningkatan.'); state.coins-=info.price; state.fishing.rod=rod; return ok(`${info.name} kini digunakan.`); }
