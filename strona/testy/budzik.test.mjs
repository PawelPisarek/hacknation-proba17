import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { utworzBudzik, zKolejki, RECZNIE } from "../../usluga/budzik.mjs";

const nasluch = (s) => new Promise((r) => s.listen(0, "127.0.0.1", () => r(`http://127.0.0.1:${s.address().port}`)));
const zamknij = (s) => new Promise((r) => { s.closeAllConnections?.(); s.close(r); });
const STAN = `OMEN:
  trzyma: zgl-1  gpu-tlo  inny · x · sh -c 'python trening.py'  od 19:06
  czeka 2.: zgl-2  gpu-tlo  budzik-usluga · hacknation · sh -c '. ~/venv/bin/activate && PYTHONPATH=src:. python -m usluga.serwer --host 0.0.0.0'  od 19:08
ThinkPad:`;

test("zKolejki: trzyma / czeka N. / brak", () => {
  assert.deepEqual(zKolejki(STAN), { kolejka: "czeka", pozycja: 2 });
  assert.deepEqual(zKolejki(STAN.replace("czeka 2.:", "trzyma:")), { kolejka: "trzyma" });
  assert.deepEqual(zKolejki("OMEN:\n  wolny"), { kolejka: "brak" });
});

test("budzik: uśpiona → /obudz zgłasza raz, potem „budzi się”; działa, gdy usługa zdrowa", async () => {
  let zdrowa = false, zgloszen = 0, kolejka = "OMEN:\n  wolny";
  const usluga = http.createServer((req, res) => {
    if (!zdrowa) { res.writeHead(503); return res.end("{}"); }
    res.writeHead(200, { "content-type": "application/json" }); res.end('{"ok": true}');
  });
  const uslugaUrl = await nasluch(usluga);
  const b = utworzBudzik({ uslugaUrl, kolejka: async () => kolejka, zglos: async () => { zgloszen++; } });
  const url = await nasluch(b);
  assert.equal((await (await fetch(url + "/stan")).json()).stan, "uśpiona");
  const o = await fetch(url + "/obudz", { method: "POST" });
  assert.equal(o.status, 202);
  assert.equal((await fetch(url + "/obudz", { method: "POST" })).status, 200);   // drugi klik nie zgłasza drugi raz
  assert.equal(zgloszen, 1);
  assert.equal((await (await fetch(url + "/stan")).json()).stan, "budzi się");
  kolejka = STAN;
  assert.equal((await (await fetch(url + "/stan")).json()).stan, "w kolejce");
  zdrowa = true;
  assert.equal((await (await fetch(url + "/stan")).json()).stan, "działa");
  await zamknij(b); await zamknij(usluga);
});

test("budzik: błąd zgłoszenia → 500 i „uśpiona” z powodem", async () => {
  const b = utworzBudzik({ uslugaUrl: "http://127.0.0.1:9", kolejka: async () => "", zglos: async () => { throw new Error("brak tokenu"); } });
  const url = await nasluch(b);
  const o = await fetch(url + "/obudz", { method: "POST" });
  assert.equal(o.status, 500);
  assert.equal((await o.json()).blad, "brak tokenu");
  const s = await (await fetch(url + "/stan")).json();
  assert.equal(s.stan, "uśpiona"); assert.equal(s.blad, "brak tokenu");
  await zamknij(b);
});

test("budzik bez zgłaszania (UPROSZCZENIE P86): uśpiona → 503 z napisem; obudzona ręcznie → „budzi się”", async () => {
  let kolejka = "OMEN:\n  wolny";
  const b = utworzBudzik({ uslugaUrl: "http://127.0.0.1:9", kolejka: async () => kolejka });
  const url = await nasluch(b);
  const o = await fetch(url + "/obudz", { method: "POST" });
  assert.equal(o.status, 503);
  assert.deepEqual(await o.json(), { stan: "uśpiona", blad: RECZNIE });
  kolejka = STAN.replace("czeka 2.:", "trzyma:");
  const p = await fetch(url + "/obudz", { method: "POST" });
  assert.equal(p.status, 200); assert.equal((await p.json()).stan, "budzi się");
  await zamknij(b);
});
