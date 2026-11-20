# Krytyk makiety R2 (Analityk)

Zakres: 25 zrzutów `docs/zrzuty/r2/` (oglądane: E2, E2b, E3b, E3d, E3f, E4a, E4c, E4d, E4e, E4g, E4h, E4i, E5, E6a, E7a, E7b, T1) względem `docs/spec.md` i P54–P72. Samej strony nie klikałem — tylko zrzuty.

**Ocena: 7/10.**

## Braki (od najważniejszego)
1. **produkt** — numery ramek zasłaniają się nawzajem (A1 wymaga czytelnych numerów zgodnych z kafelkami). E4a (auto 1): numer „2” ukryty pod etykietą „1 wysoki”; E4d (auto 7): druga etykieta „średni” bez numeru (zasłonięty numer 2); T1 (telefon): „3 średni” i „4 średni” nachodzą na siebie i są ucięte przy krawędzi. Operator nie odróżni, który kafelek to która ramka.
2. **produkt** — auta, w których nie ma czego rozstrzygać (auto 4 „brak wskazań”, auto 6 „brak wzorca”), są w raporcie jako „brak decyzji” (E7a/E7b) i wchodzą na listę „Brak decyzji: auto 1 … auto 8” w ostrzeżeniu przed zapisem (P63 B). Ostrzeżenie wymienia 8 z 8 aut, więc przestaje cokolwiek mówić, a P56 A (zapis blokuje oddanie) każe operatorowi „zapisać mimo to” za każdym razem. Auto bez miejsc po „Zamknij auto” powinno mieć w raporcie stan „obejrzane, bez wskazań”, a nie „brak decyzji”; na liście E3 brak też stanu „auto zamknięte” dla aut 4 i 6 (jest tylko przy aucie 7, E3f).
3. **produkt** — auto 7 (przypadek trudny, E4d/E4e): najsilniejsze miejsce „1 wysoki” to fałszywy punkt na kołach, a jedyny prawdziwy dodatek (miejsce 6, za ładunkiem) ma słowo „niski” i podpowiedź „poza znaną konstrukcją”. Przy P60 B (operator nie wie, że to trudne auto) ekran uczy, że „wysoki” = prawda; nie ma też napisu „granica programu” z P52 A, który demo.md przewiduje tylko na wariant bez ramki. Do rozstrzygnięcia po progach z zadania 32: albo to zostaje i demo o tym mówi, albo słowa liczą się inaczej.
4. **produkt** — E4e (zoom 4×, miejsce 6): w badanym widać tylko dwie zielone linie pionowe, bez numeru i bez prostokąta — nie widać, co jest ramką miejsca 6. Zoom do miejsca powinien zostawić widoczną ramkę z numerem (JS1 AC3).
5. **produkt** — E2/E2b: „śr. 1,7 s, maks. 2,1 s” (pomiar v3, zad. 20 — to zgadza się z WYNIK), a `docs/spec.md` E2 i §5 nadal podają „śr. 5,0 s, maks. 8,1 s” (Z9, v1). Dwie różne liczby o tej samej rzeczy w pokazywanych materiałach; spec do poprawki albo zadanie 20 wpisać jako źródło (wtedy też 1,19 s dla trudnego zestawu).
6. **produkt** — E4h (auto 4, brak wskazań): komunikat „Wpisz nr rej. naczepy i naciśnij Enter, żeby zamknąć auto” pojawia się pod całym ekranem, poza polem, a obok jest przycisk „Zamknij auto”, który tego Entera nie wymaga w opisie; operator nie wie, czy klikać, czy pisać. Komunikat powinien stać przy polu „Nr rej.” i nazywać przycisk.
7. **technika** — raport (E7a/E7b) pokazuje „auto 8 · wynik przykładowy” z własnego pliku jako zwykły wiersz partii; w raporcie z prawdziwych danych taki wiersz nie powinien powstawać (w makiecie wystarczy oznaczenie, że to próba wgrania). Do potwierdzenia przez Programistę, czy w wersji z usługą na karcie ten wiersz wynika z prawdziwego wyniku.

Nie sprawdzone: klikalność (hover, klawiatura), zachowanie na prawdziwej stronie, E1/E3a/E3c/E3e/E4b/E4f/E6b/T2 (tylko wg opisu wpisów Programisty).

