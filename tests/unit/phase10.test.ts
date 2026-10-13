import { describe, expect, it } from 'vitest';
import { createInitialState } from '../../src/lib/domain/state';
import { exportSave, importSave } from '../../src/lib/persistence/database';
import worker from '../../static/sw.js?raw';
import deployment from '../../vercel.json';

describe('phase 10 production hardening', () => {
  it('round-trips an exported save through schema validation', () => {
    const state = createInitialState();
    state.coins = 987;
    expect(importSave(exportSave(state)).coins).toBe(987);
  });

  it('rejects malformed and oversized save imports', () => {
    expect(() => importSave('{"version":8}')).toThrow();
    expect(() => importSave('x'.repeat(1_000_001))).toThrow('1 MB');
  });

  it('uses a versioned offline cache with navigation fallback', () => {
    expect(worker).toContain("const VERSION = 'nusantara-farm-v4'");
    expect(worker).toContain("caches.match('/')");
    expect(worker).toContain('self.clients.claim()');
  });

  it('configures baseline production security headers', () => {
    const headers = Object.fromEntries(
      deployment.headers.flatMap((rule) => rule.headers).map(({ key, value }) => [key, value])
    );
    expect(headers['Content-Security-Policy']).toContain("script-src 'self' 'unsafe-inline'");
    expect(headers['Content-Security-Policy']).toContain("object-src 'none'");
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['Permissions-Policy']).toContain('camera=()');
  });
});
