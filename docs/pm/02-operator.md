# Krok 2 — Operator: persona i droga od wjazdu auta do raportu (`user-personas`, `customer-journey-map`)

Wejście: `docs/zadanie.md`, `docs/pm/01-competitive-analysis.md`, ustalenia P2–P13 z `docs/decyzje.md`, otwarte pytania z `docs/materialy.md`. Produkt: **Prześwit** (P11). Brak badań terenowych — to, czego nie powiedział Artur ani zadanie, jest oznaczone **(założenie)** i wisi jako pytanie P14–P21.

## Czego nie wiem o produkcie (każde = pytanie do Artura w pokoju Produkt)
| P | Sprawa | Rekomendacja (do czasu odpowiedzi = założenie w tym pliku) |
|---|---|---|
| P14 | Jakie typy pojazdów obsługujemy (nasze dane: firanka, chłodnia, kontener, cysterna) | te 4 |
| P15 | Skąd biblioteka wzorców i kto ją zasila | w pierwszej wersji biblioteka z obrazów czystych, które mamy; dokładanie wzorców przez opiekuna systemu — później |
| P16 | Co robi program, gdy dla typu nie ma wzorca | pokazuje wyraźne „brak wzorca dla tego typu — nie sprawdzono"; nie zgaduje; operator ogląda sam |
| P17 | Co widzi operator po analizie | obraz z ramkami + lista miejsc do zatwierdzenia/odrzucenia; bez oceny ryzyka w procentach |
| P18 | Co zapisujemy przy wyniku (pola, §9: miejsce i przedmiot kontroli) | identyfikator kontroli, miejsce kontroli, data i godzina, typ pojazdu, lista miejsc z decyzją i powodem, kto zdecydował |
| P19 | Kim jest operator: doświadczenie, gdzie pracuje | doświadczony funkcjonariusz Służby Celno-Skarbowej przy stanowisku RTG na przejściu granicznym |
| P20 | Ile aut ma operator na zmianę i ile czasu na jedno | kilka minut na auto (P7 — ustalone); liczba aut na zmianę: kilkadziesiąt (założenie) |
| P21 | Gdzie dziś boli najbardziej | małe skrytki w konstrukcji, które giną w wielu podobnych obrazach, i zmęczenie przy powtarzalnej pracy |
Z zadania/ustaleń, więc bez pytań: praca bez internetu (§9), sztuczne dane, bez wpływu człowieka na samą analizę (P9), przeoczenie gorsze od fałszywego alarmu (P4) — próg alarmu wynika z P4 (raczej pokazać miejsce więcej niż przeoczyć), lista powodów odrzucenia z P13.

## Persona (skill `user-personas`)
### Persona główna: Operator RTG na przejściu („Marek", imię umowne) — **(założenie: P19–P21)**
- **Kim jest:** funkcjonariusz SCS przy stanowisku RTG; ogląda obrazy naczep i ciężarówek jeden za drugim, decyduje o skierowaniu na kontrolę fizyczną (zadanie §1).
- **Zadanie do wykonania:** w kilka minut na jedno auto ocenić, czy w konstrukcji lub ładunku jest coś, czego nie powinno być, i zdecydować: puścić albo skierować do kontroli fizycznej (P7).
- **3 największe bóle:** (1) małe skrytki i przeróbki konstrukcji giną w obrazie (słabość obecnego narzędzia, zadanie §1); (2) powtarzalność — dziesiątki podobnych obrazów, spada uwaga; (3) brak punktu odniesienia „jak powinno wyglądać" dla danego typu naczepy.
- **3 oczekiwane zyski:** (1) program wskazuje podejrzane miejsca zanim sam zacznie szukać; (2) szybka decyzja na gotowej liście, bez dodatkowego klikania (kilka minut na auto); (3) ślad decyzji w raporcie bez ręcznego pisania.
- **Zaskakująca obserwacja (z P13):** najczęstszą pomyłką jest **nakładanie się ładunku** — program będzie się mylił tam, gdzie zgłoszony ładunek przysłania konstrukcję; operator potrzebuje szybko to odrzucić jednym kliknięciem z gotowym powodem, a nie pisać.
- **Dopasowanie produktu:** Prześwit zaznacza miejsca sam (P9), operator tylko decyduje (P13), pracuje partiami (P12). Tarcie: zbyt wiele ramek = operator przestaje ufać (i tak je odrzuca), zbyt mało = przeoczenie (gorsze, P4).

### Wariant 2: nowy operator **(założenie)**
Mniej doświadczenia w rozpoznawaniu konstrukcji danego typu; potrzebuje wzorca obok (do porównania „co się zmieniło"). Ból: nie wie, co jest normą. Zysk: wzorzec typu jako lekcja. Wymaganie: obok obrazu badanego można zobaczyć wzorzec (P17).

### Wariant 3: kierownik zmiany / przeglądający raporty **(założenie)**
Nie ogląda każdego auta, czyta zapisane wyniki: ile miejsc wskazano, ile odrzucono i z jakiego powodu. Zysk: raport z powodami (P13) pokazuje, gdzie program się myli (np. nakładanie ładunku). Na pokaz: tylko raport, bez osobnego ekranu (**UPROSZCZENIE: ekran kierownika zmiany — jeden raport zamiast panelu — dorobienie ~0,5 dnia**).

## Droga operatora (skill `customer-journey-map`) — od wjazdu auta do raportu
Persona: „Marek". Cel: decyzja o aucie w kilka minut. Etapy dopasowane do produktu (bez „pozyskania/rozgłosu": narzędzie wewnętrzne).

| # | Etap | Co robi operator | Co robi Prześwit | Emocja | Ból | Szansa |
|---|---|---|---|---|---|---|
| 1 | **Wjazd auta i skan** | auto wjeżdża, skaner robi obraz (plik .bmp, ~50 MB) | — (poza produktem; obraz trafia do repozytorium) | spokój/rutyna | duży plik, czekanie | wskazać kilka obrazów do partii (P12) |
| 2 | **Wskazanie obrazów** | wybiera jeden lub kilka obrazów (partia) | wczytuje po kolei | neutralna | nie wie, czy program już liczy | pasek postępu, ile gotowych |
| 3 | **Rozpoznanie typu i wzorca** | nic nie robi | rozpoznaje typ pojazdu, dobiera wzorzec z biblioteki (P2); **brak wzorca → komunikat (P16)** | niepewność przy „brak wzorca" | błędny dobór → lawina fałszywych alarmów | pokazać typ i wzorzec obok, by operator mógł zaprzeczyć |
| 4 | **Analiza sama** | czeka (< 1 min na obraz, §7) | zaznacza miejsca sam (P9) | niecierpliwość | czas | wynik na pierwszym obrazie przed końcem partii |
| 5 | **Przegląd wyniku** | ogląda obraz z ramkami i listę miejsc (P17) | pokazuje obraz, ramki, listę | skupienie | za dużo ramek, mała skrytka ukryta | ramki ponumerowane, przybliżenie |
| 6 | **Decyzja przy każdym miejscu** | zatwierdza albo odrzuca; odrzucając wybiera powód z listy (P13): element konstrukcji / zgłoszony ładunek / błąd obrazu / nakładanie się ładunku / inny (tekst) | zapisuje decyzję i powód | pewność lub wątpliwość | pisanie tekstu | domyślne szybkie kliknięcia, „inny" tylko wyjątkowo |
| 7 | **Decyzja o aucie** | puszcza albo kieruje na kontrolę fizyczną (poza programem) | pokazuje, ile miejsc zatwierdzono | — | — | jedno zdanie podsumowania |
| 8 | **Raport** | zamyka sprawę | zapisuje raport z polami (P18) | ulga | ręczne uzupełnianie | zero ręcznego pisania |

**Chwile krytyczne:** *aha* — operator widzi ramkę dokładnie na skrytce, której sam nie zauważył (etap 5). *Chwila prawdy* — pierwsza ramka na czystej naczepie: jeśli pokaże się dużo fałszywych, operator przestaje ufać (etap 5–6). *Ryzyko porzucenia* — „brak wzorca" (etap 3) lub za dużo ramek: operator wraca do oglądania ręcznie.

## Wnioski dla ekranów (wejście do kroków 3–5)
- ekran wyniku: obraz + ramki + lista + powód odrzucenia z listy;
- widoczny typ pojazdu i wzorzec obok (P2, P16);
- praca partiami: lista obrazów ze stanem (czeka / liczy się / gotowe);
- raport z polami P18; brak potrzeby osobnego ekranu kierownika (UPROSZCZENIE wyżej).

<!-- skill: user-personas -->
<!-- skill: customer-journey-map -->
<!-- skill: przeplywy-pm -->
