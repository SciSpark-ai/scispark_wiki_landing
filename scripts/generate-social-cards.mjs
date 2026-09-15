import { ImageResponse } from "next/og.js";
import { createElement as h } from "react";
import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const output = new URL("../public/og/", import.meta.url);
await mkdir(output, { recursive: true });
const regular = await readFile(new URL("../src/assets/fonts/Halant-Regular.ttf", import.meta.url));
const wordmark = await readFile(new URL("../public/brand/wordmark.png", import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), "scispark-social-fonts-"));

try {
  const bodyPath = join(temporary, "geist-regular.ttf");
  execFileSync("python3", ["-c", "from fontTools.ttLib import TTFont; from fontTools.varLib.instancer import instantiateVariableFont; import sys; f=TTFont(sys.argv[1]); f=instantiateVariableFont(f, {a.axisTag:a.defaultValue for a in f['fvar'].axes}); f.save(sys.argv[2])", new URL("../src/assets/fonts/Geist-Variable.ttf", import.meta.url).pathname, bodyPath]);
  const body = await readFile(bodyPath);
  for (const locale of ["en", "zh", "ja"]) {
    const copy = JSON.parse(await readFile(new URL(`../src/messages/${locale}.json`, import.meta.url), "utf8")).Site;
    const fonts = [{ name: "Halant", data: regular, weight: 400 }, { name: "Geist", data: body, weight: 400 }];
    if (locale !== "en") {
      const target = join(temporary, `${locale}.ttf`);
      execFileSync("python3", ["-c", "from fontTools.ttLib import TTFont; import sys; f=TTFont(sys.argv[1]); f.flavor=None; f.save(sys.argv[2])", new URL(`../public/fonts/noto-serif-${locale}.woff2`, import.meta.url).pathname, target]);
      fonts.push({ name: "Noto", data: await readFile(target), weight: 400 });
    }
    const image = new ImageResponse(h("div", { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#fefaf5", color: "#2b180a", padding: "38px 74px", fontFamily: locale === "en" ? "Halant" : "Noto" } },
      h("img", { src: `data:image/png;base64,${wordmark.toString("base64")}`, width: 200, height: 100, style: { marginLeft: -5 } }),
      h("div", { style: { display: "flex", fontSize: locale === "en" ? 66 : 60, lineHeight: 1.2, maxWidth: 1000, marginTop: 28 } }, copy.headline),
      h("div", { style: { display: "flex", fontSize: 25, lineHeight: 1.6, color: "#716559", marginTop: 24, maxWidth: 920, fontFamily: locale === "en" ? "Geist" : "Noto" } }, copy.intro),
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 24, borderTop: "1px solid #e8d3c0", fontFamily: locale === "en" ? "Geist" : "Noto", fontSize: 21 } },
        h("span", { style: { color: "#716559" } }, "landing.scispark.ai"),
        h("span", { style: { color: "#a64717" } }, copy.try)
      )
    ), { width: 1200, height: 630, fonts });
    await writeFile(new URL(`${locale}.png`, output), Buffer.from(await image.arrayBuffer()));
    console.log(`Generated ${locale}.png`);
  }
} finally { await rm(temporary, { recursive: true, force: true }); }
