// Zadanie 23 — MVP: widok auta (ramki na badanym + lista kafelków).
// Zgodne z src/przeswit/lista.py: A1 (numery 1..n), A2 (kolejność malejąca, stałe progi P45 B, bez %),
// A3 (P58 A: brak wskazań — to nie gwarancja...), A4 (P35 A: brak wzorca), P57 A (6 + „i jeszcze N miejsc — pokaż”).
(function (root) {
  const BRAK_WSKAZAN = "brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam";
  const BRAK_WZORCA = "brak wzorca — sprawdź obraz sam";
  const LIMIT_WIDOCZNYCH = 6;
  // PARAMETR: progi słów (siła = maks. |różnica tłumienia| w miejscu) — tymczasowe wg P45 B, do P49 / zad. 32
  const PROGI = { wysoki: 0.6, sredni: 0.3 };
  const NAZWA_RODZAJU = { firanka: "firanka", chlodnia: "chłodnia", kontener: "kontener", cysterna: "cysterna" };

  function slowo(sila, progi = PROGI) {
    if (sila >= progi.wysoki) return "wysoki";
    if (sila >= progi.sredni) return "średni";
    return "niski";
  }

  function klasaSlowa(s) {
    if (s === "wysoki") return "wysoki";
    if (s === "średni") return "sredni";
    return "niski";
  }

  function listaMiejsc(wynik, progi = PROGI, limit = LIMIT_WIDOCZNYCH) {
    const konf = Object.values(wynik.konfiguracje || {})[0] || { typ_wybrany: null, wzorce: [], miejsca: [] };
    if (wynik.brak_wzorca) {
      return {
        napis: BRAK_WZORCA,
        rodzaj: null,
        wzorzec: null,
        miejsca: [],
        widoczne: [],
        ukryte: 0,
        napisWiecej: null,
      };
    }
    const ms = [...(konf.miejsca || [])].sort((a, b) => b.wynik - a.wynik);
    const out = ms.map((m, i) => ({
      nr: i + 1,
      x0: m.x0,
      y0: m.y0,
      x1: m.x1,
      y1: m.y1,
      sila: m.wynik,
      slowo: slowo(m.wynik, progi),
    }));
    const widoczne = out.slice(0, limit);
    const ukryte = Math.max(0, out.length - limit);
    return {
      napis: out.length ? null : BRAK_WSKAZAN,
      rodzaj: konf.typ_wybrany || null,
      wzorzec: (konf.wzorce && konf.wzorce[0]) || null,
      miejsca: out,
      widoczne,
      ukryte,
      napisWiecej: ukryte ? `i jeszcze ${ukryte} miejsc — pokaż` : null,
    };
  }

  function stylWyciecia(imgUrl, m, szer, wys) {
    const cx = (m.x0 + m.x1) / 2;
    const cy = (m.y0 + m.y1) / 2;
    const w = Math.max(48, (m.x1 - m.x0) * 3.2);
    const h = Math.max(36, (m.y1 - m.y0) * 3.2);
    const skalaX = Math.max(2.5, Math.min(8, szer / w));
    const skalaY = Math.max(2.5, Math.min(8, wys / h));
    const px = Math.max(0, Math.min(100, (cx / szer) * 100));
    const py = Math.max(0, Math.min(100, (cy / wys) * 100));
    return `background-image:url('${imgUrl}');background-size:${Math.round(skalaX * 100)}% ${Math.round(skalaY * 100)}%;background-position:${px.toFixed(1)}% ${py.toFixed(1)}%`;
  }

  function renderWidokAuta(kontener, dane) {
    // dane: { wynik, obrazBadany, obrazWzorca, tytul }
    const wynik = dane.wynik;
    const l = listaMiejsc(wynik);
    const szer = wynik.szer || 1024;
    const wys = wynik.wys || 256;
    let pokazWszystkie = false;
    let wybranyNr = l.miejsca.length ? 1 : null;

    function rysuj() {
      const lista = pokazWszystkie ? l.miejsca : l.widoczne;
      const brakWzorca = Boolean(wynik.brak_wzorca);
      const rodzajOpis = l.rodzaj ? (NAZWA_RODZAJU[l.rodzaj] || l.rodzaj) : "brak wzorca";
      const ramkiHtml = lista
        .map((m) => {
          const left = ((m.x0 / szer) * 100).toFixed(2);
          const top = ((m.y0 / wys) * 100).toFixed(2);
          const width = (Math.max(12, m.x1 - m.x0) / szer * 100).toFixed(2);
          const height = (Math.max(12, m.y1 - m.y0) / wys * 100).toFixed(2);
          const akt = m.nr === wybranyNr ? " akt" : "";
          const badgeStyle = m.y0 < 24 ? ' style="top:2px;left:2px"' : "";
          return `<button type="button" class="ramka ${klasaSlowa(m.slowo)}${akt}" data-nr="${m.nr}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%" title="Miejsce ${m.nr}: ${m.slowo}"><span${badgeStyle}>${m.nr}</span></button>`;
        })
        .join("");

      const kafleHtml = l.napis
        ? `<div class="komunikat ${brakWzorca ? "brak-wzorca" : "brak-wskazan"}" role="status">${l.napis}</div>`
        : `<div class="kafle-pasek">${lista
            .map((m) => {
              const akt = m.nr === wybranyNr ? " wyb" : "";
              const imgW = dane.obrazWzorca
                ? `<div class="wycinek" style="${stylWyciecia(dane.obrazWzorca, m, szer, wys)}" title="wzorzec"></div>`
                : "";
              return `<div class="kaf${akt}" data-nr="${m.nr}" tabindex="0" role="button" aria-pressed="${m.nr === wybranyNr}">
                <div class="para">
                  <div class="wycinek" style="${stylWyciecia(dane.obrazBadany, m, szer, wys)}" title="badany"></div>
                  ${imgW}
                </div>
                <div class="opis">
                  <b>#${m.nr}</b>
                  <span class="badge ${klasaSlowa(m.slowo)}">${m.slowo}</span>
                </div>
              </div>`;
            })
            .join("")}</div>` +
          (l.ukryte && !pokazWszystkie
            ? `<div class="wiecej-pasek"><button type="button" class="btn-wiecej" id="btn-wiecej">${l.napisWiecej}</button></div>`
            : l.ukryte && pokazWszystkie
              ? `<div class="wiecej-pasek"><button type="button" class="btn-wiecej" id="btn-wiecej">pokaż tylko 6 najsilniejszych</button></div>`
              : "");

      const naglowekMiejsc = brakWzorca
        ? "0 ramek (brak wzorca)"
        : l.miejsca.length
          ? `${l.miejsca.length} ${l.miejsca.length === 1 ? "miejsce" : l.miejsca.length < 5 ? "miejsca" : "miejsc"}${!pokazWszystkie && l.ukryte ? ` (pokazano ${l.widoczne.length} najsilniejszych)` : ""}`
          : "0 miejsc";

      kontener.innerHTML = `
        <div class="pasek-auta">
          <div class="auto-tytul">
            <b>${dane.tytul || wynik.plik}</b>
            <span class="plik">${wynik.plik}</span>
          </div>
          <div class="auto-meta">
            <span class="tag-rodzaj">${rodzajOpis}</span>
            <span class="tag-miejsca">${naglowekMiejsc}</span>
          </div>
        </div>
        <div class="dwa ${brakWzorca ? "jeden" : ""}">
          <div class="panel-obr">
            <h3>BADANY <span class="podtytul">${brakWzorca || !lista.length ? "bez ramek" : "ramki 1…" + lista.length}</span></h3>
            <div class="scena">
              <img src="${dane.obrazBadany}" alt="Obraz badany: ${wynik.plik}">
              <div class="warstwa-ramek">${ramkiHtml}</div>
            </div>
          </div>
          ${
            brakWzorca
              ? ""
              : `<div class="panel-obr">
                  <h3>WZORZEC: ${rodzajOpis} <span class="podtytul">${l.wzorzec || ""}</span></h3>
                  <div class="scena">
                    <img src="${dane.obrazWzorca}" alt="Wzorzec: ${l.wzorzec || rodzajOpis}">
                  </div>
                </div>`
          }
        </div>
        <div class="sekcja-listy">${kafleHtml}</div>
      `;

      kontener.querySelectorAll("[data-nr]").forEach((el) => {
        el.addEventListener("click", () => {
          wybranyNr = Number(el.dataset.nr);
          rysuj();
        });
      });
      const btnW = kontener.querySelector("#btn-wiecej");
      if (btnW) {
        btnW.addEventListener("click", () => {
          pokazWszystkie = !pokazWszystkie;
          rysuj();
        });
      }
    }

    rysuj();
    return l;
  }

  root.PrzeswitLista = {
    BRAK_WSKAZAN,
    BRAK_WZORCA,
    LIMIT_WIDOCZNYCH,
    PROGI,
    slowo,
    listaMiejsc,
    renderWidokAuta,
  };
})(window);
