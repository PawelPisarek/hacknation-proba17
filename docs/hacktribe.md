# HackTribe — tekst do formularza

> Gotowe do wklejenia. Wszystkie obrazy i wyniki z danych sztucznych (nie z obrazów KAS); liczby z linii WYNIK zadania 20 (v3) w `docs/decyzje.md`. Linki sprawdzone: HTTP 200 (20.11.2026).

## Nazwa projektu (`product-name`)

Prześwit

## Nazwa zespołu

Hackathon

## Link do repozytorium

https://github.com/PawelPisarek/hacknation-proba17

## Link do działającego programu

https://hacknation.ksefbot.pl/ (dane sztuczne; makieta klikalna: https://pawelpisarek.github.io/hacknation-proba17/makieta/r3/)

## Opis (≤ 1000 znaków; 906 zn.)

Prześwit to pomocnik operatora RTG: pokazuje, gdzie na obrazie auta patrzeć najpierw, a decyzja zawsze zostaje po stronie człowieka. Operator wskazuje partię obrazów (także BMP ~50 MB), program liczy auta i daje listę. W aucie widać obraz badany i wzorzec obok siebie oraz kafelki miejsc od najbardziej odmiennego, z podpowiedzią „zwykle tu…”; najwyżej 6 na ekranie, reszta pod „pokaż”. Program sam dobiera wzorzec typu pojazdu (64/64 i 80/80), operator może zmienić rodzaj. Bez wzorca: „brak wzorca — obejrzyj ręcznie”. Nie dajemy alarmu tak/nie, tylko kolejność miejsc: czyste auto zwykle dostaje ramki (średnio 5,8 i 6,25). Operator zatwierdza lub odrzuca każde miejsce (powód przy odrzuceniu); raport z miniaturami aut zapisuje się lokalnie. Działa pod linkiem. Dane sztuczne: przeoczenia 7,8% i 9,7%, obraz 50 MB liczy się średnio 1,7 s (wysyłka przez sieć ok. 45 s). Docelowo lokalnie, bez internetu.

## Narzędzia przygotowane wcześniej (373 zn.)

Projekt zbudował zespół 5 botów AI w 24 h (dowód: https://github.com/PawelPisarek/hacknation-proba17/blob/main/docs/decyzje.md). Zespół botów na OpenMausBot (github.com/milind-soni/OpenMausBot, Apache-2.0), modele Claude (Anthropic), skille pm-skills (github.com/phuryn/pm-skills, MIT), orkiestrator zadań (Slurm), karta graficzna GTX 1050, biblioteki numpy, torch, pillow.

<!-- skill: product-name -->
