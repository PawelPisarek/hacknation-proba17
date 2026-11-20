# Prześwit

> Prześwit to pomocnik operatora RTG: pokazuje, gdzie na obrazie auta patrzeć najpierw, a decyzja zawsze zostaje po stronie człowieka.

**Status: DRAFT** — wersja robocza; część celów skuteczności jeszcze niespełniona (sekcja „Wyniki”).

**Prześwit** to narzędzie AI dla operatora RTG na granicy: porównuje obraz naczepy z wzorcem typu pojazdu i zaznacza miejsca, w których może być ukryty towar. Operator zatwierdza lub odrzuca każde miejsce (odrzucenie z powodem); decyzja należy do niego. Na czystych autach program zwykle coś wskazuje — decyzję zawsze podejmuje człowiek.

Dla kogo: operatorzy RTG Służby Celno-Skarbowej (zadanie KAS, HackNation).
Makieta (wybór wariantu): https://pawelpisarek.github.io/hacknation-proba17/makieta/warianty/ · działający program: https://hacknation.ksefbot.pl/
Makieta R3 (klikalna, dane sztuczne, partia pokazowa 7 aut): https://pawelpisarek.github.io/hacknation-proba17/makieta/r3/

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

## Strona na żywo — co działa

https://hacknation.ksefbot.pl/ (odebrane na linku, 20.11.2026, dane sztuczne):

1. Na obrazie auta widać ramki z numerami takimi samymi jak na kafelkach miejsc.
2. Kafelki są ułożone od miejsca najbardziej odmiennego od wzorca.
3. Lupa powiększa wybrane miejsce do 4×, a ramka zostaje na środku okna.
4. Obok obrazu badanego stoi wzorzec, z przesunięciem dopasowanym do miejsca.
5. Przy każdym miejscu jest podpowiedź „zwykle tu…” (np. podwozie — belki, koła i oś) — bez słów niski/średni/wysoki i bez procentów.
6. Cysterna nie ma wzorca: program pisze „brak wzorca — sprawdź obraz sam” i nie rysuje ramek.
7. Własny obraz .bmp można wgrać ze strony; analiza trwała ok. 1,3 s (kontener, 12 miejsc).

8. Partia pokazowa ma 7 aut z liczbą miejsc 8 / 6 / 12 / 8 / 7 / 0 / 11; auto 6 (cysterna) ma „brak wzorca”.
9. Każde miejsce zatwierdzasz jednym kliknięciem albo odrzucasz z powodem wybranym z listy; auto zamykasz po wpisaniu numeru rejestracyjnego.
10. Raport partii pobierzesz jako .json i .csv; przy zamykaniu partii program ostrzega o autach bez decyzji.
11. Partia liczy się auto po aucie (stan „liczy się 3/7”), a na liście są miniatury obrazów; wiersze stają się klikalne, gdy auto jest policzone.
12. „Dodaj jeden obraz” dokłada kolejne auto do partii.
13. Gdy miejsc jest więcej niż widać, lista ma „i jeszcze N miejsc — pokaż” (z poprawną odmianą: 2 miejsca, 1 miejsce).
14. „Zamknij auto” działa po rozstrzygnięciu ostatniego miejsca (Enter jako skrót) i otwiera następne auto; po ostatnim wraca lista z „Raport partii”.
15. Po zamknięciu partii decyzji nie da się już zmienić (wiersze listy są zablokowane).
16. Rodzaj pojazdu zmienisz jednym kliknięciem, z podglądem 2 wzorców; auto przelicza się, a wcześniejsze decyzje przy nim są kasowane (odbiór niezależny w toku).
17. Po zmianie na cysternę program pisze „brak wzorca”.
18. Raport partii zawiera rodzaj wykryty przez program i rodzaj wybrany przez operatora.

Gdy program jest zajęty, strona pokazuje „Uruchamiam program, ok. 30 s” i sama ponawia liczenie. Uśpiony program obsługa budzi ręcznie przed pokazem (UPROSZCZENIE P86).

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
