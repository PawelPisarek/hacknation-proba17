"""Rdzeń usługi (zadanie 21): biblioteki wzorców, wybór biblioteki dla obrazu, jedno liczenie -> odpowiedź API.

Torch i przeswit importowane leniwie — testy rdzenia chodzą bez karty i bez torcha.
"""
import json, os

KORZEN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_d = lambda p: os.path.join(KORZEN, p)

# Najlepsza v2 (docs/decyzje.md 12:01, zgl-4894). Po zad. 20 zmiana tylko tych trzech stałych (albo flag serwera).
METODA = "v2"
SIATKA = "trend=1;tolx=2;tau=0.1;rho=0.1;konstr=1;lad=0;min_pole=0.0001"  # zad. 19, decyzje 12:01
SZER_ROB = 2048
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
        return wykryj_v2
    from przeswit.wykryj import wykryj
    return lambda sciezka, bib, konf, typ_prawda=None, typ_wymuszony=None: wykryj(sciezka, bib, konf, typ_prawda)


def analizuj(sciezka, bib, metoda, konf, typ=None, detektor=None):
    """Jedno liczenie -> {plik, szer, wys, rodzaj, wzorce, miejsca[{nr,x0,y0,x1,y1,roznica}], czas_s}."""
    det = detektor or detektor_dla(metoda)
    r = det(sciezka, bib, [konf], None, typ)
    k = r["konfiguracje"][konf["nazwa"]]
    miejsca = sorted(k["miejsca"], key=lambda m: -m["wynik"])
    return dict(plik=r["plik"], szer=r.get("szer"), wys=r.get("wys"), rodzaj=k["typ_wybrany"], wzorce=k.get("wzorce", []),
                miejsca=[dict(nr=i + 1, x0=m["x0"], y0=m["y0"], x1=m["x1"], y1=m["y1"], roznica=m["wynik"])
                         for i, m in enumerate(miejsca)],
                czas_s=r["czas_s"])
