// Prześwit — budzik usługi (zadanie 42). Mały serwer na OMENie (bez karty, bez liczenia): mówi, czy usługa na karcie
// śpi, budzi się (obudzona ręcznie, zlecenie trzyma kartę) albo czeka w kolejce orkiestratora.
//   node usluga/budzik.mjs            port 8769 (cron: usluga/budzik-cron.sh)
// GET /stan  → {stan: "działa"|"budzi się"|"w kolejce"|"uśpiona", ...}
// POST /obudz → jak /stan; gdy „uśpiona” i nie ma czym zgłosić (UPROSZCZENIE P86) — 503 z napisem dla strony.
import http from "node:http";
import { execFile } from "node:child_process";
import { pathToFileURL } from "node:url";

const json = (res, kod, o) => { res.writeHead(kod, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }); res.end(JSON.stringify(o)); };
const ZNAK = "python -m usluga.serwer";   // po tym poznajemy zlecenie usługi w kolejce orkiestratora
const SWIEZE_MS = 60000;                  // tyle po zgłoszeniu ufamy, że „budzi się”, zanim kolejka je pokaże
export const RECZNIE = "program śpi — obsługa budzi go ręcznie przed pokazem (ok. 30 s)";

// Z tekstu `orkiestrator.mjs stan` (sekcja OMEN): "trzyma" — zlecenie usługi biegnie, "czeka N." — w kolejce.
export function zKolejki(tekst) {
  for (const l of String(tekst).split("\n")) {
    if (!l.includes(ZNAK)) continue;
    if (/^\s*trzyma:/.test(l)) return { kolejka: "trzyma" };
    const m = l.match(/^\s*czeka (\d+)\./);
    if (m) return { kolejka: "czeka", pozycja: Number(m[1]) };
  }
  return { kolejka: "brak" };
}

export function utworzBudzik({ uslugaUrl, kolejka, zglos, teraz = () => Date.now() }) {
  let zgloszono = 0, blad = "";
  async function stan() {
    try {
      const r = await fetch(uslugaUrl + "/zdrowie", { signal: AbortSignal.timeout(2000) });
      if ((await r.json()).ok) return { stan: "działa" };
    } catch { /* usługa nie słucha */ }
    let k;
    try { k = zKolejki(await kolejka()); } catch (e) { k = { kolejka: "nieznana", blad: String(e.message || e) }; }
    const od_s = zgloszono ? Math.round((teraz() - zgloszono) / 1000) : null;
    if (k.kolejka === "trzyma") return { stan: "budzi się", od_s };
    if (k.kolejka === "czeka") return { stan: "w kolejce", pozycja: k.pozycja, od_s };
    if (zgloszono && teraz() - zgloszono < SWIEZE_MS) return { stan: "budzi się", od_s };
    return { stan: "uśpiona", ...(blad ? { blad } : {}) };
  }
  return http.createServer(async (req, res) => {
    try {
      const u = new URL(req.url, "http://x");
      if (u.pathname === "/stan" && req.method === "GET") return json(res, 200, await stan());
      if (u.pathname === "/obudz" && req.method === "POST") {
        const s = await stan();
        if (s.stan !== "uśpiona") return json(res, 200, s);
        if (!zglos) return json(res, 503, { stan: "uśpiona", blad: RECZNIE });
        try { await zglos(); zgloszono = teraz(); blad = ""; }
        catch (e) { blad = String(e.message || e); return json(res, 500, { stan: "uśpiona", blad }); }
        return json(res, 202, { stan: "budzi się", od_s: 0 });
      }
      json(res, 404, { blad: "brak" });
    } catch { if (!res.headersSent) json(res, 500, { blad: "błąd budzika" }); }
  });
}

// --- uruchomienie na OMENie ---
// UPROSZCZENIE (P86, Paweł: „nie teraz”): budzik usługi nie zgłasza — tylko mówi stan. Usługę budzi obsługa ręcznie
// przed pokazem (sh wdroz.sh --usluga, ok. 25 s); strona pokazuje wtedy „Uruchamiam program, ok. 30 s” i ponawia.
const wykonaj = (cmd, args) => new Promise((ok, zle) =>
  execFile(cmd, args, { timeout: 30000 }, (e, out, err) => e ? zle(new Error((err || e.message).trim())) : ok(out)));

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const PORT = +process.env.PORT || 8769;
  const ORK = process.env.ORK || "/opt/orkiestrator-klient/klient/orkiestrator.mjs";
  const kolejka = () => wykonaj(process.execPath, [ORK, "stan"]);   // stan kolejki czyta się bez uprawnień
  utworzBudzik({ uslugaUrl: process.env.USLUGA_URL || "http://127.0.0.1:8770", kolejka })
    .listen(PORT, "0.0.0.0", () => console.log(`budzik na porcie ${PORT} (tylko stan)`));
}
