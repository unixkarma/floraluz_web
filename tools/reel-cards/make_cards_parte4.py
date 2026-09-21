#!/usr/bin/env python3
"""
floraluz — generador de cartas, PARTE IV de
"transiciones que más me gustan de mis mezclas".

Cambios pedidos por el usuario para esta parte:
  - Carta 00 = solo "TRANSICIONES" (antes era "TRANSICIONES QUE MÁS ME
    GUSTAN" en I/II/III — si esto no era intencional avísame y lo regreso).
  - Nuevo tratamiento de texto: "resaltado negro y blanco, centrado en el
    medio" -> reemplaza el scrim difuminado de PARTE III por una barra
    SÓLIDA (bordes definidos, no blur) detrás del texto, centrada en el
    cuadro. Ver `add_highlight_bar`.
  - Colores invertidos: texto NEGRO sobre barra BLANCA (antes era al revés).

Cada carta sale en 3 versiones:
  - NAME.png           halo blanco difuminado (legado, para metraje oscuro)
  - NAME_noshadow.png  texto negro puro, sin nada detrás
  - NAME_highlight.png barra blanca sólida + texto negro (la nueva, pensada
                        para leerse encima de cualquier foto)

Tracklist PARTE IV:
  1. Adrian Quesada  — Starry Nights          — 2022 (álbum "Jaguar Sound")
  2. Fred Irie       — Pretty Girls Burn Sage — 2026
  3. Ikebe Shakedown — View From Above        — 2018 (álbum "Assassin")

Uso:  python3 tools/reel-cards/make_cards_parte4.py
Salida: ~/Desktop/floraluz-reel-04/
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

OUT_DIR = os.path.expanduser("~/Desktop/floraluz-reel-04")

BAND_TOP = 210
BAND_BOTTOM = 1230
BAND_MID = (BAND_TOP + BAND_BOTTOM) // 2

WHITE = (0, 0, 0, 255)          # colores invertidos: texto negro...
DIM = (0, 0, 0, 190)
BLACK_BAR = (255, 255, 255, 235)  # ...sobre barra blanca

TITLE_TEXT = "TRANSICIONES"
PART_TEXT = "PARTE  IV"

TRACKS = [
    {"idx": "01", "title": "STARRY NIGHTS", "artist": "ADRIAN QUESADA", "year": "2022", "slug": "starry-nights"},
    {"idx": "02", "title": "PRETTY GIRLS BURN SAGE", "artist": "FRED IRIE", "year": "2026", "slug": "pretty-girls-burn-sage"},
    {"idx": "03", "title": "VIEW FROM ABOVE", "artist": "IKEBE SHAKEDOWN", "year": "2018", "slug": "view-from-above"},
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
# Sombra (legado) + resaltado negro sólido (nuevo, pedido para esta parte)
# --------------------------------------------------------------------------- #

def add_shadow(content: Image.Image, blur=8, offset=(2, 5), alpha=210, rgb=(255, 255, 255)) -> Image.Image:
    """rgb=white por defecto: con texto negro (colores invertidos) un halo
    blanco es lo que da contraste, no una sombra negra."""
    a = content.split()[3].point(lambda v: v * alpha // 255)
    shadow = Image.new("RGBA", content.size, (*rgb, 0))
    shadow.putalpha(a)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    out = Image.new("RGBA", content.size, (0, 0, 0, 0))
    out.alpha_composite(shadow, offset)
    out.alpha_composite(content)
    return out


def add_highlight_bar(content: Image.Image, box, radius=14) -> Image.Image:
    """Barra blanca sólida (bordes definidos, sin blur) detrás del texto
    negro -- 'resaltado negro y blanco' pedido por el usuario, colores
    invertidos a pedido."""
    out = Image.new("RGBA", content.size, (0, 0, 0, 0))
    bar = Image.new("RGBA", content.size, (0, 0, 0, 0))
    ImageDraw.Draw(bar).rounded_rectangle(box, radius=radius, fill=BLACK_BAR)
    out.alpha_composite(bar)
    out.alpha_composite(content)
    return out


def save_trio(content: Image.Image, name: str, highlight_box):
    os.makedirs(OUT_DIR, exist_ok=True)
    add_shadow(content).save(os.path.join(OUT_DIR, f"{name}.png"))
    content.save(os.path.join(OUT_DIR, f"{name}_noshadow.png"))
    add_highlight_bar(content, highlight_box).save(os.path.join(OUT_DIR, f"{name}_highlight.png"))
    print(f"  {name}.png  +  {name}_noshadow.png  +  {name}_highlight.png")


def new_canvas():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)


def text_box(draw, lines, fnt, tracking, cx, cy, pad_x=56, pad_y=40, min_w=None):
    """Caja centrada en (cx, cy) que envuelve el bloque de texto, con margen."""
    asc, desc = fnt.getmetrics()
    lh = int((asc + desc) * 1.16)
    w = max(tracked_width(draw, ln, fnt, tracking) for ln in lines)
    if min_w:
        w = max(w, min_w)
    h = lh * len(lines)
    return (cx - w / 2 - pad_x, cy - h / 2 - pad_y, cx + w / 2 + pad_x, cy + h / 2 + pad_y)


# --------------------------------------------------------------------------- #
# Cartas
# --------------------------------------------------------------------------- #

def card_title():
    img, d = new_canvas()
    tracking = 8
    f = fit_font(d, [TITLE_TEXT], target_w=900, tracking=tracking, hi=200)
    draw_tracked(d, (W // 2, BAND_MID), TITLE_TEXT, f, tracking, WHITE, anchor="mm")
    box = text_box(d, [TITLE_TEXT], f, tracking, W // 2, BAND_MID)
    save_trio(img, "reel04_00_titulo", box)


def card_part():
    img, d = new_canvas()
    tracking = 10
    f = fit_font(d, [PART_TEXT], target_w=900, tracking=tracking, hi=260)
    draw_tracked(d, (W // 2, BAND_MID), PART_TEXT, f, tracking, WHITE, anchor="mm")
    box = text_box(d, [PART_TEXT], f, tracking, W // 2, BAND_MID)
    save_trio(img, "reel04_01_parte-iv", box)


def card_track_single(track, index_label):
    """Sin marco de portada -- solo índice/título/artista-año, centrados en
    el medio del cuadro (igual que las cartas de título/parte)."""
    img, d = new_canvas()

    scx = W // 2
    cy = BAND_MID
    idx_y = cy - 132
    rule_y = cy - 98
    title_y = cy + 6
    meta_y = cy + 92

    draw_tracked(d, (scx, idx_y), track["idx"], font(30), 6, DIM, anchor="mm")
    d.line([(scx - 46, rule_y), (scx + 46, rule_y)], fill=WHITE, width=3)
    tf = fit_font(d, [track["title"]], target_w=880, tracking=6, hi=110)
    draw_tracked(d, (scx, title_y), track["title"], tf, 6, WHITE, anchor="mm")
    meta = f'{track["artist"]}   ·   {track["year"]}'
    draw_tracked(d, (scx, meta_y), meta, font(32), 8, DIM, anchor="mm")

    box = text_box(d, [track["title"]], tf, 6, scx, title_y, pad_x=56, pad_y=20)
    box = (box[0], idx_y - 30, box[2], meta_y + 34)
    save_trio(img, f"reel04_{index_label}_{track['slug']}", box)


# --------------------------------------------------------------------------- #
# Fondo de prueba (solo para previsualizar contraste, no es una foto real)
# --------------------------------------------------------------------------- #

def make_fake_photo_bg() -> Image.Image:
    random.seed(11)
    top, bottom = (250, 210, 150), (30, 30, 45)
    grad = Image.new("RGB", (1, H))
    for y in range(H):
        t = y / (H - 1)
        grad.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    bg = grad.resize((W, H))

    overlay = Image.new("RGB", (W, H), (0, 0, 0))
    od = ImageDraw.Draw(overlay)
    colors = [(255, 255, 255), (255, 120, 80), (120, 220, 255), (255, 230, 120)]
    for _ in range(16):
        cx, cy = random.randint(0, W), random.randint(0, H)
        r = random.randint(60, 220)
        od.ellipse([cx - r, cy - r, cx + r, cy + r], fill=random.choice(colors))
    overlay = overlay.filter(ImageFilter.GaussianBlur(55))
    return Image.blend(bg, overlay, 0.4)


def preview_over_photo():
    bg = make_fake_photo_bg()

    plain = Image.open(os.path.join(OUT_DIR, "reel04_00_titulo.png")).convert("RGBA")
    hl = Image.open(os.path.join(OUT_DIR, "reel04_00_titulo_highlight.png")).convert("RGBA")

    left = bg.copy().convert("RGBA")
    left.alpha_composite(plain)
    right = bg.copy().convert("RGBA")
    right.alpha_composite(hl)

    pad = 20
    sheet = Image.new("RGB", (W * 2 + pad * 3, H + pad * 2), (20, 20, 20))
    sheet.paste(left.convert("RGB"), (pad, pad))
    sheet.paste(right.convert("RGB"), (W + pad * 2, pad))
    path = os.path.join(OUT_DIR, "_preview_sombra_vs_resaltado.jpg")
    sheet.save(path, quality=90)
    print(f"  preview -> {path}  (izquierda = sombra sola, derecha = +resaltado negro)")


# --------------------------------------------------------------------------- #

def contact_sheet():
    names = ["reel04_00_titulo", "reel04_01_parte-iv"] + [
        f"reel04_{i:02d}_{t['slug']}" for i, t in enumerate(TRACKS, start=2)
    ]
    thumb_w = 360
    thumb_h = int(thumb_w * H / W)
    pad = 24
    cols = len(names)
    sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * pad, thumb_h + 2 * pad), (74, 74, 74))
    for i, n in enumerate(names):
        card = Image.open(os.path.join(OUT_DIR, f"{n}_highlight.png")).convert("RGBA")
        bg = Image.new("RGB", card.size, (74, 74, 74))
        bg.paste(card, (0, 0), card)
        bg = bg.resize((thumb_w, thumb_h), Image.LANCZOS)
        sheet.paste(bg, (pad + i * (thumb_w + pad), pad))
    path = os.path.join(OUT_DIR, "_contact_sheet.png")
    sheet.save(path)
    print(f"  hoja de contactos -> {path}")


def main():
    print(f"Generando cartas PARTE IV en {OUT_DIR}")
    card_title()
    card_part()
    for i, t in enumerate(TRACKS, start=2):
        card_track_single(t, f"{i:02d}")
    preview_over_photo()
    contact_sheet()
    print("Listo.")


if __name__ == "__main__":
    main()
