# Krok 1 — Analiza konkurencji i podejść (`/competitive-analysis`)

Na podstawie `docs/zadanie.md`. Data: 2026-11-20. Źródła: wyszukiwanie w sieci 20.11 (linki na końcu) i wiedza ogólna — pozycje bez źródła oznaczone **(założenie)**; cen i udziałów w rynku nie podajemy, bo nie mamy ich z wiarygodnego źródła.

## Czego nie wiem o produkcie (pytania do Artura w pokoju Produkt)
1. Czym ma być wzorzec: obraz **tego samego** pojazdu pustego, czy wzorzec dla **typu** pojazdu (naczepa firanka, chłodnia…)? (decyduje, jak trudne jest porównanie)
2. Co operator robi z alarmem — tylko widzi zaznaczone miejsca, czy musi też potwierdzić/odrzucić każde?
3. Czy ważniejsze jest, by nie przeoczyć żadnego „dodatku", czy by nie robić fałszywych alarmów (co wolno poświęcić)?
4. Perspektywa porównania w tej analizie (funkcje / sposób wskazywania / wdrożenie).
5. Do czego posłuży analiza (opis projektu, pokaz, wybór pierwszej wersji).
6. Kto jest użytkownikiem, jaki ma problem, co zyska (moment (a)).
Rekomendacje i odpowiedzi: `docs/decyzje.md` (P2…).

## Rynek i kontekst
- **Rynek:** kontrola nieinwazyjna pojazdów i kontenerów skanerami RTG na granicach; kupujący: służby celne i graniczne. Główni dostawcy sprzętu: Nuctech, Smiths Detection, Rapiscan, Leidos (raporty rynkowe wymieniają je jako kluczowych graczy) oraz Multicontrol (wymieniony w zadaniu).
- **Kontekst KAS (z zadania):** obrazy z Nuctech i Multicontrol trafiają do centralnego repozytorium; operator decyduje o kontroli fizycznej; obecne narzędzie AI wykrywa papierosy, ale słabo radzi sobie z małymi ilościami ukrytymi w konstrukcji pojazdu — tu przemyt widać jako *zmianę konstrukcji*, nie jako rozpoznawalny przedmiot.
- **Dwa tryby użycia AI w literaturze (UCL):** „wybór do kontroli" (ocena ryzyka przed skanem) i „wsparcie operatora" (wskazywanie miejsc na obrazie). Nasz produkt to wsparcie operatora.
- Stan dziedziny: analiza obrazów cargo jest według przeglądu UCL stosunkowo niedojrzała — dużo miejsca na proste, zrozumiałe narzędzie.
- **Warunki zadania, które zawężają rynek:** działanie bez internetu i chmury w docelowym wdrożeniu, pliki ~50 MB, <1 min na obraz, wskazanie miejsc graficznie, pomiar fałszywych alarmów i przeoczeń.

## Bezpośredni konkurenci (to samo zadanie, ten sam kupujący)
| # | Konkurent | Pozycjonowanie | Mocne strony | Słabe strony / luki |
|---|---|---|---|---|
| 1 | **Rapiscan** (oprogramowanie InSight) | sprzęt + oprogramowanie analityczne dla granic i portów | wykrywanie anomalii wg intensywności, tekstury i kształtu; osobne tryby: pusty kontener, podobny ładunek, ładunek o dużej gęstości, niejednorodny; osobne modele na kontrabandę; patenty na porównanie obrazu z deklaracją | związane z własnym sprzętem; (założenie) brak otwartego wsparcia dla obrazów Nuctech/Multicontrol; nie widać opisu porównania „ten pojazd vs wzorzec" |
| 2 | **Smiths Detection** (rodzina iCMORE) **(założenie, bez źródła z tego wyszukiwania)** | sprzęt + automatyczne wykrywanie zagrożeń | (założenie) automatyczne rozpoznawanie kategorii towarów i wykrywanie ukrytych przedmiotów | (założenie) zamknięte, drogie, przypięte do własnych skanerów |
| 3 | **Nuctech** (oprogramowanie AI do własnych skanerów) | największy dostawca sprzętu RTG; skanery u KAS | obrazy trafiają już do repozytorium KAS; wspólny format danych | (założenie) wykrywa klasy przedmiotów, nie „zmianę konstrukcji"; zależność od jednego dostawcy |
| 4 | **Leidos** **(założenie)** | integrator rozwiązań kontrolnych | doświadczenie wdrożeniowe | (założenie) duże wdrożenia projektowe, nie narzędzie „od ręki" |
| 5 | **Obecne narzędzie KAS do papierosów** (z zadania) | wykrywa papierosy w ładunku i pojazdach | działa w produkcji, operatorzy je znają | słabe przy małych ilościach ukrytych w konstrukcji (zadanie, p. 1) |

## Konkurenci pośrednie (inne podejście, to samo zadanie)
- **Operator sam, ręcznie** — porównuje wzrokiem z pamięcią; zmęczenie, rotacja, małe detale umykają.
- **Porównanie z deklaracją/manifestem** (patenty m.in. Rapiscan) — wykrywa niezgodność towaru, nie skrytkę w konstrukcji.
- **Badania akademickie** — UCL: anomalie na poziomie fragmentów obrazu, scalane w mapę ciepła całego kontenera; patent z użyciem autoenkodera; praca WVU z „uczniem i nauczycielem" na obrazach normalnych. Wniosek: podejścia istnieją, ale nie widać gotowego, otwartego narzędzia „wzorzec vs badany".

## Przegląd podejść do porównywania obrazów i wykrywania anomalii (do wyboru przez Programistę)
| Podejście | Idea | Zaleta | Ryzyko |
|---|---|---|---|
| Różnica pikseli po dopasowaniu obrazów | odejmij wzorzec od badanego po wyrównaniu | proste, szybkie, tłumaczy się operatorowi; działa na CPU i bez internetu | wrażliwe na przesunięcie/skalę/różny pojazd → dużo fałszywych alarmów |
| Dopasowanie + różnica z tolerancją i filtrem szumu | j.w. + progi, minimalny rozmiar, scalanie sąsiednich plam | kontrola fałszywych alarmów | progi trzeba stroić na danych |
| Uczenie na „czystych" obrazach (autoenkoder) | sieć uczy się odtwarzać normalny obraz; duży błąd = anomalia | nie potrzebuje przykładów przemytu (zadanie: uczenie na czystych) | małe obiekty zlewają się z tłem; wymaga karty graficznej do nauki |
| Pamięć fragmentów normalnych (PatchCore, **(założenie)** brak testów na RTG naczep) | porównuje fragmenty obrazu z bazą fragmentów z czystych | dobre wyniki w przemyśle; mapa ciepła | w sieci nie znalazłem testów na naczepach; sprawdzić na naszych danych |
| Uczenie wskazywania obiektów (detekcja) | uczy się rozpoznawać przedmioty | dobre dla znanych klas | wymaga oznaczonych „dodatków"; nie łapie nowych skrytek; nie pasuje do „uczenia na czystych" |
| Fragmenty + drzewa decyzyjne (UCL) | ocena anomalii dla fragmentów, mapa ciepła | lekkie, wytłumaczalne | wymaga opracowania cech |

**Rekomendacja (do decyzji Programisty/Szefa):** zacząć od dopasowania + różnicy z tolerancją (wynik bazowy), potem model uczony na czystych obrazach i porównać oba na tym samym zbiorze testowym (zgodnie z zasadą: ≥ 2 hipotezy naraz na karcie).

## Różnicowanie — luki do wykorzystania
- Wskazanie **zmiany konstrukcji** (skrytki), nie tylko znanego towaru — luka obecnego narzędzia KAS.
- **Porównanie z wzorcem** jako główna idea: operator widzi „co się zmieniło", nie wynik z procentem.
- **Działanie lokalne, bez chmury**, niezależne od dostawcy skanera (BMP z Nuctech i Multicontrol).
- **Czytelny raport:** zaznaczone miejsca na obrazie + lista, bez oceny „winny/niewinny" — decyzja zostaje u operatora.
- **Mało fałszywych alarmów** jako cecha widoczna w demo (wynik na obrazach czystych).
- Duże pliki (~50 MB), przetwarzanie partiami, <1 min na obraz.

## Pozycjonowanie (rekomendacja)
„Asystent operatora RTG: pokazuje na obrazie naczepy, co różni się od wzorca — lokalnie, szybko, z małą liczbą fałszywych alarmów." Unikamy: obietnicy wykrywania konkretnej kontrabandy i „autonomicznej decyzji" (decyzja zostaje u funkcjonariusza). Obserwować: rozwój oprogramowania Nuctech (źródło obrazów KAS) i narzędzia papierosowego KAS.
Ryzyka 12–18 mies.: dostawcy sprzętu dodają porównanie ze wzorcem do własnych skanerów; różnice między pojazdami (ten sam typ, inne wyposażenie) → fałszywe alarmy.

## Źródła (wyszukiwanie 20.11.2026)
- Rapiscan — technologia: https://rapiscan-ase.com/resource-center/technology
- Przegląd UCL (analiza obrazów cargo): https://discovery-pp.ucl.ac.uk/10024872/1/101870E.pdf
- Patent (autoenkoder, obrazy cargo): https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12067760
- Praca WVU (destylacja wiedzy, RTG): https://researchrepository.wvu.edu/etd/12688
- Przegląd metod wykrywania przedmiotów w RTG: https://arxiv.org/html/2507.17508v1
- Raport rynkowy (gracze): https://www.marketresearchfuture.com/zh-cn/reports/cargo-container-x-ray-inspection-system-market-39092

<!-- skill: competitor-analysis -->
<!-- skill: przeplywy-pm -->

## Ustalenia Artura (P2–P8)
- Wzorzec: z biblioteki typów pojazdów, dobierany automatycznie (P2).
- Operator zatwierdza/odrzuca każde wskazane miejsce, przy odrzuceniu podaje powód; trafia do raportu (P3).
- Przeoczenie gorsze niż fałszywy alarm (P4). Porównanie z konkurencją: najpierw skuteczność, potem sposób pokazania (P5).
- Analiza służy opisowi projektu i wyborowi zakresu pierwszej wersji (P6).
- Użytkownik: operator RTG na granicy, ma kilka minut na jedno auto (P7). Konkurenci właściwi (P8).
