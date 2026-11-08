import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {stripMetadata,imageType,dimensions} from '../src/images.ts';import {crc32,zipStore} from '../src/zip.ts';
mkdirSync('tests/output',{recursive:true});
const outputs:Record<string,Uint8Array>={};
for(const name of ['photo.jpg','photo.png','photo.webp','animated.webp','animated.png','progressive.jpg'])test('Usuwanie metadanych: '+name,()=>{const original=new Uint8Array(readFileSync('tests/fixtures/'+name)),clean=stripMetadata(original);assert.ok(clean.length<original.length);assert.equal(imageType(clean),imageType(original));assert.deepEqual(dimensions(clean),[64,48]);assert.ok(!new TextDecoder().decode(clean).includes('PRIVATE_'));assert.deepEqual(stripMetadata(clean),clean);writeFileSync('tests/output/'+name,clean);outputs[name]=clean;});
test('Odrzucenie nieobsługiwanego pliku',()=>assert.throws(()=>stripMetadata(new TextEncoder().encode('<svg onload="alert(1)">'))));
test('Odrzucenie uszkodzonego PNG',()=>assert.throws(()=>stripMetadata(new Uint8Array([137,80,78,71,13,10,26,10,255,255,255,255,73,69,78,68]))));
test('Odrzucenie PNG z poprawnym nagłówkiem, ale bez danych pikseli', () => {
  const image = readFileSync('tests/fixtures/photo.png');
  const parts = [image.subarray(0, 8)];
  for (let position = 8; position < image.length;) {
    const next = position + image.readUInt32BE(position) + 12;
    if (image.toString('ascii', position + 4, position + 8) !== 'IDAT') {
      parts.push(image.subarray(position, next));
    }
    position = next;
  }
  assert.throws(() => stripMetadata(Buffer.concat(parts)), /brak danych obrazu/);
});
test('ZIP: CRC32 oraz archiwum z polską nazwą',()=>{assert.equal(crc32(new TextEncoder().encode('123456789')),0xcbf43926);const data={'żółć.txt':new TextEncoder().encode('test'),...outputs};const zip=zipStore(data);assert.equal(new DataView(zip.buffer).getUint32(0,true),0x04034b50);writeFileSync('tests/output/images.zip',zip);});
