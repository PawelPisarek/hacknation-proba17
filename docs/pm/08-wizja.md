# Krok 8 — Wizja produktu (`product-vision`, `value-proposition`)

Wejście: `docs/pm/01–07`, `docs/spec.md`, `docs/decyzje.md` (odpowiedzi Artura do P80). Produkt: **Prześwit** (P11). Dane w pokazie są sztuczne. Zakresu nie zmieniamy; wizja nie obiecuje nic ponad ustalenia: **P58 A** („brak wskazań” to nie gwarancja, że auto jest czyste), **P79 B** (bez słów poziomu — tylko kolejność od najmocniejszego miejsca), **P4** (przeoczenie gorsze niż fałszywy alarm, ale ramek ma być mało).

## Czego nie wiem o produkcie
Nic, co wymagałoby wyboru Artura: wizja powtarza jego ustalenia (P4, P9, P13, P19–P21, P29, P58, P79) i niczego nie dodaje. Brak pytania P w tym kroku (zasada „zostawiamy jak jest”).

## (a) Wizja
**Wizja w jednym zdaniu:** Żaden funkcjonariusz przy prześwietleniu nie zostaje sam z obrazem — program pokazuje mu, gdzie patrzeć najpierw, a decyzja zawsze zostaje jego.

**Akapit:** Operator przy stanowisku RTG ogląda kilkadziesiąt aut na zmianę, często z krótkim stażem, i ma kilka minut na każde. Małe skrytki giną wśród podobnych obrazów, a zmęczenie robi swoje. Prześwit kładzie obok obrazu auta wzorzec tego samego rodzaju pojazdu, zaznacza ponumerowanymi ramkami miejsca, które od niego odbiegają, i ustawia je od najmocniejszego. Operator przybliża miejsce lupą, zatwierdza albo odrzuca z gotowym powodem, a raport zapisuje się sam z godziną i osobą, która zdecydowała. Program niczego nie rozstrzyga za człowieka i nigdy nie mówi „czysto” — mówi tylko „nic nie wskazałem, obejrzyj sam” (P58 A).

**Rozważone warianty wizji i wybór (skill `product-vision`):**
| # | Wariant | Ocena |
|---|---|---|
| 1 | „Żadna skrytka nie umknie.” | odrzucone: obietnica gwarancji, sprzeczna z P58 A |
| 2 | „Program sam kontroluje auta.” | odrzucone: sprzeczne z decyzją człowieka (P3/P9) |
| 3 | „Nikt przy prześwietleniu nie zostaje sam z obrazem.” | **wybrane** — prawdziwe dla krótkiego stażu (P19), nie obiecuje wyniku |
| 4 | „Mniej minut na auto, więcej uwagi na to, co ważne.” | dobre jako zdanie pomocnicze (P7, P20) |
| 5 | „Raport, który sam dowodzi kontroli.” | pomocnicze, nie wizja (dowód kontroli: P80) |

## (b) Propozycja wartości — 6 części (skill `value-proposition`)
| Część | Treść (językiem operatora) |
|---|---|
| **1. Kto** | Funkcjonariusz SCS przy stanowisku RTG: kilkadziesiąt aut na zmianę, kilka minut na auto, coraz częściej krótki staż (P19, P20). Pośrednio kierownik zmiany, który czyta raporty. |
| **2. Dlaczego (zadanie do wykonania)** | W kilka minut ocenić, czy w naczepie lub ładunku jest coś, czego nie powinno być, i zdecydować: puścić albo skierować na kontrolę fizyczną (P7). |
| **3. Co przed** | Samo oglądanie obrazów bez punktu odniesienia „jak to powinno wyglądać”. Małe skrytki giną wśród podobnych obrazów, uwaga spada przy powtarzalnej pracy (P21). Ślad decyzji to ręczne pisanie. |
| **4. Jak** | Wzorzec tego samego rodzaju pojazdu obok obrazu (rodzaj można poprawić jednym kliknięciem, P24 B); ponumerowane ramki od najmocniejszego miejsca (P79 B); lupa na dużym obrazie; zatwierdź albo odrzuć z gotowym powodem (P13); praca partiami; raport z godziną i osobą, bez pisania poza numerem rejestracyjnym (P22). Gdy program nic nie wskaże, mówi to wprost i dodaje „to nie gwarancja” (P58 A). Całość działa bez internetu. |
| **5. Co po** | Operator zaczyna od najważniejszych miejsc, widzi skrytkę, której sam nie zauważył, i kończy auto w kilka minut. Nowy funkcjonariusz uczy się od wzorca. Raport zapisuje się sam. Człowiek nadal decyduje. |
| **6. Alternatywy** | (1) Dotychczasowe oglądanie ręczne — zostaje, Prześwit go tylko wspiera. (2) Narzędzia, które same orzekają „czysto/niebezpiecznie” — tu program niczego nie rozstrzyga i nie obiecuje gwarancji. (3) Porównywanie z pamięci — wzorzec obok robi to za operatora. Koszt przejścia: wskazać obrazy, wpisać numer rejestracyjny; reszta w jednym ekranie. |

**Uczciwe granice (nie wolno ich ukryć w opisie ani na slajdach):** program wskazuje dodatki w przeważającej części, nie we wszystkich (cel ≥ 90 na 100 wskazanych, P31); na czystym aucie bywa do 6 ramek (P30); gdy nie ma wzorca, mówi „brak wzorca — sprawdź obraz sam”; za gęstym ładunkiem bywa bez ramki (P52). Dane pokazowe są sztuczne.

## (c) Zdania dla Prezentera (opis i slajdy)
1. Prześwit to pomocnik operatora RTG: pokazuje, gdzie na obrazie auta patrzeć najpierw, a decyzja zawsze zostaje po stronie człowieka.
2. Obok obrazu stoi wzorzec tego samego rodzaju pojazdu, a miejsca, które od niego odbiegają, są ponumerowane i ułożone od najmocniejszego.
3. Operator przybliża miejsce, zatwierdza albo odrzuca jednym kliknięciem z gotowym powodem, a raport z godziną i osobą zapisuje się sam.
4. Gdy program nic nie wskaże, mówi to wprost i dodaje, że to nie gwarancja — nie udaje, że auto jest czyste.
5. Całość działa bez internetu i na sztucznych danych; największy zysk daje funkcjonariuszom z krótkim stażem.

<!-- skill: product-vision -->
<!-- skill: value-proposition -->
<!-- skill: przeplywy-pm -->
