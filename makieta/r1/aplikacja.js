// Makieta R1: E1 logowanie → E2 wybór partii → E3 lista partii → E4 auto (widok C) / E5 brak wzorca → E6 zmiana rodzaju → E7 raport.
// Stan tylko w pamięci strony (udawane dane, bez backendu).
const $ = (i) => document.getElementById(i);
const S = { kto: "", miejsce: "", pliki: [], partia: [], policzona: false, liczy: false, zamknieta: false, zapisano: false,
  ia: 0, im: 0, zoom: 1, zRodz: null, idKontroli: "" };

function ekran(id) {
  document.querySelectorAll(".ekr").forEach((e) => e.classList.toggle("on", e.id === id));
  $("kto").textContent = S.kto ? S.kto + " · " + S.miejsce : "niezalogowany";
  scrollTo(0, 0);
}
const teraz = () => new Date().toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
const sortuj = (ms) => ms.map((x) => ({ ...x, slowo: slowo(x.sila) })).sort((a, b) => b.sila - a.sila); // A2: od najbardziej różnego

// ---------- E1 ----------
$("start").onclick = () => { S.kto = $("funk").value; S.miejsce = $("miejsce").value; ekran("E2"); rysujE2(); };

// ---------- E2 ----------
function rysujE2() {
  $("wybrane").innerHTML = S.pliki.map((p) => `<li>${p.plik}</li>`).join("") || '<li class="szary">nic nie wybrano</li>';
  $("policz").disabled = !S.pliki.length;
}
// makieta: „Wskaż obrazy .bmp” podstawia partię pokazową z dane/mini (6 plików); własne pliki z dysku dostają udawany wynik
$("wskaz").onclick = (e) => { if (e.shiftKey) return $("plik").click(); S.pliki = AUTA.map((a) => ({ ...a })); rysujE2(); };
$("wskaz").insertAdjacentHTML("afterend", ' <a href="#" id="zdysku" class="szary">albo wybierz z dysku</a>');
$("zdysku").onclick = (e) => { e.preventDefault(); $("plik").click(); };
$("plik").onchange = () => {
  S.pliki = [...$("plik").files].map((f, i) => ({ ...AUTA[i % AUTA.length], plik: f.name })); rysujE2();
};
$("policz").onclick = () => { nowaPartia(); ekran("E3"); liczPoKolei(); };

function nowaPartia() {
  S.partia = S.pliki.map((p, i) => ({ ...p, id: i + 1, stan: "czeka", rodzajProgramu: p.rodzaj, rodzajOperatora: null,
    miejsca: sortuj(p.miejsca), oryg: p.miejsca, decyzje: {}, nr: "", zamkniete: false, kiedy: "" }));
  S.policzona = false; S.zamknieta = false; S.zapisano = false;
  S.idKontroli = "K-" + new Date().toISOString().slice(0, 10).replaceAll("-", "") + "-" + String(Math.floor(Math.random() * 900) + 100);
}
function liczPoKolei(szybko) {   // partia liczy się po kolei (P12), wejście w auto po całej partii (P38)
  S.liczy = true; let i = 0;
  const krok = () => {
    if (i > 0) { const a = S.partia[i - 1]; a.stan = Z_WZORCEM.includes(a.rodzaj) ? "gotowe" : "brak wzorca"; }
    if (i < S.partia.length) { S.partia[i].stan = "liczy się"; i++; rysujE3(); setTimeout(krok, szybko ? 0 : 700); }
    else { S.liczy = false; S.policzona = true; rysujE3(); }
  };
  if (szybko) { S.partia.forEach((a) => (a.stan = Z_WZORCEM.includes(a.rodzaj) ? "gotowe" : "brak wzorca")); S.liczy = false; S.policzona = true; rysujE3(); }
  else krok();
}

// ---------- E3 ----------
function rysujE3() {
  const n = S.partia.length, g = S.partia.filter((a) => a.stan === "gotowe" || a.stan === "brak wzorca").length;
  $("p-ile").textContent = n + " aut";
  $("p-stan").textContent = S.zamknieta ? "rozstrzygnięte" : S.policzona ? "gotowe" : `liczy się ${g}/${n}`;
  $("p-stan").className = "stan " + (S.zamknieta ? "rozstrz" : S.policzona ? "" : "liczy");
  $("p-pasek").style.width = (100 * g / n) + "%";
  $("p-wiersze").innerHTML = S.partia.map((a, i) => {
    const st = S.zamknieta ? "rozstrzygnięte" : a.stan;
    const cls = { czeka: "czeka", "liczy się": "liczy", gotowe: "", "brak wzorca": "brak", rozstrzygnięte: "rozstrz" }[st];
    const bw = a.stan === "brak wzorca", rodz = a.rodzajOperatora || a.rodzaj;
    const zost = a.miejsca.filter((_, j) => !a.decyzje[j]).length;
    return `<tr data-i="${i}" class="${S.policzona && !S.zamknieta ? "klik" : "zablok"}"><td><img class="mini" src="${obrazBadany(a)}" alt=""></td>
      <td><b>auto ${a.id}</b>${a.nr ? " · " + a.nr : ""}<br><span class="szary">${a.plik}</span></td>
      <td>${a.stan === "czeka" || a.stan === "liczy się" ? "—" : NAZWA[rodz]}</td>
      <td><span class="stan ${cls}">${st}</span>${a.zamkniete && !S.zamknieta ? ' <span class="szary">✓ auto zamknięte</span>' : ""}</td>
      <td>${bw || a.stan === "czeka" || a.stan === "liczy się" ? "—" : a.miejsca.length + (a.miejsca.length && S.policzona ? ` <span class="szary">(zostało ${zost})</span>` : "")}</td></tr>`;
  }).join("");
  $("p-wiersze").querySelectorAll("tr.klik").forEach((t) => (t.onclick = () => otworzAuto(+t.dataset.i)));
  $("p-info").textContent = S.zamknieta ? "Partia zamknięta — decyzji nie można już zmieniać." :
    S.policzona ? "Kliknij auto, żeby je obejrzeć. Decyzje można zmieniać z tej listy do zamknięcia partii." :
    "Auta liczą się po kolei. Wejście w auto — po policzeniu całej partii.";
  $("doraportu").disabled = !S.policzona;
}
$("doraportu").onclick = () => { ekran("E7"); rysujE7(); };

// ---------- E4 / E5 ----------
const A = () => S.partia[S.ia];
const ustawSrc = (id, u) => { if (u == null) $(id).removeAttribute("src"); else if ($(id).getAttribute("src") !== u) $(id).setAttribute("src", u); };
function otworzAuto(i) {
  S.ia = i; const a = A(); S.im = Math.max(0, a.miejsca.findIndex((_, j) => !a.decyzje[j])); S.zoom = 1; przyciskiZoom();
  ekran("E4"); rysujAuto();
}
function brakWzorca(a) { return !Z_WZORCEM.includes(a.rodzajOperatora || a.rodzaj); }
function rysujAuto() {
  const a = A(), rodz = a.rodzajOperatora || a.rodzaj, bw = brakWzorca(a);
  $("a-nazwa").textContent = `auto ${a.id} z ${S.partia.length}`; $("a-plik").textContent = a.plik;
  $("a-nr").value = a.nr; $("a-nr").classList.remove("alarm");
  ustawSrc("imgB", obrazBadany(a));
  ["obB", "obW"].forEach((id) => { $(id).style.width = (100 * S.zoom) + "%"; $(id).querySelectorAll(".ramka,.brakwz").forEach((r) => r.remove()); });
  $("a-rodzaj").textContent = NAZWA[rodz] + (a.rodzajOperatora ? ` (program: ${NAZWA[a.rodzaj]})` : "");
  $("a-dwa").style.gridTemplateColumns = bw ? "1fr" : "";
  $("a-wz").style.display = bw ? "none" : "";
  if (bw) {   // E5 (P35 A): bez ramek i kafelków, sam badany z lupą
    const d = document.createElement("div"); d.className = "brakwz"; d.textContent = BRAK_WZORCA; $("obB").appendChild(d);
    $("a-ramki").innerHTML = `· rodzaj: ${NAZWA[rodz]} <button class="btn jasny" style="padding:2px 8px" onclick="zmienRodzaj()">Zmień rodzaj</button>`;
    $("a-kafle").innerHTML = `<div class="brakwsk">${BRAK_WZORCA}. Przybliż obraz (1×/2×/4× albo kliknij w obraz) i obejrzyj go sam.</div>`;
    rysujZamknij(a); return;
  }
  ustawSrc("imgW", obrazWzorca(rodz, 0));
  if (!a.miejsca.length) {   // A3: obraz bez miejsc
    $("a-ramki").textContent = "· brak wskazań";
    $("a-kafle").innerHTML = '<div class="brakwsk">brak wskazań — program nie znalazł miejsc różnych od wzorca.</div>';
    rysujZamknij(a); return;
  }
  $("a-ramki").textContent = "· ramki " + a.miejsca.map((_, i) => i + 1).join(" ");
  a.miejsca.forEach((x, i) => {
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
  $("a-kafle").innerHTML = a.miejsca.map((x, i) => {
    const d = a.decyzje[i], st = d ? d.d : "oczekuje";
    return `<div class="kaf ${i === S.im ? "wyb" : ""}" data-i="${i}"><div class="para"><div class="lupa" data-l="b"></div><div class="lupa" data-l="w"></div></div>
      <div class="opis"><b>${i + 1}</b><span class="slowo ${kl(x.slowo)}">${x.slowo}</span><span class="st ${st}">${st}${d && d.powod ? ": " + d.powod : ""}</span></div>
      <div class="podp ${x.podp ? "" : "uwaga"}">${x.podp || BEZ_OPISU}</div></div>`;
  }).join("");
  $("a-kafle").querySelectorAll(".kaf").forEach((el) => {
    const x = a.miejsca[+el.dataset.i];
    lupa(el.querySelector('[data-l="b"]'), obrazBadany(a), x); lupa(el.querySelector('[data-l="w"]'), obrazWzorca(rodz, 0), x);
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
  const sel = Object.assign(document.createElement("select"), { className: "powod" });
  sel.innerHTML = '<option value="">Odrzuć ▾ powód…</option>' + POWODY.map((p) => `<option>${p}</option>`).join("");
  const inny = Object.assign(document.createElement("input"), { placeholder: "własny powód" }); inny.style.display = "none";
  const odrz = Object.assign(document.createElement("button"), { className: "btn nie", textContent: "Odrzuć", disabled: true });
  sel.onchange = () => { inny.style.display = sel.value === "inny" ? "" : "none"; odrz.disabled = !sel.value; };
  ok.onclick = () => decyduj(a, i, { d: "zatwierdzone" });
  odrz.onclick = () => decyduj(a, i, { d: "odrzucone", powod: sel.value === "inny" ? (inny.value || "inny") : sel.value });
  el.append(ok, sel, inny, odrz);
  if (d) el.insertAdjacentHTML("beforeend", `<span class="szary">teraz: ${d.d}${d.powod ? " (" + d.powod + ")" : ""} — możesz zmienić</span>`);
}
function decyduj(a, i, d) {
  a.decyzje[i] = { ...d, kiedy: teraz() };
  const n = a.miejsca.findIndex((_, j) => !a.decyzje[j]);
  if (n >= 0) return wybierz(n);
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
  if (!a.nr) {   // A9: nr rej. przed zatwierdzeniem wyniku auta
    $("a-nr").classList.add("alarm"); $("a-nr").focus();
    $("a-dec").insertAdjacentHTML("beforeend", '<span class="ostrz" style="margin:0">Wpisz nr rej. naczepy i naciśnij Enter, żeby zamknąć auto.</span>');
    return;
  }
  a.zamkniete = true; a.kiedy = teraz();
  const n = S.partia.findIndex((b, j) => j > S.ia && !b.zamkniete);
  const m = n >= 0 ? n : S.partia.findIndex((b) => !b.zamkniete);
  if (m >= 0) otworzAuto(m); else { ekran("E7"); rysujE7(); }
}
$("a-nr").oninput = () => { A().nr = $("a-nr").value.trim().toUpperCase(); };
$("a-nr").onkeydown = (e) => { if (e.key !== "Enter") return; const a = A();
  if ($("a-nr").classList.contains("alarm") || (a.miejsca.length && a.miejsca.every((_, j) => a.decyzje[j]))) dalejPoAucie(a); };
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
$("imgB").addEventListener("click", (e) => {   // klik w obraz = lupa w tym miejscu (także E5)
  const r = $("imgB").getBoundingClientRect(), cx = (e.clientX - r.left) / r.width * W, cy = (e.clientY - r.top) / r.height * H;
  if (S.zoom < 4) { S.zoom = 4; przyciskiZoom(); rysujAuto(); } doMiejsca(cx, cy);
});
$("dolisty").onclick = () => { ekran("E3"); rysujE3(); };
$("imgB").onload = () => { if ($("E4").classList.contains("on")) rysujAuto(); };
addEventListener("resize", () => { if ($("E4").classList.contains("on")) rysujAuto(); });

// ---------- E6 ----------
function zmienRodzaj() {
  const a = A(); S.zRodz = a.rodzajOperatora || a.rodzaj; ekran("E6");
  $("z-auto").textContent = `auto ${a.id} (${a.plik})`; $("z-bad").src = obrazBadany(a);
  $("z-rodz").innerHTML = RODZAJE.map((r) => `<label><input type="radio" name="rodz" value="${r}" ${r === S.zRodz ? "checked" : ""}>${NAZWA[r]}</label>`).join("");
  $("z-rodz").querySelectorAll("input").forEach((i) => (i.onchange = () => { S.zRodz = i.value; podgladWz(); }));
  podgladWz();
}
function podgladWz() {
  const ma = Z_WZORCEM.includes(S.zRodz);
  [0, 1].forEach((i) => {
    if (ma) $("z-w" + i).src = obrazWzorca(S.zRodz, i); else $("z-w" + i).removeAttribute("src");
    $("z-c" + i).textContent = ma ? `wzorzec ${NAZWA[S.zRodz]} nr ${i + 1} (najbliższy ${i + 1}.)` : `${NAZWA[S.zRodz]}: ${BRAK_WZORCA}`;
  });
}
$("zmienrodz").onclick = zmienRodzaj;
$("z-anuluj").onclick = () => { ekran("E4"); rysujAuto(); };
$("z-zast").onclick = () => {   // P24 B, P27 A: przeliczenie od nowa, decyzje auta znikają, raport z oboma rodzajami
  const a = A(); a.rodzajOperatora = S.zRodz === a.rodzaj ? null : S.zRodz; a.decyzje = {}; a.zamkniete = false;
  a.miejsca = brakWzorca(a) ? [] : sortuj(a.rodzajOperatora ? MIEJSCA_PO_ZMIANIE : a.oryg);
  a.stan = brakWzorca(a) ? "brak wzorca" : "gotowe"; S.im = 0; S.zoom = 1; przyciskiZoom();
  ekran("E4"); rysujAuto();
};

// ---------- E7 ----------
function wierszeRaportu() {
  return S.partia.map((a) => ({
    id_kontroli: S.idKontroli, auto: a.id, plik: a.plik, nr_rej: a.nr || "",
    rodzaj_programu: NAZWA[a.rodzaj] + (Z_WZORCEM.includes(a.rodzaj) ? "" : " (brak wzorca)"), bez_wzorca: brakWzorca(a), rodzaj_operatora: a.rodzajOperatora ? NAZWA[a.rodzajOperatora] : "",
    liczba_miejsc: brakWzorca(a) ? 0 : a.miejsca.length,
    decyzje: a.miejsca.map((x, i) => ({ nr: i + 1, slowo: x.slowo, decyzja: a.decyzje[i]?.d || "brak decyzji", powod: a.decyzje[i]?.powod || "" })),
    kto: S.kto, miejsce_kontroli: S.miejsce, data_godzina: a.kiedy || teraz(),
  }));
}
function rysujE7() {
  $("r-id").textContent = "· " + S.idKontroli;
  $("r-naglowek").textContent = `${S.kto} · ${S.miejsce} · ${S.partia.length} aut · ${S.zamknieta ? "partia zamknięta" : "partia otwarta"}`;
  $("r-wiersze").innerHTML = wierszeRaportu().map((r) => `<tr><td>auto ${r.auto}</td><td>${r.nr_rej || '<span class="szary">—</span>'}</td><td>${r.rodzaj_programu}</td><td>${r.rodzaj_operatora || "—"}</td>
    <td>${r.liczba_miejsc}</td><td>${r.decyzje.map((d) => `${d.nr} ${d.slowo}: ${d.decyzja}${d.powod ? " (" + d.powod + ")" : ""}`).join("<br>") || (r.bez_wzorca ? "brak wzorca — sprawdzone przez operatora" : "brak wskazań")}</td>
    <td>${r.kto}</td><td>${r.miejsce_kontroli}</td><td>${r.data_godzina}</td></tr>`).join("");
  $("zamknijp").disabled = !S.zapisano || S.zamknieta; $("zapisz").disabled = S.zamknieta;
}
function pobierz(nazwa, tresc, typ) {
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([tresc], { type: typ })), download: nazwa });
  document.body.append(a); a.click(); a.remove();
}
$("zapisz").onclick = () => {
  const w = wierszeRaportu();
  pobierz("raport-partii.json", JSON.stringify(w, null, 2), "application/json");
  const csv = ["id_kontroli;auto;plik;nr_rej;rodzaj_programu;rodzaj_operatora;miejsce;slowo;decyzja;powod;kto;miejsce_kontroli;data_godzina"]
    .concat(w.flatMap((r) => (r.decyzje.length ? r.decyzje : [{ nr: "", slowo: "", decyzja: "", powod: "" }])
      .map((d) => [r.id_kontroli, r.auto, r.plik, r.nr_rej, r.rodzaj_programu, r.rodzaj_operatora, d.nr, d.slowo, d.decyzja, d.powod, r.kto, r.miejsce_kontroli, r.data_godzina].join(";")))).join("\n");
  pobierz("raport-partii.csv", "﻿" + csv, "text/csv");
  S.zapisano = true; $("r-info").textContent = "Zapisano raport-partii.json i raport-partii.csv (lokalnie). Teraz możesz zamknąć partię."; rysujE7();
};
$("zamknijp").onclick = () => { S.zamknieta = true; ekran("E3"); rysujE3(); };   // P46 A
$("r-lista").onclick = () => { ekran("E3"); rysujE3(); };

// ---------- skróty dla oglądających makietę ----------
function gotowaPartia() {
  if (!S.kto) { S.kto = $("funk").value; S.miejsce = $("miejsce").value; }
  if (!S.partia.length) { S.pliki = AUTA.map((a) => ({ ...a })); nowaPartia(); liczPoKolei(true); }
}
document.querySelectorAll("[data-idz]").forEach((l) => (l.onclick = (e) => {
  e.preventDefault(); const k = l.dataset.idz;
  if (k === "E1") return ekran("E1");
  if (k === "E2") { if (!S.kto) { S.kto = $("funk").value; S.miejsce = $("miejsce").value; } ekran("E2"); return rysujE2(); }
  gotowaPartia();
  if (k === "E3") { ekran("E3"); rysujE3(); } else if (k === "E4") otworzAuto(0);
  else if (k === "E5") otworzAuto(S.partia.findIndex((a) => brakWzorca(a)) >= 0 ? S.partia.findIndex((a) => brakWzorca(a)) : 0);
  else if (k === "E6") { otworzAuto(0); zmienRodzaj(); } else if (k === "E7") { ekran("E7"); rysujE7(); }
}));
window.zmienRodzaj = zmienRodzaj;
ekran("E1");
