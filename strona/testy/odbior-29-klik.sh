#!/bin/sh
# Zadanie 29 — odbiór prawdziwymi kliknięciami w przeglądarce (agent-browser), z pobraniem raportu .json i .csv.
# Uruchomienie: sh strona/testy/odbior-29-klik.sh [adres]   (domyślnie żywy link)
# Każdy krok: widoczny przycisk/pole kliknięte jak przez człowieka; na końcu pliki z katalogu pobrań sprawdza node.
set -e
URL=${1:-https://hacknation.ksefbot.pl}
POB=$(mktemp -d)
B="agent-browser --download-path $POB"
ok() { echo "ok  $1"; }
zle() { echo "BŁĄD $1"; exit 1; }
widac() { [ "$($B is visible "$1")" = "true" ] || zle "niewidoczne: $1"; }
agent-browser close >/dev/null 2>&1 || true   # katalog pobrań działa od startu przeglądarki
$B set viewport 390 844 >/dev/null
$B open "$URL/" >/dev/null
widac "#start"; $B click "#start" >/dev/null
widac "#pokazowa"; $B click "#pokazowa" >/dev/null
$B click "#policz" >/dev/null
for i in $(seq 60); do [ "$($B eval "S.partia.length>0 && !S.liczy && S.partia.every(a=>a.miejsca||a.zepsuty)")" = "true" ] && break; sleep 2; done; [ "$($B eval "S.liczy")" = "false" ] || zle "partia się nie policzyła"
$B click '#p-wiersze tr[data-i="1"]' >/dev/null           # auto 2 (chłodnia, 6 miejsc)
widac "#a-dec"; ok "auto 2 otwarte z listy"
# A6: zatwierdzenie jednym kliknięciem, odrzucenie z powodem z listy
widac "#a-dec button.ok"; $B click "#a-dec button.ok" >/dev/null
$B select "#a-dec select" "zgłoszony ładunek" >/dev/null
for i in 3 4 5 6; do $B click "#a-dec button.ok" >/dev/null; done
[ "$($B eval 'A().miejsca.map((_,j)=>A().decyzje[j]).map(d=>d?d.d+(d.powod?":"+d.powod:""):"-").join(",")')" = '"zatwierdzone,odrzucone:zgłoszony ładunek,zatwierdzone,zatwierdzone,zatwierdzone,zatwierdzone"' ] && ok "A6 decyzje kliknięciami" || zle "A6"
# A9: bez nr rej. auto zostaje otwarte; z numerem Enter przechodzi dalej
$B focus "#a-nr" >/dev/null; $B press Enter >/dev/null
[ "$($B eval "S.ia")" = "1" ] && widac "#a-nr.alarm" && ok "A9 bez nr rej. auto nie zamknięte (pole alarmu)" || zle "A9 bez numeru"
$B fill "#a-nr" "wgm 12345" >/dev/null; $B press Enter >/dev/null
[ "$($B eval 'S.ia')" = "2" ] && ok "A9 z nr rej. następne auto" || zle "A9 z numerem"
# A13: zmiana decyzji w poprzednim aucie z listy
$B click "#dolisty" >/dev/null; $B click '#p-wiersze tr[data-i="1"]' >/dev/null
$B click '#a-kafle .kaf[data-i="0"]' >/dev/null
$B select "#a-dec select" "element konstrukcji" >/dev/null
[ "$($B eval 'S.partia[1].decyzje[0].powod')" = '"element konstrukcji"' ] && ok "A13 zmiana decyzji" || zle "A13"
# A11: raport, ostrzeżenie, zapis .json i .csv prawdziwym kliknięciem
$B click "#dolisty" >/dev/null; widac "#doraportu"; $B click "#doraportu" >/dev/null
widac "#zapisz"; $B click "#zapisz" >/dev/null
widac "#mimo"; $B click "#mimo" >/dev/null
$B wait 2000 >/dev/null
ls "$POB"
node -e '
const fs=require("fs"),p=process.argv[1],pliki=fs.readdirSync(p);
const j=pliki.find(f=>f.endsWith(".json")),c=pliki.find(f=>f.endsWith(".csv"));
if(!j||!c){console.log("BŁĄD brak pobranych plików: "+pliki);process.exit(1)}
const r=JSON.parse(fs.readFileSync(p+"/"+j,"utf8")),a2=r.find(x=>x.auto===2);
if(a2.nr_rej!=="WGM 12345"||a2.decyzje.length!==6||a2.decyzje[0].powod!=="element konstrukcji")throw "A11 auto 2: "+JSON.stringify(a2);
const k=fs.readFileSync(p+"/"+c,"utf8").split("\n");
if(!k[0].replace(/^\uFEFF/,"").startsWith("id_kontroli;auto;plik;nr_rej"))throw "csv: "+k[0];
console.log("ok  A11 pobrane "+j+" ("+r.length+" aut) i "+c+" ("+(k.length-1)+" wierszy)");' "$POB"
[ "$($B is visible '#r-nowa')" = "true" ] && ok "A13 partia zamknięta, „Nowa partia”" || zle "A13 zamknięcie"
cp "$POB"/* "${ODBIOR_KOPIA:-/tmp}/" 2>/dev/null || true
