# 01 — generator sztucznych obrazów RTG (sonda / dane)
Cel: własny zbiór .bmp zamiast obrazów KAS — pary/grupy „wzorzec” (pusta/czysta naczepa) vs „badany”: część czysta (ten sam pojazd, inne drobne przesunięcie, szum, jasność), część z „dodatkami” (przedmioty, skrytki w konstrukcji, zmiany struktury) — z plikiem prawdy (prostokąty miejsc dodatków).
Wynika z: docs/zadanie.md §3, §5, §6, §7; decyzja startowa (brak danych KAS).
Dowód „gotowe”: katalog danych + manifest (para → czysty / z dodatkami → prostokąty); co najmniej kilka obrazów w pełnym rozmiarze ~50 MB .bmp i zestaw mniejszy do szybkich prób; linia wyniku: ile par czystych / z dodatkami, rozmiary.
Czego nie ruszać: kodu wykrywania (zadanie 02).
Pliki: `dane/generator/`, manifest w `dane/`; duże obrazy nie do repo (repo publiczne, limit) — w repo generator, ziarno i mały podzbiór.
Gdzie liczy: `--maszyna dowolna`.
zależy od: —
równolegle z: 02
