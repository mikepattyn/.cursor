#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = process.cwd();
const manifestPath = resolve(root, 'scaffold.manifest.yaml');

const DEFAULTS = {
  check: 'pnpm exec turbo run build test lint typecheck format:check',
  test: 'pnpm exec turbo run test',
  dev: 'pnpm --filter @umbrella/example-app dev',
  'dev:web': 'pnpm --filter @umbrella/example-app dev',
  'dev:full': 'docker compose -f docker/docker-compose.yml up --build',
};

function parseManifest(text) {
  const commands = { ...DEFAULTS };
  const native = {};
  let section = null;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\s+#.*$/, '');
    if (!line.trim()) {
      continue;
    }
    if (!/^\s/.test(line) && line.trimEnd().endsWith(':')) {
      section = line.trim().slice(0, -1);
      continue;
    }
    const match = line.match(/^\s+([^:]+):\s*(.*)$/);
    if (!match) {
      continue;
    }
    const key = match[1].trim();
    const value = match[2].trim().replace(/^['"]|['"]$/g, '');
    if (section === 'commands') {
      commands[key] = value;
    } else if (section === 'native') {
      native[key] = value;
    }
  }
  return { commands, native };
}

function loadManifest() {
  if (!existsSync(manifestPath)) {
    return { commands: DEFAULTS, native: {} };
  }
  return parseManifest(readFileSync(manifestPath, 'utf8'));
}

function runShell(command) {
  const result = spawnSync(command, { stdio: 'inherit', shell: true, cwd: root });
  process.exit(result.status ?? 1);
}

function printUsage() {
  process.stderr.write('usage: node scripts/repo.mjs <check|test|dev|dev:web|dev:full|ci-matrix|native <name>>\n');
}

const [verb, nativeName] = process.argv.slice(2);
const { commands, native } = loadManifest();

if (verb === 'ci-matrix') {
  const entries = Object.entries(native).map(([name, run]) => ({ name, run }));
  const has = entries.length > 0;
  const matrix = JSON.stringify(entries);
  process.stdout.write(`has_native=${has}\nmatrix=${matrix}\n`);
  if (process.env.GITHUB_OUTPUT) {
    const { appendFileSync } = await import('node:fs');
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `has_native=${has}\nmatrix<<EOF\n${matrix}\nEOF\n`,
    );
  }
  process.exit(0);
}

if (verb === 'native') {
  if (!nativeName || !native[nativeName]) {
    process.stderr.write(`unknown native task ${nativeName ?? ''}\n`);
    process.exit(1);
  }
  runShell(native[nativeName]);
}

if (!verb || !(verb in commands)) {
  printUsage();
  process.exit(1);
}

runShell(commands[verb]);
