// Zadanie 50: wykres „przeoczenia vs ramki na czystym aucie” z ocena/siatka20-punkty.json (128 konfiguracji v3, zad. 20).
// Użycie: node ocena/wykres50.mjs <ścieżka do chrome> [wyj.png]   (wymaga playwright-core; bez karty)
// v2 (zad. 19) i v1 (baza, zad. 2) — liczby z WYNIK w docs/decyzje.md; v1 nie ma zapisanej śr. liczby ramek (linia pozioma).
import {readFileSync} from 'fs';
import {chromium} from 'playwright-core';
const J=JSON.parse(readFileSync(new URL('./siatka20-punkty.json',import.meta.url)));
const out=process.argv[3]||'docs/zrzuty/wykresy/przeoczenia-vs-ramki.png';
const ZE={zwykly:{t:'Zestaw zwykły (64 dodatki, 32 czyste)',v2:[4.2,18.8],v1y:12.5,c:'#1e6fb5'},trudny:{t:'Zestaw trudny (62 dodatki, 40 czystych)',v2:[12.9,17.7],v1y:17.7,c:'#b45309'}};
const W=620,H=470,L=60,R=20,T=50,B=60,XM=28,YM=25;
const sx=x=>L+(Math.min(x,XM)/XM)*(W-L-R), sy=y=>T+(1-y/YM)*(H-T-B);
function panel(z,ox){const Z=ZE[z],p=J.punkty;const w=J.wybrana;let s=`<g transform="translate(${ox},0)">`;
 s+=`<text x="${L}" y="26" font-size="17" font-weight="700" fill="#1e3a5f">${Z.t}</text>`;
 s+=`<rect x="${L}" y="${sy(25)}" width="${W-L-R}" height="${sy(10)-sy(25)}" fill="#fde8e6" opacity=".45"/><line x1="${L}" x2="${W-R}" y1="${sy(10)}" y2="${sy(10)}" stroke="#a2241a" stroke-dasharray="6 4"/><text x="${W-R-4}" y="${sy(10)-5}" font-size="12" fill="#a2241a" text-anchor="end">cel: przeoczenia ≤ 10% (P31)</text>`;
 s+=`<line x1="${sx(6)}" x2="${sx(6)}" y1="${T}" y2="${H-B}" stroke="#555" stroke-dasharray="3 3"/><text x="${sx(6)+4}" y="${T+12}" font-size="12" fill="#555">cel: ≤ 6 ramek (P30 B)</text>`;
 for(let y=0;y<=25;y+=5)s+=`<line x1="${L}" x2="${W-R}" y1="${sy(y)}" y2="${sy(y)}" stroke="#ddd"/><text x="${L-8}" y="${sy(y)+4}" font-size="12" text-anchor="end">${y}%</text>`;
 for(let x=0;x<=28;x+=4)s+=`<text x="${sx(x)}" y="${H-B+18}" font-size="12" text-anchor="middle">${x}${x==28?'+':''}</text>`;
 s+=`<text x="${(L+W-R)/2}" y="${H-B+42}" font-size="13" text-anchor="middle">średnia liczba ramek na czystym aucie</text><text transform="translate(16,${(T+H-B)/2}) rotate(-90)" font-size="13" text-anchor="middle">przeoczenia (% dodatków)</text>`;
 s+=`<line x1="${L}" x2="${W-R}" y1="${sy(Z.v1y)}" y2="${sy(Z.v1y)}" stroke="#6b7280" stroke-width="2" stroke-dasharray="2 4"/><text x="${L+6}" y="${sy(Z.v1y)-6}" font-size="12" fill="#444">v1 (baza): ${Z.v1y}% — śr. ramek nie zapisano</text>`;
 for(const q of p){const d=q[z];s+=`<circle cx="${sx(d.ramki_sr)}" cy="${sy(d.przeoczenia_pct)}" r="4" fill="${Z.c}" opacity=".35"/>`}
 s+=`<rect x="${sx(Z.v2[0])-6}" y="${sy(Z.v2[1])-6}" width="12" height="12" fill="#6b21a8"/><text x="${sx(Z.v2[0])+10}" y="${sy(Z.v2[1])+4}" font-size="12" fill="#6b21a8">v2: ${String(Z.v2[0]).replace('.',',')} ramek, ${String(Z.v2[1]).replace('.',',')}%</text>`;
 const q=p.find(q=>q.konf===w)[z];
 s+=`<polygon points="${sx(q.ramki_sr)},${sy(q.przeoczenia_pct)-11} ${sx(q.ramki_sr)+10},${sy(q.przeoczenia_pct)+8} ${sx(q.ramki_sr)-10},${sy(q.przeoczenia_pct)+8}" fill="#15803d" stroke="#fff"/><text x="${sx(q.ramki_sr)+14}" y="${sy(q.przeoczenia_pct)-14}" font-size="13" font-weight="700" fill="#15803d">v3 wybrana: ${String(q.ramki_sr.toFixed(2)).replace('.',',')} ramek, ${String(q.przeoczenia_pct.toFixed(1)).replace('.',',')}% (${q.Y}/${q.M})</text>`;
 return s+'</g>';}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${2*W}" height="${H+40}" font-family="Arial,sans-serif"><rect width="100%" height="100%" fill="#fff"/><text x="${W}" y="${H+22}" font-size="13" text-anchor="middle" fill="#444">Kropki: 128 konfiguracji v3 (zad. 20). Trójkąt: wybrana konfiguracja (WYNIK zad. 20). Kwadrat: v2 (zad. 19). Dane sztuczne — demonstracja; nie są wynikami na obrazach KAS. Źródło: ocena/siatka20-punkty.json.</text>${panel('zwykly',0)}${panel('trudny',W)}</svg>`;
const b=await chromium.launch({executablePath:process.argv[2],args:['--no-sandbox']});
const pg=await b.newPage({viewport:{width:2*W,height:H+40}});await pg.setContent(`<body style="margin:0">${svg}</body>`);await pg.screenshot({path:out});await b.close();console.log('zapisano',out);
