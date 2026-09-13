"""Fetch licensed, text-subset font files once; production serves local assets.

Run again after adding CJK copy. The Google Fonts request contains only public
landing copy. Font files and OFL licenses are committed with the site.
"""
import json
import io
import re
import urllib.parse
import urllib.request
from pathlib import Path
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
dest = root / "public/fonts"
dest.mkdir(parents=True, exist_ok=True)

def strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for item in value.values():
            yield from strings(item)

for locale, suffix in [("zh", "SC"), ("ja", "JP")]:
    data = json.loads((root / f"src/messages/{locale}.json").read_text())
    chars = "".join(sorted({c for s in strings(data) for c in s if ord(c) > 127}))
    for role in ["Sans", "Serif"]:
        family = f"Noto {role} {suffix}"
        params = urllib.parse.urlencode({"family": family + ":wght@400", "display": "swap", "text": chars})
        request = urllib.request.Request("https://fonts.googleapis.com/css2?" + params, headers={"User-Agent": "Mozilla/5.0"})
        css = urllib.request.urlopen(request, timeout=30).read().decode()
        url = re.search(r"url\((https[^)]+)\)", css).group(1)
        content = urllib.request.urlopen(url, timeout=30).read()
        font = TTFont(io.BytesIO(content))
        font.flavor = "woff2"
        font.save(dest / f"noto-{role.lower()}-{locale}.woff2")
        license_url = f"https://raw.githubusercontent.com/google/fonts/main/ofl/noto{role.lower()}{suffix.lower()}/OFL.txt"
        license_content = urllib.request.urlopen(license_url, timeout=30).read()
        (dest / f"noto-{role.lower()}-{locale}-OFL.txt").write_bytes(license_content)
        print(f"{family}: {len(chars)} characters, {len(content)} bytes")
