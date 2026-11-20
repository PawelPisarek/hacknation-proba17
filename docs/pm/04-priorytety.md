# Krok 4 — Priorytety (`prioritize-features`): kolejność funkcji Prześwitu w 1. wersji

Wejście: `docs/pm/01-competitive-analysis.md`, `02-operator.md`, `03-discover.md` i ustalenia Artura z `docs/decyzje.md` (P2–P35). **Kolejność jest od Artura (P34): 1 → 3 → 2 → 10 → 6** (pomysły z P29: 1 ramki + lista, 3 lupa, 2 wzorzec obok, 10 podpowiedź krótkiego stażu, 6 zmiana rodzaju z podglądem). Tego nie zmieniamy; ten plik opisuje każdą pozycję: wpływ, wysiłek, ryzyko, z których Z/P wynika i czego nie robimy.

## Czego nie wiem o produkcie
Nic nowego, co zmienia zakres. Kolejność (P34), wybór pomysłów (P29, P32), progi ramek i skuteczności (P30 B, P31 A) i brak wzorca (P35 A) ustalił Artur. Pytania „czy ucinać od końca, gdy zabraknie czasu” nie zadaję: odpowiada na nie P34 (ucinamy od pozycji 5, potem 4). Oceny wpływu i wysiłku poniżej to nasza ocena, bez liczb z badań (brak użytkowników w terenie — dane sztuczne).

## Cel i miara sukcesu (z zadania i P4, P5, P26, P30, P31)
Cel: operator RTG z krótkim stażem w kilka minut na auto (P7, P19) dostaje wskazanie miejsc różnych od wzorca. Miary: przeoczenia ≤ 10% dodatków (P31 A: ≥ 90 ze 100), na czystym aucie ≤ 6 ramek (P30 B), < 1 min na obraz ~50 MB. Najważniejsze jest nie przeoczyć (P26 A).

## Podstawa — bez rankingu, bez niej nie ma produktu (P10, P12)
Wczytanie obrazu .bmp (~50 MB), partia po kolei z listą wyników (P12), dobór rodzaju i wzorca z biblioteki, zatwierdzanie/odrzucanie z powodem z listy (P13), raport z polami P18, logowanie i ustawienie stanowiska (P22 A), brak wzorca → napis (P35 A). To nie są „pomysły do wyboru”, tylko zakres 1. wersji z kroku 1.

## Kolejność funkcji (P34)
| # | Funkcja (pomysł) | Wpływ | Wysiłek | Ryzyko | Wynika z | Dlaczego tu |
|---|---|---|---|---|---|---|
| 1 | **Ponumerowane ramki + lista od najbardziej różnego**, słowo niski/średni/wysoki bez procentów (pomysł 1; JS1) | wysoki — bez tego operator nie ma wyniku | średni | **wysokie**: skuteczność i liczba ramek nie spełniają jeszcze celu (wynik Programisty, zad. 19: czyste 24/32 z fałszywymi ramkami, przeoczenia 12/64) | Z1, Z2, Z6, Z7, Z8; P4, P5, P17, P30, P31 | rdzeń wyniku; od niego zależy zaufanie operatora |
| 2 | **Lupa** — kliknięcie ramki przybliża miejsce na obrazie ~50 MB (pomysł 3; JS1 AC4a) | wysoki — mała skrytka na dużym obrazie ginie bez przybliżenia | średni | średnie: czas i ostrość na `pelny` | Z11, Z9; P10, P21, P29 | Artur: konieczna na 50 MB; zaraz po ramkach, bo ramki bez przybliżenia nic nie pokazują |
| 3 | **Wzorzec obok z przełączaniem** „wzorzec ↔ badane” (pomysł 2; JS1 AC4a) | wysoki — różnicę widać oczami | średni | średnie: dopasowanie wzorca do badanego (przesunięcia) | Z12; P2, P17 | uzasadnia ramkę: operator widzi, od czego się różni |
| 4 | **Podpowiedź „co zwykle jest w tym miejscu konstrukcji”** dla krótkiego stażu (pomysł 10; JS1 AC4b) | średni — pomaga nowym, doświadczonym mało | niski–średni | średnie: opisy ze sztucznego generatora, nie z prawdziwych naczep | Z14; P19 | Artur: przed zmianą rodzaju (P34); ludzie z P19 to główny odbiorca |
| 5 | **Zmiana rodzaju z podglądem dwóch najbliższych wzorców** (pomysł 6; JS3) | średni — naprawia zły dobór, który inaczej zalewa fałszywymi ramkami | średni | średnie: poprawny rodzaj musi być w dwóch najbliższych | Z3, Z5, Z13; P24 B, P27 A | ostatnia, bo działa tylko, gdy dobór się pomyli; ucinamy ją pierwszą |

## Opis pozycji (co dokładnie wchodzi, co nie)
1. **Ramki + lista.** Wchodzi: numery na obrazie i na liście, kolejność od najbardziej różnego, słowo niski/średni/wysoki, komunikat „brak wskazań”, napis „brak wzorca — sprawdź obraz sam” bez ramek (P35 A). Nie wchodzi: procenty „ryzyka”, podpowiedź powodu odrzucenia (pomysł 4), oznaczanie ładunku przez operatora (5), uczenie się z odrzuceń (9). Sondy: Z1, Z2, Z6, Z7, Z8.
2. **Lupa.** Wchodzi: przybliżenie miejsca po kliknięciu ramki lub pozycji listy. Nie wchodzi: edycja obrazu, pomiary. Sonda: Z11 (≤ 1 s, mały dodatek widoczny).
3. **Wzorzec obok.** Wchodzi: ten sam wycinek wzorca w tym samym miejscu, przełączanie. Nie wchodzi: własna biblioteka operatora, wzorce na dostawcę skanera (później, P10). Sonda: Z12.
4. **Podpowiedź krótkiego stażu.** Wchodzi: jedno zdanie przy pozycji z listy elementów konstrukcji 4 rodzajów. Nie wchodzi: opisy z prawdziwych naczep (nie mamy danych). Sonda: Z14 (≥ 80% ramek ma opis).
5. **Zmiana rodzaju.** Wchodzi: lista 4 rodzajów jednym kliknięciem, podgląd dwóch najbliższych wzorców, przeliczenie od nowa, raport z oboma rodzajami (P24 B, P27 A). Nie wchodzi: dobór wzorca przybliżonego dla rodzaju bez wzorca (cysterna — napis, P35 A). Sondy: Z3, Z5, Z13.

## Czego nie robimy w 1. wersji (P10, P29, P32)
Odrzucone przez Artura i nie bierzemy w części: podpowiedź powodu odrzucenia (4), oznaczanie zgłoszonego ładunku (5 z listy pomysłów), wynik pierwszego auta przed resztą partii (7), zestawienie dla kierownika (8), uczenie się z odrzuceń (9). Poza zakresem z kroku 1: wykrywanie konkretnego towaru, porównanie z deklaracją, ocena „winny/niewinny”, integracja ze skanerami, chmura, wzorce na dostawcę, rozbudowane skalowanie (jedno zdanie w opisie).

## Kompromisy
- Ramki (1) dostają najwięcej uwagi mimo ryzyka, bo od nich zależy cel P31; pozostałe funkcje dają wartość tylko, gdy ramki trafiają.
- Zmiana rodzaju (5) jest ostatnia, bo pomaga tylko przy złym doborze; jeśli Z3 wyjdzie ≥ 95% trafnych, ale podgląd dwóch wzorców nie zmieni wyniku, tę funkcję można uprościć (do rozstrzygnięcia po sondzie, pytanie do Artura).
- Sondy Z1, Z2, Z6, Z7 (najryzykowniejsze, P33) idą przed budową funkcji 2–5; wynik obalony ⚠ wraca do Artura jako pytanie „A czy B?”.

UPROSZCZENIE: podpowiedź krótkiego stażu z generatora zamiast z prawdziwych naczep — opisy elementów konstrukcji 4 sztucznych rodzajów — dorobienie: opisy od ekspertów KAS po otrzymaniu prawdziwych obrazów
UPROSZCZENIE: partia = obrazy liczone po kolei, lista wyników na końcu — bez pierwszego wyniku przed końcem i bez skalowania — dorobienie: równoległe liczenie i wynik na bieżąco (pomysł 7, odrzucony)

<!-- skill: prioritize-features -->
<!-- skill: przeplywy-pm -->
