// Reproducible local browser checks. Run after npm run build; do not deploy this page.
import {readFile,writeFile} from 'node:fs/promises';
const fixtures={};for(const name of ['photo.jpg','photo.png','photo.webp'])fixtures[name]=(await readFile('tests/fixtures/'+name)).toString('base64');
await writeFile('dist/browser-check.html',`<!doctype html><html lang="pl"><meta charset="utf-8"><title>Przybornik — testy przeglądarkowe</title><style>body{font:18px system-ui;max-width:1000px;margin:50px auto;background:#f6f7f2;color:#176348}li{padding:10px}button{padding:15px}</style><h1>Testy przeglądarkowe Przybornika</h1><ul id="results"></ul><p id="status">Testowanie…</p><button id="download" hidden>Pobierz ZIP testowy</button><script type="module">
import {compress,stripMetadata,dimensions,zipDownload} from './src/images.js';
const base = new URL('./', location.href);const fixtures=${JSON.stringify(fixtures)};const list=document.querySelector('#results');let failures=0,passes=0;const items=[];
async function check(name,fn){try{await fn();list.insertAdjacentHTML('beforeend','<li>✓ '+name+'</li>');passes++;}catch(e){failures++;list.insertAdjacentHTML('beforeend','<li>✗ '+name+': '+e.message+'</li>');}}
function assert(value,message){if(!value)throw Error(message);}
for(const [name,b64] of Object.entries(fixtures))for(const format of ['image/jpeg','image/png','image/webp'])await check(name+' → '+format+' · kompresja, rozdzielczość, odczyt, metadane',async()=>{const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));const f=new File([bytes],name);const b=await compress(f,.65,32,32,format);assert(b.type===format,'Format');const data=new Uint8Array(await b.arrayBuffer());const [w,h]=dimensions(data);assert(w<=32&&h<=32&&w>0&&h>0,'Wymiary');assert(Math.abs(w/h-(name.endsWith('jpg')?.75:4/3))<.05,'Proporcje/orientacja');assert(stripMetadata(data).length===data.length,'Metadane');const bitmap=await createImageBitmap(b);bitmap.close();items.push({blob:b,name:name.replace('.','-')+'-'+format.split('/')[1]+'.'+format.split('/')[1]});});
await check('Service Worker: aktywny i poprawny zakres', async () => {
  const registration = await Promise.race([
    navigator.serviceWorker.ready,
    new Promise((_, reject) => setTimeout(() => reject(Error('Service Worker nie jest aktywny')), 8000)),
  ]);
  assert(registration.active, 'Worker');
  assert(registration.scope === base.href, 'Zakres: ' + registration.scope);
});
await check('Cache offline: HTML, moduły, CSS, manifest i ikony', async () => {
  const paths = ['./', 'src/main.js', 'src/core.js', 'src/images.js', 'src/zip.js', 'src/style.css',
    'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable.png'];
  for (const path of paths) assert(await caches.match(new URL(path, base)), 'Brak ' + path);
});
document.querySelector('#status').textContent=passes+' zaliczonych, '+failures+' błędów.';document.querySelector('#download').hidden=false;document.querySelector('#download').onclick=()=>zipDownload(items);
</script></html>`);
console.log('Otwórz /browser-check.html w działającej lokalnej wersji produkcyjnej.');
