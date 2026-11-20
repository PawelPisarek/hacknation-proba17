# Zadanie 48 — przejście scenariusza `docs/demo.md` na https://hacknation.ksefbot.pl/ (Analityk, 20.11 ok. 08:07)

Metoda: przeglądarka (Chromium, 1280×800) sterowana skryptem, te same kliknięcia co w demo.md; „czas” = czas oczekiwania programu po kliknięciu (czasu lektora i ręki człowieka skrypt nie mierzy). Zrzuty: `docs/zrzuty/demo-link/krok<N>-*.png`. Link odpowiada HTTP 200 w 0,21 s.

| # | Ekran | Co widać na linku | Czas programu | Zrzut | Różnica względem demo.md |
|---|---|---|---|---|---|
| 1 | E1 | pasek „dane sztuczne — demonstracja”; wybór z listy: „SCS Kowalski · Terespol — stanowisko 2” (P87) | 0,4 s | krok1-logowanie.png | brak (demo.md mówi „wpisują”/„Zacznij zmianę” — jest lista, zgodnie z P87) |
| 2 | E2→E3 | „Partia pokazowa (7 aut)” + „Policz partię”: auto 1 firanka 8, auto 2 chłodnia 6, auto 3 kontener 12, **auto 4 kontener 8**, auto 5 firanka 7, auto 6 „brak wzorca”, auto 7 firanka 11 | **91,2 s** do „gotowe” wszystkich 7 aut | krok2-partia.png | **demo.md: 14 s na ten krok — na linku liczenie partii trwa 91 s** (technika/produkt: nagranie musi skracać montażem albo zacząć od policzonej partii; lektor „po kolei” nie wypełni 91 s). Liczby 8/6/12/7/11 zgodne; auto 4 (8) jest na liście, demo.md je pomija (OK, uwaga w demo.md) |
| 3 | E4 auto 1 | firanka, 6 kafelków + „i jeszcze 2 miejsca — pokaż” | 1,0 s | krok3-auto1.png | brak |
| 4 | E4→E3 | nr „WA 12345”; 1 zatwierdzone, 2 odrzucone („element konstrukcji”); lista: „auto 1 … (zostało 6)” | skrypt przy pierwszej próbie odrzucenia dostał timeout selektora (30 s) i dokończył powód osobnym krokiem — wynik w raporcie poprawny (1: zatwierdzone, 2: odrzucone, element konstrukcji); czas ręczny do zmierzenia człowiekiem | krok4-decyzje.png, krok41-decyzje-powod.png | brak w efekcie; ścieżka „Odrzuć ▾ → powód” wymaga sprawdzenia ręką |
| 5 | E4 auto 6 | „brak wzorca — sprawdź obraz sam”, rodzaj nieustalony, przyciski zoomu | 0,9 s | krok5-auto6.png | **na liście i w raporcie napis „brak wzorca — obejrzyj ręcznie”**, w demo.md i slajdach „sprawdź obraz sam” — **produkt (napis)** |
| 6 | E4 auto 7 | firanka, **11 miejsc**: 6 kafelków + „i jeszcze 5 miejsc”; auto nieoznaczone na liście | 1,0 s | krok6-auto7.png | demo.md zakłada, że program może nie dać ramki — na linku daje 11 miejsc; czy któraś trafia w dodatek za ładunkiem — **nie sprawdzone** (zrzut do obejrzenia człowiekiem); lektor kroku 6 do zmiany jeśli ramka jest |
| 7 | E3→E7 | raport: 7 aut, auto 1 „1: zatwierdzone 2: odrzucone (element konstrukcji)”, pozostałe „brak decyzji”; ostrzeżenie „Brak decyzji: auto 1 (WA 12345), auto 2, 3, 4, 5, 7”; „Zapisz mimo to” → pobrano raport-partii.* | 2,5 s | krok7-raport.png, krok7-ostrzezenie.png | **w ostrzeżeniu jest też auto 1** (ma nierozstrzygnięte miejsca 3–8) i auto 4 — demo.md zapowiada „auta z nierozstrzygniętymi miejscami” — zgodne; lista nie zawiera aut 6 — zgodne |
| 8 | E2 | „Nowa partia” → plik mini (chłodnia czyste 00): „gotowe, 9 miejsc” | **1,6 s** | krok8-nowa-partia.png | brak (demo.md „ok. 2 s”) |

**Suma czasu programu w krokach 1–8: ok. 99 s, z czego 91 s to krok 2.** Z lektorem i rękami człowieka scenariusz 114 s zgodny z demo.md zakłada 14 s na krok 2 — na linku nie do utrzymania bez cięcia nagrania (kamień: o tym zdecyduje Szef/Artur).

## Różnice (do demo.md)
- **produkt:** napis auta 6 na liście i w raporcie „obejrzyj ręcznie” vs „sprawdź obraz sam”; liczenie partii 91 s vs 14 s.
- **technika:** auto 7 na linku daje 11 miejsc (demo.md: „może nie dać ramki”); demo.md nadal wskazuje „makieta R3” w nagłówku „Link do pokazu” i uwadze „Nagranie robić na makiecie R3” — przestarzałe; krok 1 „loguje” zamiast listy.
- **nie sprawdzone:** czas ręczny kroków 3–7; czy ramka auta 7 obejmuje dodatek.
