"""Create compact WOFF2 webfonts from the licensed source fonts, offline.

Keep Latin, punctuation, and symbols used across the three locales. The original
TTFs remain available for social-card generation and provenance.
Requires fontTools and Brotli, only for asset maintenance.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

directory = Path(__file__).resolve().parents[1] / "src/assets/fonts"
characters = set(range(0x0250)) | set(range(0x2000, 0x2070)) | set(range(0x2190, 0x2200))
for name in ["Halant-Regular", "Geist-Variable", "GeistMono-Variable"]:
    font = TTFont(directory / f"{name}.ttf")
    options = subset.Options()
    options.flavor = "woff2"
    worker = subset.Subsetter(options=options)
    worker.populate(unicodes=characters)
    worker.subset(font)
    font.flavor = "woff2"
    destination = directory / f"{name}.woff2"
    font.save(destination)
    print(f"{destination.name}: {destination.stat().st_size} bytes")
