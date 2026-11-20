"""Wczytywanie BMP (8/24/32-bit, bez kompresji) bez kopiowania całego pliku: numpy.memmap."""
import numpy as np


def wczytaj_szarosc(sciezka, krok=1):
    """Zwraca uint8 (H,W) w orientacji y od góry; krok>1 = co krok-ty piksel (szybki podgląd)."""
    with open(sciezka, "rb") as f:
        hdr = f.read(54)
    if hdr[:2] != b"BM":
        raise ValueError(f"{sciezka}: to nie BMP")
    off = int.from_bytes(hdr[10:14], "little")
    w = int.from_bytes(hdr[18:22], "little", signed=True)
    h = int.from_bytes(hdr[22:26], "little", signed=True)
    bpp = int.from_bytes(hdr[28:30], "little")
    kompr = int.from_bytes(hdr[30:34], "little")
    if kompr not in (0, 3) or bpp not in (8, 24, 32):
        from PIL import Image  # rzadkie formaty
        g = np.asarray(Image.open(sciezka).convert("L"))
        return g[::krok, ::krok]
    B = bpp // 8
    row = ((w * B + 3) // 4) * 4
    hh = abs(h)
    m = np.memmap(sciezka, np.uint8, "r", offset=off, shape=(hh, row))
    g = m[:, : w * B].reshape(hh, w, B)[:, :, 1 if B >= 3 else 0]  # kanał G (szarość: R=G=B)
    if h > 0:
        g = g[::-1]
    return np.ascontiguousarray(g[::krok, ::krok])
