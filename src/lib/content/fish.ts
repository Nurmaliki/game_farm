import type { Season } from './crops';

export type FishingLocation = 'river' | 'lake' | 'forest_pond' | 'beach' | 'farm_pond';
export interface FishDefinition { id: string; name: string; locations: FishingLocation[]; seasons: Season[]; weather: Array<'cerah'|'berawan'|'hujan'|'badai'>; startHour: number; endHour: number; difficulty: number; rarity: 'common'|'uncommon'|'rare'|'legendary'; salePrice: number; }
export const FISH: Record<string, FishDefinition> = {
  lele: { id:'lele', name:'Lele', locations:['river','farm_pond'], seasons:['semi','panas','gugur','hujan'], weather:['cerah','berawan','hujan'], startHour:6,endHour:24,difficulty:1,rarity:'common',salePrice:32 },
  nila: { id:'nila', name:'Nila', locations:['lake','farm_pond'], seasons:['semi','panas','hujan'], weather:['cerah','berawan'], startHour:6,endHour:18,difficulty:1,rarity:'common',salePrice:36 },
  gurame: { id:'gurame', name:'Gurame', locations:['lake','forest_pond'], seasons:['semi','panas'], weather:['cerah','berawan'], startHour:8,endHour:20,difficulty:2,rarity:'uncommon',salePrice:58 },
  patin: { id:'patin', name:'Patin', locations:['river','lake'], seasons:['gugur','hujan'], weather:['berawan','hujan'], startHour:16,endHour:26,difficulty:2,rarity:'uncommon',salePrice:62 },
  mujair: { id:'mujair', name:'Mujair', locations:['river','lake','farm_pond'], seasons:['semi','panas','gugur'], weather:['cerah','berawan'], startHour:6,endHour:18,difficulty:1,rarity:'common',salePrice:34 },
  gabus: { id:'gabus', name:'Gabus', locations:['forest_pond','river'], seasons:['gugur','hujan'], weather:['hujan','badai'], startHour:18,endHour:26,difficulty:3,rarity:'rare',salePrice:105 },
  ikan_mas: { id:'ikan_mas', name:'Ikan Mas', locations:['lake','farm_pond'], seasons:['semi','gugur'], weather:['cerah','berawan'], startHour:6,endHour:16,difficulty:2,rarity:'uncommon',salePrice:70 },
  bandeng: { id:'bandeng', name:'Bandeng', locations:['beach'], seasons:['panas','gugur'], weather:['cerah','berawan'], startHour:6,endHour:18,difficulty:2,rarity:'uncommon',salePrice:76 },
  kakap: { id:'kakap', name:'Kakap', locations:['beach'], seasons:['semi','panas','gugur'], weather:['cerah','berawan'], startHour:12,endHour:22,difficulty:3,rarity:'rare',salePrice:125 },
  tuna: { id:'tuna', name:'Tuna', locations:['beach'], seasons:['panas'], weather:['cerah'], startHour:6,endHour:16,difficulty:4,rarity:'rare',salePrice:180 },
  arwana: { id:'arwana', name:'Arwana', locations:['forest_pond'], seasons:['hujan'], weather:['hujan'], startHour:18,endHour:26,difficulty:4,rarity:'rare',salePrice:240 },
  naga_pelangi: { id:'naga_pelangi', name:'Naga Pelangi', locations:['forest_pond'], seasons:['semi'], weather:['badai'], startHour:22,endHour:26,difficulty:5,rarity:'legendary',salePrice:850 }
};
export const RODS = { bamboo: { name:'Joran Bambu', power:0, price:0 }, basic: { name:'Joran Dasar', power:1, price:250 }, reinforced: { name:'Joran Diperkuat', power:2, price:600 }, advanced: { name:'Joran Mahir', power:3, price:1200 } } as const;
export type RodId = keyof typeof RODS;
