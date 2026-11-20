// Prześwit — strona MVP (zadanie 21). Pliki z public/ + przekazanie /api/* do usługi na karcie OMENa (OMEN_URL,
// np. http://192.168.1.112:8770). Bez usługi: 503 z podpowiedzią, strona działa dalej.
//   PORT=3000 OMEN_URL=http://192.168.1.112:8770 node strona/serwer.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png" };
const USPIONA = "karta uśpiona — uruchom wdroz.sh --usluga";
const ZAJETA = "karta zajęta (liczy inny obraz) — spróbuj za chwilę";
const LIMIT_MS = 120000;
const LIMIT_B = 120 * 1024 * 1024;
const zaDuzy = { blad: "plik większy niż 120 MB" };

const json = (res, kod, o) => { res.writeHead(kod, { "content-type": "application/json; charset=utf-8" }); res.end(JSON.stringify(o)); };

// Ciało bez Content-Length (chunked) zbieramy do limitu, żeby usługa dostała długość; null = za duże.
async function zbierz(req) {
  const cz = []; let n = 0;
  for await (const c of req) { n += c.length; if (n > LIMIT_B) return null; cz.push(c); }
  return Buffer.concat(cz);
}

export function utworz({ omenUrl, katalog, limitMs = LIMIT_MS }) {
  const kat = path.resolve(katalog);
  const doUslugi = async (req, res, sciezka) => {
    let body = null, dl = null;
    if (req.method === "POST") {
      const cl = req.headers["content-length"];
      if (cl !== undefined) {
        dl = Number(cl);
        if (!Number.isInteger(dl) || dl < 0) return json(res, 400, { blad: "zła długość pliku" });
        if (dl > LIMIT_B) { res.setHeader("connection", "close"); json(res, 413, zaDuzy); return req.destroy(); }
        body = req;
      } else {
        body = await zbierz(req);
        if (body === null) { res.setHeader("connection", "close"); json(res, 413, zaDuzy); return req.destroy(); }
        dl = body.length;
      }
    }
    if (!omenUrl) { req.resume(); return json(res, 503, { blad: USPIONA }); }
    try {
      const opcje = { method: req.method, signal: AbortSignal.timeout(limitMs) };
      if (body !== null) Object.assign(opcje, { body, duplex: "half",
        headers: { "content-type": "application/octet-stream", "content-length": String(dl) } });
      const r = await fetch(omenUrl + sciezka, opcje);
      const d = Buffer.from(await r.arrayBuffer());
      res.writeHead(r.status, { "content-type": r.headers.get("content-type") || "application/json; charset=utf-8" });
      res.end(d);
    } catch (e) {
      const czas = e?.name === "TimeoutError" || e?.name === "AbortError" || e?.cause?.name === "TimeoutError";
      if (!res.headersSent) json(res, 503, { blad: czas ? ZAJETA : USPIONA });
    }
  };
  return http.createServer((req, res) => obsluz(req, res).catch(() => { if (!res.headersSent) json(res, 500, { blad: "błąd strony" }); else res.destroy(); }));

  async function obsluz(req, res) {
    const u = new URL(req.url, "http://x");
    if (u.pathname === "/api/zdrowie") {
      let karta;
      try {
        if (!omenUrl) throw new Error("brak OMEN_URL");
        const r = await fetch(omenUrl + "/zdrowie", { signal: AbortSignal.timeout(5000) });
        karta = await r.json();
      } catch (e) { karta = { ok: false, blad: USPIONA }; }
      return json(res, 200, { strona: "ok", karta });
    }
    if (u.pathname === "/api/analiza" && req.method === "POST") return doUslugi(req, res, "/analiza" + u.search);
    if (u.pathname === "/api/partia-pokazowa" && req.method === "GET") return doUslugi(req, res, "/partia-pokazowa");
    if (u.pathname.startsWith("/api/")) return json(res, 404, { blad: "brak" });
    let rel;
    try { rel = decodeURIComponent(u.pathname); } catch { return json(res, 400, { blad: "zły adres" }); }
    if (rel.includes("\0")) return json(res, 400, { blad: "zły adres" });
    const p = path.resolve(kat, "." + (rel === "/" ? "/index.html" : rel));
    if (p !== kat && !p.startsWith(kat + path.sep)) return json(res, 403, { blad: "poza katalogiem strony" });
    fs.readFile(p, (e, d) => {
      if (e) return json(res, 404, { blad: "brak" });
      res.writeHead(200, { "content-type": TYP[path.extname(p)] || "application/octet-stream", "cache-control": "no-cache" });
      res.end(d);
    });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const PORT = +process.env.PORT || 3000, OMEN = process.env.OMEN_URL || "";
  utworz({ omenUrl: OMEN, katalog: path.join(import.meta.dirname, "public") })
    .listen(PORT, () => console.log(`Prześwit na porcie ${PORT}` + (OMEN ? `, karta: ${OMEN}` : ", bez usługi na karcie")));
}
