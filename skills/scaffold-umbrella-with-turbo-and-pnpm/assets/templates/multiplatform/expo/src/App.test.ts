import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Calculator } from '@umbrella/example-calculator';

describe('expo calculator screen seam', () => {
  it('delegates arithmetic to the shared Calculator', () => {
    assert.equal(new Calculator().add(2, 3), 5);
  });
});
