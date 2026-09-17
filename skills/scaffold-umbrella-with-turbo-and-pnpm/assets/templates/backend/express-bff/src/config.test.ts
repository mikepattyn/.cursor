import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { loadConfig } from './config.ts';

describe('loadConfig', () => {
  it('loads defaults', () => {
    const config = loadConfig({ PORT: '3000' });
    assert.equal(config.port, 3000);
    assert.equal(config.calculatorUrl, 'http://localhost:8081');
  });

  it('rejects an invalid PORT', () => {
    assert.throws(() => loadConfig({ PORT: 'nope' }), /PORT must be an integer/);
  });
});
