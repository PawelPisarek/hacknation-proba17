"""Odbiór A1–A14 (zadanie 30): pomocnik skryptu odbior.sh.
manifest-zero: manifest z jednym badanym (czyste auto z zerem miejsc, S3).
raport: składa odbior.md z wyników etapu 1 i 2. Bez wymyślonych liczb: każda linia ma źródło (plik wyniku albo log).
"""
import argparse, json, os, re, datetime, glob


def manifest_zero(a):
    m = json.load(open(a.wej))
    e = dict(plik=a.plik, id=a.plik[:-4], typ_pojazdu="kontener", poziom="mini", klasa="czyste", trudny=False,
             dodatki=[], szer=1024, wys=256)
    m["badane"] = [e]
    json.dump(m, open(a.wyj, "w"), ensure_ascii=False)


def log_ok(sciezka, kod):
    if not os.path.exists(sciezka):
        return None, "brak pliku " + sciezka
    t = open(sciezka, encoding="utf-8", errors="replace").read()
    m = re.findall(r"kod (\d+)", t)
    return (m[-1] == "0" if m else None), t


def raport(a):
    wyj = a.wyj
    wiersze, bledy = {}, []
    ok, tl = log_ok(f"{wyj}/test_lista.log", 0)
    lis = re.findall(r"^LISTA .*$", tl, re.M) if ok is not None else []
    ran = re.search(r"Ran (\d+) tests?", tl)
    zle = re.findall(r"plik='([^']+)'\) \.\.\. (?:FAIL|ERROR)", tl)
    zle_c = [x for x in zle if "cysterna" in x]
    zle_inne = [x for x in zle if "cysterna" not in x]
    ok_a12 = ok or (ok is not None and not zle_inne and "test_A2_A3_A4" in tl)
    wiersze["A1"] = ("zalicza" if ok_a12 else "NIE", f"numery 1…n i kolejność na wynikach v3, auta z wzorcem (test_lista; błędne auta spoza cystern: {len(zle_inne)})")
    lupa_ok, tp = log_ok(f"{wyj}/test_lupa.log", 0)
    if lupa_ok is None:
        wiersze["A1l"] = ("nie sprawdzone", tp.strip().splitlines()[0] if tp.strip() else "brak logu")
    else:
        l = re.search(r"A1 lupa: .*", tp)
        wiersze["A1l"] = ("zalicza" if lupa_ok else "NIE", l.group(0) if l else tp.strip().splitlines()[-2:])
    wiersze["A2"] = ("zalicza" if ok_a12 else "NIE", "kolejność od najmocniejszego miejsca, bez słów poziomu (P79 B; test sprawdza brak pola „slowo”)")
    wiersze["A4"] = ("zalicza" if ok else "NIE", "cysterna bez wzorca: napis „brak wzorca — sprawdź obraz sam”, zero miejsc (test_lista)" + ("" if ok else f"; błędne: {len(zle_c)} aut cysterna — wykryj_v3 nie stosuje progu doboru z zadania 33 (jest tylko w wykryj_v2), cysterna dostaje obcy wzorzec i ramki"))
    # A3: zero
    try:
        r = json.load(open(f"{wyj}/zero/wyniki.json"))["wyniki"][0]
        k = next(iter(r["konfiguracje"].values()))
        n = len(k["miejsca"])
        wiersze["A3"] = ("zalicza" if n == 0 and not r.get("brak_wzorca") else "NIE", f"badany_mini_kontener_zero_00.bmp: miejsc {n}, brak_wzorca={r.get('brak_wzorca')}")
    except Exception as e:
        wiersze["A3"] = ("nie sprawdzone", f"brak wyniku: {e}")
    # A12: czas
    try:
        r = json.load(open(f"{wyj}/duzy/wyniki.json"))["wyniki"]
        t = [x["czas_s"] for x in r]
        wiersze["A12"] = ("zalicza" if max(t) < 60 else "NIE", f"{len(t)} obrazów poziomu pełnego, czas maks. {max(t):.2f} s, śr. {sum(t)/len(t):.2f} s (próg 60 s); pomiar na karcie OMENa; „bez internetu”: usługa nie wywołuje sieci — nie mierzone tu")
    except Exception as e:
        wiersze["A12"] = ("nie sprawdzone", f"brak wyniku: {e}")
    nie = "jeszcze nie ma"
    for k, c in dict(A5="podpowiedź „zwykle tu…” — dane w makiecie R2 (makieta/r2/dane.js), w kodzie usługi i MVP brak",
                     A6="zatwierdź/odrzuć — brak w kodzie (tylko makieta R2)",
                     A7="zmiana rodzaju — brak w kodzie (tylko makieta R2)",
                     A8="partia po kolei, stany, pasek — brak w kodzie (tylko makieta R2)",
                     A9="numer rejestracyjny — brak w kodzie (tylko makieta R2)",
                     A10="następne auto / raport — brak w kodzie (tylko makieta R2)",
                     A11="raport (zapis, pola P18) — brak w kodzie (tylko makieta R2)",
                     A13="zmiana decyzji z listy, „Zapisz i zamknij partię” — brak w kodzie (tylko makieta R2)",
                     A14="MVP na ksefbot.pl z usługą na OMENie — zadanie 21 (Paweł) nie oddane").items():
        wiersze[k] = (nie, c)
    t = ["# Odbiór A1–A14 — wynik uruchomienia",
         f"Czas: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')} (maszyna uruchomienia, `date`); wersja repo: {a.wersja}; metoda v3, konfiguracja zadania 20 bez zmian.", "",
         "| Kryterium | Wynik | Dowód |", "|---|---|---|"]
    for k in ["A1", "A1l", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14"]:
        s, c = wiersze[k]
        t.append(f"| {k.replace('A1l','A1 (lupa)')} | {s} | {c} |")
    if lis:
        t += ["", "Zestawy w teście listy:"] + [f"- `{x}`" for x in lis]
    zal = sum(1 for k, v in wiersze.items() if v[0] == "zalicza")
    nz = [k for k, v in wiersze.items() if v[0] == "NIE"]
    t += ["", f"WYNIK URUCHOMIENIA: zalicza {zal} z {len(wiersze)} pozycji (A1 lupa liczone osobno); NIE: {', '.join(nz) or 'brak'}; „jeszcze nie ma”: {sum(1 for v in wiersze.values() if v[0] == nie)}; testy listy: {'Ran ' + ran.group(1) if ran else '?'}, kod {'0' if ok else 'inny'}."]
    open(a.wyjscie, "w").write("\n".join(t) + "\n")
    print("\n".join(t))


p = argparse.ArgumentParser()
s = p.add_subparsers(dest="c", required=True)
z = s.add_parser("manifest-zero"); z.add_argument("--wej"); z.add_argument("--plik"); z.add_argument("--wyj"); z.set_defaults(f=manifest_zero)
r = s.add_parser("raport"); r.add_argument("--wyj"); r.add_argument("--wersja"); r.add_argument("--wyjscie"); r.set_defaults(f=raport)
a = p.parse_args(); a.f(a)
