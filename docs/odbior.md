# Odbiór A1–A14 — wynik uruchomienia
Czas: 2026-11-20 15:32 (zgłoszenie zgl-5106, OMEN); wersja repo: 75f266d (+ testy/odbior/, niezacommitowane w chwili przebiegu); metoda v3, konfiguracja zadania 20 bez zmian.

| Kryterium | Wynik | Dowód |
|---|---|---|
| A1 | zalicza | numery 1…n i kolejność na wynikach v3, auta z wzorcem (test_lista; błędne auta spoza cystern: 0) |
| A1 (lupa) | zalicza | A1 lupa: 684 widoków (miejsce × przybliżenie 1×/2×/4×, wyniki/odbior), maks. różnica położenia w oknach 0.0 px (próg Z12 14) |
| A2 | zalicza | kolejność od najmocniejszego miejsca, bez słów poziomu (P79 B; test sprawdza brak pola „slowo”) |
| A3 | zalicza | badany_mini_kontener_zero_00.bmp: miejsc 0, brak_wzorca=None |
| A4 | NIE | cysterna bez wzorca: napis „brak wzorca — sprawdź obraz sam”, zero miejsc (test_lista); błędne: 8 aut cysterna — wykryj_v3 nie stosuje progu doboru z zadania 33 (jest tylko w wykryj_v2), cysterna dostaje obcy wzorzec i ramki |
| A5 | jeszcze nie ma | podpowiedź „zwykle tu…” — dane w makiecie R2 (makieta/r2/dane.js), w kodzie usługi i MVP brak |
| A6 | jeszcze nie ma | zatwierdź/odrzuć — brak w kodzie (tylko makieta R2) |
| A7 | jeszcze nie ma | zmiana rodzaju — brak w kodzie (tylko makieta R2) |
| A8 | jeszcze nie ma | partia po kolei, stany, pasek — brak w kodzie (tylko makieta R2) |
| A9 | jeszcze nie ma | numer rejestracyjny — brak w kodzie (tylko makieta R2) |
| A10 | jeszcze nie ma | następne auto / raport — brak w kodzie (tylko makieta R2) |
| A11 | jeszcze nie ma | raport (zapis, pola P18) — brak w kodzie (tylko makieta R2) |
| A12 | zalicza | 8 obrazów poziomu pełnego, czas maks. 2.05 s, śr. 1.72 s (próg 60 s); pomiar na karcie OMENa; „bez internetu”: usługa nie wywołuje sieci — nie mierzone tu |
| A13 | jeszcze nie ma | zmiana decyzji z listy, „Zapisz i zamknij partię” — brak w kodzie (tylko makieta R2) |
| A14 | jeszcze nie ma | MVP na ksefbot.pl z usługą na OMENie — zadanie 21 (Paweł) nie oddane |

Zestawy w teście listy:
- `LISTA wyniki/odbior/mini/wyniki.json: {'obrazy': 16, 'brak_wzorca': 0, 'brak_wskazan': 0, 'z_miejscami': 12, 'ponad_6': 10, 'zly_dobor': 0}`
- `LISTA wyniki/odbior/mini-trudny/wyniki.json: {'obrazy': 16, 'brak_wzorca': 0, 'brak_wskazan': 0, 'z_miejscami': 12, 'ponad_6': 9, 'zly_dobor': 0}`

WYNIK URUCHOMIENIA: zalicza 5 z 15 pozycji (A1 lupa liczone osobno); NIE: A4; „jeszcze nie ma”: 9; testy listy: Ran 6, kod inny.

Polecenie: `docs/uruchomienie.md`. Dowody: `wyniki/odbior/` na OMENie (`ork/zgl-5106-1795185098448/`).

## Co nie przeszło i co z tego wynika
- **A4 NIE.** `wykryj_v3` (metoda z zadania 20, ta od ramek 5,8/6,25 i przeoczeń 7,8%/9,7%) nie stosuje progu „brak wzorca” z zadania 33 (jest tylko w `wykryj_v2`, `PROG_DOBORU`): 8 z 8 cystern przy bibliotece bez cysterny dostaje obcy wzorzec i ramki zamiast „brak wzorca — sprawdź obraz sam”. Technika → Programista (przenieść próg doboru do v3 i powtórzyć odbiór). Dopóki tego nie ma, liczba „50/50 → brak wzorca” (WYNIK zad. 33) dotyczy v2, nie v3.
- **Brak wskazań w partii:** na v3 żadne z 24 aut bez cysterny z `dane/mini` i `dane/mini-trudny` nie ma 0 miejsc (najmniej: `trudny_mini_kontener_ladunek_legalny_00` — 3); „brak wskazań” (A3) daje tylko `czyste_zero` (0 miejsc, zalicza), poza partią pokazową.
- **A12:** pełny poziom, 8 obrazów ~50 MB — maks. 2,05 s, śr. 1,72 s (zalicza); „bez internetu” nie mierzone (usługa lokalna, zapytań sieciowych nie ma w kodzie — nieweryfikowane przebiegiem z odłączoną siecią). Lupa ≤ 1 s nie mierzona (jeszcze nie ma).
- **A1 lupa:** 684 widoków, maks. różnica położenia 0,0 px (próg 14 px).
- Makiety R3 nie przeklikiwałem w tym przebiegu; „jeszcze nie ma” dotyczy kodu usługi/MVP, nie makiety.

## Rozjazdy P60 B / P69 A / P79 B (jako braki do autorów)
**P60 B** (7 aut, 7. = trudny, bez oznaczenia): zgodne w spec §7, 06 (nagłówek, S8, ścieżka), 07 (R9), demo.md. Rozjazdy w składzie i kolejności:
1. **produkt → Projektant:** `docs/pm/06-scenariusze.md` tabela partii: auto 2 `chłodnia_czyste_00`, 4 `firanka_czyste_01`, 5 `chłodnia_dodatki_00`, 6 `cysterna_czyste_00`; spec §7 i demo.md: auto 2 `chłodnia_dodatki_01`, 4 `kontener_czyste_00`, 5 `firanka_czyste_01`, 6 `cysterna_dodatki_00` (spec pisze wprost „w partii nie ma chłodni czystej”). `dane/scenariusze/manifest.json` (partia_pokazowa, 6 aut, bez auta 7) idzie za 06 — zadanie 31 do zsynchronizowania po decyzji, które auta.
2. **produkt → Projektant/Prezenter:** demo.md (krok 5) i spec zapowiadają auto 4 `kontener_czyste_00` jako „brak wskazań”; na v3 ma 8 miejsc. Żaden czysty obraz z `dane/mini` nie daje „brak wskazań” — pokaz tego stanu wymaga `czyste_zero` w partii albo zmiany tekstu.
3. **produkt → Prezenter/Projektant:** kolejność i czasy ścieżki: 06 = auto 1 (35 s) → 2 miejsca (25) → auto 7 (15) → cysterna (10) → „Dodaj jeden obraz” (P61 A) → E7 (5) = 115 s; spec = 40 s na auto 1, auto 7 przed cysterną; demo.md = 8 kroków, 113 s, auta 4 i 6 przed autem 7, krok 8 „Nowa partia” (P65 A) zamiast „Dodaj jeden obraz” (P61 A). 07/R9 pisze „zapas z P69 A”, 06 „praktycznie bez zapasu”, demo.md „zapas 7 s”.
**P69 A** (w aucie 1 rozstrzygamy 2 miejsca, wracamy na listę, reszta „oczekuje”): zgodne w spec §7, 06, 07 (R9), demo.md (krok 4).
**P79 B** (bez słów niski/średni/wysoki): czyste: README, hacktribe, demo.md, slajdy-szkic, 08-wizja; spec zgodny (A2, E4, §8). Do poprawy:
4. **technika → Projektant:** `06-scenariusze.md` linia 6: P49 A „Artur zatwierdza po zobaczeniu, ile czystych aut dostaje «wysoki»” — przedmiot odpadł (P79 B); nagłówek S2 „Kolejność i słowa”.
5. **technika → Projektant:** `07-pre-mortem.md` R8 („progi niski/średni/wysoki rozjeżdżają się z oczekiwaniem Artura”, kolumna blokuje „tak”) — ryzyko bez przedmiotu; spec tabela decyzji, wiersz P49 („wartości czekają na pomiar”) bez dopisku P79 B.

## Sonda 38 — czy czyste auto daje 0 miejsc na v3 (16:30, OMEN GTX 1050, zgłoszenie zgl-5142)

Metoda: wykryj_v3, konfiguracja zadania 20 bez zmian, biblioteka dane/mini (pełna, 12 wzorców), badane: 8 czystych z dane/mini + 20 z ~/dane/scenariusze/czyste_p49 (ziarno 17). Skrypt: testy/sonda38.sh. `czyste_zero/badany_mini_kontener_zero_00.bmp` pominięte (kopia wzorca, P82).
**Próg „brak wzorca” z zadania 36:** przebieg 1 z progiem (domyślnym), przebieg 2 bez (`--prog-doboru sr:0.0`) — wyniki identyczne we wszystkich 28 autach; próg nie zadziałał na żadnym (biblioteka pełna, jakość doboru ≥ 0,9).

| auto | miejsc (z progiem = bez progu) | werdykt |
|---|---|---|
| badany_mini_cysterna_czyste_03.bmp | 2 | — |
| badany_mini_kontener_czyste_04.bmp | 2 | — |
| badany_mini_kontener_czyste_02.bmp | 3 | — |
| badany_mini_cysterna_czyste_04.bmp | 4 | — |
| badany_mini_chlodnia_czyste_03.bmp | 5 | — |
| badany_mini_cysterna_czyste_00.bmp | 5 | — |
| badany_mini_cysterna_czyste_05.bmp | 6 | — |
| badany_mini_kontener_czyste_05.bmp | 6 | — |
| badany_mini_cysterna_czyste_06.bmp | 7 | — |
| badany_mini_firanka_czyste_01.bmp | 7 | — |
| badany_mini_firanka_czyste_04.bmp | 7 | — |
| badany_mini_kontener_czyste_01.bmp | 7 | — |
| badany_mini_kontener_czyste_03.bmp | 7 | — |
| badany_mini_kontener_czyste_06.bmp | 7 | — |
| badany_mini_chlodnia_czyste_04.bmp | 8 | — |
| badany_mini_chlodnia_czyste_05.bmp | 8 | — |
| badany_mini_cysterna_czyste_02.bmp | 8 | — |
| badany_mini_kontener_czyste_00.bmp | 8 | — |
| badany_mini_chlodnia_czyste_00.bmp | 9 | — |
| badany_mini_chlodnia_czyste_02.bmp | 9 | — |
| badany_mini_firanka_czyste_02.bmp | 9 | — |
| badany_mini_firanka_czyste_03.bmp | 9 | — |
| badany_mini_firanka_czyste_06.bmp | 9 | — |
| badany_mini_chlodnia_czyste_01.bmp | 10 | — |
| badany_mini_chlodnia_czyste_06.bmp | 11 | — |
| badany_mini_cysterna_czyste_01.bmp | 13 | — |
| badany_mini_firanka_czyste_05.bmp | 15 | — |
| badany_mini_firanka_czyste_00.bmp | 19 | — |

**Werdykt: nie ma (najmniej 2 miejsca: badany_mini_cysterna_czyste_03.bmp i badany_mini_kontener_czyste_04.bmp).** Z 28 aut żadne nie ma 0 miejsc; zakres 2–19, mediana 7. Wg zadania 38: ścieżka B — moment „brak wskazań” wypada z pokazu na realnym aucie, w opisie zdanie „na czystych autach program zwykle coś wskazuje”. Partii, progów i metody nie ruszano.
