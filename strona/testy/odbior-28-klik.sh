#!/bin/sh
# Zadanie 28 (+ poprawki z odbioru 29) — odbiór prawdziwymi kliknięciami (agent-browser) na żywym linku.
# Uruchomienie: sh strona/testy/odbior-28-klik.sh [adres] [katalog na zrzuty]
# A8: miniatury przed liczeniem, liczenie auto po aucie (podgląd stanu w trakcie), wejście dopiero po całej partii;
# A10: po ostatnim miejscu następne auto, po ostatnim aucie lista z „Raport partii”; „i jeszcze N miejsc — pokaż”;
# „Dodaj jeden obraz” (P61 A); „Zamknij auto” przy nr rej. (P77 A); „Zmień rodzaj” ukryty (P24 B/P27 A);
# po zamknięciu partii przyciski decyzji wyszarzone (A13).
set -e
URL=${1:-https://hacknation.ksefbot.pl}
ZR=${2:-docs/zrzuty/mvp}
B=agent-browser
ok() { echo "ok  $1"; }
zle() { echo "BŁĄD $1"; exit 1; }
ev() { $B eval "$1"; }
jest() { [ "$(ev "$1")" = "true" ] || zle "$2"; ok "$2"; }
widac() { [ "$($B is visible "$1")" = "true" ] || zle "niewidoczne: $1"; }
$B close >/dev/null 2>&1 || true
$B set viewport 390 844 >/dev/null
$B open "$URL/" >/dev/null
$B click "#start" >/dev/null; $B click "#pokazowa" >/dev/null
$B click "#policz" >/dev/null
# A8: w trakcie — część aut „czeka”, wiersze niekliknięte, miniatury z obrazem
$B wait 600 >/dev/null
ST=$(ev '[...document.querySelectorAll("#p-wiersze tr")].map(t=>t.querySelector(".stan").textContent).join(",")')
echo "    stan w trakcie: $ST"
case "$ST" in *czeka*|*"liczy się"*) ok "A8 liczy się po kolei (w trakcie: część aut czeka)";; *) zle "A8 brak stanu pośredniego: $ST";; esac
jest '[...document.querySelectorAll("#p-wiersze tr")].every(t=>!t.classList.contains("klik"))' "A8 w trakcie wiersze niekliknięte (P38)"
$B screenshot "$ZR/link-28-liczenie.png" >/dev/null
for i in $(seq 90); do [ "$(ev 'S.liczy')" = "false" ] && break; sleep 2; done
jest '[...document.querySelectorAll("#p-wiersze img.mini")].filter(i=>i.complete&&i.naturalWidth>0).length===7' "A8 miniatury 7/7 w kolumnie „Obraz”"
jest '[...document.querySelectorAll("#p-wiersze tr")].filter(t=>t.classList.contains("klik")).length===7' "A8 po całej partii wiersze klikalne"
[ "$($B get text '#dodaj')" = "Dodaj jeden obraz" ] && widac "#dodaj" && ok "przycisk „Dodaj jeden obraz” (P61 A)" || zle "Dodaj jeden obraz"
$B screenshot "$ZR/link-28-lista.png" >/dev/null
# auto 3 (12 miejsc): „i jeszcze 6 miejsc — pokaż”
$B click '#p-wiersze tr[data-i="2"]' >/dev/null
widac "#a-zamknij"; jest '$("a-zamknij").disabled && $("a-zamknij").textContent==="Zamknij auto"' "„Zamknij auto” przy nr rej., nieaktywny przed decyzjami (P77 A)"
jest '!!document.getElementById("zmienrodz").offsetParent' "„Zmień rodzaj” widoczny (od zad. 27)"
[ "$($B get text '#pokazwiecej')" = "i jeszcze 6 miejsc — pokaż" ] && ok "napis „i jeszcze 6 miejsc — pokaż” (odmiana: 6 → miejsc)" || zle "pokaż więcej"
$B click "#pokazwiecej" >/dev/null
jest 'document.querySelectorAll("#a-kafle .kaf").length===12' "po kliknięciu 12 kafli"
$B screenshot "$ZR/link-28-auto3.png" >/dev/null
# A10: decyzje do ostatniego miejsca → nr rej. → „Zamknij auto” → następne auto
for i in $(seq 12); do $B click "#a-dec button.ok" >/dev/null; done
jest '!$("a-zamknij").disabled' "„Zamknij auto” aktywny po ostatnim miejscu"
$B click "#a-zamknij" >/dev/null
jest 'S.ia===2 && $("a-nrinfo").textContent.includes("Zamknij auto")' "bez nr rej. zostaje, napis odsyła do „Zamknij auto”"
$B screenshot "$ZR/link-28-zamknij-auto.png" >/dev/null
$B fill "#a-nr" "WGM 30003" >/dev/null; $B click "#a-zamknij" >/dev/null
jest 'S.ia===3' "A10 po zamknięciu auta 3 otwiera się auto 4"
# reszta aut do końca partii (Enter jako skrót), po ostatnim — lista z „Raport partii”
for n in 4 5 6 7; do
  for i in $(seq 12); do [ "$(ev '$("a-zamknij").disabled')" = "true" ] || break; $B click "#a-dec button.ok" >/dev/null; done
  $B fill "#a-nr" "WGM 3000$n" >/dev/null; $B focus "#a-nr" >/dev/null; $B press Enter >/dev/null
done
jest 'document.getElementById("E3").classList.contains("on") && !$("doraportu").disabled && !!$("doraportu").offsetParent' "A10 po ostatnim aucie lista partii z „Raport partii”"
# „Dodaj jeden obraz” — plik wgrany przyciskiem, liczy się i dopisuje jako auto 8
$B upload "#plik1" "$(pwd)/dane/mini/badany_mini_firanka_dodatki_01.bmp" >/dev/null
for i in $(seq 60); do [ "$(ev 'S.partia.length===8 && !S.liczy')" = "true" ] && break; sleep 1; done
jest 'S.partia.length===8 && S.partia[7].stan==="gotowe" && S.partia[7].miejsca.length>0' "„Dodaj jeden obraz”: auto 8 policzone ($(ev 'S.partia[7].miejsca.length') miejsc)"
# A13 (odbiór 29): po zamknięciu partii przyciski decyzji wyszarzone
$B click "#doraportu" >/dev/null; $B click "#zapisz" >/dev/null
[ "$($B is visible '#mimo')" = "true" ] && $B click "#mimo" >/dev/null || true
jest 'S.zamknieta' "partia zamknięta"
$B eval 'otworzAuto(2); "ok"' >/dev/null   # widok auta po zamknięciu (wiersze nieklikalne — jak przez ?auto=)
jest '$("a-dec").querySelector("button.ok").disabled && $("a-dec").querySelector("select").disabled && getComputedStyle($("a-dec").querySelector("button.ok")).opacity<1 && $("a-zamknij").disabled' "A13 po zamknięciu przyciski decyzji wyszarzone"
$B screenshot "$ZR/link-28-zamknieta.png" >/dev/null
