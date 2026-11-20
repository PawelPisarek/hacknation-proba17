# 38 — sonda: czy w naszych danych jest czyste auto z 0 miejsc na v3

Cel: ustalić, czy pokaz „program nic nie wskazał” da się zrobić na prawdziwym, niezależnie wygenerowanym czystym aucie.
Wynika z: P82 (odpowiedź Artura 15:39: A tylko bez sztuczek, inaczej B z uczciwym opisem).

Uwaga: `dane/scenariusze/czyste_zero/badany_mini_kontener_zero_00.bmp` ma zerową różnicę wobec wzorca (kopia wzorca) —
to sztuczka, **nie liczy się**.

Dowód „gotowe”: wykryj_v3 (progi bez zmian, z progiem „brak wzorca” z zadania 36 albo bez — zapisz który) uruchomiony
na 20 czystych autach `~/dane/scenariusze/czyste_p49/` (odtworzenie: `python dane/generator/scenariusze.py --wyj dane/scenariusze --poza ~/dane/scenariusze`)
+ 8 czystych z `dane/mini`; tabela auto → liczba miejsc w `docs/odbior.md` (sekcja „Sonda 38”); werdykt jednym zdaniem:
„jest: <plik>” albo „nie ma (najmniej N miejsc)”. Linia w `docs/decyzje.md`.

Czego nie ruszać: progi, metoda, `dane/mini`, `dane/mini-trudny`, partia pokazowa (zmienia ją dopiero werdykt).
Gdzie liczy: karta OMENa (orkiestrator).
Zależy od: — . Równolegle z: 36, przejście demo na r3.
Po werdykcie: „jest” → podmiana auta 4 w partii (Programista), demo.md (Prezenter), spec §7 i 06 (Projektant);
„nie ma” → B: moment wypada z pokazu, w opisie zdanie „na czystych autach program zwykle coś wskazuje”.
