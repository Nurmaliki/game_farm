import { expect, test } from '@playwright/test';

test('production build starts online and from the offline cache', async ({ context, page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /NUSANTARA FARM/i })).toBeVisible();
  await page.getByRole('button', { name: 'Mulai Petualangan' }).click();
  await expect(page.getByText('PANDUAN HARI INI')).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('.game-shell canvas')).toBeVisible({ timeout: 20_000 });

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /NUSANTARA FARM/i })).toBeVisible();

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: /NUSANTARA FARM/i })).toBeVisible();
});

test('release metadata is available', async ({ request }) => {
  const manifest = await request.get('/manifest.webmanifest');
  expect(manifest.ok()).toBe(true);
  const body = (await manifest.json()) as { name: string; icons: unknown[] };
  expect(body.name).toBe('Nusantara Farm');
  expect(body.icons.length).toBeGreaterThan(0);
});

test('farm scene maintains an interactive frame rate', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'FPS gate is calibrated for Chromium headless.');
  await page.goto('/play');
  await expect(page.locator('.game-shell canvas')).toBeVisible({ timeout: 20_000 });
  const fps = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let frames = 0;
        const start = performance.now();
        const sample = (now: number) => {
          frames += 1;
          if (now - start >= 1_000) resolve((frames * 1_000) / (now - start));
          else requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      })
  );
  expect(fps).toBeGreaterThanOrEqual(30);
});
