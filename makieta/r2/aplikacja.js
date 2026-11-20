// Makieta R2: E1 logowanie → E2 wybór partii → E3 lista partii → E4 auto (widok C) / E5 brak wzorca → E6 zmiana rodzaju → E7 raport.
// Stan tylko w pamięci strony (udawane dane, bez backendu). Zmiany względem R1 — docs/decyzje.md (zadanie 22, R2).
const $ = (i) => document.getElementById(i);
const S = { kto: "", miejsce: "", pliki: [], partia: [], liczy: false, zamknieta: false,
  ia: 0, im: 0, zoom: 1, wzn: 0, zRodz: null, idKontroli: "", wszystkie: false, potwierdz: false };

function ekran(id) {
  document.querySelectorAll(".ekr").forEach((e) => e.classList.toggle("on", e.id === id));
  $("kto").textContent = S.kto ? S.kto + " · " + S.miejsce : "";
  scrollTo(0, 0);
}
const godzina = () => new Date().toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
const sortuj = (ms) => ms.map((x) => ({ ...x, slowo: slowo(x.sila) })).sort((a, b) => b.sila - a.sila); // A2: od najbardziej różnego
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------- E1 ----------
$("start").onclick = () => { S.kto = $("funk").value; S.miejsce = $("miejsce").value; ekran("E2"); rysujE2(); };

// ---------- E2 ----------
function rysujE2() {
  $("wybrane").innerHTML = S.pliki.map((p) => `<li>${esc(p.plik)}${p.wlasny ? ' <span class="szary">(wynik przykładowy)</span>' : ""}${p.zepsuty ? ' <span class="szary">(plik nieczytelny)</span>' : ""}</li>`).join("") || '<li class="szary">nic nie wybrano</li>';
  $("policz").disabled = !S.pliki.length;
}
$("wskaz").onclick = () => $("plik").click();   // P62 A: prawdziwy wybór plików z dysku
$("pokazowa").onclick = () => { S.pliki = AUTA.map((a) => ({ ...a })); rysujE2(); };   // P60 B: 7 aut, trudny w środku partii bez oznaczenia
// Własny plik: sprawdzamy nagłówek „BM” (P53 A — zepsuty plik dostaje komunikat, reszta liczy się dalej);
// wynik to przykład z auta 1 z napisem P62 A, obraz — Twój plik (przeglądarka zwykle umie pokazać .bmp).
async function wlasnyPlik(f) {
  const nag = new Uint8Array(await f.slice(0, 2).arrayBuffer());
  const ok = nag[0] === 0x42 && nag[1] === 0x4d && f.size > 54;
  return { ...AUTA[0], plik: f.name, wlasny: ok ? URL.createObjectURL(f) : null, zepsuty: !ok, wz: AUTA[0].wz };
}
$("plik").onchange = async () => { S.pliki = await Promise.all([...$("plik").files].map(wlasnyPlik)); $("plik").value = ""; rysujE2(); };
$("policz").onclick = () => { nowaPartia(); ekran("E3"); liczPoKolei(0); };

function zrobAuto(p, id) {
  return { ...p, id, stan: "czeka", rodzajProgramu: p.rodzaj, rodzajOperatora: null, miejsca: sortuj(p.miejsca), oryg: p.miejsca,
    decyzje: {}, nr: "", zamkniete: false, kiedy: "" };
}
function nowaPartia() {
  S.partia = S.pliki.map((p, i) => zrobAuto(p, i + 1));
  S.zamknieta = false; S.potwierdz = false;
  S.idKontroli = "K-" + new Date().toISOString().slice(0, 10).replaceAll("-", "") + "-" + String(Math.floor(Math.random() * 900) + 100);
}
const wynikStanu = (a) => (a.zepsuty ? "plik nieczytelny" : Z_WZORCEM.includes(a.rodzaj) ? "gotowe" : "brak wzorca");
const policzone = () => S.partia.length && S.partia.every((a) => !["czeka", "liczy się"].includes(a.stan));
function liczPoKolei(od) {   // partia liczy się po kolei (P12), wejście w auto po całej partii (P38)
  S.liczy = true; let i = od;
  const krok = () => {
    if (i > od) S.partia[i - 1].stan = wynikStanu(S.partia[i - 1]);
    if (i < S.partia.length) { S.partia[i].stan = "liczy się"; i++; rysujE3(); setTimeout(krok, 600); }
    else { S.liczy = false; rysujE3(); }
  };
  krok();
}

// ---------- E3 ----------
const bezDecyzji = (a) => !a.zepsuty && (!a.zamkniete || a.miejsca.some((_, j) => !a.decyzje[j]));
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
    const mini = a.zepsuty ? '<div class="szary">—</div>' : `<img class="mini" src="${obrazBadany(a)}" alt="">`;
    return `<tr data-i="${i}" class="${klik ? "klik" : "zablok"}"><td>${mini}</td>
      <td><b>auto ${a.id}</b>${a.nr ? " · " + esc(a.nr) : ""}<br><span class="szary">${esc(a.plik)}</span>${a.wlasny ? '<br><span class="szary">wynik przykładowy</span>' : ""}</td>
      <td>${liczone || a.zepsuty ? "—" : NAZWA[rodz]}</td>
      <td><span class="stan ${cls}">${st}</span>${a.zamkniete && !S.zamknieta ? ' <span class="szary">✓ auto zamknięte</span>' : ""}
        ${a.zepsuty ? '<div class="blad">Nie da się odczytać pliku — to nie jest obraz .bmp albo plik jest uszkodzony. Pozostałe auta liczą się dalej.</div>' : ""}</td>
      <td>${bw || liczone || a.zepsuty ? "—" : a.miejsca.length + (a.miejsca.length && gotowa ? ` <span class="szary">(zostało ${zost})</span>` : "")}</td></tr>`;
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
  S.partia.push(zrobAuto(await wlasnyPlik(f), S.partia.length + 1)); liczPoKolei(S.partia.length - 1);
};
$("nowa").onclick = () => { S.pliki = []; S.partia = []; S.zamknieta = false; ekran("E2"); rysujE2(); };   // P65 A

// ---------- E4 / E5 ----------
const A = () => S.partia[S.ia];
const ustawSrc = (id, u) => { if (u == null) $(id).removeAttribute("src"); else if ($(id).getAttribute("src") !== u) $(id).setAttribute("src", u); };
function otworzAuto(i) {
  S.ia = i; const a = A(); S.im = Math.max(0, a.miejsca.findIndex((_, j) => !a.decyzje[j])); S.zoom = 1; S.wzn = 0; S.wszystkie = false;
  przyciskiZoom(); ekran("E4"); $("a-ostrz").innerHTML = ""; rysujAuto();
}
function brakWzorca(a) { return !Z_WZORCEM.includes(a.rodzajOperatora || a.rodzaj); }
const widoczne = (a) => (S.wszystkie ? a.miejsca.length : Math.min(ILE_NA_LISCIE, a.miejsca.length));   // P57 A
function rysujAuto() {
  const a = A(), rodz = a.rodzajOperatora || a.rodzaj, bw = brakWzorca(a);
  $("a-nazwa").textContent = `auto ${a.id} z ${S.partia.length}`; $("a-plik").textContent = a.plik;
  $("a-nr").value = a.nr; $("a-nr").classList.toggle("alarm", !!$("a-ostrz").innerHTML && !a.nr);
  $("a-przyklad").style.display = a.wlasny ? "" : "none"; $("a-przyklad").textContent = PRZYKLAD;
  ustawSrc("imgB", obrazBadany(a));
  ["obB", "obW"].forEach((id) => { $(id).style.width = (100 * S.zoom) + "%"; $(id).querySelectorAll(".ramka").forEach((r) => r.remove()); });
  $("a-rodzaj").textContent = NAZWA[rodz] + (a.rodzajOperatora ? ` (program: ${NAZWA[a.rodzaj]})` : "");
  $("a-dwa").style.gridTemplateColumns = bw ? "1fr" : "";
  $("a-wz").style.display = bw ? "none" : "";
  // E5 (P35 A): jeden napis nad obrazem (nie na nim — podwozie zostaje widoczne), bez ramek i kafelków
  $("a-bw").style.display = bw ? "" : "none"; $("a-bw").textContent = BRAK_WZORCA;
  if (bw) {
    $("a-wiecej").innerHTML = "";
    $("a-ramki").innerHTML = `· rodzaj: ${NAZWA[rodz]} <button class="btn jasny" style="padding:2px 8px" id="zmienrodz2">Zmień rodzaj</button>`;
    $("zmienrodz2").onclick = zmienRodzaj;
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
      r.className = "ramka " + kl(x.slowo) + (i === S.im ? " wyb" : "") + (d ? " " + d.d : "");
      Object.assign(r.style, { left: pct(x.x0, W), top: pct(x.y0, H), width: pct(x.x1 - x.x0, W), height: pct(x.y1 - x.y0, H) });
      if (przer) r.style.borderStyle = "dashed";
      r.innerHTML = `<span>${i + 1}${przer ? "" : " " + x.slowo}</span>`;
      r.onclick = (e) => { e.stopPropagation(); wybierz(i); };
      $(ob).appendChild(r);
    }
  });
  $("a-kafle").innerHTML = a.miejsca.slice(0, n).map((x, i) => {
    const d = a.decyzje[i], st = d ? d.d : "oczekuje";
    return `<div class="kaf ${i === S.im ? "wyb" : ""}" data-i="${i}"><div class="para"><div class="lupa" data-l="b"></div><div class="lupa" data-l="w"></div></div>
      <div class="opis"><b>${i + 1}</b><span class="slowo ${kl(x.slowo)}">${x.slowo}</span><span class="st ${st}">${st}${d && d.powod ? ": " + esc(d.powod) : ""}</span></div>
      <div class="podp ${x.podp ? "" : "uwaga"}">${x.podp || BEZ_OPISU}</div></div>`;
  }).join("");
  $("a-wiecej").innerHTML = reszta ? `<div class="wiecej" id="pokazwiecej">i jeszcze ${reszta} miejsc — pokaż</div>` : "";
  if (reszta) $("pokazwiecej").onclick = () => { S.wszystkie = true; rysujAuto(); };
  $("a-kafle").querySelectorAll(".kaf").forEach((el) => {
    const x = a.miejsca[+el.dataset.i];
    lupa(el.querySelector('[data-l="b"]'), obrazBadany(a), x); lupa(el.querySelector('[data-l="w"]'), obrazWzorca(a, rodz, S.wzn), x);
    el.onclick = () => wybierz(+el.dataset.i);
  });
  rysujDecyzje(a);
}
function lupa(el, src, x, zoom = 6) {
  const cx = (x.x0 + x.x1) / 2, cy = (x.y0 + x.y1) / 2, bw = el.clientWidth || 90, bh = el.clientHeight || 64, s = bw / (W / zoom);
  Object.assign(el.style, { backgroundImage: `url(${src})`, backgroundSize: `${W * s}px ${H * s}px`, backgroundPosition: `${bw / 2 - cx * s}px ${bh / 2 - cy * s}px` });
  el.innerHTML = `<div class="lupa-ramka" style="left:${bw / 2 - (cx - x.x0) * s}px;top:${bh / 2 - (cy - x.y0) * s}px;width:${(x.x1 - x.x0) * s}px;height:${(x.y1 - x.y0) * s}px"></div>`;
}
function rysujDecyzje(a) {
  const el = $("a-dec"), i = S.im, x = a.miejsca[i], d = a.decyzje[i];
  el.innerHTML = `<b>miejsce ${i + 1}</b> <span class="slowo ${kl(x.slowo)}">${x.slowo}</span>`;
  if (S.zamknieta) { el.innerHTML += ' <span class="szary">partia zamknięta</span>'; return; }
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
function rysujZamknij(a) {
  $("a-dec").innerHTML = "";
  if (S.zamknieta) return;
  const b = Object.assign(document.createElement("button"), { className: "btn ok", textContent: "Zamknij auto" });
  b.onclick = () => dalejPoAucie(a); $("a-dec").append(b);
}
function dalejPoAucie(a) {
  a.nr = $("a-nr").value.trim().toUpperCase();
  if (!a.nr) {   // A9: nr rej. przed zatwierdzeniem wyniku auta; jeden napis, nie dopisuje się przy kolejnym kliknięciu
    $("a-nr").classList.add("alarm"); $("a-nr").focus();
    $("a-ostrz").innerHTML = '<div class="ostrz" style="margin:8px 12px">Wpisz nr rej. naczepy i naciśnij Enter, żeby zamknąć auto.</div>';
    return;
  }
  $("a-ostrz").innerHTML = "";
  a.zamkniete = true; if (!a.miejsca.length) a.kiedy = godzina();   // auto bez miejsc: decyzją jest zamknięcie auta
  const n = S.partia.findIndex((b, j) => j > S.ia && !b.zamkniete && !b.zepsuty);
  if (n >= 0) otworzAuto(n); else { ekran("E3"); rysujE3(); }   // P54 A: po ostatnim aucie lista partii z „Raport partii”
}
$("a-nr").oninput = () => { A().nr = $("a-nr").value.trim().toUpperCase(); if (A().nr) { $("a-ostrz").innerHTML = ""; $("a-nr").classList.remove("alarm"); } };
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
  $("z-auto").textContent = `auto ${a.id} (${a.plik})`; $("z-bad").src = obrazBadany(a);
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
    id_kontroli: S.idKontroli, auto: a.id, plik: a.plik, nr_rej: a.nr || "",
    rodzaj_programu: NAZWA[a.rodzaj] + (Z_WZORCEM.includes(a.rodzaj) ? "" : " (brak wzorca)"), bez_wzorca: brakWzorca(a), rodzaj_operatora: a.rodzajOperatora ? NAZWA[a.rodzajOperatora] : "",
    liczba_miejsc: brakWzorca(a) ? 0 : a.miejsca.length, wynik_przykladowy: !!a.wlasny,
    decyzje: a.miejsca.map((x, i) => ({ nr: i + 1, slowo: x.slowo, decyzja: a.decyzje[i]?.d || "brak decyzji", powod: a.decyzje[i]?.powod || "" })),
    kto: S.kto, miejsce_kontroli: S.miejsce, data_godzina: a.kiedy || "—", brak_decyzji: bezDecyzji(a),
  }));
}
function rysujE7() {
  const w = wierszeRaportu();
  $("r-id").textContent = "· " + S.idKontroli;
  $("r-naglowek").textContent = `${S.kto} · ${S.miejsce} · ${w.length} aut · ${S.zamknieta ? "partia zamknięta" : "partia otwarta"}`;
  $("r-wiersze").innerHTML = w.map((r) => `<tr><td>auto ${r.auto}${r.wynik_przykladowy ? '<br><span class="szary">wynik przykładowy</span>' : ""}</td><td>${r.nr_rej ? esc(r.nr_rej) : '<span class="szary">—</span>'}</td><td>${r.rodzaj_programu}</td><td>${r.rodzaj_operatora || "—"}</td>
    <td>${r.liczba_miejsc}</td><td>${r.decyzje.map((d) => `${d.nr} ${d.slowo}: ${d.decyzja}${d.powod ? " (" + esc(d.powod) + ")" : ""}`).join("<br>") || (r.bez_wzorca ? (r.brak_decyzji ? "brak decyzji" : "brak wzorca — obejrzane przez operatora") : (r.brak_decyzji ? "brak decyzji" : "brak wskazań — obejrzane przez operatora"))}</td>
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
  const csv = ["id_kontroli;auto;plik;nr_rej;rodzaj_programu;rodzaj_operatora;miejsce;slowo;decyzja;powod;kto;miejsce_kontroli;data_godzina"]
    .concat(w.flatMap((r) => (r.decyzje.length ? r.decyzje : [{ nr: "", slowo: "", decyzja: "", powod: "" }])
      .map((d) => [r.id_kontroli, r.auto, r.plik, r.nr_rej, r.rodzaj_programu, r.rodzaj_operatora, d.nr, d.slowo, d.decyzja, d.powod, r.kto, r.miejsce_kontroli, r.data_godzina].join(";")))).join("\n");
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
ekran("E1");
