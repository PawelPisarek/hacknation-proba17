# Decyzje (każdy wpis z godziną z `date +%H:%M`)

10:56 Szef: start próby 17; zadanie w docs/zadanie.md (KAS — anomalie RTG naczep, wzorzec vs badany, .bmp).
10:56 Szef: typ zadania A — wynik mierzony na zbiorze testowym: obrazy „czyste” (fałszywe alarmy) i z „dodatkami” (przeoczenia).
10:56 Szef: dane — własny sztuczny zbiór .bmp (naczepy czyste i z dodatkowym ładunkiem), bo obrazów KAS nie mamy.
10:56 Szef: liczenie — ciężkie tylko na karcie OMENa (--klasa gpu-tlo, GTX 1050 4 GB), nigdy na procesorze; reszta --maszyna dowolna; przebieg na karcie sprawdza ≥ 2 hipotezy naraz.
10:56 Szef: aplikacja pod linkiem bierze wynik z usługi na karcie OMENa (sieć lokalna).
P1 10:56 Paweł: kto jest kim — jakie podpisy urządzeń mają Twoje i Artura wiadomości, i czy ktoś jeszcze dołącza (rola)? — czeka
10:57 Szef: w kontenerze brak klienta ssh — postawiony zastępczy /data/.local/bin/ssh (Python/paramiko); push działa.
10:57 Szef: zadania 01 (generator danych) i 02 (ocena + wynik bazowy) założone w docs/zadania/.
P1 10:58 odpowiedź: Paweł — technika (rozmowa z Szefem), Artur — produkt (pokój Produkt); nikt więcej; podpisy urządzeń nieważne — kto pisze w pokoju, to Artur.
10:58 Programista: biorę zadanie 02
10:59 Projektant: krok 1 — pominięte (język ekranu, praca bez internetu, sztuczne dane) — z zadania: pkt 9 i uwaga ludzi
P2 10:59 Artur: wzorzec do porównania — obraz tego samego pojazdu bez ładunku, czy wzorzec dla typu pojazdu (np. naczepa firanka)? Rekomendacja: ten sam pojazd, gdy jest; inaczej wzorzec typu — czeka
P3 10:59 Artur: gdy program wskaże miejsca, operator tylko je ogląda i sam decyduje, czy ma też zatwierdzać/odrzucać każde? Rekomendacja: tylko ogląda i decyduje — czeka
P4 10:59 Artur: co gorsze — przeoczyć ukryty przedmiot czy fałszywy alarm na czystej naczepie? Rekomendacja: przeoczenie gorsze, ale liczba fałszywych alarmów ma być mała i widoczna w pokazie — czeka
P5 10:59 Artur: według czego porównujemy się z innymi rozwiązaniami? Rekomendacja: co program wskazuje i jak pokazuje to operatorowi (nie cena) — czeka
P6 10:59 Artur: do czego posłuży analiza konkurencji? Rekomendacja: do opisu projektu i wyboru, co ma umieć pierwsza wersja — czeka
P7 10:59 Artur: kto jest użytkownikiem, jaki ma problem i co zyska? Rekomendacja: operator RTG na granicy; małe skrytki w konstrukcji pojazdu umykają; zyska wskazane miejsca do kontroli fizycznej — czeka
P8 10:59 Artur: czy konkurenci w analizie są właściwi (producenci skanerów i ich oprogramowanie + obecne narzędzie do papierosów)? Rekomendacja: tak — czeka
P2 11:00 odpowiedź: Artur w pokoju: wzorzec typu z biblioteki (operator prawie nigdy nie ma czystego zdjęcia tej samej naczepy); system dobiera wzorzec typu sam
P3 11:00 odpowiedź: Artur w pokoju: operator przy każdym miejscu zatwierdza albo odrzuca, a odrzucając podaje powód; zostaje w raporcie
P4 11:00 odpowiedź: Artur w pokoju: przeoczenie gorsze (jak w rekomendacji)
P5 11:00 odpowiedź: Artur w pokoju: przede wszystkim skuteczność (czy wskazuje to, co ukryte); sposób pokazania na drugim miejscu
P6 11:00 odpowiedź: Artur w pokoju: jak w rekomendacji (opis projektu i wybór zakresu pierwszej wersji)
P7 11:00 odpowiedź: Artur w pokoju: jak w rekomendacji; dodatkowo operator ma kilka minut na jedno auto
P8 11:00 odpowiedź: Artur w pokoju: tak, konkurenci właściwi
11:01 Szef: krok 1 przyjęty (znaczniki competitor-analysis, przeplywy-pm są) → recenzja przejścia R1: Analityk. P2/P3/P4 przekazane do zadań 01 i 02 (wzorzec typu z biblioteki, dobór wzorca w ocenie).
10:58 Analityk: biorę zadanie 01
11:01 Analityk: recenzja krok 1 R1 — 5 braków: (1) produkt: dobór wzorca typu z biblioteki (P2) nieobecny w podejściach/ryzykach; (2) produkt: sprzeczność z zadaniem pkt 3 „bez interwencji człowieka” wobec P3 (zatwierdzanie/odrzucanie z powodem) niewskazana, brak porównania tego przepływu z konkurencją; (3) produkt: „mało fałszywych alarmów” jako cecha demo wobec P4 (przeoczenie gorsze) i P5 (skuteczność najpierw) — brak kryterium skuteczności w tabeli konkurentów; (4) produkt: brak propozycji zakresu pierwszej wersji (P6); (5) technika: podejścia bez oceny wobec 50 MB/<1 min/offline/bez karty w docelowym wdrożeniu i bez wiersza Multicontrol/Nuctech jako dostawców obrazów. Szczegóły w odpowiedzi do Szefa.
11:02 Szef: krok 1 R1 — 5 braków (Analityk) → poprawka całego pliku: Projektant.
11:03 Projektant: poprawki kroku 1 po R1 (5 braków) — P2 (biblioteka typu, ryzyko doboru), kolumna skuteczności, ocena podejść wg 50 MB/<1 min/offline, wiersz Nuctech/Multicontrol, zakres pierwszej wersji, przepływ P3 vs zadanie §3
P9 11:03 Artur: zadanie wymaga, by program analizował sam, a Ty chcesz, by operator zatwierdzał/odrzucał miejsca. Czy A: program najpierw sam zaznacza wszystko, a operator decyduje dopiero na wyniku, czy B: operator włącza się już w trakcie analizy? Rekomendacja: A (oba wymagania się mieszczą) — czeka
P10 11:03 Artur: pierwsza wersja ma mieć: wczytanie obrazu, dobór wzorca typu, zaznaczenie miejsc i raport, zatwierdzanie/odrzucanie z powodem, wynik na obrazach czystych i z dodatkami; później: partie obrazów, wzorce na dostawcę skanera; odpada: wykrywanie konkretnego towaru i porównanie z deklaracją. Zgoda czy zmieniamy? Rekomendacja: zgoda — czeka
P11 11:03 Artur: jak nazwać projekt w formularzu zgłoszenia (szkic opisu: https://github.com/PawelPisarek/hacknation-proba17/blob/main/docs/hacktribe.md)? Opcje: „RóżnicaRTG”, „Wzorzec”, „Dwa Obrazy” albo własna. Rekomendacja: „RóżnicaRTG” — od razu mówi, co program robi — czeka
11:04 Szef: krok 1 poprawiony po R1 (29a7f88, znaczniki są) → recenzja R2: Analityk.
P9 11:04 odpowiedź: Artur w pokoju: A — program najpierw sam zaznacza wszystko, operator decyduje na wyniku
P10 11:04 odpowiedź: Artur w pokoju: zgoda na zakres pierwszej wersji, ze zmianą: duży obraz (~50 MB, jak w zadaniu) działa już w pierwszej wersji; partie mogą poczekać
P11 11:04 odpowiedź: Artur w pokoju: nazwa projektu „Prześwit” (krótko, kojarzy się z RTG, nie obiecuje cudów)
11:04 Analityk: recenzja krok 1 R2 — 2 braki: (1) produkt: tabela zakresu v1 daje „partie wielu obrazów, skalowanie” do „Później”, a zadanie §3 wymaga kompresji, przetwarzania partiami i skalowalności — sprzeczność z zadaniem niewskazana, trzeba ją zawrzeć w P10 albo przenieść do „Musi być”; (2) produkt: „powód z listy” przy odrzuceniu (P3) to parametr widoczny dla użytkownika, którego Artur nie ustalił (lista/wolny tekst) — wymaga pytania do Artura lub linii PARAMETR; pozostałe 4 braki z R1 zamknięte (P9/P10 czekają, nie liczone).
11:05 Analityk: oddaję zadanie 01 — generator (4 typy pojazdów, biblioteka wzorców, badane czyste/dodatki), manifest, dane/mini w repo; pełny zbiór ThinkPad ~/dane/proba17; WYNIK: typy=4 wzorce=60 badane_czyste=44 badane_z_dodatkami=44 plikow=148 razem=1305.5 MB maks_plik=50.3 MB, generacja 80 s
11:05 Szef: krok 1 R2 — 2 braki produkt (partie w 1. wersji vs §3; powód odrzucenia) → poprawka + pytania do Artura: Projektant.
P12 11:05 Artur: zadanie wymaga przetwarzania wielu obrazów naraz (partiami) i możliwości rozbudowy na większe zbiory. A: partie obrazów już w pierwszej wersji, B: dopiero później? Rekomendacja: A — zadanie tego wymaga wprost — czeka
P13 11:05 Artur: gdy operator odrzuca wskazane miejsce, podaje powód. A: lista kilku gotowych powodów (np. „element konstrukcji”, „zgłoszony ładunek”, „błąd obrazu”) plus pole „inny” z własnym tekstem, czy B: tylko własny tekst? Rekomendacja: A — szybciej, a operator ma kilka minut na auto — czeka
PARAMETR: powód odrzucenia = lista gotowych powodów + „inny” (propozycja) — do Artura (P13)
11:05 Projektant: krok 1 R2 — 2 braki: sprzeczność zakresu z zadaniem §3 (partie, P12) i lista powodów odrzucenia (P13) nazwane w pliku
11:06 Szef: zadanie 01 przyjęte (linia wyniku jest: 4 typy, 60 wzorców, 44+44 badane, maks 50.3 MB); dane/mini w repo, pełny zbiór na ThinkPadzie.
11:06 Szef: alarm do Pawła — brak rsync w kontenerze, orkiestrator nie startuje zleceń (ssh już obejście).
11:06 Szef: nazwa projektu „Prześwit” (P11) → Prezenter do docs/hacktribe.md.
P12 11:06 odpowiedź: Artur w pokoju: A — partie w pierwszej wersji, ale najprościej: operator wskazuje kilka obrazów, program liczy po kolei i daje listę wyników; bez rozbudowanego skalowania na pokaz, w opisie jedno zdanie, jak by to rosło
P13 11:06 odpowiedź: Artur w pokoju: A — lista gotowych powodów odrzucenia + „inny” z tekstem; do listy dołożyć „nakładanie się ładunku” (najczęstsza pomyłka)
PARAMETR: powód odrzucenia = element konstrukcji, zgłoszony ładunek, błąd obrazu, nakładanie się ładunku, inny (własny tekst) — P13
11:08 Projektant: krok 1 po P12/P13 — partie przeniesione do „Musi być" (najprościej), sprzeczność z §3 zamknięta; lista powodów odrzucenia ustalona
11:09 Szef: Paweł — rsync i ssh wróciły (restart kontenera); orkiestrator startuje zlecenia, w tym --wyslij → liczenie normalnie przez orkiestrator na całą flotę
11:09 Analityk: recenzja krok 1 R3 — brak braków zmieniających zakres lub kryteria. Uwaga techniczna (nie zmienia zakresu): nieaktualne zdania w pliku — wiersz 'Przepływ z operatorem' nadal opisuje P9 jako pytanie do Artura, a ustalenie P10 w sekcji 'Ustalenia (P9–P11)' mówi 'partie później' wbrew P12 (zakres w tabeli jest poprawny).
11:10 Szef: krok 1 zamknięty (R3: brak braków) → krok 2 operator (Projektant); recenzja docs/hacktribe.md (Analityk)
11:10 Analityk: recenzja hacktribe (bdba1ed) — 4 braki: (1) produkt: „dodamy kolejkę i równoległe liczenie” to obietnica; P12 ustala jedno zdanie o tym, jak by to rosło, a krok 1 mówi tylko, że kolejkę można rozdzielić na maszyny — zmienić na „można rozbudować”; (2) produkt: „zaznacza wszystkie miejsca różnic” i „obraz bez różnic nie dostaje zaznaczeń” obiecują wynik niezmierzony (P2: różnice między pojazdami tego samego typu = fałszywe alarmy; P4/P5 skuteczność) — usunąć „wszystkie”, złagodzić do celu; (3) produkt: brak działania lokalnie, bez internetu i chmury (zadanie §9) i zaznaczenia miejsc na obrazie w raporcie (§3); (4) technika: „Nazwa zespołu: Hackathon” bez źródła w zadaniu ani decyzjach. Limit: opis ma 978 znaków (≤1000, OK).
