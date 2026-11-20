#!/bin/sh
# Zadanie 21 — dowód na karcie (jedno zlecenie gpu-tlo, cztery hipotezy):
#  H4 cysterna bez wzorca w bibliotece dostaje „brak wzorca” (próg doboru zad. 33), pozostałe auta nie;
#  H1 usługa przez HTTP daje te same miejsca co CLI przeswit.wykryj (ta sama metoda, siatka, biblioteka);
#  H2 z włączoną strażą „bez sieci” (tylko 127.0.0.1) partia pokazowa liczy się w całości;
#  H3 obraz pełny ~50 MB (8192×2048) przez HTTP < 60 s.
# Uruchamia (z kontenera zespołu, klon gałęzi):
#  node /data/orkiestrator-klient/klient/orkiestrator.mjs uruchom --maszyna omen --klasa gpu-tlo --rdzenie 2 --sesja pawel21
#    --repo hacknation --konto hackathon --ssh --wyslij . -- sh -c '. ~/venv/bin/activate && sh ocena/uruchom21.sh'
set -eu
export PYTHONPATH=src:.
PORT=${PORT:-8771}
WYJ=${WYJ:-$HOME/wyniki-zad21}
DANE=${DANE:-$HOME/dane/proba17}
mkdir -p "$WYJ"; rm -f "$WYJ"/*.json
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader
METODA=$(python -c "from usluga import rdzen; print(rdzen.METODA)")
SIATKA=$(python -c "from usluga import rdzen; print(rdzen.SIATKA)")
SZER=$(python -c "from usluga import rdzen; print(rdzen.SZER_ROB)")
python -m usluga.serwer --host 127.0.0.1 --port "$PORT" --bez-sieci --bezczynnosc 0 > "$WYJ/usluga.log" 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT
t=0
until curl -s -m 3 "http://127.0.0.1:$PORT/zdrowie" > "$WYJ/zdrowie.json" 2>/dev/null && grep -q '"ok": *true' "$WYJ/zdrowie.json"; do
  t=$((t + 2)); [ "$t" -gt 240 ] && { echo "BŁĄD: usługa nie wstała"; tail -20 "$WYJ/usluga.log"; exit 3; }
  kill -0 $PID 2>/dev/null || { echo "BŁĄD: usługa padła"; tail -20 "$WYJ/usluga.log"; exit 3; }
  sleep 2
done
echo "ZDROWIE po ${t} s: $(cat "$WYJ/zdrowie.json")"
head -1 "$WYJ/usluga.log"

# H2: partia pokazowa przez HTTP przy straży bez sieci
curl -s -m 600 "http://127.0.0.1:$PORT/partia-pokazowa" > "$WYJ/partia_http.json"

# H3: obraz pełny przez HTTP
DUZY=$(python -c "import json,os; m=json.load(open('$DANE/manifest.json')); e=[x for x in m['badane'] if x['poziom']=='pelny' and x['klasa']!='czyste']; print(os.path.join('$DANE', e[0]['plik']))")
ls -l "$DUZY"
T0=$(date +%s.%N)
curl -s -m 300 --data-binary @"$DUZY" -H 'content-type: application/octet-stream' "http://127.0.0.1:$PORT/analiza?nazwa=$(basename "$DUZY")" > "$WYJ/duzy_http.json"
T1=$(date +%s.%N)

# H1: CLI na tych samych plikach i bibliotekach
for B in mini mini-trudny; do
  PL=$(python -c "import json; print(' '.join(e['plik'] for e in json.load(open('usluga/partia-pokazowa.json')) if e['biblioteka']=='$B'))")
  python -m przeswit.wykryj --metoda "$METODA" --szer-rob "$SZER" --siatka "$SIATKA" --biblioteka "dane/$B" \
    --manifest "dane/$B/manifest.json" --poziom brak --poziom-wzorcow mini --bez-typu cysterna --badane $PL \
    --wyj "$WYJ/cli_$B" --bez-png | tail -1
done

python - "$WYJ" "$T0" "$T1" <<'PY'
import json, sys
wyj, t0, t1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
http = {w["plik"]: w for w in json.load(open(f"{wyj}/partia_http.json"))["wyniki"]}
cli = {}
for b in ("mini", "mini-trudny"):
    for r in json.load(open(f"{wyj}/cli_{b}/wyniki.json"))["wyniki"]:
        k = next(iter(r["konfiguracje"].values()))
        cli[r["plik"]] = (k["typ_wybrany"], sorted((m["x0"], m["y0"], m["x1"], m["y1"]) for m in k["miejsca"]))
zg = brak = 0
for plik, (typ, ramki) in sorted(cli.items()):
    h = http.get(plik, {})
    if h.get("brak_wzorca"):   # próg doboru (zad. 33) liczy usługa; CLI v3 go nie zna
        brak += 1
        print(f"{plik}: http „{h.get('napis')}” (0 miejsc), cli {typ}/{len(ramki)} miejsc — brak wzorca")
        continue
    hr = sorted((m["x0"], m["y0"], m["x1"], m["y1"]) for m in h.get("miejsca", []))
    ok = h.get("rodzaj") == typ and hr == ramki
    zg += ok
    print(f"{plik}: http {h.get('rodzaj')}/{len(hr)} miejsc, cli {typ}/{len(ramki)} miejsc, czas {h.get('czas_s')} s — {'zgodne' if ok else 'RÓŻNE'}")
print(f"H1 ZGODNE {zg}/{len(cli) - brak} (brak wzorca: {brak}); H2 partia bez sieci: {sum('blad' not in w for w in http.values())}/{len(http)} policzone")
d = json.load(open(f"{wyj}/duzy_http.json"))
print(f"H3 duży {d.get('plik')} {d.get('szer')}x{d.get('wys')}: biblioteka {d.get('biblioteka')}, miejsc {len(d.get('miejsca', []))}, "
      f"liczenie {d.get('czas_s')} s, całe żądanie {t1 - t0:.1f} s{' (' + d['blad'] + ')' if 'blad' in d else ''}")
PY
