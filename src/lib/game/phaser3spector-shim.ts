// Phaser references its optional WebGL inspector during dependency discovery.
// Nusantara Farm ships the Canvas renderer, so the inspector is intentionally absent.
export default class PhaserSpectorShim {}
