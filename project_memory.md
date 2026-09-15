# Verified Facts

Updated 2026-09-15 from local source, user decisions, and production-build checks.

- This is the implemented SciSpark marketing landing, separate from the product
  runtime. Product source is `/Users/tongshan/Documents/SciSpark_paper_manager`;
  the earlier landing is `/Users/tongshan/Documents/scispark-landing`. Both were
  read-only references throughout this task.
- Git is initialized on `main`, with origin
  `https://github.com/SciSpark-ai/scispark_wiki_landing.git`. The remote had no
  branches or tags before the user-requested initial publication on September 13.
- Stack: Next.js 16.3, React 19.3, TypeScript 6, Tailwind CSS 4, next-intl 4, and
  Phosphor icons on the landing and product-matching Lucide icons in the demo.
  Exact installed versions are pinned by `package-lock.json`.
- Routes are statically generated: English `/`, Simplified Chinese `/zh`,
  Japanese `/ja`. Themes initialize from the system with a light/dark toggle;
  a language button cycles English, Chinese, and Japanese.
- The preview is prepared local state, with 24 public papers and three research
  topics (18 recent feed papers and six foundational wiki/graph sources). It makes no model calls and does not persist real research data.
  Theme preference uses local storage; explicit locale navigation transfers demo
  progress once through session storage. Normal reload starts a fresh preview.
- The actual SciSpark wordmark, Sparky, symbol, and favicon exports are copied
  from the supplied `assets/brand/` kit. The benefits screenshot was replaced
  by a responsive diagram of the README's complete product framework.
  Provenance is in `docs/brand-assets.md` and
  `docs/demo-sources.md`. No private vault or environment secrets were read.
- Fonts are local: Halant/Geist WOFF2 subsets and Noto CJK text subsets, with OFL
  licenses. Normal build/runtime makes no requests to Google Fonts. Regenerate
  CJK subsets after translation changes; scripts are documented in README.
- Product README installation: Node.js 20.9+, npm, clone
  `https://github.com/SciSpark-ai/scispark_wiki.git`, `npm install`, `npm run dev`.
  AI features accept an API provider or signed-in Codex / Claude Code CLI.
- Beta public routes were inspected during planning: root redirects to login,
  signup is `/signup`, and login is `/login`. No account was created or
  authenticated feature tested. Public signup described connecting an AI provider.

# Current Release/Session State

- September 15 scroll refinement: clearer 900ms fade/rise entrances, staggered
  features/setup/FAQ, and a footer entrance. Sections re-arm only when fully
  below the viewport, supporting repeat downward visits. Preserve static
  reduced-motion/no-JavaScript paths, keyboard access, and the faint hero network.
  Lint/build and six relevant browser tests pass. Scroll entrances and re-arming
  were verified in the refreshed local preview.

- September 15: the user approved committing and pushing the accumulated landing
  refinements to `origin/main`. Use Git history and remote refs for publication
  status; deployment and domain replacement remain separate. All 32 browser
  scenarios pass together (1.6 minutes); lint and the production build pass.

- September 15: hero dots and connections rest in white in both themes. Hover
  retains the app's orange; the existing drift and cursor response remain.
  After trying gray, higher opacity, thicker strokes, and a shadow, the user
  explicitly chose to return to this original faint white version. Keep it faint.

- Workflow blocks now show their local hints/connections without scrolling to or
  changing the demo. Diagram animation remains. Build, lint, and eight relevant
  browser checks pass; the refreshed preview was visually verified.

- Feed refinement: six recent 2024–2025 papers per interest fill the demo and
  continue below the fold. All cards open the reader and support saving; reader
  digests follow the selected paper. Recent records also survive locale transfer.
  Build, lint, and types pass; all 32 browser tests pass in one run. Regenerated
  both CJK font subsets and visually checked the refreshed desktop feed.

- User reversed the sparse-constellation cleanup. Restore the preceding denser
  connected-dot pattern with its stronger visibility and cursor highlights.
  Follow-up: make autonomous drift more visible with independently phased motion
  of 16px horizontally and 12px vertically, retaining the pattern and cursor response.
- Current motion refinement: increase hero connection visibility; add section
  entrances and product tab transitions; use local thinking/streaming playback
  for Sparky, digests, quick chat, and Idea Spark. The tour waits for responses.
  Preserve manual takeover, immediate History/gallery reopening, reduced motion,
  and offscreen/hidden pause. Build, lint, and types pass; 31 browser scenarios
  are verified across the main run and corrective follow-up. Hero was inspected
  in both themes; the automatic tour completes with streamed responses.
  Exact verification is recorded in `docs/validation.md`.
- User requested removing "Prepared example" labels inside the demo. Feed and
  activity labels now use normal product wording; reply/digest/idea results omit
  fixture notices. The interactive-preview description remains outside the app.
  Build, lint, and all 27 browser tests pass with the regenerated CJK font subsets.
- Latest refinement: put marketing CTA icons on the left and center each icon-and-label
  group together, using equal side padding without an empty spacer. Enlarge the settled desktop preview (up to 1280px), and fit its complete
  window plus a compact playback/reset bar together below the fixed header.
  The interactive-preview description now precedes the topic selector. Explore and
  feature links land at the window. All 27 browser tests, lint, types, and the
  production build pass; desktop fit is verified across three sizes and locales.
  These follow-up changes are included in the September 15 source-publication scope.
- User requested committing and pushing the completed landing to the configured
  GitHub repository. Source publication is separate from deployment and domain
  replacement; use Git history and remote refs for the publication status.
- Current refinement: proportionally shrink the desktop demo on scroll, add cursor
  explanations, Sparky/terminal CTA icons and white labels, fit and animate the
  README workflow, align three features horizontally, and use README headlines.
  Implemented and verified. All 27 browser tests pass. Demo and full workflow fit
  at 1440×900, 1512×754, and 1920×1080, with proportional scaling and working
  navigation. Mobile uses its native layout. Earlier Lighthouse scores are historical.
- Approved September 13 revision is implemented: fixed glass header, toggle
  controls, centered CTA labels and new hover effects, macOS demo frame,
  interruptible automatic cursor tour, responsive README framework, and
  cursor-responsive hero plus scroll-linked transitions.
- Every sidebar page now works inside the prepared preview: Home, Sparky,
  Trending, Wiki, Graph, Projects, Idea Spark, and History. The real product UI
  governs the embedded shell and screens. Source HEAD was `4e122b3`; public
  screenshots from `908fa7c` supplied visual references. See
  `docs/product-ui-fidelity.md` for the source map and fixture adaptations.
  Implementation and local checks are complete. Preview:
  `http://127.0.0.1:4174`; run `npm run start` after `npm run build`.
- `design.md` is the canonical design contract. The earlier interview and study
  remain in `design-plan.md` and `design-wireframe.html`; they do not represent
  the final implemented component details.
- Source checks pass: lint, TypeScript, and production build. The production
  Chrome suite passes all 27 tests: all three interest journeys in all three
  languages, both themes at five widths, 34 axe audits, all eight pages at phone
  width in all locales/themes, the complete automatic tour, manual takeover,
  mobile/reduced-motion playback, chat modes, project notes, History undo,
  copy feedback, locale state transfer, metadata, and no-JavaScript entry paths.
  Axe checks preserve the product's explicitly required white-on-orange contrast
  exception; all other covered violations fail. Exact coverage is in
  `docs/validation.md`.
- Earlier September 13 English mobile Lighthouse, before the viewport/copy refinement: performance 98, accessibility 96
  (only the documented product contrast exception), best practices/SEO 100,
  FCP 1.1s, LCP 2.5s, TBT 20ms, CLS 0. This is one local simulated audit.
  September 12 measurements remain historical; profile hosted locales before release.
- The public landing has not been replaced. Domain reassignment, hosted preview,
  and physical phone testing remain separate release work. No app accounts,
  cloud storage, or native mobile runtime are implemented in this marketing repo.

## Confirmed product and design decisions

- Replace `https://landing.scispark.ai/`. Keep `scispark.ai` and the hosted
  product at `beta.scispark.ai` separate.
- Primary action: **Try SciSpark**, direct to
  `https://beta.scispark.ai/signup`. User selected immediate access at launch,
  not invitation or waitlist framing. Local install and GitHub are secondary.
- English headline was revised by the user to **From the study you discover to the question you investigate next.** The AI companion and unified workspace support it. Personalized paper discovery is a major
  feature and leads both the message and interactive demonstration.
- The user's hosted direction includes an online vault and a future native
  mobile app. The mobile app remains explicitly planned in public copy.
- Included starter AI allowance AND optional own API key are the agreed launch
  offer. The user explicitly said to assume the allowance is ready when this
  landing launches. Do not re-ask this decision or invent quotas or prices.
- Compact sequence: hero, interactive preview, complete README framework, three benefits, hosted/local
  setup, FAQ, closing/footer links. Three features use consistent horizontal
  icon/headline/body/action columns on desktop and stack on phones.
- Guided journey: Feed → Reader → Sparky → Wiki → Graph → Idea Spark, with direct
  navigation, six chapter shortcuts, pause/resume/replay, and reset. Desktop
  autoplay starts when visible; hover pauses it, and manual input cancels it
  until explicit resume. Offscreen/hidden pauses preserve progress. Mobile uses
  explicit playback; reduced motion uses discrete actions without a moving cursor.
  Implemented topics: AI & computing, Climate & energy,
  Mind & behavior. Notes and questions are authored examples with source links.
- Preserve actual product navigation, card structure, controls, typography,
  semantic colors, and responsive shell inside the preview. Tour shortcuts and
  interest presets belong outside that frame. The marketing skill does not
  authorize redesigning product screens. All eight sidebar destinations work
  in the preview using prepared examples.
- Preserve warm cream, espresso, orange, Halant, Geist, rounded forms, actual
  wordmark, and subtle Sparky. Approved design dials are 4/6/4. Both themes and
  English, Simplified Chinese, and Japanese are included in the first build.
- Marketing CTAs and product actions share the app's `#F97316` orange and white
  labels, as explicitly requested. `--cta-accent` aliases `--accent` to prevent
  drift; the shared pair has the documented 2.80:1 text contrast exception.
- README slogan provenance is in `docs/readme-copy.md`; metadata and social cards
  follow the updated hero. CJK subsets include the headlines and cursor callouts.
- Discord, LinkedIn, and X URLs remain the only missing content inputs. Their
  links are omitted until populated in `src/lib/site.ts`; no placeholders ship.
- Visitor-facing GitHub points to the product repository, not the landing repo.
- Pattern references inspected during planning: opencode.ai and the Claude Code
  product page. Their structural ideas informed the preview and entry options;
  their branding and claims were not imported.

# Known Pitfalls

- Do not remove entrance-animation state on mouse focus: it can move a control
  between pointerdown and pointerup and swallow the click. Only reveal pending
  content early for keyboard focus. Quick-chat submission keeps focus in its
  input so Escape still closes the panel when Send is disabled during playback.
- Do not carry over the earlier clinical audience, patient outcomes, unsupported
  metrics, invented testimonials, old tabs, or waitlist copy.
- Do not substitute a generic marketing dashboard for the real product UI.
  Consult current product components and public captures when changing the demo.
- Keep the prefixed `-webkit-backdrop-filter` before the standard declaration:
  the CSS optimizer otherwise removed the standard blur from the production build.
- The mobile workflow needs its own SVG arrow marker; a marker in a hidden
  desktop SVG does not render on the mobile paths.
- For screenshot geometry tests, emulate reduced motion so scroll-linked scale
  does not cause a false sidebar-width failure. Test animated behavior separately.
- Resume the tour from the current chapter's beginning after manual navigation;
  saved notes and papers persist while chapter prerequisites are reconstructed.
- Keep the approved hosted launch offer distinct from what was verified in the
  local product. Do not invent free/unlimited AI, offline-only behavior,
  one-command installers, downloads, data-rights, or research-validation claims.
- Preserve source assets and the two reference repositories. Optional assets in
  the product can be gitignored; copy deliberately, never remove or stage them.
- Avoid full TTF downloads in the page. The first mobile audit exposed an unused
  font-weight preload and oversized font payloads; compact WOFF2 assets reduced
  the delay without changing typography.
- Do not equate emulated browser tests with physical mobile acceptance, local
  Lighthouse with field performance, or local build success with deployment.
- Validate short-heading wrapping, theme contrast, keyboard/focus behavior,
  translation parity, and page overflow when changing visible content.
- Keep `qa/`, dependencies, build output, environment files, and deployment
  metadata ignored. Planning artifacts belong outside `public/`.
