import type {Season} from './crops';
export const FRUIT_TREES={mango:{name:'Mangga',growDays:8,seasons:['panas'] as Season[],price:75},banana:{name:'Pisang',growDays:6,seasons:['panas','hujan'] as Season[],price:45},coconut:{name:'Kelapa',growDays:10,seasons:['panas','gugur'] as Season[],price:65},orange:{name:'Jeruk',growDays:8,seasons:['gugur'] as Season[],price:70},guava:{name:'Jambu',growDays:7,seasons:['semi','hujan'] as Season[],price:55}} as const;
export type FruitTreeId=keyof typeof FRUIT_TREES;
