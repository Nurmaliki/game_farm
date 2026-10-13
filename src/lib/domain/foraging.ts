import { FORAGE } from '../content/forage';
import type { GameState } from './state';
import type { ActionResult } from './gameplay';

const hash=(text:string)=>[...text].reduce((value,char)=>(value*33+char.charCodeAt(0))>>>0,5381);
export function generateForage(state:GameState):ActionResult {
  if(state.forageSpawns.some((spawn)=>!spawn.collected)) return {ok:false,message:'Masih ada hasil hutan yang belum dikumpulkan.'};
  const pool=Object.values(FORAGE).filter((item)=>item.seasons.includes(state.season)&&item.weather.includes(state.weather));
  state.forageSpawns=Array.from({length:Math.min(5,pool.length)},(_,index)=>{ const weighted=pool.filter((item)=>hash(`${state.day}-${index}-${item.id}`)%item.rarity===0); const source=weighted.length?weighted:pool; const item=source[hash(`${state.day}-${index}`)%source.length]; return {id:`${state.day}-${index}`,itemId:item.id,collected:false}; });
  return {ok:true,message:`${state.forageSpawns.length} sumber daya muncul di hutan.`};
}
export function collectForage(state:GameState,id:string):ActionResult { const spawn=state.forageSpawns.find((entry)=>entry.id===id); if(!spawn||spawn.collected)return {ok:false,message:'Sumber daya sudah diambil.'}; if(state.player.stamina<1)return {ok:false,message:'Stamina tidak cukup.'}; spawn.collected=true; state.player.stamina-=1; state.inventory[spawn.itemId]=(state.inventory[spawn.itemId]??0)+1; state.forageRecords[spawn.itemId]=(state.forageRecords[spawn.itemId]??0)+1; return {ok:true,message:`${FORAGE[spawn.itemId].name} dikumpulkan.`}; }
