import {test} from 'node:test';import assert from 'node:assert/strict';
import {calculate,convert,units,password,zonedInstant,remaining} from '../src/core.ts';
for(const [source,value] of [['2+3*4',14],['(2+3)*4',20],['2^3^2',512],['-2^2',-4],['sqrt(81)',9],['log(1000)',3],['ln(e)',1],['sin(30)',.5],['cos(60)',.5],['tan(45)',1],['50% * 200',100],['1,5+2.5',4],['1e3/4',250],['abs(-8)',8]] as const)test('Kalkulator: '+source,()=>assert.ok(Math.abs(calculate(source)-value)<1e-10));
for(const source of ['','1/0','sqrt(-1)','alert(1)','2+','(2+3','2 3','2**3','Infinity','globalThis'])test('Odrzucenie wyrażenia: '+source,()=>assert.throws(()=>calculate(source)));
test('Trygonometria w radianach',()=>assert.ok(Math.abs(calculate('sin(pi/2)',false)-1)<1e-12));
test('Jednostki: długość i temperatura',()=>{assert.equal(convert(1,'Długość',3,2),1000);assert.ok(Math.abs(convert(32,'Temperatura',1,0))<1e-10);assert.ok(Math.abs(convert(100,'Temperatura',0,1)-212)<1e-10);assert.equal(convert(1,'Dane cyfrowe',5,1),1024);});
for(const category of Object.keys(units))test('Konwersje odwrotne: '+category,()=>{for(let a=0;a<units[category].length;a++)for(let b=0;b<units[category].length;b++){const result=convert(convert(123.456,category,a,b),category,b,a);assert.ok(Math.abs(result-123.456)<1e-8,category);}});
test('Hasła: każda włączona grupa, długość i wykluczenia',()=>{const seen=new Set<string>();for(let i=0;i<250;i++){const p=password(24,[true,true,true,true],true);assert.equal(p.length,24);assert.match(p,/[a-z]/);assert.match(p,/[A-Z]/);assert.match(p,/[0-9]/);assert.match(p,/[!@#$%^&*()\-_=+\[\]{}:;,.?]/);assert.doesNotMatch(p,/[ilI1oO0|]/);seen.add(p);}assert.equal(seen.size,250);});
test('Hasła: błędne parametry i tylko cyfry',()=>{assert.throws(()=>password(20,[false,false,false,false],true));assert.throws(()=>password(3,[true,true,true,true],true));assert.throws(()=>password(129,[true],false));assert.match(password(20,[false,false,true,false],false),/^\d{20}$/);});
test('Strefy: Warszawa zimą i latem',()=>{assert.equal(zonedInstant('2026-01-15T12:00','Europe/Warsaw'),Date.parse('2026-01-15T11:00Z'));assert.equal(zonedInstant('2026-07-15T12:00','Europe/Warsaw'),Date.parse('2026-07-15T10:00Z'));});
test('Strefy: nieistniejąca i powtórzona godzina',()=>{assert.throws(()=>zonedInstant('2026-03-29T02:30','Europe/Warsaw'));assert.throws(()=>zonedInstant('2026-10-25T02:30','Europe/Warsaw'));assert.equal(zonedInstant('2026-10-25T02:30','Europe/Warsaw','later')-zonedInstant('2026-10-25T02:30','Europe/Warsaw','earlier'),3600000);});
test('Strefy: półgodzinny offset i błędna data',()=>{assert.equal(zonedInstant('2026-01-15T12:00','Asia/Kolkata'),Date.parse('2026-01-15T06:30Z'));assert.throws(()=>zonedInstant('2026-02-30T12:00','UTC'));assert.throws(()=>zonedInstant('2026-01-01T25:00','UTC'));});
test('Timer nadrabia czas po uśpieniu',()=>{assert.equal(remaining(10000,1000),9);assert.equal(remaining(10000,1001),9);assert.equal(remaining(10000,90000),0);assert.equal(remaining(10000,9999),1);});
test('Kalkulator: limit długości wejścia',()=>assert.throws(()=>calculate('1+'.repeat(2000)+'1')));

test('Kalkulator odrzuca błędy ukryte w pośrednich wynikach', () => {
  for (const expression of ['1/(1/0)', 'sqrt(-1)^0', '1e999^0', '1/(1e308*1e308)']) {
    assert.throws(() => calculate(expression), /działanie lub wynik poza zakresem/, expression);
  }
});

test('Kalkulator odrzuca tangens przy nieparzystej wielokrotności kąta prostego', () => {
  assert.throws(() => calculate('tan(90)'));
  assert.throws(() => calculate('tan(-270)'));
  assert.throws(() => calculate('tan(pi/2)', false));
  assert.ok(Number.isFinite(calculate('tan(89.999)')));
});
