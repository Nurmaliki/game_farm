import type { Season } from './crops';
export interface ForageDefinition { id:string; name:string; seasons:Season[]; weather:Array<'cerah'|'berawan'|'hujan'|'badai'>; rarity:number; salePrice:number; }
export const FORAGE: Record<string, ForageDefinition> = {
  wild_berries:{id:'wild_berries',name:'Beri Liar',seasons:['semi','panas'],weather:['cerah','berawan'],rarity:1,salePrice:18},
  mushroom:{id:'mushroom',name:'Jamur Hutan',seasons:['gugur','hujan'],weather:['berawan','hujan'],rarity:1,salePrice:22},
  bamboo:{id:'bamboo',name:'Bambu',seasons:['semi','panas','gugur','hujan'],weather:['cerah','berawan','hujan'],rarity:1,salePrice:16},
  medicinal_plant:{id:'medicinal_plant',name:'Tanaman Obat',seasons:['semi','hujan'],weather:['berawan','hujan'],rarity:2,salePrice:42},
  wild_flower:{id:'wild_flower',name:'Bunga Liar',seasons:['semi','panas'],weather:['cerah'],rarity:1,salePrice:20},
  fallen_branch:{id:'fallen_branch',name:'Ranting Jatuh',seasons:['semi','panas','gugur','hujan'],weather:['cerah','berawan','hujan','badai'],rarity:1,salePrice:8},
  rare_herb:{id:'rare_herb',name:'Herba Langka',seasons:['hujan'],weather:['hujan','badai'],rarity:4,salePrice:130}
};
