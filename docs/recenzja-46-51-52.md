# Recenzja README, opisu do formularza i sekcji 51/52 (Analityk, 20.11 ok. 08:10)

Względem WYNIK zad. 20/21, sondy 38, P87–P92, `docs/zadania/46,51,52`. Liczby (7,8% / 9,7%, 5,8 / 6,25, 32/32, 40/40, 64/64, 80/80, 1,73 / 1,19 s, 45 s, 2 080 / 3 020 aut/h = 3600÷czas, ~70 aut/h = 3600÷52) zgodne ze źródłem. Braki (od najważniejszego):

1. **produkt** — README „Co nowego” pkt 6 („Zbudowane przez zespół 5 botów AI”) nie ma dowodu (liczba albo zrzut), a zad. 52 wymaga dowodu przy każdym punkcie; to samo na slajdzie 8. Dopisać dowód (np. liczba zadań w `docs/zadania/`, commitów) albo usunąć punkt.
2. **produkt** — README „Co nowego” pkt 4: „materiał do douczania metody” obiecuje douczanie, którego program nie ma (wcześniej „uczy się” było usuwane z wizji, R3 kroku 8); zostawić „decyzje z powodem zapisane w raporcie”, bez „douczania”, albo pytanie do Artura.
3. **technika** — `docs/hacktribe.md`: nagłówek „947 zn.” a opis ma 988 znaków (≤ 1000 spełnione); „obraz 50 MB liczy się średnio 1,7 s” bez „wysyłka przez łącze ok. 45 s” (P90: mówimy wprost) — przy „Działa pod linkiem” jury może spodziewać się 1,7 s od kliknięcia.
4. **technika** — README, tabela wyników: czas bazy „5,0 s (zwykły)” pochodzi z całej siatki 24 konfiguracji naraz (WYNIK 11:46), a v3 „1,73 s” z jednej konfiguracji — kolumny nieporównywalne; dopisać „(siatka 24 konf.)” albo pominąć porównanie.
5. **technika** — brak wykresu zad. 50 w README i opisie (sekcja „Wyniki”): wstawić `docs/zrzuty/wykresy/przeoczenia-vs-ramki.png` z akapitem 51; v1 nie ma „śr. ramek” (— w tabeli) i na wykresie jest tylko poziomą linią.
6. **technika** — „Skalowanie”: „przepustowość rośnie mniej więcej liniowo” jest podpisane jako założenie (OK); „przy liczeniu obok skanera wąskie gardło znika” nie ma pomiaru ani podpisu „założenie” w slajdzie 9 (w README jest w tabeli bez podpisu).

Sekcja 51 (opis fałszywych alarmów): obecna w README „Czym jest u nas fałszywy alarm”, spójna z sondą 38 (28 czystych aut, zawsze ≥ 2 miejsca); brak jej na slajdzie 7 przed liczbą 32/32 (patrz `docs/krytyk-slajdow-R1.md`, brak 2).
Braki „produkt”: 1, 2 → Projektant (pokój Produkt); „technika”: 3–6 → Prezenter przez Szefa.
