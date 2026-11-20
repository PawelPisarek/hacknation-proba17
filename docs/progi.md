# Słowa niski / średni / wysoki — wybór poziomów (zadanie 32, do zatwierdzenia przez Artura)

Wszystkie liczby: **dane sztuczne**. Słowo przy miejscu zależy od tego, jak mocno miejsce różni się od wzorca; poziomy są **jednakowe dla wszystkich aut** (P45 B). Liczyliśmy na 36 czystych autach (8 z `dane/mini`, 8 z `dane/mini-trudny`, 20 dodatkowych z `dane/scenariusze`) i 26 prawdziwych ukrytych rzeczach w autach z dodatkami (3 z nich program w ogóle nie wskazał — w żadnym wariancie nie dostają słowa). Dla czystego auta bierzemy słowo jego **najmocniejszego** miejsca.

## Wniosek (najważniejsze)
**Żaden wariant nie spełnia naraz życzeń P45 B i P75 B.** Prawdziwe ukryte rzeczy różnią się od wzorca *słabiej* (typowo 0,5) niż przypadkowe różnice na czystych autach (typowo 1,6; fałszywy punkt na kole w aucie 7: 2,1). Dlatego każdy poziom, który zostawia czyste auta bez „wysoki”, daje „niski” prawdziwym rzeczom, a każdy poziom, który daje „wysoki” prawdziwym rzeczom, daje „wysoki” prawie każdemu czystemu autu. Słowo mówi więc „jak mocno inne”, a nie „jak prawdopodobny dodatek”. Potrzebna decyzja Artura (niżej).

## Tabela 1 — ile aut i ukrytych rzeczy dostaje które słowo
| Wariant | „wysoki” od | „średni” od | Czyste auta (z 36): wysoki / średni / niski | Prawdziwe ukryte rzeczy (z 26): wysoki / średni / niski / niewskazane |
|---|---|---|---|---|
| A | 0,6 | 0,3 | 35 / 1 / 0 | 5 / 17 / 1 / 3 |
| B | 0,9 | 0,5 | 35 / 0 / 1 | 1 / 12 / 10 / 3 |
| C | 1,5 | 0,8 | 19 / 16 / 1 | 0 / 1 / 22 / 3 |
| E | 2,2 | 1,2 | 11 / 14 / 11 | 0 / 1 / 22 / 3 |
| D | 3,4 | 1,6 | 4 / 13 / 19 | 0 / 0 / 23 / 3 |
| F | 4,0 | 2,0 | 2 / 11 / 23 | 0 / 0 / 23 / 3 |

Wariant A to poziomy tymczasowe z makiety R2 (0,6 / 0,3). Czyste auta z „wysoki” w D: 4 z 36 (11%), w F: 2 z 36 (6%). Wyniki osobno dla każdego zestawu: `ocena/wyniki-progi32.json`.

## Tabela 2 — auto 7 (`trudny_mini_firanka_za_ladunkiem_00`, 11 miejsc): co dostaje fałszywy punkt na kole, a co prawdziwy dodatek (P75 B)
| Miejsce | Czym jest | Moc | A | B | C | E | D | F |
|---|---|---|---|---|---|---|---|---|
| 1 | **fałszywy** punkt na kole | 2,13 | wysoki | wysoki | wysoki | średni | średni | średni |
| 2 | fałszywe, podwozie | 1,10 | wysoki | wysoki | średni | niski | niski | niski |
| 3 | fałszywe, podwozie | 1,03 | wysoki | wysoki | średni | niski | niski | niski |
| 6 | **prawdziwy dodatek** za ładunkiem | 0,52 | średni | średni | niski | niski | niski | niski |
| 4, 5, 7–9 | fałszywe | 0,40–0,68 | wysoki lub średni | średni lub niski | niski | niski | niski | niski |
| 10, 11 | fałszywe | 0,21–0,27 | niski | niski | niski | niski | niski | niski |

W każdym wariancie punkt na kole ma słowo **równe lub wyższe** niż prawdziwy dodatek: życzenie „wysoki nie przy kole, niski nie przy dodatku” (P75 B) nie da się spełnić samymi poziomami.

## Decyzja dla Artura (rekomendacja: 1)
1. **Wariant D (3,4 / 1,6)**: czyste auto prawie nigdy nie dostaje „wysoki” (4 z 36), ale prawdziwe ukryte rzeczy prawie zawsze mają „niski” (23 z 26) — operator musi oglądać także „niskie”. Na pokazie auto 7: koło „średni”, dodatek „niski” (napis „poza znaną konstrukcją, obejrzyj uważnie” już jest).
2. **Wariant A/B**: „wysoki” dla prawie każdego czystego auta (35 z 36) — słowo nic nie mówi.
3. **Bez słów** (tylko kolejność od najmocniejszego miejsca): to zmiana P17/P45 w produkcie i specu; do decyzji Artura.
4. Inna miara w słowie (np. wielkość miejsca) — zmiana metody (zadanie 20 zamknięte); nie sprawdzaliśmy.

