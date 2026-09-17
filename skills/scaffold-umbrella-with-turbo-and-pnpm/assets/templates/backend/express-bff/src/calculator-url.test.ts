import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculatorValueUrl } from './calculator-url.ts';

describe('calculatorValueUrl', () => {
  it('appends /value', () => {
    assert.equal(calculatorValueUrl('http://localhost:8081'), 'http://localhost:8081/value');
  });

  it('strips a trailing slash on the base', () => {
    assert.equal(calculatorValueUrl('http://example-calculator:8081/'), 'http://example-calculator:8081/value');
  });
});
