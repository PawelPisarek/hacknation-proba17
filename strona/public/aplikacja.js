// Strona MVP (zad. 29, 28, 27): przeniesione z makieta/r3/aplikacja.js; dane z usługi (dane-zywe.js), nie udawane.
// Makieta R3 (zadanie 34: P73 A, P74 A, P76 A, P77 A, krytyk R2 brak 7). Jak R2: E1 logowanie → E2 wybór partii → E3 lista partii → E4 auto (widok C) / E5 brak wzorca → E6 zmiana rodzaju → E7 raport.
// Stan tylko w pamięci strony (udawane dane, bez backendu). Zmiany względem R1 — docs/decyzje.md (zadanie 22, R2).
const $ = (i) => document.getElementById(i);
const S = { kto: "", miejsce: "", pliki: [], partia: [], liczy: false, zamknieta: false,
  ia: 0, im: 0, budzenie: 0, zoom: 1, wzn: 0, zRodz: null, idKontroli: "", wszystkie: false, potwierdz: false };

function ekran(id) {
  document.querySelectorAll(".ekr").forEach((e) => e.classList.toggle("on", e.id === id));
  $("kto").textContent = S.kto ? S.kto + " · " + S.miejsce : "";
  scrollTo(0, 0);
}
const godzina = () => new Date().toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
const sortuj = (ms) => ms.map((x) => ({ ...x })).sort((a, b) => b.sila - a.sila); // A2: od najbardziej różnego (P79 B: bez słów)
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------- E1 ----------
$("start").onclick = () => { S.kto = $("funk").value; S.miejsce = $("miejsce").value; ekran("E2"); rysujE2(); };

// ---------- E2 ----------
function rysujE2() {
  $("wybrane").innerHTML = S.pliki.map((p) => `<li>${esc(nazwaAuta(p))}${p.wlasny ? ` <span class="szary">— ${PRZYKLAD}</span>` : ""}${p.zepsuty ? ' <span class="szary">(plik nieczytelny)</span>' : ""}</li>`).join("") || '<li class="szary">nic nie wybrano</li>';
  $("policz").disabled = !S.pliki.length;
}
$("wskaz").onclick = () => $("plik").click();   // P62 A: prawdziwy wybór plików z dysku
$("pokazowa").onclick = () => { S.pliki = Array.from({ length: POKAZOWA }, (_, i) => ({ nazwa: `skan_${String(i + 1).padStart(2, "0")}.bmp`, nrPartii: i, url: `/api/obraz?partia=${i}` })); rysujE2(); };   // zad. 28: miniatura od razu, przed liczeniem; P60 B: 7 aut, trudny w środku partii bez oznaczenia
// Własny plik: sprawdzamy nagłówek „BM” (P53 A — zepsuty plik dostaje komunikat, reszta liczy się dalej);
// wynik to przykład z auta 1 z napisem P62 A, obraz — Twój plik (przeglądarka zwykle umie pokazać .bmp).
async function wlasnyPlik(f) {
  const nag = new Uint8Array(await f.slice(0, 2).arrayBuffer());
  const ok = nag[0] === 0x42 && nag[1] === 0x4d && f.size > 54;
  return { plik: f.name, nazwa: f.name, plikF: ok ? f : null, url: ok ? URL.createObjectURL(f) : null, zepsuty: !ok };
}
$("plik").onchange = async () => { S.pliki = await Promise.all([...$("plik").files].map(wlasnyPlik)); $("plik").value = ""; rysujE2(); };
$("policz").onclick = () => { nowaPartia(); ekran("E3"); liczPoKolei(0); };

function zrobAuto(p, id) {
  return { ...p, id, stan: p.zepsuty ? "plik nieczytelny" : "czeka", rodzajOperatora: null, miejsca: [], oryg: [],
    decyzje: {}, nr: "", zamkniete: false, otwarte: false, kiedy: "" };
}
function nowaPartia() {
  S.partia = S.pliki.map((p, i) => zrobAuto(p, i + 1));
  S.zamknieta = false; S.potwierdz = false;
  S.idKontroli = "K-" + new Date().toISOString().slice(0, 10).replaceAll("-", "") + "-" + String(Math.floor(Math.random() * 900) + 100);
}
const wynikStanu = (a) => (a.zepsuty ? "plik nieczytelny" : brakWzorca(a) ? "brak wzorca" : "gotowe");
const policzone = () => S.partia.length && S.partia.every((a) => !["czeka", "liczy się"].includes(a.stan));
async function liczPoKolei(od) {   // partia liczy się po kolei (P12), wejście w auto po całej partii (P38)
  if (S.liczy) return; S.liczy = true;
  for (let i = od; i < S.partia.length; i++) {
    const a = S.partia[i]; if (a.stan !== "czeka") continue;
    a.stan = "liczy się"; rysujE3();
    try { przyjmij(a, await liczAuto(a)); } catch (e) { a.zepsuty = true; a.blad = e.message; }
    a.stan = wynikStanu(a); rysujE3();
  }
  S.liczy = false; rysujE3(); karta();
  if (S.poLiczeniu) { const f = S.poLiczeniu; S.poLiczeniu = null; f(); }
}

// ---------- E3 ----------
// P74 A: „brak decyzji” tylko dla auta z nierozstrzygniętymi miejscami; auto bez miejsc = „obejrzane, bez wskazań”; brak wzorca = „brak wzorca — obejrzyj ręcznie” (krytyk R3 brak 2)
const miejscaAuta = (a) => (brakWzorca(a) ? [] : a.miejsca);
const bezDecyzji = (a) => !a.zepsuty && miejscaAuta(a).some((_, j) => !a.decyzje[j]);
const BW_RECZNIE = "brak wzorca — obejrzyj ręcznie";   // krytyk R3 brak 2 (E5, P58 A): auto bez wzorca nigdy „bez wskazań”
function rysujE3() {
  const n = S.partia.length, g = S.partia.filter((a) => !["czeka", "liczy się"].includes(a.stan)).length, gotowa = policzone();
  $("p-ile").textContent = n + " aut";
  $("p-stan").textContent = S.zamknieta ? "rozstrzygnięte" : gotowa ? "gotowe" : `liczy się ${g}/${n}`;
  $("p-stan").className = "stan " + (S.zamknieta ? "rozstrz" : gotowa ? "" : "liczy");
  $("p-pasek").style.width = (100 * g / n) + "%";
  $("p-wiersze").innerHTML = S.partia.map((a, i) => {
    const st = S.zamknieta && !a.zepsuty ? "rozstrzygnięte" : a.stan;
    const cls = { czeka: "czeka", "liczy się": "liczy", gotowe: "", "brak wzorca": "brak", "plik nieczytelny": "brak", rozstrzygnięte: "rozstrz" }[st];
    const bw = a.stan === "brak wzorca", rodz = a.rodzajOperatora || a.rodzaj, liczone = ["czeka", "liczy się"].includes(a.stan);
    const zost = a.miejsca.filter((_, j) => !a.decyzje[j]).length;
    const klik = gotowa && !S.zamknieta && !a.zepsuty;
    const mini = a.zepsuty || !obrazBadany(a) ? '<div class="szary">—</div>' : `<img class="mini" src="${obrazBadany(a)}" alt="">`;
    return `<tr data-i="${i}" class="${klik ? "klik" : "zablok"}"><td>${mini}</td>
      <td><b>auto ${a.id}</b>${a.nr ? " · " + esc(a.nr) : ""}<br><span class="szary">${esc(nazwaAuta(a))}</span>${a.wlasny ? `<br><span class="szary">${PRZYKLAD}</span>` : ""}</td>
      <td>${liczone || a.zepsuty ? "—" : NAZWA[rodz]}</td>
      <td><span class="stan ${cls}">${st}</span>${a.zamkniete && !S.zamknieta ? ' <span class="szary">✓ auto zamknięte</span>' : ""}
        ${a.zepsuty ? `<div class="blad">${a.blad ? esc(a.blad) + ". " : "Nie da się odczytać pliku — to nie jest obraz .bmp albo plik jest uszkodzony. "}Pozostałe auta liczą się dalej.</div>` : ""}</td>
      <td>${liczone || a.zepsuty ? "—" : brakWzorca(a) ? `— <span class="szary">· ${BW_RECZNIE}</span>` : !miejscaAuta(a).length ? `0 <span class="szary">· ${stanBezMiejsc(a)}</span>` : a.miejsca.length + (gotowa ? ` <span class="szary">(zostało ${zost})</span>` : "")}</td></tr>`;
  }).join("");
  $("p-wiersze").querySelectorAll("tr.klik").forEach((t) => (t.onclick = () => otworzAuto(+t.dataset.i)));
  const wszystkieObejrzane = gotowa && S.partia.every((a) => a.zepsuty || a.zamkniete);
  $("p-info").textContent = S.zamknieta ? "Partia zamknięta — decyzji nie można już zmieniać." :
    !gotowa ? "Auta liczą się po kolei. Wejście w auto — po policzeniu całej partii." :
    wszystkieObejrzane ? "Wszystkie auta zamknięte. Otwórz „Raport partii” — decyzje możesz jeszcze zmienić z tej listy." :
    "Kliknij auto, żeby je obejrzeć. Decyzje można zmieniać z tej listy do zamknięcia partii.";
  $("doraportu").disabled = !gotowa; $("doraportu").style.display = S.zamknieta ? "none" : "";
  $("dodaj").style.display = S.zamknieta ? "none" : ""; $("dodaj").disabled = S.liczy;
  $("nowa").style.display = S.zamknieta ? "" : "none";
}
$("doraportu").onclick = () => { S.potwierdz = false; ekran("E7"); rysujE7(); };
$("dodaj").onclick = () => $("plik1").click();   // P61 A: jeden obraz dopisuje się jako kolejne auto i liczy się
$("plik1").onchange = async () => {
  const f = $("plik1").files[0]; $("plik1").value = ""; if (!f) return;
  S.partia.push(zrobAuto(await wlasnyPlik(f), S.partia.length + 1)); rysujE3(); liczPoKolei(S.partia.length - 1);
};
$("nowa").onclick = () => { S.pliki = []; S.partia = []; S.zamknieta = false; ekran("E2"); rysujE2(); };   // P65 A

// ---------- E4 / E5 ----------
const A = () => S.partia[S.ia];
const nazwaAuta = (a) => a.nazwa || a.plik;   // P60 B: auta pokazowe mają neutralną nazwę (skan_NN.bmp), własny plik — swoją
const ustawSrc = (id, u) => { if (u == null) $(id).removeAttribute("src"); else if ($(id).getAttribute("src") !== u) $(id).setAttribute("src", u); };
function otworzAuto(i) {
  S.ia = i; const a = A(); a.otwarte = true; W = a.szer || 1024; H = a.wys || 256;
  document.querySelectorAll(".okno").forEach((o) => (o.style.aspectRatio = `${W} / ${H}`));   // decyzja 15:29 (P80 A)
  S.im = Math.max(0, a.miejsca.findIndex((_, j) => !a.decyzje[j])); S.zoom = 1; S.wzn = 0; S.wszystkie = false;   // stan auta nie przechodzi na następne (P57 A, P40 B)
  przyciskiZoom(); ekran("E4"); $("a-nrinfo").textContent = ""; rysujAuto();
}
function brakWzorca(a) { return !Z_WZORCEM.includes(a.rodzajOperatora || a.rodzaj); }
const widoczne = (a) => (S.wszystkie ? a.miejsca.length : Math.min(ILE_NA_LISCIE, a.miejsca.length));   // P57 A
function rysujAuto() {
  const a = A(), rodz = a.rodzajOperatora || a.rodzaj, bw = brakWzorca(a);
  $("a-nazwa").textContent = `auto ${a.id} z ${S.partia.length}`; $("a-plik").textContent = a.nr || nazwaAuta(a);
  $("a-nr").value = a.nr; $("a-nr").classList.toggle("alarm", !!$("a-nrinfo").textContent && !a.nr);
  $("a-przyklad").style.display = a.wlasny ? "" : "none"; $("a-przyklad").textContent = PRZYKLAD;
  ustawSrc("imgB", obrazBadany(a));
  ["obB", "obW"].forEach((id) => { $(id).style.width = (100 * S.zoom) + "%"; $(id).querySelectorAll(".ramka, .wycinek").forEach((r) => r.remove()); });
  $("a-rodzaj").textContent = NAZWA[rodz] + (a.rodzajOperatora ? ` (program: ${NAZWA[a.rodzaj]})` : "");
  $("zmienrodz").style.display = S.zmianaRodzaju ? "" : "none";   // zad. 27 (P24 B / P27 A: do oddania 27 ukryty)
  // P77 A: „Zamknij auto” zawsze widoczny przy „Nr rej.” (Enter — skrót); aktywny, gdy wszystkie miejsca rozstrzygnięte
  $("a-zamknij").disabled = S.zamknieta || !(bw || !a.miejsca.length || a.miejsca.every((_, j) => a.decyzje[j]));
  $("a-zamknij").title = S.zamknieta ? "partia zamknięta" : $("a-zamknij").disabled ? "najpierw rozstrzygnij wszystkie miejsca" : "";
  $("a-nr").disabled = S.zamknieta;
  $("a-dwa").style.gridTemplateColumns = bw ? "1fr" : "";
  $("a-wz").style.display = bw ? "none" : "";
  // E5 (P35 A): jeden napis nad obrazem (nie na nim — podwozie zostaje widoczne), bez ramek i kafelków
  $("a-bw").style.display = bw ? "" : "none"; $("a-bw").textContent = BRAK_WZORCA;
  if (bw) {
    $("a-wiecej").innerHTML = "";
    $("a-ramki").innerHTML = `· rodzaj: ${rodz ? NAZWA[rodz] : "nieustalony"}` + (S.zmianaRodzaju ? ' <button class="btn jasny" style="padding:2px 8px" id="zmienrodz2">Zmień rodzaj</button>' : "");
    if (S.zmianaRodzaju) $("zmienrodz2").onclick = zmienRodzaj;
    $("a-kafle").innerHTML = '<div class="szary" style="padding:6px 0">Przybliż obraz (1×/2×/4× albo kliknij w obraz) i obejrzyj go sam.</div>';
    rysujZamknij(a); return;
  }
  ustawSrc("imgW", obrazWzorca(a, rodz, S.wzn));
  document.querySelectorAll("[data-w]").forEach((b) => (b.className = +b.dataset.w === S.wzn ? "on" : ""));
  $("a-wiecej").innerHTML = "";
  if (!a.miejsca.length) {   // A3, P58 A
    $("a-ramki").textContent = "· brak wskazań";
    $("a-kafle").innerHTML = `<div class="brakwsk">${BRAK_WSKAZAN}</div>`;
    rysujZamknij(a); return;
  }
  const n = widoczne(a), reszta = a.miejsca.length - n;
  $("a-ramki").textContent = "· ramki 1–" + n + (reszta ? ` z ${a.miejsca.length}` : "");
  a.miejsca.slice(0, n).forEach((x, i) => {
    const d = a.decyzje[i];
    for (const [ob, przer] of [["obB", false], ["obW", true]]) {
      const r = document.createElement(przer ? "div" : "button");
      r.className = "ramka " + kl() + (i === S.im ? " wyb" : "") + (d ? " " + d.d : "");
      Object.assign(r.style, { left: pct(x.x0, W), top: pct(x.y0, H), width: pct(x.x1 - x.x0, W), height: pct(x.y1 - x.y0, H) });
      if (przer) r.style.borderStyle = "dashed";
      const et = `${i + 1}`;   // P79 B: sam numer
      r.innerHTML = `<span data-pelny="${et}" data-krotki="${i + 1}">${et}</span>`;
      r.onclick = (e) => { e.stopPropagation(); wybierz(i); };
      $(ob).appendChild(r);
    }
  });
  $("a-kafle").innerHTML = a.miejsca.slice(0, n).map((x, i) => {
    const d = a.decyzje[i], st = d ? d.d : "oczekuje";
    return `<div class="kaf ${i === S.im ? "wyb" : ""}" data-i="${i}"><div class="para"><div class="lupa" data-l="b"></div><div class="lupa" data-l="w"></div></div>
      <div class="opis"><b>${i + 1}</b><span class="st ${st}">${st}${d && d.powod ? ": " + esc(d.powod) : ""}</span></div>
      ${(() => { const p = podpowiedzMiejsca(x, a); return `<div class="podp ${p.znany ? "" : "uwaga"}">${p.tekst}</div>`; })()}</div>`;
  }).join("");
  $("a-wiecej").innerHTML = reszta ? `<div class="wiecej" id="pokazwiecej">i jeszcze ${reszta} miejsc — pokaż</div>` : "";
  if (reszta) $("pokazwiecej").onclick = () => { S.wszystkie = true; rysujAuto(); };
  $("a-kafle").querySelectorAll(".kaf").forEach((el) => {
    const x = a.miejsca[+el.dataset.i];
    lupa(el.querySelector('[data-l="b"]'), obrazBadany(a), x); lupa(el.querySelector('[data-l="w"]'), obrazWzorca(a, rodz, S.wzn), x);
    el.onclick = () => wybierz(+el.dataset.i);
  });
  rysujDecyzje(a);
  requestAnimationFrame(() => { ["obB", "obW"].forEach(ulozEtykiety); przypnijEtykiete(); });
}
function lupa(el, src, x, zoom = 6) {
  const cx = (x.x0 + x.x1) / 2, cy = (x.y0 + x.y1) / 2, bw = el.clientWidth || 90, bh = el.clientHeight || 64, s = bw / (W / zoom);
  Object.assign(el.style, { backgroundImage: `url(${src})`, backgroundSize: `${W * s}px ${H * s}px`, backgroundPosition: `${bw / 2 - cx * s}px ${bh / 2 - cy * s}px` });
  el.innerHTML = `<div class="lupa-ramka" style="left:${bw / 2 - (cx - x.x0) * s}px;top:${bh / 2 - (cy - x.y0) * s}px;width:${(x.x1 - x.x0) * s}px;height:${(x.y1 - x.y0) * s}px"></div>`;
}
function rysujDecyzje(a) {
  const el = $("a-dec"), i = S.im, x = a.miejsca[i], d = a.decyzje[i];
  el.innerHTML = `<b>miejsce ${i + 1}</b> `;
  const ok = Object.assign(document.createElement("button"), { className: "btn ok", textContent: "Zatwierdź" });
  // jedna kontrolka „Odrzuć ▾ powód” (spec E4): wybór powodu od razu odrzuca; „inny” — wpis i Enter / OK
  const sel = Object.assign(document.createElement("select"), { className: "btn nie" });
  sel.innerHTML = '<option value="">Odrzuć ▾ powód</option>' + POWODY.map((p) => `<option>${p}</option>`).join("");
  const inny = Object.assign(document.createElement("input"), { placeholder: "własny powód, Enter" }); inny.style.display = "none";
  const innyOk = Object.assign(document.createElement("button"), { className: "btn nie", textContent: "OK" }); innyOk.style.display = "none";
  sel.onchange = () => {
    if (sel.value === "inny") { inny.style.display = innyOk.style.display = ""; inny.focus(); }
    else if (sel.value) decyduj(a, i, { d: "odrzucone", powod: sel.value });
  };
  const odrzucInny = () => decyduj(a, i, { d: "odrzucone", powod: inny.value.trim() || "inny" });
  inny.onkeydown = (e) => { if (e.key === "Enter") odrzucInny(); }; innyOk.onclick = odrzucInny;
  ok.onclick = () => decyduj(a, i, { d: "zatwierdzone" });
  el.append(ok, sel, inny, innyOk);
  if (S.zamknieta) {   // odbiór 29 (A13): po zamknięciu partii przyciski widoczne, ale wyszarzone
    ok.disabled = sel.disabled = true;
    return el.insertAdjacentHTML("beforeend", '<span class="szary">partia zamknięta — decyzji nie można już zmieniać</span>');
  }
  if (d) el.insertAdjacentHTML("beforeend", `<span class="szary">teraz: ${d.d}${d.powod ? " (" + esc(d.powod) + ")" : ""} — możesz zmienić</span>`);
  const zost = a.miejsca.filter((_, j) => !a.decyzje[j]).length;
  el.insertAdjacentHTML("beforeend", `<span class="szary">zostało ${zost} z ${a.miejsca.length}</span>`);
}
function decyduj(a, i, d) {
  a.decyzje[i] = d; a.kiedy = godzina();   // P64 A: godzina ostatniej decyzji operatora w aucie
  const n = a.miejsca.findIndex((_, j) => !a.decyzje[j]);
  if (n >= 0) { if (n >= widoczne(a)) S.wszystkie = true; return wybierz(n); }
  rysujAuto(); dalejPoAucie(a);   // P40 B: po ostatnim miejscu następne auto
}
function rysujZamknij() {   // P77 A: przycisk „Zamknij auto” jest przy polu „Nr rej.”
  $("a-dec").innerHTML = S.zamknieta ? '<span class="szary">partia zamknięta</span>' : '<span class="szary">Wpisz nr rej. i kliknij „Zamknij auto” przy polu „Nr rej.”.</span>';
}
$("a-zamknij").onclick = () => dalejPoAucie(A());
const NR_INFO = "Wpisz nr rej. naczepy, potem kliknij „Zamknij auto” (albo Enter).";
function dalejPoAucie(a) {
  a.nr = $("a-nr").value.trim().toUpperCase();
  if (!a.nr) {   // A9: nr rej. przed zatwierdzeniem wyniku auta; jeden napis, nie dopisuje się przy kolejnym kliknięciu
    $("a-nr").classList.add("alarm"); $("a-nr").focus();
    $("a-nrinfo").textContent = NR_INFO;   // P77 A: przy polu „Nr rej.”, z nazwą przycisku
    return;
  }
  $("a-nrinfo").textContent = "";
  a.zamkniete = true; if (!a.miejsca.length) a.kiedy = godzina();   // auto bez miejsc: decyzją jest zamknięcie auta
  const n = S.partia.findIndex((b, j) => j > S.ia && !b.zamkniete && !b.zepsuty);
  if (n >= 0) otworzAuto(n); else { ekran("E3"); rysujE3(); }   // P54 A: po ostatnim aucie lista partii z „Raport partii”
}
$("a-nr").oninput = () => { A().nr = $("a-nr").value.trim().toUpperCase(); if (A().nr) { $("a-nrinfo").textContent = ""; $("a-nr").classList.remove("alarm"); } };
$("a-nr").onkeydown = (e) => { if (e.key !== "Enter") return; const a = A();
  if ($("a-nr").classList.contains("alarm") || !a.miejsca.length || brakWzorca(a) || a.miejsca.every((_, j) => a.decyzje[j])) dalejPoAucie(a); };
function wybierz(i, bezZoomu) {
  S.im = i; if (!bezZoomu && S.zoom < 4) { S.zoom = 4; przyciskiZoom(); }
  rysujAuto(); const x = A().miejsca[i]; if (!x) return; doMiejsca((x.x0 + x.x1) / 2, (x.y0 + x.y1) / 2);
}
function doMiejsca(cx, cy) {
  const o = $("ob"); requestAnimationFrame(() => {
    o.scrollLeft = cx / W * o.scrollWidth - o.clientWidth / 2; o.scrollTop = cy / H * o.scrollHeight - o.clientHeight / 2; synch(o, $("ow"));
  });
}
function synch(z, d) { d.scrollLeft = z.scrollLeft; d.scrollTop = z.scrollTop; }
let blok = false;
[["ob", "ow"], ["ow", "ob"]].forEach(([z, d]) => $(z).addEventListener("scroll", () => { if (blok) return; blok = true; synch($(z), $(d)); requestAnimationFrame(() => (blok = false)); }));
function przyciskiZoom() { document.querySelectorAll("[data-z]").forEach((b) => (b.className = +b.dataset.z === S.zoom ? "on" : "")); }
document.querySelectorAll("[data-z]").forEach((b) => (b.onclick = () => { S.zoom = +b.dataset.z; przyciskiZoom(); rysujAuto(); }));
document.querySelectorAll("[data-w]").forEach((b) => (b.onclick = () => { S.wzn = +b.dataset.w; rysujAuto(); }));   // P70 A: wzorzec 1 / 2
$("imgB").addEventListener("click", (e) => {   // klik w obraz = lupa w tym miejscu (także E5)
  const r = $("imgB").getBoundingClientRect(), cx = (e.clientX - r.left) / r.width * W, cy = (e.clientY - r.top) / r.height * H;
  if (S.zoom < 4) { S.zoom = 4; przyciskiZoom(); rysujAuto(); } doMiejsca(cx, cy);
});
$("dolisty").onclick = () => { ekran("E3"); rysujE3(); };   // P69 A: wolno wrócić z miejscami „oczekuje”
$("imgB").onload = () => { if ($("E4").classList.contains("on")) rysujAuto(); };
addEventListener("resize", () => { if ($("E4").classList.contains("on")) rysujAuto(); });

// ---------- E6 ----------
function zmienRodzaj() {
  const a = A(); S.zRodz = a.rodzajOperatora || a.rodzaj; ekran("E6");
  $("z-auto").textContent = `auto ${a.id} (${a.nr || nazwaAuta(a)})`; $("z-bad").src = obrazBadany(a);
  $("z-rodz").innerHTML = RODZAJE.map((r) => `<label><input type="radio" name="rodz" value="${r}" ${r === S.zRodz ? "checked" : ""}>${NAZWA[r]}${r === a.rodzaj ? ' <span class="szary">(program)</span>' : ""}</label>`).join("");
  $("z-rodz").querySelectorAll("input").forEach((i) => (i.onchange = () => { S.zRodz = i.value; podgladWz(); }));
  podgladWz();
}
function podgladWz() {   // P70 A: 2 wzorce wybranego rodzaju najbliższe badanemu, z numerami 1 i 2
  const a = A(), ma = Z_WZORCEM.includes(S.zRodz);
  [0, 1].forEach((i) => {
    if (ma) $("z-w" + i).src = obrazWzorca(a, S.zRodz, i); else $("z-w" + i).removeAttribute("src");
    $("z-c" + i).textContent = ma ? `wzorzec ${i + 1} — ${NAZWA[S.zRodz]}` : (i ? "" : `${NAZWA[S.zRodz]}: ${BRAK_WZORCA}`);
  });
}
$("zmienrodz").onclick = zmienRodzaj;
$("z-anuluj").onclick = () => { ekran("E4"); rysujAuto(); };
$("z-zast").onclick = () => {   // P24 B, P27 A: przeliczenie od nowa, decyzje auta znikają, raport z oboma rodzajami
  const a = A(); a.rodzajOperatora = S.zRodz === a.rodzaj ? null : S.zRodz; a.decyzje = {}; a.zamkniete = false; a.kiedy = "";
  a.miejsca = brakWzorca(a) ? [] : sortuj(a.rodzajOperatora ? MIEJSCA_PO_ZMIANIE : a.oryg);
  a.stan = brakWzorca(a) ? "brak wzorca" : "gotowe"; S.im = 0; S.zoom = 1; S.wzn = 0; S.wszystkie = false; przyciskiZoom();
  ekran("E4"); rysujAuto();
};

// ---------- E7 ----------
function wierszeRaportu() {
  return S.partia.filter((a) => !a.zepsuty).map((a) => ({
    id_kontroli: S.idKontroli, auto: a.id, plik: nazwaAuta(a), nr_rej: a.nr || "",
    rodzaj_programu: (a.rodzaj ? NAZWA[a.rodzaj] : "nieustalony") + (Z_WZORCEM.includes(a.rodzaj) ? "" : " (brak wzorca)"), bez_wzorca: brakWzorca(a), rodzaj_operatora: a.rodzajOperatora ? NAZWA[a.rodzajOperatora] : "",
    liczba_miejsc: brakWzorca(a) ? 0 : a.miejsca.length, wynik_przykladowy: !!a.wlasny,
    decyzje: a.miejsca.map((x, i) => ({ nr: i + 1, decyzja: a.decyzje[i]?.d || "brak decyzji", powod: a.decyzje[i]?.powod || "" })),
    kto: a.kiedy ? S.kto : "—", miejsce_kontroli: S.miejsce, data_godzina: a.kiedy || "—",   // P64 A / P22 A: osoba i godzina ostatniej decyzji (decyzja o miejscu albo zamknięcie auta)
    zamkniete: a.zamkniete, otwarte: !!a.otwarte,   // krytyk R3 brak 3
    brak_decyzji: bezDecyzji(a),   // P63 B, P83 A: ostrzeżenie przy „Zapisz i zamknij partię”
  }));
}
function rysujE7() {
  const w = wierszeRaportu();
  $("r-id").textContent = "· " + S.idKontroli;
  $("r-naglowek").textContent = `${S.kto} · ${S.miejsce} · ${w.length} aut · ${S.zamknieta ? "partia zamknięta" : "partia otwarta"}`;
  $("r-wiersze").innerHTML = w.map((r) => `<tr><td>auto ${r.auto}${r.wynik_przykladowy ? `<br><span class="szary">${PRZYKLAD}</span>` : ""}</td><td>${r.nr_rej ? esc(r.nr_rej) : '<span class="szary">—</span>'}</td><td>${r.rodzaj_programu}</td><td>${r.rodzaj_operatora || "—"}</td>
    <td>${r.liczba_miejsc}</td><td>${r.decyzje.map((d) => `${d.nr}: ${d.decyzja}${d.powod ? " (" + esc(d.powod) + ")" : ""}`).join("<br>") || (r.bez_wzorca ? BW_RECZNIE : stanBezMiejsc(r))}</td>
    <td>${r.kto}</td><td>${r.miejsce_kontroli}</td><td>${r.data_godzina}</td></tr>`).join("");
  $("zapisz").style.display = S.zamknieta ? "none" : ""; $("r-nowa").style.display = S.zamknieta ? "" : "none";
  const braki = w.filter((r) => r.brak_decyzji);
  $("r-ostrz").innerHTML = S.potwierdz && braki.length && !S.zamknieta ?
    `<div class="ostrz">Brak decyzji: ${braki.map((r) => "auto " + r.auto + (r.nr_rej ? " (" + esc(r.nr_rej) + ")" : "")).join(", ")}. Zapisać raport i zamknąć partię mimo to?
      <div class="przyciski" style="margin-top:8px"><button class="btn nie" id="mimo">Zapisz mimo to</button><button class="btn jasny" id="wroc">Wróć do listy</button></div></div>` : "";
  if ($("mimo")) { $("mimo").onclick = zapiszIZamknij; $("wroc").onclick = () => { S.potwierdz = false; ekran("E3"); rysujE3(); }; }
}
function pobierz(nazwa, tresc, typ) {
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([tresc], { type: typ })), download: nazwa });
  document.body.append(a); a.click(); a.remove();
}
function zapiszIZamknij() {   // P55 B / P56 A: jeden przycisk — zapis .json i .csv + zamknięcie partii
  const w = wierszeRaportu().map(({ brak_decyzji, ...r }) => r);
  pobierz("raport-partii.json", JSON.stringify(w, null, 2), "application/json");
  const csv = ["id_kontroli;auto;plik;nr_rej;rodzaj_programu;rodzaj_operatora;miejsce;decyzja;powod;kto;miejsce_kontroli;data_godzina"]
    .concat(w.flatMap((r) => (r.decyzje.length ? r.decyzje : [{ nr: "", decyzja: "", powod: "" }])
      .map((d) => [r.id_kontroli, r.auto, r.plik, r.nr_rej, r.rodzaj_programu, r.rodzaj_operatora, d.nr, d.decyzja, d.powod, r.kto, r.miejsce_kontroli, r.data_godzina].join(";")))).join("\n");
  pobierz("raport-partii.csv", "﻿" + csv, "text/csv");
  S.zamknieta = true; S.potwierdz = false;
  $("r-info").textContent = "Zapisano raport-partii.json i raport-partii.csv; partia zamknięta. W wersji pod linkiem pliki pobrała przeglądarka.";
  rysujE7();
}
$("zapisz").onclick = () => {   // P63 B: ostrzeżenie z listą aut bez decyzji, zapis po potwierdzeniu
  if (wierszeRaportu().some((r) => r.brak_decyzji)) { S.potwierdz = true; return rysujE7(); }
  zapiszIZamknij();
};
$("r-nowa").onclick = () => $("nowa").onclick();   // P65 A
$("r-lista").onclick = () => { S.potwierdz = false; ekran("E3"); rysujE3(); };
ekran("E1"); karta();
// ?partia=1&auto=N — od razu stanowisko domyślne, partia pokazowa i auto N (pokaz, zrzuty)
const QS = new URLSearchParams(location.search);
if (QS.get("partia")) {
  $("start").onclick(); $("pokazowa").onclick();
  const nr = Number(QS.get("auto")) || 0;
  if (nr) S.poLiczeniu = () => otworzAuto(Math.min(S.partia.length, nr) - 1);
  $("policz").onclick();
}

// ---------- P73 A / P76 A: etykiety ramek ----------
// Sam numer miejsca (P79 B: bez słów poziomu) w małej etykiecie OBOK ramki (nad, pod, z prawej, z lewej — pierwsze wolne
// miejsce w obrazie), bez nakładania na inne etykiety i ramki; gdy ciasno — w ramce od środka (pełny opis jest w kafelku).
const nachodzi = (q, lista) => lista.some((z) => q.x < z.x + z.w && z.x < q.x + q.w && q.y < z.y + z.h && z.y < q.y + q.h);
const ODSTEP = 4;   // krytyk R3 brak 6: etykiety nie stykają się (także telefon)
const zOdstepem = (q) => ({ x: q.x - ODSTEP, y: q.y - ODSTEP, w: q.w + 2 * ODSTEP, h: q.h + 2 * ODSTEP });
const prost = (r) => ({ x: r.offsetLeft, y: r.offsetTop, w: r.offsetWidth, h: r.offsetHeight });
function ulozEtykiety(id) {
  const ob = $(id), Wp = ob.clientWidth, Hp = ob.clientHeight, etykiety = [];
  const ramki = [...ob.querySelectorAll(".ramka")].sort((a, b) => b.classList.contains("wyb") - a.classList.contains("wyb"));
  const pola = ramki.map(prost);
  ramki.forEach((r, k) => {
    const sp = r.querySelector("span"), R = pola[k], inne = pola.filter((_, j) => j !== k), g = 2;
    sp.classList.remove("przyp");
    const ustaw = (x, y, w, h) => { sp.style.left = (x - R.x - 2) + "px"; sp.style.top = (y - R.y - 2) + "px"; etykiety.push({ x, y, w, h }); };
    for (const tekst of [sp.dataset.pelny, sp.dataset.krotki]) {
      sp.textContent = tekst; const w = sp.offsetWidth, h = sp.offsetHeight;
      const kand = [[R.x, R.y - h - g], [R.x + R.w - w, R.y - h - g], [R.x, R.y + R.h + g], [R.x + R.w - w, R.y + R.h + g],
        [R.x + R.w + g, R.y], [R.x - w - g, R.y], [R.x + R.w + g, R.y + R.h - h], [R.x - w - g, R.y + R.h - h]];
      const dobra = kand.find(([x, y]) => x >= 0 && y >= 0 && x + w <= Wp && y + h <= Hp && !nachodzi(zOdstepem({ x, y, w, h }), etykiety) && !nachodzi({ x, y, w, h }, inne));
      if (dobra) return ustaw(dobra[0], dobra[1], w, h);
    }
    // ciasno (np. telefon 1×): sam numer w pierwszym miejscu w obrazie, które nie zasłania innej etykiety
    sp.textContent = sp.dataset.krotki; const w = sp.offsetWidth, h = sp.offsetHeight;
    const kand = [[R.x, R.y - h - g], [R.x, R.y + R.h + g], [R.x + R.w + g, R.y], [R.x - w - g, R.y], [R.x + R.w - w, R.y - h - g], [R.x + R.w - w, R.y + R.h + g], [R.x + 1, R.y + 1], [R.x + R.w - w - 1, R.y + R.h - h - 1]]
      .map(([x, y]) => [Math.min(Math.max(0, x), Wp - w), Math.min(Math.max(0, y), Hp - h)]);
    const [x, y] = kand.find(([x, y]) => !nachodzi(zOdstepem({ x, y, w, h }), etykiety)) || kand.find(([x, y]) => !nachodzi({ x, y, w, h }, etykiety)) || kand[0];
    ustaw(x, y, w, h);
  });
}
// P76 A: w przybliżeniu ramka większa od okna nie znika — etykieta wybranego miejsca trzyma się widocznej części ramki,
// a ramka, której brzegi wypadły poza okno, dostaje białą obwódkę od środka (.ciecie), żeby było widać, co jest miejscem.
function przypnijEtykiete() {
  for (const [ok, ob] of [["ob", "obB"], ["ow", "obW"]]) {
    const o = $(ok), r = $(ob).querySelector(".ramka.wyb"); if (!r) continue;
    const sp = r.querySelector("span"), R = prost(r), V = { x: o.scrollLeft, y: o.scrollTop, w: o.clientWidth, h: o.clientHeight };
    const ciecie = R.x < V.x || R.y < V.y || R.x + R.w > V.x + V.w || R.y + R.h > V.y + V.h;
    r.classList.toggle("ciecie", ciecie);
    // widoczna część ramki (przecięcie z oknem) — biała przerywana obwódka od środka: „to całe pole to miejsce N”
    let wy = $(ob).querySelector(".wycinek");
    if (!ciecie) { if (wy) wy.remove(); }
    else {
      if (!wy) { wy = document.createElement("div"); wy.className = "wycinek " + [...r.classList].filter((c) => /^s\d$/.test(c)).join(" "); wy.innerHTML = '<span class="wskaz">ramka większa niż widok</span>'; $(ob).appendChild(wy); }   // krytyk R3 brak 5
      const x0 = Math.max(R.x, V.x), y0 = Math.max(R.y, V.y), x1 = Math.min(R.x + R.w, V.x + V.w), y1 = Math.min(R.y + R.h, V.y + V.h);
      Object.assign(wy.style, { left: x0 + "px", top: y0 + "px", width: Math.max(0, x1 - x0) + "px", height: Math.max(0, y1 - y0) + "px" });
    }
    const L = { x: R.x + sp.offsetLeft + 2, y: R.y + sp.offsetTop + 2, w: sp.offsetWidth, h: sp.offsetHeight };
    if (!sp.classList.contains("przyp") && L.x >= V.x && L.y >= V.y && L.x + L.w <= V.x + V.w && L.y + L.h <= V.y + V.h) continue;
    const x = Math.max(R.x, V.x) + 3, y = Math.max(R.y, V.y) + 3;   // lewy górny róg widocznej części ramki, od środka
    if (x > Math.min(V.x + V.w, R.x + R.w) || y > Math.min(V.y + V.h, R.y + R.h)) continue;
    sp.textContent = sp.dataset.pelny; sp.classList.add("przyp");
    sp.style.left = (x - R.x - 2) + "px"; sp.style.top = (y - R.y - 2) + "px";
  }
}
["ob", "ow"].forEach((id) => $(id).addEventListener("scroll", () => requestAnimationFrame(przypnijEtykiete)));
