# Prześwit — scenariusz demo (DRAFT, ≤ 2 min)

Nagrywa człowiek. Razem **113 s** (limit 120 s, zapas 7 s). Wszystko na danych sztucznych (`dane/mini`, `dane/mini-trudny`); przez cały pokaz u góry ekranu pasek „dane sztuczne — demonstracja” (P59 A).
Źródła: `docs/spec.md` §7, P50 A (główna ścieżka), P51 B + P60 B (partia 7 aut, trudny przypadek to 7. auto), P69 A (w aucie 1 rozstrzygamy 2 miejsca).

**Link do pokazu:** makieta R3: https://pawelpisarek.github.io/hacknation-proba17/makieta/r3/ (E1–E7, działa); wersja na ksefbot.pl — — (adres po wdrożeniu). Zrzuty ekranów: `docs/zrzuty/r3/`.
**Przed nagraniem:** usługa liczenia działa; pod ręką partia pokazowa — 7 plików, w tej kolejności: auto 1 `badany_mini_firanka_dodatki_00.bmp`, auto 2 `badany_mini_chlodnia_dodatki_01.bmp`, auto 3 `badany_mini_kontener_dodatki_01.bmp`, auto 4 `badany_mini_kontener_czyste_00.bmp` („brak wskazań”), auto 5 `badany_mini_firanka_czyste_01.bmp`, auto 6 `badany_mini_cysterna_dodatki_00.bmp` („brak wzorca”; biblioteka bez cysterny), auto 7 `trudny_mini_firanka_za_ladunkiem_00.bmp` (trudny: dodatek za ładunkiem; na liście nie jest oznaczony jako trudny — operator nie wie z góry). Do tego własny .bmp do wgrania.

| # | Czas | Ekran | Klikamy | Co widać | Lektor (1 zdanie) |
|---|---|---|---|---|---|
| 1 | 0–5 s (5) | E1 | „SCS Kowalski”, „Terespol — stanowisko 2”, „Zacznij zmianę” | logowanie, stanowisko; pasek „dane sztuczne” | „Operator raz na zmianę podaje, kto i gdzie kontroluje.” |
| 2 | 5–19 s (14) | E2 → E3 | „Wskaż obrazy .bmp” → 7 plików → „Policz partię” | lista partii: miniatury, „auto N”, rodzaj, stan od „liczy się” do „gotowe”, pasek postępu | „Wskazuje kilka obrazów, a program liczy je po kolei i oddaje listę aut.” |
| 3 | 19–39 s (20) | E4 | wiersz auto 1 (firanka) | badany obraz z ponumerowanymi ramkami i wzorzec obok (dwa najbliższe wzorce, 1 i 2, P70 A); lupa na obu naraz; kafelki od najbardziej różnego; „zwykle tu…” przy kafelku; max 6 miejsc i linia „i jeszcze N miejsc — pokaż”, jeśli jest więcej (P57 A); jedna ramka może być obok dodatku, nie na nim (P67 A) | „Program porównuje obraz z wzorcem tego samego rodzaju i zaznacza miejsca różne od wzorca — operator widzi je obok siebie.” |
| 4 | 39–61 s (22) | E4 → E3 | wpisujemy nr rej.; kafelek 1 → „Zatwierdź”; kafelek 2 → „Odrzuć ▾” → „element konstrukcji”; wracamy na listę (P69 A) | dwa miejsca rozstrzygnięte, reszta „oczekuje”; powód tylko przy odrzuceniu | „Każde miejsce operator zatwierdza albo odrzuca z powodem — decyzja zawsze jest jego.” |
| 5 | 61–75 s (14) | E3 → E4 | z listy: auto 4, potem auto 6 | auto 4: „brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam” (P58 A); auto 6: „brak wzorca — sprawdź obraz sam”, sam obraz z lupą (P35 A); na liście auto 4 ma stan „program nic nie wskazał — nieotwarte” do „Zamknij auto”, a auto 6 „brak wzorca — obejrzyj ręcznie”; „obejrzane, bez wskazań” z osobą i godziną pojawia się dopiero po „Zamknij auto” (P80 A) | „Gdy program nic nie wskazuje albo nie ma wzorca, mówi to wprost i prosi o obejrzenie obrazu.” |
| 6 | 75–89 s (14) | E3 → E4 | z listy: auto 7 | przypadek trudny: dodatek za ładunkiem. Jeśli program nie da ramki, pokazujemy to uczciwie (P52 A): brak ramki to granica programu, operator ogląda obraz sam | „Tu program może nie dać ramki — to jego granica, więc operator ogląda obraz sam i mówimy o tym wprost.” |
| 7 | 89–103 s (14) | E3 → E7 | „Raport partii” → „Zapisz i zamknij partię”; ostrzeżenie z listą aut z nierozstrzygniętymi miejscami („Brak decyzji: auto …”; auta bez miejsc, nieotwarte lub bez wzorca, nie wchodzą) → zapis mimo to (P63 B, P74 A) | raport: nr rej., rodzaj, liczba miejsc, decyzje z powodami, data i godzina decyzji przy każdym aucie (auto bez decyzji „—”, P64 A), kto, stanowisko; jeden przycisk zapisu, blokuje oddanie razem z raportem (P55 B, P56 A) | „Raport zapisuje się lokalnie jednym przyciskiem; auta z nierozstrzygniętymi miejscami program wyliczy i poprosi o potwierdzenie.” |
| 8 | 103–113 s (10) | E2 | „Nowa partia” (P65 A) → „Wskaż obrazy .bmp” → własny plik z linku | wybór plików; własny .bmp (także duży, ~50 MB) liczy się z linku | „To samo zrobisz ze swoim obrazem — pod tym linkiem.” |

**Suma: 5 + 14 + 20 + 22 + 14 + 14 + 14 + 10 = 113 s.**

## Uwagi
- Liczby skuteczności w demo nie padają. Jeśli trzeba (na pytanie, bez wyświetlania), z zadania 20, na danych sztucznych: przeoczenia 7,8% (zestaw zwykły) i 9,7% (trudny).
- Czas liczenia pokazu dotyczy obrazów z `dane/mini` (małe); dla ~50 MB wynik zadania 20: zwykły śr. 1,73 s, trudny śr. 1,19 s — nie czekamy na niego na nagraniu.
- Rozstrzygnięte przez Artura: P52 A, P54 A, P55 B, P56 A, P57 A, P58 A, P59 A, P60 B (trudny jako 7. auto), P63 B, P64 A, P65 A, P67 A, P69 A (2 miejsca w aucie 1), P70 A. P61 A („Dodaj jeden obraz” na liście) — alternatywa dla kroku 8, gdy trzeba wgrać plik w trakcie partii.
- Nagranie robić na makiecie R3 (link wyżej); zrzuty w `docs/zrzuty/r3/` odpowiadają krokom 1–8.
- Kroki 5–6 zależą od usługi na OMENie; trudne auto na liście nie jest oznaczone, więc wynik w kroku 6 może się zmienić z wersją programu.
