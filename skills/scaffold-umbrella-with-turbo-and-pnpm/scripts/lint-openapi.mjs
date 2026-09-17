#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('usage: lint-openapi.mjs <openapi.yaml>');
  process.exit(1);
}
const spec = readFileSync(path, 'utf8');
for (const required of ['openapi:', 'paths:', '/value:', '/healthz:', 'operationId: getValue']) {
  if (!spec.includes(required)) {
    console.error(`missing ${required} in ${path}`);
    process.exit(1);
  }
}
if (spec.includes('__UNRESOLVED_')) {
  console.error(`unresolved token in ${path}`);
  process.exit(1);
}
console.log(`ok ${path}`);
