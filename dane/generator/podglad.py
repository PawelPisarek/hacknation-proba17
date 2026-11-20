#!/usr/bin/env python3
"""BMP -> PNG (szary, numpy+zlib) do podglądu: podglad.py plik.bmp wyj.png [krok]."""
import sys, zlib, struct, numpy as np
f, out = sys.argv[1], sys.argv[2]; k = int(sys.argv[3]) if len(sys.argv) > 3 else 1
d = open(f, "rb").read(); off = int.from_bytes(d[10:14], "little"); w = int.from_bytes(d[18:22], "little"); h = int.from_bytes(d[22:26], "little")
row = (w * 3 + 3) // 4 * 4
a = np.ascontiguousarray(np.frombuffer(d, np.uint8, offset=off).reshape(h, row)[::-1, :w * 3:3][::k, ::k])
raw = b"".join(b"\0" + a[i].tobytes() for i in range(a.shape[0]))
ch = lambda t, b: struct.pack(">I", len(b)) + t + b + struct.pack(">I", zlib.crc32(t + b))
open(out, "wb").write(b"\x89PNG\r\n\x1a\n" + ch(b"IHDR", struct.pack(">IIBBBBB", a.shape[1], a.shape[0], 8, 0, 0, 0, 0)) + ch(b"IDAT", zlib.compress(raw)) + ch(b"IEND", b""))
