// Udawane dane makiety: prawdziwe obrazy z dane/mini (1024×256), ramki wpisane na sztywno
// (dodatki z manifestu + kilka fałszywych ramek z wyniku programu v2). Słowo różnicy wg P17, bez procentów.
const W = 1024, H = 256;
const POWODY = ["element konstrukcji", "zgłoszony ładunek", "błąd obrazu", "nakładanie się ładunku", "inny"]; // P13
const RODZAJE = ["firanka", "chlodnia", "kontener", "cysterna"];
const NAZWA = { firanka: "firanka", chlodnia: "chłodnia", kontener: "kontener", cysterna: "cysterna" };
const PODPOWIEDZ_RODZAJU = {
  firanka: "zwykle tu: słupki ściany co ok. metr, plandeka prawie przezroczysta",
  chlodnia: "zwykle tu: gruba ściana izolacji, cienkie słupki",
  kontener: "zwykle tu: faliste ściany, narożniki",
  cysterna: "zwykle tu: pierścienie wzmacniające zbiornika",
};
function podpowiedz(auto, m) {   // podpowiedź dla krótkiego stażu: co zwykle jest w tym miejscu konstrukcji
  const yc = (m.y0 + m.y1) / 2 / H;
  if (yc > 0.79) return "zwykle tu: podłużnice i poprzeczki podwozia, koła";
  if (m.x1 / W < 0.10) return "zwykle tu: kabina ciągnika";
  return PODPOWIEDZ_RODZAJU[auto.rodzaj];
}
const AUTA = [
  { id: 1, plik: "firanka_dodatki_00", rodzaj: "firanka", miejsca: [
    { x0: 799, y0: 39, x1: 811, y1: 75, slowo: "wysoki" }, { x0: 833, y0: 233, x1: 841, y1: 241, slowo: "średni" },
    { x0: 904, y0: 214, x1: 912, y1: 238, slowo: "niski" }] },
  { id: 2, plik: "chlodnia_dodatki_01", rodzaj: "chlodnia", miejsca: [
    { x0: 711, y0: 60, x1: 728, y1: 111, slowo: "wysoki" }, { x0: 488, y0: 70, x1: 511, y1: 102, slowo: "wysoki" },
    { x0: 444, y0: 237, x1: 455, y1: 253, slowo: "niski" }] },
  { id: 3, plik: "kontener_dodatki_01", rodzaj: "kontener", miejsca: [
    { x0: 421, y0: 135, x1: 447, y1: 182, slowo: "wysoki" }, { x0: 213, y0: 215, x1: 233, y1: 245, slowo: "średni" }] },
  { id: 4, plik: "cysterna_dodatki_00", rodzaj: "cysterna", miejsca: [
    { x0: 566, y0: 38, x1: 591, y1: 68, slowo: "wysoki" }, { x0: 202, y0: 86, x1: 213, y1: 123, slowo: "średni" },
    { x0: 314, y0: 213, x1: 322, y1: 233, slowo: "niski" }] },
  { id: 5, plik: "kontener_czyste_00", rodzaj: "kontener", miejsca: [{ x0: 875, y0: 213, x1: 882, y1: 240, slowo: "niski" }] },
  { id: 6, plik: "firanka_czyste_01", rodzaj: null, miejsca: [] },   // brak wzorca (P35 A): bez ramek, napis
];
const BRAK_WZORCA = "brak wzorca — sprawdź obraz sam";
const obrazBadany = (a) => `../obrazy/${a.plik}.png`;
const obrazWzorca = (rodzaj, i = 0) => `../obrazy/${rodzaj}_0${i}.png`;
const pct = (v, n) => (100 * v / n) + "%";

// stan decyzji operatora (tylko w pamięci strony)
const DECYZJE = {};   // "auto:nr" -> {d:"zatwierdzone"|"odrzucone", powod}
const NRREJ = {};
function decyzja(a, i) { return DECYZJE[a.id + ":" + i]; }
function ileZostalo(a) { return a.miejsca.filter((_, i) => !decyzja(a, i)).length; }

// ramki na obrazie: kontener position:relative z <img>; numery od najbardziej różnego (kolejność listy)
function rysujRamki(el, a, wybrane, klik) {
  el.querySelectorAll(".ramka").forEach((r) => r.remove());
  a.miejsca.forEach((m, i) => {
    const r = document.createElement("button");
    const d = decyzja(a, i);
    r.className = "ramka " + (m.slowo === "wysoki" ? "s3" : m.slowo === "średni" ? "s2" : "s1") + (i === wybrane ? " wyb" : "") + (d ? " " + d.d : "");
    Object.assign(r.style, { left: pct(m.x0, W), top: pct(m.y0, H), width: pct(m.x1 - m.x0, W), height: pct(m.y1 - m.y0, H) });
    r.innerHTML = `<span>${i + 1} ${m.slowo}</span>`;
    r.title = `miejsce ${i + 1}: ${m.slowo}`;
    r.onclick = (e) => { e.stopPropagation(); klik(i); };
    el.appendChild(r);
  });
}
// lupa: wycinek wokół miejsca, powiększony; src = badany albo wzorzec
function rysujLupe(el, src, m, zoom = 8) {
  const cx = (m.x0 + m.x1) / 2, cy = (m.y0 + m.y1) / 2;
  const bw = el.clientWidth || 300, bh = el.clientHeight || 150;
  const s = bw / (W / zoom);     // px lupy na px obrazu (lupa pokazuje 1/zoom szerokości obrazu)
  el.style.backgroundImage = `url(${src})`;
  el.style.backgroundSize = `${W * s}px ${H * s}px`;
  el.style.backgroundPosition = `${bw / 2 - cx * s}px ${bh / 2 - cy * s}px`;
  el.innerHTML = `<div class="lupa-ramka" style="left:${bw / 2 - (cx - m.x0) * s}px;top:${bh / 2 - (cy - m.y0) * s}px;width:${(m.x1 - m.x0) * s}px;height:${(m.y1 - m.y0) * s}px"></div>`;
}
function selectRodzaj(a, onzmiana) {
  const s = document.createElement("select");
  s.innerHTML = (a.rodzaj ? "" : `<option value="">— brak wzorca —</option>`) + RODZAJE.map((r) => `<option value="${r}" ${r === a.rodzaj ? "selected" : ""}>${NAZWA[r]}</option>`).join("");
  s.onchange = () => onzmiana(s.value);
  return s;
}
function poleNrRej(a) {
  const i = document.createElement("input");
  i.placeholder = "np. WGM 12345"; i.value = NRREJ[a.id] || ""; i.className = "nrrej";
  i.oninput = () => (NRREJ[a.id] = i.value);
  return i;
}
// przyciski zatwierdź / odrzuć z powodem z listy P13 (+ „inny” z własnym tekstem)
function decyzjaUI(el, a, i, dalej) {
  el.innerHTML = "";
  if (i == null || !a.miejsca[i]) { el.innerHTML = `<span class="szary">brak miejsc do decyzji</span>`; return; }
  const d = decyzja(a, i);
  const ok = document.createElement("button"); ok.className = "btn ok"; ok.textContent = "Zatwierdź";
  const sel = document.createElement("select"); sel.className = "powod";
  sel.innerHTML = `<option value="">Odrzuć — powód…</option>` + POWODY.map((p) => `<option>${p}</option>`).join("");
  const inny = document.createElement("input"); inny.placeholder = "własny powód"; inny.style.display = "none";
  const odrz = document.createElement("button"); odrz.className = "btn nie"; odrz.textContent = "Odrzuć"; odrz.disabled = true;
  sel.onchange = () => { inny.style.display = sel.value === "inny" ? "" : "none"; odrz.disabled = !sel.value; };
  ok.onclick = () => { DECYZJE[a.id + ":" + i] = { d: "zatwierdzone" }; dalej(); };
  odrz.onclick = () => { DECYZJE[a.id + ":" + i] = { d: "odrzucone", powod: sel.value === "inny" ? (inny.value || "inny") : sel.value }; dalej(); };
  el.append(ok, sel, inny, odrz);
  if (d) { const s = document.createElement("span"); s.className = "szary"; s.textContent = d.d === "zatwierdzone" ? "✓ zatwierdzone" : "✗ odrzucone: " + d.powod; el.append(s); }
}
