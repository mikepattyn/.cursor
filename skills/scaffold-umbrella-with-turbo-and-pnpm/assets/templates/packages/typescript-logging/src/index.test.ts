import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createLogger } from './index.ts';

describe('createLogger', () => {
  it('writes one JSON line to stdout-shaped writer', () => {
    const lines: string[] = [];
    const logger = createLogger('info', (line) => lines.push(line));
    logger.info('hello', { requestId: 'r1' });
    assert.equal(lines.length, 1);
    const parsed = JSON.parse(lines[0]) as { level: string; message: string; requestId: string };
    assert.equal(parsed.level, 'info');
    assert.equal(parsed.message, 'hello');
    assert.equal(parsed.requestId, 'r1');
  });

  it('stays silent at silent level for info', () => {
    const lines: string[] = [];
    createLogger('silent', (line) => lines.push(line)).info('nope');
    assert.equal(lines.length, 0);
  });
});
