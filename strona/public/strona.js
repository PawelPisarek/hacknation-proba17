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
    if (!k.ok && k.stan === "uśpiona") $("#karta").textContent = "Program śpi — obudzi się sam przy pierwszym liczeniu (ok. 30 s)";
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

const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));
const sek = (t0) => Math.round((performance.now() - t0) / 1000);

// zad. 42: usługa śpi → strona sama ją budzi (budzik na OMENie), czeka na zdrowie i wtedy liczy jeszcze raz
async function obudz() {
  const t0 = performance.now();
  $("#stan").textContent = "Uruchamiam program, ok. 30 s…"; $("#stan").className = "budze";
  const r = await fetch("/api/obudz", { method: "POST" });
  const s = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(s.blad || "nie udało się uruchomić programu");
  while (sek(t0) < 300) {
    await czekaj(3000);
    const k = (await (await fetch("/api/zdrowie")).json().catch(() => ({}))).karta || {};
    if (k.ok) return sek(t0);
    if (k.stan === "uśpiona" && sek(t0) > 90) throw new Error(k.blad || "program nie wstał — spróbuj jeszcze raz");
    $("#stan").textContent = `${k.stan === "w kolejce" ? k.blad : "Uruchamiam program, ok. 30 s"}… (${sek(t0)} s)`;
  }
  throw new Error("program nie wstał w 5 min — spróbuj za chwilę");
}

async function pokaz(zrob, opis, poWynikach) {
  $("#stan").textContent = opis; $("#stan").className = "";
  const t0 = performance.now();
  let budzenie = 0;
  const odpowiedz = async () => {
    const r = await zrob();
    try { return [r, await r.json()]; } catch { throw new Error(`serwer odpowiedział błędem ${r.status} — spróbuj za chwilę`); }
  };
  try {
    let [r, j] = await odpowiedz();
    if (r.status === 503 && j.uspiona) {
      budzenie = await obudz();
      $("#stan").textContent = opis; $("#stan").className = "";
      [r, j] = await odpowiedz();
    }
    if (!r.ok) throw new Error(j.blad || `błąd ${r.status}`);
    poWynikach(j);
    $("#stan").textContent = `Gotowe w ${((performance.now() - t0) / 1000).toFixed(1)} s` +
      (budzenie ? ` (w tym uruchomienie programu ${budzenie} s).` : ".");
  } catch (e) { $("#stan").textContent = e.message; $("#stan").className = "blad"; }
  karta();
}

$("#plik").addEventListener("change", () => {
  const f = $("#plik").files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);   // badany pokazujemy z pliku w przeglądarce — bez drugiej wysyłki
  pokaz(() => fetch(`/api/analiza?nazwa=${encodeURIComponent(f.name)}`, { method: "POST", body: f }),
    `Liczę ${f.name} (${(f.size / 1048576).toFixed(1)} MB)…`, (j) => otworz(dodaj(j, url)));
  $("#plik").value = "";
});

function partia(autoNr) {
  return pokaz(() => fetch("/api/partia-pokazowa"), "Liczę partię pokazową (7 aut)…", (j) => {
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
