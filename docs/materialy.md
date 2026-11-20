# Materiały zadania (krok 0) — co z docs/zadanie.md wynika dla produktu
Źródło: docs/zadanie.md (§ w nawiasach), docs/decyzje.md (P2: wzorzec = wzorzec TYPU pojazdu z biblioteki, system dobiera sam).

## Dane — co jest, w jakim formacie, czego brakuje
| Co | Stan | Źródło |
|---|---|---|
| ~200 obrazów RTG środków przewozowych, pary/grupy „przed/po”, .bmp, ~50 MB każdy, ~10 GB | **nie mamy** — do zgrania z pendrive na stoisku KAS | §7 |
| Obrazy „czyste” (test FP) i „z dodatkami” (test FN) | KAS ma; my nie | §6 |
| Prawda (gdzie są dodatki) | nie wiemy, w jakiej formie KAS ją poda (maska? prostokąty? opis?) | §6 — brak |
| Zastępstwo: zbiór sztuczny | **jest** — dane/generator, manifest, dane/mini w repo; pełny 1,3 GB na ThinkPadzie ~/dane/proba17 | dane/README.md |
Dane KAS to dane chronione: nie kopiować, nie udostępniać, nie wrzucać do repo/chmury (§7). Repo jest publiczne → tylko dane sztuczne.
Brak: API partnera, linków, zbiorów publicznych; dostawcy RTG (Nuctech, Multicontrol) — format/rozdzielczość/głębia BMP nieznane (zakładam 8- lub 24-bit, szarość).

## Wymagania (co musi robić)
1. Porównać obraz badany z obrazem wzorcowym i wskazać różnice (§3) — wzorzec dobierany z biblioteki wg typu pojazdu (P2) → potrzebny **klasyfikator/dobór typu + wzorca**.
2. Zaznaczyć miejsca anomalii graficznie (raport z zaznaczonymi obszarami) (§3, §6).
3. Obraz czysty → zero zaznaczeń; FP liczone (§6). Obraz z dodatkiem → wskazać miejsce; przeoczenie = FN (§6).
4. Wejście .bmp ~50 MB; kompresja, przetwarzanie partiami; skalowalność na większe zbiory (§3).
5. Działa samodzielnie, bez człowieka; uczy się na obrazach wzorcowych (§3, §5).
6. < 1 min na obraz (§7).
7. Docelowo offline, bez chmury/AI w internecie (§9); do tworzenia kodu wolno narzędzia AI.
8. Oddanie: opis i tytuł, repozytorium, PDF ≤ 10 slajdów (§4); zrzuty/demo opcjonalnie.

## Ograniczenia, które kształtują rozwiązanie
- 50 MB BMP (≈ 8192×2048 px 24-bit albo ~7000² 8-bit) → przetwarzanie kafelkami/pyramid, nie całość w pamięci karty (GTX 1050, 4 GB).
- Brak chmury docelowo → model lokalny, mały; demo na karcie OMENa w sieci lokalnej, bez zewnętrznych API.
- Przesunięcie/skala/jasność między egzemplarzami: wymagana rejestracja (dopasowanie) i normalizacja przed porównaniem; naturalna zmienność typu (długość, osie) ≠ anomalia.
- Wzorzec to inny egzemplarz tego samego typu (P2) → proste odejmowanie pikseli da dużo FP; potrzebne porównanie odporne (cechy/strukturalne, model anomalii uczony na czystych).
- Pomiar: FP na czystych, FN na dodatkach; trafienie = wskazane miejsce pokrywa dodatek (spec 02).

## Ryzyka
| # | Ryzyko | Wpływ | Sposób sprawdzenia |
|---|---|---|---|
| R1 | Dane KAS inne niż sztuczne (inne artefakty, rozdzielczość, głębia, kolor) → model uczony na sztucznych nie przenosi się | wysoki | generator z trudnymi wariantami; na stoisku KAS od razu pomiar na prawdziwych (próbka) |
| R2 | FP na czystych (zmienność egzemplarzy typu, szum) | wysoki (kryterium §6) | liczyć FP na `trudny=true`; próg ustalany na czystych |
| R3 | Małe skrytki (≈ kilkadziesiąt px w 8192 px) giną przy zmniejszaniu obrazu | wysoki (słabość obecnego narzędzia §1) | kafelki w pełnej rozdzielczości; pomiar FN wg rozmiaru dodatku |
| R4 | Czas > 1 min na 50 MB | średni | pomiar czasu na `pelny` (karta OMENa) |
| R5 | Błędny dobór typu/wzorca → lawina FP | wysoki | metryka trafności doboru (typ w manifeście); odmowa gdy pewność niska |
| R6 | Pamięć karty 4 GB / RAM przy 50 MB BMP | średni | kafelki, strumieniowe czytanie BMP |
| R7 | Brak prawdy od KAS w innym formacie niż prostokąty | niski | skrypt oceny z maską i prostokątem |
| R8 | Dane chronione wyciekną do repo/chmury | wysoki (formalny) | tylko sztuczne w repo; dane KAS poza gitem |

## Otwarte pytania (do Artura przez Projektanta/Szefa)
1. Typy pojazdów, które mają być obsłużone (firanka, chłodnia, kontener, cysterna — czy więcej? nasz zbiór zakłada te 4).
2. Skąd biblioteka wzorców w produkcji i kto ją zasila (KAS dostarcza „czyste” obrazy typu?) — a gdy dla typu brak wzorca?
3. Co ma zobaczyć operator: tylko ramki, ocena ryzyka, lista wielu miejsc? Próg alarmu (czułość vs FP).
4. Czy wynik ma być zapisywany z przypisaniem do miejsca i przedmiotu kontroli (§9) — jakie pola?
5. Gdy dobór wzorca się nie powiedzie: komunikat „brak wzorca” czy najlepszy wynik?

## Zbiór sztuczny (zadanie 01) — skrót
148 obrazów BMP 24-bit: 60 wzorców (4 typy × biblioteka), 44 badane czyste, 44 z dodatkami; poziomy mini/maly/sredni/pelny (0,8 / 3,1 / 12,6 / 50,3 MB). Szczegóły: dane/README.md, manifest: dane/manifest.json.
