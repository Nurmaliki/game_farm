import { readFileSync, statSync } from 'node:fs';

const manifest = JSON.parse(
  readFileSync('.svelte-kit/output/client/.vite/manifest.json', 'utf8')
);
const scene = manifest['src/lib/game/farm-scene.ts'];

if (!scene?.isDynamicEntry) {
  throw new Error('Phaser farm scene tidak lagi menjadi dynamic entry.');
}

const chunk = `.svelte-kit/output/client/${scene.file}`;
const bytes = statSync(chunk).size;
const budget = 700_000;

if (bytes > budget) {
  throw new Error(`Chunk Phaser ${bytes} byte melebihi budget ${budget} byte.`);
}

console.log(
  `Performance budget lulus: farm scene lazy-loaded ${bytes} byte / ${budget} byte.`
);
