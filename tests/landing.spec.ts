import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { demoReducer, feedPapers, initialDemo, papers, parseDemoState } from "../src/lib/papers";
import { installCommand } from "../src/lib/site";
import en from "../src/messages/en.json";
import zh from "../src/messages/zh.json";
import ja from "../src/messages/ja.json";

const copies = { en, zh, ja };
const paths = { en: "/", zh: "/zh", ja: "/ja" };

// The product and user-approved marketing CTAs share white on #F97316.
// Allow only that exact known contrast pair on those controls; other contrast
// findings and all other accessibility rules remain failures.
function unexpectedViolations(violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"]) {
  return violations.flatMap(violation => {
    if (violation.id !== "color-contrast") return [violation];
    const nodes = violation.nodes.filter(node => {
      const brandControl = /class="[^"]*\b(?:p-(?:primary|avatar)|button-primary|button-label)\b[^"]*"/.test(node.html);
      const brandPair = node.any.some(check => check.id === "color-contrast"
        && check.data?.fgColor === "#ffffff" && check.data?.bgColor === "#f97316");
      return !(brandControl && brandPair);
    });
    return nodes.length ? [{ ...violation, nodes }] : [];
  });
}

test("saving is idempotent, preserves other interests, and rejects invalid transfers", () => {
  const feedSave = demoReducer(initialDemo, { type: "save", paper: "rag", stay: true });
  expect(feedSave.stage).toBe("feed");
  expect(feedSave.saved).toEqual(["rag"]);
  const saved = demoReducer(initialDemo, { type: "save" });
  expect(demoReducer(saved, { type: "save" }).saved).toEqual(["qwen3"]);
  const other = demoReducer(saved, { type: "interest", interest: "climate" });
  expect(other.stage).toBe("feed");
  expect(other.paper).toBe("regionalweather");
  expect(other.saved).toEqual(["qwen3"]);
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
  await expect(page.locator(".supporting-paper")).toHaveCount(5);
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
      await expect(page.locator('.p-assistant-message')).toContainText(mode==='review'?copy.Experience.reportBody:copy.Topics.aiNote);
      await expect(page.locator('.p-assistant-message > .p-chip')).toHaveCount(0);
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

test('fixed glass header, centered CTA content, local framework interactions and responsive window', async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const locale of ['en','zh','ja'] as const) for(const width of [1440,390]) {
    await page.setViewportSize({width,height:1000});await page.goto(paths[locale]);
    await page.evaluate(()=>document.fonts.ready);
    for(const selector of ['.nav-cta','.hero-actions .button-primary','.hero-actions .button-secondary','.hosted-setup .button','.closing .button']) {
      if(!await page.locator(selector).isVisible()) continue;
      const button=(await page.locator(selector).boundingBox())!;
      const label=(await page.locator(`${selector} .button-label`).boundingBox())!;
      const icon=(await page.locator(`${selector} > :is(svg,.spark-icon)`).boundingBox())!;
      expect(icon.x+icon.width).toBeLessThan(label.x);
      // Center the complete icon-and-label group, with equal visible padding.
      const leftPadding=icon.x-button.x;
      const rightPadding=button.x+button.width-label.x-label.width;
      expect(Math.abs(leftPadding-rightPadding)).toBeLessThan(1);
      expect(Math.abs(button.y+button.height/2-label.y-label.height/2)).toBeLessThan(1);
      expect(Math.abs(button.y+button.height/2-icon.y-icon.height/2)).toBeLessThan(1);
    }
  }
  await page.setViewportSize({width:1440,height:1000});await page.goto('/');
  await page.locator('.workflow-section').scrollIntoViewIfNeeded();
  expect((await page.locator('.site-header').boundingBox())!.y).toBe(0);
  expect(await page.locator('.site-header').evaluate(el=>getComputedStyle(el).backdropFilter)).toContain('blur');
  await expect(page.locator('.workflow-node')).toHaveCount(9);
  await expect(page.locator('.product-capture')).toHaveCount(0);
  const workflowUrl = page.url();
  const workflowScroll = await page.evaluate(() => window.scrollY);
  const demoPage = await page.locator('.p-screen-content').getAttribute('data-page');
  await expect(page.locator('.workflow-node a')).toHaveCount(0);
  for (const node of await page.locator('.workflow-node button').all()) {
    await node.click();
    await expect(node).toHaveAttribute('aria-expanded', 'true');
    expect(page.url()).toBe(workflowUrl);
    expect(Math.abs(await page.evaluate(() => window.scrollY) - workflowScroll)).toBeLessThan(2);
    await expect(page.locator('.p-screen-content')).toHaveAttribute('data-page', demoPage!);
  }
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

test('scroll fits the larger demo and its controls together, preserving proportions', async ({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const [width,height] of [[1440,900],[1512,754],[1920,1080]]) for(const locale of ['en','zh','ja'] as const) {
    await page.setViewportSize({width,height}); await page.goto(paths[locale]);
    await page.evaluate(()=>document.fonts.ready);
    const before=(await page.locator('.mac-window').boundingBox())!;
    // The Explore link should land with both the product and playback controls
    // visible, without requiring a second scroll to find the actions.
    await page.locator('.nav-links a[href="#product-showcase"]').click();
    await expect.poll(async()=>(await page.locator('.demo-stage').boundingBox())!.y).toBeLessThan(98);
    await expect.poll(async()=>(await page.locator('.mac-window').boundingBox())!.width).toBeLessThan(before.width-20);
    const after=(await page.locator('.mac-window').boundingBox())!;
    expect(after.width/after.height).toBeCloseTo(before.width/before.height,2);
    expect(after.y).toBeGreaterThan(72);expect(after.y+after.height).toBeLessThan(height-30);
    expect(after.width).toBeLessThanOrEqual(1281);
    if (locale==='en') expect(after.width).toBeGreaterThan(width===1512?880:width===1440?1100:1200);
    const controls=(await page.locator('.tour-controls').boundingBox())!;
    expect(controls.y-(after.y+after.height)).toBeLessThanOrEqual(9);
    expect(controls.y+controls.height).toBeLessThan(height-12);
    await page.getByRole('button',{name:copies[locale].Experience.pause,exact:true}).click();
    await page.locator('[data-nav="projects"]').click();
    await expect(page.locator('.p-project-grid')).toBeVisible();
    await page.screenshot({path:`qa/refined-demo-${locale}-${width}.png`});
    await page.locator('.workflow-section').evaluate(el=>window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-80,behavior:'instant'}));
    const workflow=(await page.locator('.workflow-section').boundingBox())!;
    expect(workflow.height,`${width}x${height} workflow fit`).toBeLessThan(height-73);
    await expect(page.locator('.workflow-map')).toHaveAttribute('data-animated','true');
    await expect(page.locator('.workflow-lines animateMotion')).toHaveCount(2);
    await page.screenshot({path:`qa/refined-workflow-${locale}-${width}.png`});
  }
});

test('approved headlines, white CTA labels, consistent feature rows and cursor explanations',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});await page.goto('/');
  await expect(page.locator('h1')).toHaveText('From the study you discover to the question you investigate next.');
  expect(await page.locator('.hero-actions .button-primary').evaluate(el=>getComputedStyle(el).color)).toBe('rgb(255, 255, 255)');
  const productOrange = await page.locator('.p-button.p-primary').first().evaluate(el=>getComputedStyle(el).backgroundColor);
  expect(productOrange).toBe('rgb(249, 115, 22)');
  for (const cta of await page.locator('.button-primary').all()) {
    expect(await cta.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe(productOrange);
  }
  await expect(page.locator('.hero-actions .button > :is(svg,.spark-icon)')).toHaveCount(2);
  await expect(page.locator('.button-primary .spark-icon')).toHaveCount(4);
  expect(await page.locator('.hero-actions .spark-icon').evaluate(el=>getComputedStyle(el).maskImage)).toContain('/brand/spark.svg');
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

for (const locale of ['en', 'zh', 'ja'] as const) {
  test(`${locale}: AI playback thinks, streams, finishes, and cancels on navigation`, async ({page}) => {
    const copy = copies[locale];
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.setViewportSize({width:1440,height:1000}); await page.goto(paths[locale]);
    await page.locator('[data-nav="chat"]').click();
    await page.locator('[data-tour="chat-example"]').click();
    await page.locator('[data-tour="chat-send"]').click();
    const reply = page.locator('.p-assistant-message .p-response');
    await expect(reply).toHaveAttribute('data-response-state','thinking');
    await expect(reply).toContainText(copy.Experience.understanding);
    await expect(page.locator('.p-chat-sources')).toHaveCount(0);
    await expect(reply).toHaveAttribute('data-response-state','streaming');
    const partial = await reply.locator('.p-response-content > p').innerText();
    expect(partial.length).toBeLessThan(copy.Topics.aiNote.length);
    await expect(reply).toHaveAttribute('data-response-state','complete');
    await expect(reply).toContainText(copy.Topics.aiNote);
    await expect(page.locator('.p-chat-sources button')).toHaveCount(2);
    await page.locator('[data-nav="idea"]').click();
    await page.locator('[data-tour="quick-spark"]').click();
    await expect(page.locator('.p-spark-result .p-response')).toHaveAttribute('data-response-state','thinking');
    await expect(page.locator('[data-tour="save-idea"]')).toHaveCount(0);
    await page.locator('[data-nav="projects"]').click();
    await expect(page.locator('.p-response')).toHaveCount(0);
    await page.waitForTimeout(3300);
    await expect(page.locator('.p-projects-page')).toBeVisible();
    await expect(page.locator('.p-response')).toHaveCount(0);
    await page.locator('[data-nav="history"]').click();
    await page.locator('.p-history-list > button').first().click();
    await expect(reply).toHaveAttribute('data-response-state','complete');
  });
}

test('scroll entrances, tab transitions, offscreen playback and reduced-motion fallback', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1440,height:900}); await page.goto('/');
  const heading = page.locator('.workflow-heading');
  await expect(heading).toHaveAttribute('data-reveal-state','pending');
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveAttribute('data-reveal-state','entered');
  expect(await heading.evaluate(el=>getComputedStyle(el).animationName)).toBe('section-arrive');
  // Scrolling back above the section re-arms it for a fresh downward entrance.
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
  await expect(heading).toHaveAttribute('data-reveal-state','pending');
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveAttribute('data-reveal-state','entered');
  await expect(heading).toHaveCSS('opacity','1');
  await page.locator('[data-nav="chat"]').click();
  expect(await page.locator('.p-screen-content').evaluate(el=>getComputedStyle(el).animationName)).toBe('product-page-arrive');
  await page.locator('[data-tour="chat-example"]').click();
  await page.locator('[data-tour="chat-send"]').click();
  const response = page.locator('.p-assistant-message .p-response');
  await expect(response).toHaveAttribute('data-response-state','streaming');
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const paused = await response.innerText();
  await page.waitForTimeout(600);
  expect(await response.innerText()).toBe(paused);
  await response.scrollIntoViewIfNeeded();
  await expect(response).toHaveAttribute('data-response-state','complete');
  await page.emulateMedia({reducedMotion:'reduce'});
  expect(await page.locator('.p-screen-content').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  await expect(page.locator('[data-reveal-state="pending"]')).toHaveCount(0);
  await page.locator('[data-nav="idea"]').click();
  await page.locator('[data-tour="quick-spark"]').click();
  await expect(page.locator('.p-spark-result .p-response')).toHaveAttribute('data-response-state','complete',{timeout:1000});
});

test('recent feed fills the window and every card opens its own source', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const interest of ['ai', 'climate', 'mind'] as const) {
    await page.getByRole('button', { name: en.Demo[interest], exact: true }).click();
    await expect(page.locator('.p-feed-card')).toHaveCount(6);
    await expect(page.locator('.p-window')).toHaveText('Publication window: 2024–2025.');
    const fillsWindow = await page.locator('.p-screen').evaluate(el => {
      const grid = el.querySelector('.p-feed-grid')!.getBoundingClientRect();
      return grid.bottom > el.getBoundingClientRect().bottom && el.scrollHeight > el.clientHeight;
    });
    expect(fillsWindow).toBe(true);
    for (const id of feedPapers[interest]) {
      const title = en.Papers[`${id}Title`];
      await page.locator('.p-feed-grid').getByRole('button', { name: title, exact: true }).click();
      await expect(page.locator('.p-paper-title')).toHaveText(title);
      await expect(page.locator('.p-paper-meta a')).toHaveAttribute('href', papers[id].url);
      await expect(page.locator('.p-abstract p')).toHaveText(en.Papers[`${id}Summary`]);
      await page.getByRole('button', { name: en.Product.digest, exact: true }).click();
      await expect(page.locator('.p-digest [data-response-state]')).toHaveAttribute('data-response-state', 'complete');
      await expect(page.locator('.p-digest')).toContainText(en.Papers[`${id}Summary`]);
      await page.getByRole('button', { name: en.Demo.back, exact: true }).click();
    }
    const originalFirst = await page.locator('.featured-paper h4').innerText();
    await page.getByRole('button', { name: en.Product.refresh, exact: true }).click();
    await expect(page.locator('.p-feed-card')).toHaveCount(6);
    await expect(page.locator('.featured-paper h4')).not.toHaveText(originalFirst);
  }
  await page.locator('.featured-paper h4 button').click();
  await page.locator('.p-action-row').getByRole('button', { name: en.Product.save, exact: true }).click();
  await page.getByLabel('Language: EN', { exact: true }).click();
  await expect(page).toHaveURL(/\/zh$/);
  await expect(page.locator('.p-paper-title')).toHaveText(zh.Papers.generativepeopleTitle);
  await expect(page.locator('.p-action-row').getByRole('button', { name: zh.Product.saved, exact: true })).toHaveAttribute('aria-pressed', 'true');
});
