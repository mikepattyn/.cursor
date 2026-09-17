import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('calculator contract fixtures', () => {
  it('empty GET fixture has a null value', () => {
    const fixture = JSON.parse(readFileSync(join(root, 'fixtures/get-value-empty.json'), 'utf8'));
    assert.equal(fixture.value, null);
    assert.equal(fixture.updatedAt, null);
  });

  it('PUT fixture carries a number', () => {
    const fixture = JSON.parse(readFileSync(join(root, 'fixtures/put-value.json'), 'utf8'));
    assert.equal(typeof fixture.value, 'number');
  });

  it('OpenAPI document names the persist path', () => {
    const spec = readFileSync(join(root, 'openapi.yaml'), 'utf8');
    assert.match(spec, /\/value:/);
    assert.match(spec, /operationId: getValue/);
  });
});
