"""Turn the supplied client logos (brand/clients) into black-on-transparent
PNGs of equal visual weight for the site (public/clients).
Run: python3 scripts/mono-logos.py  (needs pillow and numpy)"""
from PIL import Image
import numpy as np

SRC = 'brand/clients/'
# mode 'dark': ink sits on a light ground; 'light': ink sits on a dark ground;
# 'knockout': coloured shapes become ink and dark marks inside them become holes;
# 'lum': only dark marks are ink, light colour fills drop to the page.
# scale: optical size correction after area normalisation.
# soft: how much faint ink (anti-aliasing, pale fills) to drop.
CFG = {
    'adecco': ('adecco.webp', 'dark', 0.25, 1.0),
    'the-christmas-factory': ('the-christmas-factory.webp', 'dark', 0.35, 1.2),
    'dreamstar': ('dreamstar.png', 'dark', 0.35, 0.95),
    'all-about-events': ('all-about-events.png', 'light', 0.18, 1.2),
    'koilakos-carpark': ('koilakos-carpark.jpg', 'knockout', 0.12, 1.0),
    'easy-service-maragopoulos': ('easy-service-maragopoulos.png', 'knockout', 0.2, 1.0),
    'oceansouth': ('oceansouth.jpg', 'lum', 0.2, 1.05),
}
TARGET_AREA = 26000 * 4  # equal optical area, at 2x display density

for name, (fn, mode, soft, scale) in CFG.items():
    a = np.asarray(Image.open(SRC + fn).convert('RGBA')).astype(float) / 255
    rgb, alpha = a[..., :3], a[..., 3:]
    rgb = rgb * alpha if mode == 'light' else rgb * alpha + (1 - alpha)
    lum = rgb @ [0.2126, 0.7152, 0.0722]
    sat = rgb.max(-1) - rgb.min(-1)  # coloured marks count as ink
    if mode == 'dark':
        ink = np.clip((1 - lum) + sat * 0.9, 0, 1)
    elif mode == 'lum':
        ink = np.clip((0.62 - lum) / 0.3, 0, 1)
    elif mode == 'light':
        ink = np.clip(lum + sat * 0.5, 0, 1)
    else:
        dark = np.clip((0.55 - lum) / 0.35, 0, 1)
        colour = np.clip((sat - 0.15) / 0.3, 0, 1) * np.clip((lum - 0.35) / 0.2, 0, 1)
        ink = np.abs(colour - dark)
    ink = np.clip((ink - soft) / (1 - soft) * 1.6, 0, 1)
    out = np.zeros(a.shape)
    out[..., 3] = ink
    im = Image.fromarray((out * 255).astype('uint8'), 'RGBA')
    im = im.crop(im.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox())
    w, h = im.size
    s = min((TARGET_AREA / (w * h)) ** 0.5 * scale, 300 / h, 520 / w)
    im = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    im.save(f'public/clients/{name}.png', optimize=True)
    print(name, im.size)
