"""Usługa Prześwitu (zadanie 21): HTTP nad detektorem, liczy na karcie OMENa; lokalnie podaje też stronę.

  PYTHONPATH=src:. python -m usluga.serwer [--host 0.0.0.0] [--port 8770] [--bezczynnosc 10] [--bez-sieci]
         [--metoda v2] [--siatka ...] [--szer-rob 2048] [--biblioteki mini,mini-trudny,maly]

Endpointy (także pod /api/...): GET /zdrowie, POST /analiza?typ=&biblioteka= (ciało = .bmp), GET /partia-pokazowa,
GET / i pliki strony z strona/public. Jedno liczenie naraz (karta 4 GB). --bezczynnosc N: po N min bez żądania
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


def zbuduj(licz, info, strona_dir, bezczynnosc_s, port=0, host="127.0.0.1"):
    """licz(sciezka, nazwa_bib|None, typ|None) -> dict; info = treść /zdrowie. Zwraca serwer (bez serve_forever)."""
    blokada = threading.Lock()
    ostatnie = [time.monotonic()]
    strona_dir = os.path.realpath(strona_dir)

    class Obsluga(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"

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
            ostatnie[0] = time.monotonic()
            p, q = self.sciezka()
            if p == "/zdrowie":
                return self.odpowiedz(200, info)
            if p == "/partia-pokazowa":
                with open(PARTIA) as f:
                    partia = json.load(f)
                wyniki = []
                for e in partia:
                    try:
                        wyniki.append(self.licz_jedno(os.path.join(rdzen.KORZEN, e["plik"]), e["biblioteka"], None))
                    except Exception as ex:   # jeden zły plik nie zatrzymuje partii
                        wyniki.append({"plik": os.path.basename(e["plik"]), "blad": str(ex)})
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

        def do_POST(self):
            ostatnie[0] = time.monotonic()
            p, q = self.sciezka()
            if p != "/analiza":
                return self.odpowiedz(404, {"blad": "brak"})
            n = int(self.headers.get("Content-Length") or 0)
            if n > LIMIT_B:
                self.close_connection = True
                return self.odpowiedz(413, {"blad": "plik większy niż 120 MB"})
            with tempfile.NamedTemporaryFile(suffix=".bmp", delete=False) as t:
                zostalo = n
                while zostalo:
                    kaw = self.rfile.read(min(zostalo, 1 << 20))
                    if not kaw:
                        break
                    t.write(kaw)
                    zostalo -= len(kaw)
                sciezka = t.name
            try:
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
                os.unlink(sciezka)
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
    a = ap.parse_args()
    if a.bez_sieci:
        bez_sieci()
    import torch
    from przeswit.wykryj import DEV, siatka
    konf = siatka(a.siatka)[0]
    opisy = {n: rdzen.BIBLIOTEKI_DOMYSLNE[n] for n in a.biblioteki.split(",") if n}
    t0 = time.perf_counter()
    bib = rdzen.wczytaj_biblioteki(opisy, a.szer_rob)
    if "mini" not in bib:
        sys.exit("brak biblioteki mini (dane/mini) — usługa nie wystartuje")
    karta = torch.cuda.get_device_name(0) if DEV.type == "cuda" else ""
    info = dict(ok=DEV.type == "cuda", urzadzenie=DEV.type, karta=karta, metoda=a.metoda, siatka=a.siatka,
                biblioteki={n: len(b.wpisy) for n, b in bib.items()}, bez_sieci=a.bez_sieci)

    def licz(sciezka, nazwa_bib, typ):
        from przeswit.bmp import wczytaj_szarosc
        szer = wczytaj_szarosc(sciezka, krok=64).shape[1] * 64
        nazwa, uwaga = rdzen.wybierz(szer, bib, nazwa_bib)
        if nazwa not in bib:
            raise ValueError("nieznana biblioteka %r" % nazwa)
        w = rdzen.analizuj(sciezka, bib[nazwa], a.metoda, konf, typ)
        w["biblioteka"] = nazwa
        if uwaga:
            w["uwaga"] = uwaga
        return w

    s = zbuduj(licz, info, os.path.join(rdzen.KORZEN, "strona", "public"), a.bezczynnosc * 60, a.port, a.host)
    print("Prześwit: http://%s:%d  %s %s, biblioteki %s (%.1f s), bezczynność %s min%s" % (
        a.host, a.port, info["urzadzenie"], karta, info["biblioteki"], time.perf_counter() - t0, a.bezczynnosc,
        ", bez sieci" if a.bez_sieci else ""), flush=True)
    s.serve_forever()


if __name__ == "__main__":
    main()
