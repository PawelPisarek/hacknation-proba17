# Slajdy — szkielet (DRAFT, ≤ 10 slajdów, potem PDF)

> Szkic przed pomiarami i makietą. Liczby skuteczności: **[do zmierzenia]** — nie wpisujemy niczego, czego nie zmierzyliśmy.
> Oś przekazu (`value-prop-statements`): *Dla operatora RTG na granicy: RóżnicaRTG wskazuje miejsca, w których obraz naczepy odbiega od wzorca, więc operator w kilka minut wie, gdzie szukać skrytki — decyzję nadal podejmuje on.*
> Nazwa „RóżnicaRTG” to rekomendacja z `docs/hacktribe.md`.

## 1. RóżnicaRTG — tytuł
- Narzędzie AI dla operatora RTG: porównuje obraz naczepy z wzorcem i zaznacza różnice.
- Zespół: Hackathon · repo: github.com/PawelPisarek/hacknation-proba17
- [zrzut: ekran główny makiety — obraz naczepy z zaznaczonym miejscem]

## 2. Problem
- Operator RTG KAS ogląda obrazy naczep i musi wypatrzyć skrytkę lub towar spoza zgłoszenia.
- Małe przeróbki konstrukcji (detale, skrytki) łatwo przeoczyć; obecne narzędzie do papierosów słabo radzi sobie z małymi ilościami w konstrukcji.
- Na jedno auto operator ma kilka minut.
- [zrzut: przykładowy obraz RTG naczepy (sztuczny) bez podpowiedzi]

## 3. Dla kogo
- Operator RTG Służby Celno-Skarbowej na granicy zewnętrznej UE.
- Zyskuje: wskazane miejsca do kontroli fizycznej, zamiast przeglądania całego obrazu „na oko”.
- Obrazy pochodzą ze skanerów Nuctech i Multicontrol (formaty .bmp, ~50 MB).
- [zrzut: persona / ścieżka operatora z makiety]

## 4. Rozwiązanie
- System sam dobiera wzorzec **typu pojazdu** z biblioteki (operator rzadko ma czyste zdjęcie tej samej naczepy).
- Porównuje badany obraz z wzorcem i zaznacza miejsca różnic.
- Obraz bez różnic nie dostaje zaznaczeń.
- [zrzut: obraz badany obok wzorca, z zaznaczeniami]

## 5. Operator decyduje
- Przy każdym zaznaczonym miejscu operator zatwierdza albo odrzuca; odrzucając, podaje powód.
- Decyzje i powody zostają w raporcie.
- Człowiek zostaje decydentem; narzędzie tylko wskazuje, gdzie patrzeć.
- [zrzut: lista miejsc z przyciskami „zatwierdź / odrzuć” i polem powodu]

## 6. Demo
- Scenariusz ≤ 2 min: wczytaj obraz → system dobiera wzorzec → zaznaczone miejsca → decyzje operatora → raport.
- Dane: własny, sztuczny zbiór (zdjęć KAS nie mamy).
- [zrzut: kolejne kroki makiety]  ·  [link: makieta pod GitHub Pages / ksefbot.pl — wpisać po wdrożeniu]

## 7. Jak to działa i jak to mierzymy
- Dane: sztuczne naczepy „czyste” i z „dodatkowym ładunkiem”, pliki .bmp, przetwarzanie partiami.
- Priorytet: przeoczenie jest gorsze niż fałszywy alarm — ale liczbę fałszywych alarmów pokazujemy wprost.
- Przeoczenia (na obrazach z dodatkami): **[do zmierzenia]** · fałszywe alarmy (na obrazach czystych): **[do zmierzenia]** · czas na obraz: **[do zmierzenia]**
- [zrzut: wykres/tabela wyniku na zbiorze testowym — po pomiarze]

## 8. Narzędzia przygotowane wcześniej
- Zespół botów na OpenMausBot (github.com/milind-soni/OpenMausBot, Apache-2.0).
- Modele Claude (Anthropic).
- Skille pm-skills (github.com/phuryn/pm-skills, MIT).
- Biblioteki z kodu: [dopisać po powstaniu kodu].

## 9. Na tle istniejących rozwiązań
- Porównanie: przede wszystkim skuteczność (czy wskazuje to, co ukryte), na drugim miejscu sposób pokazania operatorowi.
- Konkurenci: oprogramowanie producentów skanerów oraz obecne narzędzie KAS do papierosów.
- [zrzut: tabela porównania z docs/pm/01-competitive-analysis.md — po poprawce recenzji]

## 10. Co dalej
- Zasilić biblioteką prawdziwych wzorców typów pojazdów po otrzymaniu danych KAS.
- Praca lokalna, bez chmury (docelowo wymóg KAS) i integracja z repozytorium obrazów.
- Skalowanie na większe zbiory; pomiary na obrazach KAS **[do zmierzenia]**.
- [zrzut: schemat wdrożenia — opcjonalnie]

<!-- skill: value-prop-statements -->
