"""Zadanie 50: punkty siatki v3 (zad. 20) do wykresu — dla każdej z 128 konfiguracji i każdego zestawu:
śr. ramek na czystym aucie i przeoczenia %. Wyjście: ocena/siatka20-punkty.json (w repo; wykres: ocena/wykres50.mjs).
  python ocena/siatka20_punkty.py [katalog wyników zad. 20, domyślnie ~/wyniki-zad20] [DANE] [TRUDNE]
Bez karty; czyta gotowe wyniki.json (wynik zad. 20)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ocena import ocen
from wybor import ramki
W = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "~/wyniki-zad20")
D = os.path.expanduser(sys.argv[2] if len(sys.argv) > 2 else "~/dane/proba17")
T = os.path.expanduser(sys.argv[3] if len(sys.argv) > 3 else "~/dane/proba17-trudny")
zest = {}
for nazwa, man, kat in (("zwykly", D, ["mini", "maly", "pelny"]), ("trudny", T, ["trudny_mini", "trudny_maly", "trudny_pelny"])):
    m = json.load(open(man + "/manifest.json"))
    ws = [json.load(open(f"{W}/{k}/wyniki.json")) for k in kat]
    zest[nazwa] = (m, dict(konfiguracje=ws[0]["konfiguracje"], wyniki=[r for w in ws for r in w["wyniki"]]))
konfy = [k for k in zest["zwykly"][1]["konfiguracje"] if k in zest["trudny"][1]["konfiguracje"]]
wybrana = open(W + "/najlepsza.txt").read().strip()
out = {"wybrana": wybrana, "punkty": []}
for k in konfy:
    p = {"konf": k}
    for n, (m, w) in zest.items():
        r = ocen(m, w, k)
        p[n] = {"ramki_sr": round(ramki(m, w, k)[0], 3), "przeoczenia_pct": round(100 * r["Y"] / max(1, r["M"]), 2), "Y": r["Y"], "M": r["M"], "FP": r["X"], "N": r["N"]}
    out["punkty"].append(p)
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "siatka20-punkty.json"), "w"), ensure_ascii=False, indent=1)
print("punktów:", len(out["punkty"]), "wybrana:", wybrana)
