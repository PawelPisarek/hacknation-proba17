# 42 — strona budzi uśpioną usługę i mówi to operatorowi

- **Cel:** gdy usługa śpi (503), strona sama ją budzi, pokazuje „Uruchamiam program, ok. 30 s” i ponawia; operator nie widzi gołego błędu; /api/zdrowie mówi prawdę o śnie
- **Z czego wynika:** odbiór 21 z zewnątrz B2 (8768b32); P43 A
- **Dowód „gotowe”:** na żywym linku po uśpieniu: pierwsze kliknięcie kończy się wynikiem bez ręcznego budzenia (czas zapisany), komunikat widoczny; testy strony zielone
- **Czego nie ruszać:** metoda, próg, makieta
- **Pliki:** strona/, usluga/, wdroz.sh
- **Gdzie liczy:** karta OMENa
- **zależy od:** 21
- **równolegle z:** 40, 41
