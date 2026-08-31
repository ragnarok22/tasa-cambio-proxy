import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('uses the default Node.js runtime for the Open Graph image', async () => {
  const source = await readFile(
    new URL('./opengraph-image.tsx', import.meta.url),
    'utf8'
  );

  assert.doesNotMatch(source, /export\s+const\s+runtime\s*=\s*['"]edge['"]/);
});
