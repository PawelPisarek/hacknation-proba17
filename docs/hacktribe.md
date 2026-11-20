# HackTribe — tekst do formularza (DRAFT)

> **SZKIC.** Wersja wstępna, przed pomiarami i przed makietą. Nie zawiera liczb skuteczności — jeszcze ich nie mierzyliśmy. Pełny opis z linkami dojdzie po zakończeniu prac.

## Nazwa projektu (`product-name`)

**Prześwit** — wybór Artura (P11): krótko, kojarzy się z RTG, nie obiecuje cudów.

## Nazwa zespołu

Hackathon

## Link do repozytorium

https://github.com/PawelPisarek/hacknation-proba17

## Opis wstępny (≤ 1000 znaków)

Operator RTG na granicy ma na jedno auto kilka minut, by wypatrzyć skrytkę lub towar spoza zgłoszenia. Małe przeróbki konstrukcji łatwo przeoczyć, a obecne narzędzie AI słabo je wykrywa. Prześwit to narzędzie AI: program dobiera wzorzec typu pojazdu z biblioteki (operator może zmienić rodzaj pojazdu, a analiza liczy się od nowa), porównuje z nim obraz i zaznacza różnice graficznie na obrazie i w raporcie. Gdy brak wzorca, pokazuje „wzorzec przybliżony” i „wynik mniej pewny”. Najważniejsze: nie przeoczyć dodatku; pokazujemy, ile przeoczeń i fałszywych alarmów wyszło na zbiorze testowym. Na wyniku operator zatwierdza lub odrzuca każde miejsce; przy odrzuceniu podaje powód. Docelowo działa lokalnie, bez internetu. Od pierwszej wersji obsługuje duże pliki BMP (~50 MB) i partie: kilka obrazów liczy po kolei, oddając listę wyników; można to rozbudować o równoległe liczenie. Dane: sztuczny zbiór; skuteczności jeszcze nie mierzyliśmy.

<!-- skill: product-name -->
