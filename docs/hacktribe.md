# HackTribe — tekst do formularza (DRAFT)

> **SZKIC.** Wersja wstępna, przed pomiarami i przed makietą. Nie zawiera liczb skuteczności — jeszcze ich nie mierzyliśmy. Pełny opis z linkami dojdzie po zakończeniu prac.

## Nazwa projektu (`product-name`)

**Prześwit** — wybór Artura (P11): krótko, kojarzy się z RTG, nie obiecuje cudów.

## Nazwa zespołu

Hackathon

## Link do repozytorium

https://github.com/PawelPisarek/hacknation-proba17

## Opis wstępny (≤ 1000 znaków)

Operator RTG na granicy ma na jedno auto kilka minut, by wypatrzyć skrytkę lub towar spoza zgłoszenia. Małe przeróbki konstrukcji łatwo przeoczyć, a obecne narzędzie AI słabo je wykrywa. Prześwit to narzędzie AI, które samo dobiera wzorzec typu pojazdu z biblioteki, porównuje z nim badany obraz i zaznacza różnice graficznie na obrazie i w raporcie. Najważniejsze: nie przeoczyć dodatku (przeoczenie jest gorsze niż fałszywy alarm); pokazujemy, ile przeoczeń i ile fałszywych alarmów wyszło na zbiorze testowym. Dopiero na wyniku operator zatwierdza lub odrzuca każde miejsce, podając powód. Docelowo program działa lokalnie, bez internetu i chmury, i od pierwszej wersji obsługuje duże pliki BMP (~50 MB) oraz partie: operator wskazuje kilka obrazów, a program liczy je po kolei i oddaje listę wyników. Można to rozbudować o kolejkę i równoległe liczenie, bo każdy obraz liczy się osobno. Dane: sztuczny zbiór; skuteczności jeszcze nie mierzyliśmy.

<!-- skill: product-name -->
