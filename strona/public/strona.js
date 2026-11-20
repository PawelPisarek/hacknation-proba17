// Prześwit — strona MVP: wgranie .bmp, partia pokazowa, stan karty. Same względne adresy /api/... (działa offline).
const $ = (s) => document.querySelector(s);
const el = (tag, tekst) => { const e = document.createElement(tag); if (tekst !== undefined) e.textContent = tekst; return e; };

async function karta() {
  try {
    const z = await (await fetch("/api/zdrowie")).json();
    const k = z.karta || {};
    $("#karta").textContent = k.ok ? `Karta gotowa: ${k.karta || k.urzadzenie} (metoda ${k.metoda})` : (k.blad || "karta nie liczy na GPU");
    $("#karta").className = k.ok ? "ok" : "zle";
  } catch { $("#karta").textContent = "Brak połączenia ze stroną"; $("#karta").className = "zle"; }
}

function wiersz(w) {
  const tr = el("tr");
  if (w.blad) {
    tr.append(el("td", w.plik || "—"));
    const td = el("td", w.blad); td.colSpan = 5; td.className = "blad"; tr.append(td);
    return tr;
  }
  const m = w.miejsca || [];
  tr.append(el("td", w.plik), el("td", w.rodzaj), el("td", w.biblioteka + (w.uwaga ? ` (${w.uwaga})` : "")),
    el("td", String(m.length)), el("td", `${(w.czas_s ?? 0).toFixed(2)} s`));
  const td = el("td");
  if (m.length) {
    const d = el("details"); d.append(el("summary", "pokaż"));
    const ul = el("ol");
    for (const x of m) ul.append(el("li", `(${x.x0}, ${x.y0})–(${x.x1}, ${x.y1}) różnica ${x.roznica}`));
    d.append(ul); td.append(d);
  } else td.textContent = "brak";
  tr.append(td);
  return tr;
}

async function pokaz(obietnica, opis) {
  $("#stan").textContent = opis; $("#stan").className = "";
  const t0 = performance.now();
  try {
    const r = await obietnica;
    let j;
    try { j = await r.json(); } catch { throw new Error(`serwer odpowiedział błędem ${r.status} — spróbuj za chwilę`); }
    if (!r.ok) throw new Error(j.blad || `błąd ${r.status}`);
    for (const w of j.wyniki || [j]) $("#wyniki").append(wiersz(w));
    $("#stan").textContent = `Gotowe w ${((performance.now() - t0) / 1000).toFixed(1)} s.`;
  } catch (e) { $("#stan").textContent = e.message; $("#stan").className = "blad"; }
  karta();
}

$("#plik").addEventListener("change", () => {
  const f = $("#plik").files[0];
  if (!f) return;
  pokaz(fetch(`/api/analiza?nazwa=${encodeURIComponent(f.name)}`, { method: "POST", body: f }),
    `Liczę ${f.name} (${(f.size / 1048576).toFixed(1)} MB)…`);
  $("#plik").value = "";
});
$("#partia").addEventListener("click", () => pokaz(fetch("/api/partia-pokazowa"), "Liczę partię pokazową (7 aut)…"));
karta();
