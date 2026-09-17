import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { tokens } from './tokens.ts';

describe('design tokens', () => {
  it('keeps CSS custom properties aligned with tokens.json', () => {
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'tokens.css'), 'utf8');
    assert.equal(tokens.color.accent, '#3d8bfd');
    assert.match(css, /--color-accent:\s*#3d8bfd/);
  });
});
