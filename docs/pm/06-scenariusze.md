# Krok 6 — scenariusze odbioru „Prześwit” (`/test-scenarios`, dane pokazowe — `dummy-dataset`)

Wejście: `docs/spec.md` (A1–A14, E1–E7), `docs/pm/05-write-prd.md`, `docs/decyzje.md` (P1–P81 (P53 A: zły plik odrzucony, reszta liczy się; P54 A: po ostatnim aucie lista partii z „Raport partii”; P55 B: jeden przycisk „Zapisz i zamknij partię”)). Dane **sztuczne**: `dane/mini` (16 badanych + 12 wzorców, 1024×256), `dane/mini-trudny` (przypadki: egzemplarz, ładunek legalny, mały dodatek, za ładunkiem), `dane/manifest*.json` (prawda o dodatkach). Skrót ról: OP = operator RTG; TEST = tester.

## Czego nie wiem o produkcie (pytania do Artura w pokoju)
- **P49** i **P75**: bez przedmiotu — P79 B (bez słów niski/średni/wysoki, tylko kolejność od najmocniejszego miejsca).
- **P50** (odpowiedź A) + **P56** (A): blokuje główna ścieżka oraz jeden przycisk „Zapisz i zamknij partię” (raport i zamknięcie razem; bez zamknięcia nie ma „rozstrzygnięte”).
- **P51** (odpowiedź B) + **P60** (odpowiedź B): demo = **partia 7 aut** (6 z `dane/mini` + **7. auto w partii: przypadek trudny za ładunkiem `trudny_mini_firanka_za_ladunkiem_00.bmp`**, bez oznaczania na ekranie, które auto jest trudne).
Scenariusze uwzględniają odpowiedzi P49–P81.

## Dane pokazowe (dummy-dataset)
**Partia pokazowa (7 aut: 6 z `dane/mini` + 7. przypadek trudny z `dane/mini-trudny`, P60 B)** — kolejność i oczekiwany stan na E3:
| auto | plik | rodzaj | dodatki wg manifestu | oczekiwane na E3 |
|---|---|---|---|---|
| auto 1 | `badany_mini_firanka_dodatki_00.bmp` | firanka | tak | gotowe, liczba miejsc > 0, główna ścieżka demo |
| auto 2 | `badany_mini_chlodnia_dodatki_01.bmp` | chłodnia | tak | gotowe |
| auto 3 | `badany_mini_kontener_dodatki_01.bmp` | kontener | tak | gotowe |
| auto 4 | `badany_mini_kontener_czyste_00.bmp` | kontener | nie | gotowe; stan „program nic nie wskazał — nieotwarte” do „Zamknij auto” (P80 A); miejsca wg v3 (na v3 ma ich kilka — „brak wskazań” w partii zależy od zadania P82) |
| auto 5 | `badany_mini_firanka_czyste_01.bmp` | firanka | nie | gotowe |
| auto 6 | `badany_mini_cysterna_dodatki_00.bmp` | cysterna | tak | **brak wzorca**, miejsc „—” (E5) |
| auto 7 | `trudny_mini_firanka_za_ladunkiem_00.bmp` | firanka | tak (za ładunkiem) | gotowe (bez oznaczania, które auto jest trudne — P60 B; w E4 ramka albo uczciwy napis „granica programu — oglądamy obraz sam” wg P52 A) |
Prawda o dodatkach i współrzędnych — z `dane/mini/manifest.json` (piksele badanego, (x0,y0)-(x1,y1)). Cysterna ma wzorce w `dane/mini`, ale **na pokazie jest wyjęta z biblioteki** (P35 A, spec E5) — TEST wyłącza wzorce cysterny przed S4.
**Dane operatora (udawane):** funkcjonariusz „SCS Kowalski”, miejsce „Terespol — stanowisko 2”; numery rej.: `WL 12345`, `LU 5T021`, `PZ 7K889`, `BI 22001`, `KR 8N334`, `GD 3P101`, `SK 9L512` (auto 7, trudny) (wymyślone, nie prawdziwe).
**Dodatkowe przypadki z `mini-trudny`:** `trudny_mini_firanka_maly_00.bmp` (mały dodatek), `trudny_mini_firanka_za_ladunkiem_00.bmp` (dodatek za ładunkiem), `trudny_mini_chlodnia_ladunek_legalny_00.bmp` (duży legalny ładunek → nie ma robić lawiny ramek).
**Plik nieprawidłowy:** dowolny `.txt` przemianowany na `.bmp` (S2b/E2) i plik BMP 8192×2048 (~50 MB) wygenerowany `dane/generator` (A12).

## Scenariusze (po jednym głównym na A1–A14; krótsze „Brzegowe” przy trudniejszych)
Format: **Cel — Warunki — Kroki → wynik — Oczekiwane.** Wszystkie kroki wykonuje OP, chyba że napisano TEST.

### S1 (A1) Ramki zgodne z kafelkami, lupa wspólna
**Warunki:** partia pokazowa policzona; wejście w auto 1. **Kroki:** 1) E4 → widać dwa obrazy (badany z ramkami, wzorzec) i kafelki; 2) kliknij kafelek 1 → ramka 1 zaznaczona, oba obrazy przybliżone w tym samym miejscu; 3) przewiń badany → wzorzec przewija się razem; 4) kliknij kafelek 2. **Oczekiwane:** numery ramek = numery kafelków; lupa ≤ 1 s (Z11: śr. 0,18 s); zmiana zaznaczenia przesuwa lupę na obu obrazach. **Brzegowe:** `trudny_mini_firanka_maly_00` — **kryterium:** mały dodatek widoczny w lupie = zaliczone; niewidoczny = blokuje oddanie (pada A1, wg P50) i wraca do Szefa (Z11 niesprawdzony na małym dodatku, notujemy wynik).

### S2 (A2) Kolejność bez słów
**Kroki:** 1) auto 1 → kafelki od najbardziej różnego; 2) sprawdź, że przy kafelku jest numer i stan, bez słów poziomu i bez „%” (P79 B); 3) auto 5 (`badany_mini_firanka_czyste_01.bmp`, bez dodatków wg manifestu) → kafelki tylko w kolejności, bez słów (P79 B); auto 2 (`chlodnia_dodatki_01`, 2 dodatki) ma tylko sprawdzić kolejność przy kilku miejscach. **Oczekiwane:** malejąca różnica; zero procentów i liczb na kafelkach; kolejność od najmocniejszego miejsca (P79 B); progów słów nie ma (P49, P75 bez przedmiotu).
**S2b Brzegowe:** wskaż `.txt` jako `.bmp` na E2 → komunikat po polsku, plik odrzucony, reszta partii liczy się dalej (P53 A).

### S3 (A3) Brak wskazań
**Warunki:** czyste auto z zerem miejsc spoza partii pokazowej (`czyste_zero` w `dane/scenariusze`, zadanie 31; w partii żadne auto nie ma 0 miejsc — odbiór zad. 30) — nie przestawiamy żadnego progu, spec nie ma progu liczby miejsc. Gdy takiego auta brak w danych, S3 czeka na zadanie 31. **Kroki:** wejdź w auto. **Oczekiwane:** komunikat „brak wskazań”, nie pusta lista; nr rej. i „Zamknij auto” dostępne.

### S4 (A4) Brak wzorca (cysterna)
**Warunki:** wzorce cysterny wyjęte z biblioteki; auto 6 (cysterna) w partii. **Kroki:** E3 → wiersz auto 6; wejdź. **Oczekiwane:** stan „brak wzorca”, liczba miejsc „—”; w E4/E5 **zero ramek** i dosłowny napis „brak wzorca — sprawdź obraz sam”; brak napisu „wynik mniej pewny” i brak wzorca przybliżonego; sam badany obraz z lupą (Z4: po wdrożeniu sprawdzić, że cysterny mają 0 ramek).

### S5 (A5) Podpowiedź „zwykle tu…”
**Kroki:** 1) auto 1 → bez żadnego klikania przeczytaj podpisy kafelków; 2) znajdź kafelek bez opisu konstrukcji. **Oczekiwane:** każdy kafelek ma linię podpowiedzi od razu, np. „zwykle tu: podwozie — belka poprzeczna”; kafelek bez opisu pokazuje „poza znaną konstrukcją, obejrzyj uważnie” (P42), nigdy puste miejsce ani „brak podpowiedzi”. Opisy sztuczne (Z14: ~73% ramek ma opis).

### S6 (A6) Zatwierdź / odrzuć
**Kroki:** 1) kafelek 1 → „Zatwierdź” (1 klik) → stan „zatwierdzone”; 2) kafelek 2 → „Odrzuć” bez wyboru powodu → blokada/komunikat; 3) „Odrzuć ▾” → powód „element konstrukcji” → „odrzucone”; 4) powtórz z „inny” → pole na własny tekst wymagane. **Oczekiwane:** lista powodów dokładnie: element konstrukcji, zgłoszony ładunek, błąd obrazu, nakładanie się ładunku, inny (P13); decyzje trafiają do raportu z powodem.

### S7 (A7) Zmiana rodzaju
**Warunki:** auto 1 (firanka) z decyzjami; **wzorce cysterny wyjęte z biblioteki (jak w S4, zanim zaczniesz krok 4)** — inaczej wybór „cysterna” da zwykłe porównanie, nie E5. **Kroki:** 1) „Zmień rodzaj” → E6 z listą 4 rodzajów i podglądem 2 najbliższych wzorców; 2) wybierz „chłodnia” → ostrzeżenie „decyzje w tym aucie zostaną skasowane”; 3) „Zastosuj”; 4) wybierz „cysterna” → E5. **Oczekiwane:** 1 klik zmiany; liczy się od nowa; decyzje auta znikają; raport zapisuje rodzaj programu i rodzaj operatora (P27 A).

### S8 (A8) Partia po kolei
**Kroki:** 1) E2 wskaż 7 plików „Policz partię” (partia pokazowa P60 B); 2) obserwuj E3 w trakcie. **Oczekiwane:** stany czeka → liczy się → gotowe po kolei, pasek postępu; każdy wiersz ma miniaturę, „auto N” i nazwę pliku (P44 A), rodzaj, liczbę miejsc; kliknięcie wiersza „gotowe” **przed końcem partii nic nie robi** (P38); po całej partii wiersze klikalne.

### S9 (A9) Numer rejestracyjny
**Kroki:** w E4 spróbuj „Zatwierdź” bez nr rej.; wpisz `WL 12345`; zatwierdź. **Oczekiwane:** osobne pole nr rej. przy każdym aucie, wymagane przed zatwierdzeniem wyniku (P28 A); po wpisaniu E3 pokazuje numer przy wierszu; nr zapisany w raporcie.

### S10 (A10) Następne auto
**Kroki:** w aucie 1 rozstrzygnij wszystkie miejsca (zatwierdź/odrzuć). **Oczekiwane:** po ostatnim miejscu otwiera się auto 2 (P40 B); po ostatnim aucie partii — powrót na listę partii (E3) z przyciskiem „Raport partii” (P54 A).

### S11 (A11) Raport
**Warunki:** auto 1–7 rozstrzygnięte, nr rej. wpisane (albo część aut bez decyzji → ostrzeżenie z listą aut „brak decyzji”, zapis możliwy po potwierdzeniu — P63 B). **Kroki:** E7 → „Zapisz i zamknij partię” (jeden przycisk, P55 B). **Oczekiwane:** pliki `.json` i `.csv` (lokalnie obok programu / pod linkiem pobiera przeglądarka); pola P18: id kontroli, miejsce „Terespol — stanowisko 2”, data i godzina decyzji operatora przy każdym aucie (auto bez decyzji „—”, P64 A), rodzaj programu i rodzaj operatora, nr rej., miejsca z decyzją i powodem, „SCS Kowalski” jako kto zdecydował; bez miniatury w raporcie (UPROSZCZENIE P72 A); zapis bez internetu lokalnie; w raporcie nic nie wpisywane ręcznie poza nr rej.; po zamknięciu przycisk „Nowa partia” wraca do E2 (P65 A).

### S12 (A12) Obraz 50 MB i „bez internetu”
**Kroki:** 1) TEST uruchamia lokalnie (Docker albo wiersz poleceń) z odłączoną siecią; 2) wskazuje BMP 8192×2048 (~50 MB); 3) mierzy czas do „gotowe”; 4) otwiera lupę. **Oczekiwane:** < 1 min (Z9: śr. 5,0 s, maks. 8,1 s, pamięć 1,21 GB); lupa ≤ 1 s; zero zapytań sieciowych (np. w logu sieci). Sprawdzenie nie idzie przez stronę ksefbot.pl (P43 A).

### S13 (A13) Zmiana decyzji z listy, „Zapisz i zamknij partię”
**Kroki:** 1) po rozstrzygnięciu auta 1 przejdź do auta 3; 2) wróć na E3 → wiersz auta 1 → zmień decyzję jednego miejsca → zapisz; 3) E7 „Zapisz i zamknij partię” (jeden przycisk, P55 B); 4) E3: wiersz auta 1; spróbuj zmienić decyzję. **Oczekiwane:** zmiana przed zamknięciem działa i trafia do raportu; po „Zapisz i zamknij partię” wiersze „rozstrzygnięte”, decyzji nie da się zmienić (P41 A, P46 A); Zapis i zamknięcie to jeden krok, osobnego „Zamknij partię” nie ma (P55 B).

### S14 (A14) Własny .bmp z linku (MVP)
**Warunki:** strona na ksefbot.pl wdrożona; usługa na karcie OMENa wystartowała razem z wdrożeniem (TEST nie uruchamia jej ręcznie). **Kroki:** 1) otwórz link w przeglądarce; 2) kliknij partię pokazową (`dane/mini`) → wynik; 3) wgraj własny `badany_mini_kontener_dodatki_00.bmp` → wynik; 4) wgraj BMP ~50 MB → wynik; 5) po restarcie hosta powtórz krok 3 bez ręcznego uruchamiania. **Oczekiwane:** wgranie z linku daje wynik (nie błąd połączenia i nie „wgrywanie wyłączone”); usługa słucha po wdrożeniu i po restarcie; wgrywania nie wycinamy (P43 A, Paweł). Nieprawdziwy wynik = blokuje oddanie MVP.

## Ścieżka demo (do 2 min) — przejście ręczne (wg `docs/demo.md`, 113 s)
E1 (5 s) → E2/E3 partia 7 aut (14 s) → auto 1: S1+S5 (20 s) → S6 + S9 (2 miejsca, wracamy na listę, reszta „oczekuje” — P69 A, 22 s) → auta 4 i 6 z listy: „program nic nie wskazał — nieotwarte” (P80 A), „brak wzorca” (S4, P35 A; 14 s) → auto 7 (trudny, bez oznaczania; P51 B, P60 B, P52 A; 14 s) → E7 S11 „Zapisz i zamknij partię” z ostrzeżeniem o autach bez decyzji (P63 B; 14 s) → krok 8 „Nowa partia” (P65 A) i własny .bmp z linku (A14; 10 s). **Suma 113 s, zapas 7 s (R9, P69 A).** „Dodaj jeden obraz” (P61 A) to osobny krok poza 2 minutami. Czas zapisać; > 2 min = poprawka scenariusza demo.

## Co blokuje oddanie (P50 A, zmienione przez P56 A)
Przypadek trudny w demo (P51 B, P52): `trudny_mini_firanka_za_ladunkiem_00.bmp` — widać dodatek za ładunkiem w lupie albo uczciwie brak ramki z podpisem „granica programu — oglądamy obraz sam” (P52 A); przeoczenia na tym przypadku wg Z7 trzeba wpisać do raportu jako dane sztuczne, nie jako obietnicę.

Blokują: S1, S4, S6, S9, S11, S13 (przycisk „Zapisz i zamknij partię”, P56 A), S14 (główna ścieżka i bezpieczeństwo przeoczeń: operator widzi miejsca, decyzja i raport działają, własny plik z linku działa). Nie blokują, ale wpisujemy do raportu z oceny: S2 wartości progów, S3, S7, S8 pasek, S12 pomiary liczbowe. Konflikt P50 z P55 rozstrzygnięty: P56 A — S11 i S13 blokują razem (jeden przycisk). Cele liczbowe (przeoczenia ≤ 10%, ramki ≤ 6) to osobne pomiary w `docs/spec.md` §5, nie scenariusze.

<!-- skill: test-scenarios -->
<!-- skill: dummy-dataset -->
<!-- skill: przeplywy-pm -->
