import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Calculator } from './calculator.ts';

describe('Calculator', () => {
  const calculator = new Calculator();

  it('adds two numbers', () => {
    assert.equal(calculator.add(2, 3), 5);
  });

  it('subtracts two numbers', () => {
    assert.equal(calculator.subtract(5, 3), 2);
  });

  it('multiplies two numbers', () => {
    assert.equal(calculator.multiply(4, 3), 12);
  });

  it('divides two numbers', () => {
    assert.equal(calculator.divide(10, 2), 5);
  });

  it('throws when dividing by zero', () => {
    assert.throws(() => calculator.divide(10, 0), {
      name: 'RangeError',
      message: 'Cannot divide by zero',
    });
  });
});
