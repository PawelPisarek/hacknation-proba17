// BMP 24-bit (szarość, wiersze od dołu) -> PNG w skali szarości. Użycie: node bmp2png.mjs wej.bmp wyj.png
import fs from "fs"; import zlib from "zlib";
const [, , wej, wyj] = process.argv;
const b = fs.readFileSync(wej);
const off = b.readUInt32LE(10), W = b.readInt32LE(18), Hs = b.readInt32LE(22), bpp = b.readUInt16LE(28);
const H = Math.abs(Hs), bpx = bpp / 8, row = Math.ceil(W * bpx / 4) * 4;
const raw = Buffer.alloc((W + 1) * H);
for (let y = 0; y < H; y++) {
  const src = off + (Hs > 0 ? H - 1 - y : y) * row;
  raw[y * (W + 1)] = 0;
  for (let x = 0; x < W; x++) raw[y * (W + 1) + 1 + x] = b[src + x * bpx + 1];
}
const crcT = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc = (buf) => { let c = -1; for (const v of buf) c = crcT[(c ^ v) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 0;
fs.writeFileSync(wyj, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]));
