import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'vitest';

test('keeps rate utilities server-only without exposing Server Actions', async () => {
  const source = await readFile(
    new URL('./actions.ts', import.meta.url),
    'utf8'
  );

  assert.doesNotMatch(source, /^['"]use server['"];$/m);
  assert.match(source, /^import ['"]server-only['"];$/m);
});
