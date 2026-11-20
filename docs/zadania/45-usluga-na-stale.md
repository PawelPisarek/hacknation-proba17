# 45 — usługa dla linku na stałe (od zamrożenia do 11:00)

- **Cel:** https://hacknation.ksefbot.pl/ odpowiada wynikiem z karty o każdej porze do końca (pokaz, nagranie, sprawdzający) — bez usypiania po bezczynności
- **Z czego wynika:** zamrożenie funkcji 07:00; zadanie 42 (budzenie) zostaje jako zapas
- **Dowód „gotowe”:** usługa uruchomiona bez `--bezczynnosc`; po 15 min bez ruchu partia pokazowa liczy się od razu (czas pierwszego auta w meldunku); wpis z godziną startu i nr zlecenia
- **Czego nie ruszać:** kod metody i strony; inne zlecenia na karcie dopiero po tym (karta = usługa)
- **Gdzie liczy:** karta OMENa
- **zależy od:** —
- **równolegle z:** 44, 46, 47, 48
