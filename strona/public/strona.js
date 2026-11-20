// Prześwit — strona MVP: wgranie .bmp, partia pokazowa, stan karty, widok auta (zad. 40: ten sam widok co
// mvp/widok-auta — ramki, lupa, wzorzec obok, podpowiedź). Same względne adresy /api/... (działa offline).
const $ = (s) => document.querySelector(s);
const el = (tag, tekst) => { const e = document.createElement(tag); if (tekst !== undefined) e.textContent = tekst; return e; };
const NAZWA = { firanka: "firanka", chlodnia: "chłodnia", kontener: "kontener", cysterna: "cysterna" };
const auta = [];   // { wynik (z usługi), obrazBadany }
let otwarte = -1;

async function karta() {
  try {
    const z = await (await fetch("/api/zdrowie")).json();
    const k = z.karta || {};
    $("#karta").textContent = k.ok ? `Karta gotowa: ${k.karta || k.urzadzenie} (metoda ${k.metoda})` : (k.blad || "karta nie liczy na GPU");
    $("#karta").className = k.ok ? "ok" : "zle";
  } catch { $("#karta").textContent = "Brak połączenia ze stroną"; $("#karta").className = "zle"; }
}

// odpowiedź usługi -> format wyniki.json, który czyta widok auta (PrzeswitLista.renderWidokAuta)
function doWidoku(w) {
  return {
    plik: w.plik, szer: w.szer, wys: w.wys, brak_wzorca: Boolean(w.brak_wzorca),
    polozenie_wzorcow: w.polozenie_wzorcow || [], dobor: w.dobor || [],
    konfiguracje: { k: { typ_wybrany: w.rodzaj, wzorce: w.wzorce || [],
      miejsca: (w.miejsca || []).map((m) => ({ x0: m.x0, y0: m.y0, x1: m.x1, y1: m.y1, wynik: m.roznica })) } },
  };
}

function otworz(i) {
  const a = auta[i];
  if (!a || a.wynik.blad) return;
  otwarte = i;
  document.querySelectorAll("#wyniki tr").forEach((tr, j) => tr.classList.toggle("otwarte", j === i));
  const w = a.wynik, wz = (w.wzorce || [])[0];
  PrzeswitLista.renderWidokAuta($("#widok"), {
    wynik: doWidoku(w),
    obrazBadany: a.obrazBadany,
    obrazWzorca: wz ? `/api/obraz?biblioteka=${encodeURIComponent(w.biblioteka || "mini")}&id=${encodeURIComponent(wz)}` : "",
    tytul: `Auto ${i + 1}`,
  });
  $("#widok").scrollIntoView({ behavior: "smooth", block: "start" });
}

function wiersz(w, i) {
  const tr = el("tr");
  tr.append(el("td", String(i + 1)), el("td", w.plik || "—"));
  if (w.blad) {
    const td = el("td", w.blad); td.colSpan = 3; td.className = "blad"; tr.append(td);
    return tr;
  }
  const n = (w.miejsca || []).length;
  tr.append(el("td", w.brak_wzorca ? "—" : (NAZWA[w.rodzaj] || w.rodzaj || "—")),
    el("td", w.brak_wzorca ? w.napis : String(n)), el("td", `${(w.czas_s ?? 0).toFixed(2)} s`));
  tr.title = "otwórz auto";
  tr.addEventListener("click", () => otworz(i));
  return tr;
}

function dodaj(w, obrazBadany) {
  const i = auta.push({ wynik: w, obrazBadany }) - 1;
  $("#wyniki").append(wiersz(w, i));
  $("#tabela").hidden = false;
  return i;
}

async function pokaz(obietnica, opis, poWynikach) {
  $("#stan").textContent = opis; $("#stan").className = "";
  const t0 = performance.now();
  try {
    const r = await obietnica;
    let j;
    try { j = await r.json(); } catch { throw new Error(`serwer odpowiedział błędem ${r.status} — spróbuj za chwilę`); }
    if (!r.ok) throw new Error(j.blad || `błąd ${r.status}`);
    poWynikach(j);
    $("#stan").textContent = `Gotowe w ${((performance.now() - t0) / 1000).toFixed(1)} s.`;
  } catch (e) { $("#stan").textContent = e.message; $("#stan").className = "blad"; }
  karta();
}

$("#plik").addEventListener("change", () => {
  const f = $("#plik").files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);   // badany pokazujemy z pliku w przeglądarce — bez drugiej wysyłki
  pokaz(fetch(`/api/analiza?nazwa=${encodeURIComponent(f.name)}`, { method: "POST", body: f }),
    `Liczę ${f.name} (${(f.size / 1048576).toFixed(1)} MB)…`, (j) => otworz(dodaj(j, url)));
  $("#plik").value = "";
});

function partia(autoNr) {
  return pokaz(fetch("/api/partia-pokazowa"), "Liczę partię pokazową (7 aut)…", (j) => {
    const pierwsze = auta.length;
    for (const w of j.wyniki || []) dodaj(w, w.obraz ? `/api/obraz?${w.obraz}` : "");
    otworz(pierwsze + Math.max(0, Math.min((j.wyniki || []).length - 1, (autoNr || 1) - 1)));
  });
}
$("#partia").addEventListener("click", () => partia(1));
karta();
// ?partia=1&auto=N — od razu partia pokazowa i auto N (pokaz, zrzuty)
const qs = new URLSearchParams(location.search);
if (qs.get("partia")) partia(Number(qs.get("auto")) || 1);
