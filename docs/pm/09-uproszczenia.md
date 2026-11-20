# 09 — Uproszczenia MVP i wybór dorobienia (wiadomość do Artura — NIE WYSŁANA)

Stan: R3 po recenzji 09 R2 (4 braki, `docs/odbior.md`). Czeka na sygnał Szefa po odbiorze MVP. Numery P nadam przy wysyłce (następne wolne po P85); tu robocze U1–U3, I1–I3 i D.
Źródła: `docs/spec.md` §8–10, `docs/zadania/23–29, 40–42`, wpisy UPROSZCZENIE w `docs/decyzje.md`, odpowiedzi P2–P85, `docs/odbior.md`.

## Czego nie wiem o produkcie
- Czy Artur przyjmuje trzy uproszczenia, o których jeszcze nie decydował (U1, U3, U5).
- Które jedno z trzech dorobić, jeśli zostanie czas (D) — wybór tylko tu, bez dublowania w U.

## Wiadomość do Artura (do pokoju Produkt)

Artur, MVP jest prawie gotowe. Żeby zdążyć, kilka rzeczy zrobiliśmy prościej niż w pełnym produkcie. Cały projekt: https://github.com/PawelPisarek/hacknation-proba17 · strona na żywo: https://hacknation.ksefbot.pl/

**1. Uproszczenia, o które pytamy** — przy każdym tylko: przyjmujesz na pokaz (tak / nie). Rekomendacja: tak.

| nr | Co uproszczone | Czym zastąpione | Co to znaczy dla operatora |
|---|---|---|---|
| U1 | Logowanie | jedna lista funkcjonariuszy i miejsc kontroli do wybrania, bez logowania do systemów KAS | wybiera siebie z listy; w raporcie nadal jest „kto zdecydował” |
| U3 | Wzorce | wzorzec mają 3 rodzaje aut (firanka, chłodnia, kontener), z naszych sztucznych czystych obrazów; cysterna wzorca nie ma; opiekun nie dokłada własnych | dla cysterny i innych rodzajów: „brak wzorca — sprawdź obraz sam” |
| U5 | Raport | zapis jako plik, bez wysyłania do systemów KAS i bez ekranu kierownika zmiany | kierownik czyta plik; nic nie trafia do systemów KAS |

**2. Co operator zobaczy na stronie pod linkiem** (to też uproszczenia, o których wiedzieć warto; pytamy tak / nie):
- I1: przy pierwszym kliknięciu po przerwie strona będzie czekać do ok. 30 s; pojawi się komunikat „Uruchamiam program”.
- I2: obraz 50 MB wysyła się ok. 45 s; cel „poniżej minuty” na całe auto jest przez to ciasny.
- I3: będzie można wgrać jeden obraz naraz (przycisk „Dodaj jeden obraz”); partia pokazowa jest stała.
Rekomendacja: tak.

**3. Już ustalone z Tobą — bez pytania, tylko informacja:**
- liczenie partii po kolei, auta otwiera się po policzeniu całej partii — z P12 A i P38 B;
- ogólne podpowiedzi „zwykle tu: …” zamiast opisów od ekspertów — z P81 A;
- w raporcie brak miniatury z ramkami (na razie tabela) — z P72 A, miniatura jest na liście dorobienia niżej;
- dane pokazowe sztuczne; w partii nie ma auta „brak wskazań”, bo na czystych autach program zwykle coś wskazuje; „brak wskazań” to nie gwarancja — z P82 i P58 A;
- praca bez internetu tylko „docelowo”; dziś program liczy po linku — z P25 A.

**4. Co dorobić, jeśli zostanie czas — jedna rzecz (D).** Wybierasz tylko tutaj:
- **D1 — miniatura w raporcie (ok. 1–2 h):** przy każdym aucie mały obraz z zaznaczonymi miejscami; kierownik od razu widzi, gdzie było miejsce. Twój pomysł z 13:07 (P72). Czas liczy się dopiero po tym, jak do raportu trafią decyzje, a na stronie pojawią się ramki.
- **D2 — konto funkcjonariusza zamiast listy (kilka godzin):** funkcjonariusz loguje się, a „kto zdecydował” i miejsce kontroli biorą się z konta. Na publicznej stronie to konta i hasła, więc więcej pracy i uwagi niż sama lista.
- **D3 — ekran dokładania wzorca (czas nieoszacowany, wstępnie 2–3 h):** opiekun dodaje czysty obraz jako nowy rodzaj, np. cysternę, która dziś wzorca nie ma. Ryzyko: nowy wzorzec zmienia wyniki programu na autach tego rodzaju (też na tych z pokazu) i tego dziś nie mierzymy.

Rekomendacja: **D1** — najmniejsza robota, widać ją w raporcie na pokazie, zamyka Twój własny pomysł. D2 zajmuje najwięcej czasu i nie zmienia pracy z obrazem; D3 niesie ryzyko dla wyników.

## Dla Szefa
Wysyłka: jedna wiadomość w pokoju Produkt + ntfy (adresat Artur) + wpisy P<n> `— czeka` w `docs/decyzje.md` (U1, U3, U5, I1–I3 jako jedno pytanie „przyjmujesz tak/nie” albo osobno; D osobno). Przed wysyłką: paczka do Analityka i sprawdzenie, że opisy zgadzają się ze stanem MVP po zadaniach 40, 29, 28, 27.

<!-- skill: przeplywy-pm -->
