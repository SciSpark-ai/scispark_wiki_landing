import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { demoReducer, initialDemo, parseDemoState } from "../src/lib/papers";
import { installCommand } from "../src/lib/site";
import en from "../src/messages/en.json";
import zh from "../src/messages/zh.json";
import ja from "../src/messages/ja.json";

const copies = { en, zh, ja };
const paths = { en: "/", zh: "/zh", ja: "/ja" };

// Product design.md explicitly requires white on its existing orange controls.
// Preserve that known product contrast exception, without suppressing other
// contrast findings or other accessibility rules.
function unexpectedViolations(violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"]) {
  return violations.flatMap(violation => {
    if (violation.id !== "color-contrast") return [violation];
    const nodes = violation.nodes.filter(node => !/class="[^"]*\bp-(primary|avatar)\b[^"]*"/.test(node.html));
    return nodes.length ? [{ ...violation, nodes }] : [];
  });
}

test("saving is idempotent, preserves other interests, and rejects invalid transfers", () => {
  const feedSave = demoReducer(initialDemo, { type: "save", paper: "rag", stay: true });
  expect(feedSave.stage).toBe("feed");
  expect(feedSave.saved).toEqual(["rag"]);
  const saved = demoReducer(initialDemo, { type: "save" });
  expect(demoReducer(saved, { type: "save" }).saved).toEqual(["attention"]);
  const other = demoReducer(saved, { type: "interest", interest: "climate" });
  expect(other.stage).toBe("feed");
  expect(other.paper).toBe("graphcast");
  expect(other.saved).toEqual(["attention"]);
  expect(parseDemoState(JSON.stringify({ ...other, paper: "attention" }))).toBeUndefined();
  expect(parseDemoState("not JSON")).toBeUndefined();
  expect(demoReducer(other, { type: "reset" })).toEqual(initialDemo);
});

test("product sidebar, feed feedback, wiki editing, graph filters, and Sparky", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  expect(await page.locator(".p-sidebar").evaluate(el => el.clientWidth)).toBe(239);
  await page.locator(".featured-paper").getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.locator(".featured-paper").getByRole("button", { name: "Saved", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-nav="feed"]')).toHaveAttribute("aria-current", "page");
  await page.locator(".featured-paper").getByRole("button", { name: "More like this", exact: true }).click();
  await expect(page.locator(".featured-paper").getByRole("button", { name: "More like this", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Close sidebar", exact: true }).click();
  expect(await page.locator(".p-sidebar").evaluate(el => el.clientWidth)).toBe(59);
  await page.getByRole("button", { name: "Open sidebar", exact: true }).click();
  await page.locator('[data-nav="wiki"]').click();
  await page.locator(".p-editor-tabs").getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByLabel("Edit wiki Markdown", { exact: true }).fill("# Research note\n\nA question I want to follow.");
  await page.locator(".p-wiki-main").getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.locator(".p-markdown")).toContainText("A question I want to follow.");
  await page.locator('[data-nav="graph"]').click();
  await page.locator('[data-nav="wiki"]').click();
  await expect(page.locator(".p-markdown")).toContainText("A question I want to follow.");
  await page.locator('[data-nav="graph"]').click();
  const allNodes = await page.locator(".p-graph-node").count();
  await page.getByRole("button", { name: "Concept", exact: true }).click();
  expect(await page.locator(".p-graph-node").count()).toBeLessThan(allNodes);
  await page.getByRole("button", { name: "Open Sparky quick chat", exact: true }).click();
  await page.getByLabel("Ask Sparky…", { exact: true }).fill("How do these papers connect?");
  await page.getByRole("button", { name: "Send question", exact: true }).click();
  await expect(page.locator(".p-chat-answer")).toContainText(en.Topics.aiNote);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open Sparky quick chat", exact: true })).toBeFocused();
});

for (const locale of ["en", "zh", "ja"] as const) {
  const copy = copies[locale];
  test(`${locale}: complete all three discovery paths`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(paths[locale]);
    for (const interest of ["ai", "climate", "mind"] as const) {
      await page.getByRole("button", { name: copy.Demo[interest], exact: true }).click();
      await page.locator(".featured-paper h4 button").click();
      await expect(page.locator(".p-paper-page")).toBeVisible();
      await page.getByRole("button", { name: copy.Product.addKnowledge, exact: true }).click();
      await expect(page.locator(".saved-label")).toHaveText(copy.Product.saved);
      await page.getByRole("button", { name: copy.Demo.toGraph, exact: true }).click();
      await page.locator(".p-graph-canvas").getByRole("button", { name: copy.Topics[`${interest}Concept2`], exact: true }).click();
      await expect(page.locator(".p-graph-inspector h4")).toHaveText(copy.Topics[`${interest}Concept2`]);
      await page.locator(".p-inspector-actions").getByRole("button", { name: copy.Demo.toIdea, exact: true }).click();
      await page.getByRole("button", { name: copy.Product.quickSpark, exact: true }).click();
      await page.locator(".p-spark-result").getByRole("button", { name: copy.Product.save, exact: true }).click();
      await expect(page.locator(".p-spark-result").getByRole("button", { name: copy.Product.saved, exact: true })).toBeDisabled();
    }
    await page.getByRole("button", { name: copy.Demo.reset, exact: true }).click();
    await expect(page.locator('[data-nav="feed"]')).toHaveAttribute("aria-current", "page");
    await expect(page.locator(".saved-count")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`${locale} ${colorScheme}: responsive layout and accessibility`, async ({ page }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(paths[locale]);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator("html")).toHaveAttribute("data-theme", colorScheme);
        const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, width: innerWidth }));
        expect(dimensions.scroll, `${locale}/${colorScheme}/${width} page overflow`).toBeLessThanOrEqual(dimensions.width);
        const cta = await page.locator(".hero-actions").boundingBox();
        expect(cta!.y + cta!.height).toBeLessThan(900);
        if (width === 390 || width === 1440) {
          const result = await new AxeBuilder({ page }).options({rules:{"label-content-name-mismatch":{enabled:true}}}).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
          expect(unexpectedViolations(result.violations)).toEqual([]);
          await page.screenshot({ path: `qa/${locale}-${colorScheme}-${width}.png`, fullPage: true });
          if(width===390) await page.locator('.workflow-section').screenshot({path:`qa/workflow-${locale}-${colorScheme}-390.png`});
        }
      }
      await page.locator('[data-nav="graph"]').click();
      await expect(page.locator(".p-navigation")).toBeVisible();
      const graphAudit = await new AxeBuilder({ page }).include("#product-showcase").options({rules:{"label-content-name-mismatch":{enabled:true}}}).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(unexpectedViolations(graphAudit.violations)).toEqual([]);
    });
  }
}

test("language switch keeps selected topic, wiki save, idea, and theme", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByLabel("Appearance", { exact: true }).click();
  await page.getByRole("button", { name: "Climate & energy", exact: true }).click();
  await page.locator(".featured-paper h4 button").click();
  await page.getByRole("button", { name: en.Product.addKnowledge, exact: true }).click();
  await page.locator('[data-nav="idea"]').click();
  await page.getByRole("button", { name: en.Product.quickSpark, exact: true }).click();
  await page.locator(".p-spark-result").getByRole("button", { name: en.Product.save, exact: true }).click();
  await page.getByLabel("Language: EN", { exact: true }).click();
  await expect(page).toHaveURL(/\/zh$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: zh.Demo.climate, exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: zh.Product.quickSpark, exact: true }).click();
  await expect(page.locator(".p-spark-result").getByRole("button", { name: zh.Product.saved, exact: true })).toBeDisabled();
  await expect(page.locator(".saved-count")).toHaveText("1");
});

test("mobile menu, preview keyboard tabs, paper disclosure, and copy feedback", async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  await expect(page.getByLabel("Language: EN", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  const productMenu = page.getByRole("button", { name: en.Product.openMenu, exact: true });
  await productMenu.click();
  await expect(page.locator(".p-navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(productMenu).toBeFocused();
  await expect(page.locator(".p-navigation")).not.toBeVisible();
  await productMenu.click();
  await page.locator('[data-nav="wiki"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".p-wiki-layout")).toBeVisible();
  await productMenu.click();
  await page.locator('[data-nav="feed"]').click();
  await expect(page.locator(".supporting-paper")).toBeAttached();
  await page.locator(".featured-paper summary").click();
  await expect(page.locator(".featured-paper details")).toHaveAttribute("open", "");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: en.Site.copy, exact: true }).click();
  await expect(page.getByRole("button", { name: en.Site.copied, exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(installCommand);
});

test("signup, installation, and FAQ remain usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1366, height: 660 } });
  const page = await context.newPage();
  for (const locale of ["en", "zh", "ja"] as const) {
    await page.goto(`http://127.0.0.1:4174${paths[locale]}`);
    const cta = page.locator('.hero-actions a[href="https://beta.scispark.ai/signup"]');
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box!.y + box!.height).toBeLessThan(660);
    await page.locator('a[href="#install"]').first().click();
    await expect(page.locator("pre code")).toHaveText(installCommand);
    await page.locator(".faq details summary").first().click();
    await expect(page.locator(".faq details").first()).toHaveAttribute("open", "");
  }
  await context.close();
});

test("clipboard failure keeps selectable commands and explains the failure", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("blocked")) }, configurable: true }); });
  await page.getByRole("button", { name: en.Site.copy, exact: true }).click();
  await expect(page.getByText(en.Site.copyError, { exact: true })).toBeVisible();
  await expect(page.locator("pre code")).toHaveText(installCommand);
});

test("static conversion paths, source links, metadata, and locale key parity", async ({ page, request }) => {
  for (const namespace of ["Site", "Demo", "Topics", "Papers", "Product", "Experience"] as const) {
    expect(Object.keys(zh[namespace]).sort()).toEqual(Object.keys(en[namespace]).sort());
    expect(Object.keys(ja[namespace]).sort()).toEqual(Object.keys(en[namespace]).sort());
  }
  for (const locale of ["en", "zh", "ja"] as const) {
    await page.goto(paths[locale]);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).href).toBe(`https://landing.scispark.ai${paths[locale]}`);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4);
    const signupLinks = page.locator('a[href="https://beta.scispark.ai/signup"]');
    expect(await signupLinks.count()).toBeGreaterThanOrEqual(3);
    for (const text of await signupLinks.allTextContents()) expect(text.trim()).toBe(copies[locale].Site.try);
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
    const res = await request.get(`/og/${locale}.png`);
    expect(res.ok()).toBeTruthy();
    expect(res.headers()["content-type"]).toContain("image/png");
  }
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/nonexistent")).status()).toBe(404);
});

for (const locale of ['en','zh','ja'] as const) {
  const copy=copies[locale];
  test(`${locale}: all added product pages, project notes, chat modes and undo`, async ({page}) => {
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(paths[locale]);
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    await page.locator('[data-nav="chat"]').click();
    for(const mode of ['chat','search','review'] as const){
      await page.locator('.p-chat-modes').getByRole('button',{name:copy.Experience[mode],exact:true}).click();
      await page.locator('[data-tour="chat-example"]').click();
      await page.locator('[data-tour="chat-send"]').click();
      await expect(page.locator('.p-assistant-message')).toContainText(copy.Experience.prepared);
      await expect(page.locator('.p-chat-sources button')).toHaveCount(2);
    }
    await page.getByRole('button',{name:copy.Experience.saveReport,exact:true}).click();
    await expect(page.locator('.p-markdown')).toContainText(copy.Experience.reportBody);
    await page.locator('[data-nav="trending"]').click();
    await page.locator('.p-field-filters').getByRole('button',{name:copy.Demo.climate,exact:true}).click();
    await expect(page.locator('.p-trend-row')).toHaveCount(1);
    await page.locator('.p-trend-row').click();
    await page.locator('.p-trend-detail .p-link').first().click();
    await expect(page.locator('.p-paper-title')).toContainText(copy.Papers.graphcastTitle);
    await page.locator('[data-nav="projects"]').click();
    await page.getByRole('button',{name:copy.Experience.newProject,exact:true}).click();
    await page.getByLabel(copy.Experience.projectTitle,{exact:true}).fill('Methods to compare');
    await page.getByRole('button',{name:copy.Experience.create,exact:true}).click();
    await page.locator('.p-detail-tabs').getByRole('button',{name:copy.Experience.notes,exact:true}).click();
    await page.getByLabel(copy.Experience.projectNote,{exact:true}).fill('Compare evaluation conditions.');
    await page.locator('.p-project-detail').getByRole('button',{name:copy.Product.save,exact:true}).click();
    await page.locator('[data-nav="history"]').click();
    await expect(page.locator('.p-history-list > button')).toHaveCount(3);
    await page.locator('.p-detail-tabs').getByRole('button',{name:copy.Experience.changes,exact:true}).click();
    const latest=page.locator('.p-changes-list > article').first();
    await latest.getByRole('button',{name:copy.Experience.undo,exact:true}).click();
    await expect(latest).toContainText(copy.Experience.undone);
    await page.locator('[data-nav="projects"]').click();
    await page.locator('.p-project-card').filter({hasText:'Methods to compare'}).click();
    await page.locator('.p-detail-tabs').getByRole('button',{name:copy.Experience.notes,exact:true}).click();
    await expect(page.getByLabel(copy.Experience.projectNote,{exact:true})).toHaveValue('');
    expect(errors).toEqual([]);
  });
}

test('fixed glass header, centered labels, all framework links and responsive window', async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:1440,height:1000});await page.goto('/');
  for(const selector of ['.nav-cta','.hero-actions .button-primary']) {
    const button=await page.locator(selector).boundingBox();const label=await page.locator(`${selector} .button-label`).boundingBox();
    expect(Math.abs(button!.x+button!.width/2-label!.x-label!.width/2)).toBeLessThan(1);
    expect(Math.abs(button!.y+button!.height/2-label!.y-label!.height/2)).toBeLessThan(1);
  }
  await page.locator('.workflow-section').scrollIntoViewIfNeeded();
  expect((await page.locator('.site-header').boundingBox())!.y).toBe(0);
  expect(await page.locator('.site-header').evaluate(el=>getComputedStyle(el).backdropFilter)).toContain('blur');
  await expect(page.locator('.workflow-node')).toHaveCount(9);
  await expect(page.locator('.product-capture')).toHaveCount(0);
  await page.locator('.workflow-node').filter({hasText:en.Experience.d}).getByRole('link').click();
  await expect(page.locator('.p-chat-modes').getByRole('button',{name:en.Experience.review,exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.p-navigation a')).toHaveCount(0);
  await expect(page.locator('.mac-titlebar')).toBeVisible();
});

test('guided cursor completes the connected research journey', async ({page})=>{
  test.setTimeout(90000);
  await page.setViewportSize({width:1440,height:1050});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
  await page.locator('.mac-window').scrollIntoViewIfNeeded();
  await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-mode','playing');
  await expect(page.locator('.tour-cursor')).toBeVisible({timeout:6000});
  await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-mode','finished',{timeout:65000});
  await expect(page.locator('.p-spark-result [data-tour="save-idea"]')).toBeDisabled();
  await expect(page.locator('.saved-count')).toHaveText('1');
});

test('manual interaction cancels the tour, preserves progress and requires explicit resume', async ({page})=>{
  await page.setViewportSize({width:1440,height:1050});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
  await page.locator('.mac-window').scrollIntoViewIfNeeded();
  await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-mode','playing');
  await page.locator('[data-nav="projects"]').click();
  await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-mode','manual');
  await expect(page.locator('.tour-cursor')).toHaveCount(0);
  await page.locator('.site-footer').scrollIntoViewIfNeeded();await page.locator('.mac-window').scrollIntoViewIfNeeded();
  await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-mode','manual');
  await expect(page.locator('.p-projects-page')).toBeVisible();
  await page.getByRole('button',{name:en.Experience.resume,exact:true}).click();
  await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-mode','playing');
  await page.getByRole('button',{name:en.Experience.pause,exact:true}).click();
  await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-mode','paused');
});

for (const colorScheme of ['light','dark'] as const) {
  test(`mobile ${colorScheme}: every product page fits and remains accessible`, async ({page})=>{
    await page.emulateMedia({colorScheme,reducedMotion:'reduce'});
    await page.setViewportSize({width:390,height:844});
    for(const locale of ['en','zh','ja'] as const){
      const copy=copies[locale];await page.goto(paths[locale]);
      for(const stage of ['feed','chat','trending','wiki','graph','projects','idea','history']){
        await page.getByRole('button',{name:copy.Product.openMenu,exact:true}).click();
        await page.locator(`[data-nav="${stage}"]`).click();
        const dimensions=await page.locator('.p-screen').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));
        expect(dimensions.scroll,`${locale}/${colorScheme}/${stage} panel overflow`).toBeLessThanOrEqual(dimensions.width);
        if(locale==='en'){
          const audit=await new AxeBuilder({page}).include('#product-showcase').options({rules:{'label-content-name-mismatch':{enabled:true}}}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
          expect(unexpectedViolations(audit.violations)).toEqual([]);
        }
      }
    }
  });
}

test('mobile and reduced motion keep autoplay off and support explicit tour chapters', async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.goto('/');
  await page.locator('.mac-window').scrollIntoViewIfNeeded();
  await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-mode','idle');
  await page.getByRole('button',{name:`3. ${en.Experience.tourAsk}`,exact:true}).click();
  await expect(page.locator('.p-chat-workspace')).toBeVisible({timeout:6000});
  await expect(page.locator('.tour-cursor')).toHaveCount(0);
  await page.getByRole('button',{name:en.Experience.pause,exact:true}).click();
  await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-mode','paused');
});

test('scroll fits the whole demo proportionally and the workflow in one desktop viewport', async ({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const [width,height] of [[1440,900],[1512,754],[1920,1080]]) {
    await page.setViewportSize({width,height}); await page.goto('/');
    await page.evaluate(()=>document.fonts.ready);
    const before=(await page.locator('.mac-window').boundingBox())!;
    await page.locator('.demo-stage').evaluate(el=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-155,behavior:'instant'}));
    await expect.poll(async()=>(await page.locator('.mac-window').boundingBox())!.width).toBeLessThan(before.width-20);
    const after=(await page.locator('.mac-window').boundingBox())!;
    expect(after.width/after.height).toBeCloseTo(before.width/before.height,2);
    expect(after.y).toBeGreaterThan(72);expect(after.y+after.height).toBeLessThan(height-30);
    expect(after.width).toBeLessThanOrEqual(1121);
    await page.getByRole('button',{name:en.Experience.pause,exact:true}).click();
    await page.locator('[data-nav="projects"]').click();
    await expect(page.locator('.p-project-grid')).toBeVisible();
    await page.screenshot({path:`qa/refined-demo-${width}.png`});
    await page.locator('.workflow-section').evaluate(el=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-80,behavior:'instant'}));
    const workflow=(await page.locator('.workflow-section').boundingBox())!;
    expect(workflow.height,`${width}x${height} workflow fit`).toBeLessThan(height-73);
    await expect(page.locator('.workflow-map')).toHaveAttribute('data-animated','true');
    await expect(page.locator('.workflow-lines animateMotion')).toHaveCount(2);
    await page.screenshot({path:`qa/refined-workflow-${width}.png`});
  }
});

test('README headlines, white CTA labels, consistent feature rows and cursor explanations',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});await page.goto('/');
  await expect(page.locator('h1')).toHaveText('From the paper you discover to the question you ask next.');
  expect(await page.locator('.hero-actions .button-primary').evaluate(el=>getComputedStyle(el).color)).toBe('rgb(255, 255, 255)');
  await expect(page.locator('.hero-actions .button svg')).toHaveCount(2);
  await expect(page.locator('.benefits-grid > article > .benefit-icon')).toHaveCount(3);
  const boxes=await page.locator('.benefits-grid > article').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,h:r.height};}));
  expect(boxes.every(box=>Math.abs(box.y-boxes[0].y)<1&&Math.abs(box.h-boxes[0].h)<1)).toBeTruthy();
  await page.locator('.mac-window').scrollIntoViewIfNeeded();
  await expect(page.locator('.tour-cursor-caption')).toBeVisible({timeout:6000});
  await expect(page.locator('.tour-cursor-caption')).toHaveText(en.Experience.cursor0);
  const cursor=(await page.locator('.tour-cursor-caption').boundingBox())!;const frame=(await page.locator('.mac-window').boundingBox())!;
  expect(cursor.x).toBeGreaterThan(frame.x);expect(cursor.x+cursor.width).toBeLessThan(frame.x+frame.width);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('.workflow-section').scrollIntoViewIfNeeded();
  await expect(page.locator('.workflow-map')).toHaveAttribute('data-animated','false');
  await expect(page.locator('.flow-traveler')).toHaveCount(0);
});
