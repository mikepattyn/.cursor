import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Calculator } from '@umbrella/example-calculator';

describe('ExampleCalculator domain seam', () => {
  it('uses the shared Calculator for divide-by-zero', () => {
    assert.throws(() => new Calculator().divide(1, 0), /Cannot divide by zero/);
  });
});
