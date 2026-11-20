# Krytyk slajdów R3 — docs/slajdy.pdf (≥885101e)

Oglądane z renderu `docs/slajdy-build/build.mjs` (slajdy 1–10 jako PNG); sam PDF nie otwarty — w środowisku brak narzędzi do PDF. `docs/slajdy.pdf` jest z tego samego commita 885101e co szkic. **Ocena: 7/10.**

## Braki (≤5)
1. **produkt** — s7: zrzut to obcięty jeden wiersz raportu (auto 7), bez podpisu; czytelne tylko „5: brak decyzji … 11: brak decyzji” — przeczy tezie punktu „decyzja z powodem odrzucenia w raporcie”. Pokazać raport z zatwierdzeniem/odrzuceniem i powodem (zrzut z `docs/zrzuty/odbior44/`).
2. **produkt** — s1: napis na zrzucie „obraz 50 MB liczy się w kilka sekund” vs s8 „wysyłka przez sieć ok. 45 s” — widz wgrywający plik czeka ok. 52 s; napis w programie (nie slajd) jest mylący.
3. **technika** — s6: „wersja z nocy”, „pierwsza wersja”, „wersja końcowa” — wewnętrzny żargon, na slajdzie nie wiadomo, czym są; podpisać „wcześniejsza metoda” albo objaśnić.
4. **technika** — s9: tabela powtarza oba punkty; komórka „Obecne narzędzie KAS / Decyzja: —” bez źródła (analiza konkurencji tego nie podaje).
5. **technika** — s1: punkty 1 i 2 mówią to samo; dolne 1/3 slajdu puste.

## Stan braków R2
Domknięte: R2-1 (czas 90 s → s4 „ok. 4 s, bez cięć”; demo.md krok 2 „ok. 4 s, bez cięcia”), R2-2 (s8 z wykresem; liczby 2 080/3 020/70 zgodne z README), R2-4 częściowo (s6 „ramki” objaśnione; „wersja z nocy” zostaje — brak 3). R2-3 częściowo: s9 ma tabelę; s1 wciąż pusty dół.

## Recenzja 46
- README: czas 5,0 s usunięty, wykres jest, „Skalowanie” zgodne z s8 — brak braków.
- docs/hacktribe.md: komenda z pliku daje `906 906 947` (znaki/UTF-16/bajty) — 906 ≤ 1000, zgodne.
- docs/demo.md: czasy bez cięcia, partia „ok. 4 s” (pomiar 3,5–4 s, zad. 45); suma 114 s zgodna z tabelą; mały .bmp ok. 2 s (pomiar 1,6 s) — brak braków.
