# Zadanie 21 — wdrożenie: strona na ksefbot.pl + usługa na karcie OMENa (projekt)

Autor: Paweł (drugi programista), 20.11. Gałąź `pawel/wdrozenie`. Scala Programista.

## Po co

Artur (i jury — w finale 2025 jury prosiło o **demo na żywo** konkretnego przypadku, nie o slajdy) otwiera
https://hacknation.ksefbot.pl/, wgrywa własny `.bmp` (także ~50 MB) albo klika „partia pokazowa” i dostaje wynik
policzony na karcie OMENa. To samo uruchamia się lokalnie bez internetu (P25 docelowo, A12). Źródła: P43 A, P10, A12,
A14, zadanie 21. Kryteria zadania KAS 2025: skuteczność 40%, innowacyjność 30%, **skalowalność 30%** — wdrożenie gra
w skalowalność: liczenie osobno od strony, jeden kontener na stanowisko, kopie/karty można dokładać.

## Cele / nie-cele / anty-cele

- **Cele (= „Dowód gotowe” zad. 21):** (1) jedna komenda stawia usługę na karcie i stronę; (2) z linku wgranie pliku
  z `dane/mini` i dużego ~50 MB daje wynik — sprawdzone z zewnątrz (`./przegladaj strona-test` z wgraniem pliku);
  (3) zdrowie OK zaraz po wdrożeniu; (4) lokalnie bez sieci ten sam wynik na partii pokazowej.
- **Nie-cele:** ekrany produktu (ramki na obrazie, lupa, wzorzec obok, decyzje, raport) — to 22–29 Programisty; dobór
  progów niski/średni/wysoki (P49 — zespół na danych testowych); obsługa „brak wzorca” (P35) i poprawa detektora.
- **Anty-cele:** wycięcie wgrywania własnego pliku (P43 — brak działania = usterka); liczenie na procesorze
  (serwer ksefbot.pl, ThinkPad, kontener); usługa na wyłączność karty (`--wylaczne`) blokująca przebiegi zespołu.

## Podejścia (wybrane: A)

- **A — usługa jako zlecenie orkiestratora `--klasa gpu-tlo --rdzenie 2` bez `--wylaczne` + strona Node na Coolify
  przekazująca plik do `192.168.1.112:<port>`; usługa dodatkowo w obrazie Dockera do uruchomienia lokalnego.**
  Zgodne z regułą „karta tylko przez orkiestrator”; wzór strony z próby 16 (`app/serwer.mjs`) sprawdzony do połowy
  (sieć .147 → OMEN jest, usługa nie słuchała). Ryzyko: orkiestrator może zdjąć zlecenie → strona mówi „karta nie
  odpowiada”, ponowne `wdroz` podnosi.
- B — kontener z kartą jako aplikacja Coolify na serwerze `omen`: omija orkiestrator, GPU w Dockerze nieprzetestowane,
  OMEN usypia. Odrzucone.
- C — każde wgranie osobnym zleceniem: kolejka + zimny start torcha = minuty, łamie A12 (< 1 min). Odrzucone.

Paweł wybrał A z obrazem Dockera (20.11, po przeglądzie kryteriów). Zakres strony: rura + najprostsza strona
(decyzja moja, Paweł „nie wiem” → wariant tańszy do odkręcenia): wyniki surowe, ekrany Programisty podłączą się do
tego samego API.

## Projekt

**1. Usługa `usluga/serwer.py`** (Python, biblioteka standardowa `http.server` + istniejący `przeswit`):
- Przy starcie raz ładuje bibliotekę wzorców na kartę (`Biblioteka` z `wykryj.py`), potem liczy pojedyncze obrazy.
- `GET /zdrowie` → `{ok, urzadzenie, karta, metoda, konfiguracja, wzorcow, typy}`; `ok` tylko, gdy urządzenie = cuda.
- `POST /analiza[?typ=<rodzaj>]`, ciało = surowy `.bmp` → `{plik, rodzaj, wzorzec, miejsca:[{nr,x0,y0,x1,y1,roznica}],
  czas_s, uwaga?}` — miejsca posortowane od najbardziej różnego; pole `roznica` surowe (słowa P49 dokłada strona
  ekranów, gdy zespół ustali progi). Zapis do pliku tymczasowego, bo `wczytaj_szarosc` bierze ścieżkę.
- `GET /partia-pokazowa` → wyniki dla partii z P51 B: 6 aut z `dane/mini` + jeden przypadek trudny „za ładunkiem”
  z `dane/mini-trudny` (dokładne pliki: ustala budowniczy, lista w kodzie i w README).
- `GET /` i pliki strony z `strona/public/` — lokalnie usługa sama podaje stronę (jeden proces, bez internetu).
- Metoda i konfiguracja z parametrów `--metoda/--siatka` (domyślnie: najlepsza zapisana w `docs/decyzje.md`; po
  zamknięciu zad. 20 przełączenie = zmiana domyślnej, bez zmian w kodzie strony).
- `--port` (domyślnie 8770), `--host` (lokalnie `127.0.0.1`, na OMENie `0.0.0.0`), `--bezczynnosc MIN`
  (0 = nigdy nie kończy; domyślnie 0 na czas pokazu — usługa nie może zniknąć jurorowi).
- Jedno liczenie naraz (blokada): karta 4 GB, kolejne żądanie czeka.

**2. Strona `strona/`** (Node 22, bez zależności, wzór próby 16):
- `serwer.mjs`: pliki z `public/`, `POST /api/analiza` → strumieniem do `OMEN_URL/analiza` (limit 120 s), `GET
  /api/partia-pokazowa`, `GET /api/zdrowie` → `{strona: ok, karta: <odpowiedź /zdrowie usługi albo błąd>}`.
  Bez `OMEN_URL` albo gdy usługa milczy: czytelny komunikat „karta OMENa nie odpowiada”, nie biały ekran.
- `public/index.html`: przycisk „Wskaż obraz .bmp”, przycisk „Partia pokazowa”, wynik jako tabela (plik, rodzaj,
  wzorzec, liczba miejsc, czas) + lista miejsc. Język polski, bez zewnętrznych skryptów i fontów (działa offline).
  Te same względne adresy `/api/...` co lokalna usługa (lokalnie usługa odpowiada też pod `/api/*`).
- `Dockerfile` w korzeniu repo (Coolify buduje z korzenia, port 3000), `.dockerignore` wycina `dane/`, `ocena/`, `src/`.

**3. Obraz lokalny `usluga/Dockerfile`:** Python + torch + `src/` + `dane/mini*` + `strona/public`; `docker run -p
8770:8770 [--gpus all] przeswit` → strona i usługa pod http://localhost:8770. Na stanowisku z kartą liczy na karcie.

**4. `wdroz.sh`** (jedna komenda, punkt 1):
1. jeśli `http://192.168.1.112:8770/zdrowie` nie odpowiada `ok` → w tle zlecenie orkiestratora
   (`uruchom --maszyna omen --klasa gpu-tlo --rdzenie 2 --konto hackathon --ssh --wyslij . -- … python -m
   usluga.serwer --host 0.0.0.0`), czeka do 5 min na `ok`;
2. Coolify: aplikacja `hacknation` (uuid w `pomocnik/konfiguracja/hacknation.json`) przestawiona na repo
   `hacknation-proba17`, zmienna `OMEN_URL=http://192.168.1.112:8770`, jawne `/deploy` (PATCH nie wdraża);
3. czeka, aż `https://hacknation.ksefbot.pl/api/zdrowie` da `strona ok` + `karta ok`; wypisuje oba i kod wyjścia.
   Wdrożenie (krok 2) za zgodą Pawła (`POMIN_WDROZENIE=1`).

## Dowody (jak sprawdzam)

- Test jednostkowy usługi bez karty: `/zdrowie` mówi `ok: false` na CPU, `/analiza` na złym pliku → 400 z opisem
  (sabotaż: plik ucięty). Testy strony (`node --test`): przekazanie ciała 1:1, komunikat przy martwej usłudze.
- Na karcie (orkiestrator, gpu-tlo): partia pokazowa + jeden plik 50 MB przez HTTP z tego samego zlecenia; liczby do
  `docs/decyzje.md` (WYNIK: czasy, liczby miejsc) — zgodne z wynikiem CLI `wykryj` dla tych plików.
- **Bez sieci (punkt 4):** usługa na OMENie z `--host 127.0.0.1` w zleceniu, w kodzie straż `socket.connect` odmawiająca
  adresów spoza pętli zwrotnej (tryb `--bez-sieci`), partia pokazowa z `curl localhost` = ten sam wynik co przez link;
  `grep` w `strona/public` na `http` zewnętrzne = 0.
- Z zewnątrz: `./przegladaj strona-test https://hacknation.ksefbot.pl/ --wgraj … --pliki <mini.bmp>` i drugi raz
  z plikiem ~50 MB (z ThinkPada `~/dane/proba17`), odczyt liczby miejsc i czasu.

## Po recenzji budowniczego (20.11)

- **DO PAWŁA:** zlecenie `gpu-tlo` dostaje w Slurmie `--gres=gpu:1` (`orkiestrator/serwer/slurm.mjs:109`) — karta
  na wyłączność, mimo braku `--wylaczne`. Stała usługa (`--bezczynnosc 0`) zablokuje przebiegi zespołu na karcie.
  Warianty: (a) usługa tylko w oknie pokazu/testu, poza nim `--bezczynnosc 10`; (b) stała usługa, zespół czeka.
- Moje decyzje: biblioteka wzorców jak w pomiarach — obraz pełny ↔ wzorce `maly` z `~/dane/proba17` na OMENie,
  obraz mini ↔ wzorce mini (dobór po rozmiarze); obraz Dockera tylko mini (pokaz lokalny = partia mini).
  Coolify `hacknation` serwuje próbę 16 (zakończona) — nadpisujemy. Metoda: domyślna = ta, którą Programista
  wskaże jako bieżącą najlepszą (pytam go przy starcie budowy), odpowiedź mapowana osobno dla v1/v2/v3.
  Strona publiczna bez hasła (jury), limit 120 MB, jedno liczenie naraz z komunikatem „zajęte, czekaj”.

## Otwarte / do budowniczego

- Czy Docker na OMENie widzi kartę (`--gpus`) — nieznane (moje ssh nie wchodzi na konto); obraz sprawdzam budową +
  `/zdrowie` przez orkiestrator; uruchomienie obrazu na karcie = sonda, nie warunek gotowe (punkt 4 spełnia wariant
  „wiersz poleceń” z §3 specu).
- Limit czasu zlecenia `gpu-tlo` w Slurmie — w kliencie nie widać; sprawdzić `scontrol` przy pierwszym zleceniu.
- Cloudflare: limit ciała żądania 100 MB (plan darmowy) — 50 MB mieści się; zmierzyć wgraniem.
