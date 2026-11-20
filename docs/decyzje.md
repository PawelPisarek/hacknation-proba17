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
