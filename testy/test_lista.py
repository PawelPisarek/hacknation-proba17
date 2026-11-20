"""Testy A1–A4 + P57 A / P58 A (zadanie 23). Bez karty: przypadki ręczne.
Z wynikami usługi: WYNIKI=plik1.json:manifest1,plik2.json:manifest2
(wyniki v2 na dane/mini i dane/mini-trudny z biblioteką bez cysterny).
python -m unittest testy.test_lista -v
"""
import json, os, re, unittest
from przeswit.lista import lista_miejsc, BRAK_WSKAZAN, BRAK_WZORCA, LIMIT_WIDOCZNYCH


def wyn(miejsca, brak=False, typ="firanka"):
    return dict(brak_wzorca=brak, konfiguracje={"k": dict(
        typ_wybrany=None if brak else typ,
        wzorce=[] if brak else [f"wzorzec_mini_{typ}_00"],
        miejsca=[dict(x0=i, y0=0, x1=i + 5, y1=5, wynik=w) for i, w in enumerate(miejsca)],
    )})


class Reczne(unittest.TestCase):
    def test_A1_A2_numery_i_kolejnosc(self):
        l = lista_miejsc(wyn([0.2, 0.9, 0.45]))["miejsca"]
        self.assertEqual([m["nr"] for m in l], [1, 2, 3])
        self.assertEqual([m["sila"] for m in l], [0.9, 0.45, 0.2])

    def test_A2_bez_slow_P79B(self):
        # P79 B: żadnego słowa poziomu przy miejscu — tylko numer i kolejność
        for m in lista_miejsc(wyn([0.7, 0.3, 0.1]))["miejsca"]:
            self.assertNotIn("slowo", m)
            self.assertEqual(set(m), {"nr", "x0", "y0", "x1", "y1", "sila"})

    def test_A3_brak_wskazan_P58A(self):
        l = lista_miejsc(wyn([]))
        self.assertEqual((l["napis"], l["miejsca"], l["widoczne"], l["ukryte"]),
                         (BRAK_WSKAZAN, [], [], 0))
        self.assertIn("to nie gwarancja", l["napis"])

    def test_A4_brak_wzorca(self):
        l = lista_miejsc(wyn([0.9], brak=True))
        self.assertEqual((l["napis"], l["miejsca"], l["widoczne"], l["rodzaj"]),
                         (BRAK_WZORCA, [], [], None))

    def test_P57A_szesc_i_pokaz(self):
        l = lista_miejsc(wyn([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]))
        self.assertEqual(len(l["widoczne"]), LIMIT_WIDOCZNYCH)
        self.assertEqual([m["nr"] for m in l["widoczne"]], [1, 2, 3, 4, 5, 6])
        self.assertEqual(l["ukryte"], 3)
        self.assertEqual(l["napis_wiecej"], "i jeszcze 3 miejsc — pokaż")
        l6 = lista_miejsc(wyn([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]))
        self.assertEqual((l6["ukryte"], l6["napis_wiecej"]), (0, None))


class ZWynikow(unittest.TestCase):
    """A1–A4 + P57 A na prawdziwych wynikach usługi (dane/mini, dane/mini-trudny, biblioteka bez cysterny)."""
    def zestawy(self):
        z = os.environ.get("WYNIKI")
        if not z:
            self.skipTest("brak WYNIKI")
        for para in z.split(","):
            pw, pm = para.split(":")
            man = {e["plik"].split("/")[-1]: e for e in json.load(open(pm))["badane"]}
            yield pw, json.load(open(pw))["wyniki"], man

    def test_A2_A3_A4(self):
        for pw, ww, man in self.zestawy():
            n = dict(obrazy=0, brak_wzorca=0, brak_wskazan=0, z_miejscami=0, ponad_6=0, zly_dobor=0)
            for r in ww:
                l = lista_miejsc(r)
                n["obrazy"] += 1
                typ = man[r["plik"]]["typ_pojazdu"]
                with self.subTest(plik=r["plik"]):
                    if typ == "cysterna":                         # A4: w bibliotece nie ma cysterny
                        self.assertEqual(l["napis"], BRAK_WZORCA)
                        self.assertEqual(l["miejsca"], [])
                        self.assertEqual(l["widoczne"], [])
                        n["brak_wzorca"] += 1
                        continue
                    self.assertNotEqual(l["napis"], BRAK_WZORCA)
                    n["zly_dobor"] += int(l["rodzaj"] != typ)
                    self.assertEqual(l["rodzaj"], typ)
                    ms = l["miejsca"]
                    if not ms:                                    # A3
                        self.assertEqual(l["napis"], BRAK_WSKAZAN)
                        n["brak_wskazan"] += 1
                        continue
                    n["z_miejscami"] += 1
                    self.assertIsNone(l["napis"])
                    self.assertEqual([m["nr"] for m in ms], list(range(1, len(ms) + 1)))       # A1
                    s = [m["sila"] for m in ms]
                    self.assertEqual(s, sorted(s, reverse=True))                              # A2 kolejność
                    if len(ms) > LIMIT_WIDOCZNYCH:                                            # P57 A
                        n["ponad_6"] += 1
                        self.assertEqual(len(l["widoczne"]), LIMIT_WIDOCZNYCH)
                        self.assertEqual(l["ukryte"], len(ms) - LIMIT_WIDOCZNYCH)
                        self.assertEqual(l["napis_wiecej"], f"i jeszcze {l['ukryte']} miejsc — pokaż")
                    else:
                        self.assertEqual(len(l["widoczne"]), len(ms))
                        self.assertIsNone(l["napis_wiecej"])
                    for m in ms:                                                              # P79 B bez słów
                        self.assertNotIn("slowo", m)
            print(f"\nLISTA {pw}: {n}")


if __name__ == "__main__":
    unittest.main()
