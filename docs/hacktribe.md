# HackTribe — tekst do formularza (DRAFT)

> **SZKIC.** Wersja wstępna, DRAFT. Wszystkie obrazy i wyniki z danych sztucznych (nie z obrazów KAS); liczby z linii WYNIK zadań 20 i 33 w `docs/decyzje.md`. Pełny opis z linkami dojdzie po zakończeniu prac.

## Nazwa projektu (`product-name`)

**Prześwit** (9 zn.) — wybór Artura (P11): krótko, kojarzy się z RTG, nie obiecuje cudów.

## Nazwa zespołu

Hackathon (9 zn.)

## Link do repozytorium

https://github.com/PawelPisarek/hacknation-proba17

## Link do makiety

https://pawelpisarek.github.io/hacknation-proba17/makieta/r3/ (makieta R3)

## Opis wstępny (≤ 1000 znaków; 934 zn.)

Prześwit to pomocnik operatora RTG: pokazuje, gdzie na obrazie auta patrzeć najpierw, a decyzja zawsze zostaje po stronie człowieka. Operator ma na auto kilka minut. Narzędzie AI: operator wskazuje partię obrazów (także BMP ~50 MB), program liczy auta po kolei i pokazuje listę. W aucie widać obraz badany i wzorzec obok siebie oraz kafelki miejsc z podpowiedzią „zwykle tu…”; max 6 miejsc od najbardziej odmiennego od wzorca, reszta pod „pokaż”. Program dobiera wzorzec typu pojazdu, operator może zmienić rodzaj. Bez wzorca: „brak wzorca — obejrzyj ręcznie”; bez wskazań: „to nie gwarancja, że auto jest czyste”. Operator zatwierdza lub odrzuca każde miejsce (powód przy odrzuceniu); raport zapisuje się lokalnie. Najważniejsze: nie przeoczyć. Na danych sztucznych przeoczenia 7,8% i 9,7%, a czas ~50 MB poniżej 2 s. Docelowo lokalnie, bez internetu. Stan: DRAFT, makieta R3, dane sztuczne.

## Narzędzia przygotowane wcześniej (193 zn.)

Zespół botów na OpenMausBot (github.com/milind-soni/OpenMausBot, Apache-2.0), modele Claude (Anthropic), skille pm-skills (github.com/phuryn/pm-skills, MIT), biblioteki numpy, torch, pillow.

<!-- skill: product-name -->
