#!/bin/sh
# Zadanie 43 (P91 D1) — miniatura z zaznaczonymi miejscami w raporcie partii; odbiór prawdziwymi kliknięciami na żywym linku.
# Uruchomienie: sh strona/testy/odbior-43-klik.sh [adres] [katalog na zrzuty]
# Sprawdza: kolumna „Obraz” z miniaturą przy każdym aucie (ramki = kolor #e08a00 z już policzonych miejsc, cysterna bez ramek
# + „brak wzorca”), bez liczenia od nowa; zapis daje raport-partii.json, .csv (pola bez zmian) i raport-partii.html z miniaturami.
set -e
URL=${1:-https://hacknation.ksefbot.pl}
ZR=${2:-docs/zrzuty/mvp}
POB=$(mktemp -d)
B="agent-browser --download-path $POB"
ok() { echo "ok  $1"; }
zle() { echo "BŁĄD $1"; exit 1; }
ev() { $B eval "$1"; }
jest() { [ "$(ev "$1")" = "true" ] || zle "$2"; ok "$2"; }
kl() { $B scrollintoview "$1" >/dev/null 2>&1 || true; $B click "$1" >/dev/null; }
agent-browser close >/dev/null 2>&1 || true
$B set viewport 1024 768 >/dev/null
$B open "$URL/" >/dev/null
kl "#start"; kl "#pokazowa"; kl "#policz"
for i in $(seq 90); do [ "$(ev 'S.partia.length===7 && !S.liczy && S.partia.every(a=>a.miejsca||a.zepsuty)')" = "true" ] && break; sleep 2; done
[ "$(ev 'S.liczy')" = "false" ] || zle "partia się nie policzyła"
kl '#p-wiersze tr[data-i="0"]'; kl "#a-dec button.ok"   # jedna decyzja w aucie 1
kl "#dolisty"; kl "#doraportu"
N0=$(ev 'performance.getEntriesByType("resource").filter(e=>/partia-pokazowa|analiza/.test(e.name)).length')
for i in $(seq 30); do [ "$(ev '[...document.querySelectorAll("#r-wiersze img.rmini")].filter(i=>i.complete&&i.naturalWidth>0).length===7')" = "true" ] && break; sleep 1; done
jest '[...document.querySelectorAll("#r-wiersze img.rmini")].filter(i=>i.complete&&i.naturalWidth===320).length===7 && document.querySelector("#E7 th").textContent==="Obraz"' "kolumna „Obraz”: miniatura 320 px przy każdym z 7 aut"
# piksele w kolorze ramki (#e08a00) na miniaturze: auta z miejscami > 0, cysterna (auto 6) = 0
PIX='(n)=>{const i=document.querySelector(`#r-wiersze tr[data-auto="${n}"] img.rmini`),c=document.createElement("canvas");c.width=i.naturalWidth;c.height=i.naturalHeight;const g=c.getContext("2d");g.drawImage(i,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let k=0;for(let j=0;j<d.length;j+=4)if(Math.abs(d[j]-224)<8&&Math.abs(d[j+1]-138)<8&&d[j+2]<8)k++;return k}'
echo "    piksele ramek: $(ev "const f=$PIX;[1,2,3,4,5,6,7].map(n=>n+':'+f(n)).join(' ')")"
jest "const f=$PIX;[1,2,3,4,5,7].every(n=>f(n)>50) && f(6)===0" "ramki na miniaturach aut z miejscami, cysterna bez ramek"
jest '/brak wzorca/.test(document.querySelector("#r-wiersze tr[data-auto=\"6\"] td").textContent)' "cysterna: „brak wzorca” pod miniaturą"
jest "performance.getEntriesByType(\"resource\").filter(e=>/partia-pokazowa|analiza/.test(e.name)).length===$N0" "miniatury bez liczenia od nowa (zero zapytań do karty)"
$B scrollintoview "#E7 h2" >/dev/null 2>&1 || true
$B screenshot "$ZR/link-43-raport.png" >/dev/null
kl "#zapisz"
[ "$($B is visible '#mimo')" = "true" ] && kl "#mimo" || true
for i in $(seq 20); do [ -f "$POB/raport-partii.html" ] && break; ls "$POB"/*.html >/dev/null 2>&1 && break; sleep 1; done
ls "$POB"
node -e '
const fs=require("fs"),p=process.argv[1],pl=fs.readdirSync(p),f=(e)=>pl.find(x=>x.endsWith(e));
if(!f(".json")||!f(".csv")||!f(".html")){console.log("BŁĄD brak plików: "+pl);process.exit(1)}
const r=JSON.parse(fs.readFileSync(p+"/"+f(".json"),"utf8"));
const pola=["id_kontroli","auto","plik","nr_rej","rodzaj_programu","bez_wzorca","rodzaj_operatora","liczba_miejsc","wynik_przykladowy","decyzje","kto","miejsce_kontroli","data_godzina","zamkniete","otwarte"];
if(JSON.stringify(Object.keys(r[0]))!==JSON.stringify(pola))throw "pola .json: "+Object.keys(r[0]);
const k=fs.readFileSync(p+"/"+f(".csv"),"utf8").replace(/^﻿/,"").split("\n")[0];
if(k!=="id_kontroli;auto;plik;nr_rej;rodzaj_programu;rodzaj_operatora;miejsce;decyzja;powod;kto;miejsce_kontroli;data_godzina")throw "csv: "+k;
const h=fs.readFileSync(p+"/"+f(".html"),"utf8"),im=(h.match(/<img src="data:image\/png;base64,/g)||[]).length;
const w6=h.slice(h.indexOf("id=\"auto-6\""),h.indexOf("id=\"auto-7\""));
if(im!==7||!/brak wzorca/.test(w6)||!/1: zatwierdzone/.test(h)||/https?:\/\//.test(h))throw "html: obrazków "+im;
console.log("ok  pobrane: .json (pola bez zmian, "+r.length+" aut), .csv (nagłówek bez zmian), .html "+Math.round(h.length/1024)+" KB: 7 miniatur w środku, bez odnośników do sieci, auto 6 „brak wzorca”");' "$POB"
cp "$POB/raport-partii.html" "${ODBIOR_KOPIA:-/tmp}/" 2>/dev/null || true
$B open "file://$POB/raport-partii.html" >/dev/null
$B screenshot "$ZR/link-43-raport-html.png" >/dev/null
echo "WYNIK: odbiór 43 na $URL — wszystko ok"
