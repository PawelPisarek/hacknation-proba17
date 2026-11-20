set -eu
export PYTHONPATH=src:.
METODA=$(python -c "from usluga import rdzen; print(rdzen.METODA)")
SIATKA=$(python -c "from usluga import rdzen; print(rdzen.SIATKA)")
SZER=$(python -c "from usluga import rdzen; print(rdzen.SZER_ROB)")
W=$HOME/wyniki-zad40; mkdir -p $W
python -m przeswit.wykryj --metoda "$METODA" --szer-rob "$SZER" --siatka "$SIATKA" --biblioteka dane/mini --manifest dane/mini/manifest.json --poziom brak --poziom-wzorcow mini --bez-typu cysterna --badane badany_mini_firanka_dodatki_00.bmp badany_mini_kontener_dodatki_01.bmp --wyj $W/cli_mini --bez-png | tail -1
python -m przeswit.wykryj --metoda "$METODA" --szer-rob "$SZER" --siatka "$SIATKA" --biblioteka dane/mini-trudny --manifest dane/mini-trudny/manifest.json --poziom brak --poziom-wzorcow mini --bez-typu cysterna --badane trudny_mini_firanka_za_ladunkiem_00.bmp --wyj $W/cli_trudny --bez-png | tail -1
python - <<'PY'
import json, os
W = os.path.expanduser("~/wyniki-zad40")
for b in ("cli_mini", "cli_trudny"):
    for r in json.load(open(f"{W}/{b}/wyniki.json"))["wyniki"]:
        k = next(iter(r["konfiguracje"].values()))
        print("CLI", json.dumps({"plik": r["plik"], "typ": k["typ_wybrany"], "wzorce": k.get("wzorce"), "ramki": sorted([m["x0"], m["y0"], m["x1"], m["y1"]] for m in k["miejsca"])}))
PY
