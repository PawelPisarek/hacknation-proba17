# Prześwit

**Status: DRAFT** — wersja robocza, wyniki skuteczności jeszcze niezmierzone.

**Prześwit** to narzędzie AI dla operatora RTG na granicy: porównuje obraz naczepy z wzorcem typu pojazdu i zaznacza miejsca, w których może być ukryty towar. Operator zatwierdza lub odrzuca każde miejsce (odrzucenie z powodem); decyzja należy do niego.

Dla kogo: operatorzy RTG Służby Celno-Skarbowej (zadanie KAS, HackNation).
Makieta: — (po wdrożeniu) · wersja na ksefbot.pl: — (po wdrożeniu)

## Jak uruchomić

Kod: `src/przeswit/` (`wykryj.py` — wykrywanie, `bmp.py` — wczytanie BMP), ocena: `ocena/ocena.py`.
Zależności: `pip install -r requirements.txt`. Liczenie używa karty graficznej (CUDA), a bez niej procesora.

Szybka próba na małym zbiorze w repo (komenda z nagłówka `wykryj.py`):

```
PYTHONPATH=src python -m przeswit.wykryj --biblioteka dane/mini --manifest dane/mini/manifest.json --wyj wyniki/mini
PYTHONPATH=src python -m przeswit.wykryj --biblioteka DIR --badane a.bmp b.bmp ... --wyj DIR   # partia: wskazane obrazy
```

Wynik bazowy i ocena na pełnych zbiorach: `ocena/uruchom.sh` (wymaga zbiorów w `$DANE` i `$TRUDNE`, karty graficznej). Uruchomienie aplikacji z makietą: —

## Dane

Zbiór sztuczny (zdjęć KAS nie mamy): naczepy czyste i z dodatkowym ładunkiem, pliki BMP do ~50 MB, cztery typy pojazdów.
Opis i generator: `dane/README.md` (generator deterministyczny); podzbiory w repo: `dane/mini/`, `dane/mini-trudny/`; pełne zbiory poza repo.

## Użyte narzędzia (przygotowane wcześniej)

- **Zespół botów na OpenMausBot** (5 ról: Szef, Projektant, Analityk, Programista, Prezenter) — https://github.com/milind-soni/OpenMausBot (Apache-2.0)
- **Modele Claude** (Anthropic)
- **Skille pm-skills** — https://github.com/phuryn/pm-skills (MIT); łańcuch opisu produktu w `docs/pm/`
- **Biblioteki z `requirements.txt`:** numpy, torch, pillow

## Dokumenty

`docs/hacktribe.md` (opis do formularza, DRAFT) · `docs/slajdy-szkic.md` (szkielet prezentacji) · `docs/decyzje.md` (ustalenia)

## Uruchomienie (szkic, Programista)
Wymaga: Python 3, `pip install -r requirements.txt` (numpy, torch z CUDA, pillow); liczy na karcie graficznej.
- Partia obrazów (lista wyników + PNG z zaznaczeniami): `PYTHONPATH=src python -m przeswit.wykryj --biblioteka <katalog wzorców> --badane a.bmp b.bmp --wyj wyniki/partia` (opcjonalnie `--typ firanka|chlodnia|kontener|cysterna`).
- Ocena na zbiorze z manifestem: `PYTHONPATH=src python -m przeswit.wykryj --biblioteka dane/mini --manifest dane/mini/manifest.json --wyj wyniki/mini` i `python ocena/ocena.py --manifest dane/mini/manifest.json --wyniki wyniki/mini/wyniki.json`.
- Pełny przebieg oceny (zwykły + trudny, wszystkie poziomy): `sh ocena/uruchom.sh` (dane w `~/dane/proba17`, `~/dane/proba17-trudny`).
