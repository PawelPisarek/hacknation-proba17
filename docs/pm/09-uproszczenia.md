# 09 — Uproszczenia MVP i wybór dorobienia (wiadomość do Artura — NIE WYSŁANA)

Stan: szkic z 19:0x, czeka na sygnał Szefa po odbiorze MVP. Numery P nadam przy wysyłce (następne wolne po P85); tu robocze U1–U8 i D.
Źródła: `docs/spec.md` §8–9 i §10, `docs/zadania/23–29, 40`, wpisy UPROSZCZENIE w `docs/decyzje.md`, odpowiedzi P2–P85.

## Czego nie wiem o produkcie
- Czy Artur przyjmuje każde z 8 uproszczeń na pokaz (U1–U8).
- Które jedno z trzech dorobić, jeśli zostanie czas (D).

## Wiadomość do Artura (do pokoju Produkt)

Artur, MVP jest prawie gotowe. Żeby zdążyć, kilka rzeczy zrobiliśmy prościej niż w pełnym produkcie. Przy każdej: **A — przyjmujemy tak na pokaz**, **B — chcesz to mieć pełne**. Rekomendacja wszędzie A (zostawiamy jak jest). Link do repo: https://github.com/PawelPisarek/hacknation-proba17 · żywa wersja: https://hacknation.ksefbot.pl/

| nr | Co uproszczone | Czym zastąpione | Co to znaczy dla operatora |
|---|---|---|---|
| U1 | Logowanie | jedna lista funkcjonariuszy i miejsc kontroli do wybrania, bez logowania KAS | wybiera siebie z listy; w raporcie nadal jest „kto zdecydował” |
| U2 | Liczenie partii | obrazy liczą się po kolei, auta otwiera się po policzeniu całej partii (zgodnie z P12, P38) | chwila czekania na całą partię; wynik pierwszego auta nie pojawia się wcześniej |
| U3 | Wzorce | 4 rodzaje (firanka, chłodnia, kontener, cysterna) z naszych sztucznych czystych obrazów; opiekun nie dokłada własnych | dla innego rodzaju auta: „brak wzorca — sprawdź obraz sam” |
| U4 | Podpowiedź „zwykle tu…” | ogólne opisy z programu (P81 A), nie od ekspertów KAS | opis mówi np. „podwozie — belki, koła i oś”; bywa „poza znaną konstrukcją” |
| U5 | Raport | zapis lokalnie jako plik, bez repozytorium KAS i bez ekranu kierownika zmiany | kierownik czyta plik; nic nie wysyłamy do systemów KAS |
| U6 | Miniatura w raporcie | tabela z decyzjami i powodami, bez obrazka z ramkami przy każdym aucie (P72 A) | żeby zobaczyć, gdzie było miejsce, trzeba je znaleźć w aucie |
| U7 | Dane pokazowe | partia 7 aut to dane sztuczne; brak aut, na których program nic nie wskazał, bo na czystych autach zwykle coś wskazuje (P82 B) | w pokazie nie ma stanu „brak wskazań”; to nie gwarancja, że auto jest czyste (P58 A) |
| U8 | Praca bez internetu | „docelowo działa lokalnie” (P25 A); dziś program liczy na naszym komputerze i otwiera się z linku | w pokazie potrzebny jest link; bez sieci tylko docelowo |

Pytanie U1–U8: przyjmujesz uproszczenia? Dla każdego: A przyjmujemy / B dorabiamy. Rekomendacja: A dla wszystkich.

**Co dorobić, jeśli zostanie czas — jedna rzecz (D):**
- **D1 — miniatura w raporcie (ok. 1–2 h):** przy każdym aucie mały obraz z zaznaczonymi miejscami (zatwierdzone / odrzucone), kierownik od razu widzi, gdzie było miejsce. To Twój pomysł z 13:07 (P72).
- **D2 — logowanie i role zamiast listy (kilka godzin):** funkcjonariusz loguje się, a „kto zdecydował” i miejsce kontroli biorą się z konta. Na pokazie widać to w działaniu.
- **D3 — ekran dokładania wzorca (ok. 2–3 h):** opiekun dodaje czysty obraz jako nowy rodzaj, więc „brak wzorca” znika dla kolejnych aut tego rodzaju.

Rekomendacja: **D1**: mała robota, widać w raporcie na pokazie i zamyka Twój własny pomysł. D2 jest bardziej „na pokaz”, ale zajmuje najwięcej czasu i nie zmienia pracy operatora z obrazem; D3 wymaga nowego ekranu i zasad, kto może dokładać.

## Dla Szefa
Wysyłka: jedna wiadomość w pokoju Produkt + ntfy (adresat Artur) + wpisy P<n> `— czeka` w `docs/decyzje.md`. Przed wysyłką: paczka do Analityka (skreślenie pytań pozornych) i sprawdzenie, że U1–U8 nadal zgadzają się ze stanem MVP po zadaniach 40, 29, 28, 27.

<!-- skill: przeplywy-pm -->
