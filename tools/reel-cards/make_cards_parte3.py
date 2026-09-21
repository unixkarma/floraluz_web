#!/usr/bin/env python3
"""
floraluz — generador de cartas, PARTE III de
"transiciones que más me gustan de mis mezclas".

Cambio de esta parte: el fondo del reel va a ser FOTOS (no metraje de video
con barra negra), así que además de las variantes de siempre se agrega un
`_scrim` — un parche oscuro suave detrás del texto (blur grande, sin bordes
duros) para que se lea encima de cualquier foto, no solo detrás de las letras.

Cada carta sale en 3 versiones:
  - NAME.png          sombra normal (para metraje / fondos oscuros)
  - NAME_noshadow.png blanco puro, sin nada detrás (para la barra negra)
  - NAME_scrim.png     sombra + parche oscuro difuminado (recomendado para fotos)

Tracklist PARTE III:
  1. Jazz Liberatorz — Blue Avenue — 2009
  2. DeBarge         — Stay With Me — 1983 (álbum "In a Special Way")
  3. Bonobo          — Gypsy        — 2000

TODO (pendiente de confirmar con el usuario):
  - Texto de la carta 00: se dejó "TRANSICIONES QUE MÁS ME GUSTAN" igual que
    PARTE I/II por consistencia de la serie. Si de verdad quieres acortarlo a
    "TRANSICIONES QUE ME GUSTAN" avísame y lo cambio.

Uso:  python3 tools/reel-cards/make_cards_parte3.py
Salida: ~/Desktop/floraluz-reel-03/
"""

from __future__ import annotations

import os
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# --------------------------------------------------------------------------- #
# Config
# --------------------------------------------------------------------------- #

W, H = 1080, 1920

FONT_PATH = "/System/Library/Fonts/Menlo.ttc"
FONT_INDEX = 1  # Menlo Bold

OUT_DIR = os.path.expanduser("~/Desktop/floraluz-reel-03")

BAND_TOP = 210
BAND_BOTTOM = 1230
BAND_MID = (BAND_TOP + BAND_BOTTOM) // 2

WHITE = (255, 255, 255, 255)
DIM = (255, 255, 255, 190)
LINE = (255, 255, 255, 110)
GUIDE = (255, 255, 255, 125)
TICK = (255, 255, 255, 225)

TITLE_TEXT = ["TRANSICIONES", "QUE MÁS ME", "GUSTAN"]  # ver TODO arriba
PART_TEXT = "PARTE  III"

TRACKS = [
    {"idx": "01", "title": "BLUE AVENUE", "artist": "JAZZ LIBERATORZ", "year": "2009", "slug": "blue-avenue"},
    {"idx": "02", "title": "STAY WITH ME", "artist": "DEBARGE", "year": "1983", "slug": "stay-with-me"},
    {"idx": "03", "title": "GYPSY", "artist": "BONOBO", "year": "2000", "slug": "gypsy"},
]

# --------------------------------------------------------------------------- #
# Helpers de texto
# --------------------------------------------------------------------------- #

def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size, index=FONT_INDEX)


def tracked_width(draw, text, fnt, tracking) -> float:
    if not text:
        return 0.0
    w = sum(draw.textlength(ch, font=fnt) for ch in text)
    return w + tracking * (len(text) - 1)


def draw_tracked(draw, xy, text, fnt, tracking, fill, anchor="la"):
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
# Sombra + scrim (contraste sobre fotos)
# --------------------------------------------------------------------------- #

def add_shadow(content: Image.Image, blur=8, offset=(2, 5), alpha=210) -> Image.Image:
    a = content.split()[3].point(lambda v: v * alpha // 255)
    shadow = Image.new("RGBA", content.size, (0, 0, 0, 0))
    shadow.putalpha(a)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    out = Image.new("RGBA", content.size, (0, 0, 0, 0))
    out.alpha_composite(shadow, offset)
    out.alpha_composite(content)
    return out


def make_scrim_layer(box, opacity=150, blur=110) -> Image.Image:
    """Parche negro difuminado (sin bordes duros) detrás de una zona de texto,
    para que se lea encima de una foto ocupada, no solo detrás de cada letra."""
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).rectangle(box, fill=opacity)
    mask = mask.filter(ImageFilter.GaussianBlur(blur))
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    layer.putalpha(mask)
    return layer


def save_trio(content: Image.Image, name: str, scrim_box):
    os.makedirs(OUT_DIR, exist_ok=True)
    add_shadow(content).save(os.path.join(OUT_DIR, f"{name}.png"))
    content.save(os.path.join(OUT_DIR, f"{name}_noshadow.png"))

    with_scrim = Image.new("RGBA", content.size, (0, 0, 0, 0))
    with_scrim.alpha_composite(make_scrim_layer(scrim_box))
    with_scrim.alpha_composite(content)
    with_scrim = add_shadow(with_scrim, blur=6, alpha=160)
    with_scrim.save(os.path.join(OUT_DIR, f"{name}_scrim.png"))

    print(f"  {name}.png  +  {name}_noshadow.png  +  {name}_scrim.png")


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
    box = (60, BAND_MID - block_h // 2 - 60, W - 60, BAND_MID + block_h // 2 + 60)
    save_trio(img, "reel03_00_titulo", box)


def card_part():
    img, d = new_canvas()
    tracking = 10
    f = fit_font(d, [PART_TEXT], target_w=900, tracking=tracking, hi=260)
    draw_tracked(d, (W // 2, BAND_MID), PART_TEXT, f, tracking, WHITE, anchor="mm")
    asc, desc = f.getmetrics()
    box = (60, BAND_MID - (asc + desc), W - 60, BAND_MID + (asc + desc))
    save_trio(img, "reel03_01_parte-iii", box)


def _square_guide(d, box):
    x0, y0, x1, y1 = box
    d.rectangle(box, outline=GUIDE, width=2)
    t = 30
    wdt = 5
    for cx, cy, dx, dy in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)):
        d.line([(cx, cy), (cx + dx * t, cy)], fill=TICK, width=wdt)
        d.line([(cx, cy), (cx, cy + dy * t)], fill=TICK, width=wdt)


def card_track_single(track, index_label):
    """Portada cuadrada grande arriba (hueco transparente, foto va debajo en
    Kdenlive) + índice/título/artista-año centrados debajo."""
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

    # el scrim solo detrás del texto (NO detrás del hueco de portada: ahí va
    # la foto real, no queremos oscurecerla de antemano)
    box = (60, cy - 80, W - 60, cy + 240)
    save_trio(img, f"reel03_{index_label}_{track['slug']}", box)


# --------------------------------------------------------------------------- #
# Fondo de prueba (SOLO para previsualizar contraste — no es una foto real,
# reemplázalo por tus fotos cuando las tengas listas)
# --------------------------------------------------------------------------- #

def make_fake_photo_bg() -> Image.Image:
    random.seed(7)
    top, bottom = (255, 196, 120), (40, 20, 60)
    grad = Image.new("RGB", (1, H))
    for y in range(H):
        t = y / (H - 1)
        grad.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    bg = grad.resize((W, H))

    overlay = Image.new("RGB", (W, H), (0, 0, 0))
    od = ImageDraw.Draw(overlay)
    colors = [(255, 255, 255), (255, 80, 120), (120, 200, 255), (255, 220, 90)]
    for _ in range(14):
        cx, cy = random.randint(0, W), random.randint(0, H)
        r = random.randint(60, 220)
        od.ellipse([cx - r, cy - r, cx + r, cy + r], fill=random.choice(colors))
    overlay = overlay.filter(ImageFilter.GaussianBlur(60))
    return Image.blend(bg, overlay, 0.35)


def preview_over_photo():
    """Compone plain vs. scrim lado a lado sobre el fondo de prueba, para
    responder directo: '¿así se va a ver el texto con la imagen?'"""
    bg = make_fake_photo_bg()

    plain = Image.open(os.path.join(OUT_DIR, "reel03_00_titulo.png")).convert("RGBA")
    scrim = Image.open(os.path.join(OUT_DIR, "reel03_00_titulo_scrim.png")).convert("RGBA")

    left = bg.copy().convert("RGBA")
    left.alpha_composite(plain)
    right = bg.copy().convert("RGBA")
    right.alpha_composite(scrim)

    pad = 20
    sheet = Image.new("RGB", (W * 2 + pad * 3, H + pad * 2), (20, 20, 20))
    sheet.paste(left.convert("RGB"), (pad, pad))
    sheet.paste(right.convert("RGB"), (W + pad * 2, pad))
    path = os.path.join(OUT_DIR, "_preview_sin-scrim_vs_con-scrim.jpg")
    sheet.save(path, quality=90)
    print(f"  preview -> {path}  (izquierda = sombra normal, derecha = +scrim)")


# --------------------------------------------------------------------------- #

def contact_sheet():
    names = ["reel03_00_titulo", "reel03_01_parte-iii"] + [
        f"reel03_{i:02d}_{t['slug']}" for i, t in enumerate(TRACKS, start=2)
    ]
    thumb_w = 360
    thumb_h = int(thumb_w * H / W)
    pad = 24
    cols = len(names)
    sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * pad, thumb_h + 2 * pad), (74, 74, 74))
    for i, n in enumerate(names):
        card = Image.open(os.path.join(OUT_DIR, f"{n}_scrim.png")).convert("RGBA")
        bg = Image.new("RGB", card.size, (74, 74, 74))
        bg.paste(card, (0, 0), card)
        bg = bg.resize((thumb_w, thumb_h), Image.LANCZOS)
        sheet.paste(bg, (pad + i * (thumb_w + pad), pad))
    path = os.path.join(OUT_DIR, "_contact_sheet.png")
    sheet.save(path)
    print(f"  hoja de contactos -> {path}")


def main():
    print(f"Generando cartas PARTE III en {OUT_DIR}")
    card_title()
    card_part()
    for i, t in enumerate(TRACKS, start=2):
        card_track_single(t, f"{i:02d}")
    preview_over_photo()
    contact_sheet()
    print("Listo.")


if __name__ == "__main__":
    main()
