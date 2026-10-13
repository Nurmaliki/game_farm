export type AnimalKind = 'chicken' | 'cow' | 'goat' | 'sheep';
export type AnimalAiState = 'IDLE' | 'WANDER' | 'EAT' | 'REST' | 'PRODUCE';
export interface AnimalDefinition { id: AnimalKind; name: string; productId: string; productName: string; buyPrice: number; productPrice: number; housing: 'coop' | 'barn'; color: number; }
export const ANIMALS: Record<AnimalKind, AnimalDefinition> = {
  chicken: { id: 'chicken', name: 'Ayam', productId: 'egg', productName: 'Telur', buyPrice: 120, productPrice: 24, housing: 'coop', color: 0xf4f0d0 },
  cow: { id: 'cow', name: 'Sapi', productId: 'milk', productName: 'Susu', buyPrice: 650, productPrice: 95, housing: 'barn', color: 0xe8dfc5 },
  goat: { id: 'goat', name: 'Kambing', productId: 'goat_milk', productName: 'Susu Kambing', buyPrice: 480, productPrice: 78, housing: 'barn', color: 0xc9b79c },
  sheep: { id: 'sheep', name: 'Domba', productId: 'wool', productName: 'Wol', buyPrice: 550, productPrice: 110, housing: 'barn', color: 0xf3eadb }
};
