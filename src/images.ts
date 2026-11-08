import {zipStore} from './zip.ts';
const ascii=(a:Uint8Array,s:number,e:number)=>String.fromCharCode(...a.slice(s,e));
const concat=(parts:Uint8Array[])=>{const out=new Uint8Array(parts.reduce((n,a)=>n+a.length,0));let p=0;for(const a of parts){out.set(a,p);p+=a.length;}return out;};
export function imageType(a:Uint8Array){if(a[0]===255&&a[1]===216)return 'image/jpeg';if(a.length>8&&a.slice(0,8).every((x,i)=>x===[137,80,78,71,13,10,26,10][i]))return 'image/png';if(ascii(a,0,4)==='RIFF'&&ascii(a,8,12)==='WEBP')return 'image/webp';throw Error('Obsługiwane są wyłącznie poprawne JPG, PNG i WebP.');}
// Keep only the image structure; remove all optional metadata, including color profiles.
export function stripMetadata(a:Uint8Array):Uint8Array {
 const type=imageType(a),view=new DataView(a.buffer,a.byteOffset,a.byteLength),parts:Uint8Array[]=[];
 if (type === 'image/png') {
  parts.push(a.slice(0, 8));
  let position = 8;
  let hasPixels = false;
  let hasEnd = false;
  while (position + 12 <= a.length) {
   const length = view.getUint32(position);
   const tag = ascii(a, position + 4, position + 8);
   const next = position + length + 12;
   if (next > a.length || (position === 8 && (tag !== 'IHDR' || length !== 13))) {
    throw Error('Uszkodzony PNG.');
   }
   if (tag === 'IDAT' && length > 0) hasPixels = true;
   if (['IHDR', 'PLTE', 'IDAT', 'IEND', 'tRNS', 'acTL', 'fcTL', 'fdAT'].includes(tag)) {
    parts.push(a.slice(position, next));
   }
   position = next;
   if (tag === 'IEND') {
    hasEnd = length === 0;
    break;
   }
  }
  if (!hasPixels || !hasEnd) throw Error('Uszkodzony PNG lub brak danych obrazu.');
 }
 else if(type==='image/webp'){parts.push(a.slice(0,12));let p=12;while(p+8<=a.length){const n=view.getUint32(p+4,true),tag=ascii(a,p,p+4),end=p+8+n+(n%2);if(end>a.length)throw Error('Uszkodzony WebP.');if(['VP8 ','VP8L','VP8X','ALPH','ANIM','ANMF'].includes(tag)){const chunk=a.slice(p,end);if(tag==='VP8X')chunk[8]&=~(0x20|0x08|0x04);parts.push(chunk);}p=end;}const out=concat(parts);new DataView(out.buffer).setUint32(4,out.length-8,true);return out;}
 else {parts.push(a.slice(0,2));let p=2;while(p<a.length){if(a[p]!==255)throw Error('Uszkodzony JPEG.');const start=p;while(a[p]===255)p++;const marker=a[p++];if(marker===0xd9){parts.push(a.slice(start,p));return concat(parts);}if(marker===0xda){if(p+2>a.length)throw Error('Uszkodzony JPEG.');const n=view.getUint16(p);if(n<2||p+n>a.length)throw Error('Uszkodzony JPEG.');let end=p+n;while(end<a.length-1){if(a[end]===255&&a[end+1]!==0&&!(a[end+1]>=0xd0&&a[end+1]<=0xd7))break;end++;}parts.push(a.slice(start,end));p=end;continue;}if(p+2>a.length)throw Error('Uszkodzony JPEG.');const n=view.getUint16(p);if(n<2||p+n>a.length)throw Error('Uszkodzony JPEG.');if(!((marker>=0xe0&&marker<=0xef)||marker===0xfe))parts.push(a.slice(start,p+n));p+=n;}throw Error('Brak końca JPEG.');}
 return concat(parts);
}
export function download(blob:Blob,name:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
export async function zipDownload(items:{blob:Blob;name:string}[]){const data:Record<string,Uint8Array>={};for(let i=0;i<items.length;i++)data[`${i+1}-${items[i].name}`]=new Uint8Array(await items[i].blob.arrayBuffer());download(new Blob([zipStore(data) as Uint8Array<ArrayBuffer>]),'przybornik-zdjecia.zip');}
export async function compress(file:File,quality:number,maxWidth:number,maxHeight:number,type:string){const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});try{if(bitmap.width*bitmap.height>40e6)throw Error('Obraz przekracza limit 40 megapikseli.');const scale=Math.min(1,maxWidth/bitmap.width,maxHeight/bitmap.height);const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=canvas.getContext('2d');if(!ctx)throw Error('Brak obsługi obrazu.');if(type==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);}ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Nie udało się zakodować obrazu.')),type,quality));return new Blob([stripMetadata(new Uint8Array(await blob.arrayBuffer())) as Uint8Array<ArrayBuffer>],{type:blob.type});}finally{bitmap.close();}}
export function dimensions(a:Uint8Array):[number,number]{const type=imageType(a),v=new DataView(a.buffer,a.byteOffset,a.byteLength);if(type==='image/png'&&a.length>=24)return [v.getUint32(16),v.getUint32(20)];if(type==='image/webp'){const tag=ascii(a,12,16);if(tag==='VP8X'&&a.length>=30)return [1+a[24]+(a[25]<<8)+(a[26]<<16),1+a[27]+(a[28]<<8)+(a[29]<<16)];if(tag==='VP8 '&&a.length>=30)return [v.getUint16(26,true)&16383,v.getUint16(28,true)&16383];if(tag==='VP8L'&&a.length>=25)return [1+a[21]+((a[22]&63)<<8),1+(a[22]>>6)+(a[23]<<2)+((a[24]&15)<<10)];}if(type==='image/jpeg'){let p=2;while(p+4<a.length){if(a[p++]!==255)break;while(a[p]===255)p++;const tag=a[p++];if(tag===218||tag===217)break;const n=v.getUint16(p);if(n<2||p+n>a.length)break;if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(tag)&&n>=7)return [v.getUint16(p+5),v.getUint16(p+3)];p+=n;}}throw Error('Nie można bezpiecznie odczytać wymiarów obrazu.');}
