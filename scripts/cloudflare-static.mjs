import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';

const dist = resolve('dist');
const destination = process.argv[2];
if (!destination || resolve(destination).startsWith(dist + sep) || resolve(destination) === dist) {
  throw Error('Podaj ścieżkę do pliku Worker poza katalogiem dist.');
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
};
const entries = await readdir(dist, { recursive: true, withFileTypes: true });
const files = entries.filter(entry => entry.isFile())
  .map(entry => join(entry.parentPath, entry.name)).sort();
const assets = [];
for (const file of files) {
  const path = '/' + relative(dist, file).split(sep).join('/');
  const contentType = types[extname(path)];
  if (!contentType || path === '/browser-check.html') {
    throw Error('Nieoczekiwany plik w katalogu produkcyjnym: ' + path);
  }
  const bytes = await readFile(file);
  const etag = '"' + createHash('sha256').update(bytes).digest('hex') + '"';
  const body = contentType === 'image/png' ? { base64: bytes.toString('base64') } : { text: bytes.toString('utf8') };
  assets.push([path, { contentType, etag, ...body }]);
}
if (!assets.some(([path]) => path === '/index.html')) {
  throw Error('Uruchom npm run build przed przygotowaniem wdrożenia.');
}

const worker = `const assets = new Map(${JSON.stringify(assets)});
export default {
  fetch(request) {
    const { method } = request;
    if (method !== 'GET' && method !== 'HEAD') {
      return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    const { pathname } = new URL(request.url);
    const asset = assets.get(pathname === '/' ? '/index.html' : pathname);
    if (!asset) return new Response(null, { status: 404 });

    const headers = {
      'Content-Type': asset.contentType,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
      ETag: asset.etag,
    };
    const tags = request.headers.get('If-None-Match')?.split(',').map(tag => tag.trim());
    if (tags?.some(tag => tag === '*' || tag === asset.etag || tag === 'W/' + asset.etag)) {
      return new Response(null, { status: 304, headers });
    }
    const body = method === 'HEAD' ? null :
      asset.text ?? Uint8Array.from(atob(asset.base64), char => char.charCodeAt(0));
    return new Response(body, { headers });
  },
};
`;
await writeFile(destination, worker);
