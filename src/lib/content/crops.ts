export type Season = 'semi' | 'panas' | 'gugur' | 'hujan';

export interface CropDefinition {
  id: string;
  name: string;
  growthDays: number;
  stages: number;
  seasons: Season[];
  waterRequired: boolean;
  regrowDays: number | null;
  seedPrice: number;
  salePrice: number;
  experience: number;
}

export const CROPS: Record<string, CropDefinition> = {
  rice: { id: 'rice', name: 'Padi', growthDays: 3, stages: 4, seasons: ['hujan', 'semi'], waterRequired: true, regrowDays: null, seedPrice: 10, salePrice: 30, experience: 8 },
  corn: { id: 'corn', name: 'Jagung', growthDays: 5, stages: 4, seasons: ['panas', 'gugur'], waterRequired: true, regrowDays: 2, seedPrice: 20, salePrice: 45, experience: 12 },
  carrot: { id: 'carrot', name: 'Wortel', growthDays: 4, stages: 4, seasons: ['semi', 'gugur'], waterRequired: true, regrowDays: null, seedPrice: 15, salePrice: 38, experience: 10 },
  tomato: { id: 'tomato', name: 'Tomat', growthDays: 6, stages: 4, seasons: ['panas', 'gugur'], waterRequired: true, regrowDays: 3, seedPrice: 25, salePrice: 55, experience: 14 },
  chili: { id: 'chili', name: 'Cabai', growthDays: 7, stages: 4, seasons: ['panas', 'hujan'], waterRequired: true, regrowDays: 3, seedPrice: 28, salePrice: 65, experience: 16 },
  cassava: { id: 'cassava', name: 'Singkong', growthDays: 6, stages: 4, seasons: ['semi', 'panas', 'gugur', 'hujan'], waterRequired: true, regrowDays: null, seedPrice: 18, salePrice: 48, experience: 13 },
  strawberry: { id: 'strawberry', name: 'Stroberi', growthDays: 8, stages: 4, seasons: ['semi'], waterRequired: true, regrowDays: 3, seedPrice: 45, salePrice: 90, experience: 20 },
  watermelon: { id: 'watermelon', name: 'Semangka', growthDays: 9, stages: 4, seasons: ['panas'], waterRequired: true, regrowDays: null, seedPrice: 50, salePrice: 110, experience: 24 }
};
