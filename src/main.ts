import {calculate,convert,units,password,pools,zonedInstant,remaining,formatNumber} from './core.ts';
import {stripMetadata,imageType,dimensions,compress,download,zipDownload} from './images.ts';
const $=<T extends HTMLElement=HTMLElement>(s:string)=>document.querySelector<T>(s)!;
const esc=(s:unknown)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function stored<T>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)??'null')??fallback;}catch{return fallback;}}
function save(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Settings are optional. */}}
function toast(text:string){$('#toast').textContent=text;$('#toast').classList.add('visible');setTimeout(()=>$('#toast').classList.remove('visible'),3500);}
async function copy(text:string){try{await navigator.clipboard.writeText(text);toast('Skopiowano do schowka.');}catch{toast('Schowek niedostępny. Zaznacz i skopiuj tekst ręcznie.');}}
const icons:Record<string,string>={box:'<rect x="4" y="7" width="16" height="14" rx="3"/><path d="M9 7V4h6v3M4 12h16M12 10v5"/>',clean:'<path d="m12 3 8 4v6c0 5-8 8-8 8S4 18 4 13V7z"/><path d="m8 12 3 3 5-6"/>',compress:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m3 17 6-6 4 4 3-3 5 5M15 7h.01"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2M3 12h2m14 0h2"/>',calc:'<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 6h8M8 11h1m6 0h1M8 15h1m6 0h1M8 19h1m6 0h1"/>',units:'<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>',key:'<circle cx="8" cy="9" r="5"/><path d="m12 13 8 8m-3-3 3-3m-6 0 3-3"/>',timer:'<circle cx="12" cy="13" r="8"/><path d="M9 2h6m-3 0v3m0 4v5l3 2m3-11 2 2"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',back:'<path d="M19 12H5m5-5-5 5 5 5"/>',check:'<path d="m5 12 4 4L19 6"/>'};
const icon=(name:string)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.box}</svg>`;
const tools=[{id:'metadane',name:'Usuwanie metadanych',desc:'Twoje zdjęcia, bez zbędnych informacji. Usuń EXIF, GPS i inne dane.',icon:'clean',tag:'PRYWATNOŚĆ',color:'sage'},{id:'kompresor',name:'Kompresor obrazów',desc:'Mniej megabajtów, więcej miejsca. Zmniejsz zdjęcia w kilku kliknięciach.',icon:'compress',tag:'ZDJĘCIA',color:'peach'},{id:'strefy',name:'Strefy czasowe',desc:'Zawsze dobry moment. Sprawdź godzinę po drugiej stronie świata.',icon:'clock',tag:'CZAS',color:'blue'},{id:'kalkulator',name:'Kalkulator naukowy',desc:'Od szybkich rachunków po trygonometrię. Wszystko się zgadza.',icon:'calc',tag:'OBLICZENIA',color:'purple'},{id:'jednostki',name:'Konwerter jednostek',desc:'Kilometry, funty czy stopnie? Przelicz to bez zastanawiania.',icon:'units',tag:'OBLICZENIA',color:'yellow'},{id:'hasla',name:'Generator haseł',desc:'Mały krok do większego bezpieczeństwa. Stwórz silne hasło.',icon:'key',tag:'BEZPIECZEŃSTWO',color:'rose'},{id:'pomodoro',name:'Pomodoro',desc:'Czas na skupienie. Pracuj w swoim rytmie i pamiętaj o przerwie.',icon:'timer',tag:'SKUPIENIE',color:'sage'}];
let current='';let cleanup=()=>{};
const root=$('#root');
root.innerHTML=`<header><a class="brand" href="#" aria-label="Przybornik — strona główna"><span class="brand-icon">${icon('box')}</span>przybornik<span class="brand-dot">.</span></a><nav><span class="private">${icon('clean')} Lokalnie. Prywatnie.</span><button id="install" class="subtle" hidden>Zainstaluj aplikację</button><button id="theme" class="icon-button" aria-label="Zmień tryb jasny lub ciemny">${icon('sun')}</button></nav></header><main id="main"></main><footer><a class="brand small" href="#">przybornik.</a><span>Małe narzędzia. Dużo możliwości.</span><span id="connection">● Gotowy do pracy</span></footer><div id="toast" role="status" aria-live="polite"></div><div id="update" hidden>Nowa wersja jest gotowa. <button>Odśwież aplikację</button></div>`;
const theme=stored('theme','system');if(theme==='dark'||theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.dataset.theme='dark';
$('#theme').onclick=()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;save('theme',next);};
function route(){window.scrollTo(0,0);cleanup();cleanup=()=>{};current=location.hash.slice(1);const tool=tools.find(t=>t.id===current);const main=$('#main');if(!tool){main.innerHTML=`<section class="hero"><div><div class="eyebrow"><span></span> TWÓJ CODZIENNY ZESTAW NARZĘDZI</div><h1>Mniej klikania.<br>Więcej <em>zrobione.</em></h1><p>Siedem przydatnych narzędzi, zawsze pod ręką.<br>Bez konta, bez reklam. Po prostu otwórz i działaj.</p><div class="hero-pills"><span>${icon('clean')} 100% lokalnie</span><span>${icon('check')} Działa również offline</span></div></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="art-card art-one">${icon('units')}<span>1 km <b>1000 m</b></span></div><div class="art-center">${icon('box')}</div><div class="art-card art-two">${icon('timer')}<span>czas na skupienie<b>25:00</b></span></div><span class="spark s1">+</span><span class="spark s2">✳</span></div></section><section class="tool-section"><div class="section-head"><h2>Co dziś ułatwimy?</h2><span>7 narzędzi · zero komplikacji</span></div><div class="cards">${tools.map((t,i)=>`<a class="tool-card" href="#${t.id}"><div class="card-top"><span class="tool-icon ${t.color}">${icon(t.icon)}</span><span class="card-number">0${i+1}</span></div><span class="tag">${t.tag}</span><h3>${t.name}</h3><p>${t.desc}</p><span class="card-link">Otwórz narzędzie ${icon('arrow')}</span></a>`).join('')}<div class="privacy-card"><span class="privacy-flower">✳</span><h3>Twoje dane<br>zostają u Ciebie.</h3><p>Zdjęcia i hasła nie opuszczają Twojego urządzenia. Tak właśnie powinno być.</p><span>BEZ WYSYŁANIA NA SERWER</span></div></div></section>`;return;}
 main.innerHTML=`<a class="back" href="#">${icon('back')} Wszystkie narzędzia</a><section class="tool-heading"><span class="tool-icon ${tool.color}">${icon(tool.icon)}</span><div><div class="tag">${tool.tag}</div><h1>${tool.name}</h1><p>${tool.desc}</p></div></section><section id="workspace" class="workspace"></section>`;
 ({metadane:()=>imageTool(false),kompresor:()=>imageTool(true),strefy:zones,kalkulator:calculator,jednostki:converter,hasla:passwordTool,pomodoro:pomodoro}[current]||(()=>{}))();
}
window.addEventListener('hashchange',route);
function label(text:string,content:string){return `<label>${text}${content}</label>`;}
const option=(value:string|number,text:string,selected=false)=>`<option value="${esc(value)}" ${selected?'selected':''}>${esc(text)}</option>`;
function calculator(){const w=$('#workspace');let history=stored<{expression:string;value:number}[]>('calc-history',[]);let degrees=true;w.innerHTML=`<div class="two-columns"><div class="panel"><div class="row between"><h2>Twoje obliczenie</h2><button id="angle" class="chip" aria-pressed="true">DEG</button></div>${label('Wyrażenie','<input id="expression" class="calc-input" autocomplete="off" inputmode="text" placeholder="np. sqrt(81) + 2^3">')}<output id="result" class="big-output" aria-live="polite">0</output><div class="calc-keys">${['sin(','cos(','tan(','(',')','ln(','log(','sqrt(','^','%','7','8','9','/','C','4','5','6','*','⌫','1','2','3','-','π','0','.','e','+','='].map(k=>`<button data-key="${k}" class="${k==='='?'primary':''}">${k}</button>`).join('')}</div><button id="copy-result" class="secondary full">Kopiuj wynik</button><p class="hint">Enter = oblicz · Escape = wyczyść · % dzieli liczbę przez 100. Funkcje używają nawiasów.</p></div><div class="panel"><div class="row between"><h2>Historia</h2><button id="clear-history" class="subtle">Wyczyść</button></div><div id="history"></div><p class="hint">Ostatnie 20 obliczeń zapisujemy tylko na tym urządzeniu.</p></div></div>`;
 const input=$<HTMLInputElement>('#expression');let result='0';const drawHistory=()=>{$('#history').innerHTML=history.length?history.map((h,i)=>`<button class="history-item" data-history="${i}"><span>${esc(h.expression)}</span><strong>${esc(formatNumber(h.value))}</strong></button>`).join(''):'<p class="empty">Pierwszy wynik będzie właśnie tutaj.</p>';document.querySelectorAll<HTMLButtonElement>('[data-history]').forEach(b=>b.onclick=()=>{input.value=history[+b.dataset.history!].expression;input.focus();});};
 const run=()=>{try{const value=calculate(input.value,degrees);result=String(value);$('#result').textContent=formatNumber(value);history=[{expression:input.value,value},...history].slice(0,20);save('calc-history',history);drawHistory();}catch(e){toast((e as Error).message);}};
 document.querySelectorAll<HTMLButtonElement>('[data-key]').forEach(b=>b.onclick=()=>{const k=b.dataset.key!;if(k==='='){run();return;}if(k==='C')input.value='';else if(k==='⌫')input.value=input.value.slice(0,-1);else{const p=input.selectionStart??input.value.length;input.setRangeText(k,p,input.selectionEnd??p,'end');}input.focus();});input.onkeydown=e=>{if(e.key==='Enter')run();if(e.key==='Escape')input.value='';};$('#angle').onclick=()=>{degrees=!degrees;$('#angle').textContent=degrees?'DEG':'RAD';$('#angle').setAttribute('aria-pressed',String(degrees));};$('#copy-result').onclick=()=>copy(result);$('#clear-history').onclick=()=>{history=[];save('calc-history',history);drawHistory();};drawHistory();}
function converter(){const w=$('#workspace');w.innerHTML=`<div class="panel narrow"><h2>Jedna wartość, różne jednostki</h2>${label('Kategoria',`<select id="category">${Object.keys(units).map(k=>option(k,k)).join('')}</select>`)}${label('Wartość','<input id="amount" inputmode="decimal" value="1" autocomplete="off">')}<div class="unit-row">${label('Z jednostki','<select id="from"></select>')}<button id="swap" class="icon-button" aria-label="Zamień jednostki">${icon('units')}</button>${label('Na jednostkę','<select id="to"></select>')}</div><div class="result-box"><span>Wynik</span><output id="converted" class="big-output" aria-live="polite"></output><span id="unit-name"></span></div><button id="copy-converted" class="primary full">Kopiuj wynik</button><p class="hint">Dane cyfrowe: kB = 1000 B, KiB = 1024 B. Doba = 24 godziny.</p></div>`;
 const category = $<HTMLSelectElement>('#category');
 const from = $<HTMLSelectElement>('#from');
 const to = $<HTMLSelectElement>('#to');
 const amount = $<HTMLInputElement>('#amount');
 const copyButton = $<HTMLButtonElement>('#copy-converted');
 let raw: string | null = null;
 const update = () => {
  const text = amount.value.trim().replace(',', '.');
  const value = text ? convert(Number(text), category.value, +from.value, +to.value) : NaN;
  const valid = Number.isFinite(value);
  raw = valid ? String(value) : null;
  copyButton.disabled = !valid;
  $('#converted').textContent = valid ? formatNumber(value) : 'Wpisz poprawną liczbę';
  $('#unit-name').textContent = units[category.value][+to.value].name;
 };
 const setup = () => {
  from.innerHTML = units[category.value].map((unit, index) => option(index, unit.name)).join('');
  to.innerHTML = units[category.value].map((unit, index) => option(index, unit.name, index === 1)).join('');
  update();
 };
 category.onchange = setup;
 from.onchange = to.onchange = amount.oninput = update;
 $('#swap').onclick = () => {
  const previousFrom = from.value;
  from.value = to.value;
  to.value = previousFrom;
  update();
 };
 copyButton.onclick = () => { if (raw !== null) void copy(raw); };
 setup();
}
function passwordTool(){const w=$('#workspace');let enabled=[true,true,true,true];let generated='';w.innerHTML=`<div class="panel narrow"><div class="row between"><h2>Hasło trudne do zgadnięcia</h2><span class="chip">Web Crypto</span></div><output id="password" class="password-output" aria-live="polite"></output><div class="strength"><div id="strength-bar"></div></div><p id="strength" class="hint"></p>${label('Długość hasła: <strong id="length-value">20</strong>','<input id="length" type="range" min="4" max="128" value="20">')}<div class="checks">${['Małe litery (a–z)','Wielkie litery (A–Z)','Cyfry (0–9)','Znaki specjalne (!@#)'].map((x,i)=>`<label class="check"><input type="checkbox" data-pool="${i}" checked>${x}</label>`).join('')}<label class="check"><input type="checkbox" id="exclude" checked>Wyklucz podobne znaki (I, l, 1, O, 0…)</label></div><div class="row"><button id="generate" class="primary grow">Wygeneruj kolejne</button><button id="copy-password" class="secondary">Kopiuj</button></div><p class="note">Hasło powstaje na Twoim urządzeniu. Nie zapisujemy go w historii ani pamięci aplikacji. Wskaźnik siły jest oszacowaniem dla losowo wygenerowanego hasła.</p></div>`;
 const gen=()=>{const length=+$<HTMLInputElement>('#length').value;$('#length-value').textContent=String(length);try{generated=password(length,enabled,$<HTMLInputElement>('#exclude').checked);$('#password').textContent=generated;const count=pools.filter((_,i)=>enabled[i]).join('').replace($<HTMLInputElement>('#exclude').checked?/[ilI1oO0|]/g:/$^/g,'').length;const bits=Math.max(0,length*Math.log2(count)-12);$('#strength').textContent=`${bits>=100?'Bardzo silne':bits>=70?'Silne':bits>=45?'Umiarkowane':'Słabe'} · około ${Math.floor(bits)} bitów entropii (ostrożne oszacowanie)`;$('#strength-bar').style.width=Math.min(100,bits/1.28)+'%';$('#copy-password').removeAttribute('disabled');}catch(e){generated='';$('#password').textContent='Wybierz zestaw znaków';$('#strength').textContent=(e as Error).message;$('#strength-bar').style.width='0';$('#copy-password').setAttribute('disabled','');}};
 document.querySelectorAll<HTMLInputElement>('[data-pool]').forEach(c=>c.onchange=()=>{enabled[+c.dataset.pool!]=c.checked;gen();});$('#length').oninput=gen;$('#exclude').onchange=gen;$('#generate').onclick=gen;$('#copy-password').onclick=()=>copy(generated);gen();cleanup=()=>{generated='';};}
const popular:Record<string,string>={'Europe/Warsaw':'Warszawa','Europe/London':'Londyn','Europe/Paris':'Paryż','Europe/Berlin':'Berlin','America/New_York':'Nowy Jork','America/Los_Angeles':'Los Angeles','Asia/Tokyo':'Tokio','Asia/Dubai':'Dubaj','Australia/Sydney':'Sydney','Asia/Shanghai':'Szanghaj','Asia/Kolkata':'Delhi','Pacific/Auckland':'Auckland','Europe/Kyiv':'Kijów','UTC':'UTC'};
const getZones=()=>{try{return [...new Set(['Europe/Warsaw','UTC',...(Intl as unknown as {supportedValuesOf:(x:string)=>string[]}).supportedValuesOf('timeZone')])];}catch{return Object.keys(popular);}};
const zoneName=(z:string)=>popular[z]||z.split('/').slice(1).join(' / ').replaceAll('_',' ')||z;
function zones(){let favorites=stored<string[]>('zones',['Europe/Warsaw','Europe/London','America/New_York','Asia/Tokyo']).filter(z=>{try{new Intl.DateTimeFormat('pl',{timeZone:z});return true;}catch{return false;}});let converted:number|null=null;const all=getZones();const w=$('#workspace');w.innerHTML=`<div class="panel"><div class="row between"><h2>Świat w tej samej chwili</h2><span class="chip">Format 24 h</span></div>${label('Szukaj miasta lub strefy','<input id="zone-search" type="search" placeholder="np. Warszawa, Tokyo, America…">')}<div id="zone-results" class="zone-results"></div><div id="zone-cards" class="zone-cards"></div></div><div class="panel"><h2>Przelicz datę i godzinę</h2><div class="three-columns">${label('Data i godzina lokalna','<input id="local-date" type="datetime-local" min="1900-01-01T00:00" max="2100-12-31T23:59">')}${label('Strefa wejściowa',`<select id="source-zone">${all.map(z=>option(z,`${zoneName(z)} · ${z}`,z==='Europe/Warsaw')).join('')}</select>`)}${label('Powtórzona godzina przy zmianie czasu','<select id="ambiguity"><option value="reject">Ostrzegaj o niejednoznaczności</option><option value="earlier">Wcześniejsze wystąpienie</option><option value="later">Późniejsze wystąpienie</option></select>')}</div><button id="convert-date" class="primary">Przelicz dla ulubionych stref</button><div id="date-results" class="conversion-list" aria-live="polite"></div><p class="hint">Zmiany czasu uwzględnia baza stref Twojej przeglądarki. Aktualizuj system, aby mieć aktualne reguły.</p></div>`;
 const dateValue=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Warsaw',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date()).replace(' ','T');$<HTMLInputElement>('#local-date').value=dateValue;
 const timeFormat=(z:string,t:number)=>new Intl.DateTimeFormat('pl-PL',{timeZone:z,weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZoneName:'short'}).format(t);
 const drawConverted=()=>{$('#date-results').innerHTML=converted===null?'':favorites.map(z=>`<div><strong>${esc(zoneName(z))}</strong><span>${esc(timeFormat(z,converted!))}</span></div>`).join('');};
 const zoneCards = $('#zone-cards');
 let clocks: {
  time: HTMLElement;
  weekday: HTMLElement;
  timeFormat: Intl.DateTimeFormat;
  weekdayFormat: Intl.DateTimeFormat;
 }[] = [];
 const updateClocks = () => {
  const now = Date.now();
  for (const clock of clocks) {
   clock.time.textContent = clock.timeFormat.format(now);
   clock.weekday.textContent = clock.weekdayFormat.format(now);
  }
 };
 const draw = () => {
  zoneCards.innerHTML = favorites.map(zone => `
   <article class="zone-card">
    <div class="row between"><strong>${esc(zoneName(zone))}</strong>
     <button class="subtle" data-remove="${esc(zone)}" aria-label="Usuń strefę ${esc(zoneName(zone))}">×</button>
    </div>
    <time></time><p></p><small>${esc(zone)}</small>
   </article>`).join('');
  clocks = Array.from(zoneCards.querySelectorAll('.zone-card'), (card, index) => {
   const timeZone = favorites[index];
   return {
    time: card.querySelector('time')!,
    weekday: card.querySelector('p')!,
    timeFormat: new Intl.DateTimeFormat('pl-PL', {
     timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    }),
    weekdayFormat: new Intl.DateTimeFormat('pl-PL', { timeZone, weekday: 'long' }),
   };
  });
  updateClocks();
  zoneCards.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach(button => {
   button.onclick = () => {
    favorites = favorites.filter(zone => zone !== button.dataset.remove);
    save('zones', favorites);
    draw();
    drawConverted();
    search();
   };
  });
 };
 const search=()=>{const q=$<HTMLInputElement>('#zone-search').value.toLocaleLowerCase('pl');$('#zone-results').innerHTML=q?all.filter(z=>!favorites.includes(z)&&`${zoneName(z)} ${z}`.toLocaleLowerCase('pl').includes(q)).slice(0,20).map(z=>`<button class="chip" data-zone="${esc(z)}">+ ${esc(zoneName(z))} <small>${esc(z)}</small></button>`).join('')||'<span>Brak wyników.</span>':'';document.querySelectorAll<HTMLButtonElement>('[data-zone]').forEach(b=>b.onclick=()=>{if(favorites.length>=12){toast('Możesz porównać maksymalnie 12 stref.');return;}favorites.push(b.dataset.zone!);save('zones',favorites);draw();drawConverted();search();});};$('#zone-search').oninput=search;$('#convert-date').onclick=()=>{try{const input=$<HTMLInputElement>('#local-date');if(!input.checkValidity()||!input.value)throw Error('Wybierz poprawną datę od 1900 do 2100 roku.');converted=zonedInstant(input.value,$<HTMLSelectElement>('#source-zone').value,$<HTMLSelectElement>('#ambiguity').value as 'earlier'|'later'|'reject');drawConverted();}catch(e){converted=null;$('#date-results').textContent=(e as Error).message;}};draw();const interval=setInterval(updateClocks,1000);cleanup=()=>clearInterval(interval);}
type TimerSettings={work:number;short:number;long:number;cycle:number;sound:boolean;voice:boolean;notifications:boolean};
let timerSettings:TimerSettings={work:25,short:5,long:15,cycle:4,sound:true,voice:false,notifications:false,...stored<Partial<TimerSettings>>('pomodoro-settings',{})};
for(const k of ['work','short','long','cycle'] as const)if(!Number.isFinite(timerSettings[k])||timerSettings[k]<1||timerSettings[k]>180)timerSettings[k]=k==='work'?25:k==='cycle'?4:k==='long'?15:5;
let mode:'work'|'short'|'long'='work';let seconds=timerSettings.work*60;let deadline:number|null=null;let sessions=0;let audio:AudioContext|null=null;
function notifyFinished(){if(timerSettings.sound&&audio){try{const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=740;g.gain.setValueAtTime(.12,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.8);o.start();o.stop(audio.currentTime+.8);}catch{}}
 const text=mode==='work'?'Sesja pracy zakończona. Czas na przerwę.':'Przerwa zakończona. Czas na skupienie.';
 if(timerSettings.voice&&'speechSynthesis'in window){const msg=new SpeechSynthesisUtterance(text);msg.lang='pl-PL';speechSynthesis.speak(msg);}if(timerSettings.notifications&&'Notification'in window&&Notification.permission==='granted'){navigator.serviceWorker?.ready.then(r=>r.showNotification('Przybornik — Pomodoro',{body:text,icon:new URL('icon-192.png',document.baseURI).href})).catch(()=>{});}toast(text);}
function tick(){if(deadline!==null){seconds=remaining(deadline);if(seconds===0){deadline=null;if(mode==='work')sessions++;notifyFinished();}}if(current==='pomodoro'){const time=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;$('#timer-time').textContent=time;$('#session-count').textContent=String(sessions);$('#next-session').hidden=seconds!==0;$('#start-timer').textContent=deadline!==null?'Pauza':seconds===0?'Rozpocznij ponownie':'Start';$('#timer-ring').style.setProperty('--progress',`${Math.min(100,(1-seconds/(timerSettings[mode]*60))*100)}%`);document.title=`${time} · Pomodoro — Przybornik`;}}
setInterval(tick,250);document.addEventListener('visibilitychange',tick);
function pomodoro(){const w=$('#workspace');w.innerHTML=`<div class="two-columns"><div class="panel timer-panel"><div class="segments">${(['work','short','long'] as const).map((m,i)=>`<button data-mode="${m}" aria-pressed="${mode===m}" class="${mode===m?'active':''}">${['Praca','Krótka przerwa','Długa przerwa'][i]}</button>`).join('')}</div><div id="timer-ring" class="timer-ring"><div><span id="timer-caption">${mode==='work'?'CZAS NA SKUPIENIE':'CHWILA DLA CIEBIE'}</span><output id="timer-time" aria-label="Pozostały czas"></output><span>jeden krok na raz</span></div></div><div class="row"><button id="start-timer" class="primary grow">Start</button><button id="reset-timer" class="secondary">Reset</button></div><button id="next-session" class="secondary full" ${seconds===0?'':'hidden'}>Przejdź do kolejnej sesji</button><p class="hint">Ukończone sesje pracy: <strong id="session-count">${sessions}</strong></p></div><div class="panel"><h2>Twój rytm pracy</h2><div class="two-columns">${(['work','short','long','cycle'] as const).map((k,i)=>label(['Praca (min)','Krótka przerwa (min)','Długa przerwa (min)','Długa przerwa co sesji'][i],`<input data-setting="${k}" type="number" min="1" max="${k==='cycle'?12:180}" value="${timerSettings[k]}">`)).join('')}</div><div class="checks">${(['sound','voice','notifications'] as const).map((k,i)=>`<label class="check"><input type="checkbox" data-setting="${k}" ${timerSettings[k]?'checked':''}>${['Sygnał dźwiękowy','Polski komunikat głosowy','Powiadomienia przeglądarki'][i]}</label>`).join('')}</div><button id="save-timer" class="secondary full">Zapisz ustawienia i zresetuj licznik</button><p class="note">Android może uśpić aplikację w tle. Licznik nadrobi czas po powrocie, ale dźwięk, powiadomienia i mowa mogą pojawić się dopiero wtedy. Nie polegaj na nich jak na systemowym budziku. Zamknięcie aplikacji kończy odliczanie.</p></div></div>`;
 const reset=()=>{deadline=null;seconds=timerSettings[mode]*60;tick();};document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode as typeof mode;deadline=null;seconds=timerSettings[mode]*60;pomodoro();});$('#start-timer').onclick=()=>{if(deadline!==null){seconds=remaining(deadline);deadline=null;}else{if(seconds===0)seconds=timerSettings[mode]*60;deadline=Date.now()+seconds*1000;try{audio??=new AudioContext();void audio.resume();}catch{}}tick();};$('#reset-timer').onclick=reset;$('#next-session').onclick=()=>{mode=mode==='work'?(sessions%timerSettings.cycle===0?'long':'short'):'work';deadline=null;seconds=timerSettings[mode]*60;pomodoro();};$('#save-timer').onclick=async()=>{const next={...timerSettings};for(const input of document.querySelectorAll<HTMLInputElement>('[data-setting]')){const k=input.dataset.setting as keyof TimerSettings;if(input.type==='number'){if(!input.checkValidity()||!input.value||!Number.isInteger(+input.value)){toast('Wpisz pełne minuty i poprawną liczbę sesji.');return;}(next[k] as number)=+input.value;}else (next[k] as boolean)=input.checked;}
 if(next.notifications){if(!('Notification'in window)||!('serviceWorker'in navigator)){next.notifications=false;toast('Ta przeglądarka nie obsługuje powiadomień.');}else{try{const permission=await Notification.requestPermission();if(permission!=='granted'){next.notifications=false;toast('Nie udzielono zgody na powiadomienia.');}}catch{next.notifications=false;}}}timerSettings=next;save('pomodoro-settings',timerSettings);reset();toast('Ustawienia zapisane.');};tick();cleanup=()=>{document.title='Przybornik — codzienne narzędzia';};}
function imageTool(isCompression:boolean){const w=$('#workspace');let alive=true,busy=false;let urls:string[]=[];let results:{blob:Blob;name:string}[]=[];let selected:File[]=[];
 w.innerHTML=`<div class="panel"><div class="row between"><h2>${isCompression?'Lżejsze zdjęcia, ten sam pomysł':'Prywatność zaczyna się od zdjęcia'}</h2><span class="chip">JPG · PNG · WebP</span></div><label class="dropzone" id="dropzone" tabindex="0"><span class="upload-icon">${icon(isCompression?'compress':'clean')}</span><strong>Przeciągnij zdjęcia lub wybierz pliki</strong><span>Do 20 plików · 25 MB na plik · 100 MB łącznie · 40 MP</span><input id="files" aria-label="Wybierz zdjęcia JPG, PNG lub WebP" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" multiple></label><div id="selected-files" class="hint" aria-live="polite">Nie wybrano plików.</div>${isCompression?`<div class="three-columns">${label('Jakość: <strong id="quality-value">85%</strong>','<input id="quality" type="range" min="10" max="100" value="85">')}${label('Maks. szerokość (px)','<input id="max-width" type="number" min="1" max="12000" value="1920">')}${label('Maks. wysokość (px)','<input id="max-height" type="number" min="1" max="12000" value="1920">')}</div>${label('Format wyniku','<select id="format"><option value="original">Taki jak oryginał</option><option value="image/webp">WebP</option><option value="image/jpeg">JPG (białe tło dla przezroczystości)</option><option value="image/png">PNG (jakość bez wpływu na kompresję)</option></select>')}<p class="note">Kompresja ponownie koduje obraz. Może zmienić jakość i profil kolorów; animacja zostanie spłaszczona do jednej klatki. Proporcje są zachowywane, małe zdjęcia nie są powiększane. Wynik może być większy od oryginału.</p>`:`<p class="note">Tryb bez ponownego kodowania: zachowujemy skompresowane piksele i animację. Usuwamy EXIF/GPS, XMP, komentarze, profile kolorów i inne opcjonalne bloki. Usunięcie profilu kolorów lub znacznika orientacji EXIF może zmienić wygląd albo obrót zdjęcia. Widoczne informacje zapisane w pikselach pozostają na zdjęciu.</p>`}<div class="row"><button id="process" class="primary" disabled>${isCompression?'Kompresuj zdjęcia':'Usuń metadane'}</button><button id="clear-files" class="secondary">Wyczyść pliki</button><button id="zip" class="secondary" hidden>Pobierz wszystko jako ZIP</button></div><p id="image-status" role="status" aria-live="polite"></p><div id="image-results" class="image-results"></div></div>`;
 if(isCompression)$('#quality').oninput=()=>$('#quality-value').textContent=$<HTMLInputElement>('#quality').value+'%';
 const clear=()=>{urls.forEach(u=>URL.revokeObjectURL(u));urls=[];results=[];$('#image-results').innerHTML='';$('#zip').hidden=true;};
 const select=(files:FileList|File[])=>{if(busy)return;const next=Array.from(files);if(next.length>20||next.reduce((n,f)=>n+f.size,0)>100*1024**2||next.some(f=>f.size>25*1024**2)){toast('Przekroczono limit: 20 plików, 25 MB na plik, 100 MB łącznie.');return;}clear();selected=next;$('#selected-files').textContent=next.length?`${next.length} plików · ${(next.reduce((n,f)=>n+f.size,0)/1024**2).toFixed(2)} MB`:'Nie wybrano plików.';$<HTMLButtonElement>('#process').disabled=!next.length;};
 $('#files').onchange=()=>select($<HTMLInputElement>('#files').files!);const drop=$('#dropzone');drop.ondragover=e=>{e.preventDefault();drop.classList.add('dragging');};drop.ondragleave=()=>drop.classList.remove('dragging');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('dragging');if(e.dataTransfer)select(e.dataTransfer.files);};drop.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$<HTMLInputElement>('#files').click();}};
 $('#clear-files').onclick=()=>{if(busy)return;clear();selected=[];$<HTMLInputElement>('#files').value='';$('#selected-files').textContent='Nie wybrano plików.';$<HTMLButtonElement>('#process').disabled=true;};
 $('#process').onclick=async()=>{if(busy)return;if(isCompression&&['#max-width','#max-height'].some(s=>!$<HTMLInputElement>(s).checkValidity()||!$<HTMLInputElement>(s).value)){toast('Podaj wymiary od 1 do 12000 pikseli.');return;}busy=true;clear();$<HTMLButtonElement>('#process').disabled=true;$<HTMLButtonElement>('#clear-files').disabled=true;
 for(let i=0;i<selected.length;i++){const file=selected[i];if(!alive)break;$('#image-status').textContent=`Przetwarzanie ${i+1} z ${selected.length}…`;try{const bytes=new Uint8Array(await file.arrayBuffer()),mime=imageType(bytes),[width,height]=dimensions(bytes);if(!width||!height||width*height>40e6||width>20000||height>20000)throw Error('Przekroczono bezpieczny limit wymiarów obrazu.');let blob:Blob;if(isCompression){const format=$<HTMLSelectElement>('#format').value;blob=await compress(file,+$<HTMLInputElement>('#quality').value/100,+$<HTMLInputElement>('#max-width').value,+$<HTMLInputElement>('#max-height').value,format==='original'?mime:format);}else blob=new Blob([stripMetadata(bytes) as Uint8Array<ArrayBuffer>],{type:mime});
 // A second structural pass must leave the output byte-for-byte unchanged.
 const resultBytes=new Uint8Array(await blob.arrayBuffer()),verified=stripMetadata(resultBytes);if(resultBytes.length!==verified.length||!resultBytes.every((b,j)=>b===verified[j]))throw Error('Weryfikacja metadanych nie powiodła się.');
 if (!isCompression && alive) {
  try {
   const bitmap = await createImageBitmap(blob);
   bitmap.close();
  } catch {
   throw Error('Plik jest uszkodzony lub nie można odczytać obrazu.');
  }
 }
 if(!alive)break;const ext=blob.type==='image/jpeg'?'jpg':blob.type==='image/webp'?'webp':'png';const name=file.name.replace(/\.[^.]+$/,'')+(isCompression?'-kompresja.':'-bez-metadanych.')+ext;if(results.reduce((n,r)=>n+r.blob.size,0)+blob.size>100*1024**2)throw Error('Wyniki przekroczyły limit 100 MB. Przetwórz mniejszą partię.');const resultIndex=results.length;results.push({blob,name});const before=URL.createObjectURL(file),after=URL.createObjectURL(blob);urls.push(before,after);const savings=(1-blob.size/file.size)*100;const article=document.createElement('article');article.className='image-result';article.innerHTML=`<h3>${esc(file.name)}</h3><div class="preview-pair">${isCompression?`<figure><img src="${before}" alt="Oryginalny obraz" loading="lazy"><figcaption>Przed · ${(file.size/1024).toFixed(1)} KB</figcaption></figure>`:''}<figure><img src="${after}" alt="Obraz po przetworzeniu" loading="lazy"><figcaption>Po · ${(blob.size/1024).toFixed(1)} KB</figcaption></figure></div><div class="row between"><span class="hint">${width} × ${height} px (oryginał) · ${savings>=0?'oszczędność':'wzrost rozmiaru'} ${Math.abs(savings).toFixed(1)}%<br>✓ Zweryfikowano strukturę: brak usuwanych bloków metadanych</span><button class="secondary" data-download="${resultIndex}">Pobierz</button></div>`;$('#image-results').append(article);article.querySelector<HTMLButtonElement>('button')!.onclick=()=>download(blob,name);
 }catch(e){if(alive){const error=document.createElement('p');error.className='error';error.textContent=`${file.name}: ${(e as Error).message}`;$('#image-results').append(error);}}}
 busy=false;if(alive){$('#image-status').textContent=`Gotowe. Przetworzono ${results.length} z ${selected.length} plików.`;$<HTMLButtonElement>('#process').disabled=false;$<HTMLButtonElement>('#clear-files').disabled=false;$('#zip').hidden=results.length<1;}};
 $('#zip').onclick=async()=>{try{await zipDownload(results);}catch{toast('Nie udało się utworzyć ZIP. Pobierz zdjęcia osobno.');}};cleanup=()=>{alive=false;urls.forEach(u=>URL.revokeObjectURL(u));selected=[];results=[];};}
interface InstallEvent extends Event{prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>}
let installEvent:InstallEvent|null=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e as InstallEvent;$('#install').hidden=false;});$('#install').onclick=async()=>{if(installEvent){await installEvent.prompt();await installEvent.userChoice;installEvent=null;$('#install').hidden=true;}};
window.addEventListener('appinstalled',()=>{$('#install').hidden=true;toast('Przybornik został zainstalowany.');});
const connection=()=>$('#connection').textContent=navigator.onLine?'● Lokalnie na Twoim urządzeniu':'● Tryb offline';window.addEventListener('online',connection);window.addEventListener('offline',connection);connection();
if ('serviceWorker' in navigator) {
 const worker = navigator.serviceWorker;
 let controller = worker.controller;
 worker.addEventListener('controllerchange', () => {
  const next = worker.controller;
  if (controller && next && controller !== next) location.reload();
  controller = next;
 });
 worker.register(new URL('sw.js', document.baseURI), { updateViaCache: 'none' }).then(registration => {
  const showUpdate = () => {
   if (!worker.controller || !registration.waiting) return;
   $('#update').hidden = false;
   $('#update button').onclick = () => registration.waiting?.postMessage('SKIP_WAITING');
  };
  const watchInstallation = () => registration.installing?.addEventListener('statechange', showUpdate);
  showUpdate();
  watchInstallation();
  registration.addEventListener('updatefound', watchInstallation);
 }).catch(() => {
  // The source-only dev server has no generated Service Worker.
 });
}
route();
