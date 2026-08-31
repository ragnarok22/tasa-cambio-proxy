import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'vitest';

test('limits province hover transitions to opacity', async () => {
  const source = await readFile(
    new URL('./Province-svg-map.tsx', import.meta.url),
    'utf8'
  );

  assert.doesNotMatch(source, /\btransition-all\b/);
  assert.match(source, /\btransition-opacity\b/);
});
