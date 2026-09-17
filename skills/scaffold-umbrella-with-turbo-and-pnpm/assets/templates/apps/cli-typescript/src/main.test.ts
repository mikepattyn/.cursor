import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseArgv } from '@umbrella/cli';
import { Calculator } from '@umbrella/example-calculator';

describe('examplectl', () => {
  it('parses add 2 3', () => {
    const parsed = parseArgv(['node', 'examplectl', 'add', '2', '3']);
    assert.equal(parsed.command, 'add');
    assert.equal(new Calculator().add(Number(parsed.args[0]), Number(parsed.args[1])), 5);
  });
});
