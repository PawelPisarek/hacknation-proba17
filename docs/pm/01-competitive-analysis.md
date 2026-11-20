# Krok 1 — Analiza konkurencji i podejść (`/competitive-analysis`)

Na podstawie `docs/zadanie.md`. Data: 2026-11-20. Źródła: wyszukiwanie w sieci 20.11 (linki na końcu) i wiedza ogólna — pozycje bez źródła oznaczone **(założenie)**; cen i udziałów w rynku nie podajemy, bo nie mamy ich z wiarygodnego źródła.

## Ustalenia Artura z pokoju (docs/decyzje.md)
- **P2:** wzorzec **typu z biblioteki** — operator prawie nigdy nie ma czystego zdjęcia tej samej naczepy; system dobiera wzorzec typu sam.
- **P3:** operator przy każdym wskazanym miejscu zatwierdza albo odrzuca, a odrzucając podaje powód (zostaje w raporcie). **Sprzeczność z zadaniem §3** („bez interwencji człowieka") — patrz „Przepływ z operatorem" i pytanie P9.
- **P4/P5:** przeoczenie gorsze od fałszywego alarmu; **skuteczność (czy wskazuje to, co ukryte) jest pierwsza, sposób pokazania druga.**
- **P6:** analiza służy opisowi projektu i wyborowi zakresu pierwszej wersji. **P7:** operator ma kilka minut na jedno auto. **P8:** konkurenci właściwi.

## Czego nie wiem o produkcie (stan po odpowiedziach)
1. Wzorzec — rozstrzygnięte (P2).  2. Rola operatora — rozstrzygnięte (P3), zostaje zgodność z zadaniem §3 (P9).  3. Przeoczenie vs fałszywy alarm — rozstrzygnięte (P4).
4. Perspektywa porównania — rozstrzygnięte (P5).  5. Cel analizy — rozstrzygnięte (P6).  6. Użytkownik, problem, zysk — rozstrzygnięte (P7).
7. Zakres pierwszej wersji — rozstrzygnięte (P10, P12). Powody odrzucenia — rozstrzygnięte (P13). Otwarte: brak. Nazwa projektu: „Prześwit" (P11).
Rekomendacje i odpowiedzi: `docs/decyzje.md`.

## Rynek i kontekst
- **Rynek:** kontrola nieinwazyjna pojazdów i kontenerów skanerami RTG na granicach; kupujący: służby celne i graniczne. Główni dostawcy sprzętu: Nuctech, Smiths Detection, Rapiscan, Leidos (raporty rynkowe wymieniają je jako kluczowych graczy) oraz Multicontrol (wymieniony w zadaniu).
- **Kontekst KAS (z zadania):** obrazy z Nuctech i Multicontrol trafiają do centralnego repozytorium; operator decyduje o kontroli fizycznej; obecne narzędzie AI wykrywa papierosy, ale słabo radzi sobie z małymi ilościami ukrytymi w konstrukcji pojazdu — tu przemyt widać jako *zmianę konstrukcji*, nie jako rozpoznawalny przedmiot.
- **Dwa tryby użycia AI w literaturze (UCL):** „wybór do kontroli" (ocena ryzyka przed skanem) i „wsparcie operatora" (wskazywanie miejsc na obrazie). Nasz produkt to wsparcie operatora.
- Stan dziedziny: analiza obrazów cargo jest według przeglądu UCL stosunkowo niedojrzała — dużo miejsca na proste, zrozumiałe narzędzie.
- **Warunki zadania, które zawężają rynek:** działanie bez internetu i chmury w docelowym wdrożeniu, pliki ~50 MB, <1 min na obraz, wskazanie miejsc graficznie, pomiar fałszywych alarmów i przeoczeń.


## Bezpośredni konkurenci (to samo zadanie, ten sam kupujący)
| # | Konkurent | Pozycjonowanie | Mocne strony | Słabe strony / luki | Skuteczność (wykrycia / fałszywe alarmy) |
|---|---|---|---|---|---|
| 1 | **Rapiscan** (InSight) | sprzęt + oprogramowanie analityczne dla granic i portów | anomalie wg intensywności, tekstury, kształtu; tryby: pusty kontener, podobny ładunek, duża gęstość, niejednorodny; osobne modele na kontrabandę; patenty na porównanie z deklaracją | związane z własnym sprzętem; (założenie) brak wsparcia obrazów Nuctech/Multicontrol; nie widać porównania „badany vs wzorzec typu" | brak danych (nie publikowane) |
| 2 | **Smiths Detection** (iCMORE) **(założenie, bez źródła)** | sprzęt + automatyczne wykrywanie zagrożeń | (założenie) rozpoznawanie kategorii towarów, ukryte przedmioty | (założenie) zamknięte, przypięte do własnych skanerów | brak danych |
| 3 | **Nuctech** (AI do własnych skanerów) | duży dostawca sprzętu; skanery u KAS | obrazy już trafiają do repozytorium KAS | (założenie) klasy przedmiotów, nie „zmiana konstrukcji"; zależność od dostawcy | brak danych |
| 4 | **Leidos** **(założenie)** | integrator rozwiązań kontrolnych | doświadczenie wdrożeniowe | (założenie) duże wdrożenia projektowe, nie narzędzie „od ręki" | brak danych |
| 5 | **Obecne narzędzie KAS (papierosy)** (zadanie §1) | wykrywa papierosy w ładunku i pojazdach | działa w produkcji | słabe przy małych ilościach w konstrukcji | z zadania: niezadowalająca przy małych ilościach w konstrukcji; liczb brak |

## Konkurenci pośrednie (inne podejście, to samo zadanie)
- **Operator sam, ręcznie** — porównuje wzrokiem z pamięcią; zmęczenie, rotacja, małe detale umykają.
- **Porównanie z deklaracją/manifestem** (patenty m.in. Rapiscan) — wykrywa niezgodność towaru, nie skrytkę w konstrukcji.
- **Badania akademickie** — UCL: anomalie na poziomie fragmentów obrazu, scalane w mapę ciepła całego kontenera; patent z użyciem autoenkodera; praca WVU z „uczniem i nauczycielem" na obrazach normalnych. Wniosek: podejścia istnieją, ale nie widać gotowego, otwartego narzędzia „wzorzec vs badany".


## Wzorzec typu z biblioteki (P2) — co z tego wynika
System sam **rozpoznaje typ naczepy i dobiera wzorzec z biblioteki**. Dochodzą trzy elementy, których konkurenci nie opisują jako osobnego kroku:
1. **Rozpoznanie typu naczepy** (np. firanka, chłodnia, skrzynia) — błąd tu psuje wszystko dalej.
2. **Budowa biblioteki wzorców** z ok. 200 obrazów z zadania (§7: pary „przed/po"; do biblioteki idą obrazy czyste pogrupowane wg typu). Mało obrazów na typ → wzorzec nie pokrywa naturalnej zmienności pojazdów (liczby typów nie znamy — **założenie**).
3. **Dobór i dopasowanie wzorca** — nawet ten sam typ różni się wyposażeniem, długością, ustawieniem.
**Skutek złego doboru:** fałszywe alarmy (różnice konstrukcji uznane za „dodatki") albo przeoczenia (dodatek podobny do elementu wzorca). To ryzyko nr 1 przy wzorcu typu; sprawdzać na zbiorze z zadania §6.

## Przegląd podejść do porównywania obrazów i wykrywania anomalii (do wyboru przez Programistę)
Oceniane względem wymagań zadania: **~50 MB/obraz**, **< 1 min na obraz** (§7), **praca bez internetu i chmury** w docelowym wdrożeniu (§9; na hackathonie AI wolno używać do napisania kodu), **uczenie na czystych obrazach** (§5), **wskazanie miejsc graficznie** (§3). W docelowym wdrożeniu KAS karty graficznej **nie zakładamy** (założenie).

| Podejście | Idea | 50 MB / < 1 min | Offline | Wzorzec typu (P2) | Zaleta | Ryzyko |
|---|---|---|---|---|---|---|
| Różnica pikseli po dopasowaniu | odejmij wzorzec typu od badanego po wyrównaniu | tak, na procesorze (na zmniejszonym podglądzie/kafelkach) | tak | wprost, ale wzorzec typu ≠ ten pojazd | proste, zrozumiałe dla operatora | przesunięcia i różnice między pojazdami → fałszywe alarmy |
| Dopasowanie + różnica z tolerancją i filtrem szumu | j.w. + progi, minimalny rozmiar plamy, scalanie | tak | tak | tak; uśrednienie kilku wzorców typu zmniejsza szum | kontrola fałszywych alarmów | progi do strojenia |
| Uczenie na czystych (autoenkoder) | odtwarza normalny obraz; duży błąd = anomalia | po kafelkach; nauka na karcie, użycie możliwe na procesorze (założenie) | tak po nauce | „zna" typ sam; rzadkie typy źle | zgodne z §5 | małe obiekty zlewają się z tłem |
| Pamięć fragmentów normalnych (PatchCore) **(założenie: brak testów na RTG naczep)** | fragment badany vs baza fragmentów z czystych | po kafelkach; duża baza i pamięć przy 50 MB | tak | baza = biblioteka typu | mapa ciepła | czas/pamięć; niesprawdzone na naczepach |
| Wykrywanie znanych przedmiotów | uczy się rozpoznawać przedmioty | tak | tak | niepotrzebny | dobre dla znanych klas | wymaga oznaczonych „dodatków" (nie mamy), nie łapie nowych skrytek, niezgodne z §5 |
| Fragmenty + drzewa decyzyjne (UCL) | ocena fragmentów, mapa ciepła | tak | tak | częściowo | lekkie, wytłumaczalne | wymaga opracowania cech |

**Źródło obrazów — Nuctech i Multicontrol:** oba dostarczają obrazy do repozytorium KAS; zadanie podaje format **.bmp**. Każdy dostawca ma inną charakterystykę obrazu → wzorce osobno na dostawcę **(założenie)**; w sztucznych danych tego nie odtworzymy, więc to ryzyko wdrożeniowe, nie hackathonowe.

**Rekomendacja (do decyzji Programisty/Szefa):** zacząć od dopasowania + różnicy z tolerancją (wynik bazowy), potem model uczony na czystych i porównać oba na tym samym zbiorze testowym (≥ 2 hipotezy naraz na karcie). Rozpoznanie typu i dobór wzorca to pierwszy krok każdego z nich.

## Różnicowanie — luki do wykorzystania
- Wskazanie **zmiany konstrukcji** (skrytki), nie tylko znanego towaru — luka obecnego narzędzia KAS.
- **Porównanie z wzorcem typu** jako główna idea: operator widzi „co się zmieniło", nie wynik z procentem.
- **Działanie lokalne, bez chmury**, niezależne od dostawcy skanera (.bmp z Nuctech i Multicontrol).
- **Czytelny raport:** zaznaczone miejsca + decyzja operatora z powodem; bez oceny „winny/niewinny".
- **Skuteczność najpierw (P4/P5):** wskazuje to, co ukryte; przeoczenie gorsze od fałszywego alarmu. Fałszywe alarmy zadanie i tak mierzy (§6), więc je raportujemy i ograniczamy, ale **nie kosztem przeoczeń** — cecha drugorzędna, nie hasło pokazu.
- Duże pliki (~50 MB), partie w najprostszej formie (P12), < 1 min na obraz. Skalowanie na większe zbiory: jedno zdanie w opisie projektu — kolejkę obrazów można rozdzielić na wiele maszyn albo kart, bo każdy obraz liczy się osobno.

## Przepływ z operatorem (P3) a zadanie §3
Zadanie §3: „działa samodzielnie, bez interwencji człowieka". Artur (P3): operator przy każdym miejscu zatwierdza/odrzuca z powodem. **Da się pogodzić, rozdzielając etapy:** program analizuje i zaznacza miejsca **sam** (wymóg §3), a zatwierdzenie/odrzucenie to osobny krok **po** wyniku (raport; §9: wyniki idą do repozytorium z przypisaniem do miejsca i przedmiotu kontroli). **P9** do Artura („A czy B?"): A — analiza sama, decyzja operatora na wyniku (rekomendacja); B — operator uczestniczy już w trakcie analizy.
**Konkurenci:** w znalezionych źródłach brak opisu zatwierdzania z powodem (Rapiscan opisuje tryby analizy, nie przepływ operatora) — nasz przepływ to potencjalna przewaga **(założenie, niezbadane)**. Operator ma kilka minut na auto (P7) — zatwierdzenie musi być szybkie (jedno kliknięcie + powód z listy).

## Zakres pierwszej wersji (P6) — zaakceptowany przez Artura (P10, P12): duży obraz ~50 MB i proste partie od pierwszej wersji
| Musi być | Później | Odpada |
|---|---|---|
| wczytanie obrazu .bmp (~50 MB), < 1 min | wzorce osobno na dostawcę skanera | wykrywanie konkretnej kontrabandy (papierosy itd.) |
| partie (P12): operator wskazuje kilka obrazów, program liczy je po kolei i oddaje listę wyników | rozbudowane skalowanie na duże zbiory (tylko opisane jednym zdaniem) | porównanie z deklaracją/manifestem |
| rozpoznanie typu naczepy i dobór wzorca z biblioteki | zapis wyników w repozytorium KAS | ocena „winny/niewinny" przez program |
| zaznaczenie miejsc na obrazie i raport | uczenie z powodów odrzucenia | integracja ze skanerami |
| zatwierdzenie/odrzucenie miejsca z powodem z listy (P3, P13) | | działanie w chmurze |
| wynik na obrazach czystych i z „dodatkami" (§6) | | |

## Dwie sprzeczności zakresu z zadaniem — rozstrzygnięte przez Artura
1. **Partie obrazów — rozstrzygnięte (P12, A).** Zakres z P10 odkładał partie na później, a zadanie §3 wymaga wprost kompresji, przetwarzania partiami i skalowalności. Artur: partie są w pierwszej wersji, w najprostszej formie (kilka obrazów po kolei, lista wyników), bez rozbudowanego skalowania — to ma jedno zdanie w opisie. Sprzeczność z §3 zamknięta; skalowalność pokazujemy opisem, nie kodem.
2. **Powód odrzucenia miejsca — rozstrzygnięte (P13, A).** Lista powodów: element konstrukcji, zgłoszony ładunek, błąd obrazu, nakładanie się ładunku (najczęstsza pomyłka wg Artura), inny (własny tekst). `PARAMETR: powód odrzucenia = lista (element konstrukcji, zgłoszony ładunek, błąd obrazu, nakładanie się ładunku, inny z tekstem) — P13`.

## Pozycjonowanie (rekomendacja)
„Asystent operatora RTG: pokazuje na obrazie naczepy, co różni się od wzorca typu — lokalnie i szybko, z naciskiem na to, by nie przeoczyć skrytki." Unikamy: obietnicy wykrywania konkretnej kontrabandy i „decyzji bez człowieka" po stronie wyniku. Obserwować: oprogramowanie Nuctech (źródło obrazów KAS) i narzędzie papierosowe KAS.
Ryzyka 12–18 mies.: dostawcy sprzętu dodają porównanie ze wzorcem do własnych skanerów; zły dobór wzorca typu (ryzyko nr 1); różnice między dostawcami obrazów.

## Źródła (wyszukiwanie 20.11.2026)
- Rapiscan — technologia: https://rapiscan-ase.com/resource-center/technology
- Przegląd UCL (analiza obrazów cargo): https://discovery-pp.ucl.ac.uk/10024872/1/101870E.pdf
- Patent (autoenkoder, obrazy cargo): https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12067760
- Praca WVU (destylacja wiedzy, RTG): https://researchrepository.wvu.edu/etd/12688
- Przegląd metod wykrywania przedmiotów w RTG: https://arxiv.org/html/2507.17508v1
- Raport rynkowy (gracze): https://www.marketresearchfuture.com/zh-cn/reports/cargo-container-x-ray-inspection-system-market-39092

<!-- skill: competitor-analysis -->
<!-- skill: przeplywy-pm -->

## Ustalenia Artura (P9–P11)
- P9: program analizuje sam i zaznacza wszystko; operator decyduje na wyniku.
- P10: zakres pierwszej wersji zatwierdzony; dodatkowo pojedynczy duży obraz (~50 MB) działa od razu, partie później.
- P11: nazwa projektu „Prześwit”.

## Ustalenia Artura (P12–P13)
- P12: partie w pierwszej wersji, w wersji prostej: kilka obrazów liczonych po kolei, lista wyników; skalowanie tylko opisane jednym zdaniem (zmienia P10: partie nie czekają na później).
- P13: powody odrzucenia: element konstrukcji, zgłoszony ładunek, błąd obrazu, nakładanie się ładunku, inny (własny tekst).
