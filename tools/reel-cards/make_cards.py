#!/usr/bin/env python3
"""
floraluz — generador de cartas para la serie de reels
"transiciones que más me gustan de mis mezclas".

Estilo (consistente con la PARTE I):
  - 1080x1920, PNG transparente, texto blanco, fuente Menlo Bold ("monospace
    bold elegantón").
  - Cada carta sale en dos versiones: normal (con sombra suave para que se lea
    sobre cualquier metraje) y `_noshadow` (blanco puro, para la barra negra).

PARTE II — cambios pedidos por el usuario:
  - Los dos primeros slides son PURO TEXTO, sin cuadrícula:
      00  "TRANSICIONES QUE MÁS ME GUSTAN"
      01  "PARTE II"  (grande)
  - Texto subido al centro-alto: el tercio inferior queda libre para que la
    descripción y los hashtags de Instagram no tapen nada.
  - Las cartas de tracks van en CUADRÍCULA: nombre + artista + año, con un
    hueco cuadrado transparente reservado para la portada (se compone abajo en
    Kdenlive). Guía de marco + esquinas para saber dónde cae.

Tracklist PARTE II:
  1. Burial  — Near Dark   — 2007  (álbum "Untrue", Hyperdub)
  2. Ratatat — Loud Pipes  — 2006  (álbum "Classics")

Uso:  python3 tools/reel-cards/make_cards.py
Salida: ~/Desktop/floraluz-reel-02/
"""

from __future__ import annotations

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# --------------------------------------------------------------------------- #
# Config
# --------------------------------------------------------------------------- #

W, H = 1080, 1920

FONT_PATH = "/System/Library/Fonts/Menlo.ttc"
FONT_INDEX = 1  # Menlo Bold

OUT_DIR = os.path.expanduser("~/Desktop/floraluz-reel-02")

# Zona segura vertical: el texto vive aquí; debajo queda libre para la
# descripción / hashtags de Instagram.
BAND_TOP = 210
BAND_BOTTOM = 1230
BAND_MID = (BAND_TOP + BAND_BOTTOM) // 2  # ~720

WHITE = (255, 255, 255, 255)
DIM = (255, 255, 255, 190)
LINE = (255, 255, 255, 110)
GUIDE = (255, 255, 255, 125)
TICK = (255, 255, 255, 225)

# Mayúsculas para toda la serie (igual que la PARTE I).
TITLE_TEXT = ["TRANSICIONES", "QUE MÁS ME", "GUSTAN"]
PART_TEXT = "PARTE  II"

TRACKS = [
    {"idx": "01", "title": "LOUD PIPES", "artist": "RATATAT", "year": "2006", "slug": "loud-pipes"},
    {"idx": "02", "title": "NEAR DARK",  "artist": "BURIAL",  "year": "2007", "slug": "near-dark"},
]

# --------------------------------------------------------------------------- #
# Helpers de texto (Menlo es monoespaciada -> el tracking se hace a mano)
# --------------------------------------------------------------------------- #

def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size, index=FONT_INDEX)


def tracked_width(draw: ImageDraw.ImageDraw, text: str, fnt, tracking: float) -> float:
    if not text:
        return 0.0
    w = sum(draw.textlength(ch, font=fnt) for ch in text)
    return w + tracking * (len(text) - 1)


def draw_tracked(draw, xy, text, fnt, tracking, fill, anchor="la"):
    """anchor: primer char = h (l/m/r), segundo = v (a top / m middle / s baseline / d bottom)."""
    x, y = xy
    total = tracked_width(draw, text, fnt, tracking)
    ha = anchor[0]
    if ha == "m":
        x -= total / 2
    elif ha == "r":
        x -= total

    va = anchor[1] if len(anchor) > 1 else "a"
    asc, desc = fnt.getmetrics()
    if va == "m":
        y -= (asc + desc) / 2
    elif va == "s":
        y -= asc
    elif va == "d":
        y -= (asc + desc)

    cx = x
    for ch in text:
        draw.text((cx, y), ch, font=fnt, fill=fill, anchor="la")
        cx += draw.textlength(ch, font=fnt) + tracking
    return total


def fit_font(draw, lines, target_w, tracking, lo=20, hi=420):
    """Búsqueda binaria: el tamaño más grande cuya línea más ancha <= target_w."""
    best = lo
    while lo <= hi:
        mid = (lo + hi) // 2
        f = font(mid)
        wmax = max(tracked_width(draw, ln, f, tracking) for ln in lines)
        if wmax <= target_w:
            best, lo = mid, mid + 1
        else:
            hi = mid - 1
    return font(best)


# --------------------------------------------------------------------------- #
# Sombra
# --------------------------------------------------------------------------- #

def add_shadow(content: Image.Image, blur=8, offset=(2, 5), alpha=210) -> Image.Image:
    a = content.split()[3].point(lambda v: v * alpha // 255)
    shadow = Image.new("RGBA", content.size, (0, 0, 0, 0))
    shadow.putalpha(a)  # rgb=0 -> negro
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    out = Image.new("RGBA", content.size, (0, 0, 0, 0))
    out.alpha_composite(shadow, offset)
    out.alpha_composite(content)
    return out


def save_pair(content: Image.Image, name: str):
    os.makedirs(OUT_DIR, exist_ok=True)
    add_shadow(content).save(os.path.join(OUT_DIR, f"{name}.png"))
    content.save(os.path.join(OUT_DIR, f"{name}_noshadow.png"))
    print(f"  {name}.png  +  {name}_noshadow.png")


def new_canvas():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)


# --------------------------------------------------------------------------- #
# Cartas
# --------------------------------------------------------------------------- #

def card_title():
    img, d = new_canvas()
    tracking = 6
    f = fit_font(d, TITLE_TEXT, target_w=920, tracking=tracking, hi=170)
    asc, desc = f.getmetrics()
    lh = int((asc + desc) * 1.16)
    block_h = lh * len(TITLE_TEXT)
    y = BAND_MID - block_h // 2 + lh // 2
    for ln in TITLE_TEXT:
        draw_tracked(d, (W // 2, y), ln, f, tracking, WHITE, anchor="mm")
        y += lh
    save_pair(img, "reel02_00_titulo")


def card_part():
    img, d = new_canvas()
    tracking = 10
    f = fit_font(d, [PART_TEXT], target_w=900, tracking=tracking, hi=260)
    draw_tracked(d, (W // 2, BAND_MID), PART_TEXT, f, tracking, WHITE, anchor="mm")
    save_pair(img, "reel02_01_parte-ii")


def _square_guide(d, box):
    """Marco fino + esquinas en L. El interior queda transparente: la portada
    va en una capa por debajo en Kdenlive."""
    x0, y0, x1, y1 = box
    d.rectangle(box, outline=GUIDE, width=2)
    t = 30  # largo de la esquina
    wdt = 5
    for cx, cy, dx, dy in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)):
        d.line([(cx, cy), (cx + dx * t, cy)], fill=TICK, width=wdt)
        d.line([(cx, cy), (cx, cy + dy * t)], fill=TICK, width=wdt)


def card_grid():
    """Cuadrícula con los dos tracks: columna de portada + columna de texto,
    divisor horizontal entre los dos tracks."""
    img, d = new_canvas()

    gx0, gy0, gx1, gy1 = 72, 262, 1008, 1178
    col_split = gx0 + 414         # ancho de la columna de portada
    row_split = (gy0 + gy1) // 2  # divisor entre track 1 y track 2

    # rejilla
    d.rectangle([gx0, gy0, gx1, gy1], outline=LINE, width=2)
    d.line([(gx0, row_split), (gx1, row_split)], fill=LINE, width=2)
    d.line([(col_split, gy0), (col_split, gy1)], fill=LINE, width=2)

    sq = 356
    tx = col_split + 52
    text_w = gx1 - tx - 40

    rows = [(gy0 + row_split) // 2, (row_split + gy1) // 2]
    for track, cy in zip(TRACKS, rows):
        # hueco de portada
        pcx = (gx0 + col_split) // 2
        _square_guide(d, (pcx - sq // 2, cy - sq // 2, pcx + sq // 2, cy + sq // 2))

        # texto
        draw_tracked(d, (tx, cy - 96), track["idx"], font(26), 4, DIM, anchor="lm")
        d.line([(tx, cy - 66), (tx + 74, cy - 66)], fill=WHITE, width=3)
        tf = fit_font(d, [track["title"]], target_w=text_w, tracking=4, hi=88)
        draw_tracked(d, (tx, cy + 4), track["title"], tf, 4, WHITE, anchor="lm")
        meta = f'{track["artist"]}   ·   {track["year"]}'
        draw_tracked(d, (tx, cy + 74), meta, font(27), 6, DIM, anchor="lm")

    save_pair(img, "reel02_02_grid")


def card_track_single(track):
    """Una carta por track: portada cuadrada grande arriba, texto centrado debajo."""
    img, d = new_canvas()

    sq = 560
    scx = W // 2
    sy0 = BAND_TOP + 24
    _square_guide(d, (scx - sq // 2, sy0, scx + sq // 2, sy0 + sq))

    cy = sy0 + sq + 96
    draw_tracked(d, (scx, cy), track["idx"], font(30), 6, DIM, anchor="mm")
    d.line([(scx - 46, cy + 34), (scx + 46, cy + 34)], fill=WHITE, width=3)
    tf = fit_font(d, [track["title"]], target_w=900, tracking=6, hi=120)
    draw_tracked(d, (scx, cy + 118), track["title"], tf, 6, WHITE, anchor="mm")
    meta = f'{track["artist"]}   ·   {track["year"]}'
    draw_tracked(d, (scx, cy + 196), meta, font(32), 8, DIM, anchor="mm")

    letter = "a" if track is TRACKS[0] else "b"
    save_pair(img, f"reel02_03{letter}_{track['slug']}")


# --------------------------------------------------------------------------- #
# Hoja de contactos (solo para revisar; no va al reel)
# --------------------------------------------------------------------------- #

def contact_sheet():
    names = [
        "reel02_00_titulo", "reel02_01_parte-ii", "reel02_02_grid",
        f"reel02_03a_{TRACKS[0]['slug']}", f"reel02_03b_{TRACKS[1]['slug']}",
    ]
    thumb_w = 360
    thumb_h = int(thumb_w * H / W)
    pad = 24
    cols = len(names)
    sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * pad, thumb_h + 2 * pad), (74, 74, 74))
    for i, n in enumerate(names):
        card = Image.open(os.path.join(OUT_DIR, f"{n}.png")).convert("RGBA")
        bg = Image.new("RGB", card.size, (74, 74, 74))
        bg.paste(card, (0, 0), card)
        bg = bg.resize((thumb_w, thumb_h), Image.LANCZOS)
        sheet.paste(bg, (pad + i * (thumb_w + pad), pad))
    path = os.path.join(OUT_DIR, "_contact_sheet.png")
    sheet.save(path)
    print(f"  hoja de contactos -> {path}")


# --------------------------------------------------------------------------- #

def main():
    print(f"Generando cartas PARTE II en {OUT_DIR}")
    card_title()
    card_part()
    card_grid()
    for t in TRACKS:
        card_track_single(t)
    contact_sheet()
    print("Listo.")


if __name__ == "__main__":
    main()
