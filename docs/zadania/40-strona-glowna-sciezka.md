# 40 — strona pod linkiem: główna ścieżka z ramkami, lupą, wzorcem obok i podpowiedzią

- **Cel:** https://hacknation.ksefbot.pl/ pokazuje to samo co mvp/widok-auta, a nie samą tabelę: po wgraniu pliku albo partii pokazowej widok auta z ramkami miejsc, lupą (zoom), wzorcem obok i podpowiedzią przy miejscu; cysterna z „brak wzorca — sprawdź obraz sam” i 0 ramek
- **Z czego wynika:** P43 A (strona + usługa), zadania 23–26 i 36 (gotowe w mvp/, niepodpięte do strony), polecenie Pawła 19:01
- **Dowód „gotowe”:** na żywym linku (nie lokalnie): partia pokazowa → auto 7 z ramkami jak w wyniki.json, lupa działa, wzorzec obok, podpowiedź; auto 6 bez ramek z „brak wzorca”; mały plik mini = wynik CLI; zrzuty do docs/zrzuty/mvp/; testy strony i usługi zielone
- **Czego nie ruszać:** metoda wykrywania i próg (19, 20, 36); makieta r3 na gh-pages; teksty programu (P81)
- **Pliki:** strona usługi (usluga/), mvp/widok-auta, wdroz.sh
- **Gdzie liczy:** karta OMENa (usługa)
- **zależy od:** 21, 23–26, 36
- **równolegle z:** 39; potem 29 → 28 → 27 na tej samej stronie
