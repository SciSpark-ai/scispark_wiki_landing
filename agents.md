# Project Overview

This workspace is for planning and building the new SciSpark landing page for
researchers across disciplines. The product is `scispark_wiki`; its source is at
`/Users/tongshan/Documents/SciSpark_paper_manager`. The earlier clinical landing
page at `/Users/tongshan/Documents/scispark-landing` is a visual reference.

## Tech Stack

- This workspace was empty when first inspected on 2026-09-12. Git is now
  initialized on `main`, with origin
  `https://github.com/SciSpark-ai/scispark_wiki_landing.git`.
- The landing is implemented with Next.js 16.3, React 19.3, TypeScript 6,
  Tailwind CSS 4, next-intl 4, Phosphor marketing icons, and Lucide product icons.
  It has no backend or API keys.
- Three statically generated locales share a client-side interactive preview.
  Playwright, axe, and Lighthouse provide browser and performance validation.
- Canonical `design.md` governs the implementation. `design-plan.md`,
  `design-wireframe.html`, and `design-assets/` retain the earlier planning study.
- The existing landing reference uses Next.js 16, React 19, TypeScript,
  Tailwind CSS 4, Framer Motion, next-intl, and Halant/Geist fonts.
- The product uses Next.js, React, TypeScript, Tailwind CSS, and a local
  filesystem Markdown vault. Its runtime is separate from this marketing site.
- Halant and Geist use licensed local WOFF2 subsets; Chinese and Japanese use
  local Noto subsets. Brand artwork comes from the supplied product assets kit.

## Essential Commands

- `npm ci` — install the locked dependencies; Node.js 20.9+ is required.
- `npm run dev` — development preview on `http://127.0.0.1:4174`.
- `npm run lint` and `npm run typecheck` — source checks.
- `npm run build` and `npm run start` — production build and local preview.
- `npm test` — Chrome browser suite; build first. Uses installed Google Chrome.
- Asset maintenance scripts and required Python libraries are in `README.md`.

## Engineering Conventions

- Read `project_memory.md` before continuing. Record confirmed decisions
  separately from proposals and unanswered questions.
- The grill-me planning interview is captured in `design-plan.md` and
  `project_memory.md`. The current design contract is `design.md`, produced with
  the requested design-taste-frontend skill. It governs visual decisions where
  the earlier plan or English study has different proposals.
- Follow the approved design when extending the landing. Treat the two reference projects
  as read-only inputs unless the user expands the scope.
- Preserve the SciSpark identity and use the actual brand artwork. Consult the
  product's `design.md` and the old landing's design references before UI work.
- Write concise copy for researchers across disciplines. Verify product claims,
  installation steps, feature names, and destinations against current sources.
- Use synthetic or already public demonstration content. Do not read a private
  research vault or copy environment secrets into the landing page.
- For implementation, verify desktop/mobile rendering, wrapping, keyboard
  interaction, reduced motion, and links. Do not publish placeholder links.
- Keep all three message dictionaries aligned and regenerate CJK subsets after
  changing translations. Use semantic theme tokens and accessible native controls.
- The September 13 approved motion revision in `design.md` supersedes earlier
  static-preview proposals. Preserve manual takeover of the guided tour, explicit
  mobile playback, reduced-motion behavior, and offscreen animation suspension.
- The demo must follow the real product UI. User rejected the first invented
  interface on September 13. Use `docs/product-ui-fidelity.md` and current product
  source; marketing design guidance must not redesign the embedded product.
- Keep signup at the beta app, user-facing GitHub links at the product repository,
  and the replacement domain at `landing.scispark.ai`. Social URLs stay omitted
  until supplied. Deployment status is separate from local validation.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
