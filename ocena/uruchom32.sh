#!/bin/sh
# Zadanie 32 — jeden przebieg na karcie (v3 z zad. 20, konfiguracja bez zmian), siła miejsc na czystych autach i skrytkach.
# Hipotezy: H1 czyste auto prawie nie dostaje „wysoki” przy progu ≥ p90 maks. sił czystych; H2 skrytki w większości dostają „wysoki”/„średni”
# przy tym progu (te słabe siłą nie różnią się od czystych); H3 zestaw trudny (ładunek legalny) przesuwa progi vs zestaw zwykły.
set -e
export PYTHONPATH=src
WYJ=${WYJ:-$HOME/wyniki-zad32}
POZA=${POZA:-$HOME/dane/scenariusze}
KONF="trend=1;tolx=2;rho=0.1;konstr=1;min_pole=0.0001;lok=2;jas=1;wyb=1;tau_pud=0.08;tau_pod=0.2;tau_kab=0.2;scal=0.01"
WARIANTY=${WARIANTY:-"A:0.6,0.3;B:0.9,0.5;C:1.5,0.8"}
mkdir -p $WYJ
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader
ls $POZA/czyste_p49/badany_mini_*.bmp >/dev/null 2>&1 || python dane/generator/scenariusze.py --wyj $WYJ/scen_repo --poza $POZA
# biblioteka z 20 dodatkowych czystych aut (P49): wzorce z dane/mini + czyste_p49
L=$WYJ/p49lib; rm -rf $L; mkdir -p $L
for f in dane/mini/wzorzec_*.bmp; do ln -s $(pwd)/$f $L/; done
for f in $POZA/czyste_p49/badany_mini_*.bmp; do ln -s $f $L/; done
python - <<PY
import json, os
m = json.load(open("dane/mini/manifest.json"))
dod = [e for e in m["badane"] if False]
bad = []
for f in sorted(x for x in os.listdir("$POZA/czyste_p49") if x.startswith("badany_mini_")):
    t = f.split("_")[2]
    bad.append(dict(plik=f, id=f[:-4], typ_pojazdu=t, poziom="mini", klasa="czyste", trudny=False, dodatki=[], szer=1024, wys=256))
m["badane"] = bad
json.dump(m, open("$L/manifest.json", "w"), ensure_ascii=False)
print("p49:", len(bad))
PY
w() { n=$1; d=$2; shift 2
  python -m przeswit.wykryj --metoda v3 --szer-rob 2048 --biblioteka "$d" --manifest "$d/manifest.json" --wyj $WYJ/$n --bez-png --siatka "$KONF" | tail -1; }
w mini dane/mini
w mini-trudny dane/mini-trudny
w p49 $L
python - <<PY
import json
for n in ("mini","mini-trudny","p49"):
    r = json.load(open("$WYJ/%s/wyniki.json" % n))["wyniki"]; print(n, len(r), list(r[0]["konfiguracje"])[:1])
PY
K=$(python -c "import json;print(next(iter(json.load(open('$WYJ/mini/wyniki.json'))['wyniki'][0]['konfiguracje'])))")
python ocena/progi32.py --zestaw mini dane/mini/manifest.json $WYJ/mini/wyniki.json \
  --zestaw mini-trudny dane/mini-trudny/manifest.json $WYJ/mini-trudny/wyniki.json \
  --zestaw czyste_p49 $L/manifest.json $WYJ/p49/wyniki.json \
  --konf "$K" --plik trudny_mini_firanka_za_ladunkiem_00.bmp --warianty "$WARIANTY" --wyj $WYJ/progi32.json
