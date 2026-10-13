export interface BuildingDefinition { id:string; name:string; width:number; height:number; costs:Record<string,number>; requiredLevel:number; }
export const BUILDINGS:Record<string,BuildingDefinition>={
  coop:{id:'coop',name:'Kandang Ayam',width:2,height:2,costs:{bamboo:4,fallen_branch:3},requiredLevel:1}, barn:{id:'barn',name:'Lumbung Ternak',width:3,height:2,costs:{bamboo:6,fallen_branch:5},requiredLevel:1},
  storage:{id:'storage',name:'Gudang',width:2,height:2,costs:{bamboo:3,fallen_branch:4},requiredLevel:1}, workshop:{id:'workshop',name:'Bengkel',width:2,height:2,costs:{bamboo:5,fallen_branch:4},requiredLevel:1},
  processor:{id:'processor',name:'Rumah Produksi',width:2,height:2,costs:{bamboo:4,fallen_branch:5},requiredLevel:1}, well:{id:'well',name:'Sumur',width:1,height:1,costs:{bamboo:2,fallen_branch:2},requiredLevel:1},
  greenhouse:{id:'greenhouse',name:'Rumah Kaca',width:3,height:3,costs:{bamboo:10,wild_flower:4},requiredLevel:2}, fishpond:{id:'fishpond',name:'Kolam Ikan',width:3,height:2,costs:{bamboo:6,fallen_branch:3},requiredLevel:2},
  beehive:{id:'beehive',name:'Sarang Lebah',width:1,height:1,costs:{bamboo:3,wild_flower:2},requiredLevel:1}, fence:{id:'fence',name:'Pagar',width:1,height:1,costs:{fallen_branch:1},requiredLevel:1},
  path:{id:'path',name:'Jalan Setapak',width:1,height:1,costs:{bamboo:1},requiredLevel:1}, decoration:{id:'decoration',name:'Dekorasi',width:1,height:1,costs:{wild_flower:1,bamboo:1},requiredLevel:1}
};
export interface Recipe { id:string; name:string; ingredients:Record<string,number>; output:string; amount:number; days:number; building?:string; stamina?:number; buff?:string; }
export const CRAFT_RECIPES:Record<string,Recipe>={
  cheese:{id:'cheese',name:'Keju',ingredients:{milk:1},output:'cheese',amount:1,days:2,building:'processor'}, mayonnaise:{id:'mayonnaise',name:'Mayones',ingredients:{egg:1},output:'mayonnaise',amount:1,days:1,building:'processor'},
  berry_jam:{id:'berry_jam',name:'Selai Beri',ingredients:{wild_berries:2},output:'berry_jam',amount:1,days:2,building:'processor'}, fabric:{id:'fabric',name:'Kain',ingredients:{wool:1},output:'fabric',amount:1,days:2,building:'workshop'},
  building_material:{id:'building_material',name:'Material Bangunan',ingredients:{bamboo:2,fallen_branch:2},output:'building_material',amount:1,days:1,building:'workshop'}
};
export const COOK_RECIPES:Record<string,Recipe>={
  nasi_goreng:{id:'nasi_goreng',name:'Nasi Goreng',ingredients:{rice:1,egg:1},output:'nasi_goreng',amount:1,days:0,stamina:35,buff:'hemat_stamina'},
  sup_sayur:{id:'sup_sayur',name:'Sup Sayur',ingredients:{carrot:1,mushroom:1},output:'sup_sayur',amount:1,days:0,stamina:30},
  ikan_bakar:{id:'ikan_bakar',name:'Ikan Bakar',ingredients:{fish_lele:1,bamboo:1},output:'ikan_bakar',amount:1,days:0,stamina:45,buff:'fishing_focus'},
  telur_dadar:{id:'telur_dadar',name:'Telur Dadar',ingredients:{egg:2},output:'telur_dadar',amount:1,days:0,stamina:25},
  sate_jamur:{id:'sate_jamur',name:'Sate Jamur',ingredients:{mushroom:2,bamboo:1},output:'sate_jamur',amount:1,days:0,stamina:32},
  jus_buah:{id:'jus_buah',name:'Jus Beri',ingredients:{wild_berries:2},output:'jus_buah',amount:1,days:0,stamina:20},
  roti:{id:'roti',name:'Roti Singkong',ingredients:{cassava:2},output:'roti',amount:1,days:0,stamina:28},
  village_special:{id:'village_special',name:'Hidangan Spesial Desa',ingredients:{rice:1,fish_nila:1,medicinal_plant:1},output:'village_special',amount:1,days:0,stamina:60,buff:'village_spirit'}
};
