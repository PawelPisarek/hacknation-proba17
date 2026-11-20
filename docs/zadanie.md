# Zadanie (dosłownie, HackNation 2025 — KAS)

Automatyczna wyszukiwarka anomalii w kontroli celno-skarbowej
“Pomóż nam ułatwić pracę operatorom na granicy, którzy analizują obrazy by zautomatyzować proces identyfikacji anomalii”.

## 1. Wprowadzenie - opis organizacji, sytuacji i stanu aktualnego
Krajowa Administracja Skarbowa (KAS) w procesie kontroli celno-skarbowej wykorzystuje na granicy zewnętrznej UE wielkogabarytowe urządzenia RTG. Urządzenia te wykorzystywane są w ramach kontroli nieinwazyjnej kontenerów, pojazdów ciężarowych, osobowych autokarów oraz wagonów kolejowych. Dostawcami tych urządzeń są firmy Nuctech oraz Multicontrol. Operatorzy RTG (funkcjonariusze Służby Celno-Skarbowej) na podstawie analizy obrazów RTG dokonują oceny stanu faktycznego i podejmują decyzję co do dalszego trybu postępowania, którą może być zlecenie przeprowadzania kontroli fizycznej w celu sprawdzenia czy w konstrukcji środków przewozowych oraz w przewożonym towarze nie znajdują się towary niezgłoszone. Wszystkie obrazy RTG trafiają do centralnego repozytorium, gdzie są gromadzone. Dotychczasowe doświadczenia Służby Celno-Skarbowej wskazują, że przemytnicy ukrywają towar niezgłoszony zarówno w elementach konstrukcyjnych pojazdów, jak i w samym towarze będącym przedmiotem formalnego zgłoszenia celnego. Operatorzy RTG analizujący obrazy RTG powinni otrzymać wsparcie w czynnościach analitycznych, w postaci narzędzia analitycznego opartego na sztucznej inteligencji (AI), porównującego analizowane obrazy RTG z wielkogabarytowych urządzeń RTG z obrazami wzorcowym i wskazujące różnice mogące sugerować przewóz towaru niezgłoszonego do odprawy celnej (przemyt).

Obecnie KAS wykorzystuje w procesie kontroli nieinwazyjnej narzędzie oparte na AI do automatycznego wykrywania papierosów w środkach przewozowych i towarach na podstawie analizowanych obrazów RTG. W przypadku przemytu małych ilości papierosów w elementach konstrukcyjnych środków przewozowych skuteczność tego narzędzia nie jest zadowalająca. W takich przypadkach na przemyt mogą wskazywać detale, zmiany konstrukcyjne, przeróbki w celu umiejscowienia skrytek w celach przemytniczych.

## 2. Wyzwanie
Uczestnicy mają opracować model/aplikację opartą na narzędziach sztucznej inteligencji (AI), która autonomicznie porównuje obrazy rentgenowskie (RTG) środków przewozowych. Celem jest wykrywanie potencjalnych różnic lub odstępstw od ustalonych reguł (np. ukryte przedmioty, modyfikacje struktury, anomalie wskazujące na przemyt lub uszkodzenia).

## 3. Oczekiwany rezultat
Uczestnicy mają przygotować model/aplikację wykrywającą i wskazującą nieprawidłowości w obrazie środka transportowego. Model/aplikacja ma działać samodzielnie, bez interwencji człowieka, analizując pary lub grupy obrazów w poszukiwaniu anomalii i zapewnić:
- porównanie obrazów RTG pod kątem podobieństw i różnic (np. używając technik detekcji anomalii, segmentacji lub porównań pikselowych);
- identyfikację odstępstwa od "reguły" (np. wzorcowego obrazu pustego środka przewozowego vs środka przewozowego z dodatkowymi elementami, których nie było w obrazie wzorcowym);
- generowanie raport z wykrytymi anomaliami (np. zaznaczone obszary na obrazie);
- obsługę obrazów RTG w formacie *.bmp;
- możliwość wykrywania pod kątem dużych plików (~50 MB każdy), w tym kompresję, przetwarzanie partiami;
- zapewnienie skalowalności dla większych zbiorów danych w przyszłości.

## 4. Wymagania formalne
Projekt przesyłany do oceny musi zawierać:
- szczegółowy opis i tytuł projektu,
- repozytorium kodu,
- prezentację w formacie PDF (maksymalnie 10 slajdów).

Dodatkowo może zawierać:
- zrzuty ekranu,
- linki do demonstracji,
- materiały graficzne lub inne elementy związane z projektem.

## 5. Wymagania techniczne
Model/aplikacja ma być tak przygotowana, aby mogła zostać nauczona na podstawie obrazów wzorcowych w formacie *.bmp, jak wygląda obraz prawidłowy środka transportu (nie zawierający anomalii) – uczestnikom będą udostępnione obrazy w formacie *.bmp do nauki.

## 6. Sposób testowania i/lub walidacji
Przygotowano zestawienie obrazów "czystych" do sprawdzenia działania modelu/aplikacji - zadaniem jest aby model/aplikacja analizując obraz tego rodzaju nie zaznaczała jakichkolwiek miejsc podejrzanych. Jeśli będzie przy okazji sprawdzania takich obrazów wszczynać alarmy będzie liczony poziom alarmów false positive.

Przygotowano również zestawienie obrazów z "dodatkami", które nie są elementami konstrukcyjnymi pojazdu – model/aplikacja analizując obrazy z "dodatkami" powinna wskazywać ich miejsca występowania w obrazie w formie graficznej. Jeśli tego nie zrobi będzie liczony poziom alarmów false negative.

## 7. Dostępne zasoby
Około 200 obrazów RTG środków przewozowych, podzielonych na pary/grupy do porównań (np. "przed" i "po" załadunku) o charakterystyce:
- format: pliki prezentujące obrazy RTG w formacie *.bmp;
- rozmiar: każdy obraz ~50 MB, łącznie ~10 GB;
- anonimizowane dane symulacyjne (brak wrażliwych informacji);
- czas przetwarzania/analizy jednego obrazu < 1 minuta.

Dane dostępne będą do zgrania z nośnika pendrive bezpośrednio na stoisku KAS. Dane udostępnione w ramach hackathonu (zbiory obrazów RTG) należy traktować jako dane chronione. Zabronione jest ich dalsze udostępnianie, kopiowanie, przekazywanie lub wykorzystywanie w celach innych niż bezpośrednio związane z udziałem w hackathonie.

## 8. Kryteria oceny
Kryteria oceny: zna Szef — poprawki pod nie w fazie 2.

## 9. Dodatkowe uwagi / kontekst wdrożeniowy
Najlepszy model/aplikacja może być poddana szerszym testom w oparciu o dodatkowy materiał przygotowany przez KAS. W przypadku pozytywnej opinii może zostać wdrożony produkcyjnie w KAS we współpracy podmiotami świadczącymi usługi informatyczne na rzecz KAS i zintegrowane z repozytorium obrazów RTG zasilanym z urządzeń RTG firm Nuctech i Multicontrol. Wyniki analizy z wykorzystaniem AI gromadzone będą w repozytorium z przypisaniem w szczególności do miejsca i przedmiotu kontroli.

Docelowo model/aplikacja powinien działać bez połączenia z silnikiem AI/chmurą w intrenecie, przy czym na potrzeby hackathonu możliwe jest korzystanie z narzędzi AI, w tym narzędzi płatnych, do utworzenia kodu modelu/aplikacji.

---
Uwaga od ludzi (próba): zdjęć RTG od KAS nie mamy — zespół przygotowuje własny, sztuczny zbiór (generowane obrazy naczep z „czystym” i „dodatkowym” ładunkiem).
