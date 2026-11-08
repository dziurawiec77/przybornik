export function calculate(source: string, degrees = true): number {
  if (source.length > 2048) throw Error('Wyrażenie jest zbyt długie (maks. 2048 znaków).');
  const tokens = source.replace(/,/g, '.').replace(/π/g, 'pi').replace(/×/g, '*').replace(/÷/g, '/')
    .match(/(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?|[a-z]+|[^\s]/g) ?? [];
  let position = 0;
  const angle = (value: number) => degrees ? value * (Math.PI / 180) : value;
  const quarterTurn = degrees ? 90 : Math.PI / 2;
  const functions: Record<string, (value: number) => number> = {
    sqrt: Math.sqrt,
    ln: Math.log,
    log: Math.log10,
    abs: Math.abs,
    sin: value => Math.sin(angle(value)),
    cos: value => Math.cos(angle(value)),
    tan: value => Math.abs(value % (2 * quarterTurn)) === quarterTurn ? NaN : Math.tan(angle(value)),
  };
  const operators: Record<string, { precedence: number; apply: (left: number, right: number) => number }> = {
    '+': { precedence: 10, apply: (left, right) => left + right },
    '-': { precedence: 10, apply: (left, right) => left - right },
    '*': { precedence: 20, apply: (left, right) => left * right },
    '/': { precedence: 20, apply: (left, right) => left / right },
    '^': { precedence: 30, apply: (left, right) => left ** right },
  };
  const invalidResult = 'Nieprawidłowe działanie lub wynik poza zakresem.';
  const finite = (value: number) => {
    if (!Number.isFinite(value)) throw Error(invalidResult);
    return value;
  };

  function expression(minimumPrecedence = 0): number {
    const token = tokens[position++];
    let left: number;
    if (token === '+' || token === '-') {
      left = (token === '-' ? -1 : 1) * expression(25);
    } else if (token === '(') {
      left = expression();
      if (tokens[position++] !== ')') throw Error('Brakuje nawiasu zamykającego.');
    } else if (token === 'pi') {
      left = Math.PI;
    } else if (token === 'e') {
      left = Math.E;
    } else if (Object.hasOwn(functions, token)) {
      if (tokens[position++] !== '(') throw Error('Funkcja wymaga nawiasów.');
      left = finite(functions[token](expression()));
      if (tokens[position++] !== ')') throw Error('Brakuje nawiasu zamykającego.');
    } else if (token && /^[\d.]/.test(token)) {
      left = finite(Number(token));
    } else {
      throw Error('Nieprawidłowe wyrażenie.');
    }

    while (position < tokens.length) {
      const symbol = tokens[position];
      if (symbol === '%') {
        position++;
        left /= 100;
        continue;
      }
      const operator = operators[symbol];
      if (!Object.hasOwn(operators, symbol) || operator.precedence < minimumPrecedence) break;
      position++;
      const right = expression(operator.precedence + (symbol === '^' ? 0 : 1));
      left = finite(operator.apply(left, right));
    }
    return left;
  }

  const result = expression();
  if (position !== tokens.length) throw Error(invalidResult);
  return result;
}
export const units:Record<string,{name:string;factor:number;offset?:number}[]>={
 'Długość':[{name:'Milimetry',factor:.001},{name:'Centymetry',factor:.01},{name:'Metry',factor:1},{name:'Kilometry',factor:1000},{name:'Cale',factor:.0254},{name:'Stopy',factor:.3048},{name:'Jardy',factor:.9144},{name:'Mile',factor:1609.344}],
 'Masa':[{name:'Miligramy',factor:.000001},{name:'Gramy',factor:.001},{name:'Kilogramy',factor:1},{name:'Tony',factor:1000},{name:'Funty',factor:.45359237},{name:'Uncje',factor:.028349523125}],
 'Temperatura':[{name:'Celsjusz (°C)',factor:1,offset:273.15},{name:'Fahrenheit (°F)',factor:5/9,offset:255.3722222222222},{name:'Kelwin (K)',factor:1}],
 'Powierzchnia':[{name:'Milimetry kwadratowe',factor:1e-6},{name:'Centymetry kwadratowe',factor:.0001},{name:'Metry kwadratowe',factor:1},{name:'Hektary',factor:10000},{name:'Kilometry kwadratowe',factor:1e6},{name:'Akry',factor:4046.8564224}],
 'Objętość':[{name:'Mililitry',factor:.001},{name:'Litry',factor:1},{name:'Metry sześcienne',factor:1000},{name:'Galony (USA)',factor:3.785411784}],
 'Prędkość':[{name:'Metry na sekundę',factor:1},{name:'Kilometry na godzinę',factor:1/3.6},{name:'Mile na godzinę',factor:.44704},{name:'Węzły',factor:.514444444444}],
 'Czas':[{name:'Milisekundy',factor:.001},{name:'Sekundy',factor:1},{name:'Minuty',factor:60},{name:'Godziny',factor:3600},{name:'Dni',factor:86400},{name:'Tygodnie',factor:604800}],
 'Dane cyfrowe':[{name:'Bity',factor:.125},{name:'Bajty',factor:1},{name:'Kilobajty (kB)',factor:1000},{name:'Megabajty (MB)',factor:1e6},{name:'Gigabajty (GB)',factor:1e9},{name:'Kibibajty (KiB)',factor:1024},{name:'Mebibajty (MiB)',factor:1024**2},{name:'Gibibajty (GiB)',factor:1024**3}]
};
export function convert(n:number,category:string,from:number,to:number){const a=units[category][from],b=units[category][to];return (n*a.factor+(a.offset||0)-(b.offset||0))/b.factor;}
export const pools=['abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ','0123456789','!@#$%^&*()-_=+[]{}:;,.?'];
function randomIndex(max:number){const a=new Uint32Array(1);const limit=2**32-(2**32%max);do{crypto.getRandomValues(a);}while(a[0]>=limit);return a[0]%max;}
export function password(length:number,enabled:boolean[],exclude:boolean){const groups=pools.filter((_,i)=>enabled[i]).map(p=>exclude?p.replace(/[ilI1oO0|]/g,''):p);if(!groups.length)throw Error('Wybierz co najmniej jeden zestaw znaków.');if(!Number.isInteger(length)||length<groups.length||length>128)throw Error('Nieprawidłowa długość.');const all=groups.join('');const chars=groups.map(p=>p[randomIndex(p.length)]);while(chars.length<length)chars.push(all[randomIndex(all.length)]);for(let i=chars.length-1;i>0;i--){const j=randomIndex(i+1);[chars[i],chars[j]]=[chars[j],chars[i]];}return chars.join('');}
export function zonedInstant(local:string,zone:string,disambiguation:'earlier'|'later'|'reject'='reject'){
 const m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(local);if(!m)throw Error('Nieprawidłowa data.');
 const target=Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+(m[6]||0));
 const check=new Date(target);if(check.getUTCFullYear()!==+m[1]||check.getUTCMonth()!==+m[2]-1||check.getUTCDate()!==+m[3]||check.getUTCHours()!==+m[4]||check.getUTCMinutes()!==+m[5]||check.getUTCSeconds()!==+(m[6]||0))throw Error('Nieprawidłowa data.');
 const fmt=new Intl.DateTimeFormat('sv-SE',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 const parts=(time:number)=>{const p=Object.fromEntries(fmt.formatToParts(time).map(x=>[x.type,x.value]));return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);};
 const offsets=new Set<number>();for(let h=-48;h<=48;h+=6){const t=target+h*3600000;offsets.add(parts(t)-t);}
 const found=[...offsets].map(o=>target-o).filter(t=>parts(t)===target).sort((a,b)=>a-b);
 if(!found.length)throw Error('Ta godzina nie istnieje w tej strefie (zmiana czasu).');
 if(found.length>1&&disambiguation==='reject')throw Error('Godzina występuje dwukrotnie. Wybierz wcześniejsze lub późniejsze wystąpienie.');
 return disambiguation==='later'?found[found.length-1]:found[0];
}
export function remaining(deadline:number,now=Date.now()){return Math.max(0,Math.ceil((deadline-now)/1000));}
export function formatNumber(n:number){return new Intl.NumberFormat('pl-PL',{maximumSignificantDigits:14}).format(n);}
