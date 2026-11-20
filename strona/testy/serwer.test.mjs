import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { utworz } from "../serwer.mjs";

const KAT = path.join(import.meta.dirname, "..", "public");
const nasluch = (s) => new Promise((r) => s.listen(0, "127.0.0.1", () => r(`http://127.0.0.1:${s.address().port}`)));
const zamknij = (s) => new Promise((r) => { s.closeAllConnections?.(); s.close(r); });

test("przekazuje ciało 1:1 (50 MB)", async () => {
  const dane = crypto.randomBytes(50 * 1024 * 1024);
  const atrapa = http.createServer(async (req, res) => {
    const h = crypto.createHash("sha256"); let n = 0;
    for await (const c of req) { h.update(c); n += c.length; }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ n, sha: h.digest("hex"), sciezka: req.url }));
  });
  const omenUrl = await nasluch(atrapa);
  const strona = utworz({ omenUrl, katalog: KAT });
  const url = await nasluch(strona);
  const r = await fetch(url + "/api/analiza?typ=firanka", { method: "POST", body: dane });
  assert.equal(r.status, 200);
  const j = await r.json();
  assert.equal(j.n, dane.length);
  assert.equal(j.sha, crypto.createHash("sha256").update(dane).digest("hex"));
  assert.equal(j.sciezka, "/analiza?typ=firanka");
  await zamknij(strona); await zamknij(atrapa);
});

for (const [nazwa, omenUrl] of [["martwa usługa", "http://127.0.0.1:9"], ["brak OMEN_URL", ""]]) {
  test(`${nazwa} → 503 z podpowiedzią`, async () => {
    const strona = utworz({ omenUrl, katalog: KAT });
    const url = await nasluch(strona);
    const r = await fetch(url + "/api/analiza", { method: "POST", body: Buffer.from("BM..") });
    assert.equal(r.status, 503);
    assert.match((await r.json()).blad, /wdroz\.sh --usluga/);
    const z = await fetch(url + "/api/zdrowie");
    assert.equal(z.status, 200);
    const zj = await z.json();
    assert.equal(zj.strona, "ok");
    assert.ok(zj.karta.blad);
    const p = await fetch(url + "/api/partia-pokazowa");
    assert.equal(p.status, 503);
    await zamknij(strona);
  });
}

test("przekazuje partię i zdrowie", async () => {
  const atrapa = http.createServer((req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(req.url === "/zdrowie" ? { ok: true } : { wyniki: [1, 2] }));
  });
  const omenUrl = await nasluch(atrapa);
  const strona = utworz({ omenUrl, katalog: KAT });
  const url = await nasluch(strona);
  assert.deepEqual(await (await fetch(url + "/api/partia-pokazowa")).json(), { wyniki: [1, 2] });
  assert.deepEqual(await (await fetch(url + "/api/zdrowie")).json(), { strona: "ok", karta: { ok: true } });
  await zamknij(strona); await zamknij(atrapa);
});

test("statyczne i ucieczka z katalogu", async () => {
  const strona = utworz({ omenUrl: "", katalog: KAT });
  const url = await nasluch(strona);
  const r = await fetch(url + "/");
  assert.equal(r.status, 200);
  assert.match(r.headers.get("content-type"), /text\/html/);
  const u = await new Promise((ok) => http.get(url + "/%2e%2e/serwer.mjs", (res) => { res.resume(); ok(res.statusCode); }));
  assert.ok([403, 404].includes(u));
  await zamknij(strona);
});

test("public bez adresów zewnętrznych", () => {
  for (const f of fs.readdirSync(KAT)) {
    const t = fs.readFileSync(path.join(KAT, f), "utf8");
    assert.doesNotMatch(t, /https?:\/\//, f);
  }
});

test("GET /%00 nie kładzie strony", async () => {
  const strona = utworz({ omenUrl: "", katalog: KAT });
  const url = await nasluch(strona);
  const kod = await new Promise((ok) => http.get(url + "/%00", (res) => { res.resume(); ok(res.statusCode); }).on("error", () => ok(0)));
  assert.ok([400, 404].includes(kod), String(kod));
  assert.equal((await fetch(url + "/")).status, 200);
  await zamknij(strona);
});

test("ciało chunked dochodzi do usługi z długością", async () => {
  const atrapa = http.createServer(async (req, res) => {
    let n = 0; for await (const c of req) n += c.length;
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ dl: req.headers["content-length"] || null, chunked: req.headers["transfer-encoding"] || null, n }));
  });
  const omenUrl = await nasluch(atrapa);
  const strona = utworz({ omenUrl, katalog: KAT });
  const url = await nasluch(strona);
  const j = await new Promise((ok, zle) => {
    const r = http.request(url + "/api/analiza", { method: "POST" }, async (res) => { let s = ""; for await (const c of res) s += c; ok(JSON.parse(s)); });
    r.on("error", zle); r.write(Buffer.alloc(1000, 1)); r.end(Buffer.alloc(500, 2));
  });
  assert.equal(j.n, 1500);
  assert.equal(j.dl, "1500");
  assert.equal(j.chunked, null);
  await zamknij(strona); await zamknij(atrapa);
});

test("za duży plik → 413 bez wysyłki do usługi", async () => {
  let wolana = false;
  const atrapa = http.createServer((req, res) => { wolana = true; res.end("{}"); });
  const omenUrl = await nasluch(atrapa);
  const strona = utworz({ omenUrl, katalog: KAT });
  const url = await nasluch(strona);
  const kod = await new Promise((ok) => {
    const r = http.request(url + "/api/analiza", { method: "POST", headers: { "content-length": String(200 * 1024 * 1024) } },
      (res) => { res.resume(); ok(res.statusCode); });
    r.on("error", () => ok(0)); r.write(Buffer.alloc(10));
  });
  assert.equal(kod, 413);
  assert.equal(wolana, false);
  await zamknij(strona); await zamknij(atrapa);
});

test("usługa nie zdąży → 503 „zajęta”, nie „uśpiona”", async () => {
  const atrapa = http.createServer(() => {});   // nigdy nie odpowiada
  const omenUrl = await nasluch(atrapa);
  const strona = utworz({ omenUrl, katalog: KAT, limitMs: 300 });
  const url = await nasluch(strona);
  const r = await fetch(url + "/api/analiza", { method: "POST", body: Buffer.from("BM..") });
  assert.equal(r.status, 503);
  const b = (await r.json()).blad;
  assert.match(b, /zajęta/);
  assert.doesNotMatch(b, /uśpiona/);
  await zamknij(strona); await zamknij(atrapa);
});

test("zad. 40: przekazuje /api/obraz i podaje widok.js z mvp/", async () => {
  const atrapa = http.createServer((req, res) => {
    res.writeHead(200, { "content-type": "image/bmp" });
    res.end("BM" + req.url);
  });
  const omenUrl = await nasluch(atrapa);
  const strona = utworz({ omenUrl, katalog: KAT });
  const url = await nasluch(strona);
  const r = await fetch(url + "/api/obraz?biblioteka=mini&id=wzorzec_mini_firanka_00");
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("content-type"), "image/bmp");
  assert.equal(await r.text(), "BM/obraz?biblioteka=mini&id=wzorzec_mini_firanka_00");
  const w = await fetch(url + "/widok.js");
  assert.equal(w.status, 200);
  assert.match(await w.text(), /renderWidokAuta/);
  const h = await (await fetch(url + "/")).text();
  assert.match(h, /src="widok\.js"/);
  await zamknij(strona); await zamknij(atrapa);
});
