import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const source = join(process.cwd(), 'apps', 'api', 'src', 'docs', 'openapi.json');
const target = join(process.cwd(), 'apps', 'api', 'dist', 'src', 'docs', 'openapi.json');

const dir = dirname(target);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

copyFileSync(source, target);
console.log(`Copied openapi.json -> ${target}`);