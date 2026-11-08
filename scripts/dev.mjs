import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';

const portIndex = process.argv.indexOf('--port');
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT) || 5173;
const production = process.argv.includes('--dist');
const root = resolve(production ? 'dist' : '.');
const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.ts': 'text/javascript',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
};

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/przybornik') {
      res.writeHead(308, { Location: '/przybornik/' + url.search });
      res.end();
      return;
    }
    const path = decodeURIComponent(url.pathname).replace(/^\/przybornik\//, '').replace(/^\/+/, '') || 'index.html';
    const sourceModule = !production && path.startsWith('src/');
    const directory = sourceModule ? resolve(root, 'src') :
      production || path === 'index.html' ? root : resolve(root, 'public');
    const file = resolve(directory, sourceModule ? path.slice(4) : path);
    if (!file.startsWith(directory + sep)) throw Error('Nieprawidłowa ścieżka.');
    const extension = extname(file);
    const data = await readFile(file);
    const body = extension === '.ts' ? stripTypeScriptTypes(data.toString(), { mode: 'strip' }) : data;
    res.writeHead(200, {
      'Content-Type': types[extension] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('Nie znaleziono');
  }
}).listen(port, '0.0.0.0', () => console.log('http://localhost:' + port + '/'));
