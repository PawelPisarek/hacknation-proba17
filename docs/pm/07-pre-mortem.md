# Krok 7 — pre-mortem i red-team „Prześwit” (`/pre-mortem`, `strategy-red-team`)

Wejście: `docs/pm/01–06`, `docs/spec.md` (A1–A14, §5–§7), `docs/decyzje.md` (P1–P56, WYNIK Z1–Z14). Wszystkie liczby: **dane sztuczne**. Wyobrażamy sobie: pokaz i oddanie zaliczone, ale narzędzie „nie działa dla operatora”.

## Czego nie wiem o produkcie (P57–P59 — odpowiedzi Artura: A, A, A)
- Co robimy, gdy czyste auto dostaje więcej niż 6 ramek (P30 B nie jest dziś osiągnięty: v2 12,9 na trudnym) — **P57 A**: 6 najsilniejszych na liście + widoczna linia „i jeszcze N miejsc — pokaż”.
- Czy ekran mówi, że „brak wskazań” nie znaczy „auto czyste” — **P58 A**: tak, napis na ekranie.
- Czy na ekranie widać stale, że to dane sztuczne i demonstracja — **P59 A**: tak, pasek „dane sztuczne — demonstracja”.
Do odpowiedzi plik jest pisany wg rekomendacji (zaznaczone).

## Pre-mortem — ryzyka (T = tygrys, P = papierowy tygrys, S = słoń)
Kolumny: **Blok** = blokuje oddanie / pokaz (tak / nie, wg P50 A: główna ścieżka); **Zmiana produktu** = czy trzeba zmienić to, co widzi operator.
| # | Rodz. | Ryzyko („nie udało się, bo…”) | Dowód | Blok | Zmiana produktu | Działanie / właściciel |
|---|---|---|---|---|---|---|
| R1 | T | czyste auto dostaje za dużo ramek, operator je ignoruje | Z2/Z6 obalone (17,7 śr.; v2: 4,2 / 12,9; cel ≤ 6, P30 B); fałszywe alarmy: baza 32/32 i 36/40 czystych aut ma ≥ 1 ramkę, v2 24/32 i 38/40 — to realne ryzyko, nie pusta lista | **tak** | **tak (P57)** | zadanie 20 (metoda); P57 do Artura |
| R2 | T | ramki nie wskazują prawdziwego dodatku na początku listy | Z8: 80% w pierwszych 6, 48% w pierwszych 3 (cel 90%) | **tak** | nie (kolejność — metoda) | zadanie 20; Programista |
| R3 | T | przeoczenia powyżej celu: operator ufa pustej liście | Z1: 14%, v2: 17,7–18,8% (cel ≤ 10%, P31 A); Z7 mały dodatek 17–26%; „brak wskazań” rzadki: czyste auta bez ramki to 0/32 i 4/40 (baza), 8/32 i 2/40 (v2) — w demo z 6 aut spodziewane 0–1 wystąpień (szacunek z tych liczb, nie pomiar), więc P58 dotyczy rzadkiego przypadku, a S3 zależy od H1/zadania 31 | **tak** | **tak (P58)** | napis przy „brak wskazań”; P58 |
| R4 | T | usługa na karcie OMENa nie słucha / wgranie z linku nie działa | poprzednia próba: usługa nie słuchała (P43) | **tak** | nie | start usługi z wdrożeniem, S14; Programista |
| R5 | T | wgranie ~50 MB zrywa limit serwera/proxy | A12/A14 nie sprawdzone przez stronę | **tak** | nie | test S12+S14 z 50 MB; Programista |
| R6 | T | brak wzorca (cysterna) dostaje ramki z przybliżonego wzorca | Z4: 0/10 doborów, program napisu jeszcze nie robi | **tak** | nie (P35 A już ustalone) | zadanie 33, S4; Programista |
| R7 | T | publiczność bierze liczby ze sztucznych danych za wynik na prawdziwych autach | Z10 (n małe), „dane sztuczne” tylko w opisie | **tak** | **tak (P59)** | pasek na ekranie; P59 |
| R8 | T | progi niski/średni/wysoki rozjeżdżają się z oczekiwaniem Artura | P45 B, P49 A: wartości po zatwierdzeniu | **tak** | nie (P49) | zadanie 32, pokazać Arturowi |
| R9 | T | demo > 2 min lub psuje się przy zmianie dopiero przed pokazem | spec §7: 8 kroków, 6 aut + trudny | **tak** | nie | próba demo ze stoperem wg „Ścieżka demo (do 2 min)” w 06-scenariusze.md |
| R10 | T | zły rodzaj dobrany, wzorzec nie pasuje → przeoczenia 70% | Z5: 70% → 12% po poprawieniu; Z3 99% | nie | nie (zmiana rodzaju już jest, P24 B) | track; Z13 n=1 do powtórzenia |
| R11 | T | wzorzec obok przesunięty > mały dodatek | Z12: mediana 6,5 px w polach dodatków, maks. 14 | nie | nie | fast-follow: ocena na makiecie z osobą z zewnątrz |
| R12 | T | „zwykle tu…” sztuczne, operator widzi nieprawdziwe opisy | Z14: 73% ramek ma opis (próg 80%); 27% „poza znaną konstrukcją” (P42) | nie | nie (zdanie w opisie „opisy z generatora”) | fast-follow: opisy od ekspertów KAS (UPROSZCZENIE) |
| R13 | T | partia po kolei: operator czeka na całą partię (kilkadziesiąt aut × czas) | P38: wejście dopiero po całej partii; Z9 5,0 s / obraz | nie | nie (pomysł 7 odrzucony, UPROSZCZENIE) | fast-follow: wynik na bieżąco |
| R14 | P | „ramki trzeba pokazać też na prawdziwych danych KAS” | brak danych KAS (zadanie) | nie | nie | zdanie w opisie |
| R15 | P | „logowanie nie z KAS” | UPROSZCZENIE (P22 A) | nie | nie | zdanie w opisie |
| R16 | P | „raport lokalny, nie w repozytorium KAS” | UPROSZCZENIE | nie | nie | zdanie w opisie |
| R17 | S | operator uznaje program za rozstrzygający; kto odpowiada za decyzję | P9: program zaznacza, operator decyduje | nie (do rozmowy) | nie (zdanie: „decyzja jest operatora”) | opis, README |
| R18 | S | nikt nie sprawdził z prawdziwym operatorem RTG czy widok C (dwa obrazy) jest czytelny | Z12/Z14 „po makiecie”; n = 0 operatorów | nie | możliwe | track: przegląd makiety R1 z osobą z zewnątrz |
| R19 | S | nakładanie legalnego ładunku zalewa listę | Z6: 7/16 ≤ 6 ramek (legalny ładunek); Z7: za ładunkiem 0/16–0/20 przeoczeń | **tak** (z R1) | w P57 | jw. |
| R20 | T | lupa nie pokaże małego dodatku (Z11 potwierdzona tylko na dużych; na małym niesprawdzona) — wtedy pada A1 | WYNIK Z11 (duże dodatki), Z7 mały 17–26%; S1 brzegowe nie wykonane | **tak** (A1 blokuje wg P50) | możliwe (gdy lupa nie wystarczy) | test S1 brzegowy na `trudny_mini_firanka_maly_00`; wynik wraca do Szefa |

**Ryzyka blokujące wymagające zmiany produktu:** R1 (P57 A), R3 (P58 A), R7 (P59 A). Pozostałe blokujące (R2, R4, R5, R6, R8, R9, R20) — praca techniczna, bez pytania.

## Red-team — najważniejsze założenia (ranking: wpływ × szansa pomyłki × tanio sprawdzić)
### 1. „Operator zaufa wskazaniom i nie przeoczy” (A1–A3, cel 10%)
- **Fails if:** na prawdziwych i trudnych obrazach przeoczenia > 10% albo operator bierze „brak wskazań” za czyste.
- **Uwaga (liczby):** „brak wskazań” prawie się nie zdarza (patrz R3); realnym zagrożeniem jest lawina ramek (R1, założenie 2).
- **Dowód w tym tygodniu:** v2/zadanie 20 na `dane/mini-trudny`; `dane/scenariusze` (zadanie 31) z czystymi autami.
- **Kryterium zabicia:** przeoczenia > 20% na wszystkich zbiorach albo 2 z 3 czystych „brak wskazań” błędnie.
- **Najtańszy test:** przebieg oceny (`ocena.py`) na trudnym; napis P58 i ocena na makiecie.
### 2. „≤ 6 ramek na czystym aucie i trafienie w pierwszych 6” (P30 B, Z8)
- **Fails if:** > 6 ramek na ≥ połowie czystych aut albo trafienie w pierwszych 6 < 70%.
- **Dowód:** v2: 4,2 (zwykły) / 12,9 (trudny); Z8 80%.
- **Kryterium zabicia:** zadanie 20 też > 6 na zwykłym → wraca P30 do Artura (decyzja Szefa 12:07).
- **Test:** ponowny pomiar po zadaniu 20.
### 3. „Wzorzec obok na tym samym obrazie nie przeszkadza” (Z12)
- **Fails if:** przesunięcie wzorca > rozmiar małego dodatku (6,5 px vs mały).
- **Dowód:** zrzuty z lupy, Z12 z osobą z zewnątrz na makiecie R1.
- **Kryterium zabicia:** osoba z zewnątrz nie widzi dodatku w ≥ 3 z 5 przypadków.
- **Test:** przegląd makiety (zlecenie Szefa), 5 przypadków `mini`.
### 4. „MVP z linku i usługa na OMENie działają razem z wdrożeniem” (A14, P43)
- **Fails if:** usługa nie słucha po restarcie albo wgranie 50 MB zawodzi.
- **Dowód:** S14 kroki 1–5 po wdrożeniu.
- **Kryterium zabicia:** jakikolwiek krok S14 nie przechodzi na dzień przed pokazem → wyciąć wgrywanie z pokazu **tylko za zgodą Pawła** (P43 A: nie wycinamy).
- **Test:** S14 + S12 z 50 MB (zadanie 21).
### 5. „Dane sztuczne wystarczą, by pokazać wartość” (Z10, P25)
- **Fails if:** słuchacz pyta o dokładność na prawdziwych obrazach, a odpowiedzią jest tylko liczba sztuczna.
- **Dowód:** każda liczba w README i opisie z dopiskiem „dane sztuczne”.
- **Kryterium zabicia:** liczba bez dopiska w materiałach.
- **Test:** przegląd tekstów (Prezenter). Pasek P59 na ekranie.

### 6. „Lupa pokaże także mały dodatek” (Z11, A1)
- **Fails if:** na `trudny_mini_firanka_maly_00` mały dodatek w lupie jest niewidoczny dla operatora.
- **Dowód:** Z11 potwierdzona na dużych dodatkach; na małym niesprawdzona; S1 brzegowe (06).
- **Kryterium zabicia:** mały dodatek niewidoczny w lupie → pada A1, wraca do Szefa (blokuje oddanie wg P50).
- **Test:** S1 brzegowy na `trudny_mini_firanka_maly_00`.

## Plan działań blokujących
| Ryzyko | Co | Kto | Termin |
|---|---|---|---|
| R1, R2, R19 | metoda zadanie 20; P57 | Programista, Artur | przed makietą R2 |
| R3 | napis P58; S3 | Programista (napis), Projektant (treść) | przed pokazem |
| R4, R5 | S14, S12 na 50 MB | Programista (zadanie 21) | dzień przed pokazem |
| R6 | zadanie 33; S4 | Programista | przed pokazem |
| R7 | pasek P59 | Programista | przed pokazem |
| R8 | zadanie 32; P49 | Analityk → Artur | przed makietą R2 |
| R9 | próba demo (stoper) wg „Ścieżka demo (do 2 min)” | Prezenter | dzień przed pokazem |
| R20 | S1 brzegowe na `trudny_mini_firanka_maly_00` (lupa na małym dodatku) | Programista, Projektant | przed makietą R2 |

<!-- skill: pre-mortem -->
<!-- skill: strategy-red-team -->
<!-- skill: przeplywy-pm -->
