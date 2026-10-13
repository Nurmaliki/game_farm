import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const phaserFlags: Record<string, boolean> = {
  CANVAS_RENDERER: true,
  WEBGL_RENDERER: false,
  WEBGL_DEBUG: false,
  FEATURE_SOUND: false,
  PLUGIN_CAMERA3D: false,
  PLUGIN_FBINSTANT: false
};

export default defineConfig({
  define: { global: 'globalThis' },
  resolve: {
    alias: {
      phaser3spectorjs: new URL('./src/lib/game/phaser3spector-shim.ts', import.meta.url).pathname
    }
  },
  plugins: [
    {
      name: 'phaser-feature-flags',
      enforce: 'pre',
      transform(code, id) {
        if (!id.includes('/phaser/src/')) return;
        let transformed = code;
        for (const [flag, enabled] of Object.entries(phaserFlags)) {
          transformed = transformed.replaceAll(`typeof ${flag}`, String(enabled));
        }
        return transformed;
      }
    },
    sveltekit()
  ]
});
