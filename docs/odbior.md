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

## Zadanie 36 — powtórzenie odbioru po przeniesieniu progu do v3 (16:34, Programista)
Zmiana: `wykryj_v3` stosuje próg „brak wzorca” z zadania 33 (`PROG_DOBORU` sr < 0,80, ten sam zwrot co v2), commit ea756a5. Odbiór `sh testy/odbior/odbior.sh` na karcie OMENa (zgl-5130, 16:18):

| Kryterium | Wynik | Dowód |
|---|---|---|
| A1 | zalicza | test_lista; błędne auta spoza cystern: 0 |
| A1 (lupa) | zalicza | 633 widoków, maks. różnica 0,0 px (próg 14) |
| A2 | zalicza | kolejność od najmocniejszego, bez słów poziomu |
| A3 | zalicza | badany_mini_kontener_zero_00.bmp: 0 miejsc, brak_wzorca=None |
| **A4** | **zalicza** (było NIE) | 8 z 8 cystern (mini 4, mini-trudny 4): „brak wzorca — sprawdź obraz sam”, 0 miejsc; pozostałe 24 auta dostają wzorzec (zly_dobor 0) |
| A12 | zalicza | 8 obrazów pełnych, maks. 3,73 s, śr. 3,28 s (próg 60 s) |

Testy listy: Ran 6, kod 0. WYNIK URUCHOMIENIA: zalicza 6 z 15, NIE: brak.

Przeoczenia (ta sama konfiguracja i zestawy co zadanie 20, pełna biblioteka; `sh ocena/uruchom36.sh`, zgl-5143-1795187989504): zwykły 5/64 (7,8%), trudny 6/62 (9,7%: maly 6/42, za_ladunkiem 0/20) — **bez zmian** względem zadania 20; dobór 64/64 i 80/80; „brak wzorca” na zestawach z pełną biblioteką: 0 obrazów (mini 0/16, maly 0/40, pelny 0/8, trudny_mini 0/16, trudny_maly 0/48, trudny_pelny 0/16). Ramki na czystym: zwykły 5,8, trudny 6,2 (jak w zadaniu 20).

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

## Przeliczenie po zmianie składu partii na 7 aut (2026-11-20 16:35; zgl-5144, OMEN; zegar OMENa w pliku wynikowym pokazuje 16:35)

- Manifest (`testy/odbior/manifest_sprawdz.py`): 17 scenariuszy, partia 7 aut (7. = `trudny_mini_firanka_za_ladunkiem_00`), brakujących plików 0, S4 bez dublowania pliku, na cysternie → **WYNIK MANIFESTU: OK**.
- `odbior.sh`: A1, A1 (lupa), A2 (bez słów, P79 B), A3, A4 (S4), A12 (maks. 2,03 s) **zalicza**; A5–A11, A13, A14 „jeszcze nie ma” (jak wcześniej); testy listy Ran 6, kod 0; **WYNIK URUCHOMIENIA: zalicza 6 z 15; NIE: brak**. Regresji nie ma; zbiory do testów (mini, mini-trudny) są te same, nie zależą od składu partii.
- Zmiany w manifeście: nazwa i kryterium S2 bez słów niski/średni/wysoki (P79 B; P45 i P49 zastąpione); `warunki` w demo wyrównane do `docs/demo.md` (5+14+20+22+14+14+14+10 = 113 s).
- Przycisk „Policz partię” na żywej r3: przed wyborem `disabled=true`, od razu po „Partia pokazowa (7 aut)” `disabled=false` — brak do Prezentera: **nie ma**.
- Niesprawdzone: S2/S4 przeliczone przez `test_lista` na zestawach mini/mini-trudny (czyli na plikach partii), nie na ekranie makiety; czasy demo.

## A4 niezależnie (OMEN, zgl-5152, 2026-11-20 19:11)

Skrypt `testy/odbior/a4_niezaleznie.py` czyta wprost `wyniki.json` v3 (biblioteka bez cysterny; nie przez `test_lista`): **8 z 8 cystern (mini 4 + mini-trudny 4) ma `brak_wzorca` i 0 miejsc; `brak wzorca` u innych typów: 0** → `WYNIK A4: 8/8 OK`. Ten sam przebieg: `manifest_sprawdz.py` → `WYNIK MANIFESTU: OK` (17 scenariuszy, partia 7 aut, `warunki` demo = 109 s wg `docs/demo.md`: 5+14+20+22+10+14+14+10); `odbior.sh`: zalicza 6 z 15, NIE: brak. Pierwsze podejście (zgl-5149) przerwał wyższy priorytet (`PRZERWANO`), powtórzone raz.

## Zadanie 21 — odbiór z zewnątrz (2026-11-20 19:11, https://hacknation.ksefbot.pl/, tylko wywołania strony)

| # | Sprawdzenie | Wynik |
|---|---|---|
| 1 | strona odpowiada 200 | **tak**: `GET /` 200 w 0,17–0,23 s (3 próby, 3104 B) |
| 2 | partia pokazowa 7/7 | **7 z 7** wyników (`GET /api/partia-pokazowa` 200, 5,2 s po obudzeniu); **ale skład inny niż w `docs/pm/06` / demo** (B1) |
| 3 | mały plik `mini` = CLI | **5 z 5**: te same ramki (x0,y0,x1,y1) i liczba miejsc co CLI v3 z `odbior.sh` (firanka_dodatki_00: 8, chlodnia_dodatki_01: 6, kontener_czyste_00: 8, kontener_dodatki_01: 12, firanka_czyste_01: 7), 1,1–1,6 s na żądanie |
| 4 | cysterna bez wzorca | **tak**: `cysterna_dodatki_00` i `cysterna_czyste_00` → `brak_wzorca: true`, 0 miejsc, zgodnie z CLI |
| 5 | czasy | mini: 1,1–1,6 s od wysłania do wyniku; 50 MB (kontener, 6 miejsc, liczenie 1,54 s): **44,9 s i 45,1 s** całe żądanie (wysyłka przez łącze; < 60 s); partia pokazowa po obudzeniu 5,2 s. **Pierwsze żądanie po uśpieniu:** usługa spała (10 min) — `GET /api/partia-pokazowa` dało **503** w 0,39 s z `{"blad":"karta uśpiona — uruchom wdroz.sh --usluga"}`; strona sama usługi nie budzi (B2); budzenie `sh wdroz.sh --usluga` trwało **25 s** |

Braki do Pawła:
- **B1 (produkt):** `usluga/partia-pokazowa.json` ma stary skład: auto 1 = `firanka_czyste_00` (19 miejsc), `firanka_dodatki_00`, `chlodnia_dodatki_00`, `kontener_czyste_00`, `kontener_dodatki_00`, `cysterna_dodatki_00`, `za_ladunkiem_00`. Wg `docs/pm/06`, spec §7 i `dane/scenariusze/manifest.json` ma być: firanka_dodatki_00, chlodnia_dodatki_01, kontener_dodatki_01, kontener_czyste_00, firanka_czyste_01, cysterna_dodatki_00, za_ladunkiem_00 (P60 B). Bez tego demo „auto 1 = 8 miejsc, widać 6 i „i jeszcze 2”” nie zgadza się na linku.
- **B2 (technika/produkt):** uśpiona usługa daje gołe 503 JSON; na stronie brak przycisku/komunikatu „budzę kartę (~25 s)” ani automatycznego budzenia. Przed pokazem trzeba obudzić ręcznie (`sh wdroz.sh --pokaz`).
- Niesprawdzone: klik w przeglądarce (czas od kliknięcia do pokazania tabeli), własny plik z formularza strony, zachowanie strony przy 503, `GET /api/zdrowie` (200 także przy śpiącej usłudze — nie wiem, co zwraca).

## Odbiór MVP na żywym linku (https://hacknation.ksefbot.pl/) — lista przygotowana, jeszcze nie sprawdzana

Kryteria A1–A14 z `docs/spec.md` §4. Sposób: przeglądarka bez okna (Playwright, `--maszyna dowolna`) + `curl`; ciężkiego liczenia nie zlecam, tylko wywołania strony. Przed każdym sprawdzeniem: `GET /api/zdrowie` (200; 503 „karta uśpiona” = najpierw `sh wdroz.sh --usluga`, czas budzenia zapisać). Stan strony z 16:37 (zad. 21): tylko tabela wyników, bez ramek/lupy/wzorca/podpowiedzi — A1, A2 (kafelki), A5–A13 czekają na zadania 40, 29, 28, 27 Programisty.

| AC | Jak sprawdzić na linku | Zalicza, gdy | Zależy od |
|---|---|---|---|
| A1 | partia pokazowa → auto 1 → klik kafelka 3; odczyt numerów ramek i kafelków; po kliknięciu współrzędne okien badany/wzorzec | numery ramek = numery kafelków; klik zaznacza ramkę i przybliża oba obrazy w tym samym miejscu (różnica położenia ≤ 14 px, próg Z12) | zad. 40 |
| A2 | auto 1 i auto 4: kolejność kafelków z DOM, tekst kafelków | malejąca różnica; zero „%”, zero słów niski/średni/wysoki; tylko numer, stan, kolejność | zad. 40 |
| A3 | wgrać `dane/scenariusze/czyste_zero/badany_mini_kontener_zero_00.bmp` (typ kontener) | napis „brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam”, nie pusta lista; pole nr rej. i „Zamknij auto” | zad. 40/29 |
| A4 | wgrać cysternę z `dane/mini` bez wzorca | „brak wzorca — sprawdź obraz sam”, 0 ramek, bez „wynik mniej pewny” (odbiór z zewnątrz: sekcja „Zadanie 21”) | gotowe po stronie API |
| A5 | auto 1: tekst kafelków bez klikania | każdy kafelek ma „zwykle tu: …” albo „poza znaną konstrukcją, obejrzyj uważnie”; nigdy pusto | zad. 40 |
| A6 | auto 1: „Zatwierdź” kafelka 1; „Odrzuć ▾” kafelka 2 bez powodu i z powodem z listy P13 | odrzucenie bez powodu niemożliwe; zatwierdzenie 1 kliknięciem; decyzja widoczna w raporcie | zad. 29 |
| A7 | auto z rodzajem: „Zmień rodzaj” → inny z 4 | podgląd 2 najbliższych wzorców, przeliczenie, decyzje auta znikają, raport ma oba rodzaje | zad. 28/29 |
| A8 | „Partia pokazowa” → obserwacja listy i stanów | auta liczą się po kolei, wiersz z miniaturą, wejście w auto dopiero po całej partii; 7 z 7 | zad. 21 + 28 |
| A9 | auto 1: „Zatwierdź” bez nr rej., potem z `WL 12345` | osobne pole nr rej.; bez numeru zatwierdzenie zablokowane | zad. 29 |
| A10 | rozstrzygnąć ostatnie miejsce auta 1; potem ostatniego auta | otwiera się następne auto; po ostatnim — lista partii z „Raport partii” | zad. 27 |
| A11 | „Raport partii” → kolumny; „Zapisz i zamknij partię” z autami bez decyzji | pola P18 (id kontroli, miejsce, data/godzina, rodzaje, nr rej., decyzje z powodem, kto); „—” przy braku decyzji; ostrzeżenie „Brak decyzji: auto …” + „Zapisz mimo to” (P63 B, P74 A) | zad. 27 |
| A12 | wgrać 50 MB (`~/dane/scenariusze/duzy/…`), zmierzyć od kliknięcia do wyniku; „bez internetu” osobno lokalnie (Docker/CLI), nie ze strony | całe żądanie < 60 s; liczenie ≈ 1,5–2 s | zad. 21 (liczenie), łącze |
| A13 | po policzeniu partii zmienić decyzję w aucie 1 z listy; „Zapisz i zamknij partię”; „Nowa partia” | zmiana możliwa do zamknięcia; potem „rozstrzygnięte”, bez zmian; „Nowa partia” → E2; bez słów przy miejscach | zad. 27 |
| A14 | wgrać własny mały .bmp z linku; na liście partii „Dodaj jeden obraz”; usługa na OMENie wstaje od wdrożenia | wynik w kilka sekund; przycisk zawsze; po uśpieniu jasny komunikat (nie goły błąd) | zad. 21 |

Dowód każdego sprawdzenia: linia „WYNIK <AC>: zalicza/NIE” z liczbą albo cytatem ekranu i godziną; zrzut ekranu w `wyniki/odbior-mvp/`.

## Recenzja 09 — docs/pm/09-uproszczenia.md (bf9cb62, autor Projektant; 2026-11-20 19:13)

Sprawdzone względem `docs/spec.md` §8–10, odpowiedzi Artura w `docs/decyzje.md`, zadań 23–29 i 40–42, odbioru 21 z zewnątrz. 5 braków, od najważniejszego:

1. **produkt** — U2, U4, U6, U7 i U8 pytają Artura o to, co już rozstrzygnął: U2 = P12 A i P38 B, U4 = P81 A, U6 = P72 A (Artur sam wpisał miniaturę na listę dorobienia), U7 = P82 (odpowiedź 15:39: bez auta „brak wskazań”, jeśli program na nic nie wskazuje; sonda 38 — nie wskazuje), U8 = P25 A. Pytanie „A przyjmujemy / B dorabiamy” o te pięć to pytania pozorne (zasada paczki: wpis „z P<n>”). Zostają do pytania tylko U1, U3 i U5, które są w spec §8 jako UPROSZCZENIE bez odpowiedzi Artura. Pozostałe pięć — jako informacja „już ustalone” z numerami P albo wcale.
2. **produkt** — brakuje uproszczeń, które operator naprawdę zobaczy na linku: (a) uśpiona usługa — pierwsze kliknięcie po przerwie ~25 s czekania (zmierzone w odbiorze 21; zadanie 42 ma to ukryć komunikatem „Uruchamiam program, ok. 30 s”); (b) obraz 50 MB ≈ 45 s (wysyłka przez łącze), przy celu < 1 min (A12) — Artur zna cel, ale nie ten czas; (c) wgrywany jest jeden obraz naraz (P61 A „Dodaj jeden obraz”), a partia pokazowa jest stała. Bez nich lista „uproszczeń” nie jest pełna, a U8 („bez sieci tylko docelowo”) sugeruje, że sprawdzenie lokalne (Docker/wiersz poleceń, P43 A, A12) nie istnieje.
3. **produkt** — B przy U1, U3 i U6 to to samo co D2, D3 i D1 (logowanie, ekran dokładania wzorca, miniatura w raporcie), tylko pytane dwa razy i z różnymi opisami. B nie ma ceny ani czasu, a do wyboru jest „jedno dorobienie” (polecenie Pawła). Artur może odpowiedzieć B przy U3 i wybrać D1 — sprzeczne odpowiedzi. Zostawić U jako „przyjmujesz” (tak/nie), a dorobienie wybierać tylko w D.
4. **technika** — czasy D1–D3 nie są jednakowo realne: D1 „1–2 h” jest ze spec §8 (P72), ale zależy od zadania 29 (decyzje do raportu) i 40 (ramki na stronie), więc liczy się dopiero po nich; D2 „kilka godzin” ze spec §8, ale to konta i hasła na publicznej stronie (repo publiczne, bez sekretów), a nie „lista”; D3 „2–3 h” nie ma źródła w spec i dotyka biblioteki na karcie oraz progu doboru z zadań 33/36 — nowy wzorzec może zepsuć A4 (8/8) i FN, a tego nie mierzymy. Podać źródło albo „nie oszacowane” i uczciwie zaznaczyć zależności.
5. **produkt** (drobny) — słowa techniczne w wiadomości do Artura: „repozytorium KAS” (U5, U6 przez „repozytorium”), „logowanie KAS” / „role” (D2), „program liczy na naszym komputerze” (U8). Zamienić na „systemy KAS”, „konto funkcjonariusza”, „na naszym serwerze, po linku”.

Niezależne od braków: U1, U3, U5 zgadzają się z `docs/spec.md` §8, a opisy z zadaniami 23–29 (zapis lokalny — zad. 29; wzorzec i podpowiedź — 25, 26; lista po kolei — 28) i 40–42 nie sprzeczają.

Niezweryfikowane: nie sprawdzałem, czy wiadomość jest już w pokoju Produkt (szkic „NIE WYSŁANA”); czasów D1–D3 nie mierzyłem; stanu MVP po zadaniach 40, 29, 28, 27 (nie oddane).

## Odbiór zadania 40 na linku (https://hacknation.ksefbot.pl/, 2026-11-20 19:19)

Sposób: przeglądarka bez okna (agent-browser) + zapytania do `/api/partia-pokazowa` z tej samej strony; `/api/zdrowie` 200, karta GTX 1050, v3, bez budzenia. Zrzuty: `docs/zrzuty/odbior40/z40-*.png`. Skład partii stary (7 aut z `dane/mini` i `mini-trudny`) — nie liczę jako brak (zad. 41).

| kryterium | wynik | dowód |
|---|---|---|
| ramki na stronie = wynik usługi (A1) | **zalicza** | auto 7: 6 ramek (z 11 miejsc), numery ramek 1–6 = numery kafelków 1–6; ramka 1 na obrazie 614 px szer.: x=526 szer. 70 px; z API (740,178)–(856,256) × 614/1024 → 526 i 70 px — zgodne. Kolejność kafelków wg malejącej różnicy (2,128 → 0,517) |
| ramki = wiersz poleceń (A1) | **NIE sprawdzone** | przebieg `ocena/uruchom40.sh` Programisty stoi w kolejce karty za usługą (19:19: karta zajęta przez usługę, `omen niedostępny`); własnego przebiegu nie puściłem, żeby nie dublować. Strona pokazuje dokładnie to, co zwraca usługa |
| lupa | **zalicza** | auto 7, kafelek 3 + „4×”: obraz badany 614 → 2456 px; ramka 3 (`akt`) wyśrodkowana w oknie (środek ramki 392, środek okna 389 px); okno wzorca wyśrodkowane na tym samym miejscu |
| wzorzec obok | **zalicza** | „WZORZEC: firanka trudny_wzorzec_mini_firanka_01” obok badanego; przesunięcie wzorca w oknie ≈ +6 px obrazu = `dobor.dx`=6 z API; na wzorcu jest ramka-duch (zrzut) |
| podpowiedź | **zalicza** | auto 7: kafelki 1–4 „zwykle tu: podwozie — belki, koła i oś”, 5–6 „poza znaną konstrukcją, obejrzyj uważnie” (P81 A); nigdy pusto; brak „%” i słów niski/średni/wysoki |
| cysterna „brak wzorca”, 0 ramek (A4) | **zalicza** | auto 6: wiersz „brak wzorca — sprawdź obraz sam”, nagłówek „0 ramek (brak wzorca)”, tylko obraz badany, brak panelu wzorca, brak „wynik mniej pewny” |
| wgranie własnego pliku (A14) | **zalicza** | `badany_mini_kontener_dodatki_01.bmp`: kontener, 12 miejsc, „Gotowe w 1,3 s”, 6 ramek + wzorzec `wzorzec_mini_kontener_00`, podpowiedzi, bez „%” |

Braki (poza składem partii):
1. **technika** — porównanie z wierszem poleceń (uruchom40.sh) bez wyniku; kryterium „ramki = CLI” niezamknięte do czasu przebiegu Programisty.
2. **produkt** (drobny) — przycisk wgrania nazywa się „Wskaż obraz .bmp”, a P61 A i I3 w 09 mówią „Dodaj jeden obraz”; to zad. 28, nie 40 — do ponownego sprawdzenia po 28.
3. **technika** (drobny) — w partii na linku auto 1 ma 19 miejsc („pokazano 6 najsilniejszych”, reszta pod „i jeszcze N miejsc — pokaż”); nie sprawdzałem rozwijania listy.

Niezweryfikowane: ramki = CLI; zmiana rodzaju, lista partii, decyzje, raport (zad. 27–29); budzenie uśpionej usługi (42).

### Recenzja 09, runda 2 (1a55580; 2026-11-20 19:19)

4 braki (sprawdzone na żywym linku i w `docs/decyzje.md`; P85 jest najwyższym P):
1. **produkt** — U3 mówi „4 rodzaje (…cysterna)”, a na linku cysterna ma „brak wzorca” i 0 ramek (auto 6, P35 A). Napisać: 3 rodzaje z wzorcem (firanka, chłodnia, kontener); cysterna bez wzorca.
2. **produkt** — I1 („widać komunikat „Uruchamiam program””) i I3 („Dodaj jeden obraz”) opisane jak stan obecny, a na linku jeszcze tego nie ma (przycisk „Wskaż obraz .bmp”, zad. 42 i 28 nie oddane). Przed wysyłką sprawdzić; w treści: „będzie”, nie „widać”.
3. **produkt** (drobny) — w tekście do Artura zostają odwołania, których nie zna: „zadanie 42”, „zadaniach 29 i 40”, „spec §8”, „P61 A”, „link do repo”, „serwer”. Zamienić na opis („po dodaniu decyzji do raportu”) albo wyciąć.
4. **technika** — D3: „pogorszyć wynik na cysternach” — cysterna nie ma dziś wzorca; ryzyko dotyczy innych aut, a dołożenie cysterny zmieniałoby A4 (8/8). Poprawić zdanie; „2–3 h” zostaje „nieoszacowane”.
Domknięte z R1: pytania tylko o U1, U3, U5; dorobienie tylko w D; B bez dublowania; I1–I3 dopisane; czasy D1–D2 z zależnościami.

### Recenzja 09, runda 3 (7e31c7a; 19:21)

Tylko tekst do Artura. 4 braki z rundy 2 poprawione: (1) U3 — 3 rodzaje z wzorcem, cysterna bez wzorca (zgodne z linkiem, auto 6); (2) I1 i I3 w czasie przyszłym („będzie”, „pojawi się”); (3) bez „zadanie 42”, „spec §8”, „P61 A”, „link do repo”, „serwer”; (4) D3 — ryzyko dla aut danego rodzaju, nie „na cysternach”. Nowych braków nie znalazłem; odwołania „P12 A, P38 B, P81 A, P72, P82, P58 A, P25 A” dotyczą odpowiedzi samego Artura.

brak braków zmieniających zakres lub kryteria

Uwaga do wysyłki (nie brak): I1 i I3 są w czasie przyszłym — przed wysłaniem sprawdzić na linku po zadaniach 42 i 28, a nazwę przycisku „Dodaj jeden obraz” z tym, co wdroży Programista.

## Odbiór zadania 29 na linku (f6da480; 19:38) — CZĘŚCIOWY: usługa nie liczy, bo karta jest zajęta

**Blokada:** w chwili odbioru `/api/zdrowie` daje „karta: w kolejce, pozycja 1” (karta zajęta przez `zgl-5155` Programisty — `ocena/uruchom40.sh`, od 19:09; nasza usługa `zgl-5162` czeka za nią). Strona jest w górze, ale żadne auto się nie liczy, więc E3–E7 na żywych danych nie da się przejść. Ciężkiego liczenia nie zlecałem.

| Kryterium | Wynik | Dowód |
|---|---|---|
| E1 (logowanie, stanowisko) | zalicza | lista funkcjonariuszy (3) i miejsc (3), „Zacznij zmianę” → E2 z „SCS Kowalski · Terespol — stanowisko 2” |
| E2 przy uśpionej karcie | zalicza | pasek „Uruchamiam program, ok. 30 s — karta kończy inne liczenie… (3 s)”, partia 0/7, auto 1 „liczy się”, strona ponawia sama; zrzut `docs/zrzuty/odbior29/e2-policz-karta-uspiona.png` |
| A6 (zatwierdź / odrzuć z powodem) | NIE sprawdzone na linku | karta zajęta; tylko lektura `strona/testy/odbior-29.js` i kodu (lista powodów = P13 + „inny”) |
| A9 (nr rej.) | NIE sprawdzone na linku | j.w.; w przykładowym raporcie auto 2: `WGM 12345` |
| A11 (raport .json/.csv, ostrzeżenie, zamknięcie) | częściowo: pliki przykładowe | patrz niżej; ekran E7 i ostrzeżenie „Brak decyzji: auto …” nie obejrzane |
| A13 (zmiana decyzji z listy, „rozstrzygnięte”, „Nowa partia”) | NIE sprawdzone na linku | j.w. |
| Zrzuty Programisty `docs/zrzuty/mvp/link-29-*.png` | nie liczę jako mój dowód | są jego |

**Raport .json/.csv z `docs/przyklad-raportu/` (mój odczyt, nie wynik z linku):**
- .json: 7 aut, pola P18 są (`id_kontroli, auto, plik, nr_rej, rodzaj_programu, rodzaj_operatora, liczba_miejsc, decyzje, kto, miejsce_kontroli, data_godzina`) plus `bez_wzorca, wynik_przykladowy, zamkniete, otwarte`. Auto 2: nr `WGM 12345`, 3 odrzucone z powodami (element konstrukcji, nakładanie się ładunku, „pusta paleta” = „inny” z tekstem), 5 zatwierdzonych, kto „SCS Kowalski”. Pozostałe auta „brak decyzji”, kto/data „—” (P64 A). Auto 6: „nieustalony (brak wzorca)”, 0 miejsc.
- .csv: separator „;”, 12 kolumn, 61 wierszy = suma miejsc (19+8+6+8+9+11) + 1 wiersz dla auta 6 (bez miejsc). Zgadza się z .json.
- Skład w przykładzie jest STARY (19/8/6/8/9/0/11) — to zadanie 41, nie liczę.

**Braki:**
1. **technika** — test `odbior-29.js` wywołuje `.onclick()`/`.onchange()` i podmienia `pobierz`, czyli nie jest klikaniem ani pobieraniem pliku: nie dowodzi, że przycisk jest widoczny, a plik się pobiera. Odbiór prawdziwym klikaniem po wstaniu usługi.
2. **technika** — A6, A9, A11, A13, E3–E7: do sprawdzenia po wstaniu usługi (po 41); bez tego odbiór 29 jest niepełny.
3. **produkt** (drobny, do sprawdzenia) — powód „pusta paleta” trafił do raportu jako zwykły tekst „inny”; w raporcie nie widać, że to „inny” (P13 A dopuszcza własny tekst — zgodne, tylko uwaga).

## Odbiór zadania 29 na linku — dokończenie (19:44; usługa wstała 19:39, v3 na GTX 1050)

Prawdziwe kliknięcia w przeglądarce (E1 → E2 → „Partia pokazowa” → „Policz partię” → auto 1 → … → raport). Zrzuty: `docs/zrzuty/odbior29/`. Pobrane pliki (przechwycone z przycisku „Zapisz mimo to”): `raport-pobrany.json`, `raport-pobrany.csv`.

| Kryterium | Wynik | Dowód |
|---|---|---|
| A6 | **zalicza** | „Zatwierdź” = 1 klik (kafelek 1 „zatwierdzone”); „Odrzuć ▾ powód” z listy: element konstrukcji / zgłoszony ładunek / błąd obrazu / nakładanie się ładunku / inny — kafelek 2 „odrzucone: nakładanie się ładunku”; odrzucenia bez powodu nie ma jak zrobić (kontrolka tylko z powodem); zrzut `a6-decyzje.png` |
| A9 | **zalicza** | 8/8 decyzji, bez nr rej. auto zostaje otwarte, pole z alarmem i napis „Wpisz nr rej. naczepy, potem kliknij „Zamknij auto” (albo Enter)”; po wpisaniu `WL 12345` + Enter otwiera się auto 2 (A10 też); na liście „auto 1 · WL 12345 … ✓ auto zamknięte” |
| A13 | **zalicza z zastrzeżeniem** | z listy → auto 1 → zmiana kafelka 1 na „odrzucone (element konstrukcji)” — jest w raporcie; po „Zapisz mimo to” lista „rozstrzygnięte”, napis „Partia zamknięta — decyzji nie można już zmieniać.”, „Nowa partia” → E2. Zastrzeżenie: po zamknięciu widok auta nadal pokazuje aktywne „Zatwierdź/Odrzuć” (kod linie 182/209 blokuje zapis; w przeglądarce nie potwierdziłem, że zmiana jest odrzucana) |
| A11 | **zalicza** | E7: kolumny Auto, Nr rej., Rodzaj programu, Rodzaj operatora, Miejsca, Decyzje, Kto, Miejsce kontroli, Data i godzina; ostrzeżenie „Brak decyzji: auto 2, auto 3, auto 4, auto 5, auto 7. Zapisać raport i zamknąć partię mimo to?” + „Zapisz mimo to” / „Wróć do listy”; auto 6 (brak wzorca) nie jest na liście braków decyzji |
| Pobrane .json vs decyzje na stronie | **zgodne** | .json: 7 aut, miejsca 8/6/12/8/7/0/11, auto 1: `WL 12345`, kto SCS Kowalski, 19:43, decyzje 1 odrzucone (element konstrukcji), 2 odrzucone (nakładanie się ładunku), 3–8 zatwierdzone, `zamkniete: true`; pozostałe „brak decyzji”, data „—” |
| Pobrane .csv | **zgodne** | 12 kolumn jak w `docs/przyklad-raportu/`, 53 wiersze = 52 miejsca + 1 wiersz auta 6 (bez miejsc, „nieustalony (brak wzorca)”); nr rej. w każdym wierszu auta 1 |
| E3–E7 | **zalicza** | E3 lista (zrzut `e3-lista.png`, `e3-po-auto1.png`), E4 widok z ramkami/kafelkami/wzorcem, E5 brak wzorca (lista: „brak wzorca — obejrzyj ręcznie”; otwarcie E5 nie klikane), E7 `e7-raport.png`, `e7-ostrzezenie.png`, E2 po „Nowa partia” |

**Braki:**
1. **produkt** — napis przy numerze rej. odsyła do przycisku „Zamknij auto”, którego na ekranie nie ma (jest tylko Enter). Albo przycisk, albo napis „… i naciśnij Enter”.
2. **produkt** — „Zmień rodzaj” jest widoczny w widoku auta (Szef: ukryty do zadania 27) — kliknięcia nie sprawdzałem.
3. **technika** — A13: po zamknięciu partii przyciski decyzji w widoku auta wyglądają na aktywne; sprawdzić, że zapis jest odrzucany (albo je wyłączyć).
4. **technika** — nie sprawdzone: otwarcie E5 (auto 6) klikiem, „inny” z własnym tekstem na stronie (jest w teście Programisty), porównanie ramek z CLI (zad. 40, otwarte).

## Odbiór zadania 41 na linku (19:44)

**Zalicza.** Partia pokazowa po „Policz partię” (usługa 19:39, `/api/partia-pokazowa`; strona i API zgodne): auto 1 firanka 8, auto 2 chłodnia 6, auto 3 kontener 12, auto 4 kontener 8, auto 5 firanka 7, auto 6 „brak wzorca” (0 miejsc, „— · brak wzorca — obejrzyj ręcznie”), auto 7 firanka 11 = **8/6/12/8/7/0/11** jak w pm/06. Pliki: dodatki_00 / chlodnia_dodatki_01 / kontener_dodatki_01 / kontener_czyste_00 / firanka_czyste_01 / cysterna_dodatki_00 / trudny firanka_za_ladunkiem_00. Na ekranie neutralne nazwy `skan_NN.bmp` (P60 B). Zrzut: `docs/zrzuty/odbior41/lista-partii.png`.
Braki: **produkt** (drobny) — kolumna „Obraz” (miniatura, P37 B) na liście jest pusta; to dorobienie D1/zadanie 28, nie 41.

## Odbiór zadania 42 na linku (19:44) — w zakresie bez tokenu (P86)

| Punkt | Wynik | Dowód |
|---|---|---|
| `/api/zdrowie` zwraca stan | **zalicza** | 200 w 0,45 s: `{strona:ok, karta:{ok:true, urzadzenie:cuda, GTX 1050, metoda v3…}}`; przy kolejce 19:37: `karta: stan „w kolejce”, pozycja 1, blad „Uruchamiam program, ok. 30 s — karta kończy inne liczenie”` |
| napis „Uruchamiam program, ok. 30 s” + ponawianie | **zalicza** | na żywo 19:37: pasek „Uruchamiam program, ok. 30 s — karta kończy inne liczenie… (3 s)”, partia 0/7, strona ponawiała sama, potem policzyła; zrzut `docs/zrzuty/odbior42/napis-uruchamiam-program-19-37.png` |
| `/api/obudz` uśpiona → 503 z napisem o ręcznym budzeniu | **tylko w testach** | żywo przy działającej usłudze: `POST /api/obudz` = 200 `{stan:działa}` w 0,17 s; usługi nie usypiałem. Testy `strona/testy/budzik.test.mjs`, `serwer.test.mjs`: 17/17 pass (w tym „uśpiona → 503 z napisem”, „bez budzika → 503”, „zad. 42: śpiąca usługa…”) — uruchomione przeze mnie lokalnie |
Braki: **technika** — 503 „obsługa budzi go ręcznie” nie widziany na żywo (nie usypiałem usługi); tekst napisu 503 nie czytany przeze mnie z żywego linku.
