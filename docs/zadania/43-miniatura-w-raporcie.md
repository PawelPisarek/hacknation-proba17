# 43 — miniatura z zaznaczonymi miejscami w raporcie (dorobienie D1)

- **Cel:** w raporcie partii przy każdym aucie mały obraz badanego z zaznaczonymi miejscami (ramki jak w widoku auta); kierownik od razu widzi, gdzie było miejsce
- **Z czego wynika:** P91 D1 (Artur w pokoju, 20:10: „robić od razu”); P72 (pomysł Artura); docs/pm/09-uproszczenia.md D1
- **Dowód „gotowe”:** na https://hacknation.ksefbot.pl/ po partii pokazowej „Raport partii” pokazuje miniaturę z ramkami przy każdym aucie (cysterna: miniatura bez ramek + „brak wzorca”); pobrany raport zawiera miniatury (np. HTML/PDF z obrazkami albo .json z polem miniatury + pliki obok — format wybiera Programista, wpis w decyzjach); .csv bez zmian poza ewentualną kolumną z nazwą pliku miniatury; zrzut w docs/zrzuty/mvp/; testy zielone; odbiór kliknięciami
- **Czego nie ruszać:** metoda wykrywania, próg, partia pokazowa, teksty P81; .json/.csv dotychczasowe pola (rodzaj_programu, rodzaj_operatora, decyzje) bez zmian
- **Pliki:** strona/public (raport), ewentualnie usługa `/obraz`
- **Gdzie liczy:** bez liczenia — miniatury z już policzonych ramek (`/obraz` + ramki z odpowiedzi)
- **zależy od:** 27, 28, 29
- **równolegle z:** porównanie CLI 40 (Programista kończy najpierw), README/demo (Prezenter)
