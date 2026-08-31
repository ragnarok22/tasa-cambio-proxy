import assert from 'node:assert/strict';
import test from 'node:test';

import { serializeJsonForHtml } from './serialize-json-for-html';

test('serializes JSON without HTML breakout characters', () => {
  const value = {
    content: '</script><img src=x onerror=alert(1)>&',
  };

  const serialized = serializeJsonForHtml(value);

  assert.doesNotMatch(serialized, /[<>&]/);
  assert.deepEqual(JSON.parse(serialized), value);
});
