import json, os, socket, threading, time, unittest, urllib.error, urllib.request

from usluga import serwer

KORZEN = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MINI = os.path.join(KORZEN, "dane/mini/badany_mini_firanka_czyste_00.bmp")


def zadanie(url, dane=None, metoda=None):
    req = urllib.request.Request(url, data=dane, method=metoda or ("POST" if dane is not None else "GET"))
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


class TestSerwer(unittest.TestCase):
    def uruchom(self, licz=None, bezczynnosc_s=0, wzorce=None):
        self.wolania = []

        def atrapa(sciezka, nazwa_bib, typ):
            with open(sciezka, "rb") as f:
                n = len(f.read())
            self.wolania.append((n, nazwa_bib, typ))
            return {"plik": os.path.basename(sciezka), "rodzaj": "firanka", "miejsca": [], "czas_s": 0.01, "biblioteka": nazwa_bib}
        info = {"ok": False, "urzadzenie": "cpu", "karta": "", "metoda": "v2", "siatka": "x", "biblioteki": {"mini": 4}}
        s = serwer.zbuduj(licz or atrapa, info, os.path.join(KORZEN, "strona", "public"), bezczynnosc_s, port=0,
                          wzorce=wzorce, podglad=lambda p: b"BM" + os.path.basename(p).encode())
        threading.Thread(target=s.serve_forever, daemon=True).start()
        self.addCleanup(s.server_close)
        self.addCleanup(s.shutdown)
        self.url = "http://127.0.0.1:%d" % s.server_address[1]
        return s

    def test_zdrowie(self):
        self.uruchom()
        kod, ciało = zadanie(self.url + "/zdrowie")
        self.assertEqual(kod, 200)
        d = json.loads(ciało)
        for k in ("ok", "metoda", "biblioteki"):
            self.assertIn(k, d)

    def test_analiza_bmp(self):
        self.uruchom()
        dane = open(MINI, "rb").read()
        kod, ciało = zadanie(self.url + "/analiza?typ=firanka", dane)
        self.assertEqual(kod, 200, ciało)
        self.assertEqual(self.wolania, [(len(dane), None, "firanka")])  # bibliotekę wybiera licz (rdzen.wybierz)
        self.assertEqual(json.loads(ciało)["rodzaj"], "firanka")

    def test_nie_bmp_400(self):
        self.uruchom()
        kod, ciało = zadanie(self.url + "/analiza", b"\x89PNG to nie bmp")
        self.assertEqual(kod, 400)
        self.assertIn("bmp", json.loads(ciało)["blad"])
        self.assertEqual(zadanie(self.url + "/zdrowie")[0], 200)

    def test_blad_liczenia_400_i_zyje(self):
        def zle(sciezka, nazwa_bib, typ):
            raise ValueError("ucięty plik")
        self.uruchom(licz=zle)
        kod, ciało = zadanie(self.url + "/analiza", open(MINI, "rb").read()[:100])
        self.assertEqual(kod, 400)
        self.assertIn("ucięty", json.loads(ciało)["blad"])
        self.assertEqual(zadanie(self.url + "/zdrowie")[0], 200)

    def test_dwa_naraz(self):
        przedzialy = []

        def wolna(sciezka, nazwa_bib, typ):
            t0 = time.monotonic(); time.sleep(0.3); przedzialy.append((t0, time.monotonic()))
            return {"plik": "a", "miejsca": []}
        self.uruchom(licz=wolna)
        dane = open(MINI, "rb").read()
        kody = []
        w = [threading.Thread(target=lambda: kody.append(zadanie(self.url + "/analiza", dane)[0])) for _ in range(2)]
        [x.start() for x in w]; [x.join() for x in w]
        self.assertEqual(kody, [200, 200])
        a, b = sorted(przedzialy)
        self.assertLessEqual(a[1], b[0])

    def test_partia_pokazowa(self):
        self.uruchom()
        kod, ciało = zadanie(self.url + "/partia-pokazowa")
        self.assertEqual(kod, 200)
        self.assertEqual(len(json.loads(ciało)["wyniki"]), 7)
        self.assertEqual(self.wolania[-1][1], "mini-trudny")

    def test_partia_po_jednym_z_typem(self):   # zad. 28 (po kolei) i 27 (rodzaj operatora)
        self.uruchom()
        kod, ciało = zadanie(self.url + "/api/partia-pokazowa?nr=2&typ=firanka")
        wyniki = json.loads(ciało)["wyniki"]
        self.assertEqual((kod, len(wyniki), wyniki[0]["obraz"]), (200, 1, "partia=2"))
        self.assertEqual(wyniki[0]["plik"], "badany_mini_kontener_dodatki_01.bmp")
        self.assertEqual(self.wolania[-1][2], "firanka")
        for zle in ("nr=7", "nr=-1", "nr=x"):
            self.assertEqual(zadanie(self.url + "/partia-pokazowa?" + zle)[0], 404, zle)

    def test_obraz_partii_i_wzorca(self):
        self.uruchom(wzorce={("mini", "w1"): MINI})
        kod, ciało = zadanie(self.url + "/partia-pokazowa")
        wyniki = json.loads(ciało)["wyniki"]
        self.assertEqual([w["obraz"] for w in wyniki], ["partia=%d" % i for i in range(7)])
        kod, ciało = zadanie(self.url + "/api/obraz?partia=5")
        self.assertEqual((kod, ciało), (200, b"BMbadany_mini_cysterna_dodatki_00.bmp"))
        self.assertEqual(zadanie(self.url + "/obraz?biblioteka=mini&id=w1"), (200, b"BM" + os.path.basename(MINI).encode()))
        for zle in ("partia=99", "partia=x", "biblioteka=mini&id=nie", "id=../../etc/passwd", ""):
            self.assertEqual(zadanie(self.url + "/obraz?" + zle)[0], 404, zle)

    def test_sklad_partii_jak_pm06(self):
        # zad. 41: skład z docs/pm/06 (auto 1..7) i spec §7
        with open(serwer.PARTIA) as f:
            pliki = [os.path.basename(e["plik"]) for e in json.load(f)]
        self.assertEqual(pliki, ["badany_mini_firanka_dodatki_00.bmp", "badany_mini_chlodnia_dodatki_01.bmp",
                                 "badany_mini_kontener_dodatki_01.bmp", "badany_mini_kontener_czyste_00.bmp",
                                 "badany_mini_firanka_czyste_01.bmp", "badany_mini_cysterna_dodatki_00.bmp",
                                 "trudny_mini_firanka_za_ladunkiem_00.bmp"])

    def test_bezczynnosc(self):
        self.uruchom(bezczynnosc_s=0.5)
        time.sleep(1.5)
        with self.assertRaises(OSError):
            urllib.request.urlopen(self.url + "/zdrowie", timeout=1)

    def test_zdrowie_nie_podtrzymuje(self):   # zad. 42: budzik i strona pytają o zdrowie co chwilę
        self.uruchom(bezczynnosc_s=1.0)
        for _ in range(6):
            try:
                urllib.request.urlopen(self.url + "/zdrowie", timeout=1)
            except OSError:
                break
            time.sleep(0.3)
        time.sleep(1.0)
        with self.assertRaises(OSError):
            urllib.request.urlopen(self.url + "/zdrowie", timeout=1)

    def test_bez_sieci(self):
        self.uruchom()
        serwer.bez_sieci()
        self.addCleanup(serwer.z_siecia)
        with self.assertRaises(OSError) as e:
            socket.create_connection(("1.1.1.1", 80), timeout=1)
        self.assertIn("bez sieci", str(e.exception))
        self.assertEqual(zadanie(self.url + "/zdrowie")[0], 200)

    def test_api_prefiks_i_statyczne(self):
        self.uruchom()
        self.assertEqual(zadanie(self.url + "/api/zdrowie")[0], 200)
        kod, ciało = zadanie(self.url + "/")
        self.assertEqual(kod, 200)
        self.assertIn(b"<html", ciało.lower())
        self.assertIn(zadanie(self.url + "/../usluga/serwer.py")[0], (403, 404))
        self.assertIn(zadanie(self.url + "/%2e%2e/usluga/serwer.py")[0], (403, 404))

    def surowe(self, naglowki, cialo=b"", zamknij_po=False):
        host, port = self.url[7:].split(":")
        c = socket.create_connection((host, int(port)), timeout=5)
        c.sendall(("POST /analiza HTTP/1.1\r\nHost: x\r\n" + naglowki + "\r\n").encode() + cialo)
        if zamknij_po:
            c.close(); return None
        odp = b""
        try:
            while b"\r\n\r\n" not in odp:
                kaw = c.recv(4096)
                if not kaw:
                    break
                odp += kaw
        finally:
            c.close()
        return int(odp.split(b" ")[1]) if odp else 0

    def test_brak_dlugosci_411(self):
        self.uruchom()
        self.assertEqual(self.surowe("Transfer-Encoding: chunked\r\n", b"5\r\nBMxyz\r\n0\r\n\r\n"), 411)
        self.assertEqual(zadanie(self.url + "/zdrowie")[0], 200)

    def test_zla_dlugosc_400(self):
        self.uruchom()
        self.assertEqual(self.surowe("Content-Length: -5\r\n"), 400)
        self.assertEqual(self.surowe("Content-Length: abc\r\n"), 400)
        self.assertEqual(self.wolania, [])

    def test_zerwane_wgranie_nie_zostawia_pliku(self):
        import glob, tempfile
        self.uruchom()
        przed = set(glob.glob(os.path.join(tempfile.gettempdir(), "*.bmp")))
        self.surowe("Content-Length: 100000\r\n", b"BM" + b"x" * 100, zamknij_po=True)
        time.sleep(0.5)
        po = set(glob.glob(os.path.join(tempfile.gettempdir(), "*.bmp")))
        self.assertEqual(po - przed, set())
        self.assertEqual(zadanie(self.url + "/zdrowie")[0], 200)


if __name__ == "__main__":
    unittest.main()
