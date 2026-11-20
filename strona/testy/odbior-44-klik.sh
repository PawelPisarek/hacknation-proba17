#!/bin/sh
# Zadanie 44 (P92 A) — miniatura w „Raporcie partii” na stronie 320 px jak w pobranym raporcie, numery miejsc czytelne,
# okno 1280 i 390 px bez rozjazdu. Odbiór prawdziwymi kliknięciami: sh strona/testy/odbior-44-klik.sh [adres] [katalog na zrzuty]
set -e
URL=${1:-https://hacknation.ksefbot.pl}
ZR=${2:-docs/zrzuty/mvp}
B="agent-browser"
ok() { echo "ok  $1"; }
zle() { echo "BŁĄD $1"; exit 1; }
ev() { $B eval "$1"; }
jest() { [ "$(ev "$1")" = "true" ] || zle "$2"; ok "$2"; }
kl() { $B scrollintoview "$1" >/dev/null 2>&1 || true; $B click "$1" >/dev/null; }
agent-browser close >/dev/null 2>&1 || true
$B set viewport 1280 800 >/dev/null
$B open "$URL/" >/dev/null
T0=$(date +%s)
kl "#start"; kl "#pokazowa"; kl "#policz"
for i in $(seq 90); do [ "$(ev 'S.partia.length===7 && !S.liczy && S.partia.every(a=>a.miejsca||a.zepsuty)')" = "true" ] && break; sleep 2; done
[ "$(ev 'S.liczy')" = "false" ] || zle "partia się nie policzyła"
echo "    partia pokazowa policzona w $(( $(date +%s) - T0 )) s"
kl '#p-wiersze tr[data-i="0"]'; kl "#a-dec button.ok"
kl "#dolisty"; kl "#doraportu"
for i in $(seq 30); do [ "$(ev '[...document.querySelectorAll("#r-wiersze img.rmini")].filter(i=>i.complete&&i.naturalWidth>0).length===7')" = "true" ] && break; sleep 1; done
SZ='[...document.querySelectorAll("#r-wiersze img.rmini")].map(i=>Math.round(i.getBoundingClientRect().width))'
ROZ='(()=>{const k=document.querySelector("#E7 .karta"),t=document.querySelector("#E7 table").parentElement;return {strona:document.documentElement.scrollWidth-innerWidth,karta:k.scrollWidth-k.clientWidth,tabela:t.scrollWidth-t.clientWidth}})()'
echo "    1280 px: szerokości miniatur $(ev "$SZ.join(',')"); nadmiar szerokości $(ev "JSON.stringify($ROZ)")"
jest "$SZ.every(w=>w===320)" "1280 px: każda z 7 miniatur na stronie ma 320 px (jak w pobranym raporcie)"
jest "(()=>{const r=$ROZ;return r.strona<=0&&r.karta<=0&&r.tabela<=0})()" "1280 px: tabela bez przewijania w bok"
jest '(()=>{const g=document.createElement("canvas").getContext("2d");g.font="bold 13px system-ui, sans-serif";return /bold 13px/.test(String(miniatura))})()' "numery miejsc: pogrubione 13 px na pasku 16 px (było 10/12)"
$B scrollintoview "#E7 h2" >/dev/null 2>&1 || true
$B screenshot "$ZR/link-44-E7-1280.png" >/dev/null
$B set viewport 390 844 >/dev/null
sleep 1
echo "    390 px: szerokości miniatur $(ev "$SZ.join(',')"); nadmiar szerokości $(ev "JSON.stringify($ROZ)")"
jest "$SZ.every(w=>w>=300&&w<=320)" "390 px: miniatury 300–320 px (cała szerokość karty)"
jest "(()=>{const r=$ROZ;return r.strona<=0&&r.karta<=0&&r.tabela<=0})()" "390 px: bez przewijania w bok, wiersze jako karty z podpisami pól"
$B scrollintoview "#E7 h2" >/dev/null 2>&1 || true
$B screenshot "$ZR/link-44-E7-390.png" >/dev/null
echo "WYNIK: odbiór 44 na $URL — wszystko ok"
