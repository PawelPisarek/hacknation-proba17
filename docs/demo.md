# Prześwit — scenariusz demo (DRAFT, ≤ 2 min)

Nagrywa człowiek. Razem **117 s** (limit 120 s). Wszystko na danych sztucznych (`dane/mini`, `dane/mini-trudny`).
Źródła: `docs/spec.md` §7, P50 A (główna ścieżka), P51 B (partia 6 aut + przypadek trudny).

**Link do pokazu:** wersja na ksefbot.pl — — (adres po wdrożeniu). Do tego czasu makieta: https://pawelpisarek.github.io/hacknation-proba17/makieta/warianty/ (makieta R1: https://pawelpisarek.github.io/hacknation-proba17/makieta/r1/, gdy będzie).
**Przed nagraniem:** usługa liczenia działa; pod ręką partia pokazowa — 6 plików z `dane/mini`, ten sam skład co makieta R1 (Programista): auto 1 `badany_mini_firanka_dodatki_00.bmp`, auto 2 `badany_mini_chlodnia_dodatki_01.bmp`, auto 3 `badany_mini_kontener_dodatki_01.bmp`, auto 4 `badany_mini_kontener_czyste_00.bmp` (czyste — „brak wskazań”), auto 5 `badany_mini_firanka_czyste_01.bmp` (czyste — tylko „niski”), auto 6 `badany_mini_cysterna_dodatki_00.bmp` (cysterna — „brak wzorca — sprawdź obraz sam”; biblioteka bez cysterny), plik `trudny_mini_firanka_za_ladunkiem_00.bmp` i własny .bmp do wgrania.

| # | Czas | Ekran | Klikamy | Co widać | Lektor (1 zdanie) |
|---|---|---|---|---|---|
| 1 | 0–5 s (5) | E1 | wybieramy „SCS Kowalski”, „Terespol — stanowisko 2”, „Zacznij zmianę” | logowanie, stanowisko (dane udawane) | „Operator raz na zmianę podaje, kto i gdzie kontroluje.” |
| 2 | 5–20 s (15) | E2 → E3 | „Wskaż obrazy .bmp” → 6 plików → „Policz partię” | lista partii: miniatury, „auto N” z nazwą pliku, rodzaj, stan idzie od „liczy się” do „gotowe”, pasek postępu | „Wskazuje kilka obrazów, a program liczy je po kolei i oddaje listę aut.” |
| 3 | 20–45 s (25) | E4 | wiersz firanka_dodatki_00 → kafelek 1 | badany obraz z ponumerowanymi ramkami i wzorzec obok; lupa na obu naraz; kafelki od najbardziej różnego (niski/średni/wysoki); „zwykle tu…” przy kafelku | „Program porównuje obraz z wzorcem tego samego rodzaju i zaznacza miejsca różne od wzorca — operator widzi je obok siebie.” |
| 4 | 45–70 s (25) | E4 | wpisujemy nr rej.; kafelek 1 → „Zatwierdź”; kafelek 2 → „Odrzuć ▾” → „element konstrukcji” | kafelki zmieniają stan (zatwierdzone / odrzucone); powód tylko przy odrzuceniu | „Każde miejsce operator zatwierdza albo odrzuca z powodem — decyzja zawsze jest jego.” |
| 5 | 70–82 s (12) | E4 → E5 | rozstrzygamy ostatnie miejsce; otwiera się następne auto; przechodzimy do cysterny | po ostatnim miejscu otwiera się następne auto (P40); przy cysternie napis „brak wzorca — sprawdź obraz sam”, sam obraz z lupą | „Gdy nie ma wzorca, program niczego nie zaznacza i mówi to wprost.” |
| 6 | 82–97 s (15) | E4 | wgrywamy `trudny_mini_firanka_za_ladunkiem_00.bmp` | przypadek trudny: dodatek za ładunkiem. **[wynik z zadania 20]** — jeśli jest ramka, pokazujemy ją w lupie; jeśli jej nie ma, mówimy to uczciwie (P52 czeka na Artura: A — pokazujemy brak ramki) | „Tu jest trudny przypadek — pokazujemy, jak program radzi sobie za ładunkiem, także gdy nie da ramki.” |
| 7 | 97–107 s (10) | E7 | „Raport partii” | tabela po aucie: nr rej., rodzaj, liczba miejsc, decyzje z powodami, kto, stanowisko, data i godzina; „Zapisz lokalnie” | „Całą partię zamyka raport zapisany lokalnie.” |
| 8 | 107–117 s (10) | E2 | otwieramy link, „Wskaż obrazy .bmp”, własny plik | własny .bmp (także duży, ~50 MB) liczy się z linku; wynik pojawia się na liście | „To samo zrobisz ze swoim obrazem — pod tym linkiem.” |

## Uwagi
- Liczby skuteczności w demo nie padają. Jeśli trzeba: **[wynik z zadania 20]** i dopisek „dane sztuczne”.
- Czas na pokazie liczymy na obrazach z `dane/mini` (małe); dla ~50 MB wynik pomiaru Z9 (śr. 5,0 s, maks. 8,1 s) — nie czekamy na niego na nagraniu.
- Otwarte: P52 (co, gdy brak ramki w trudnym), P54/P55 (ekran po ostatnim aucie, kiedy „Zamknij partię”) — krok 7 może się zmienić po odpowiedziach Artura.
- Kroki 5 i 6 zależą od makiety R1 i usługi na OMENie; do tego czasu opis słowny.

