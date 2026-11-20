"""Usługa Prześwitu (zadanie 21): HTTP nad detektorem, liczy na karcie OMENa; lokalnie podaje też stronę.

  PYTHONPATH=src:. python -m usluga.serwer [--host 0.0.0.0] [--port 8770] [--bezczynnosc 10] [--bez-sieci]
         [--metoda v2] [--siatka ...] [--szer-rob 2048] [--biblioteki mini,mini-trudny,maly]

Endpointy (także pod /api/...): GET /zdrowie, POST /analiza?typ=&biblioteka= (ciało = .bmp), GET /partia-pokazowa[?nr=N&typ=],
GET /obraz?partia=N | ?biblioteka=B&id=ID (podgląd do widoku auta, zad. 40), GET / i pliki strony z strona/public. Jedno liczenie naraz (karta 4 GB). --bezczynnosc N: po N min bez żądania
usługa kończy się i zwalnia kartę (0 = nigdy; tylko na pokaz). --bez-sieci: połączenia poza pętlę zwrotną odmawiane.
"""
import argparse, ipaddress, json, mimetypes, os, socket, sys, tempfile, threading, time, urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from . import rdzen

LIMIT_B = 120 * 1024 * 1024
PARTIA = os.path.join(rdzen.KORZEN, "usluga", "partia-pokazowa.json")
_connect = socket.socket.connect


def _lokalny(adres):
    if not isinstance(adres, tuple):
        return True                       # gniazda uniksowe
    try:
        return ipaddress.ip_address(adres[0]).is_loopback
    except ValueError:
        return adres[0] == "localhost"


def bez_sieci():
    """Straż: socket.connect poza 127.0.0.0/8 i ::1 -> OSError('bez sieci')."""
    def connect(self, adres):
        if not _lokalny(adres):
            raise OSError("bez sieci: odmowa połączenia z %s" % (adres,))
        return _connect(self, adres)
    socket.socket.connect = connect


def z_siecia():
    socket.socket.connect = _connect


def zbuduj(licz, info, strona_dir, bezczynnosc_s, port=0, host="127.0.0.1", wzorce=None, podglad=None):
    """licz(sciezka, nazwa_bib|None, typ|None) -> dict; info = treść /zdrowie. Zwraca serwer (bez serve_forever).
    Zad. 40: GET /obraz?partia=N (badany z partii pokazowej) albo ?biblioteka=B&id=ID (wzorzec, wzorce={(B, ID): ścieżka})
    -> podglad(ścieżka) = bajty BMP do widoku auta; tylko pliki z tych dwóch list."""
    wzorce = wzorce or {}
    podglad = podglad or rdzen.podglad_bmp
    pamiec = {}
    blokada = threading.Lock()
    ostatnie = [time.monotonic()]
    strona_dir = os.path.realpath(strona_dir)

    class Obsluga(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"
        timeout = 60                      # zawieszony klient nie trzyma wątku bez końca

        def log_message(self, fmt, *a):
            sys.stderr.write("%s %s\n" % (time.strftime("%H:%M:%S"), fmt % a))

        def odpowiedz(self, kod, obiekt=None, tresc=None, typ="application/json; charset=utf-8"):
            dane = tresc if tresc is not None else json.dumps(obiekt, ensure_ascii=False).encode()
            self.send_response(kod)
            self.send_header("Content-Type", typ)
            self.send_header("Content-Length", str(len(dane)))
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(dane)

        def sciezka(self):
            u = urllib.parse.urlsplit(self.path)
            p = u.path[4:] if u.path.startswith("/api/") else u.path
            return p, dict(urllib.parse.parse_qsl(u.query))

        def licz_jedno(self, sciezka, nazwa_bib, typ):
            with blokada:
                return licz(sciezka, nazwa_bib, typ)

        def do_GET(self):
            p, q = self.sciezka()
            if p == "/zdrowie":   # zad. 42: pytanie o zdrowie (strona, budzik) nie przedłuża życia usługi
                return self.odpowiedz(200, info)
            ostatnie[0] = time.monotonic()
            if p == "/obraz":
                return self.obraz(q)
            if p == "/partia-pokazowa":
                # zad. 28: ?nr=N — jedno auto partii (strona liczy po kolei); zad. 27: ?typ= — rodzaj od operatora
                with open(PARTIA) as f:
                    partia = json.load(f)
                typ = q.get("typ") or None
                numery = range(len(partia))
                if "nr" in q:
                    try:
                        numery = [int(q["nr"])]
                        if numery[0] < 0:
                            raise IndexError
                        partia[numery[0]]
                    except (ValueError, IndexError):
                        return self.odpowiedz(404, {"blad": "brak auta w partii"})
                wyniki = []
                for i in numery:
                    e = partia[i]
                    try:
                        w = self.licz_jedno(os.path.join(rdzen.KORZEN, e["plik"]), e["biblioteka"], typ)
                    except Exception as ex:   # jeden zły plik nie zatrzymuje partii
                        w = {"plik": os.path.basename(e["plik"]), "blad": str(ex)}
                    w["obraz"] = "partia=%d" % i
                    wyniki.append(w)
                    ostatnie[0] = time.monotonic()
                return self.odpowiedz(200, {"wyniki": wyniki})
            plik = os.path.realpath(os.path.join(strona_dir, urllib.parse.unquote(p).lstrip("/") or "index.html"))
            if plik != strona_dir and not plik.startswith(strona_dir + os.sep):
                return self.odpowiedz(403, {"blad": "poza katalogiem strony"})
            if os.path.isdir(plik):
                plik = os.path.join(plik, "index.html")
            if not os.path.isfile(plik):
                return self.odpowiedz(404, {"blad": "brak"})
            with open(plik, "rb") as f:
                typ = mimetypes.guess_type(plik)[0] or "application/octet-stream"
                return self.odpowiedz(200, tresc=f.read(), typ=typ + ("; charset=utf-8" if typ.startswith("text/") else ""))

        def obraz(self, q):
            sciezka = None
            if "partia" in q:
                try:
                    with open(PARTIA) as f:
                        sciezka = os.path.join(rdzen.KORZEN, json.load(f)[int(q["partia"])]["plik"])
                except (ValueError, IndexError, KeyError):
                    sciezka = None
            elif "id" in q:
                sciezka = wzorce.get((q.get("biblioteka") or "mini", q["id"]))
            if not sciezka or not os.path.isfile(sciezka):
                return self.odpowiedz(404, {"blad": "brak obrazu"})
            if sciezka not in pamiec:
                if len(pamiec) > 64:
                    pamiec.clear()
                pamiec[sciezka] = podglad(sciezka)
            return self.odpowiedz(200, tresc=pamiec[sciezka], typ="image/bmp")

        def do_POST(self):
            ostatnie[0] = time.monotonic()
            p, q = self.sciezka()
            if p != "/analiza":
                return self.odpowiedz(404, {"blad": "brak"})
            cl = self.headers.get("Content-Length")
            if cl is None:
                self.close_connection = True
                return self.odpowiedz(411, {"blad": "brak długości pliku (Content-Length)"})
            try:
                n = int(cl)
            except ValueError:
                n = -1
            if n < 0:
                self.close_connection = True
                return self.odpowiedz(400, {"blad": "zła długość pliku"})
            if n > LIMIT_B:
                self.close_connection = True
                return self.odpowiedz(413, {"blad": "plik większy niż 120 MB"})
            t = tempfile.NamedTemporaryFile(suffix=".bmp", delete=False)
            sciezka = t.name
            try:
                try:
                    with t:
                        zostalo = n
                        while zostalo:
                            kaw = self.rfile.read(min(zostalo, 1 << 20))
                            if not kaw:
                                break
                            t.write(kaw)
                            zostalo -= len(kaw)
                except OSError:               # klient zerwał połączenie / przekroczył czas
                    self.close_connection = True
                    return
                if zostalo:
                    self.close_connection = True
                    return self.odpowiedz(400, {"blad": "plik ucięty w trakcie wysyłania"})
                with open(sciezka, "rb") as f:
                    if f.read(2) != b"BM":
                        return self.odpowiedz(400, {"blad": "to nie jest plik .bmp (brak nagłówka BM)"})
                try:
                    wynik = self.licz_jedno(sciezka, q.get("biblioteka") or None, q.get("typ") or None)
                except Exception as ex:
                    return self.odpowiedz(400, {"blad": "nie udało się policzyć obrazu .bmp: %s" % ex})
                wynik["plik"] = q.get("nazwa") or wynik.get("plik")
                return self.odpowiedz(200, wynik)
            finally:
                try:
                    os.unlink(sciezka)
                except OSError:
                    pass
                ostatnie[0] = time.monotonic()

    s = ThreadingHTTPServer((host, port), Obsluga)
    s.daemon_threads = True
    if bezczynnosc_s > 0:
        def pilnuj():
            while True:
                time.sleep(min(1.0, bezczynnosc_s / 4))
                if time.monotonic() - ostatnie[0] > bezczynnosc_s and not blokada.locked():
                    sys.stderr.write("bezczynność %.0f s — koniec, karta wolna\n" % bezczynnosc_s)
                    threading.Thread(target=s.shutdown, daemon=True).start()
                    try:
                        s.socket.close()
                    except OSError:
                        pass
                    return
        threading.Thread(target=pilnuj, daemon=True).start()
    return s


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8770)
    ap.add_argument("--bezczynnosc", type=float, default=10, help="minuty bez żądania do końca (0 = nigdy)")
    ap.add_argument("--bez-sieci", action="store_true")
    ap.add_argument("--metoda", default=rdzen.METODA, choices=["v1", "v2", "v3"])
    ap.add_argument("--siatka", default=rdzen.SIATKA, help="jedna konfiguracja detektora")
    ap.add_argument("--szer-rob", type=int, default=rdzen.SZER_ROB)
    ap.add_argument("--biblioteki", default="mini,mini-trudny,maly")
    ap.add_argument("--prog-doboru", default="%s:%s" % rdzen.PROG_DOBORU, help="'miara:próg' (zad. 33); 'brak' = bez progu")
    a = ap.parse_args()
    if a.bez_sieci:
        bez_sieci()
    import torch
    from przeswit.wykryj import DEV, siatka
    konf = siatka(a.siatka)[0]
    pd = None if a.prog_doboru == "brak" else (a.prog_doboru.split(":")[0], float(a.prog_doboru.split(":")[1]))
    opisy = {n: rdzen.BIBLIOTEKI_DOMYSLNE[n] for n in a.biblioteki.split(",") if n}
    t0 = time.perf_counter()
    bib = rdzen.wczytaj_biblioteki(opisy, a.szer_rob)
    if "mini" not in bib:
        sys.exit("brak biblioteki mini (dane/mini) — usługa nie wystartuje")
    karta = torch.cuda.get_device_name(0) if DEV.type == "cuda" else ""
    info = dict(ok=DEV.type == "cuda", urzadzenie=DEV.type, karta=karta, metoda=a.metoda, siatka=a.siatka,
                biblioteki={n: len(b.wpisy) for n, b in bib.items()}, bez_sieci=a.bez_sieci, prog_doboru=a.prog_doboru)

    def licz(sciezka, nazwa_bib, typ):
        from przeswit.bmp import wczytaj_szarosc
        szer = wczytaj_szarosc(sciezka, krok=64).shape[1] * 64
        nazwa, uwaga = rdzen.wybierz(szer, bib, nazwa_bib)
        if nazwa not in bib:
            raise ValueError("nieznana biblioteka %r" % nazwa)
        w = rdzen.analizuj(sciezka, bib[nazwa], a.metoda, konf, typ, prog_doboru=pd)
        w["biblioteka"] = nazwa
        if uwaga:
            w["uwaga"] = uwaga
        return w

    wz = {(n, i): p for n, o in opisy.items() for i, _, p in rdzen.wpisy_biblioteki(o)}
    s = zbuduj(licz, info, os.path.join(rdzen.KORZEN, "strona", "public"), a.bezczynnosc * 60, a.port, a.host, wzorce=wz)
    print("Prześwit: http://%s:%d  %s %s, biblioteki %s (%.1f s), bezczynność %s min%s" % (
        a.host, a.port, info["urzadzenie"], karta, info["biblioteki"], time.perf_counter() - t0, a.bezczynnosc,
        ", bez sieci" if a.bez_sieci else ""), flush=True)
    s.serve_forever()


if __name__ == "__main__":
    main()
