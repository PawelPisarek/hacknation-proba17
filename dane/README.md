# Dane sztuczne (zadanie 01)
Generator: `python dane/generator/generuj.py --wyj <katalog> --ziarno 17 --spec mini:3:2:2,maly:8:5:5,sredni:3:3:3,pelny:1:1:1`
(zależność: numpy; deterministyczny — to samo ziarno = te same bajty). Spec: `poziom:wzorce_na_typ:czyste_na_typ:dodatki_na_typ`.

Poziomy: mini 1024×256 (0,8 MB), maly 2048×512 (3,1 MB), sredni 4096×1024 (12,6 MB), pelny 8192×2048 (50,3 MB, 24-bit BMP).
Typy pojazdów: firanka, chlodnia, kontener, cysterna. Wzorce = biblioteka czystych egzemplarzy typu (inna długość, osie,
słupki, jasność, szum, przesunięcie); badane = `czyste` (nie mogą alarmować) i `dodatki` (1–3 prostokąty: przedmiot / skrytka / przerobka).
Wzorzec NIE jest tą samą naczepą — dobór wzorca robi system (prawda: `typ_pojazdu` w manifeście).

- `dane/manifest.json` — pełny zbiór (148 obrazów: 60 wzorców, 44 badane czyste, 44 z dodatkami), współrzędne prostokątów w px obrazu badanego.
- `dane/mini/` — podzbiór w repo (28 BMP + własny manifest.json), do szybkich prób.
- Pełny zbiór (1,3 GB, nie w repo): ThinkPad `hackathon@192.168.1.113:~/dane/proba17/` (+ `generuj.py`); odtworzenie komendą wyżej.
- `dane/generator/podglad.py plik.bmp wyj.png [krok]` — podgląd PNG.

## Zbiór trudny (zadanie 03)
Generator: `python dane/generator/generuj_trudny.py --wyj <katalog> --ziarno 17 --spec mini:2:1:1:1:1,maly:4:3:3:3:3,sredni:2:2:2:2:2,pelny:1:1:1:1:1`
(spec: `poziom:wzorce:egzemplarz:ladunek_legalny:maly:za_ladunkiem`, liczby na typ; używa `generuj.py`, nie zmienia `dane/mini` ani `manifest.json`).
Rodzaje (pole `trudnosc`): `egzemplarz` (czyste; silne przesunięcie/skala/jasność), `ladunek_legalny` (czyste; ładunek nakłada się na konstrukcję —
każdy alarm to FP; prostokąty w `ladunek_legalny`), `maly` (dodatki kilkanaście px), `za_ladunkiem` (mały dodatek wewnątrz legalnego ładunku).
`dane/manifest-trudny.json` — pełny (148 obrazów), `dane/mini-trudny/` — podzbiór w repo (24 BMP + manifest.json). Pełny zbiór 1,7 GB:
ThinkPad `hackathon@192.168.1.113:~/dane/proba17-trudny/`.
