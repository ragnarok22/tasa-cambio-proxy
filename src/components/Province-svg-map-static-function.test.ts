import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'vitest';

test('declares getProvinceColor at module scope', async () => {
  const source = await readFile(
    new URL('./Province-svg-map.tsx', import.meta.url),
    'utf8'
  );
  const helperDeclaration = source.indexOf('const getProvinceColor =');
  const componentDeclaration = source.indexOf(
    'export default function ProvinceSVGMap'
  );

  assert.notEqual(helperDeclaration, -1);
  assert.notEqual(componentDeclaration, -1);
  assert.ok(helperDeclaration < componentDeclaration);
});
