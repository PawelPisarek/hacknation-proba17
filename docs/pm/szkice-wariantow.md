# Szkice trzech wariantów ekranu wyniku (przed `/write-prd`)

Wejście: `docs/pm/02-operator.md`, `03-discover.md`, `04-priorytety.md`; ustalenia P17, P24, P27, P28, P29, P34, P35. Tylko funkcje z P29/P34: ramki + lista (1), lupa (3), wzorzec obok z przełączaniem (2), podpowiedź krótkiego stażu (10), zmiana rodzaju z podglądem dwóch wzorców (6). Wspólne dla wszystkich wariantów: stan obrazu w partii **gotowe** (nie „policzone”), słowo niski/średni/wysoki bez procentów (P17), zatwierdź/odrzuć z powodem z listy P13, osobne pole numeru rejestracyjnego przy obrazie (P28 A), brak wzorca → brak ramek i napis „brak wzorca — sprawdź obraz sam” (P35 A). Napisu „wynik mniej pewny” nie ma (P35 A unieważnia P23).
Makiety (Programista, online): A — https://pawelpisarek.github.io/hacknation-proba17/makieta/warianty/a/, B — https://pawelpisarek.github.io/hacknation-proba17/makieta/warianty/b/, C — https://pawelpisarek.github.io/hacknation-proba17/makieta/warianty/c/.

## Wariant A — „Jeden obraz na cały ekran”
- **Układ:** obraz naczepy zajmuje prawie cały ekran; ramki ponumerowane na obrazie; lista miejsc jako wąski pasek po prawej, domyślnie złożony.
- **Główna ścieżka:** gotowy obraz → klik ramki (lub strzałka „następne miejsce” od najbardziej różnego) → lupa przybliża miejsce w tym samym oknie → przełącznik „wzorzec ↔ badane” → zatwierdź / odrzuć z powodem → następny.
- **Co widać pierwsze:** duży obraz z numerami i jedno słowo (niski/średni/wysoki) przy każdej ramce; nad obrazem: rodzaj (z możliwością zmiany) i numer rejestracyjny.
```
+------------------------------------------------------------+
| Rodzaj: firanka [zmień]  Nr rej.: [______]  gotowe 3/8     |
|------------------------------------------------------------|
|  [obraz naczepy na całą szerokość]            | LISTA >    |
|     (1 wysoki)   (2 niski)     (3 średni)     | (złożona)  |
|  <lupa: wycinek 1, [wzorzec ↔ badane]>        |            |
|------------------------------------------------------------|
| [Zatwierdź] [Odrzuć ▾ powód]   « poprzednie  następne »    |
+------------------------------------------------------------+
```
- **Dla kogo lepszy:** operator, który chce „oglądać obraz” i ufa oku; na dużym obrazie 50 MB lupa jest naturalna. Słabość: lista schowana — łatwo pominąć miejsce z dalszych pozycji.

## Wariant B — „Najpierw lista (kolejka)”
- **Układ:** po lewej lista miejsc od najbardziej różnego (numer, słowo, krótka podpowiedź „co zwykle jest w tym miejscu konstrukcji”), po prawej obraz z ramkami; lista wyników partii jako pierwszy ekran.
- **Główna ścieżka:** lista wyników partii (gotowe) → otwarcie obrazu → pierwsza pozycja listy jest już wybrana → obraz przewija się do miejsca, lupa w małym oknie pod obrazem → zatwierdź/odrzuć → automatycznie następna pozycja → po ostatniej: zamknij auto, raport.
- **Co widać pierwsze:** kolejka do przejścia (ile zostało), pierwsza pozycja z podpowiedzią.
```
+----------------------+-------------------------------------+
| Auta: 12 gotowe      | obraz z ramkami (mały)              |
| 1 wysoki  [✓][✗]     |-------------------------------------|
|   „zwykle: słupek”   | lupa na wybrane miejsce             |
| 2 średni  [✓][✗]     | [wzorzec ↔ badane]                  |
| 3 niski   [✓][✗]     | Rodzaj: firanka [zmień]             |
| zostało: 3           | Nr rej.: [______]                   |
+----------------------+-------------------------------------+
```
- **Dla kogo lepszy:** operator z krótkim stażem i kilkudziesięcioma autami na zmianę — kolejka prowadzi, nic nie ginie, podpowiedź uczy. Słabość: obraz mały, mniej „całości”.

## Wariant C — „Porównanie obok siebie”
- **Układ:** dwa równe obrazy obok siebie: badany (z ramkami) i wzorzec; przewijanie i przybliżanie wspólne; lista jako dolny pasek ramek (numery z miniaturami).
- **Główna ścieżka:** gotowy obraz → oba obrazy przesuwają się razem → klik miniatury ramki → lupa na obu naraz → zatwierdź/odrzuć → następna miniatura. Zmiana rodzaju: podgląd dwóch najbliższych wzorców zamiast jednego.
- **Co widać pierwsze:** różnicę — to samo miejsce na badanym i na wzorcu, bez przełączania.
```
+--------------------------+--------------------------+
| BADANY (ramki 1 2 3)     | WZORZEC firanka [zmień]  |
|  [obraz]                 |  [obraz]                 |
+--------------------------+--------------------------+
| (1 wysoki)(2 niski)(3 średni) | Nr rej.: [____]      |
| [Zatwierdź] [Odrzuć ▾ powód]                         |
+---------------------------------------------------+
```
- **Dla kogo lepszy:** operator, który ocenia „czym to się różni” wprost; najmocniej pokazuje ideę produktu w demo do 2 min. Słabość: dwa obrazy na jednym ekranie — każdy mniejszy; wymaga dobrego dopasowania wzorca (Z12).

## Co różni warianty
| | A | B | C |
|---|---|---|---|
| punkt wyjścia | obraz | lista (kolejka) | porównanie |
| wzorzec | przełącznik w lupie | przełącznik w lupie | zawsze obok |
| lista | schowana, boczna | główna, prowadzi | dolny pasek |
| podpowiedź krótkiego stażu | w oknie lupy | przy pozycji listy | pod miniaturą |
| mocna strona | oglądanie całości | prowadzenie przez kolejkę | różnica widoczna od razu |
| demo do 2 min | dobre | najpewniejsze (jedna ścieżka) | najefektowniejsze |

**Rekomendacja:** B (kolejka) — pasuje do kilkudziesięciu aut na zmianę i do krótkiego stażu (P19, P20); decyduje Artur po obejrzeniu makiet.

<!-- skill: przeplywy-pm -->
