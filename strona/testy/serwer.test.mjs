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
