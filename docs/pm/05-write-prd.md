# Krok 5 — PRD „Prześwit” (`/write-prd`, skill create-prd)

Spec do budowy: `docs/spec.md`. Wejście: `docs/pm/01–04`, `szkice-wariantow.md`, P2–P41, linie `WYNIK` (dane sztuczne).

## Czego nie wiem o produkcie
- **P41** (czy decyzję w poprzednim aucie można zmienić po przejściu do następnego): odpowiedź Artura: A (AC A13).
- Próg P30 B (≤ 6 ramek) jest dziś niespełniony (Z2, Z6); pytanie do Artura dopiero gdy zadanie 20 też nie da ≤ 6 ramek (decyzja Szefa 12:07).
- Zachowanie na prawdziwych obrazach KAS — nieznane, mamy tylko sztuczne (Z10).

## 1. Podsumowanie
Prześwit pomaga operatorowi RTG porównać obraz naczepy ze wzorcem i wskazuje miejsca różne od wzorca, czyli możliwe ukryte dodatki. Operator ma kilka minut na auto i kilkadziesiąt aut na zmianę, a coraz częściej krótki staż (P7, P19, P20). Program liczy partię sam, operator decyduje na wyniku (P9 A).

## 3. Tło
Zadanie KAS (`docs/zadanie.md`): narzędzie AI porównuje obraz RTG z wzorcem i wskazuje różnice. Obecne narzędzie KAS wykrywa papierosy, ale słabo małe skrytki w konstrukcji. Dane KAS nie są dostępne — pracujemy na sztucznych.

## 4. Cel i miary
- Nie przeoczyć (P4, P26 A): przeoczenia ≤ 10% dodatków (P31 A) — dziś 12,5–14% (Z1).
- Mało ramek na czystym aucie: ≤ 6 (P30 B) — dziś ~17,7 bazowo, v2 4,2 / 12,9 (Z2, zad. 19).
- < 1 min na obraz ~50 MB — dziś śr. 5,0 s (Z9).
Wszystkie liczby na danych sztucznych.

## 5. Segment
Funkcjonariusz SCS przy stanowisku RTG na przejściu granicznym; może mieć krótki staż (P19). Poza segmentem w 1. wersji: kierownik zmiany (raport zastępuje ekran, UPROSZCZENIE).

## 6. Propozycja wartości
- **Kto:** operator RTG. **Po co:** znaleźć małe skrytki i przeróbki w konstrukcji. **Dziś:** ogląda ręcznie wiele podobnych obrazów, zmęczenie (P21). **Jak:** dwa obrazy obok siebie, ramki od najbardziej różnego, lupa, podpowiedź „zwykle tu…”. **Po:** szybciej do właściwych miejsc, ślad kontroli bez pisania. **Alternatywy:** oglądanie bez narzędzia; narzędzie do papierosów (nie widzi małych skrytek).
- **Zdanie:** „Prześwit pokazuje operatorowi, czym obraz auta różni się od wzorca — i zostawia decyzję jemu.”

## 7. Rozwiązanie
7.1 Ścieżka: logowanie → partia → lista partii → auto (widok C: badany i wzorzec obok, kafelki miejsc) → zatwierdź/odrzuć z powodem → nr rej. → następne auto → raport. Szczegóły ekranów E1–E7: `docs/spec.md` §2.
7.2 Funkcje w kolejności P34 (pozycje 1→5 = pomysły 1, 3, 2, 10, 6): ramki + lista; lupa; wzorzec obok; podpowiedź krótkiego stażu; zmiana rodzaju. Podstawa: .bmp 50 MB, partia po kolei, dobór wzorca, powody odrzucenia (P13), raport (P18), brak wzorca → napis (P35 A).
7.3 Technika: lokalnie, bez internetu docelowo (P25 A).
7.4 Założenia: Z1, Z2+Z6, Z7, Z11 (P33) — wyniki w specu §5–6; Z12, Z14 do przeglądu na makiecie.

## 8. Wydanie
Pierwsza wersja: wszystko z pozycji 1–5 i podstawy; cięcie od końca (założenie zespołu): najpierw pozycja 5, potem 4. Później: dokładanie wzorców, wzorce na dostawcę, wynik na bieżąco. Nie robimy: wykrywania towaru, porównania z deklaracją, pomysłów 4, 5, 7, 8, 9.

## Co zmieniła decyzja o wyglądzie (P36–P41)
Wariant C + lista partii z B; wiersz auta z miniaturą (P37 B); wejście w auto po całej partii (P38); podpowiedź przy każdym kafelku od razu (P39 B); po ostatnim miejscu następne auto (P40 B) — P41 A — zmiana decyzji z listy partii do zamknięcia sprawy; wszystko odpowiedzi Artura.

Uproszczenia: pełna lista z kosztami dorobienia w `docs/spec.md` §8.

<!-- skill: create-prd -->
<!-- skill: przeplywy-pm -->
