# Prześwit — spec 1. wersji (MVP) — `/write-prd`

Źródła: `docs/zadanie.md`, `docs/pm/01–04`, `szkice-wariantow.md`, wynik Artura **P36: wariant C** (badany i wzorzec obok siebie, kafelki miejsc pod spodem, podpowiedź „zwykle tu…”) **+ lista partii z wariantu B jako pierwszy ekran**. Makiety: C https://pawelpisarek.github.io/hacknation-proba17/makieta/warianty/c/ , B (lista) https://pawelpisarek.github.io/hacknation-proba17/makieta/warianty/b/ . Wszystkie liczby: **dane sztuczne** (`dane/mini`, `dane/mini-trudny`), źródło — linie `WYNIK` w `docs/decyzje.md`.

## 1. Co zobaczy i zrobi użytkownik (według Artura)
Operator RTG (krótki staż możliwy, P19; kilkadziesiąt aut na zmianę, P20; kilka minut na auto, P7):
1. loguje się i raz na zmianę ustawia stanowisko (miejsce kontroli) — P22 A;
2. wskazuje kilka obrazów .bmp (partia) — P12 A; program liczy je **po kolei** i oddaje **listę partii**;
3. na liście widzi wiersze aut (P37 B): „auto N” z nazwą pliku (nr rej. po wpisaniu w E4; P44 A), rodzaj pojazdu, stan (czeka / liczy się / gotowe / brak wzorca), liczba miejsc, **miniatura obrazu** (P37 B, jak w makiecie B);
4. wchodzi w auto **dopiero gdy cała partia jest policzona** (P38: pomysł 7 odrzucony w P29);
5. w aucie widzi **dwa obrazy obok siebie**: badany z ponumerowanymi ramkami i wzorzec tego samego rodzaju; przewijanie i przybliżanie wspólne (lupa, pomysł 3);
6. pod obrazami **kafelki miejsc** od najbardziej różnego, przy każdym numer i stan, bez słów niski / średni / wysoki i bez procentów — liczy się kolejność od najmocniejszego miejsca (P79 B, zmienia P17);
7. klika kafelek → lupa na obu obrazach naraz; **podpowiedź „zwykle tu…” jest od razu przy każdym kafelku** (P39 B, jak w makiecie C);
8. **zatwierdza** (1 klik) albo **odrzuca** z powodem z listy: element konstrukcji, zgłoszony ładunek, błąd obrazu, nakładanie się ładunku, inny (własny tekst) — P13;
9. wpisuje **numer rejestracyjny** naczepy — osobne pole przy każdym aucie, przed zatwierdzeniem wyniku (P22 A, P28 A);
10. po rozstrzygnięciu ostatniego miejsca w aucie **otwiera się następne auto z partii** (P40 B);
11. może zmienić rodzaj pojazdu jednym kliknięciem z listy (z podglądem dwóch najbliższych wzorców); analiza liczy się od nowa, dotychczasowe decyzje tego auta znikają, raport zapisuje oba rodzaje (P24 B, P27 A);
12. po całej partii dostaje **raport** zapisany lokalnie.

## 2. Ekrany (lista dla Programisty — nic do zgadywania)
Język ekranu: polski. Udawane dane: z `dane/mini` i `dane/mini-trudny` (nazwy plików `badany_mini_<rodzaj>_<czyste|dodatki>_NN.bmp` oraz `trudny_mini_firanka_za_ladunkiem_00.bmp`), makieta używa PNG z `makieta/warianty/obrazy/`. W makiecie pasek „ekrany E1…E7” i tytuł „makieta R1” są ukryte dla oglądającego — zostaje klikana ścieżka jak w prawdziwym programie (P66 A); ramki w makiecie pokazują też jedno pudło obok prawdziwego dodatku, zgodnie z celem ok. 80% trafień (P67 A).

| # | Ekran | Co jest | Udawane dane / uwagi |
|---|---|---|---|
| E1 | Logowanie i stanowisko | pole „funkcjonariusz” (lista), pole „miejsce kontroli” (lista), przycisk „Zacznij zmianę” | funkcjonariusz „SCS Kowalski”, miejsce „Terespol — stanowisko 2” (**dane udawane**); raz na zmianę |
| E2 | Wybór partii | przycisk „Wskaż obrazy .bmp” (w makiecie prawdziwy wybór plików z dysku; własny plik pokazuje wynik przykładowy z napisem „makieta: wynik przykładowy, nie z Twojego obrazu” — P62 A), lista wybranych plików, „Policz partię”; makieta i demo idą na `dane/mini` + `dane/mini-trudny` (PNG); wymaganie 50 MB (A12) potwierdza pomiar zadania 20 (v3): śr. 1,7 s, maks. 2,1 s (zestaw trudny śr. 1,19 s) | **7 aut w partii pokazowej** (P51 B, P60 B): 6 z `dane/mini` (firanka dodatki_00, chłodnia dodatki_01, kontener dodatki_01, kontener czyste_00, firanka czyste_01, cysterna dodatki_00) + **7. auto w partii: przypadek trudny `trudny_mini_firanka_za_ladunkiem_00.bmp`** (bez oznaczania na ekranie, które auto jest trudne) |
| E3 | Lista partii (z wariantu B); po ostatnim aucie wraca tu z przyciskiem „Raport partii” (P54 A) | tabela: miniatura, „auto N” + nazwa pliku (P44 A), rodzaj, stan, liczba miejsc (P37 B); stan liczy się po kolei (pasek postępu partii); wiersz „gotowe” klikalny dopiero po policzeniu całej partii (P38); zawsze przycisk „Dodaj jeden obraz” — plik liczy się i dopisuje jako kolejne auto (P61 A); po zamknięciu partii przycisk „Nowa partia” (P65 A) | **7 wierszy** (6 z `dane/mini` + 7. przypadek trudny `trudny_mini_firanka_za_ladunkiem_00.bmp`, bez oznaczania, które jest trudne — P60 B); jeden ze stanem „brak wzorca” (cysterna), liczba miejsc „—” |
| E4 | Auto — widok C | lewo: badany z ramkami 1…n; prawo: wzorzec (nazwa rodzaju + przycisk „Zmień rodzaj”); wspólne przewijanie i lupa; pod spodem kafelki (numer, stan: oczekuje / zatwierdzone / odrzucone); pole „Nr rej.”; przyciski „Zatwierdź”, „Odrzuć ▾ powód”; podpowiedź „zwykle tu…” przy każdym kafelku od razu (P39 B) | firanka_dodatki_00: 6 kafelków; podpowiedź np. „zwykle tu: podwozie — belka poprzeczna” | Lista miejsc: 6 najsilniejszych, pod szóstym widoczna linia „i jeszcze N miejsc — pokaż” (P57 A; nic nie jest chowane po cichu).
| E5 | Auto — brak wzorca | zamiast ramek i kafelków napis **„brak wzorca — sprawdź obraz sam”**; sam badany obraz z lupą; pola nr rej. i „Zamknij auto” (P35 A) | cysterna (nie ma jej w bibliotece wzorców) |
| E6 | Zmiana rodzaju | lista 4 rodzajów (firanka, chłodnia, kontener, cysterna), podgląd 2 najbliższych wzorców badanego obrazu (z numerami 1 i 2 — P70 A) obok badanego, „Zastosuj”; ostrzeżenie „decyzje w tym aucie zostaną skasowane” (P27 A) | wybór cysterny → E5 |
| E7 | Raport partii | tabela po aucie: nr rej., rodzaj programu i rodzaj operatora (P27 A), liczba miejsc, decyzje z powodami, kto zdecydował, miejsce kontroli, data i godzina decyzji operatora przy każdym aucie (auto bez decyzji „—” — P64 A) (P18); „Zapisz i zamknij partię” (gdy część aut nie ma decyzji: ostrzeżenie z listą aut „brak decyzji”, zapis możliwy po potwierdzeniu — P63 B); po zamknięciu przycisk „Nowa partia” wraca do E2 (P65 A) | zapis pliku .json i .csv — w wersji pod linkiem pobiera je przeglądarka; „bez internetu” dotyczy tylko uruchomienia lokalnego (P43 A, A12); miniatura z zaznaczonymi miejscami w raporcie wycięta z MVP → UPROSZCZENIE (P72 A) |

Stan w nagłówku: „gotowe” (nie „policzone”). **Nie ma** napisu „wynik mniej pewny” ani wzorca przybliżonego (P35 A).

## 3. Wejście / wyjście / dane
- **Wejście:** pliki `.bmp` (do ~50 MB każdy, 8192×2048), biblioteka wzorców czystych dla 4 rodzajów (gotowa z naszych czystych obrazów — P15; cysterna bez wzorca na pokazie → E5, P35 A).
- **Wyjście (na obraz):** rodzaj, wzorzec, lista miejsc `{nr, x0,y0,x1,y1}` posortowana od najbardziej różnego, stan; **raport** (E7) z polami P18 + numer rejestracyjny + oba rodzaje.
- **Dane pokazowe (sztuczne):** `dane/mini`, `dane/mini-trudny`, `dane/manifest*.json`; wyniki pomiarów tylko z dopiskiem „dane sztuczne”. Na każdym ekranie wąski pasek u góry „dane sztuczne — demonstracja” (P59 A, scalone z P68).
- **Działanie:** docelowo lokalnie, bez internetu (P25 A). **MVP (P43 A, Paweł):** strona na ksefbot.pl wysyła .bmp do usługi liczącej na karcie OMENa + przycisk partii pokazowej z `dane/mini`; usługa startuje razem z wdrożeniem strony (nie osobno). Wgranie własnego .bmp (także ~50 MB) działa z linku i nie jest wycinane. „Bez internetu” sprawdzamy uruchomieniem lokalnym (Docker albo wiersz poleceń).

## 4. Kryteria akceptacji (według job stories z `03-discover.md`, P-ów Artura i zadania)
| AC | Warunek | Źródło |
|---|---|---|
| A1 | Ramki na badanym mają numery zgodne z kafelkami; kliknięcie kafelka zaznacza ramkę i przybliża oba obrazy w tym samym miejscu | JS1 AC1,3,4a; P36 C |
| A2 | Kafelki od najbardziej różnego, bez słów i procentów, tylko numer, stan i kolejność; progi słów nie istnieją (P49, P75 bez przedmiotu) | P79 B (zmienia P17, P45); JS1 AC2 |
| A3 | Obraz bez miejsc: napis „brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam” (P58 A), nie pusta lista | JS1 AC4 |
| A4 | Brak wzorca → zero ramek i napis „brak wzorca — sprawdź obraz sam” | P35 A; JS1 AC5, JS3 AC6 |
| A5 | Podpowiedź „zwykle tu…” widoczna od razu przy każdym kafelku, bez klikania; kafelek bez opisu (ok. 27% ramek, Z14) — wg P42 (Artur) napis „poza znaną konstrukcją, obejrzyj uważnie” | P39 B, P42; JS1 AC4b |
| A6 | Odrzucenie wymaga powodu z listy P13; zatwierdzenie jednym kliknięciem; decyzja w raporcie | JS2 |
| A7 | Zmiana rodzaju: 1 klik z listy 4 rodzajów, podgląd 2 najbliższych wzorców, przeliczenie od nowa, decyzje auta znikają, raport z oboma rodzajami | P24 B, P27 A; JS3 |
| A8 | Partia liczy się po kolei; wiersz auta z miniaturą (P37 B); wejście w auto dopiero po całej partii | P12, P37, P38; JS4 |
| A9 | Osobne pole nr rej. przy każdym aucie, przed zatwierdzeniem wyniku | P28 A |
| A10 | Po ostatnim miejscu otwiera się następne auto partii; po ostatnim aucie partii — powrót na listę partii (E3) z przyciskiem „Raport partii” (decyzje jeszcze do zmiany, P41) | P40 B, P54 A |
| A11 | Raport z polami P18: id kontroli, miejsce (z ustawienia stanowiska), data i godzina decyzji operatora przy każdym aucie (auto bez decyzji „—”, P64 A), rodzaj programu i operatora, nr rej., miejsca z decyzją i powodem, kto zdecydował (zalogowany); bez pisania poza nr rej.; zapis lokalny jednym przyciskiem „Zapisz i zamknij partię” (gdy część aut bez decyzji: ostrzeżenie z listą aut „brak decyzji”, zapis możliwy po potwierdzeniu — P63 B; zapis .json i .csv + zamknięcie partii; blokuje oddanie razem z raportem — P56 A, Artur 13:03; zamykanie partii nie czeka, zmiana P50) | P18, P22 A, P55 B, P63 B, P64 A; JS5 |
| A12 | Obraz 50 MB < 1 min; „bez internetu” sprawdzane uruchomieniem lokalnym (Docker/wiersz poleceń), nie przez stronę | zadanie §3, §7, §9; P43 A |
| A14 | Wgranie własnego .bmp z linku (ksefbot.pl) daje wynik; na liście partii zawsze jest przycisk „Dodaj jeden obraz” (P61 A); usługa na karcie OMENa działa od wdrożenia strony | P43 A, P61 A |
| A13 | Decyzję w poprzednim aucie można zmienić z listy partii (lista → auto → zmiana) do zamknięcia partii jednym przyciskiem „Zapisz i zamknij partię” w E7 (P55 B); potem wiersz E3 „rozstrzygnięte”, bez zmian (P46 A), przycisk „Nowa partia” wraca do E2 (P65 A); słowa niski/średni/wysoki = stałe progi siły różnicy, takie same w każdym aucie (P45 B; wartości progów — do ustalenia, PARAMETR) | P41 A, P45, P46, P65 A |

## 5. Cele liczbowe Artura i stan pomiarów (dane sztuczne, metoda bazowa i v2 — zadanie 19; zadanie 20 w toku)
| Miara | Cel | Dziś | Źródło |
|---|---|---|---|
| Przeoczenia dodatków | ≤ 10% (90 ze 100, P31 A) | 12,5% bazowo (8/64); 14% na `mini` (2/14); v2: 12/64 zwykły, 11/62 trudny | Z1, zad. 19 |
| Ramki na czystym aucie | ≤ 6 (P30 B) | średnio ~17,7 (bazowo); v2: 4,2 zwykły, 12,9 trudny; ≤ 6 ramek na 4% czystych | Z2, Z6, zad. 19 |
| Prawdziwe trafienie w pierwszych 6 ramkach | ≥ 90% obrazów (nasze założenie) | 80% (48% w pierwszych 3) | Z8 |
| Czas 50 MB | < 1 min | śr. 1,7 s, maks. 2,1 s (zestaw trudny śr. 1,19 s, maks. 1,49 s); wcześniej v1 śr. 5,0 s (Z9) | zad. 20 (v3, 4beef05) |
| Lupa | ≤ 1 s | śr. 0,18 s, maks. 0,34 s | Z11 |
| Dobór rodzaju | ≥ 95% | 79/80 = 99% | Z3 |
Cele ramek i przeoczeń **dziś niespełnione** — Szef: próg P30 B zostaje; pytanie do Artura dopiero gdy zadanie 20 też nie da ≤ 6 ramek.

## 6. Ryzyka i najryzykowniejsze założenia (P33: Z1, Z2+Z6, Z7, Z11)
- **Z1** nie przeoczyć (14% > 10%); **Z2+Z6** za dużo ramek / nakładanie ładunku (obalone na metodzie bazowej); **Z7** małe i za ładunkiem (17%/26%, pomiędzy); **Z11** lupa na 50 MB — potwierdzona (≤ 0,34 s; mały dodatek w lupie niesprawdzony).
- **Z12 (wzorzec obok):** przesunięcie wzorca mediana 3,1 px, ale w polach prawdziwych dodatków mediana 6,5 px, maks. 14 — mały dodatek bywa mniejszy niż przesunięcie; widok C wymaga dobrego dopasowania — do przeglądu na makiecie z osobą z zewnątrz.
- **Z14 (podpowiedź):** opis ma 73% ramek (próg 80%, pomiędzy); ramki poza strefami bez opisu; opisy ze sztucznego generatora.
- **Z4:** po wdrożeniu napisu E5 sprawdzić, że cysterny mają 0 ramek i napis; **Z13:** n = 1, bez werdyktu.
- Dwa obrazy na jednym ekranie — każdy mniejszy (wariant C): lupa wspólna łagodzi.
- Dane tylko sztuczne (Z10: stosunek przeoczeń 0,6, n małe) — w opisie zawsze „na danych sztucznych”.

## 7. Demo do 2 min (główna ścieżka)
E1 (5 s) → E2/E3 partia 7 aut policzona (20 s) → wejście w firanka_dodatki_00 → E4: dwa obrazy, kafelek 1 → lupa, podpowiedź „zwykle tu…” (40 s) → rozstrzygamy 2 miejsca (Zatwierdź, Odrzuć z powodem „element konstrukcji”), wpisz nr rej., wracamy na listę, pozostałe miejsca zostają „oczekuje” (P69 A; 25 s) → **7. auto w partii: przypadek trudny `trudny_mini_firanka_za_ladunkiem_00.bmp` (P51 B, P60 B — wewnątrz partii, bez oznaczania na ekranie, które jest trudne): dodatek za ładunkiem — widać ramkę w lupie albo, gdy jej nie ma (Z7: przeoczenia małych dodatków 17–26%), uczciwy napis „granica programu — oglądamy obraz sam” i oglądanie obrazu samemu (P52 A, Artur)** (15 s) → cysterna E5 „brak wzorca — sprawdź obraz sam” (10 s) → „Dodaj jeden obraz” na liście partii (własny `.bmp` z linku, P61 A, A14) → E7 „Zapisz i zamknij partię” (ostrzeżenie z listą aut „brak decyzji” → potwierdzenie, P63 B; 5 s) — powrót po ostatnim aucie na listę partii z „Raport partii” (P54 A).

Skład partii pokazowej (P60 B): **7 aut w partii** — 6 z `dane/mini` (firanka dodatki_00, chłodnia dodatki_01, kontener dodatki_01, kontener czyste_00, firanka czyste_01, cysterna dodatki_00) + **7. auto w partii `trudny_mini_firanka_za_ladunkiem_00.bmp`** (operator nie wie z góry, które jest trudne; tak samo na pokazie). Dodanie jednego własnego obrazu w trakcie pokazu przez przycisk „Dodaj jeden obraz” na liście partii (P61 A, A14). W partii nie ma firanki czystej _00 ani chłodni czystej.

## 8. UPROSZCZENIA
UPROSZCZENIE: logowanie i ustawienie stanowiska — jedna lista funkcjonariuszy i miejsc zamiast Keycloak/AD — dorobienie: integracja z logowaniem KAS (kilka godzin)
UPROSZCZENIE: partia = obrazy liczone po kolei, wejście w auto po całej partii — bez wyniku na bieżąco i bez skalowania (jedno zdanie w opisie, jak by rosło) — dorobienie: równoległe liczenie i wynik na bieżąco (pomysł 7, odrzucony)
UPROSZCZENIE: biblioteka wzorców z naszych sztucznych czystych obrazów, bez dokładania przez opiekuna — dorobienie: ekran dokładania wzorców
UPROSZCZENIE: podpowiedź „zwykle tu…” z generatora (4 sztuczne rodzaje), nie z prawdziwych naczep — dorobienie: opisy od ekspertów KAS
UPROSZCZENIE: raport zapisywany lokalnie jako plik, bez repozytorium KAS i bez ekranu kierownika zmiany — dorobienie: integracja z repozytorium obrazów
UPROSZCZENIE: brak miniatury obrazu z zaznaczonymi miejscami (zatwierdzone/odrzucone) przy każdym aucie w raporcie E7 (P72 A) — tabela z decyzjami i powodami — dorobienie: miniatura z ramkami w wierszu raportu po MVP (ok. 1–2 h)


## 9. Poza zakresem (P10, P29, P32)
Odrzucone pomysły 4, 5, 7, 8, 9; wykrywanie konkretnego towaru, porównanie z deklaracją, integracja ze skanerami, chmura, wzorce na dostawcę, rozbudowane skalowanie.

## 10. Ustalenia w specu — P37–P72
| P | Rozstrzygnięcie | Stan |
|---|---|---|
| P37 | B — wiersz auta z miniaturą | odpowiedź Artura 12:43 (wygrywa z rekomendacją) |
| P38 | B — wejście w auto dopiero po całej partii | odpowiedź Artura 12:41 (z P29) |
| P39 | B — podpowiedź przy każdym kafelku | odpowiedź Artura 12:43 |
| P40 | B — po ostatnim miejscu następne auto | odpowiedź Artura 12:43 |
| P41 | A — decyzje można zmienić z listy partii do zamknięcia sprawy | odpowiedź Artura 12:44 |
| P42 | kafelek bez opisu: napis „poza znaną konstrukcją, obejrzyj uważnie” (odpowiedź własna, ani A, ani B) | odpowiedź Artura w pokoju |
| P43 | A (Paweł) — MVP na ksefbot.pl + usługa na OMENie od wdrożenia, własny .bmp z linku (A14) | odpowiedź Pawła 12:51 |
| P44 | A — „auto N” z nazwą pliku na liście | odpowiedź Artura 12:52 |
| P45 | B — stałe progi słów, wspólne dla aut (nie „trzy równe części”) | odpowiedź Artura 12:52 |
| P46 | A — „Zapisz i zamknij partię” w E7, potem „rozstrzygnięte” | odpowiedź Artura 12:52 |
| P52 | A — demo uczciwie: przy dodatku za ładunkiem może nie być ramki, mówimy o granicy programu | odpowiedź Artura |
| P53 | A — zepsuty plik odrzucony z komunikatem po polsku, reszta partii liczy się | odpowiedź Artura |
| P54 | A — po ostatnim aucie lista partii (E3) z przyciskiem „Raport partii”, decyzje jeszcze do zmiany | odpowiedź Artura |
| P55 | B — jeden przycisk „Zapisz i zamknij partię” w E7 (zastępuje „Zapisz lokalnie” i „Zamknij partię”) | odpowiedź Artura, zmiana rekomendacji |
| P56 | A — „Zapisz i zamknij partię” (raport + zamknięcie razem) blokuje oddanie; zmienia P50 (zamykanie partii nie czeka) | odpowiedź Artura 13:03 |
| P57 | A — lista 6 najsilniejszych miejsc + linia „i jeszcze N miejsc — pokaż” (E4) | odpowiedź Artura 13:11 |
| P58 | A — napis „brak wskazań — to nie gwarancja…” (A3) | odpowiedź Artura 13:11 |
| P59 | A — pasek „dane sztuczne — demonstracja” na każdym ekranie | odpowiedź Artura 13:11 |
| P47 | A — opis „skrytkę lub dodatkowy ładunek” bez zmian | odpowiedź Artura 12:52 |
| P48 | A — wyjątek „poza znaną konstrukcją” w opisie | odpowiedź Artura 12:52 |
| P49 | A — progi dobiera zespół na danych testowych, Artur zatwierdza po zobaczeniu wyniku | odpowiedź Artura; wartości czekają na pomiar |
| P60 | B — trudny przypadek (`trudny_mini_firanka_za_ladunkiem_00.bmp`) jako 7. auto w partii, operator nie wie z góry, które jest trudne; tak samo na pokazie | odpowiedź Artura 13:23 (z pokoju 13:11; wygrywa z rekomendacją A 13:20) |
| P61 | A — na liście partii (E3) zawsze przycisk „Dodaj jeden obraz”, plik liczy się i dopisuje jako kolejne auto | odpowiedź Artura 13:23 (z pokoju 13:11) |
| P62 | A — wybór własnego pliku z dysku w makiecie otwiera prawdziwy wybór; wynik przykładowy z napisem „makieta: wynik przykładowy, nie z Twojego obrazu” | odpowiedź Artura 13:23 (z pokoju 13:11) |
| P63 | B — zapis raportu przy autach bez decyzji: ostrzeżenie z listą aut „brak decyzji”, zapis możliwy po potwierdzeniu | odpowiedź Artura 13:23 (z pokoju 13:11) |
| P64 | A — data i godzina w raporcie to moment decyzji operatora przy każdym aucie (auto bez decyzji „—”) | odpowiedź Artura 13:23 (z pokoju 13:11) |
| P65 | A — po zamknięciu partii przycisk „Nowa partia” wraca do E2 | odpowiedź Artura 13:23 (z pokoju 13:11) |
| P66 | A — pasek „ekrany E1…E7” i tytuł „makieta R1” ukryte dla oglądającego (porządki makiety robić bez pytania) | odpowiedź Artura 13:23 (z pokoju 13:11) |
| P67 | A — makieta pokazuje też pudło (jedna ramka obok prawdziwego dodatku), zgodnie z celem ok. 80% trafień | odpowiedź Artura 13:23 (z pokoju 13:11) |
| P68 | scalone z P59 A — wąski pasek u góry „dane sztuczne — demonstracja” (nie pytać drugi raz) | odpowiedź Artura 13:23 (z pokoju 13:11) |
| P69 | A — w demo w aucie 1 rozstrzygamy 2 miejsca i wracamy na listę, resztę zostawiamy „oczekuje” | odpowiedź Artura 13:23 (z pokoju 13:11) |
| P70 | A — podgląd 2 najbliższych wzorców badanego obrazu (z numerami 1 i 2) w E6 | odpowiedź Artura 13:23 (z pokoju 13:11) |
| P71 | nic nie wyrzucamy z ekranu (poza porządkami makiety z P66 A i poprawkami usterek) | odpowiedź Artura 13:23 (z pokoju 13:11) |
| P72 | A — zostawiamy raport bez miniatury teraz; miniatura w raporcie dopisana do UPROSZCZEŃ po MVP | odpowiedź Artura 13:23 (z pokoju 13:15) |

<!-- skill: create-prd -->
<!-- skill: przeplywy-pm -->

## 11. P43–P48 rozstrzygnięte
P43 A (Paweł), P44 A, P45 B, P46 A, P47 A, P48 A — odpowiedzi w `docs/decyzje.md`. Słowa niski/średni/wysoki wyrzucone: P79 B (zmienia P17 i P45); P49 i P75 bez przedmiotu.
<!-- skill: create-prd -->
<!-- skill: przeplywy-pm -->
