# SciSpark landing

The public landing page for [SciSpark](https://github.com/SciSpark-ai/scispark_wiki),
a research workspace for personalized paper discovery, connected knowledge, and
idea development. Built to replace **https://landing.scispark.ai/** and direct
visitors to [the hosted beta](https://beta.scispark.ai/signup).

## Run locally

Requires Node.js 20.9+ and npm.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:4174**. The site needs no environment variables or API keys.

```sh
npm run lint
npm run typecheck
npm run build
npm run start
npm test
```

The browser suite uses installed Google Chrome. Change `channel` in
`playwright.config.ts` if using a separately installed Playwright browser.
Tests start the production server when port 4174 is free. Run the build first.
Reports and screenshots are written to ignored `playwright-report/`,
`test-results/`, and `qa/` directories.

## What is included

- English at `/`, Simplified Chinese at `/zh`, and Japanese at `/ja`.
- System-aware light/dark themes, with a light/dark toggle and a compact language button.
- A working preview with three research topics, six recent feed papers per topic,
  and six foundational papers in the wiki/graph examples.
  Its grouped sidebar, feed cards, paper actions, wiki editor, graph inspector,
  Sparky Chat/Search/Review, Trending, Projects, History, and Spark composer/gallery
  follow the actual product's UI. Open a paper, save
  notes, explore connections, or try prepared Quick/Deep Spark results.
- A macOS window that shrinks proportionally into view on desktop scroll, with
  an automatic, interruptible guided cursor tour and nearby step explanations. Every
  sidebar page works inside the preview; visitors can explore manually anytime.
- A cursor-reactive hero, scroll-linked transitions, and the clickable README
  research framework with compact desktop/phone layouts and animated connections.
- Headlines from the product README, a consistent three-column feature row, and
  browser/terminal action icons with white text on orange signup buttons.
- Hosted signup, local installation commands, copy feedback, FAQ, and GitHub.
- Local fonts, original SciSpark artwork, localized social cards, canonical
  metadata, language alternates, sitemap, and robots rules.

The tour starts on a visible desktop preview, pauses on hover, and yields to
manual input. Resume restarts the current chapter with its prepared prerequisites.
Playback pauses offscreen. Phones require explicit Play; reduced motion omits
the animated cursor. Manual progress survives leaving and returning to the section.

The preview runs entirely in the browser. It makes no model calls and writes no
real research data. Theme preference uses local storage. Language changes transfer
preview progress through a short-lived session-storage entry, consumed on load.
Reset clears the demo's saved notes and questions. Reloading normally starts fresh.

## Editing

| Location | Purpose |
| --- | --- |
| `design.md` | Canonical brand and interaction specification |
| `src/components/landing.tsx` | Server-rendered page composition |
| `src/components/demo.tsx` | Product shell, navigation, tour controls, and quick chat |
| `src/components/product-preview/` | Product-derived screens for every sidebar page, paper reading, and guided tour |
| `src/app/product-preview.css` | Scoped product UI styling |
| `src/app/experience.css` | Glass header, macOS frame, workflow layouts, and motion |
| `src/components/product-preview/tour.tsx` | Interruptible cursor sequence and chapter controls |
| `src/components/hero-field.tsx`, `workflow.tsx` | Responsive constellation and README framework |
| `src/lib/preview-session.ts` | Bounded conversation, project, and change-history transfer |
| `src/lib/papers.ts` | Public paper records and preview state reducer |
| `src/lib/site.ts` | Beta, product GitHub, and optional social URLs |
| `src/messages/{en,zh,ja}.json` | All localized copy and prepared research notes |
| `src/app/globals.css` | Semantic light/dark tokens and responsive layout |
| `public/brand/` | Selected production brand assets |
| `public/fonts/` | Locally served CJK font subsets and licenses |

Discord, LinkedIn, and X are omitted until their URLs are filled in `site.ts`.
The visitor-facing GitHub link points to the product, not this marketing repository.
All eight sidebar entries open prepared screens inside the demo. See [product UI mapping](docs/product-ui-fidelity.md) for exact scope.
Keep the included AI allowance and optional API key as the agreed launch offer;
quota amounts and pricing have not been specified. The native mobile app is planned.

## Asset provenance

Selected wordmark, Sparky, symbol, and favicon assets were copied from the supplied
`SciSpark_paper_manager/assets/brand/` folder. The wordmark is the existing
transparent raster extraction, not a newly drawn logo. Sparky and symbol SVGs are
the supplied brand exports. The source brand folder remains unchanged.

The screenshot-based benefits visual has been replaced by the README product
framework. The public README feed capture remains only as a bundle-error fallback. The interactive preview uses real papers with independently
authored summaries and example research questions. Source links are attached to
the reading, wiki, and idea views. See [demo sources](docs/demo-sources.md).

Halant and Geist source files, compact WOFF2 webfonts, and OFL licenses are retained
in `src/assets/fonts/`. Only the used heading weight is preloaded.
Noto font subsets and their OFL licenses are in `public/fonts/`. When CJK copy
changes, regenerate the subsets so new characters are included:

```sh
# Asset maintenance only; Python fontTools and Brotli are required.
python3 scripts/prepare-latin-fonts.py
python3 scripts/fetch-cjk-fonts.py
node scripts/generate-social-cards.mjs
```

Font regeneration downloads public, text-subset fonts from Google Fonts and the
corresponding upstream licenses. Runtime and normal builds make no font requests
to Google. Social cards are generated locally from the same artwork and fonts.

## Deployment

This is a Next.js app, suitable for a Node.js host or the existing Vercel setup.
Use `npm ci`, `npm run build`, and the host's Next.js runtime. On a generic Node
host, run `npx next start -H 0.0.0.0 -p "$PORT"`; the local start script deliberately
binds to loopback for previewing.

The intended domain is **landing.scispark.ai**. Inspect the existing landing's
hosting configuration and attach a preview before changing the domain assignment.
The product at **beta.scispark.ai** and the main **scispark.ai** host are separate.
The old waitlist, authentication implementation, and placeholder legal links were
not imported. No analytics or new data collection is added.

The planning HTML and Markdown live outside `public/`, so they are not site routes.
This task builds and validates locally; it does not publish the replacement site.

See [validation results](docs/validation.md) for the tested build and release scope.

Implementation references: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
and [next-intl App Router integration](https://next-intl.dev/docs/getting-started/app-router).
