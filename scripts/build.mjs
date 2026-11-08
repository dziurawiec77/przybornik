import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { join, relative, sep } from 'node:path';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
await cp('public', 'dist', { recursive: true });

for (const file of await readdir('src')) {
  if (file.endsWith('.ts')) {
    const source = await readFile('src/' + file, 'utf8');
    const code = stripTypeScriptTypes(source, { mode: 'strip' })
      .replace(/from '(\.\/.+?)\.ts'/g, "from '$1.js'");
    await writeFile('dist/src/' + file.replace(/\.ts$/, '.js'), code);
  } else {
    await cp('src/' + file, 'dist/src/' + file);
  }
}

const html = await readFile('index.html', 'utf8');
await writeFile('dist/index.html', html.replace('./src/main.ts', './src/main.js'));

const entries = await readdir('dist', { recursive: true, withFileTypes: true });
const files = entries.filter(entry => entry.isFile())
  .map(entry => relative('dist', join(entry.parentPath, entry.name)).split(sep).join('/')).sort();
const template = await readFile('scripts/sw-template.js', 'utf8');
const hash = createHash('sha256').update(template);
for (const file of files) {
  hash.update(file + '\0');
  hash.update(await readFile(join('dist', file)));
}
const version = hash.digest('hex').slice(0, 16);
const assets = files.map(file => file === 'index.html' ? './' : './' + file);
await writeFile('dist/sw.js', template
  .replace('__VERSION__', version)
  .replace('__ASSETS__', JSON.stringify(assets)));

console.log('Gotowe: dist/ — wersja ' + version);
