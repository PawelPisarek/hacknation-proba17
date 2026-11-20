# Krok 3 — Odkrywanie (`/discover`, `job-stories`): pomysły, job stories i ryzykowne założenia

Wejście: `docs/zadanie.md`, `docs/pm/01-competitive-analysis.md`, `docs/pm/02-operator.md` (zamknięty), ustalenia P2–P28 z `docs/decyzje.md`. Produkt: **Prześwit** (P11), nowy produkt (brak użytkowników do zbadania w terenie — założenia sprawdzamy sondami na sztucznych danych `dane/mini` i `dane/mini-trudny`). Co badamy, co już wiemy i jaką decyzję ustawia odkrywanie — z zadania i kroków 1–2: badamy pierwszą wersję, decyzja = zakres MVP i kolejność funkcji (linia „pominięte” w `docs/decyzje.md`).

**Status:** krok 3 odpowiedziany w całości (P29–P34). Do wyniku dopisany jest plan sond i priorytety; krok 4 (priorytety) buduje na kolejności 1 → 3 → 2 → 10 → 6.

## Czego nie wiem o produkcie (pytania do Artura, pokój Produkt)
| P | Sprawa | Stan |
|---|---|---|
| P29 | Które 3–5 z 10 pomysłów bierzemy dalej | **Artur: 1, 2, 3, 6, 10.** Odpadają 4, 5 (przerzuca pracę na operatora), 7, 8, 9. Lupa konieczna na obrazie 50 MB; 10 to ludzie z P19 |
| P30 | Ile ramek na czystym aucie operator zniesie | **Artur: B — do 6** (woli więcej ramek niż przeoczenie) |
| P31 | Ile ze 100 prawdziwych dodatków trzeba wskazać | **Artur: A — co najmniej 90** |
| P32 | Co zmienić w wybranych pomysłach; czy któryś odrzucony warto wziąć w części | **Artur: nic nie zmieniamy, odrzuconych nie bierzemy** |
| P33 | Czy najryzykowniejsze założenia to Z1, Z2, Z6, Z7, Z11 | **Artur: tak** |
| P34 | Kolejność funkcji wybranych pomysłów | **Artur: 1 → 3 → 2 → 10 → 6** |
Z zadania i P2–P28, więc bez pytań: praca bez internetu, sztuczne dane, analiza bez człowieka (P9), przeoczenie gorsze od fałszywego alarmu (P4), powody odrzucenia (P13), poprawa rodzaju przez operatora (P24).

## A. Dziesięć pomysłów (skill `brainstorm-ideas-new`; perspektywy: PM / projektant / inżynier)
| # | Pomysł | Perspektywa | Po co |
|---|---|---|---|
| 1 | Ponumerowane ramki i lista od najbardziej różnego (niski/średni/wysoki) — **już w zakresie (P17)** | projektant | operator zaczyna od najważniejszego |
| 2 | Podgląd wzorca obok z przełączaniem „wzorzec ↔ badane” w tym samym miejscu | projektant | różnicę widać oczami, bez słów |
| 3 | Lupa: kliknięcie ramki przybliża miejsce na dużym obrazie (50 MB) | inżynier | mała skrytka nie ginie |
| 4 | Podpowiedź powodu odrzucenia: program wskazuje najbardziej prawdopodobny powód z listy P13 (np. „nakładanie się ładunku”) | PM | odrzucenie jednym kliknięciem |
| 5 | Oznaczenie zgłoszonego ładunku: operator zaznacza obszar legalnego ładunku, program go pomija lub oznacza łagodniej | PM | mniej fałszywych ramek przy nakładaniu się (najczęstsza pomyłka, P13) |
| 6 | Zmiana rodzaju z podglądem dwóch najbliższych wzorców (po P24) | projektant | szybka poprawa złego doboru |
| 7 | Partia z wynikiem pierwszego auta, zanim policzy się reszta (P12) | inżynier | operator nie czeka na całość |
| 8 | Zestawienie powodów odrzuceń dla kierownika zmiany | PM | widać, gdzie program się myli |
| 9 | Uczenie się z odrzuceń: miejsca często odrzucane dostają niższą ocenę | inżynier | mniej powtarzalnych fałszywych ramek (ryzyko: ukrycie prawdziwego dodatku, P4) |
| 10 | Podpowiedź dla krótkiego stażu: przy wzorcu opis, co zwykle jest w tym miejscu konstrukcji | projektant | norma „na oko” dla nowego operatora (P19) |
**Wybór Artura (P29): 1, 2, 3, 6, 10.** Odrzucone: 4 (podpowiedź powodu), 5 (zaznaczanie ładunku — przerzuca pracę na operatora), 7 (wynik pierwszego auta przed resztą partii), 8 (zestawienie dla kierownika), 9 (uczenie się z odrzuceń). Powód odrzucenia musi więc wybrać operator sam z listy P13 — bez podpowiedzi programu.

## B. Job stories (skill `job-stories`; persona „Marek”, krok 2)
**JS1 — Zacznij od najważniejszego.** Gdy skończyła się analiza obrazu i jest kilka minut na auto, chcę zobaczyć miejsca od najbardziej różnych od wzorca, żeby najpierw sprawdzić to, co najpewniej jest dodatkiem.
AC: (1) ramki ponumerowane zgodnie z listą; (2) lista od najbardziej różnego, przy miejscu słowo niski/średni/wysoki, bez procentów (P17); (3) kliknięcie pozycji zaznacza ramkę na obrazie; (4) obraz bez miejsc pokazuje komunikat „brak wskazań”, nie pustą listę; (4a) kliknięcie ramki lub pozycji listy przybliża miejsce lupą na dużym obrazie (pomysł 3) i można przełączyć „wzorzec ↔ badane” w tym samym miejscu (pomysł 2); (4b) przy pozycji krótka podpowiedź „co zwykle jest w tym miejscu konstrukcji” (pomysł 10, P19); (5) przy wzorcu przybliżonym nad listą napis „wynik mniej pewny” (P23).
**JS2 — Odrzuć szybko, z powodem.** Gdy wskazane miejsce to element konstrukcji albo zgłoszony ładunek, chcę odrzucić je jednym kliknięciem z gotowym powodem, żeby nie pisać i nie tracić minut.
AC: (1) powody: element konstrukcji, zgłoszony ładunek, błąd obrazu, nakładanie się ładunku, inny z tekstem (P13); (2) odrzucenie bez „inny” = 2 kliknięcia, powód wybiera operator (bez podpowiedzi programu — pomysł 4 odrzucony); (3) decyzja i powód zapisują się w raporcie; (4) zatwierdzenie jednym kliknięciem; (5) cofnięcie decyzji do zamknięcia sprawy.
**JS3 — Popraw złe rozpoznanie.** Gdy rodzaj pojazdu dobrany przez program nie zgadza się z dokumentami przewozowymi, chcę wskazać właściwy rodzaj z listy, żeby wzorzec pasował i nie było fałszywych ramek.
AC: (1) lista czterech rodzajów, jedno kliknięcie (P24 B), z podglądem dwóch najbliższych wzorców (pomysł 6); (2) analiza liczy się od nowa, dotychczasowe decyzje znikają (P27 A); (3) raport zapisuje rodzaj programu i rodzaj operatora; (4) po zmianie stan obrazu wraca do „liczy się”.
**JS4 — Pracuj partią.** Gdy do sprawdzenia jest kilka aut z rzędu, chcę wskazać obrazy raz i oglądać wyniki w miarę gotowości, żeby nie czekać na całość.
AC: (1) lista obrazów ze stanem czeka / liczy się / gotowe (P12); (2) przy każdym obrazie osobne pole numeru rejestracyjnego przed zatwierdzeniem wyniku (P28 A); (3) obrazy oglądane po kolei, w miarę gotowości (pomysł 7 — wynik pierwszego przed resztą — odrzucony, P29; partia liczy się po kolei, lista wyników na końcu); (4) obraz ~50 MB działa od pierwszej wersji (P10); (5) < 1 min na obraz (zadanie §7).
**JS5 — Zostaw ślad kontroli.** Gdy zamykam sprawę auta, chcę mieć raport z decyzjami bez pisania, żeby wykazać, co sprawdzono i kto zdecydował.
AC: (1) pola P18: identyfikator kontroli, miejsce kontroli (z ustawienia stanowiska), data i godzina, rodzaj (program i operator), numer rejestracyjny, lista miejsc z decyzją i powodem, kto zdecydował (zalogowany, P22 A); (2) bez pisania poza numerem rejestracyjnym; (3) raport zapisuje się lokalnie, bez internetu (§9).

## C. Ryzykowne założenia rdzenia produktu (skill `identify-assumptions-new`; kategorie: wartość / użyteczność / wykonalność / opłacalność)
Wszystkie sondy liczone na **sztucznych danych** (`dane/mini`, `dane/mini-trudny`; pełny poziom do czasu i pamięci), na wyniku bazowym Programisty (`src/przeswit/wykryj.py`, ocena `ocena/ocena.py`: trafienie = miejsce pokrywa ≥30% pola dodatku i ma ≤25% pola obrazu). **Progi ⚠ Z1 i Z2 ustalił Artur (P30 B, P31 A); pozostałe ⚠ to nasze założenia progowe do przeglądu.** Sonda = jedno zadanie dla Programisty/Analityka: policz → porównaj z progiem → werdykt.

| Z | Założenie | Kategoria | Czemu ryzykowne | Sonda: co policzyć | Potwierdza | Obala |
|---|---|---|---|---|---|---|
| Z1 | Program wskaże prawie każdy prawdziwy dodatek | wykonalność / wartość | cel zadania; przeoczenie najgorsze (P4/P5) | Y/M: ile dodatków z manifestu bez trafienia, osobno przedmiot / skrytka / przeróbka; `dane/mini`, 16 obrazów z dodatkami | przeoczenia ≤ 10% (P31 A) | przeoczenia > 20% ⚠ |
| Z2 | Na czystym aucie ramek jest mało | użyteczność | za dużo ramek = operator przestaje ufać (krok 2) | ramki na obraz dla obrazów czystych: średnia, mediana, maks. (`mini`) | ≥ 90% czystych ma ≤ 6 ramek (P30 B) | < 70% czystych ma ≤ 6 ramek ⚠ |
| Z3 | Dobór rodzaju i wzorca z biblioteki jest trafny | wykonalność | zły dobór = lawina fałszywych alarmów (R1 kroku 1) | k/n: odsetek obrazów z trafnym rodzajem (prawda w manifeście); osobno typ „najbliższy” przy podglądzie dwóch | ≥ 95% trafnych ⚠ | < 85% ⚠ |
| Z4 | Gdy brak wzorca rodzaju (P16), wynik jest „mniej pewny”, ale użyteczny | wykonalność | porównanie z najbliższym rodzajem może dać wiele fałszywych ramek | biblioteka bez cysterny: Z1 i Z2 dla cystern vs z pełną biblioteką | przeoczenia ≤ 2× i ramki ≤ 2× wartości z Z1/Z2 ⚠ | więcej niż 2× |
| Z5 | Poprawa rodzaju przez operatora (P24) naprawia zły dobór | użyteczność | funkcja ma sens tylko, gdy zmiana realnie zmniejsza błąd | wymuś zły rodzaj, potem poprawny: różnica liczby ramek i przeoczeń | poprawny rodzaj zmniejsza ramki o ≥ 50% ⚠ | < 20% ⚠ |
| Z6 | Nakładanie się ładunku (najczęstsza pomyłka, P13) nie zalewa listy | wykonalność / użyteczność | program miesza ładunek z konstrukcją | `mini-trudny`, rodzaj `ladunek_legalny` (czyste): odsetek obrazów z ≥ 1 ramką, ramki na obraz | ≤ 2× odsetka z `egzemplarz` ⚠ | > 3× ⚠ |
| Z7 | Małe dodatki i dodatki za ładunkiem też są widoczne | wykonalność | najtrudniejszy przypadek, tu przeoczenia najbardziej prawdopodobne | `mini-trudny`, rodzaje `maly` i `za_ladunkiem`: Y/M | przeoczenia ≤ 25% ⚠ | > 50% ⚠ |
| Z8 | Słowo niski/średni/wysoki ustawia prawdziwe dodatki wyżej niż fałszywe (P17) | wartość / użyteczność | jeśli kolejność jest losowa, lista nie pomaga | na obrazach z dodatkami: pozycja pierwszego prawdziwego trafienia na liście; odsetek w pierwszych 3 (przy progu do 6 ramek P30 — także w pierwszych 6) | ≥ 90% obrazów ma prawdziwe trafienie w pierwszych 3 ⚠ | < 70% ⚠ |
| Z9 | Obraz ~50 MB i partia mieszczą się w czasie i pamięci | wykonalność | zadanie §7: < 1 min na obraz, bez internetu | czas i szczyt pamięci na obrazie `pelny` (8192×2048, 50 MB); partia 5 obrazów po kolei | ≤ 60 s na obraz, partia 5 ≤ 5 min | > 120 s na obraz |
| Z10 | Wynik na sztucznych danych mówi coś o prawdziwych | opłacalność / wartość | jedyne dane są nasze; łatwe dane mogą zawyżać wynik | porównaj Z1/Z2 na `mini` i `mini-trudny`; im większy spadek, tym ostrożniej w opisie | spadek przeoczeń ≤ 2× | spadek > 3× (w opisie: „na danych sztucznych”) |
Priorytet sond (wpływ × niepewność): **Z1, Z2, Z6, Z7** (najwyższy), Z3, Z8, Z9, Z4, Z5, Z10. Sondy Z1–Z3 i Z6–Z8 liczy się tym samym przebiegiem oceny — jedno zadanie.

## D. Założenia wybranych pomysłów, plan sond i checkpoint
Wybór Artura wprowadza założenia pomysłów 2, 3, 6, 10 (pomysł 1 = Z8).

| Z | Założenie | Pomysł | Kategoria | Sonda: co policzyć | Potwierdza | Obala |
|---|---|---|---|---|---|---|
| Z11 | Lupa pokazuje wybrane miejsce na obrazie ~50 MB szybko i ostro | 3 | wykonalność / użyteczność | czas od kliknięcia ramki do obrazu przybliżenia na `pelny`; czy dodatek o rozmiarze „mały” widać w przybliżeniu | ≤ 1 s ⚠ i widoczny | > 3 s ⚠ albo rozmyty |
| Z12 | Wzorzec obok jest dopasowany do badanego i przełączanie pokazuje różnicę | 2 | użyteczność / wykonalność | przesunięcie wzorca względem badanego (px) w miejscu ramki; osoba z zewnątrz wskazuje dodatek na przełączanym podglądzie vs bez wzorca (8 obrazów) | przesunięcie mniejsze niż ramka ⚠; wskazanie szybsze | wzorzec się „rozjeżdża” albo bez efektu |
| Z13 | Dwa najbliższe wzorce zawierają poprawny rodzaj, gdy dobór był zły | 6 | wykonalność | dla obrazów ze złym doborem: odsetek, w którym poprawny rodzaj jest w pierwszych dwóch | ≥ 95% ⚠ | < 80% ⚠ |
| Z14 | Opis „co zwykle jest w tym miejscu” da się podać dla większości ramek na elementach konstrukcji i pomaga krótkiemu stażem | 10 | wartość / wykonalność | ile ramek na czystych obrazach ma opis z listy elementów konstrukcji 4 rodzajów (sztuczne dane); pytanie do osoby z zewnątrz: czy opis zmienił decyzję | ≥ 80% ramek ma opis ⚠ | < 50% ⚠. **Założenie bez badań w terenie: opisy pochodzą ze sztucznego generatora, nie z prawdziwych naczep** |

**Plan sond (kolejność):** (1) Z1, Z2, Z6, Z7, Z8, Z10 — jeden przebieg oceny na `mini` i `mini-trudny` (Programista/Analityk); (2) Z9, Z11 — czas i pamięć na `pelny`; (3) Z3, Z13, Z5, Z4 — dobór rodzaju; (4) Z12, Z14 — przegląd z osobą z zewnątrz na makiecie (po makiecie, na zlecenie Szefa). Eksperymenty bez budowania: Z12 i Z14 to test na makiecie z danymi pokazowymi (prototyp), reszta to liczenie na zbiorze. Sondy nie zmieniają zakresu; wynik progu ⚠ obalonego wraca do Artura jako pytanie.

**Najryzykowniejsze założenia (potwierdził Artur, P33):** Z1 (nie przeoczyć), Z2 i Z6 (za dużo ramek / nakładanie ładunku), Z7 (małe i za ładunkiem), Z11 (lupa na 50 MB).

**Kolejność funkcji (P34, Artur):** 1 ramki + lista → 3 lupa → 2 wzorzec obok → 10 podpowiedź krótkiego stażu → 6 zmiana rodzaju.

<!-- skill: discover -->
<!-- skill: job-stories -->
<!-- skill: przeplywy-pm -->
