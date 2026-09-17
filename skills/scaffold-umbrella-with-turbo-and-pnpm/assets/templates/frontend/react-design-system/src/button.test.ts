import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Button } from './Button.tsx';

describe('Button', () => {
  it('exports a function component', () => {
    assert.equal(typeof Button, 'function');
  });
});
