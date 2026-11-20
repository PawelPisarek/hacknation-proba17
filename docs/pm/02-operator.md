# Krok 2 — Operator: persona i droga od wjazdu auta do raportu (`user-personas`, `customer-journey-map`)

Wejście: `docs/zadanie.md`, `docs/pm/01-competitive-analysis.md`, ustalenia P2–P28 z `docs/decyzje.md`, otwarte pytania z `docs/materialy.md`. Produkt: **Prześwit** (P11). Brak badań terenowych. P14–P28 mają odpowiedzi Artura; to, czego nie powiedział Artur ani zadanie, jest oznaczone **(założenie)** (tylko wariant 3 persony).

## Ustalenia P14–P28 (odpowiedzi Artura w pokoju Produkt)
| P | Sprawa | Stan |
|---|---|---|
| P14 | Jakie typy pojazdów obsługujemy (nasze dane: firanka, chłodnia, kontener, cysterna) | **Artur:** te 4 (firanka, chłodnia, kontener, cysterna) — odpowiedź jest |
| P15 | Skąd biblioteka wzorców i kto ją zasila | **Artur:** gotowa biblioteka z naszych czystych obrazów; dokładanie nowych później — odpowiedź jest |
| P16 | Co robi program, gdy dla typu nie ma wzorca | **Artur:** porównuje z najbliższym rodzajem i pisze wyraźnie „wzorzec przybliżony (chłodnia zamiast …)”; wynik mniej pewny |
| P17 | Co widzi operator po analizie | **Artur:** obraz z ponumerowanymi ramkami + lista do zatwierdzenia/odrzucenia, wzorzec obok; przy miejscu jedno słowo różnicy od wzorca (niski / średni / wysoki), bez procentów; lista od najbardziej różnego |
| P18 | Co zapisujemy przy wyniku (pola, §9: miejsce i przedmiot kontroli) | **Artur:** identyfikator kontroli, miejsce kontroli, data i godzina, typ pojazdu, **numer rejestracyjny naczepy**, lista miejsc z decyzją i powodem, kto zdecydował |
| P19 | Kim jest operator: doświadczenie, gdzie pracuje | **Artur:** funkcjonariusz SCS przy stanowisku RTG; nie zakładać doświadczenia — coraz częściej krótki staż, im narzędzie pomoże najbardziej |
| P20 | Ile aut ma operator na zmianę i ile czasu na jedno | **Artur:** kilkadziesiąt aut na zmianę; kilka minut na auto (P7) |
| P21 | Gdzie dziś boli najbardziej | **Artur:** małe skrytki ginące wśród podobnych obrazów i zmęczenie przy powtarzalnej pracy — odpowiedź jest |
| P22 | Skąd w raporcie numer rejestracyjny, miejsce kontroli, „kto zdecydował” | **Artur:** A — numer rejestracyjny wpisuje operator (jedno pole), miejsce kontroli = ustawienie stanowiska, „kto zdecydował” = zalogowany funkcjonariusz — odpowiedź jest |
| P23 | Co operator widzi przy wyniku mniej pewnym | **Artur:** A — słowa niski/średni/wysoki bez zmian + napis nad listą „wynik mniej pewny” — odpowiedź jest |
| P24 | Czy operator może zmienić rodzaj pojazdu dobrany przez system | **Artur:** B — tak, z listy jednym kliknięciem (zna rodzaj z dokumentów przewozowych); analiza liczy się od nowa — odpowiedź jest |
| P27 | Co z decyzjami o miejscach, gdy operator zmieni rodzaj pojazdu | **Artur:** A — decyzje znikają, wszystko liczy się od nowa; raport zapisuje oba rodzaje (dobrany przez program i poprawiony przez operatora) — odpowiedź jest |
| P28 | Gdzie operator wpisuje numer rejestracyjny przy kilku obrazach w partii | **Artur:** A — osobne pole numeru rejestracyjnego przy każdym obrazie partii, przed zatwierdzeniem wyniku — odpowiedź jest |
Z zadania/ustaleń, więc bez pytań: praca bez internetu (§9), sztuczne dane, bez wpływu człowieka na samą analizę (P9), przeoczenie gorsze od fałszywego alarmu (P4) — próg alarmu wynika z P4 (raczej pokazać miejsce więcej niż przeoczyć), lista powodów odrzucenia z P13.

## Persona (skill `user-personas`)
### Persona główna: Operator RTG na przejściu („Marek", imię umowne) — P19–P21 od Artura
- **Kim jest:** funkcjonariusz SCS przy stanowisku RTG, często z krótkim stażem (P19) — nie zakładamy wprawy w rozpoznawaniu konstrukcji; kilkadziesiąt aut na zmianę (P20); ogląda obrazy naczep i ciężarówek jeden za drugim, decyduje o skierowaniu na kontrolę fizyczną (zadanie §1).
- **Zadanie do wykonania:** w kilka minut na jedno auto ocenić, czy w konstrukcji lub ładunku jest coś, czego nie powinno być, i zdecydować: puścić albo skierować do kontroli fizycznej (P7).
- **3 największe bóle:** (1) małe skrytki i przeróbki konstrukcji giną w obrazie (słabość obecnego narzędzia, zadanie §1); (2) powtarzalność — dziesiątki podobnych obrazów, spada uwaga; (3) brak punktu odniesienia „jak powinno wyglądać" dla danego typu naczepy.
- **3 oczekiwane zyski:** (1) program wskazuje podejrzane miejsca zanim sam zacznie szukać; (2) szybka decyzja na gotowej liście, bez dodatkowego klikania (kilka minut na auto); (3) ślad decyzji w raporcie z minimum pisania (tylko numer rejestracyjny, P22).
- **Zaskakująca obserwacja (z P13):** najczęstszą pomyłką jest **nakładanie się ładunku** — program będzie się mylił tam, gdzie zgłoszony ładunek przysłania konstrukcję; operator potrzebuje szybko to odrzucić jednym kliknięciem z gotowym powodem, a nie pisać.
- **Dopasowanie produktu:** Prześwit zaznacza miejsca sam (P9), operator tylko decyduje (P13), pracuje partiami (P12). Tarcie: zbyt wiele ramek = operator przestaje ufać (i tak je odrzuca), zbyt mało = przeoczenie (gorsze, P4).

### Wariant 2: operator z krótkim stażem — coraz częstszy, narzędzie pomoże mu najbardziej (P19)
Mniej doświadczenia w rozpoznawaniu konstrukcji danego typu; potrzebuje wzorca obok (do porównania „co się zmieniło"). Ból: nie wie, co jest normą. Zysk: wzorzec typu jako lekcja. Wymaganie: obok obrazu badanego można zobaczyć wzorzec (P17); słowa niski/średni/wysoki zamiast liczb.

### Wariant 3: kierownik zmiany / przeglądający raporty **(założenie)**
Nie ogląda każdego auta, czyta zapisane wyniki: ile miejsc wskazano, ile odrzucono i z jakiego powodu. Zysk: raport z powodami (P13) pokazuje, gdzie program się myli (np. nakładanie ładunku). Na pokaz: tylko raport, bez osobnego ekranu (**UPROSZCZENIE: ekran kierownika zmiany — jeden raport zamiast panelu — dorobienie ~0,5 dnia**).

## Droga operatora (skill `customer-journey-map`) — od wjazdu auta do raportu
Persona: „Marek". Cel: decyzja o aucie w kilka minut. Etapy dopasowane do produktu (bez „pozyskania/rozgłosu": narzędzie wewnętrzne).

| # | Etap | Co robi operator | Co robi Prześwit | Emocja | Ból | Szansa |
|---|---|---|---|---|---|---|
| 0 | **Logowanie i ustawienie stanowiska** | na początku zmiany loguje się jako funkcjonariusz; stanowisko ma ustawione miejsce kontroli (P22 A) | zapamiętuje, kto pracuje i gdzie; dopisuje to do każdego raportu | rutyna | dodatkowe klikanie | raz na zmianę, nie przy każdym aucie |
| 1 | **Wjazd auta i skan** | auto wjeżdża, skaner robi obraz (plik .bmp, ~50 MB) | — (poza produktem; obraz trafia do repozytorium) | spokój/rutyna | duży plik, czekanie | wskazać kilka obrazów do partii (P12) |
| 2 | **Wskazanie obrazów** | wybiera jeden lub kilka obrazów (partia) i **wpisuje numer rejestracyjny naczepy w osobnym polu przy każdym obrazie, zanim zatwierdzi wynik** (P22 A; P28 A) | wczytuje po kolei | neutralna | nie wie, czy program już liczy | pasek postępu, ile gotowych |
| 3 | **Rozpoznanie typu i wzorca** | widzi rodzaj pojazdu dobrany przez system; jeśli nie zgadza się z dokumentami przewozowymi, **zmienia rodzaj z listy (firanka, chłodnia, kontener, cysterna) jednym kliknięciem** (P24 B) | rozpoznaje rodzaj, dobiera wzorzec z biblioteki (P2); po zmianie rodzaju **liczy analizę od nowa**; brak wzorca → najbliższy rodzaj z napisem „wzorzec przybliżony (… zamiast …)” i „wynik mniej pewny” (P16) | niepewność przy „wzorcu przybliżonym”; irytacja, gdy rodzaj źle dobrany | błędny dobór → lawina fałszywych alarmów | rodzaj i wzorzec widoczne obok, zmiana jednym kliknięciem |
| 4 | **Analiza sama** | czeka (< 1 min na obraz, §7) | zaznacza miejsca sam (P9) | niecierpliwość | czas | wynik na pierwszym obrazie przed końcem partii |
| 5 | **Przegląd wyniku** | ogląda obraz z ramkami i listę miejsc (P17); przy wzorcu przybliżonym widzi nad listą napis „wynik mniej pewny — wzorzec przybliżony” (P23 A: słowa niski/średni/wysoki się nie zmieniają, miejsca nie są ukrywane — P4) | pokazuje obraz, ponumerowane ramki, listę od najbardziej różnego (niski/średni/wysoki) | skupienie | za dużo ramek, mała skrytka ukryta | ramki ponumerowane, przybliżenie |
| 6 | **Decyzja przy każdym miejscu** | zatwierdza albo odrzuca; odrzucając wybiera powód z listy (P13): element konstrukcji / zgłoszony ładunek / błąd obrazu / nakładanie się ładunku / inny (tekst) | zapisuje decyzję i powód | pewność lub wątpliwość | pisanie tekstu | domyślne szybkie kliknięcia, „inny" tylko wyjątkowo |
| 7 | **Decyzja o aucie** | puszcza albo kieruje na kontrolę fizyczną (poza programem) | pokazuje, ile miejsc zatwierdzono | — | — | jedno zdanie podsumowania |
| 8 | **Raport** | sprawdza, że numer rejestracyjny przy obrazie (etap 2) jest wpisany, i zamyka sprawę | zapisuje raport z polami P18: identyfikator kontroli, data i godzina, typ, lista miejsc z decyzją i powodem; **rodzaj dobrany przez program i rodzaj poprawiony przez operatora (jeśli zmienił; P27 A)** — automatycznie; miejsce kontroli z ustawienia stanowiska i „kto zdecydował” z zalogowanego funkcjonariusza (P22 A) | ulga | wpisywanie numeru | jedno pole, reszta bez pisania |

**Chwile krytyczne:** *aha* — operator widzi ramkę dokładnie na skrytce, której sam nie zauważył (etap 5). *Chwila prawdy* — pierwsza ramka na czystej naczepie: jeśli pokaże się dużo fałszywych, operator przestaje ufać (etap 5–6). *Ryzyko porzucenia* — „wzorzec przybliżony" (etap 3) lub za dużo ramek: operator wraca do oglądania ręcznie.

## Wnioski dla ekranów (wejście do kroków 3–5)
- ekran wyniku: obraz + ramki + lista + powód odrzucenia z listy;
- widoczny rodzaj pojazdu i wzorzec obok; **lista rodzajów (firanka, chłodnia, kontener, cysterna) do zmiany jednym kliknięciem, po zmianie analiza liczy się od nowa i stan obrazu wraca do „liczy się”** (P24 B; po zmianie dotychczasowe decyzje znikają — P27 A); przy braku wzorca napis „wzorzec przybliżony (… zamiast …)” (P16);
- przy wyniku mniej pewnym stały napis „wynik mniej pewny” nad listą; słowo niski/średni/wysoki bez zmian (P23 A);
- przy każdym miejscu słowo różnicy (niski/średni/wysoki), lista od najbardziej różnego (P17);
- praca partiami: lista obrazów ze stanem (czeka / liczy się / gotowe);
- **ekran logowania i ustawień stanowiska** (funkcjonariusz, miejsce kontroli; raz na zmianę, P22 A);
- pole numeru rejestracyjnego naczepy przy każdym obrazie partii (wpisuje operator, P22 A; P28 A); raport z polami P18, miejsce kontroli i „kto zdecydował” automatycznie (P22 A); brak potrzeby osobnego ekranu kierownika (UPROSZCZENIE wyżej).



<!-- skill: user-personas -->
<!-- skill: customer-journey-map -->
<!-- skill: przeplywy-pm -->

