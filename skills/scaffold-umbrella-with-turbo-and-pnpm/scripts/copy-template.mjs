#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SKIP = new Set(['bin', 'obj', 'target', 'node_modules', 'dist', '__pycache__', '.venv', '.turbo']);

function copyTree(from, to) {
  if (!existsSync(from)) {
    throw new Error(`template not found: ${from}`);
  }
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    if (SKIP.has(entry) || entry === '.DS_Store') {
      continue;
    }
    const source = join(from, entry);
    const dest = join(to, entry);
    if (statSync(source).isDirectory()) {
      copyTree(source, dest);
    } else {
      cpSync(source, dest);
    }
  }
}

const [, , from, to] = process.argv;
if (!from || !to) {
  console.error('usage: copy-template.mjs <from> <to>');
  process.exit(1);
}
copyTree(from, to);
console.log(`copied ${from} -> ${to}`);
