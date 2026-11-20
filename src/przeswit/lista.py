"""Zadanie 23: lista miejsc widoku auta z wyniku usługi (v2).

A1: numery 1…n — te same na ramce badanego i na kafelku. A2: kolejność od najbardziej różnego, bez słów
i bez procentów (P79 B: słowa niski/średni/wysoki usunięte; zostaje tylko kolejność).
A3 (P58 A): brak miejsc → „brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam”.
A4 (P35 A): brak wzorca → zero ramek i „brak wzorca — sprawdź obraz sam”.
P57 A: lista pokazuje domyślnie 6 najsilniejszych miejsc, pod szóstym linia „i jeszcze N miejsc — pokaż”.
Bez torcha — działa w aplikacji i w testach bez karty.
"""
BRAK_WSKAZAN = "brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam"
BRAK_WZORCA = "brak wzorca — sprawdź obraz sam"
LIMIT_WIDOCZNYCH = 6
def miejsc(n):
    """Odmiana: 1 miejsce, 2–4 miejsca (bez 12–14), reszta miejsc (uwaga Szefa po odbiorze 28)."""
    j, d = n % 10, n % 100
    return "miejsce" if n == 1 else "miejsca" if 2 <= j <= 4 and not 12 <= d <= 14 else "miejsc"


def napis_wiecej(n):
    return f"i jeszcze {n} {miejsc(n)} — pokaż"


def lista_miejsc(wynik, konf=None, limit=LIMIT_WIDOCZNYCH):
    """wynik: jeden obraz z wyniki.json (wykryj_v2).
    Zwraca dict(napis, rodzaj, wzorzec, miejsca, widoczne, ukryte, napis_wiecej).
    """
    if konf is None:
        konf = next(iter(wynik["konfiguracje"]))
    k = wynik["konfiguracje"][konf]
    if wynik.get("brak_wzorca"):
        return dict(napis=BRAK_WZORCA, rodzaj=None, wzorzec=None,
                    miejsca=[], widoczne=[], ukryte=0, napis_wiecej=None)
    ms = sorted(k["miejsca"], key=lambda m: -m["wynik"])
    out = [dict(nr=i + 1, x0=m["x0"], y0=m["y0"], x1=m["x1"], y1=m["y1"], sila=m["wynik"])
           for i, m in enumerate(ms)]
    wid = out[:limit]
    ukr = max(0, len(out) - limit)
    wzorce = k.get("wzorce") or []
    return dict(napis=None if out else BRAK_WSKAZAN,
                rodzaj=k["typ_wybrany"],
                wzorzec=wzorce[0] if wzorce else None,
                miejsca=out,
                widoczne=wid,
                ukryte=ukr,
                napis_wiecej=napis_wiecej(ukr) if ukr else None)
