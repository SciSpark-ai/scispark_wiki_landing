# SciSpark landing design contract

Updated 2026-09-13. This is the canonical design specification for the replacement
of `https://landing.scispark.ai/`. The landing is now implemented and validated
locally; [validation results](docs/validation.md) distinguish completed checks
from remaining release checks. The public domain has not been changed.

The user-approved product direction governs this document. [design-plan.md](design-plan.md)
retains interview detail and implementation notes. [design-wireframe.html](design-wireframe.html)
is an earlier English composition study, not a production component reference.
Where their proposals differ, use this document for visual and interaction decisions.

**Product-fidelity correction, September 13:** The user rejected the first demo
because it invented a simplified interface. The demo must follow the actual
product's AppShell, Sidebar, Home/RealFeedCard, PaperActions, PageEditor/Backlinks,
VizWorkspace, and SparkPanel/IdeaGallery. Those source layouts govern the demo,
including the 240px/60px sidebar, 50px mobile bar, grouped navigation, 28px cards,
product type scale, Lucide icons, category bands, pill controls, and corner Sparky.
The landing's aesthetic guidance applies to the surrounding marketing page.
See [product UI mapping](docs/product-ui-fidelity.md) for sources and adaptations.

## Approved motion and demo expansion, September 13

The user approved the annotated revision and its follow-up references. This
revision supersedes the original limits on particles, automatic tours, hero
spacing, and screenshot-based benefits. It preserves the actual product UI.

- Fixed cream/espresso glass header; language cycle and light/dark toggle buttons.
- Optically centered CTA labels with equal icon space; soft highlight, elevation,
  directional arrow motion, and press feedback on marketing buttons.
- A sparse interactive hero constellation and a scroll-linked hero departure /
  macOS-window arrival. The frame settles before interacting with the product.
- A macOS title bar around the real product shell; all eight sidebar destinations
  remain in the prepared demo. The redundant external four-tab strip is removed.
- A guided cursor follows Feed, Reader, Sparky, Wiki, Graph, and Idea Spark.
  It starts on visible desktop previews, pauses on pointer entry, and yields to
  actual pointer/keyboard input. After manual use, only explicit Resume/Replay
  restarts it. Offscreen and hidden-document work pauses without resetting data.
  Mobile uses an explicit Play control; reduced motion uses discrete steps.
- The full README Product framework replaces the low-resolution feed capture.
  Preserve every node/relationship and its discovery/knowledge/support grouping.
  Use Research vault and recoverable History to cover hosted/local entry paths.
  Nodes open the matching prepared screen. Sources remain linked public papers.
- Inspirations: old landing cursor-demo source and https://antigravity.google/.
  Reuse the interaction ideas with SciSpark artwork, fonts, colors and copy.
- All controls and explanations are translated in English, Simplified Chinese,
  and Japanese. Native scrolling and static motion fallbacks remain usable.

## September 13 viewport and copy refinement

- The desktop demo starts broad and uniformly scales to fit the available viewport
  as its section approaches. Preserve its 16:10 ratio and the actual product UI;
  the layout wrapper follows its visible height. Keep mobile at readable native size.
- Add brief localized explanations beside the moving cursor, with edge-aware
  placement so callouts stay inside the window. Manual takeover remains unchanged.
- Use browser/terminal icons for hosted signup/local installation. Orange buttons
  use white text; the marketing orange is deepened for readable contrast.
- Fit the complete framework and heading into one desktop viewport. Animate subtle
  dots along the research paths only while visible and motion is permitted.
- Use the product README's English slogans verbatim, with Chinese/Japanese
  translations. All three features share one horizontal format and matching icons.

## Design read

A brand-preserving landing page for researchers across disciplines, with a warm,
modern visual language, SciSpark's Halant/Geist identity, and a working product
preview as its main visual.

The README headline is **From the paper you discover to the question you ask next.** Personalized paper
discovery is central: visitors should immediately see how relevant papers become
connected knowledge and new ideas. Sparky supports that journey as a subtle guide.
The primary action opens hosted signup; local installation is a secondary path.

| Design dial | Value | Application |
| --- | --- | --- |
| `DESIGN_VARIANCE` | `4` | A centered introduction, broad product preview, and varied section proportions retain the recognizable composition. |
| `MOTION_INTENSITY` | `6` | User-approved cursor tour, responsive hero constellation, scroll-linked composition, and button feedback. |
| `VISUAL_DENSITY` | `4` | Short marketing copy around a readable, useful slice of the research workspace. |

These override the taste skill's generic defaults because the user requested
continuity with the existing design and restrained use of Sparky. Modernization
comes from composition, spacing, type, and interaction clarity.

## Audit and preservation decisions

Mode: **redesign, preserve brand**. The user has authorized a new audience, new
content, and a compact page structure. This is separate from redesigning the app.

| Inspected baseline | Design decision |
| --- | --- |
| Both source projects use cream, espresso, orange, Halant, Geist, and rounded surfaces. | Preserve the identity and use semantic tokens throughout. |
| The product has real wordmark artwork, light/dark themes, and current Feed/Wiki/Graph/Idea Spark interfaces. | Reuse artwork and adapt current components; keep recognizable navigation and content hierarchy. |
| The old landing has a hero, mockup, problem statement, feature showcases, how-it-works, use cases, FAQ, signup, and footer. | Consolidate to the six agreed sections, with personalized discovery visible first. |
| Old copy and metadata target clinicians and patient outcomes; footer legal/contact links include `#` placeholders. | Rewrite for researchers. Resolve real destinations before exposing links. |
| Old mockup tabs include Home, Chat, Projects, Library, and History. | Use the current product workflow, not the old prototype's tab set. |
| The English study includes an allowance line below the hero buttons, alternate signup labels, static sidebar labels, and no production locale/theme controls. | Move offer details to setup, standardize signup copy, implement real preview interactions, and support all locales/themes. |
| The old source sets `metadataBase` to `https://scispark.ai`. | The replacement canonical host is `https://landing.scispark.ai`. |

The prior landing's inferred dial reading is approximately `3 / 5 / 5`: centered,
animated, and longer in content. These are qualitative design readings, not
measured performance results. The new page keeps its warmth with fewer competing
sections and lower motion. Search rankings, analytics outside source code, and
production hosting configuration have not been audited.

## Brand, typography, and assets

- Use the actual transparent SciSpark wordmark. The study copy is
  [design-assets/scispark-wordmark.png](design-assets/scispark-wordmark.png), from
  the product's `public/brand/scispark-wordmark-transparent.png`. It is a raster
  asset, not an original vector. Never recreate its lettering with a font.
- Use monochrome ink on light and the reversed artwork on dark. Preserve alpha
  and optical clear space. Do not use blend modes to conceal an opaque background.
  Omit the tagline in compact navigation; keep the wordmark legible on phones.
- The brand-sheet orange is `#E7803F`; the current product action orange is
  `#F97316`. Preserve supplied art as supplied and use the latter for landing
  actions. Do not recolor the product or generate a replacement brand mark.
- Halant is the Latin heading font and Geist is the body/control font. The serif
  is an explicit brand choice. Geist Mono is reserved for installation commands.
  Use local, licensed files through `next/font/local`; retain their licenses.
- Chinese and Japanese need locale-appropriate font coverage. The build should
  use licensed Noto Serif CJK heading and Noto Sans CJK body subsets if practical,
  with tested platform fallbacks. Those assets are not yet present. Never assume
  Halant or Geist supplies CJK glyphs; do not download whole multiweight CJK packs.
- Use one marketing icon family: `@phosphor-icons/react`, regular weight, normally
  20px. Verify/install the dependency before imports. Brand artwork is not an icon
  substitute. Graph edges and nodes are data visualization, not decorative icons.

| Type role | Desktop starting point | Phone starting point |
| --- | --- | --- |
| Hero | Halant 60px, 1.08 line height | 38px, 1.15 line height |
| Section heading | Halant 36px, 1.15 | 30px, 1.2 |
| Benefit heading | Halant 26px, 1.2 | 24px, 1.25 |
| Body | Geist 17px, 1.6 | 16px, 1.6 |
| Product demo | Product scale: page titles 28px, feed titles 19px, body 13-14px, metadata 11-13px | Follow the product's component hierarchy |
| Secondary metadata | Geist 13px, 1.45 | 13px, never essential instructions |

These are starting values, not fixed text boxes. Use natural wrapping and
`text-wrap: balance` for short headings. Keep the desktop hero within two lines.
Avoid an isolated word on a second line by improving copy or available width.
Use normal CJK spacing, appropriate line-breaking rules, and locale-specific
scale adjustments. Do not insert a forced English line break into every locale.

The main visual is a **real component preview** with prepared data and working
controls. Reference current public product captures in
`/Users/tongshan/Documents/SciSpark_paper_manager/docs/assets/readme/`, particularly
`feed-1080p.png`, `feed-1080p-dark.png`, `wiki.png`, `graph.png`, and `spark.png`.
Inspect any capture for sensitive content before copying it. Use genuine captures
for a static fallback or supporting crop, with an accurate caption and reserved
dimensions. Do not enlarge unreadable desktop screenshots on a phone.

This documentation task commissions no new imagery. The user-requested product
preview and existing brand assets supply the page's visual identity. If a later
composition needs an illustration, use image generation for that specific asset;
do not generate product evidence, scientific citations, logos, or fake screenshots.
Avoid unrelated stock photography and decorative images added only to fill space.

## Semantic color system

Use these variables once at the page root, mapped to Tailwind semantic utilities.
Components must not scatter raw color literals. The palette follows the current
product. Marketing CTAs use a deeper orange token so their requested white labels remain readable.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg-page` | `#FEFAF5` | `#161009` | Page background |
| `--bg-warm` | `#F6F0E9` | `#1E150C` | Secondary region and demo navigation |
| `--surface-card` | `#EFE7DD` | `#2B1E11` | Grouped product content |
| `--surface-light` | `#FAF6F2` | `#241A10` | Reading surface |
| `--text-primary` | `#2B180A` | `#F4EAD9` | Headings and important text |
| `--text-secondary` | `#3E2407` | `#E6D6C0` | Body text |
| `--text-muted` | `#716559` | `#A09080` | Secondary metadata |
| `--accent` | `#F97316` | `#F97316` | Product actions and decorative accents |
| `--cta-accent` | `#C4510C` | `#C4510C` | Marketing action fill |
| `--on-accent` | `#FFFFFF` | `#FFFFFF` | Marketing action text |
| `--accent-ink` | `#A64717` | `#FB923C` | Text links and focus ring |
| `--accent-ink-hover` | `#87380E` | `#FDBA74` | Hovered text link |
| `--border` | `#E8D3C0` | `#3C2C1B` | Decorative surface boundaries |

Computed WCAG contrast for these exact opaque color pairs: CTA text on orange
**4.64:1** in either mode; secondary body on page **13.84:1 light / 13.26:1 dark**;
muted text on card **4.62:1 / 5.24:1**; accent link on card **4.85:1 / 7.16:1**.
The source product retains its required white-on-bright-orange treatment
(**2.80:1**); marketing CTAs use the deeper orange above. Check hover, disabled, focus, transparency, and rendered combinations
separately during implementation. Avoid opacity reductions on muted text.

The decorative border is not sufficient to identify a control. Use a stronger
semantic ink boundary where the boundary conveys control state, a two-pixel focus
ring with offset, and labels/shape in addition to color for selection. Target
4.5:1 normal text and 3:1 large text and essential non-text UI contrast.

Support both themes from the first production build. Default to the system
preference, with an accessible Light/Dark/System selector and remembered choice.
Set the theme once at the root without a flash or hydration mismatch. All sections
use the same mode; warm surface variation does not imply section-level inversion.
The single marketing accent stays orange. Meaningful category colors inside the
product preview can follow the current product palette, paired with labels.

## Layout and component rules

- Maximum content width: 1200px. Hero copy can use up to 840px, with body prose
  constrained to approximately 60 characters per line where appropriate.
- Gutters: 20px on small phones, 24px from 640px, 40px on desktop. Spacing scale:
  4, 8, 12, 16, 24, 32, 48, 64, 80, 96px. Major section spacing is 64-80px on
  desktop and 40-48px on phones; use density intentionally inside the demo.
- Breakpoints: 640, 768, 1024, 1280, and 1536px. Use CSS Grid for composition and
  `min-width: 0` on shrinking children. Never hide page overflow to mask a defect.
- Shape scale: 8px badges, 12px buttons/inputs, 16px inner panels, 28px main
  workspace, full radius for interest choices. The same role has the same radius
  everywhere. Use a warm tinted shadow only for the main preview's elevation.
- Layers: base content 0, sticky navigation 10, dropdowns 20, modal overlay 30.
  Avoid arbitrary z-index values and overlay controls covering content.
- Buttons are at least 44px tall. Primary labels stay on one line. Secondary
  actions have an identifiable outline or text-link treatment. No detached
  floating signup button is needed on mobile.
- Menus, theme/language selectors, tabs, accordions, and graph controls must work
  with touch and keyboard. Hover is supplementary. Provide a skip link and
  visible focus; native elements or accessible primitives supply semantics.

## Page composition

```text
Wordmark     Explore     Get started     GitHub     Language / Theme     Try SciSpark

                    Knowledge that grows with your research.
                 Short description of discovery, knowledge, and Sparky.
                         [Try SciSpark] [Install locally]

Choose a research interest   [AI & computing] [Climate & energy] [Mind & behavior]
+----------------------------------------------------------------------------+
| Feed / Wiki / Graph / Idea Spark | Current product content with real actions |
|                                 | Open paper -> Read -> Add to demo wiki    |
+----------------------------------------------------------------------------+

Personalized discovery, featured wide     Connected knowledge
                                         Ideas grounded in reading

Start in your browser                    Install on your computer
Hosted signup and online vault           Copyable local setup
AI allowance and optional API key        README and runtime prerequisites

FAQ accordions
Try SciSpark                         GitHub, available community links, footer
```

The live preview is directly below the hero and supplies its visual continuation.
Do not add a separate giant hero illustration, fake browser chrome, or a logo wall.

| Section | Desktop composition and content | Below 768px |
| --- | --- | --- |
| Header and hero | Single-line 64-72px navigation; centered headline, one short paragraph, two actions. Top padding 48-64px, never over 96px. Hero text and actions fit the initial viewport at normal zoom. | Compact wordmark and menu; selectors accessible from the menu. Hero padding 32px; buttons stack if needed. Keep readable text at short viewport heights and allow natural page scroll. |
| Clickable demo | Actual grouped 240px sidebar with 60px collapse; Home feed cards, paper detail, wiki editor/backlinks, graph workspace, Spark composer/gallery. Interest selectors and tour shortcuts sit outside the app frame. | Actual 50px product bar and 240px drawer below 1024px. Workspace scrolls inside its frame; feed cards stack below 768px. Graph inspector moves below the canvas. |
| Three benefits | Three horizontal columns with matching icon, headline, body, and action rows. Use open spacing without enclosing cards. Each message links to its demo state. | Stack the same consistent feature format. |
| Hosted/local setup | Two distinct entry paths with hosted first and more visual emphasis. The local path uses a compact code block and README link. Offer details belong here. | Hosted block, then local block; code scrolls only inside its own area and the Copy button stays reachable. |
| FAQ | One concise stack of disclosures, up to five questions. Default closed; do not hide essential offer details here. | Full-width disclosure buttons, generous touch area, natural answer wrapping. |
| Community/footer | Short closing invitation with the same signup label; GitHub and supplied social links grouped cleanly. | Stack invitation and link groups. Never show disabled social icons or placeholder destinations. |

Use sentence-case section headings without decorative eyebrows, numbers, status
dots, or scroll cues. No repeated split-header explainers or long alternating
feature showcases. The page's useful variety comes from the preview, consistent
feature row, setup choices, and FAQ.

## Copy and destinations

README English headline: **From the paper you discover to the question you ask next.**

README hero description:

> A personal workspace to discover papers, build knowledge, and explore ideas.

Keep the hero to that headline, description, and action group. Put beta access,
online storage, AI allowance, and local setup explanations in the relevant section.
Use plain research language: discover, read, connect, explore. Avoid patient claims,
invented user counts, testimonials, performance percentages, or promises of
scientific validation. Do not use decorative em dashes, all-caps labels, or jargon
about the landing's implementation in visible product copy.

| Intent | English label | Destination |
| --- | --- | --- |
| Hosted signup, everywhere | Try SciSpark | `https://beta.scispark.ai/signup` |
| Returning user | Sign in | `https://beta.scispark.ai/login` |
| Local path | Install locally | Current locale's `#install` section |
| Source and community contribution | GitHub | `https://github.com/SciSpark-ai/scispark_wiki` |
| Complete local instructions | Setup guide | `https://github.com/SciSpark-ai/scispark_wiki#getting-started` |
| Hosting target | Landing page | `https://landing.scispark.ai/` |

The landing code repository is `https://github.com/SciSpark-ai/scispark_wiki_landing`;
the visitor-facing GitHub link points to the product repository. Use one label per
intent, including nav and closing CTA. Links navigate and buttons change local
state. Do not force external links into new tabs; if required, disclose it.

Hosted setup explains: create an account and enter the workspace, keep the vault
online, start with an included AI allowance, and optionally bring an API key.
This is the user's launch baseline. Do not invent quota amounts, pricing, unlimited
usage, sync between a local and hosted vault, or a currently available native
mobile app. The mobile app is planned and can be mentioned briefly in FAQ.

The local path names Node.js 20.9+, npm, and an API provider or signed-in Codex /
Claude Code CLI for AI, as described in the product README. Show these verified
commands and open `http://127.0.0.1:3000` afterward:

```bash
git clone https://github.com/SciSpark-ai/scispark_wiki.git
cd scispark_wiki
npm install
npm run dev
```

Explain that local installation keeps the Markdown vault on the user's computer
and may make external scholarly/model requests. Avoid implying all AI runs offline
or that local CLI support is part of the hosted offer. There is no verified
one-command installer or native app download to advertise.

FAQ topics: what SciSpark does; hosted versus local storage; AI allowance and own
API key; how personalized discovery works; mobile availability. Keep the answer
to personalization faithful to the product, without suggesting that the three
prepared demo topics are the full live personalization system.

## Demo behavior contract

Use a small, functional adaptation of the current UI with prepared public or
clearly labeled synthetic content. Label it **Interactive preview** and explain
once that its examples stay in the preview. No account, live model call, private
vault read, or backend write is required. Never fake a successful real signup.

Three interest presets update both the feed and its downstream knowledge path.
Working topic names are **AI & computing**, **Climate & energy**, and **Mind &
behavior**; these are design defaults, not user research results. Show one featured
paper and up to two supporting papers per interest. Every displayed real paper
must have verified title, authors, and source URL; synthetic papers must visibly
say they are examples and must not carry fabricated DOI links or quotations.

| State | Useful action | Visible result |
| --- | --- | --- |
| Feed | Select interest; inspect relevance; save or open a paper | Prepared category-banded cards change with interest; save stays on Home; title opens the paper. |
| Reader | Read a labeled summary; Generate digest; Add to knowledge base | Show a prepared digest or open the connected wiki note with source context. |
| Sparky | Ask in Chat, Search, or Review mode | Display cited prepared responses, paper results, or a report that can be saved into the wiki. |
| Trending | Choose a field; expand an activity row | Show illustrative topic activity and related public papers. |
| Wiki | Edit/Preview; Save; follow a backlink | Preserve edited Markdown during the visit and show the related source papers alongside it. |
| Graph | Filter node types; select a labeled concept | Highlight its network relationships and open the corresponding inspector. |
| Projects | Create a project; explore linked pages; edit notes | Retain the prepared project's notes and navigate to its research context. |
| Idea Spark | Enter a direction; Quick/Deep Spark; Save or Develop fully | Show a labeled prepared research question and its sources; open the saved idea in the wiki. |
| History | Reopen a conversation; inspect a saved change; undo | Restore prepared conversations or undo the latest applicable note change. |

Maintain local state for interest, active stage, selected paper/concept, and saved
example IDs per interest. Switching interest returns to Feed while retaining that
interest's progress for the visit. Direct tab switching always works with seeded
examples. Saving is idempotent; repeated clicks do not duplicate notes. Provide
Reset preview. No cross-visit persistence is necessary.

Locale and theme changes retain the current demo state during the visit. The
language switch must not silently reset progress. Preserve selected interest and
stage in a shared client boundary or another explicit state transfer mechanism.
Sparky has its real full-page Chat/Search/Review workspace as well as the actual
corner launcher and optional quick-chat panel. Both use prepared responses.
The automatic tour is optional and immediately yields to manual interaction.

Use accessible tab semantics and selected states; announce meaningful save/copy
results without reading the entire panel again. Preserve sensible focus when
panels change. The graph needs a keyboard-accessible equivalent, not just a canvas.
An empty saved state explains how to add an example; reset restores the seed.
Do not add fake latency or pretend network errors to this deterministic demo.
For genuine bundle/asset failures, show a real static preview and a working beta
link. Copy feedback reports success only after the clipboard write succeeds;
failure leaves selectable commands and an inline explanation.

## Localization, URLs, and migration

Launch English, Simplified Chinese, and Japanese together. Simplified Chinese is
the working default inherited from the old landing; the user has not separately
specified a Chinese region. Translate the whole page, demo, buttons, accessible
names, feedback, captions, setup explanations, metadata, and FAQ. Keep product
names and shell commands intact. Use native labels: **English / 简体中文 / 日本語**.

Working signup labels are **Try SciSpark / 试用 SciSpark / SciSpark を試す**.
Headlines are **From the paper you discover to the question you ask next. / 从你发现的论文，到你提出的下一个问题。 /
出会った論文から、次に問いかける疑問へ。** Native copy refinement and rendered review remain build
tasks. Apply the English word budget by meaning and visual length in CJK, not a
space-based word counter. Avoid letter spacing intended for Latin capitals.

Keep English at `/` to preserve the existing root entry; add `/zh` and `/ja` for
the requested languages. This replaces the earlier plan's unimplemented `/en`
proposal. Do not redirect existing visitors to a different host. Keep the language
choice explicit rather than forcing a region-based redirect. Each locale has its
own canonical URL, `lang`, localized metadata, and reciprocal `hreflang`, including
`x-default` for `/`. Preserve hash targets when changing language.

Retain existing anchor destinations where their meaning still maps:
`#product-showcase` to the preview, `#how-it-works` to setup, `#use-cases` to the
benefits, `#faq` to FAQ, and `#final-cta` to the closing signup action. New
`#install` targets the local setup block. Give anchor targets scroll clearance
below the sticky header. Nav labels are adapted to the user-approved structure.

Replace the old clinical title, description, and social cards. Use real brand and
product visuals for OG images with appropriate localized copy. Publish a sitemap
for the three locale URLs and production robots rules. The study's `noindex`
setting must not leak into the landing, and planning artifacts must not become
production routes. Inspect existing analytics, legal/consent content, redirects,
and hosting configuration before migration; preserve valid existing behavior.
Do not ship the old `#` legal links or invent policies.

Discord, LinkedIn, and X are optional until supplied. Store destinations centrally
and render only real, verified URLs. Missing social links do not block the build.

## Implementation foundation and motion

Implemented stack: Next.js App Router, React, TypeScript, Tailwind CSS 4, and
next-intl. Commands and exact dependency versions are recorded in `agents.md`
and `package-lock.json`. Marketing content and metadata are server rendered;
the demo and canvas are isolated client components.

Use CSS transforms/opacity for the approved scroll-linked effects, with native
scroll timelines where supported and a static fallback elsewhere. Particle
positions live outside React state; animation frames stop offscreen or while the
document is hidden. Reduced-motion and touch contexts receive a static hero.
The cursor tour is a cancellable sequence with explicit local state actions.
Keep page scrolling separate from the preview's internal scrolling.

Render core copy and conversion links without JavaScript. Reserve dimensions for
the preview and images to avoid layout shift. Load the initial Feed view promptly;
defer heavier optional visualization code. Keep responsive images local and
optimized; no blocking external font fetch. Keep signup and account handling on
the beta app. A new waitlist, auth backend, or vault service is outside this site.

## Acceptance before release

These are implementation checks, **not completed test results**.

- Inspect all three locales in both themes at 390px, 768px, 1024px, and 1440px;
  also check 320px overflow, short laptop height, and 200% browser zoom. Verify
  natural wrapping, one-line desktop navigation/buttons, and readable demo text.
- Complete all three interest paths through Feed, Reader, Wiki, Graph, and Idea
  Spark. Check direct tabs, repeated saves, Reset, graph keyboard access, copy
  success/failure, and state preservation across language/theme changes.
- Check keyboard order, menu dismissal, focus return, skip link, tab semantics,
  accessible names, reduced motion, image alternatives, and contrast in every
  action state. Test one real touch browser before calling mobile behavior done.
- Verify all beta, product GitHub, source-paper, setup, locale, anchor, and supplied
  social links. Test canonical/OG/hreflang output and non-JavaScript content.
- Run the chosen stack's lint, type, and production-build checks. Add focused
  interaction coverage for the demo's meaningful state transitions and locale
  behavior; avoid tests that merely mirror static markup.
- Run Lighthouse on a production build and inspect network/console failures.
  Target LCP below 2.5s, CLS below 0.1, and accessible interaction responsiveness;
  lab results do not establish real-user field performance. Report actual results.
- Review every visible string for unsupported claims, stale clinical language,
  inconsistent CTA labels, decorative labels, and missing translations. Inspect
  actual brand art and product imagery in both themes at their displayed sizes.
- Prepare a preview against the existing hosting setup before replacing
  `landing.scispark.ai`; keep `beta.scispark.ai` and `scispark.ai` separate. Record
  preview validation and deployment state independently.

## Sources and current status

Verified source inputs: the product's `README.md`, `design.md`,
`src/app/globals.css`, production brand artwork, and public README captures;
the old landing's page composition, metadata, navigation, and section anchors;
the user's decisions in [project_memory.md](project_memory.md); and the invoked
[design-taste-frontend skill](/Users/tongshan/.agents/skills/taste-skill/SKILL.md).

The beta public login/signup routes were inspected during planning without
creating an account. Hosted vault behavior was not tested. Immediate access and
the included AI allowance are the user's explicit landing-launch requirements,
even though the current public signup still describes bringing an API provider.

This workspace is connected to the requested landing Git repository on `main`.
The Next.js implementation includes all three locales, both themes, the complete
prepared demo, local font assets, social cards, and beta/local entry paths. Selected
brand assets were copied from the user-supplied `assets/brand/` kit without changing
the source repository. The earlier English study remains a historical reference.
Hosting migration and physical mobile-browser acceptance remain release work;
see [validation results](docs/validation.md) for the exact local coverage.
