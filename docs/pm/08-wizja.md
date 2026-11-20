# Krok 8 — Wizja produktu (`product-vision`, `value-proposition`)

Wejście: `docs/pm/01–07`, `docs/spec.md`, `docs/decyzje.md` (odpowiedzi Artura do P80). Produkt: **Prześwit** (P11). Dane w pokazie są sztuczne. Zakresu nie zmieniamy; wizja nie obiecuje nic ponad ustalenia: **P58 A** (na ekranie: „brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam”), **P79 B** (bez słów poziomu — tylko kolejność od najmocniejszego miejsca), **P4** (przeoczenie gorsze niż fałszywy alarm), **P57 A** (6 najsilniejszych miejsc + „i jeszcze N miejsc — pokaż”), **P80 A**, **P55 B**, **P25 A**.

## Czego nie wiem o produkcie
Nic, co wymagałoby wyboru Artura: wizja powtarza jego ustalenia i niczego nie dodaje ani nie zmienia zakresu. Brak pytania P w tym kroku (zasada „zostawiamy jak jest”). Poprawki po recenzji R1 (15:24) to zgodność z ustaleniami, bez pytań.

## (a) Wizja
**Wizja w jednym zdaniu:** Żaden funkcjonariusz przy prześwietleniu nie zostaje sam z obrazem — program pokazuje mu, gdzie patrzeć najpierw, a decyzja zawsze zostaje jego.

**Akapit:** Operator przy stanowisku RTG ogląda kilkadziesiąt aut na zmianę, często z krótkim stażem, i ma kilka minut na każde. Małe skrytki giną wśród podobnych obrazów, a zmęczenie robi swoje. Prześwit kładzie obok obrazu auta wzorzec tego samego rodzaju pojazdu, zaznacza ponumerowanymi ramkami miejsca, które od niego odbiegają, i ustawia je od najmocniejszego — na liście od razu 6 najsilniejszych, a pod nimi „i jeszcze N miejsc — pokaż”, nic nie jest chowane po cichu (P57 A). Operator przybliża miejsce lupą, zatwierdza albo odrzuca z gotowym powodem; po „Zamknij auto” przy aucie zostaje godzina i osoba, a raport zapisuje się dopiero przyciskiem „Zapisz i zamknij partię” (P55 B). Auto, którego operator jeszcze nie otworzył, ma stan „program nic nie wskazał — nieotwarte” (P80 A) — raport nie twierdzi, że ktoś je obejrzał. Program niczego nie rozstrzyga za człowieka i nigdy nie mówi „czysto”; gdy nic nie wskaże, pisze: „brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam” (P58 A).

**Rozważone warianty wizji i wybór (skill `product-vision`):**
| # | Wariant | Ocena |
|---|---|---|
| 1 | „Żadna skrytka nie umknie.” | odrzucone: obietnica gwarancji, sprzeczna z P58 A |
| 2 | „Program sam kontroluje auta.” | odrzucone: sprzeczne z decyzją człowieka (P3/P9) |
| 3 | „Nikt przy prześwietleniu nie zostaje sam z obrazem.” | **wybrane** — prawdziwe dla krótkiego stażu (P19), nie obiecuje wyniku |
| 4 | „Mniej minut na auto, więcej uwagi na to, co ważne.” | dobre jako zdanie pomocnicze (P7, P20) |
| 5 | „Raport, który dowodzi kontroli.” | pomocnicze, nie wizja (P80 A) |

## (b) Propozycja wartości — 6 części (skill `value-proposition`)
| Część | Treść (językiem operatora) |
|---|---|
| **1. Kto** | Funkcjonariusz SCS przy stanowisku RTG: kilkadziesiąt aut na zmianę, kilka minut na auto, coraz częściej krótki staż (P19, P20). Pośrednio kierownik zmiany, który czyta raporty. |
| **2. Dlaczego (zadanie do wykonania)** | W kilka minut ocenić, czy w naczepie lub ładunku jest coś, czego nie powinno być, i zdecydować: puścić albo skierować na kontrolę fizyczną (P7). |
| **3. Co przed** | Samo oglądanie obrazów bez punktu odniesienia „jak to powinno wyglądać”. Małe skrytki giną wśród podobnych obrazów, uwaga spada przy powtarzalnej pracy (P21). Ślad decyzji to ręczne pisanie. |
| **4. Jak** | Wzorzec tego samego rodzaju pojazdu obok obrazu (rodzaj można poprawić jednym kliknięciem, P24 B); ponumerowane ramki od najmocniejszego miejsca, 6 pierwszych na liście i „i jeszcze N miejsc — pokaż” (P57 A, P79 B); lupa na dużym obrazie; zatwierdź albo odrzuć z gotowym powodem (P13); praca partiami; „Zamknij auto” zostawia godzinę i osobę, „Zapisz i zamknij partię” zapisuje raport (P55 B, P80 A), przy aucie wpisuje się tylko numer rejestracyjny (P22). Gdy program nic nie wskaże: „brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam”. Docelowo działa lokalnie, bez internetu (P25 A); pokaz idzie przez stronę. |
| **5. Co po** | Operator zaczyna od najmocniejszych miejsc i ma szansę zobaczyć skrytkę, której sam by nie zauważył — program trafia prawdziwy dodatek w pierwszych 6 miejscach w ok. 80% obrazów z dodatkami, w pierwszych 3 w ok. 48% (dane sztuczne, zad. 20 v3). Kończy auto w kilka minut. Raport powstaje z jego decyzji po „Zapisz i zamknij partię”. Człowiek nadal decyduje. |
| **6. Alternatywy** | (1) Dotychczasowe oglądanie ręczne — zostaje, Prześwit je tylko wspiera. (2) Narzędzia, które same orzekają „czysto/niebezpiecznie” — tu program niczego nie rozstrzyga i nie obiecuje gwarancji. (3) Porównywanie z pamięci — wzorzec obok robi to za operatora. Koszt przejścia: wskazać obrazy, wpisać numer rejestracyjny; reszta w jednym ekranie. |

**Uczciwe granice (nie wolno ich ukryć w opisie ani na slajdach; liczby: dane sztuczne, zad. 20 v3, `docs/pm/07-pre-mortem.md`):**
- **Przeoczenia:** cel ≤ 10% dodatków (P31); wynik 7,8% (5/64) i 9,7% (6/62) — cel spełniony tuż przy granicy; mały dodatek 6/42.
- **Kolejność:** prawdziwy dodatek w pierwszych 6 miejscach ok. 80%, w pierwszych 3 ok. 48% — dlatego pod szóstym miejscem jest „i jeszcze N miejsc — pokaż”.
- **Ramki na czystym aucie:** średnio 5,8 w zwykłym zbiorze i 6,25 w trudnym (cel ≤ 6, P30 B — na trudnym minimalnie niespełniony); pojedyncze auta mają ich więcej (maks. 19 / 15), stąd lista ograniczona do 6 + „pokaż”.
- Za gęstym ładunkiem bywa brak ramki — to granica programu, operator ogląda obraz sam (P52 A). Gdy brak wzorca: „brak wzorca — sprawdź obraz sam”.
- Lupa: czy pokaże mały dodatek, sprawdza test S1 brzegowy (R20); do czasu wyniku nie obiecujemy tego w opisie.
- Opisy „zwykle tu…” przy wzorcu pochodzą z generatora (07, R12) — nie piszemy, że program „uczy”.

## (c) Zdania dla Prezentera (opis i slajdy)
1. Prześwit to pomocnik operatora RTG: pokazuje, gdzie na obrazie auta patrzeć najpierw, a decyzja zawsze zostaje po stronie człowieka.
2. Obok obrazu stoi wzorzec tego samego rodzaju pojazdu, a miejsca, które od niego odbiegają, są ponumerowane od najmocniejszego — na liście 6 pierwszych i „i jeszcze N miejsc — pokaż”.
3. Operator zatwierdza albo odrzuca miejsce jednym kliknięciem z gotowym powodem; „Zamknij auto” zostawia godzinę i osobę, a „Zapisz i zamknij partię” zapisuje raport.
4. Gdy program nic nie wskaże, pisze: „brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam”; auto jeszcze nieotwarte ma stan „program nic nie wskazał — nieotwarte”.
5. Docelowo całość działa lokalnie, bez internetu; pokaz idzie przez stronę na sztucznych danych i pokazuje kolejność od najmocniejszego miejsca, a nie gwarancję.

<!-- skill: product-vision -->
<!-- skill: value-proposition -->
<!-- skill: przeplywy-pm -->
