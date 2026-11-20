import json, os, unittest

from usluga import rdzen

KORZEN = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class TestRdzen(unittest.TestCase):
    def test_wpisy_pomijaja_cysterne(self):
        w = rdzen.wpisy_biblioteki(rdzen.BIBLIOTEKI_DOMYSLNE["mini"])
        self.assertTrue(w)
        self.assertFalse([x for x in w if x[1] == "cysterna"])
        for _, _, p in w:
            self.assertTrue(os.path.exists(p), p)

    def test_brak_katalogu_daje_pusto(self):
        self.assertEqual(rdzen.wpisy_biblioteki({"katalog": "/nie/ma", "manifest": "/nie/ma/m.json", "poziom": "mini"}), [])

    def test_wybor_po_szerokosci(self):
        self.assertEqual(rdzen.wybierz(1024, {"mini": 1, "maly": 1}), ("mini", None))
        self.assertEqual(rdzen.wybierz(8192, {"mini": 1, "maly": 1}), ("maly", None))
        nazwa, uwaga = rdzen.wybierz(8192, {"mini": 1})
        self.assertEqual(nazwa, "mini")
        self.assertIn("mini", uwaga)
        self.assertEqual(rdzen.wybierz(8192, {"mini": 1, "mini-trudny": 1}, "mini-trudny"), ("mini-trudny", None))

    def test_wczytaj_pomija_puste(self):
        opisy = {"mini": rdzen.BIBLIOTEKI_DOMYSLNE["mini"], "zadna": {"katalog": "/nie/ma", "manifest": "/x", "poziom": "mini"}}
        b = rdzen.wczytaj_biblioteki(opisy, 2048, fabryka=lambda wpisy, szer: (len(wpisy), szer))
        self.assertEqual(list(b), ["mini"])
        self.assertEqual(b["mini"][1], 2048)

    def test_analizuj_mapuje_i_sortuje(self):
        konf = {"nazwa": "K"}

        def atrapa(sciezka, bib, konfiguracje, typ_prawda=None, typ_wymuszony=None):
            return dict(plik="a.bmp", szer=1024, wys=256, czas_s=0.5, konfiguracje={"K": {
                "typ_wybrany": "firanka", "wzorce": ["w1"], "miejsca": [
                    {"x0": 0, "y0": 0, "x1": 5, "y1": 5, "wynik": 3.0},
                    {"x0": 1, "y0": 1, "x1": 2, "y1": 2, "wynik": 9.5}]}})
        r = rdzen.analizuj("a.bmp", None, "v2", konf, detektor=atrapa)
        self.assertEqual(r["rodzaj"], "firanka")
        self.assertEqual(r["wzorce"], ["w1"])
        self.assertEqual(r["miejsca"][0]["roznica"], 9.5)
        self.assertEqual([m["nr"] for m in r["miejsca"]], [1, 2])
        self.assertEqual(r["czas_s"], 0.5)

    def test_siatka_ma_klucze_v2(self):
        klucze = {k.split("=")[0] for k in rdzen.SIATKA.split(";")}
        self.assertLessEqual({"trend", "tolx", "tau", "rho", "konstr", "lad", "min_pole"}, klucze)

    def test_partia_pliki_istnieja(self):
        with open(os.path.join(KORZEN, "usluga", "partia-pokazowa.json")) as f:
            p = json.load(f)
        self.assertEqual(len(p), 7)
        for e in p:
            self.assertIn(e["biblioteka"], ("mini", "mini-trudny"))
            self.assertTrue(os.path.exists(os.path.join(KORZEN, e["plik"])), e["plik"])


if __name__ == "__main__":
    unittest.main()
