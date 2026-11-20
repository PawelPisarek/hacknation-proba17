// Prześwit — budzik usługi (zadanie 42). Mały serwer na OMENie (bez karty, bez liczenia): mówi, czy usługa na karcie
// śpi, i na prośbę strony zgłasza ją do orkiestratora (gpu-tlo, 2 rdzenie, bezczynność 10 min) z kodem z main.
//   node usluga/budzik.mjs            port 8769, klon ~/budzik/hacknation-proba17, token ~/budzik/orkiestrator.token
// GET /stan  → {stan: "działa"|"budzi się"|"w kolejce"|"uśpiona", ...}
// POST /obudz → jak /stan; gdy „uśpiona” — git reset do origin/main i zgłoszenie usługi.
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, execFile } from "node:child_process";
import { pathToFileURL } from "node:url";

const json = (res, kod, o) => { res.writeHead(kod, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }); res.end(JSON.stringify(o)); };
const ZNAK = "python -m usluga.serwer";   // po tym poznajemy zlecenie usługi w kolejce orkiestratora
const SWIEZE_MS = 60000;                  // tyle po zgłoszeniu ufamy, że „budzi się”, zanim kolejka je pokaże

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
        try { await zglos(); zgloszono = teraz(); blad = ""; }
        catch (e) { blad = String(e.message || e); return json(res, 500, { stan: "uśpiona", blad }); }
        return json(res, 202, { stan: "budzi się", od_s: 0 });
      }
      json(res, 404, { blad: "brak" });
    } catch { if (!res.headersSent) json(res, 500, { blad: "błąd budzika" }); }
  });
}

// --- uruchomienie na OMENie ---
const wykonaj = (cmd, args, opcje) => new Promise((ok, zle) =>
  execFile(cmd, args, { timeout: 30000, ...opcje }, (e, out, err) => e ? zle(new Error((err || e.message).trim())) : ok(out)));

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const DOM = path.join(os.homedir(), "budzik");
  const PORT = +process.env.PORT || 8769;
  const KLON = process.env.KLON || path.join(DOM, "hacknation-proba17");
  const ORK = process.env.ORK || "/opt/orkiestrator-klient/klient/orkiestrator.mjs";
  const TOKEN = process.env.TOKEN_PLIK || path.join(DOM, "orkiestrator.token");
  const LOG = path.join(DOM, "usluga.log");
  // stan kolejki czyta się bez tokenu; zgłoszenie usługi go wymaga (plik 600, poza repo)
  const token = () => { try { return fs.readFileSync(TOKEN, "utf8").trim(); } catch { return ""; } };
  const env = () => (token() ? { ...process.env, ORKIESTRATOR_TOKEN: token() } : process.env);
  const kolejka = () => wykonaj(process.execPath, [ORK, "stan"], { env: env() });
  async function zglos() {
    if (!token()) throw new Error("budzik bez tokenu orkiestratora — uruchom wdroz.sh --usluga");
    await wykonaj("git", ["-C", KLON, "fetch", "-q", "--depth", "1", "origin", "main"]);
    await wykonaj("git", ["-C", KLON, "reset", "-q", "--hard", "origin/main"]);
    const log = fs.openSync(LOG, "a");
    const p = spawn(process.execPath, [ORK, "uruchom", "--maszyna", "omen", "--klasa", "gpu-tlo", "--rdzenie", "2",
      "--sesja", "budzik-usluga", "--repo", "hacknation", "--konto", "hackathon", "--bez-zapasowej", "--",
      "sh", "-c", ". ~/venv/bin/activate && PYTHONPATH=src:. python -m usluga.serwer --host 0.0.0.0 --bezczynnosc 10"],
    { cwd: KLON, env: env(), detached: true, stdio: ["ignore", log, log] });
    p.unref();
  }
  utworzBudzik({ uslugaUrl: process.env.USLUGA_URL || "http://127.0.0.1:8770", kolejka, zglos })
    .listen(PORT, "0.0.0.0", () => console.log(`budzik na porcie ${PORT}, klon ${KLON}`));
}
