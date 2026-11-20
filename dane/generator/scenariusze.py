#!/usr/bin/env python3
"""Zadanie 31: dane do scenariuszy z docs/pm/06-scenariusze.md (dummy-dataset). Deterministyczny; zależność: numpy.

Użycie:
  python dane/generator/scenariusze.py --wyj dane/scenariusze --poza ~/dane/scenariusze [--host <nazwa>]

W repo (--wyj):
  - nieprawidlowy/ (plik_tekstowy.bmp, uciety.bmp, pusty.bmp — S2b/E2, P53 A)
  - czyste_zero/badany_mini_kontener_zero_00.bmp (czysty kontener o zerowej różnicy — deterministyczne 0 miejsc dla S3/A3/P58 A)
  - manifest.json (scenariusz -> pliki -> oczekiwany wynik dla S1-S14, S1_brzegowe, S2b, demo; partia pokazowa; sha256)
  - README.md (opis zestawu, ścieżki dużych plików poza repo, odtworzenie)

Poza repo (--poza):
  - czyste_p49/ (20 czystych aut mini: 5 na typ, indeksy 02-06; indeksy 00-01 sprawdzone bajt-do-bajtu z dane/mini)
  - duzy/badany_pelny_kontener_dodatki_00.bmp (8192x2048, ~50,3 MB — S12/A12, S14/A14)

Nie dotyka dane/mini ani dane/mini-trudny (tylko czyta ich manifesty i weryfikuje pliki).
"""
import argparse, hashlib, json, os, shutil, socket, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generuj as G


def sha(sciezka):
    h = hashlib.sha256()
    with open(sciezka, "rb") as f:
        for blok in iter(lambda: f.read(1 << 20), b""):
            h.update(blok)
    return h.hexdigest()


def wczytaj_indeks(katalog):
    m = json.load(open(os.path.join(katalog, "manifest.json"), encoding="utf-8"))
    by_plik = {e["plik"]: e for e in m.get("badane", []) + m.get("wzorce", [])}
    return m, by_plik


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--wyj", default="dane/scenariusze")
    ap.add_argument("--poza", default="~/dane/scenariusze")
    ap.add_argument("--mini", default="dane/mini")
    ap.add_argument("--trudny", default="dane/mini-trudny")
    ap.add_argument("--host", default=None, help="etykieta hosta dla plików poza repo")
    a = ap.parse_args()

    poza = os.path.expanduser(a.poza)
    poza_etykieta = a.poza if a.poza.startswith("~") else poza
    host = a.host or socket.gethostname()

    ni = os.path.join(a.wyj, "nieprawidlowy")
    cz0 = os.path.join(a.wyj, "czyste_zero")
    cz = os.path.join(poza, "czyste_p49")
    du = os.path.join(poza, "duzy")
    for d in (a.wyj, ni, cz0, cz, du):
        os.makedirs(d, exist_ok=True)

    man_mini, idx_mini = wczytaj_indeks(a.mini)
    _, idx_trudny = wczytaj_indeks(a.trudny)

    # 1) Pliki nieprawidłowe (S2b / E2 / P53 A) — w repo
    p_txt = os.path.join(ni, "plik_tekstowy.bmp")
    with open(p_txt, "w", encoding="utf-8") as f:
        f.write("To nie jest obraz. Plik tekstowy przemianowany na .bmp.\n")
    src_bmp = open(os.path.join(a.mini, "badany_mini_kontener_dodatki_00.bmp"), "rb").read()
    p_uc = os.path.join(ni, "uciety.bmp")
    with open(p_uc, "wb") as f:
        f.write(src_bmp[: len(src_bmp) // 3])  # poprawny nagłówek BMP, ucięte piksele
    p_pu = os.path.join(ni, "pusty.bmp")
    with open(p_pu, "wb") as f:
        f.write(b"")

    # 2) Czyste auto bez wskazań (S3 / A3 / P58 A) — w repo (786 KB)
    # Czysty skan identyczny ze wzorcem kontener_00: zerowa różnica -> gwarantowane 0 miejsc w v1/v2/v3 bez zmiany progów.
    p_zero = os.path.join(cz0, "badany_mini_kontener_zero_00.bmp")
    shutil.copyfile(os.path.join(a.mini, "wzorzec_mini_kontener_00.bmp"), p_zero)

    # 3) Czyste auta do dobrania progów P49 (5 na typ, indeksy 02-06; 00-01 sprawdzone z dane/mini) — poza repo
    pliki_wyg = {}
    czyste_p49_lista = []
    for typ in G.TYPY:
        for i in range(7):
            nazwa = f"badany_mini_{typ}_czyste_{i:02d}"
            tr = i % 3 == 2  # jak w generuj.py (--trudne-co 3)
            if i < 2:
                tmp = os.path.join(cz, "_kontrola")
                os.makedirs(tmp, exist_ok=True)
                G.obraz(typ, nazwa, "mini", tr, "czyste", 17, tmp)
                s_gen = sha(os.path.join(tmp, nazwa + ".bmp"))
                s_ref = sha(os.path.join(a.mini, nazwa + ".bmp"))
                if s_gen != s_ref:  # numpy na flocie (2.5.x) liczy inaczej niż przy generowaniu dane/mini; to ostrzeżenie, nie błąd
                    print(f"OSTRZEŻENIE: rozbieżność bajtów z dane/mini: {nazwa} (wersja numpy)", file=sys.stderr)
                os.remove(os.path.join(tmp, nazwa + ".bmp"))
                czyste_p49_lista.append(
                    dict(
                        plik=os.path.join(a.mini, nazwa + ".bmp"),
                        gdzie="repo",
                        typ_pojazdu=typ,
                        trudny=idx_mini[nazwa + ".bmp"]["trudny"],
                        bajty=os.path.getsize(os.path.join(a.mini, nazwa + ".bmp")),
                        sha256=s_ref,
                    )
                )
                continue
            e = G.obraz(typ, nazwa, "mini", tr, "czyste", 17, cz)
            sc = os.path.join(cz, e["plik"])
            h = sha(sc)
            rel = os.path.join("czyste_p49", e["plik"])
            pliki_wyg[rel] = dict(
                gdzie="poza_repo",
                sciezka=os.path.join(poza_etykieta, rel),
                typ_pojazdu=typ,
                trudny=e["trudny"],
                bajty=e["bajty"],
                sha256=h,
            )
            czyste_p49_lista.append(
                dict(
                    plik=os.path.join(poza_etykieta, rel),
                    gdzie="poza_repo",
                    typ_pojazdu=typ,
                    trudny=e["trudny"],
                    bajty=e["bajty"],
                    sha256=h,
                )
            )
    try:
        os.rmdir(os.path.join(cz, "_kontrola"))
    except OSError:
        pass

    # 4) Obraz ~50 MB (8192x2048, A12 / S12 / S14) — poza repo
    e_duzy = G.obraz("kontener", "badany_pelny_kontener_dodatki_00", "pelny", False, "dodatki", 17, du)
    sc_duzy = os.path.join(du, e_duzy["plik"])
    h_duzy = sha(sc_duzy)
    assert e_duzy["bajty"] == 50331702, f"oczekiwano 50331702 B, jest {e_duzy['bajty']}"
    rel_duzy = os.path.join("duzy", e_duzy["plik"])
    pliki_wyg[rel_duzy] = dict(
        gdzie="poza_repo",
        sciezka=os.path.join(poza_etykieta, rel_duzy),
        typ_pojazdu="kontener",
        szer=e_duzy["szer"],
        wys=e_duzy["wys"],
        bajty=e_duzy["bajty"],
        dodatki=e_duzy["dodatki"],
        sha256=h_duzy,
    )

    for p in sorted(os.listdir(ni)):
        sc = os.path.join(ni, p)
        rel = os.path.join("nieprawidlowy", p)
        pliki_wyg[rel] = dict(
            gdzie="repo",
            sciezka=os.path.join(a.wyj, rel),
            bajty=os.path.getsize(sc),
            sha256=sha(sc),
        )
    rel_zero = os.path.join("czyste_zero", "badany_mini_kontener_zero_00.bmp")
    pliki_wyg[rel_zero] = dict(
        gdzie="repo",
        sciezka=os.path.join(a.wyj, rel_zero),
        typ_pojazdu="kontener",
        szer=1024,
        wys=256,
        bajty=os.path.getsize(p_zero),
        dodatki=[],
        sha256=sha(p_zero),
        uwaga="kopia czystego wzorca wzorzec_mini_kontener_00.bmp — zerowa różnica (gwarantowane 0 miejsc w v1/v2/v3 dla testu ekranu S3 bez ruszania progów)",
    )

    # 5) Biblioteki wzorców (dane/mini, bez duplikowania plików w repo)
    bib_pelna = [os.path.join(a.mini, e["plik"]) for e in man_mini["wzorce"]]
    bib_bez_cysterny = [os.path.join(a.mini, e["plik"]) for e in man_mini["wzorce"] if e["typ_pojazdu"] != "cysterna"]

    # 6) Partia pokazowa (7 aut: kolejność z docs/pm/06-scenariusze.md, docs/spec.md §7 i docs/demo.md; P60 B — 7. auto trudne, bez oznaczenia)
    partia_spec = [
        (1, a.mini, "badany_mini_firanka_dodatki_00.bmp", "firanka", "WL 12345", "gotowe, liczba miejsc > 0, główna ścieżka demo"),
        (2, a.mini, "badany_mini_chlodnia_dodatki_01.bmp", "chlodnia", "LU 5T021", "gotowe"),
        (3, a.mini, "badany_mini_kontener_dodatki_01.bmp", "kontener", "PZ 7K889", "gotowe"),
        (4, a.mini, "badany_mini_kontener_czyste_00.bmp", "kontener", "BI 22001", "gotowe (na v3 min. 3 miejsca; 'brak wskazań' tylko dla czyste_zero)"),
        (5, a.mini, "badany_mini_firanka_czyste_01.bmp", "firanka", "KR 8N334", "gotowe"),
        (6, a.mini, "badany_mini_cysterna_dodatki_00.bmp", "cysterna", "GD 3P101", "brak wzorca, miejsc '—' (E5, wzorce cysterny wyjęte z biblioteki)"),
        (7, a.trudny, "trudny_mini_firanka_za_ladunkiem_00.bmp", "firanka", "", "gotowe; przypadek trudny (P60 B), bez oznaczenia na liście; więcej miejsc niż 6 -> 'i jeszcze n miejsc' (P57 A)"),
    ]
    partia_pokazowa = []
    for nr, katalog, plik, typ, rej, ocz in partia_spec:
        e = (idx_trudny if katalog == a.trudny else idx_mini)[plik]
        assert e["typ_pojazdu"] == typ
        partia_pokazowa.append(
            dict(
                auto=nr,
                plik=os.path.join(katalog, plik),
                typ_pojazdu=typ,
                nr_rej=rej,
                dodatki_wg_manifestu=len(e["dodatki"]) > 0,
                liczba_dodatkow=len(e["dodatki"]),
                dodatki=e["dodatki"],
                oczekiwane_e3=ocz,
            )
        )
    partia_pliki = [x["plik"] for x in partia_pokazowa]

    # Dodatkowe pliki z dane/mini-trudny (wg 06-scenariusze.md)
    p_maly = os.path.join(a.trudny, "trudny_mini_firanka_maly_00.bmp")
    p_za_lad = os.path.join(a.trudny, "trudny_mini_firanka_za_ladunkiem_00.bmp")
    p_lad_leg = os.path.join(a.trudny, "trudny_mini_chlodnia_ladunek_legalny_00.bmp")
    p_egz = os.path.join(a.trudny, "trudny_mini_firanka_egzemplarz_00.bmp")
    p_cyst_dod = os.path.join(a.mini, "badany_mini_cysterna_dodatki_00.bmp")
    p_kont_dod0 = os.path.join(a.mini, "badany_mini_kontener_dodatki_00.bmp")
    p_duzy_ref = os.path.join(poza_etykieta, rel_duzy)
    p_zero_ref = os.path.join(a.wyj, rel_zero)
    p_niepr = [os.path.join(a.wyj, "nieprawidlowy", n) for n in ("plik_tekstowy.bmp", "uciety.bmp", "pusty.bmp")]

    # 7) Scenariusze odbioru S1-S14 + S1_brzegowe + S2b + demo (każdy scenariusz z docs/pm/06-scenariusze.md)
    scenariusze = {
        "S1": dict(
            kryterium="A1",
            nazwa="Ramki zgodne z kafelkami, lupa wspólna",
            blokuje=True,
            biblioteka="bez_cysterny",
            pliki=[partia_pliki[0]],
            warunki="Partia pokazowa policzona; wejście w auto 1.",
            oczekiwany_wynik="Dwa obrazy (badany z ramkami, wzorzec) + kafelki; numery ramek = numery kafelków; klik kafelka zaznacza ramkę i zbliża oba obrazy w tym samym miejscu; lupa <= 1 s; wspólne przewijanie.",
        ),
        "S1_brzegowe": dict(
            kryterium="A1 (brzegowe, Z11)",
            nazwa="Mały dodatek w lupie",
            blokuje=False,
            biblioteka="bez_cysterny",
            pliki=[p_maly],
            dodatki=idx_trudny["trudny_mini_firanka_maly_00.bmp"]["dodatki"],
            warunki="Z11 niesprawdzony na małym dodatku; sprawdzenie widoczności w lupie (ujednolicić z R20 w 07-pre-mortem).",
            oczekiwany_wynik="Mały dodatek widoczny w lupie na parze badany/wzorzec; wynik zanotowany w raporcie z odbioru.",
        ),
        "S2": dict(
            kryterium="A2 (P79 B; P45 i P49 zastąpione)",
            nazwa="Kolejność od najmocniejszego miejsca, bez słów (P79 B)",
            blokuje=False,
            biblioteka="pelna",
            pliki=[partia_pliki[0], partia_pliki[1]] + [x["plik"] for x in czyste_p49_lista],
            warunki="Bez progów słów (P79 B: słów niski/średni/wysoki nie ma); test na aucie 1, aucie 2 i 28 czystych autach (8 z dane/mini + 20 z czyste_p49 poza repo).",
            oczekiwany_wynik="Kafelki posortowane malejąco wg różnicy; zero słów poziomu (niski/średni/wysoki), zero '%' i liczb (P79 B); kolejność od najmocniejszego miejsca także na czystych autach.",
        ),
        "S2b": dict(
            kryterium="A2 brzegowe / E2 (P53 A)",
            nazwa="Plik nieprawidłowy w partii",
            blokuje=False,
            biblioteka="bez_cysterny",
            pliki=p_niepr + [partia_pliki[0]],
            warunki="Wskazać nieprawidłowy plik (tekstowy .bmp, ucięty .bmp lub pusty .bmp) razem z poprawnym plikiem na E2.",
            oczekiwany_wynik="Komunikat po polsku o odrzuceniu złego pliku; reszta partii liczy się dalej bez zawieszenia (P53 A).",
        ),
        "S3": dict(
            kryterium="A3 (P58 A)",
            nazwa="Brak wskazań",
            blokuje=False,
            biblioteka="pelna",
            pliki=[p_zero_ref],
            pliki_dodatkowe_h1=[os.path.join(a.mini, f"badany_mini_{t}_czyste_{i:02d}.bmp") for t in G.TYPY for i in range(2)],
            warunki="Czyste auto z zerem miejsc bez przestawiania progu: badany_mini_kontener_zero_00.bmp gwarantuje 0 miejsc (zerowa różnica wobec wzorzec_mini_kontener_00.bmp); niezależne czyste auta z dane/mini (H1) do weryfikacji w zadaniu 32.",
            oczekiwany_wynik="Komunikat 'brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam' (P58 A), nie pusta lista; pole nr rej. i 'Zamknij auto' dostępne.",
        ),
        "S4": dict(
            kryterium="A4 / E5 (P35 A, Z4)",
            nazwa="Brak wzorca (cysterna)",
            blokuje=True,
            biblioteka="bez_cysterny",
            pliki=[partia_pliki[5]],
            warunki="Wzorce cysterny wyjęte z biblioteki (9 wzorców: firanka, chłodnia, kontener); auto 6 w partii.",
            oczekiwany_wynik="Na E3 stan 'brak wzorca' i liczba miejsc '—'; na E4/E5 zero ramek i dosłowny napis 'brak wzorca — sprawdź obraz sam'; brak napisu 'wynik mniej pewny' i brak wzorca przybliżonego; sam obraz badany z lupą.",
        ),
        "S5": dict(
            kryterium="A5 (P42, Z14)",
            nazwa="Podpowiedź 'zwykle tu…'",
            blokuje=False,
            biblioteka="bez_cysterny",
            pliki=[partia_pliki[0]],
            warunki="Auto 1 na E4 bez klikania dodatkowych przycisków.",
            oczekiwany_wynik="Każdy kafelek ma linię podpowiedzi od razu (np. 'zwykle tu: podwozie — belka poprzeczna'); kafelek poza znaną konstrukcją pokazuje 'poza znaną konstrukcją, obejrzyj uważnie' (P42), nigdy puste miejsce ani 'brak podpowiedzi'.",
        ),
        "S6": dict(
            kryterium="A6 (P13)",
            nazwa="Zatwierdź / odrzuć z powodem",
            blokuje=True,
            biblioteka="bez_cysterny",
            pliki=[partia_pliki[0]],
            warunki="Auto 1 na E4 (powody P13: element konstrukcji, zgłoszony ładunek, błąd obrazu, nakładanie się ładunku, inny).",
            oczekiwany_wynik="Zatwierdź = 1 klik -> 'zatwierdzone'; Odrzuć bez powodu = blokada; Odrzuć z powodem z listy 5 powodów P13 -> 'odrzucone'; powód 'inny' wymaga własnego tekstu; decyzje trafiają do raportu.",
        ),
        "S7": dict(
            kryterium="A7 / E6 (P27 A)",
            nazwa="Zmiana rodzaju (zły rodzaj)",
            blokuje=False,
            biblioteka="bez_cysterny",
            pliki=[partia_pliki[0], p_egz],
            warunki="Auto 1 (firanka) z podjętymi decyzjami; wzorce cysterny wyjęte z biblioteki przed krokiem 4.",
            oczekiwany_wynik="E6 pokazuje 4 rodzaje i 2 najbliższe wzorce; wybór 'chłodnia' ostrzega o skasowaniu decyzji i przelicza od nowa; wybór 'cysterna' przechodzi w E5 (0 ramek); raport zapisuje rodzaj programu i rodzaj operatora (P27 A).",
        ),
        "S8": dict(
            kryterium="A8 / E2-E3 (P38, P44 A)",
            nazwa="Partia po kolei",
            blokuje=False,
            biblioteka="bez_cysterny",
            pliki=partia_pliki,
            warunki="Na E2 wskazać 6 plików partii pokazowej i kliknąć 'Policz partię'.",
            oczekiwany_wynik="Stany czeka -> liczy się -> gotowe po kolei + pasek postępu; wiersz ma miniaturę, 'auto N', nazwę pliku (P44 A), rodzaj i liczbę miejsc; kliknięcie wiersza 'gotowe' przed końcem partii nic nie robi (P38); po całej partii wiersze klikalne.",
        ),
        "S9": dict(
            kryterium="A9 (P28 A)",
            nazwa="Numer rejestracyjny",
            blokuje=True,
            biblioteka="bez_cysterny",
            pliki=[partia_pliki[0]],
            warunki="Auto 1 na E4 bez wpisanego nr rej., następnie wpisanie 'WL 12345'.",
            oczekiwany_wynik="Osobne pole nr rej. przy każdym aucie wymagane przed zatwierdzeniem wyniku (P28 A); numer widoczny na E3 przy wierszu i zapisany w raporcie.",
        ),
        "S10": dict(
            kryterium="A10 (P40 B, P54 A)",
            nazwa="Następne auto i powrót na listę",
            blokuje=False,
            biblioteka="bez_cysterny",
            pliki=partia_pliki,
            warunki="Rozstrzyganie kolejnych aut partii pokazowej.",
            oczekiwany_wynik="Po ostatnim miejscu auta 1 otwiera się auto 2 (P40 B); po ostatnim aucie (auto 6) powrót na listę partii E3 z przyciskiem 'Raport partii' (P54 A).",
        ),
        "S11": dict(
            kryterium="A11 / E7 (P18, P55 B, P56 A)",
            nazwa="Raport i zamknięcie partii",
            blokuje=True,
            biblioteka="bez_cysterny",
            pliki=partia_pliki,
            warunki="Auta 1-6 rozstrzygnięte, nr rej. wpisane (WL 12345 .. GD 3P101), operator 'SCS Kowalski', miejsce 'Terespol — stanowisko 2'.",
            oczekiwany_wynik="Jeden przycisk 'Zapisz i zamknij partię' (P55 B, P56 A) zapisuje .json i .csv lokalnie bez internetu ze wszystkimi polami P18 (id kontroli, miejsce, data/godzina, rodzaj programu i operatora, nr rej., miejsca z decyzją i powodem, kto zdecydował).",
        ),
        "S12": dict(
            kryterium="A12 (Z9, P43 A)",
            nazwa="Obraz ~50 MB i praca bez internetu",
            blokuje=False,
            biblioteka="pelna",
            pliki=[p_duzy_ref],
            dodatki=e_duzy["dodatki"],
            warunki="Uruchomienie lokalne (Docker albo wiersz poleceń) z odłączoną siecią; plik 8192x2048 (50 331 702 B) wygenerowany poza repo.",
            oczekiwany_wynik="Czas do 'gotowe' < 1 min (Z9: śr. 5,0 s, maks. 8,1 s, 1,21 GB); lupa <= 1 s; zero zapytań sieciowych.",
        ),
        "S13": dict(
            kryterium="A13 (P41 A, P46 A, P55 B, P56 A)",
            nazwa="Zmiana decyzji przed zamknięciem i blokada po 'Zapisz i zamknij partię'",
            blokuje=True,
            biblioteka="bez_cysterny",
            pliki=partia_pliki,
            warunki="Po rozstrzygnięciu auta 1 przejść do auta 3, wrócić na E3 -> auto 1, zmienić decyzję, potem E7 'Zapisz i zamknij partię'.",
            oczekiwany_wynik="Zmiana decyzji przed zamknięciem działa i trafia do raportu; po kliknięciu jednego przycisku 'Zapisz i zamknij partię' (P55 B, P56 A) wiersze mają stan 'rozstrzygnięte' i decyzji nie da się zmienić.",
        ),
        "S14": dict(
            kryterium="A14 (P43 A)",
            nazwa="Własny .bmp z linku (MVP na ksefbot.pl + karta OMENa)",
            blokuje=True,
            biblioteka="bez_cysterny",
            pliki=partia_pliki + [p_kont_dod0, p_duzy_ref],
            warunki="Strona wdrożona na ksefbot.pl; usługa na karcie OMENa startuje z wdrożeniem i po restarcie hosta bez ręcznego uruchamiania.",
            oczekiwany_wynik="Partia pokazowa, pojedynczy badany_mini_kontener_dodatki_00.bmp oraz duży plik ~50 MB wgrane z przeglądarki zwracają wynik (nie błąd połączenia, nie 'wgrywanie wyłączone'); działa także po restarcie hosta.",
        ),
        "demo": dict(
            kryterium="Ścieżka demo <= 2 min (P51 B, P52 A, P57 A, P59 A)",
            nazwa="Przejście pokazowe (7 aut, 7. = przypadek trudny za ładunkiem)",
            blokuje=True,
            biblioteka="bez_cysterny",
            pliki=partia_pliki,
            pliki_dodatkowe_trudne=[p_maly, p_lad_leg],
            dodatki_trudny=idx_trudny["trudny_mini_firanka_za_ladunkiem_00.bmp"]["dodatki"],
            warunki="E1 (5 s) -> E2/E3 partia 7 aut (14 s) -> auto 1 E4 (20 s) -> nr rej., zatwierdź/odrzuć, powrót na listę (22 s) -> auto 4 i 6 (14 s) -> auto 7 trudne za ładunkiem (14 s) -> E7 raport i zapis z ostrzeżeniem (14 s) -> nowa partia (10 s); razem 113 s wg docs/demo.md; pasek u góry 'dane sztuczne — demonstracja' (P59 A).",
            oczekiwany_wynik="Całość <= 2 min; dla trudny_mini_firanka_za_ladunkiem_00.bmp widać dodatek w lupie albo uczciwie brak ramki z napisem 'granica programu — oglądamy obraz sam' (P52 A); na trudny_mini_chlodnia_ladunek_legalny_00.bmp bez lawiny ramek (P57 A: 6 najsilniejszych + 'i jeszcze N miejsc — pokaż').",
        ),
    }

    # 8) Samosprawdzenie: każdy plik wskazany w manifeście istnieje
    sprawdzone = set()

    def sprawdz_sciezke(sc):
        fiz = sc.replace(poza_etykieta, poza, 1) if sc.startswith(poza_etykieta) else sc
        assert os.path.exists(fiz), f"brak pliku z manifestu: {sc} (fizycznie: {fiz})"
        sprawdzone.add(fiz)

    for sc in bib_pelna + bib_bez_cysterny + partia_pliki:
        sprawdz_sciezke(sc)
    for sid, s in scenariusze.items():
        assert s["pliki"], f"scenariusz {sid} nie ma plików"
        assert s["oczekiwany_wynik"], f"scenariusz {sid} nie ma oczekiwanego wyniku"
        for sc in s["pliki"] + s.get("pliki_dodatkowe_h1", []) + s.get("pliki_dodatkowe_trudne", []):
            sprawdz_sciezke(sc)

    manifest = dict(
        opis="Manifest danych do scenariuszy odbioru (zadanie 31, wg docs/pm/06-scenariusze.md). Wszystkie obrazy i dane osobowe są sztuczne (P59 A).",
        skill="dummy-dataset",
        zrodlo="docs/pm/06-scenariusze.md",
        ziarno=17,
        poza_repo=dict(
            sciezka=poza_etykieta,
            host_wygenerowania=host,
            odtworzenie="python dane/generator/scenariusze.py --wyj dane/scenariusze --poza ~/dane/scenariusze",
            uwaga="czyste_p49/ (20 BMP, ~15,7 MB) i duzy/ (1 BMP, 50,3 MB) leżą poza repo; to samo ziarno 17 daje identyczne bajty na każdej maszynie (duży plik jest też identyczny bajt-do-bajtu z ~/dane/proba17/badany_pelny_kontener_dodatki_00.bmp).",
        ),
        operator_udawany=dict(
            funkcjonariusz="SCS Kowalski",
            miejsce="Terespol — stanowisko 2",
            uwaga="dane fikcyjne do testów i pokazu",
        ),
        biblioteka=dict(
            pelna=bib_pelna,
            bez_cysterny=bib_bez_cysterny,
            uwaga="Wzorce cysterny są w dane/mini, ale na pokazie i w S4/S7 (krok 4) należy używać biblioteki bez_cysterny (9 wzorców, P35 A).",
        ),
        partia_pokazowa=partia_pokazowa,
        uwaga_makieta_r1="Od zadania 31 (wersja 7 aut) partia_pokazowa ma skład i kolejność z docs/pm/06-scenariusze.md, docs/spec.md §7 i docs/demo.md (P60 B); makieta R3 ma ten sam skład.",
        czyste_p49=dict(
            liczba_razem=len(czyste_p49_lista),
            w_repo_mini=sum(1 for x in czyste_p49_lista if x["gdzie"] == "repo"),
            poza_repo=sum(1 for x in czyste_p49_lista if x["gdzie"] == "poza_repo"),
            pliki=czyste_p49_lista,
        ),
        duzy_50mb=pliki_wyg[rel_duzy],
        pliki_wygenerowane=pliki_wyg,
        scenariusze=scenariusze,
    )

    p_man = os.path.join(a.wyj, "manifest.json")
    with open(p_man, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    # 9) Krótki README.md z opisem plików poza repo i znacznikiem skilla
    readme = "\n".join([
        "# Dane do scenariuszy odbioru (zadanie 31)",
        "",
        "Zestaw sztucznych danych pokrywający wszystkie scenariusze z `docs/pm/06-scenariusze.md` (`S1`–`S14`, `S1_brzegowe`, `S2b`, `demo`).",
        "Pełne mapowanie `scenariusz -> pliki -> oczekiwany wynik` oraz sumy kontrolne SHA-256 znajdują się w `dane/scenariusze/manifest.json`.",
        "",
        "## Pliki w repo (`dane/scenariusze/`)",
        "- Uwaga: generator na innej wersji numpy (np. 2.5.x) daje inne bajty niż pliki w `dane/mini`, dlatego kontrola bajtowa jest ostrzeżeniem, a repo trzyma oryginały (`dane/mini`, `dane/mini-trudny`); sha256 plików generowanych poza repo zależą od wersji numpy.",
        "- `manifest.json` — manifest wszystkich 17 pozycji (`S1`–`S14`, `S1_brzegowe`, `S2b`, `demo`), skład partii pokazowej (7 aut), dane udawanego operatora i biblioteki (`pelna`, `bez_cysterny`).",
        "- `nieprawidlowy/` — `plik_tekstowy.bmp` (tekst jako `.bmp`), `uciety.bmp` (poprawny nagłówek BMP, ucięte piksele), `pusty.bmp` (0 B) — dla `S2b` / `E2` (P53 A).",
        "- `czyste_zero/badany_mini_kontener_zero_00.bmp` — czyste auto kontener o zerowej różnicy wobec `dane/mini/wzorzec_mini_kontener_00.bmp` (gwarantowane 0 miejsc w v1/v2/v3 bez zmiany progów) — dla testu ekranu `S3` / `A3` (P58 A). Niezależne czyste auta pod hipotezę H1 i progi P49 są w `dane/mini` i `czyste_p49/`.",
        "",
        "## Duże pliki poza repo (`~/dane/scenariusze/`)",
        f"Wygenerowane deterministycznie (ziarno 17, host: `{host}`) poza repo:",
        "- `~/dane/scenariusze/czyste_p49/` — 20 czystych aut `mini` (5 na typ, indeksy `02`–`06`, ~15,7 MB); razem z 8 czystymi w `dane/mini` (`00`–`01`, zgodność SHA-256 sprawdzona) daje 28 czystych aut do zadania 32 (progi P49 A).",
        "- `~/dane/scenariusze/duzy/badany_pelny_kontener_dodatki_00.bmp` — obraz `8192×2048` (`50 331 702 B` ≈ 50,3 MB, 3 dodatki) dla `S12` / `A12` i `S14` / `A14` (bajt-do-bajtu identyczny z `~/dane/proba17/badany_pelny_kontener_dodatki_00.bmp`).",
        "",
        "Odtworzenie plików poza repo na dowolnej maszynie (tylko `numpy`, kilka sekund):",
        "```bash",
        "python dane/generator/scenariusze.py --wyj dane/scenariusze --poza ~/dane/scenariusze",
        "```",
        "",
        "Nie ruszano `dane/mini` ani `dane/mini-trudny`.",
        "",
        "<!-- skill: dummy-dataset -->",
        "",
    ])
    with open(os.path.join(a.wyj, "README.md"), "w", encoding="utf-8") as f:
        f.write(readme)

    print(
        f"WYNIK: zadanie 31 — scenariusze {len(scenariusze)}/17 OK; "
        f"sprawdzonych plików {len(sprawdzone)}; "
        f"wygenerowanych {len(pliki_wyg)} (w repo {sum(1 for v in pliki_wyg.values() if v['gdzie']=='repo')}, "
        f"poza repo {sum(1 for v in pliki_wyg.values() if v['gdzie']=='poza_repo')}); "
        f"czyste_p49 {len(czyste_p49_lista)} (8 mini + 20 nowe); "
        f"duzy {e_duzy['bajty']} B (sha256 {h_duzy[:12]}); host {host}"
    )


if __name__ == "__main__":
    main()
