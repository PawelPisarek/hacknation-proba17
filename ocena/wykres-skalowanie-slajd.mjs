// Zadanie 8 slajd „Skalowanie” (P97 A): słupki aut/h na 1 kartę. Liczby wyłącznie z README „Skalowanie”.
// Użycie: node ocena/wykres-skalowanie-slajd.mjs <ścieżka do chrome> [wyj.png]   (playwright-core; bez karty)
import {chromium} from 'playwright-core';
const out=process.argv[3]||'docs/zrzuty/wykresy/skalowanie-slajd.png';
const D=[
 {n:'Samo liczenie — zestaw zwykły',v:2080,l:'ok. 2 080',s:'3600 s ÷ 1,73 s, bez wczytania pliku',c:'#1e6fb5'},
 {n:'Samo liczenie — zestaw trudny',v:3020,l:'ok. 3 020',s:'3600 s ÷ 1,19 s, bez wczytania pliku',c:'#1e6fb5'},
 {n:'Przez stronę (1 stanowisko)',v:70,l:'ok. 70',s:'rząd wielkości: 3600 ÷ ~52 s, jeden pomiar (n=1)',c:'#b45309'}];
const W=1240,H=520,L=330,R=40,T=70,B=70,M=4600,bh=70,gap=40;
const sx=v=>L+(v/M)*(W-L-R);
let s=`<text x="${L}" y="32" font-size="26" font-weight="700" fill="#1e3a5f">Auta na godzinę na 1 kartę (GTX 1050)</text>`;
for(let v=0;v<=4000;v+=1000)s+=`<line x1="${sx(v)}" x2="${sx(v)}" y1="${T-10}" y2="${H-B+5}" stroke="#ddd"/><text x="${sx(v)}" y="${H-B+28}" font-size="18" text-anchor="middle">${v.toLocaleString('pl-PL')}</text>`;
D.forEach((d,i)=>{const y=T+i*(bh+gap);
 s+=`<text x="${L-14}" y="${y+bh/2-2}" font-size="20" text-anchor="end" font-weight="600">${d.n}</text><rect x="${L}" y="${y}" width="${sx(d.v)-L}" height="${bh}" fill="${d.c}"/>`;
 s+=`<text x="${sx(d.v)+10}" y="${y+bh/2-2}" font-size="24" font-weight="700" fill="${d.c}">${d.l}</text><text x="${sx(d.v)+10}" y="${y+bh/2+22}" font-size="16" fill="#444">${d.s}</text>`;});
s+=`<text x="${W/2}" y="${H-12}" font-size="15" text-anchor="middle" fill="#444">Wyliczenia z pomiarów 1,73 s / 1,19 s na obraz 50 MB; wysyłka pliku przez sieć ok. 45 s. Wzrost z liczbą kart: założenie, niemierzone. Dane sztuczne — demonstracja.</text>`;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="Arial,sans-serif"><rect width="100%" height="100%" fill="#fff"/>${s}</svg>`;
const b=await chromium.launch({executablePath:process.argv[2],args:['--no-sandbox']});
const pg=await b.newPage({viewport:{width:W,height:H}});await pg.setContent(`<body style="margin:0">${svg}</body>`);await pg.screenshot({path:out});await b.close();console.log('zapisano',out);
