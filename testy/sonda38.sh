#!/bin/sh
# Zadanie 38: v3 (konfiguracja zadania 20) na 20 czystych z ~/dane/scenariusze/czyste_p49 + 8 czystych z dane/mini; biblioteka dane/mini (pełna).
# Dwa przebiegi: z progiem „brak wzorca” (domyślny, zadanie 36) i bez (sr:0.0).
set -e
export PYTHONPATH=src
POZA=${POZA:-$HOME/dane/scenariusze}
KONF="trend=1;tolx=2;rho=0.1;konstr=1;min_pole=0.0001;lok=2;jas=1;wyb=1;tau_pud=0.08;tau_pod=0.2;tau_kab=0.2;scal=0.01"
nvidia-smi --query-gpu=name --format=csv,noheader
BAD="$(ls dane/mini/badany_mini_*_czyste_*.bmp) $(ls $POZA/czyste_p49/*.bmp)"
for v in z_progiem:"" bez_progu:"--prog-doboru sr:0.0"; do
  n=${v%%:*}; o=${v#*:}
  python -m przeswit.wykryj --metoda v3 --szer-rob 2048 --wyj wyniki/sonda38/$n --bez-png --siatka "$KONF" --biblioteka dane/mini --badane $BAD $o | tail -1
done
python - <<'PY'
import json,os
for n in ("z_progiem","bez_progu"):
    d=json.load(open(f"wyniki/sonda38/{n}/wyniki.json")); print("==",n,len(d["wyniki"]))
    for r in d["wyniki"]:
        k=list(r["konfiguracje"].values())[0]
        print("WIERSZ",n,r["plik"],len(k["miejsca"]),r.get("brak_wzorca",False),k.get("typ_wybrany"),r.get("jakosc_doboru"))
PY
