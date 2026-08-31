import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('declares jsonLd at module scope', async () => {
  const source = await readFile(new URL('./page.tsx', import.meta.url), 'utf8');
  const jsonLdDeclaration = source.indexOf('const jsonLd = {');
  const homeComponent = source.indexOf('export default async function Home()');

  assert.notEqual(jsonLdDeclaration, -1);
  assert.notEqual(homeComponent, -1);
  assert.ok(jsonLdDeclaration < homeComponent);
});
