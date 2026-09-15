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
const spark = (await readFile(new URL("../public/brand/spark.svg", import.meta.url), "utf8")).replace("#E7803F", "#ffffff");
const temporary = await mkdtemp(join(tmpdir(), "scispark-social-fonts-"));

try {
  // Compact messaging previews need a recognizable mark, not a miniature headline.
  const thumbnail = new ImageResponse(h("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F97316" } },
    h("img", { src: `data:image/svg+xml;base64,${Buffer.from(spark).toString("base64")}`, width: 360, height: 360 })
  ), { width: 600, height: 600 });
  await writeFile(new URL("share-icon-v2.png", output), Buffer.from(await thumbnail.arrayBuffer()));
  console.log("Generated share-icon-v2.png");
  for (const locale of ["en", "zh", "ja"]) {
    const copy = JSON.parse(await readFile(new URL(`../src/messages/${locale}.json`, import.meta.url), "utf8")).Site;
    const fonts = [{ name: "Halant", data: regular, weight: 400 }];
    if (locale !== "en") {
      const target = join(temporary, `${locale}.ttf`);
      execFileSync("python3", ["-c", "from fontTools.ttLib import TTFont; import sys; f=TTFont(sys.argv[1]); f.flavor=None; f.save(sys.argv[2])", new URL(`../public/fonts/noto-serif-${locale}.woff2`, import.meta.url).pathname, target]);
      fonts.push({ name: "Noto", data: await readFile(target), weight: 400 });
    }
    // Keep all wide-card content inside the central 600px for square crops, too.
    const image = new ImageResponse(h("div", { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fefaf5", color: "#2b180a", fontFamily: locale === "en" ? "Halant" : "Noto" } },
      h("img", { src: `data:image/png;base64,${wordmark.toString("base64")}`, width: 520, height: 260 }),
      h("div", { style: { display: "flex", fontSize: locale === "en" ? 48 : 44, lineHeight: 1.3, maxWidth: 580, textAlign: "center", marginTop: 8 } }, copy.closingTitle),
      h("div", { style: { width: 64, height: 6, marginTop: 38, borderRadius: 3, background: "#F97316" } })
    ), { width: 1200, height: 630, fonts });
    await writeFile(new URL(`${locale}-v2.png`, output), Buffer.from(await image.arrayBuffer()));
    console.log(`Generated ${locale}-v2.png`);
  }
} finally { await rm(temporary, { recursive: true, force: true }); }
