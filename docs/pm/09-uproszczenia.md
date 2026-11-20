# 09 — Uproszczenia MVP i wybór dorobienia (wiadomość do Artura — wysłana)

Stan: R6 — po odbiorze 27 (8 z 8); wysłane. Numery: P87 (U1), P88 (U3), P89 (U5), P90 (I1–I2), P91 (dorobienie D).
Źródła: `docs/spec.md` §8–10, `docs/zadania/23–29, 40–42`, wpisy UPROSZCZENIE w `docs/decyzje.md`, odpowiedzi P2–P85, `docs/odbior.md`.

## Czego nie wiem o produkcie
- Czy Artur przyjmuje trzy uproszczenia, o których jeszcze nie decydował (U1, U3, U5).
- Które jedno z trzech dorobić, jeśli zostanie czas (D) — wybór tylko tu, bez dublowania w U.

## Wiadomość do Artura (do pokoju Produkt)

Artur, MVP jest prawie gotowe. Żeby zdążyć, kilka rzeczy zrobiliśmy prościej niż w pełnym produkcie. Cały projekt: https://github.com/PawelPisarek/hacknation-proba17 · strona na żywo: https://hacknation.ksefbot.pl/

**1. Uproszczenia, o które pytamy** — przy każdym tylko: przyjmujesz na pokaz (tak / nie). Rekomendacja: tak.

| nr | Co uproszczone | Czym zastąpione | Co to znaczy dla operatora |
|---|---|---|---|
| U1 (P87) | Logowanie | jedna lista funkcjonariuszy i miejsc kontroli do wybrania, bez logowania do systemów KAS | wybiera siebie z listy; w raporcie nadal jest „kto zdecydował” |
| U3 (P88) | Wzorce | wzorzec mają 3 rodzaje aut (firanka, chłodnia, kontener), z naszych sztucznych czystych obrazów; cysterna wzorca nie ma i dostaje „brak wzorca — sprawdź obraz sam”; opiekun nie dokłada własnych | dla cysterny i innych rodzajów: „brak wzorca — sprawdź obraz sam” |
| U5 (P89) | Raport | zapis jako plik, bez wysyłania do systemów KAS i bez ekranu kierownika zmiany | kierownik czyta plik; nic nie trafia do systemów KAS |

**2. Co operator zobaczy na stronie pod linkiem** (to też uproszczenia; pytamy tak / nie):
- I1 (P90): obraz 50 MB wysyła się ok. 45 s; cel „poniżej minuty” na całe auto jest przez to ciasny.
- I2 (P90): można wgrać jeden obraz naraz (przycisk „Dodaj jeden obraz” — wgrany obraz dostaje kolejny numer auta; wynik zgadza się z wynikiem liczenia: 9 z 9 miejsc, bez różnicy w położeniu); partia pokazowa jest stała.
Rekomendacja: tak.

**3. Już ustalone z Tobą — bez pytania, tylko informacja:**
- partia liczy się auto po aucie: lista od razu pokazuje miniatury, a wiersze są nieklikalne, aż policzy się cała partia — z P12 A i P38 B;
- ogólne podpowiedzi „zwykle tu: …” zamiast opisów od ekspertów — z P81 A;
- zmiana rodzaju pojazdu działa: wybierasz inny rodzaj, strona przelicza auto, a wcześniejsze decyzje w tym aucie się kasują — z P24 B i P27 A;
- raport zapisuje się jako raport do pobrania (tabela), bez miniatury z ramkami — z P72 A; miniatura na liście aut już jest, w raporcie jest na liście dorobienia niżej;
- dane pokazowe sztuczne; w partii nie ma auta „brak wskazań”, bo na czystych autach aplikacja zwykle coś wskazuje; „brak wskazań” to nie gwarancja — z P82 i P58 A;
- praca bez internetu tylko „docelowo”; dziś aplikacja liczy po linku — z P25 A.
- uśpiona usługa: pierwsze kliknięcie po dłuższej przerwie czeka do ok. 30 s; obsługa budzi ją ręcznie przed pokazem (decyzja Pawła, P86). Gdyby zasnęła w trakcie, strona pokazuje napis „Uruchamiam…” i czeka;

**4. Co dorobić, jeśli zostanie czas — jedna rzecz (P91).** Wybierasz tylko tutaj:
- **D1 — miniatura w raporcie (ok. 1–2 h):** przy każdym aucie mały obraz z zaznaczonymi miejscami; kierownik od razu widzi, gdzie było miejsce. Twój pomysł z 13:07 (P72). Na liście aut miniatura już jest; w raporcie jej brak. Wybrałeś D1 (P91) — jest w toku (zadanie 43), czas ok. 1–2 h.
- **D2 — konto funkcjonariusza zamiast listy (kilka godzin):** funkcjonariusz loguje się, a „kto zdecydował” i miejsce kontroli biorą się z konta. Na publicznej stronie to konta i hasła, więc więcej pracy i uwagi niż sama lista.
- **D3 — ekran dokładania wzorca (czas nieoszacowany, wstępnie 2–3 h):** opiekun dodaje czysty obraz jako nowy rodzaj, np. cysternę, która dziś wzorca nie ma. Ryzyko: nowy wzorzec zmienia wyniki aplikacji na autach tego rodzaju (też na tych z pokazu) i tego dziś nie mierzymy.

Rekomendacja: **D1** — najmniejsza robota, widać ją w raporcie na pokazie, zamyka Twój własny pomysł. D2 zajmuje najwięcej czasu i nie zmienia pracy z obrazem; D3 niesie ryzyko dla wyników.

## Dla Szefa
Wysyłka: jedna wiadomość w pokoju Produkt + ntfy (adresat Artur) + wpisy P<n> `— czeka` w `docs/decyzje.md` (P87–P91). Wysłane po odbiorze 27 (8 z 8).

<!-- skill: przeplywy-pm -->
