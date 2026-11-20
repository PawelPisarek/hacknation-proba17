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

## Zgodność z odpowiedziami Artura

Stan: 2026-11-20 16:2x · przegląd kodu `makieta/r3/` (index.html, aplikacja.js, dane.js) względem odpowiedzi P2–P83 z `docs/decyzje.md`; makiety nie uruchamiałem (tylko czytanie kodu), więc P76 A (zoom 4× z ramką) i wygląd są niesprawdzone. Zasada P83: brak zgodny z wcześniejszą odpowiedzią = poprawka dla Programisty, bez pytania do Artura.

### Poprawki dla Programisty (odpowiedź Artura jest, makieta ją łamie)

1. **P63 B / P74 A / P83 A:** ostrzeżenie z listą aut „brak decyzji” i „Zapisz mimo to” → makieta zamyka partię od razu. Przyczyna: `aplikacja.js` linia 276, pole `brak_decyzji: bezDecyzji(a),` jest w komentarzu `// krytyk R3 brak 3 …` (to samo co M1).
2. **P80 A / P57 A / P40 B:** auto ma się otwierać od pierwszego nierozstrzygniętego miejsca, w widoku 1×, z zwiniętą listą („6 + i jeszcze N”) → makieta tego nie robi: w `otworzAuto()` (linia 104) komentarz `// decyzja 15:29 (P80 A)` połknął instrukcję `S.im = …; S.zoom = 1; S.wzn = 0; S.wszystkie = false;`. Skutek: numer miejsca, zoom, wzorzec 1/2 i „pokaż wszystkie” przenoszą się z poprzedniego auta; po aucie 7 (miejsce 6) wejście w auto 2 (3 miejsca) trafia w nieistniejące „miejsce 6”.
3. **P60 B:** „operator nie wie z góry, które jest trudne” → nazwa pliku `trudny_mini_firanka_za_ladunkiem_00.bmp` jest widoczna na E2, E3 i w nagłówku E4. Pokazywać neutralną nazwę (np. `badany_mini_firanka_00.bmp`) albo zmienić nazwę pliku w danych.
4. **P64 A / P22 A:** data i godzina oraz „kto zdecydował” to moment decyzji operatora przy każdym aucie → w raporcie auto z rozstrzygniętymi miejscami, ale niezamknięte („Zamknij auto”), ma „Kto: —” i „Data: —” (`wierszeRaportu()`: `a.zamkniete && a.kiedy`). Powinno być: kto i kiedy z ostatniej decyzji, „—” tylko gdy nie ma żadnej decyzji.
5. **P25 A:** „docelowo działa lokalnie, bez internetu” → E7 (`r-info`) mówi „bez internetu program działa po uruchomieniu lokalnym” (jako stan obecny). Dopisać „docelowo”.
6. **P62 A:** napis „makieta: wynik przykładowy, nie z Twojego obrazu” → jest tylko na E4; na E2, E3 i w raporcie inne brzmienie („próba wgrania — wynik przykładowy (makieta)”). Ujednolicić do brzmienia z P62 A (drobne).

### Nowe pytanie (żadna odpowiedź nie rozstrzyga; nie zadaję, Szef wraca z tym)

- **N1 — stan auta bez miejsc po otwarciu, przed „Zamknij auto”:** P80 A mówi tylko „do otwarcia: program nic nie wskazał — nieotwarte” i „obejrzane, bez wskazań po Zamknij auto”. Makieta ma stan pośredni „program nic nie wskazał — otwarte, niezamknięte” (decyzja 15:29, nie Artura). Czy zostaje?
- **N2 — ramki w makiecie auta 1–6 wpisane ręcznie** (tylko auto 7 z wyniku programu), w tym „czyste” auto 4 bez miejsc i auto 5 z jednym. P81 A („bez pokazu na ręcznie podrasowanych przykładach”) dotyczy opisów; P82 czeka na sondę 38. Czy ramki w makiecie mają pochodzić z prawdziwego wyniku programu?

### Zgodne (bez uwag)

P2–P8 (poza ekranem), P9, P10 (opis czasu na E2), P11, P12, P13 (5 powodów z „inny”), P14–P15, P17 jako zmienione przez P79 B (kolejność, bez słów; w kodzie słów poziomu nie ma), P18, P24 B / P27 A / P70 A (zmiana rodzaju, podgląd 2 wzorców, decyzje znikają, oba rodzaje w raporcie), P28 A / P44 A / P77 A (nr rej. przy aucie, komunikat przy polu), P30 B / P57 A (do 6 + „i jeszcze N miejsc — pokaż”), P35 A / P58 A (brak wzorca, brak wskazań), P36 C / P37 B / P38 B / P39 B / P41 A / P42 (widok, miniatura, wejście po całej partii, podpowiedzi przy każdym kafelku, zmiana z listy), P46 A / P54 A / P55 B / P56 A (jeden przycisk, powrót na listę z „Raport partii”), P53 A, P59 A / P68 (pasek „dane sztuczne — demonstracja” na każdym ekranie), P61 A, P65 A, P66 A, P67 A (pudło w aucie 1), P69 A, P72 A (bez miniatury w raporcie), P73 A (sam numer), P78 / P71.
Poza makietą, nieobjęte kodem: P16/P23 (zastąpione przez P35 A), P26 A / P31 A (liczby przeoczeń w opisie, nie na ekranie), P47 A, P43 A.
