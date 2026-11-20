# Prześwit

**Status: DRAFT** — wersja robocza; część celów skuteczności jeszcze niespełniona (sekcja „Wyniki”).

**Prześwit** to narzędzie AI dla operatora RTG na granicy: porównuje obraz naczepy z wzorcem typu pojazdu i zaznacza miejsca, w których może być ukryty towar. Operator zatwierdza lub odrzuca każde miejsce (odrzucenie z powodem); decyzja należy do niego.

Dla kogo: operatorzy RTG Służby Celno-Skarbowej (zadanie KAS, HackNation).
Makieta (wybór wariantu): https://pawelpisarek.github.io/hacknation-proba17/makieta/warianty/ · wersja na ksefbot.pl: — (po wdrożeniu)
Makieta R2 (klikalna, dane sztuczne, partia pokazowa 7 aut): https://pawelpisarek.github.io/hacknation-proba17/makieta/r2/

## Jak uruchomić

Wymaga Pythona 3 i `pip install -r requirements.txt`; liczy na karcie graficznej (CUDA), bez niej na procesorze (wolniej). Kod: `src/przeswit/` (`wykryj.py` — metoda bazowa v1, `wykryj2.py` — v2, `wykryj3.py` — v3, `bmp.py`), ocena: `ocena/ocena.py`, `ocena/wybor.py`, `ocena/analiza.py`.

```
# partia wskazanych obrazów (lista wyników + PNG z zaznaczeniami; opcjonalnie --typ firanka|chlodnia|kontener|cysterna)
PYTHONPATH=src python -m przeswit.wykryj --biblioteka KATALOG_WZORCOW --badane a.bmp b.bmp --wyj wyniki/partia
# szybka próba na małym zbiorze z repo + ocena
PYTHONPATH=src python -m przeswit.wykryj --biblioteka dane/mini --manifest dane/mini/manifest.json --wyj wyniki/mini
python ocena/ocena.py --manifest dane/mini/manifest.json --wyniki wyniki/mini/wyniki.json
```

**Uwaga:** domyślne ustawienia (`prog=6`) różnią się od użytych w wynikach, więc „szybka próba” da inne liczby. Wyniki odtwarzają skrypty na pełnych zbiorach (`$DANE`, `$TRUDNE`, karta graficzna): `ocena/uruchom.sh` (metoda bazowa; domyślna siatka `prog=6,10,14`, a `prog=10,14` tylko w kroku pelny2048; wynik bazowy to konfiguracja `dobor=najblizszy,K=3,tol=2,prog=14`), `ocena/uruchom19.sh` (metoda v2, `--metoda v2`), `ocena/uruchom20.sh` (v3). Uruchomienie aplikacji z makietą: —

## Aplikacja: strona + usługa na karcie (zadanie 21)

- **Pod linkiem:** https://hacknation.ksefbot.pl/ — strona (`strona/`, Node) przekazuje wgrany `.bmp` (do 120 MB) do usługi
  liczącej na karcie OMENa (`usluga/`, Python + torch). Przycisk „Partia pokazowa” liczy 7 aut z `dane/mini*`.
- **Jedna komenda (kontener zespołu):** `sh wdroz.sh` — usługa na karcie (orkiestrator, `gpu-tlo`), wdrożenie strony,
  sprawdzenie `/api/zdrowie` z linku. `sh wdroz.sh --usluga` budzi samą usługę (po 10 min bez pytań zwalnia kartę).
- **Lokalnie, bez internetu (jeden kontener na stanowisko):**
  ```
  docker build -f usluga/Dockerfile -t przeswit .
  docker run --rm --network none -p 8770:8770 przeswit        # strona i usługa: http://localhost:8770
  ```
  Z kartą NVIDIA: `--build-arg TORCH_INDEX=https://download.pytorch.org/whl/cu121` i `docker run --gpus all …`.
  Bez Dockera: `PYTHONPATH=src:. python -m usluga.serwer --bez-sieci` (wiersz poleceń, http://127.0.0.1:8770).

## Wyniki (na danych sztucznych, nie na zdjęciach KAS)

Źródło: linie `WYNIK` w `docs/decyzje.md`; metoda v2 (zad. 19), zestaw zwykły / trudny:
- przeoczenia: 12/64 (18,8%) / 11/62 (17,7%); cel ≤ 10% — **niespełniony**;
- fałszywe alarmy (obrazy czyste z ≥1 ramką): 24/32 / 38/40; ramki na czystym trudnym śr. 12,9 (cel ≤ 6 — niespełniony);
- dobór wzorca: 64/64 / 80/80; czas na obraz 50 MB: śr. 0,91 s, maks. 1,30 s.

Metoda bazowa (zwykły / trudny, wpis 11:46): fałszywe alarmy 32/32 i 36/40, przeoczenia 8/64 i 11/62, dobór 64/64 i 79/80; czas na obraz — zwykły: śr. 3,8 s, a pełny 50 MB śr. 5,0 s (maks. 8,1 s; siatka 24 konfiguracji naraz); trudny: śr. 1,6 s (maks. 4,8 s), a pełny 50 MB śr. 1,7 s. Baza ma więc mniej przeoczeń na zwykłym, ale więcej fałszywych alarmów niż v2. Liczby to wyniki wewnętrzne zespołu, nie gwarancja skuteczności.

## Dane

Zbiór sztuczny (zdjęć KAS nie mamy): naczepy czyste i z dodatkowym ładunkiem, pliki BMP do ~50 MB, cztery typy pojazdów. Opis i generator: `dane/README.md`; podzbiory w repo: `dane/mini/`, `dane/mini-trudny/`; pełne zbiory poza repo.

## Użyte narzędzia (przygotowane wcześniej)

- **Zespół botów na OpenMausBot** (5 ról: Szef, Projektant, Analityk, Programista, Prezenter) — https://github.com/milind-soni/OpenMausBot (Apache-2.0); zlecenia liczeniowe idą przez orkiestrator zadań (Slurm)
- **Karta graficzna** GTX 1050 (laptop OMEN), na której liczono wyniki
- **Modele Claude** (Anthropic)
- **Skille pm-skills** — https://github.com/phuryn/pm-skills (MIT); łańcuch opisu produktu w `docs/pm/`
- **Biblioteki z `requirements.txt`:** numpy, torch, pillow

## Dokumenty

`docs/hacktribe.md` (opis do formularza, DRAFT) · `docs/slajdy-szkic.md` · `docs/decyzje.md` (ustalenia i WYNIK) · `docs/materialy.md` · `docs/pm/` (łańcuch PM) · `docs/zrzuty/` (zrzuty, lupa)
