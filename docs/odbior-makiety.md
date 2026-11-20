# Odbiór makiety R3 — przejście ścieżki z docs/demo.md

Czas: 2026-11-20 15:53 · makieta: https://pawelpisarek.github.io/hacknation-proba17/makieta/r3/ · przeglądarka bez okna (chromium, Playwright), skrypt poza repo (/tmp/pw/demo.js) · wzorzec: docs/demo.md (113 s, 8 kroków), P60 B, P69 A, P79 B, P80 A, P63 B / P74 A.

| Krok demo | Co opisuje demo.md | Co pokazuje r3 | Zgodne? |
|---|---|---|---|
| K1 E1 | logowanie, pasek „dane sztuczne — demonstracja” | pasek jest, funkcjonariusze, miejsce „Terespol — stanowisko 2” | tak |
| K2 E2→E3 | partia 7 aut, liczenie | E2: „Wskaż obrazy .bmp” + „Partia pokazowa (7 aut)”; kolejność plików jak w demo.md; E3 „liczy się 0/7” → „7 aut gotowe”; auto 4 „program nic nie wskazał — nieotwarte”, auto 6 „brak wzorca — obejrzyj ręcznie” | tak (uwaga D1) |
| K3 auto 1 | E4, dwa obrazy, kafelki, „zwykle tu…” | 6 ramek, 6 kafelków z „zwykle tu…”, wzorzec 1/2, bez „i jeszcze” (6 miejsc), bez słów niski/średni/wysoki (P79 B) | tak |
| K4 | nr rej., zatwierdź, odrzuć „element konstrukcji”, powrót na listę (P69 A) | „WL 12345” widać na liście („auto 1 · WL 12345”), „6 (zostało 4)”; stany „zatwierdzone” / „odrzucone: element konstrukcji” | tak |
| K5 | auto bez wskazań, auto bez wzorca, stan P80 A | auto 4 (E4): „brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam” + „Zamknij auto”; na liście „otwarte, niezamknięte”; auto 6: „brak wzorca — sprawdź obraz sam” | tak |
| K6 auto 7 (trudne) | 6 najsilniejszych + „i jeszcze n miejsc” (P57 A), bez oznaczenia trudne (P60 B) | 11 miejsc, 6 kafelków, „i jeszcze 5 miejsc — pokaż”, podpowiedzi „ramka większa niż widok” | tak |
| K7 E3→E7 | „Raport partii” → „Zapisz i zamknij partię”; ostrzeżenie „Brak decyzji: auto …” z listą aut i przycisk zapisu mimo to (P63 B / P74 A) | kolumny raportu OK, „—” przy nierozstrzygniętym; **po „Zapisz i zamknij partię” partia zamyka się od razu: brak ostrzeżenia i brak „Zapisz mimo to”** | **NIE (M1)** |
| K8 | „Nowa partia” → E2 | E2 z „nic nie wybrano” | tak |

Błędów strony (page error) w przejściu: 0.

## Braki

- **M1 — makieta → Programista, „produkt”** (P63 B / P74 A; demo krok 7; spec A11): zamknięcie partii z autami bez decyzji nie pokazuje ostrzeżenia „Brak decyzji: auto …” ani „Zapisz mimo to”. Przyczyna: w `makieta/r3/aplikacja.js`, `wierszeRaportu()`, pole `brak_decyzji: bezDecyzji(a),` jest wewnątrz komentarza (`// krytyk R3 brak 3 …`), więc `$("zapisz").onclick` (`wierszeRaportu().some(r => r.brak_decyzji)`) nigdy się nie wykonuje. Poprawka: pole w osobnej linii. Bez niej demo.md krok 7 się nie da pokazać.
- **D1 — demo.md → Prezenter, „technika”** (drobny): krok 2 pisze „Wskaż obrazy .bmp → 7 plików”, a makieta ma osobny przycisk „Partia pokazowa (7 aut)”; dopisać nazwę przycisku, żeby prowadzący klikał właściwy.

## Niesprawdzone

Czasy kroków (113 s) nie mierzone; wskazanie własnego pliku na E2; ramka obok dodatku (P67 A) w lupie; wygląd (zrzuty); pasek „dane sztuczne” na każdym ekranie poza E1; „bez internetu”; lupa ≤ 1 s.
