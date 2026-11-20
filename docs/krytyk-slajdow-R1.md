# Krytyk slajdów R1 (zadanie 47) — Analityk

Wersja: `docs/slajdy.pdf` z 490d65f (12 slajdów), renderowana z `docs/slajdy-build/build.mjs` do obrazów i oglądana slajd po slajdzie; stan faktyczny: https://hacknation.ksefbot.pl/ (przejście z zadania 48, `docs/demo-link-48.md`), WYNIK zad. 20, P87–P92.
**Ocena: 5/10. Braków: 8.** (Bez pochwał. Kryteria: skuteczność 40%, innowacyjność 30%, skalowalność 30%.)

| # | Brak | Etykieta |
|---|---|---|
| 1 | PDF ma **12 slajdów**, limit zadania 47 to ≤ 10. Do scalenia: 10 „Na tle…” + 11 „Co dalej” + 12 „Narzędzia” (np. jeden slajd), albo 9 z 10. | technika |
| 2 | **Skuteczność (40%) nie ma obrazu.** Slajd 7 to 5 punktów z liczbami i ścianą tekstu; „fałszywe alarmy 32/32 i 40/40” stoi przed wyjaśnieniem — jury czyta „100% fałszywych alarmów”. Brak wykresu przeoczenia vs ramki (zad. 50: `docs/zrzuty/wykresy/przeoczenia-vs-ramki.png`) — wstawić na slajd 7, tekst skrócić do 3 punktów, wyjaśnienie „miara = kolejność miejsc” przed liczbą FP. | produkt |
| 3 | **Zrzuty są nieczytelne**: na slajdach 1, 4, 6, 8 obrazy mają ok. 330 px szerokości i drobny tekst (nie da się przeczytać ani ramek, ani liczb); slajd 6 ma 5 miniatur obok 6 punktów. Jeden duży zrzut na slajd (ekran auta z ramkami, lista partii), reszta w tle. | technika |
| 4 | **Zrzuty z makiety R3 (`zrzuty/r3/…`), nie z linku** na slajdach 1, 4, 6 — a pokaz jest nagrywany na linku. Program różni się od makiety (np. miniatura w raporcie, napisy, „obejrzyj ręcznie” na liście — brak 5). Zamienić na zrzuty z `docs/zrzuty/demo-link/`. | technika |
| 5 | **Napis rozbieżny ze slajdem i demo**: slajdy 4 i 6 mówią „brak wzorca — sprawdź obraz sam”, a na linku lista partii i raport dla auta 6 pokazują „brak wzorca — obejrzyj ręcznie” (tylko ekran auta ma „sprawdź obraz sam”). Napis to decyzja Artura → zapytać (lub poprawka z P35 wg `demo.md`, jeśli P35 to rozstrzyga). | produkt |
| 6 | **Slajdy zawierają język wewnętrzny**: „zad. 20”, „8768b32”, „WYNIK”, nazwy plików `docs/demo.md`, `dane/mini-trudny` w tytule i punktach (slajdy 6, 7, 8, 9) — jury nie zna numeracji zadań ani hashy; dać źródło raz, małą czcionką, w stopce. | technika |
| 7 | **Skalowalność (30%) tylko tekstem i słabą liczbą**: slajd 9 podaje 2 080 / 3 020 aut/h „samego liczenia” (wyliczone), ale realny wynik przez stronę to ok. 70 aut/h na stanowisko (wysyłka 45 s) i „wąskie gardło znika przy liczeniu obok skanera” — niemierzone; „więcej kart liniowo” — założenie. Brak jednego prostego obrazu (np. słupek aut/h: samo liczenie vs przez stronę) i brak jasnego komunikatu, co jest zmierzone, a co założone. | produkt |
| 8 | **Innowacyjność (30%)**: slajd 8 ma 6 punktów, z czego „Zbudowane przez zespół 5 botów AI” bez dowodu (zad. 52 wymaga liczby albo zrzutu przy każdym punkcie) i „materiał do douczania” (decyzje z powodem) — ustalone wcześniej usunięcie „uczy się” (R3 wizji) sugeruje, że to obietnica douczania, której nie ma w programie; zrzut przy punktach nie wskazuje, który punkt ilustruje. | produkt |

Braki „produkt” (2, 5, 7, 8) → do Projektanta w pokoju Produkt; „technika” (1, 3, 4, 6) → Prezenter przez Szefa. Po poprawce Prezentera — runda R2 na całym PDF.
