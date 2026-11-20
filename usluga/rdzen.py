"""Rdzeń usługi (zadanie 21): biblioteki wzorców, wybór biblioteki dla obrazu, jedno liczenie -> odpowiedź API.

Torch i przeswit importowane leniwie — testy rdzenia chodzą bez karty i bez torcha.
"""
import json, os, time

KORZEN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_d = lambda p: os.path.join(KORZEN, p)

# Najlepsza wg Programisty (zad. 20 i 33, decyzje 13:39/13:46): v3 + próg doboru sr:0.80 (brak wzorca, P35).
METODA = "v3"
SIATKA = "trend=1;tolx=2;rho=0.1;konstr=1;min_pole=0.0001;lok=2;jas=1;wyb=1;tau_pud=0.08;tau_pod=0.2;tau_kab=0.2;scal=0.01"
SZER_ROB = 2048
PROG_DOBORU = ("sr", 0.80)
BRAK_WZORCA = "brak wzorca — sprawdź obraz sam"
SZER_MINI = 1024

# spec §3: cysterna bez wzorca na pokazie (E5, P35) -> wzorce cysterny poza biblioteką
BIBLIOTEKI_DOMYSLNE = {
    "mini": {"katalog": _d("dane/mini"), "manifest": _d("dane/mini/manifest.json"), "poziom": "mini", "bez_typu": ["cysterna"]},
    "mini-trudny": {"katalog": _d("dane/mini-trudny"), "manifest": _d("dane/mini-trudny/manifest.json"), "poziom": "mini",
                    "bez_typu": ["cysterna"]},
    "maly": {"katalog": os.path.expanduser("~/dane/proba17"), "manifest": os.path.expanduser("~/dane/proba17/manifest.json"),
             "poziom": "maly", "bez_typu": ["cysterna"]},
}


def wpisy_biblioteki(opis):
    """(id, typ, ścieżka) wzorców z manifestu: filtr poziomu i bez_typu; brak katalogu/manifestu -> []."""
    try:
        with open(opis["manifest"]) as f:
            man = json.load(f)
    except (OSError, ValueError):
        return []
    bez = set(opis.get("bez_typu", []))
    out = []
    for e in man.get("wzorce", []):
        if e.get("poziom") != opis["poziom"] or e.get("typ_pojazdu") in bez:
            continue
        p = os.path.join(opis["katalog"], e["plik"])
        if os.path.exists(p):
            out.append((e["id"], e["typ_pojazdu"], p))
    return out


def wczytaj_biblioteki(opisy, szer_rob, fabryka=None):
    """{nazwa: Biblioteka} dla niepustych opisów; fabryka(wpisy, szer_rob) — domyślnie przeswit.wykryj.Biblioteka."""
    if fabryka is None:
        from przeswit.wykryj import Biblioteka as fabryka
    out = {}
    for nazwa, opis in opisy.items():
        w = wpisy_biblioteki(opis)
        if w:
            out[nazwa] = fabryka(w, szer_rob)
    return out


def wybierz(szer, biblioteki, nazwa=None):
    """(nazwa_biblioteki, uwaga|None): jawna wygrywa; mini dla obrazów <= 1024 px; pełne -> maly, bez niego mini."""
    if nazwa:
        return nazwa, None
    if szer <= SZER_MINI:
        return "mini", None
    if "maly" in biblioteki:
        return "maly", None
    return "mini", "brak wzorców pełnej rozdzielczości — liczone na mini"


def detektor_dla(metoda):
    if metoda == "v3":
        from przeswit.wykryj3 import wykryj_v3
        return wykryj_v3
    if metoda == "v2":
        from przeswit.wykryj2 import wykryj_v2
        return lambda s, b, k, tp=None, tw=None, pd=None: wykryj_v2(s, b, k, tp, tw, pd)
    from przeswit.wykryj import wykryj
    return lambda sciezka, bib, konf, typ_prawda=None, typ_wymuszony=None: wykryj(sciezka, bib, konf, typ_prawda)


def brak_wzorca_v3(sciezka, bib, prog):
    """Zad. 33 dla v3 (CLI liczy próg tylko w v2): ten sam dobór co v2 na 512 px, próg jakości -> True = brak wzorca."""
    from przeswit.bmp import wczytaj_szarosc
    from przeswit.wykryj import tlumienie, zmniejsz, SZER_DOBOR
    from przeswit.wykryj2 import dobierz, brak_wzorca
    dop, _ = dobierz(zmniejsz(tlumienie(wczytaj_szarosc(sciezka)), SZER_DOBOR), bib)
    return brak_wzorca(dop, prog)


def rozmiar_bmp(sciezka):
    """(szer, wys) z nagłówka BMP — bez czytania pikseli; zły plik -> (None, None)."""
    try:
        with open(sciezka, "rb") as f:
            h = f.read(26)
        return int.from_bytes(h[18:22], "little", signed=True), abs(int.from_bytes(h[22:26], "little", signed=True))
    except (OSError, IndexError):
        return None, None


def widok(r):
    """Zad. 40: pola dla widoku auta na stronie (lupa — położenie wzorca w pikselach obrazu; zad. 27 — 2 najbliższe
    wzorce z doboru). Tylko przepisanie z wyniku detektora, metoda bez zmian."""
    out = {}
    if r.get("polozenie_wzorcow"):
        out["polozenie_wzorcow"] = r["polozenie_wzorcow"]
    if r.get("dobor"):
        out["dobor"] = [dict(id=d["id"], typ=d.get("typ"), wynik=round(float(d.get("wynik", 0)), 4), s=d.get("s"),
                             dx=d.get("dx"), dy=d.get("dy")) for d in r["dobor"]]
    return out


PODGLAD_SZER = 2048


def podglad_bmp(sciezka, szer_maks=PODGLAD_SZER):
    """Zad. 40: obraz do pokazania w przeglądarce — 8-bit szary BMP, szerokość <= szer_maks (co n-ty piksel).
    Ramki są w ułamkach obrazu, więc pomniejszenie ich nie przesuwa."""
    import numpy as np
    from przeswit.bmp import wczytaj_szarosc
    w, _ = rozmiar_bmp(sciezka)
    krok = max(1, -(-int(w or 1) // szer_maks))
    return bmp_szary(wczytaj_szarosc(sciezka, krok=krok))


def bmp_szary(g):
    """uint8 (H, W) -> bajty BMP 8-bit z paletą szarości (wiersze od dołu, wyrównane do 4 B)."""
    import numpy as np
    h, w = g.shape
    row = (w + 3) // 4 * 4
    px = np.zeros((h, row), np.uint8)
    px[:, :w] = g[::-1]
    paleta = np.repeat(np.arange(256, dtype=np.uint8), 4).reshape(256, 4)
    paleta[:, 3] = 0
    off = 14 + 40 + 1024
    rozm = off + px.size
    nag = (b"BM" + rozm.to_bytes(4, "little") + b"\0\0\0\0" + off.to_bytes(4, "little")
           + (40).to_bytes(4, "little") + w.to_bytes(4, "little") + h.to_bytes(4, "little", signed=True)
           + (1).to_bytes(2, "little") + (8).to_bytes(2, "little") + b"\0" * 4 + px.size.to_bytes(4, "little")
           + (2835).to_bytes(4, "little") * 2 + (256).to_bytes(4, "little") + b"\0" * 4)
    return nag + paleta.tobytes() + px.tobytes()


def analizuj(sciezka, bib, metoda, konf, typ=None, detektor=None, prog_doboru=None, ocena_doboru=None):
    """Jedno liczenie -> {plik, szer, wys, rodzaj, wzorce, miejsca[{nr,x0,y0,x1,y1,roznica}], czas_s, brak_wzorca, napis?}.
    prog_doboru (miara, próg): poniżej — nic nie zaznaczamy (P35). Rodzaj podany przez operatora (typ) pomija próg."""
    det = detektor or detektor_dla(metoda)
    if metoda == "v3" and prog_doboru and not typ:
        t0 = time.perf_counter()
        if (ocena_doboru or brak_wzorca_v3)(sciezka, bib, prog_doboru):
            szer, wys = rozmiar_bmp(sciezka)
            return dict(plik=os.path.basename(sciezka), szer=szer, wys=wys, rodzaj=None, wzorce=[], miejsca=[],
                        czas_s=round(time.perf_counter() - t0, 3), brak_wzorca=True, napis=BRAK_WZORCA)
    r = det(sciezka, bib, [konf], None, typ, prog_doboru) if metoda == "v2" else det(sciezka, bib, [konf], None, typ)
    k = r["konfiguracje"][konf["nazwa"]]
    if r.get("brak_wzorca"):
        return dict(plik=r["plik"], szer=r.get("szer"), wys=r.get("wys"), rodzaj=None, wzorce=[], miejsca=[],
                    czas_s=r["czas_s"], brak_wzorca=True, napis=k.get("napis", BRAK_WZORCA))
    miejsca = sorted(k["miejsca"], key=lambda m: -m["wynik"])
    return dict(plik=r["plik"], szer=r.get("szer"), wys=r.get("wys"), rodzaj=k["typ_wybrany"], wzorce=k.get("wzorce", []),
                miejsca=[dict(nr=i + 1, x0=m["x0"], y0=m["y0"], x1=m["x1"], y1=m["y1"], roznica=m["wynik"])
                         for i, m in enumerate(miejsca)],
                czas_s=r["czas_s"], brak_wzorca=False, **widok(r))
