#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillRoot = dirname(fileURLToPath(new URL('../SKILL.md', import.meta.url)));
const catalogPath = join(skillRoot, 'assets/catalog/templates.yaml');
const schemaPath = join(skillRoot, 'assets/catalog/schema.json');
const target = process.argv[2] ? process.argv[2] : null;
const errors = [];

function fail(message) {
  errors.push(message);
}

function walk(dir, visit) {
  if (!existsSync(dir)) {
    return;
  }
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'bin', 'obj', 'target'].includes(entry)) {
        continue;
      }
      walk(path, visit);
    } else {
      visit(path);
    }
  }
}

if (!existsSync(catalogPath)) {
  fail(`missing catalog ${catalogPath}`);
} else {
  const catalog = readFileSync(catalogPath, 'utf8');
  if (!catalog.includes('templates:') || !catalog.includes('id: angular-app') || !catalog.includes('id: dotnet-api')) {
    fail('catalog must list angular-app and dotnet-api');
  }
  if (catalog.includes('react-app') || catalog.includes('express-bff') || catalog.includes('rust-api')) {
    fail('catalog still lists unused stacks');
  }
  if (catalog.includes('@latest') || catalog.includes('vite@latest')) {
    fail('catalog must not use unpinned latest generators');
  }
  for (const match of catalog.matchAll(/source:\s+(\S+)/g)) {
    const source = match[1];
    if (!existsSync(join(skillRoot, source))) {
      fail(`catalog source missing: ${source}`);
    }
  }
}
if (!existsSync(schemaPath)) {
  fail(`missing schema ${schemaPath}`);
}

const requiredSkillFiles = [
  'assets/contracts/calculator/openapi.yaml',
  'assets/templates/frontend/angular-app-overlay/app.ts',
  'assets/templates/frontend/angular-app-overlay/proxy.conf.cjs',
  'assets/templates/frontend/angular-ui/src/example-calculator.component.ts',
  'assets/templates/backend/dotnet-api/src/ExampleApi/Program.cs',
  'assets/templates/packages/typescript-calculator-client/src/index.ts',
  'scripts/copy-template.mjs',
];
for (const file of requiredSkillFiles) {
  if (!existsSync(join(skillRoot, file))) {
    fail(`missing skill asset ${file}`);
  }
}

walk(join(skillRoot, 'assets/templates'), (path) => {
  if (path.includes(`${join('bin', '')}`) || path.includes(`${join('obj', '')}`)) {
    fail(`forbidden artifact ${relative(skillRoot, path)}`);
  }
  const text = readFileSync(path, 'utf8');
  if (text.includes('AKIA') && path.endsWith('Constants.Deployment.ts.example')) {
    fail(`access key material in ${relative(skillRoot, path)}`);
  }
});

if (target) {
  const manifest = join(target, 'scaffold.manifest.yaml');
  if (!existsSync(manifest)) {
    fail(`missing ${manifest}`);
  } else {
    const yaml = readFileSync(manifest, 'utf8');
    if (yaml.includes('__')) {
      fail('scaffold.manifest.yaml still has unresolved tokens');
    }
    if (!yaml.includes('angular-app') || !yaml.includes('dotnet-api')) {
      fail('manifest must select angular-app and dotnet-api');
    }
  }
  for (const forbidden of ['accessKey', 'accessKeyId']) {
    walk(join(target, 'infra'), (path) => {
      const text = readFileSync(path, 'utf8');
      if (text.includes(forbidden)) {
        fail(`${relative(target, path)} still mentions ${forbidden}`);
      }
    });
  }
  const compose = join(target, 'docker/docker-compose.yml');
  if (existsSync(compose)) {
    const text = readFileSync(compose, 'utf8');
    if (!text.includes('healthcheck:')) {
      fail('compose is missing healthcheck');
    }
    if (text.includes('__BFF_') || text.includes('__FRAMEWORK__') || text.includes('__MS_')) {
      fail('compose still has placeholders');
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`error: ${error}`);
  }
  process.exit(1);
}
console.log(target ? `scaffold ok: ${target}` : `skill assets ok: ${skillRoot}`);
