# 19 — mniej fałszywych alarmów na czystych (egzemplarz, ładunek legalny)

Cel: obniżyć fałszywe alarmy wyniku bazowego (trudny: 36/40 czystych z alarmem; egzemplarz 16/20, ładunek legalny 20/20) bez wzrostu przeoczeń ponad próg.
Wynika z: P4, P26 (nie przeoczyć), P30 (na czystym aucie do 6 ramek), P31 (≥ 90/100 dodatków wskazanych), wynik bazowy 11:46.
Dowód „gotowe”: linia `WYNIK:` w docs/decyzje.md na obu zestawach (zwykły, trudny): fałszywe alarmy X/N i średnia/maks. liczba ramek na czystym obrazie, przeoczenia Y/M wg rodzaju trudności, czas na obraz 50 MB. Wybrana konfiguracja spełnia przeoczenia ≤ 10% i ≤ 6 ramek na czystym (albo wynik mówi, ile brakuje).
Kolejność wyboru: najpierw przeoczenia (P4), potem ramki.
Hipotezy (≥ 2 na przebieg, jeden przebieg na karcie): różnice egzemplarza (długość, słupki, jasność) → wyrównanie nie tylko przesunięciem (skala / odcinkami); ładunek legalny → próg względem lokalnego tła / maska obszaru ładunku; łączenie i odsiew małych plam; próg 6 vs 14 po zmianach.
Nie ruszać: ocena/ocena.py (zasada trafienia bez zmian), dane/.
Pliki: src/przeswit/, ocena/uruchom.sh.
Gdzie liczy: karta OMENa (gpu-tlo); ocena z plików wyników — `--maszyna dowolna`.
Zależy od: 02. Równolegle z: 04, 05–16, łańcuch kroków 3–5.
