# Krok 4 — Priorytety (`prioritize-features`): kolejność funkcji Prześwitu w 1. wersji

Wejście: `docs/pm/01-competitive-analysis.md`, `02-operator.md`, `03-discover.md`, wyniki sond Z1–Z13 (linie `WYNIK` w `docs/decyzje.md`, 12:06) i ustalenia Artura P2–P35. **Kolejność od Artura (P34): pozycja 1 → 2 → 3 → 4 → 5 = pomysły 1 → 3 → 2 → 10 → 6** (P29: pomysł 1 ramki + lista, 3 lupa, 2 wzorzec obok, 10 podpowiedź krótkiego stażu, 6 zmiana rodzaju). Tego nie zmieniamy. **Numeracja w całym pliku: „pozycja M (pomysł N)”** — pozycja = miejsce w kolejności, pomysł = numer z listy 10 pomysłów z kroku 3.

## Czego nie wiem o produkcie
- Kolejność (P34), wybór pomysłów (P29, P32), próg 6 ramek (P30 B), 90 ze 100 dodatków (P31 A), brak wzorca (P35 A) ustalił Artur.
- **Nierozstrzygnięte, zmienia zakres:** próg P30 B (≤ 6 ramek na czystym aucie) jest dziś **obalony na metodzie bazowej** (Z2, Z6). Decyzja Szefa (12:07): próg zostaje, to praca metody (zadanie 20 w toku); pytanie „A czy B?” do Artura o próg wraca dopiero, gdy zadanie 20 też nie da ≤ 6 ramek.
- Oceny wpływu i wysiłku poniżej to nasza ocena; liczby pochodzą tylko z sond na **danych sztucznych** (brak użytkowników w terenie).

## Cel i miara sukcesu (z zadania i P4, P5, P26, P30, P31)
Operator RTG z krótkim stażem w kilka minut na auto (P7, P19) dostaje wskazanie miejsc różnych od wzorca. Miary: przeoczenia ≤ 10% dodatków (P31 A), na czystym aucie ≤ 6 ramek (P30 B), < 1 min na obraz ~50 MB. Najważniejsze: nie przeoczyć (P26 A).

## Wyniki sond na dziś (dane sztuczne, metoda bazowa; źródło: `docs/decyzje.md` 12:06)
| Z | Wynik | Co znaczy dla kolejności |
|---|---|---|
| Z1 | **pomiędzy**: przeoczenia 2/14 = 14% na `mini` (przeróbka 2/5); bazowo 8/64 = 12,5% | cel P31 (≤ 10%) jeszcze niespełniony — pozycja 1 ma najwyższe ryzyko |
| Z2 | **obala**: ≤ 6 ramek na 1/28 czystych (4%); średnio ~17,7 ramki | próg P30 B niespełniony; wraca do Artura, gdy zadanie 20 nie pomoże |
| Z6 | **obala**: ≤ 6 ramek na 7/16 czystych (44%) przy ładunku legalnym | jw.; ładunek legalny nie jest gorszy niż różnice egzemplarza — oba zalewają listę |
| Z7 | potwierdza: `maly` 6/35 = 17%, `za_ladunkiem` 0/16 (z pełnymi obrazami: 26%, pomiędzy) | małe i za ładunkiem widać |
| Z8 | **pomiędzy**: prawdziwe trafienie w pierwszych 6 na 48/60 = 80% obrazów (próg 90% ⚠ nasz); w pierwszych 3: 48% | kolejność listy (pozycja 1) do poprawy, szczególnie na `mini` |
| Z9 | potwierdza: 50 MB średnio 5,0 s, maks. 8,1 s; pamięć 1,21 GB | pozycja 2 (pomysł 3, lupa) i cel < 1 min wykonalne |
| Z11 | potwierdza: lupa średnio 0,18 s, maks. 0,34 s; dodatek rodzaju `maly` w lupie niesprawdzony | pozycja 2 (pomysł 3) wykonalna |
| Z3 | potwierdza: dobór rodzaju 79/80 = 99% | pozycja 5 (pomysł 6) potrzebna rzadko |
| Z5 | obala wg progu „ramki −50%” (próg źle dobrany): zły rodzaj → przeoczenia 70%, poprawny → 12%; ramki rosną 4,5 → 17,6 | wartość pozycji 5 (pomysł 6) to **mniej przeoczeń**, nie mniej ramek |
| Z10 | potwierdza z zastrzeżeniem: stosunek przeoczeń trudny/zwykły 0,6 (≤ 2×), n małe | w opisie „na danych sztucznych” |
| Z13 | nierozstrzygnięte (n = 1 zły dobór na 80) | pozycja 5 (pomysł 6): podgląd dwóch wzorców bez potwierdzenia |
| Z4 | nierozstrzygnięte do wdrożenia napisu (P35 A) | napis „brak wzorca” do sprawdzenia po wdrożeniu |
Z12 i Z14 czekają na makietę (przegląd z osobą z zewnątrz).

## Podstawa — bez rankingu, bez niej nie ma produktu (P10, P12)
Wczytanie obrazu .bmp (~50 MB), partia po kolei z listą wyników (P12), dobór rodzaju i wzorca z biblioteki, zatwierdzanie/odrzucanie z powodem z listy (P13), raport z polami P18, logowanie i ustawienie stanowiska (P22 A), brak wzorca → napis (P35 A). To zakres 1. wersji z kroku 1, nie pomysły do wyboru.

## Kolejność funkcji (P34)
| Pozycja | Funkcja (pomysł) | Wpływ | Wysiłek | Ryzyko | Wynika z | Dlaczego tu |
|---|---|---|---|---|---|---|
| 1 | **Ponumerowane ramki + lista od najbardziej różnego**, słowo niski/średni/wysoki bez procentów (pomysł 1; JS1) | wysoki — bez tego operator nie ma wyniku | średni | **wysokie**: przeoczenia 14% (Z1, cel ≤ 10%), czyste auto ~17,7 ramki zamiast ≤ 6 (Z2, Z6 obalone), prawdziwe trafienie w pierwszych 6 tylko na 80% obrazów (Z8); zad. 19: czyste 24/32, przeoczenia 12/64 | Z1, Z2, Z6, Z7, Z8; P4, P5, P17, P30, P31 | rdzeń wyniku; od niego zależy zaufanie operatora |
| 2 | **Lupa** (pomysł 3; JS1 AC4a) | wysoki — mała skrytka na dużym obrazie ginie bez przybliżenia | średni | niskie: Z11 potwierdza (≤ 0,34 s), Z9 potwierdza | Z11, Z9; P10, P21, P29 | Artur: konieczna na 50 MB; sprawdzona czasem |
| 3 | **Wzorzec obok z przełączaniem** (pomysł 2; JS1 AC4a) | wysoki — różnicę widać oczami | średni | średnie: dopasowanie wzorca (Z12 po makiecie) | Z12; P2, P17 | uzasadnia ramkę: operator widzi, od czego się różni |
| 4 | **Podpowiedź krótkiego stażu** (pomysł 10; JS1 AC4b) | średni — pomaga nowym, doświadczonym mało | niski–średni | średnie: opisy ze sztucznego generatora (Z14 po makiecie) | Z14; P19 | Artur: przed zmianą rodzaju (P34) |
| 5 | **Zmiana rodzaju z podglądem dwóch najbliższych wzorców** (pomysł 6; JS3) | średni — zły rodzaj to przeoczenia 70% zamiast 12% po poprawie (Z5); wartość = mniej przeoczeń (P4), nie mniej ramek | średni | średnie: zły dobór rzadki (Z3 99%), Z13 n = 1 | Z3, Z5, Z13; P24 B, P27 A | ostatnia w P34 |

## Opis pozycji (co wchodzi, co nie)
1. **Pozycja 1 (pomysł 1) — ramki + lista.** Wchodzi: numery na obrazie i liście, kolejność od najbardziej różnego, słowo niski/średni/wysoki, „brak wskazań”, napis „brak wzorca — sprawdź obraz sam” bez ramek (P35 A). Nie wchodzi: procenty „ryzyka”, podpowiedź powodu odrzucenia (pomysł 4), oznaczanie ładunku przez operatora (pomysł 5), uczenie się z odrzuceń (pomysł 9). Sondy: Z1, Z2, Z6, Z7, Z8.
2. **Pozycja 2 (pomysł 3) — lupa.** Przybliżenie miejsca po kliknięciu ramki lub pozycji listy. Nie wchodzi: edycja obrazu, pomiary. Sonda: Z11.
3. **Pozycja 3 (pomysł 2) — wzorzec obok.** Ten sam wycinek wzorca w tym samym miejscu, przełączanie. Nie wchodzi: własna biblioteka operatora, wzorce na dostawcę skanera (później, P10). Sonda: Z12.
4. **Pozycja 4 (pomysł 10) — podpowiedź krótkiego stażu.** Jedno zdanie przy pozycji listy z elementów konstrukcji 4 rodzajów. Nie wchodzi: opisy z prawdziwych naczep. Sonda: Z14.
5. **Pozycja 5 (pomysł 6) — zmiana rodzaju.** Lista 4 rodzajów jednym kliknięciem, podgląd dwóch najbliższych wzorców, przeliczenie od nowa, raport z oboma rodzajami (P24 B, P27 A). Nie wchodzi: wzorzec przybliżony dla rodzaju bez wzorca (cysterna — napis, P35 A). Sondy: Z3, Z5, Z13.

## Czego nie robimy w 1. wersji (P10, P29, P32)
Odrzucone przez Artura i nie bierzemy w części: pomysł 4 (podpowiedź powodu odrzucenia), pomysł 5 (oznaczanie zgłoszonego ładunku), pomysł 7 (wynik pierwszego auta przed resztą partii), pomysł 8 (zestawienie dla kierownika), pomysł 9 (uczenie się z odrzuceń). Poza zakresem z kroku 1: wykrywanie konkretnego towaru, porównanie z deklaracją, ocena „winny/niewinny”, integracja ze skanerami, chmura, wzorce na dostawcę, rozbudowane skalowanie (jedno zdanie w opisie).

## Założenie zespołu: kolejność cięcia
**ZAŁOŻENIE (zespołu, nie Artura):** kolejność budowy = kolejność cięcia. Gdy zabraknie czasu, ucinamy od końca: najpierw pozycję 5 (pomysł 6), potem pozycję 4 (pomysł 10). P34 ustala tylko kolejność pozycji; reguły cięcia Artur nie ustalał. Pozycja 5 jest ucinana pierwsza także dlatego, że zły dobór jest rzadki (Z3 99%); zysk to przeoczenia (Z5), więc cięcie ją osłabia, ale nie blokuje celu.

## Kompromisy
- Pozycja 1 (pomysł 1) dostaje najwięcej uwagi, bo od niej zależy cel P31, a sondy Z1, Z2, Z6, Z8 pokazują, że dziś go nie spełnia; pozostałe funkcje mają wartość tylko, gdy ramki trafiają.
- Próg ≤ 6 ramek (P30 B) zostaje (decyzja Szefa 12:07); metoda jest poprawiana w zadaniu 20. Jeśli i ono nie da ≤ 6 ramek, pytanie „A czy B?” do Artura o próg (zostawiamy / podnosimy).
- Z5: próg „ramki −50%” był źle dobrany; mierzymy przeoczenia przy złym i poprawnym rodzaju.

UPROSZCZENIE: podpowiedź krótkiego stażu (pozycja 4, pomysł 10) z generatora zamiast z prawdziwych naczep — opisy elementów konstrukcji 4 sztucznych rodzajów — dorobienie: opisy od ekspertów KAS po otrzymaniu prawdziwych obrazów
UPROSZCZENIE: partia = obrazy liczone po kolei, lista wyników na końcu — bez pierwszego wyniku przed końcem i bez skalowania — dorobienie: równoległe liczenie i wynik na bieżąco (pomysł 7, odrzucony)

<!-- skill: prioritize-features -->
<!-- skill: przeplywy-pm -->
