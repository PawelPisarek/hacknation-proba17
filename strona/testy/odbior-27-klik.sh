#!/bin/sh
# Zadanie 27 — „Zmień rodzaj” (P24 B / P27 A, A7): odbiór prawdziwymi kliknięciami (agent-browser) na żywym linku.
# Uruchomienie: sh strona/testy/odbior-27-klik.sh [adres] [katalog na zrzuty]
# Auto 7 (trudny: firanka za ładunkiem): decyzja → „Zmień rodzaj” → lista 4 rodzajów (jedno kliknięcie) → 2 wzorce
# wybranego rodzaju → „Zastosuj” liczy auto od nowa z &typ= → decyzje znikają → raport .json/.csv z oboma rodzajami.
# Auto 1 → cysterna → E5 (brak wzorca, bez liczenia). Odmiana „i jeszcze N miejsc” (auto 1: 2 miejsca, auto 5: 1 miejsce).
set -e
URL=${1:-https://hacknation.ksefbot.pl}
ZR=${2:-docs/zrzuty/mvp}
POB=$(mktemp -d)
B="agent-browser --download-path $POB"
ok() { echo "ok  $1"; }
zle() { echo "BŁĄD $1"; exit 1; }
ev() { $B eval "$1"; }
jest() { [ "$(ev "$1")" = "true" ] || zle "$2"; ok "$2"; }
widac() { [ "$($B is visible "$1")" = "true" ] || zle "niewidoczne: $1"; }
kl() { $B scrollintoview "$1" >/dev/null 2>&1 || true; $B click "$1" >/dev/null; }   # wiersz pod dolną krawędzią ekranu: najpierw przewiń
evs() { ev "$1" | tr -d '"'; }
agent-browser close >/dev/null 2>&1 || true   # katalog pobrań działa od startu przeglądarki
$B set viewport 390 844 >/dev/null
$B open "$URL/" >/dev/null
kl "#start"; kl "#pokazowa"; kl "#policz"
for i in $(seq 90); do [ "$(ev 'S.partia.length===7 && !S.liczy && S.partia.every(a=>a.miejsca||a.zepsuty)')" = "true" ] && break; sleep 2; done
[ "$(ev 'S.liczy')" = "false" ] || zle "partia się nie policzyła"
# odmiana napisu (uwaga po odbiorze 28)
kl '#p-wiersze tr[data-i="0"]'
[ "$($B get text '#pokazwiecej')" = "i jeszcze 2 miejsca — pokaż" ] && ok "auto 1: „i jeszcze 2 miejsca — pokaż”" || zle "odmiana auto 1: $($B get text '#pokazwiecej')"
kl "#dolisty"; kl '#p-wiersze tr[data-i="4"]'
[ "$($B get text '#pokazwiecej')" = "i jeszcze 1 miejsce — pokaż" ] && ok "auto 5: „i jeszcze 1 miejsce — pokaż”" || zle "odmiana auto 5: $($B get text '#pokazwiecej')"
# A7 na aucie 7
kl "#dolisty"; kl '#p-wiersze tr[data-i="6"]'
PROG=$(evs 'A().rodzaj'); PRZED=$(evs 'JSON.stringify(A().miejsca.map(m=>[m.x0,m.y0]))')
NOWY=$(evs '["kontener","chlodnia","firanka"].find(r=>r!==A().rodzaj)')
echo "    auto 7: program „$PROG”, $(ev 'A().miejsca.length') miejsc; operator zmienia na „$NOWY”"
kl "#a-dec button.ok"
jest 'Object.keys(A().decyzje).length===1' "auto 7: jedna decyzja przed zmianą"
widac "#zmienrodz"; kl "#zmienrodz"
jest '$("E6").classList.contains("on") && $("z-rodz").querySelectorAll("input[type=radio]").length===4' "A7 E6: lista 4 rodzajów"
jest '/\(program\)/.test($("z-rodz").innerText) && /skasowane/.test($("E6").innerText)' "A7 E6: rodzaj programu oznaczony, ostrzeżenie o kasowaniu decyzji"
kl "#z-rodz input[value=\"$NOWY\"]"
for i in $(seq 20); do [ "$(ev '["z-w0","z-w1"].every(i=>$(i).complete&&$(i).naturalWidth>0)')" = "true" ] && break; sleep 1; done
jest "S.zRodz===\"$NOWY\" && [\"z-w0\",\"z-w1\"].every(i=>\$(i).complete&&\$(i).naturalWidth>0) && \$(\"z-c0\").textContent.startsWith(\"wzorzec 1\") && \$(\"z-c1\").textContent.startsWith(\"wzorzec 2\")" "A7 jedno kliknięcie → podgląd 2 wzorców „$NOWY” (1 i 2, P70 A)"
$B screenshot "$ZR/link-27-zmiana.png" >/dev/null
kl "#z-zast"
for i in $(seq 60); do [ "$(ev '!S.liczy && $("E4").classList.contains("on")')" = "true" ] && break; sleep 1; done
jest "performance.getEntriesByType(\"resource\").some(e=>e.name.includes(\"partia-pokazowa?nr=6&typ=$NOWY\"))" "A7 „Zastosuj” liczy auto od nowa na karcie (&typ=$NOWY)"
jest "A().rodzaj===\"$PROG\" && A().rodzajOperatora===\"$NOWY\" && A().rodzajLiczony===\"$NOWY\" && A().stan===\"gotowe\"" "A7 rodzaj programu zostaje, rodzaj operatora i liczenie: $NOWY"
jest 'Object.keys(A().decyzje).length===0 && !A().zamkniete' "A7 decyzje auta skasowane"
jest "\$(\"E4\").innerText.includes(NAZWA[\"$NOWY\"]+\" (program: \"+NAZWA[\"$PROG\"]+\")\")" "A7 widok auta: wzorzec „$NOWY (program: $PROG)”"
PO=$(ev 'JSON.stringify(A().miejsca.map(m=>[m.x0,m.y0]))')
echo "    miejsca przed: $(echo "$PRZED" | head -c 80)…  po: $(echo "$PO" | head -c 80)… ($(ev 'A().miejsca.length') miejsc)"
$B screenshot "$ZR/link-27-po-zmianie.png" >/dev/null
kl "#a-dec button.ok"   # nowa decyzja po zmianie — trafi do raportu
# cysterna → E5 bez liczenia
kl "#dolisty"; kl '#p-wiersze tr[data-i="0"]'
N0=$(ev 'performance.getEntriesByType("resource").filter(e=>e.name.includes("partia-pokazowa")).length')
kl "#zmienrodz"; kl '#z-rodz input[value="cysterna"]'
jest '/brak wzorca/.test($("z-c0").textContent)' "cysterna: na E6 „brak wzorca”"
kl "#z-zast"; $B wait 500 >/dev/null
jest "A().stan===\"brak wzorca\" && A().miejsca.length===0 && A().rodzajOperatora===\"cysterna\" && performance.getEntriesByType(\"resource\").filter(e=>e.name.includes(\"partia-pokazowa\")).length===$N0" "cysterna → E5 (brak wzorca), bez liczenia na karcie"
$B screenshot "$ZR/link-27-cysterna.png" >/dev/null
# raport z oboma rodzajami
kl "#dolisty"; kl "#doraportu"
$B scrollintoview "#r-wiersze tr:nth-child(7)" >/dev/null 2>&1 || true
$B screenshot "$ZR/link-27-raport.png" >/dev/null
kl "#zapisz"
[ "$($B is visible '#mimo')" = "true" ] && kl "#mimo" || true
$B wait 2000 >/dev/null
node -e '
const fs=require("fs"),[p,prog,nowy]=process.argv.slice(1),pliki=fs.readdirSync(p),N={chlodnia:"chłodnia"},n=(r)=>N[r]||r;
const j=pliki.find(f=>f.endsWith(".json")),c=pliki.find(f=>f.endsWith(".csv"));
if(!j||!c){console.log("BŁĄD brak pobranych plików: "+pliki);process.exit(1)}
const r=JSON.parse(fs.readFileSync(p+"/"+j,"utf8")),a7=r.find(x=>x.auto===7),a1=r.find(x=>x.auto===1);
if(!a7.rodzaj_programu.startsWith(n(prog))||a7.rodzaj_operatora!==n(nowy)||a7.decyzje[0].decyzja!=="zatwierdzone")throw "auto 7: "+JSON.stringify(a7);
if(a1.rodzaj_operatora!=="cysterna"||a1.liczba_miejsc!==0)throw "auto 1: "+JSON.stringify(a1);
console.log("ok  .json auto 7: rodzaj_programu="+a7.rodzaj_programu+", rodzaj_operatora="+a7.rodzaj_operatora+", "+a7.liczba_miejsc+" miejsc; auto 1: operator=cysterna, 0 miejsc");
const k=fs.readFileSync(p+"/"+c,"utf8").replace(/^﻿/,"").split("\n"),h=k[0].split(";"),w=k.slice(1).map(l=>l.split(";")).filter(x=>x[1]==="7");
const ip=h.indexOf("rodzaj_programu"),io=h.indexOf("rodzaj_operatora");
if(!w.length||!w.every(x=>x[ip].startsWith(n(prog))&&x[io]===n(nowy)))throw "csv auto 7: "+JSON.stringify(w[0]);
console.log("ok  .csv auto 7: "+w.length+" wierszy, rodzaj_programu="+w[0][ip]+", rodzaj_operatora="+w[0][io]);
' "$POB" "$PROG" "$NOWY"
cp "$POB"/* "${ODBIOR_KOPIA:-/tmp}/" 2>/dev/null || true
echo "WYNIK: odbiór 27 na $URL — wszystko ok"
