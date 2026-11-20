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

        def atrapa(sciezka, bib, konfiguracje, typ_prawda=None, typ_wymuszony=None, prog_doboru=None):
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

    def test_domyslna_v3_z_progiem_doboru(self):
        self.assertEqual(rdzen.METODA, "v3")
        klucze = {k.split("=")[0] for k in rdzen.SIATKA.split(";")}
        self.assertLessEqual({"trend", "tolx", "rho", "konstr", "min_pole", "lok", "jas", "wyb", "tau_pud", "tau_pod",
                              "tau_kab", "scal"}, klucze)
        self.assertEqual(rdzen.PROG_DOBORU, ("sr", 0.80))

    def test_brak_wzorca_v3_nic_nie_zaznacza(self):
        wolany = []
        r = rdzen.analizuj("a.bmp", None, "v3", {"nazwa": "K"}, prog_doboru=("sr", 0.8),
                           detektor=lambda *a, **k: wolany.append(1), ocena_doboru=lambda s, b, p: True)
        self.assertEqual(wolany, [])
        self.assertTrue(r["brak_wzorca"])
        self.assertEqual(r["miejsca"], [])
        self.assertIsNone(r["rodzaj"])
        self.assertEqual(r["napis"], "brak wzorca — sprawdź obraz sam")
        self.assertEqual(r["plik"], "a.bmp")

    def test_v3_z_wzorcem_liczy(self):
        atrapa = lambda s, b, k, tp=None, tw=None: dict(plik="a.bmp", czas_s=0.1, konfiguracje={"K": {
            "typ_wybrany": "kontener", "wzorce": [], "miejsca": [{"x0": 0, "y0": 0, "x1": 1, "y1": 1, "wynik": 2.0}]}})
        r = rdzen.analizuj("a.bmp", None, "v3", {"nazwa": "K"}, prog_doboru=("sr", 0.8), detektor=atrapa,
                           ocena_doboru=lambda s, b, p: False)
        self.assertFalse(r["brak_wzorca"])
        self.assertEqual(r["rodzaj"], "kontener")

    def test_typ_od_operatora_pomija_prog(self):
        atrapa = lambda s, b, k, tp=None, tw=None: dict(plik="a.bmp", czas_s=0.1, konfiguracje={"K": {
            "typ_wybrany": tw, "wzorce": [], "miejsca": []}})
        r = rdzen.analizuj("a.bmp", None, "v3", {"nazwa": "K"}, typ="cysterna", prog_doboru=("sr", 0.8), detektor=atrapa,
                           ocena_doboru=lambda s, b, p: True)
        self.assertEqual(r["rodzaj"], "cysterna")

    def test_brak_wzorca_v2_z_detektora(self):
        atrapa = lambda *a: dict(plik="a.bmp", czas_s=0.1, brak_wzorca=True, konfiguracje={"K": {
            "typ_wybrany": None, "wzorce": [], "miejsca": [], "napis": "brak wzorca — sprawdź obraz sam"}})
        r = rdzen.analizuj("a.bmp", None, "v2", {"nazwa": "K"}, prog_doboru=("sr", 0.8), detektor=atrapa)
        self.assertTrue(r["brak_wzorca"])
        self.assertEqual(r["napis"], "brak wzorca — sprawdź obraz sam")

    def test_partia_pliki_istnieja(self):
        with open(os.path.join(KORZEN, "usluga", "partia-pokazowa.json")) as f:
            p = json.load(f)
        self.assertEqual(len(p), 7)
        for e in p:
            self.assertIn(e["biblioteka"], ("mini", "mini-trudny"))
            self.assertTrue(os.path.exists(os.path.join(KORZEN, e["plik"])), e["plik"])


if __name__ == "__main__":
    unittest.main()


class TestWidok(unittest.TestCase):
    MINI = os.path.join(KORZEN, "dane/mini/badany_mini_firanka_czyste_00.bmp")

    def test_rozmiar_z_naglowka(self):
        self.assertEqual(rdzen.rozmiar_bmp(self.MINI), (1024, 256))
        self.assertEqual(rdzen.rozmiar_bmp("/nie/ma.bmp"), (None, None))

    def test_brak_wzorca_ma_rozmiar(self):
        r = rdzen.analizuj(self.MINI, None, "v3", {"nazwa": "K"}, prog_doboru=("sr", 0.8),
                           detektor=lambda *a, **k: None, ocena_doboru=lambda s, b, p: True)
        self.assertEqual((r["szer"], r["wys"]), (1024, 256))

    def test_widok_przepisuje_polozenie_i_dobor(self):
        pol = [{"id": "w1", "s": 1.02, "dx": -1, "dy": 2}]
        atrapa = lambda s, b, k, tp=None, tw=None: dict(plik="a.bmp", czas_s=0.1, polozenie_wzorcow=pol,
            dobor=[{"id": "w1", "typ": "firanka", "wynik": 0.91234567, "s": 1.0, "dx": 0, "dy": 0},
                   {"id": "w2", "typ": "kontener", "wynik": 0.8, "s": 1.0, "dx": 1, "dy": 0}],
            konfiguracje={"K": {"typ_wybrany": "firanka", "wzorce": ["w1"], "miejsca": []}})
        r = rdzen.analizuj("a.bmp", None, "v3", {"nazwa": "K"}, detektor=atrapa)
        self.assertEqual(r["polozenie_wzorcow"], pol)
        self.assertEqual([d["id"] for d in r["dobor"]], ["w1", "w2"])
        self.assertEqual(r["dobor"][0]["wynik"], 0.9123)

    def test_podglad_to_ten_sam_obraz(self):
        from przeswit.bmp import wczytaj_szarosc
        import tempfile
        b = rdzen.podglad_bmp(self.MINI)
        with tempfile.NamedTemporaryFile(suffix=".bmp", delete=False) as t:
            t.write(b)
        self.addCleanup(os.unlink, t.name)
        self.assertEqual(rdzen.rozmiar_bmp(t.name), (1024, 256))
        self.assertTrue((wczytaj_szarosc(t.name) == wczytaj_szarosc(self.MINI)).all())
        maly = rdzen.podglad_bmp(self.MINI, szer_maks=300)
        with open(t.name, "wb") as f:
            f.write(maly)
        self.assertEqual(rdzen.rozmiar_bmp(t.name), (256, 64))
