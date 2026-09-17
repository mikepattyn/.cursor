import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseArgv, runCommand } from './index.ts';

describe('parseArgv', () => {
  it('parses command, args, and flags without commander', () => {
    const parsed = parseArgv(['node', 'cli', 'add', '2', '3', '--format', 'json', '--pretty']);
    assert.deepEqual(parsed, {
      command: 'add',
      args: ['2', '3'],
      flags: { format: 'json', pretty: true },
    });
  });
});

describe('runCommand', () => {
  it('dispatches to the named handler', async () => {
    const code = await runCommand(parseArgv(['node', 'cli', 'ping']), {
      ping: () => 0,
      help: () => 2,
    });
    assert.equal(code, 0);
  });
});
