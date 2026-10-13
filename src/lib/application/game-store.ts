import { writable } from 'svelte/store';
import { createInitialState, type GameState, type Tool } from '$lib/domain/state';
import { useTool, nextDay, buyItem, sellItem, buyAnimal, careForAnimal, upgrade, type ActionResult } from '$lib/domain/gameplay';
import type { AnimalKind } from '$lib/content/animals';
import type { FishingLocation, RodId } from '$lib/content/fish';
import { beginFishing, advanceFishing, moveCatchZone, resolveTick, resetFishing, buyRod } from '$lib/domain/fishing';
import { generateForage, collectForage } from '$lib/domain/foraging';
import { placeBuilding, relocateBuilding, upgradeBuilding, queueCraft, collectCraft, cook, eatFood } from '$lib/domain/production';
import {unlockArea,travel,mineNode,upgradePickaxe} from '$lib/domain/exploration'; import type {AreaId} from '$lib/content/exploration';
import {plantTree,buySapling,harvestTree,buyHive,processAdvancedDay,collectHoney,buildPond,stockPond,feedPond,harvestPond} from '$lib/domain/advanced-farm';import type{FruitTreeId}from'$lib/content/advanced-farm';
import{talkToNpc,acceptQuest,claimQuest,donateMuseum,attendFestival,resetVillageDay}from'$lib/domain/village';import type{NpcId}from'$lib/content/village';
import{adoptPet,interactPet,toggleMount,spawnInsects,catchInsect,buyFurniture,checkAchievements,resetPersonalizationDay,togglePhotoMode}from'$lib/domain/personalization';import type{FURNITURE}from'$lib/content/personalization';

let current = createInitialState();
export const gameState = writable<GameState>(current);
export const selectedTool = writable<Tool>('hoe');
export const selectedCrop = writable('rice');
export const notice = writable('Selamat datang di kebun keluarga.');
let crop = 'rice';
selectedCrop.subscribe((value) => { crop = value; });

function commit(result: ActionResult): ActionResult {
  gameState.set(current);
  notice.set(result.message);
  return result;
}

export const gameCommands = {
  replace(state: GameState) { current = structuredClone(state); gameState.set(current); },
  snapshot() { return structuredClone(current); },
  move(x: number, y: number) { current.player.x = x; current.player.y = y; gameState.set(current); },
  toolAt(index: number, tool: Tool) { return commit(useTool(current, current.plots[index], tool, crop)); },
  sleep() { const result = nextDay(current); generateForage(current); processAdvancedDay(current); resetVillageDay(current); resetPersonalizationDay(current); return commit(result); },
  buy(item: string, amount = 1) { return commit(buyItem(current, item, amount)); },
  sell(item: string) { return commit(sellItem(current, item)); },
  buyAnimal(kind: AnimalKind) { return commit(buyAnimal(current, kind)); },
  animal(id: string, action: 'feed' | 'pet' | 'clean' | 'collect') { return commit(careForAnimal(current, id, action)); },
  upgrade(target: keyof GameState['upgrades']) { return commit(upgrade(current, target)); },
  startFishing(location: FishingLocation) { return commit(beginFishing(current, location)); },
  advanceFishing() { return commit(advanceFishing(current)); },
  moveFishing(direction: -1|1) { return commit(moveCatchZone(current, direction)); },
  fishingTick() { return commit(resolveTick(current)); },
  resetFishing() { return commit(resetFishing(current)); },
  buyRod(rod: RodId) { return commit(buyRod(current, rod)); },
  generateForage() { return commit(generateForage(current)); },
  collectForage(id: string) { return commit(collectForage(current, id)); }
  ,placeBuilding(type:string,x:number,y:number){return commit(placeBuilding(current,type,x,y));}
  ,relocateBuilding(id:string,x:number,y:number){return commit(relocateBuilding(current,id,x,y));}
  ,upgradeBuilding(id:string){return commit(upgradeBuilding(current,id));}
  ,craft(recipeId:string){return commit(queueCraft(current,recipeId));}
  ,collectCraft(id:string){return commit(collectCraft(current,id));}
  ,cook(recipeId:string){return commit(cook(current,recipeId));}
  ,eat(recipeId:string){return commit(eatFood(current,recipeId));}
  ,unlockArea(area:AreaId){return commit(unlockArea(current,area));}
  ,travel(area:AreaId){return commit(travel(current,area));}
  ,mine(id:string){return commit(mineNode(current,id));}
  ,upgradePickaxe(){return commit(upgradePickaxe(current));}
  ,buySapling(type:FruitTreeId){return commit(buySapling(current,type));}
  ,plantTree(type:FruitTreeId){return commit(plantTree(current,type));}
  ,harvestTree(id:string){return commit(harvestTree(current,id));}
  ,buyHive(){return commit(buyHive(current));}
  ,collectHoney(){return commit(collectHoney(current));}
  ,buildPond(){return commit(buildPond(current));}
  ,stockPond(fishId:string){return commit(stockPond(current,fishId));}
  ,feedPond(){return commit(feedPond(current));}
  ,harvestPond(){return commit(harvestPond(current));}
  ,talk(id:NpcId){return commit(talkToNpc(current,id));}
  ,acceptQuest(id:string){return commit(acceptQuest(current,id));}
  ,claimQuest(id:string){return commit(claimQuest(current,id));}
  ,donate(item:string){return commit(donateMuseum(current,item));}
  ,festival(id:string){return commit(attendFestival(current,id));}
  ,adopt(type:'cat'|'dog'|'horse'){return commit(adoptPet(current,type));}
  ,pet(type:'cat'|'dog'|'horse'){return commit(interactPet(current,type));}
  ,mount(){return commit(toggleMount(current));}
  ,spawnInsects(){return commit(spawnInsects(current));}
  ,catchInsect(id:string){return commit(catchInsect(current,id));}
  ,buyFurniture(type:keyof typeof FURNITURE,x:number,y:number){return commit(buyFurniture(current,type,x,y));}
  ,achievements(){return commit(checkAchievements(current));}
  ,photoMode(){return commit(togglePhotoMode(current));}
};
