import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'vitest';

test('uses the same canonical and Open Graph URL', async () => {
  const source = await readFile(
    new URL('./layout.tsx', import.meta.url),
    'utf8'
  );
  const canonicalUrl = source.match(
    /alternates:\s*{\s*canonical:\s*'([^']+)'/
  )?.[1];
  const openGraphUrl = source.match(
    /openGraph:\s*{[\s\S]*?\n\s*url:\s*'([^']+)'/
  )?.[1];

  assert.ok(canonicalUrl);
  assert.ok(openGraphUrl);
  assert.equal(openGraphUrl, canonicalUrl);
});
