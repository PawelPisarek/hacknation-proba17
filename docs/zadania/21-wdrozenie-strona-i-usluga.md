# 21 — wdrożenie: strona na ksefbot.pl + usługa licząca na karcie OMENa

- **Cel:** MVP pod linkiem ksefbot.pl: strona wysyła .bmp do usługi liczącej na karcie OMENa; przycisk partii pokazowej z `dane/mini`; to samo da się uruchomić lokalnie bez internetu (Docker / wiersz poleceń).
- **Z czego wynika:** P43 (Paweł: A), P25, P10 (obraz ~50 MB od razu), A12.
- **Dowód „gotowe”:**
  1. jedna komenda wdrożenia stawia stronę **i** usługę na karcie (usługa startuje razem ze stroną, nie osobno ręcznie);
  2. z linku ksefbot.pl wgranie własnego .bmp (plik z `dane/mini` i duży ~50 MB) daje wynik — sprawdzone z zewnątrz;
  3. sprawdzenie zdrowia usługi zwraca OK zaraz po wdrożeniu;
  4. uruchomienie lokalne bez sieci daje ten sam wynik na partii pokazowej.
- **Czego nie ruszać:** wgrywania własnego pliku **nie wycinamy** (P43) — brak działania = usterka do naprawy, nie UPROSZCZENIE.
- **Pliki:** wdrożenie, usługa, strona MVP.
- **Gdzie liczy:** karta OMENa (`--klasa gpu-tlo`).
- **zależy od:** recenzja odbiorcy specu zamknięta.
- **równolegle z:** 20.
