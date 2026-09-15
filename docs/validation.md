# Local implementation validation

Verified 2026-09-15 against `npm run build` followed by `npm run start`, using
installed Google Chrome. This records local results, not a public deployment.

September 15 publication check: all 32 browser scenarios pass together in 1.6
minutes, including the local-only workflow interactions and complete guided tour
(52.7 seconds). Lint and the production build pass. White resting hero dots and
connections, with orange cursor highlights, were visually checked in the refreshed
preview. All 398 message keys match across the three locale dictionaries.

The current build includes stronger hero connections, scroll entrances, product
tab transitions, and local thinking/streaming playback in chat, digests, quick
chat, and Idea Spark. It retains the approved headline, centered Sparky CTAs,
the app's exact orange, and product wording in all three languages. Each feed now
contains six distinct papers from 2024–2025, with localized titles/summaries and
regenerated CJK subsets. The six foundational wiki/graph sources remain intact.

Lint, TypeScript, and the production build pass. All 32 browser tests pass in one
run (1.6 minutes), including every new paper's reader/source/digest, feed coverage
of the complete window, refresh, and a saved recent paper transferred to Chinese.
The full automatic tour passed in 53.1 seconds. The refreshed desktop feed was
visually inspected. Performance has not been remeasured for this revision.

Workflow interaction follow-up: all nine blocks keep the page's scroll position,
URL, and demo page unchanged while showing local explanations. The eight relevant
browser checks pass (28.2 seconds), including responsive/accessibility and diagram
animation checks; lint and the production build pass. The local preview was refreshed
and a workflow click was visually verified.

## Completed checks

| Check | Result |
| --- | --- |
| ESLint | Pass |
| TypeScript | Pass |
| Next.js production build | Pass; `/`, `/zh`, `/ja`, robots, sitemap |
| Playwright suite | All 32 scenarios pass in one run |
| Recent feed | Six cards per interest fill and extend beyond the window; publication window is 2024–2025; all 18 readers, source URLs and digests match their cards; refresh reorders cards; a saved recent paper survives locale transfer |
| Discovery journeys | All three topics through Feed, Reader, Wiki, Graph, and Idea Spark in all three languages |
| Responsive layout | No page overflow at 320, 390, 768, 1024, and 1440 CSS pixels, each locale and theme: 30 combinations |
| Automated accessibility | No unexpected violations in 34 axe WCAG 2A/2AA/2.1A/2.1AA audits, including explicit label-content matching: 18 Feed/Graph audits across locales/themes plus all eight pages at phone width in English, both themes; product contrast exception documented below |
| Interaction | 240/60px sidebar collapse, save stays on Feed, feedback toggle, wiki edits survive navigation, graph selection/type filters, saved idea, quick chat and Escape, reset, locale state transfer, theme persistence, mobile menus and focus return, keyboard navigation, paper disclosure |
| Added product pages | Sparky Chat/Search/Review with citations and report save, Trending filters and paper opening, Projects creation and notes, History conversation reopening and guarded note undo in all three languages |
| Phone product pages | All eight sidebar pages fit at 390px in every locale/theme: 48 page/locale/theme combinations |
| Guided cursor | Completes Feed → Reader → Sparky → Wiki → Graph → Idea Spark; manual input cancels until explicit resume, offscreen pause preserves state, mobile/reduced-motion playback remains explicit |
| Marketing revision | Fixed header remains at top while scrolling; production backdrop blur is present; all five CTA icons sit left of labels, with the complete icon-and-label group centered within 1px; nine framework nodes show explanations in place without navigating or changing the demo |
| Viewport refinement | Larger desktop demo keeps its 16:10 ratio; Explore lands with the complete window and adjacent playback/reset bar visible at 1440×900, 1512×754, and 1920×1080 in all three locales; workflow also fits; scaled Projects navigation remains usable |
| Copy and callouts | User-approved hero and README feature headings; matching icon/headline/body/action rows; white CTA labels; localized cursor explanation stays within the demo |
| Workflow motion | Visible motion-enabled diagrams animate two desktop paths; reduced motion removes the traveling dots |
| New motion behavior | Sections enter on scroll; tabs animate on navigation; EN/ZH/JA responses progress through thinking, partial text, and completion; sources/save actions wait; navigation cancels playback; History opens immediately; offscreen playback pauses; reduced motion skips streaming |
| Installation copy | Actual clipboard success plus denied-clipboard feedback and selectable fallback |
| No JavaScript | Visible signup on a 1366×660 viewport; install anchor/commands and native FAQ work in all locales |
| Metadata and links | Canonical host, locale alternates, localized OG images, consistent signup CTA, robots/sitemap, unknown route 404; no empty `#` links |
| Runtime | No page errors during all nine discovery journeys |
| Visual inspection | Compared actual product public Feed/Wiki/Graph/Spark captures with the rebuilt preview; inspected desktop in both themes and localized phone captures. Supplied artwork and social cards were also inspected during the initial build. |

Layout tests emulate reduced motion to measure stable geometry. Separate tests
exercise the full automatic cursor tour and manual takeover. On fine-pointer
desktop devices the tour starts when the window is visible; mobile and reduced
motion require explicit playback. Hero particles stop offscreen, in a hidden
document, and for reduced motion; scroll transitions fall back to static layouts.
Automated audits check rendered text contrast in the covered states.

The source product's `design.md` explicitly requires white text/icons on its
orange primary actions and avatar. The user also requested that marketing CTAs
match the app's `#F97316` fill while keeping white labels. This shared pair has
approximately 2.8:1 contrast. Tests allow only this exact white/orange
`color-contrast` finding on product primary actions/avatars and marketing
primary buttons/labels; other findings remain failures. This is not a claim of
full WCAG AA compliance. See
[product UI fidelity](product-ui-fidelity.md) for source provenance and the
prepared-data boundary.

Marketing signup buttons alias the product accent token. The CTA check compares
all four fills with the rendered product action and its verified `#F97316` value.

## Earlier local mobile performance — before viewport/copy refinement

September 13 at 08:27 UTC, Lighthouse 13.4.1, preceding production localhost build,
default simulated mobile throttling, one final English audit with the browser
suite stopped. This predates the proportional scaling, compact workflow, and
README copy refinement. It is a historical lab measurement, not current hosted
field performance; this refinement did not receive another Lighthouse audit.

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| English `/` | 98 | 96 | 100 | 100 | 1.1s | 2.5s | 20ms | 0 |

The accessible-name check passes after including the visible chapter numbers
and language abbreviation in their spoken labels. Accessibility retains the
source product's documented white-on-orange contrast exception. The final JSON
is `qa/lighthouse-mobile-approved-final.json`. Chinese/Japanese have current
browser coverage but no new performance measurements.

## Historical mobile performance — before the demo rebuild

September 12, Lighthouse 13.4.1, production localhost, default simulated mobile
throttling, single audit per listed route. These predate the September 13 product
UI correction and do not measure the current build. They are retained as a font
optimization baseline, not current performance or accessibility results.

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| English `/` | 95 | 100 | 100 | 100 | 1.1s | 2.9s | 20ms | 0 |
| Japanese `/ja` | 89 | 100 | 100 | 100 | 1.1s | 3.8s | 20ms | 0 |

The initial English audit measured 82 performance and 4.9s LCP. Converting full
font files to local WOFF2 subsets and removing an unused weight reduced the
observed font transfer from approximately 440 KiB to 76 KiB. No typeface change
was made. Locale-specific CJK font preloads reduced Japanese first paint from
2.1s to 1.1s. Both simulated LCP measurements remain above the design target of
2.5s; Japanese font loading needs further profiling before release. Recheck on
the hosted preview using its actual compression and network protocol. Chinese
received browser/accessibility coverage but no separate Lighthouse audit.

## Remaining release checks

- A physical phone/touch browser and Safari have not been tested. Emulation does
  not establish real-device acceptance. Actual 200% browser zoom remains unchecked.
- Inspect hosting configuration, deploy a preview, verify all locales and links
  there, and then perform the intended `landing.scispark.ai` replacement.
- Add social URLs only when supplied. The current footer intentionally omits them.
- The demo error boundary has a localized screenshot/retry fallback, but a
  deliberate React render failure has not been injected into the production build.
- Hosted signup/vault behavior and AI allowance consumption were not tested. The
  allowance is the user's explicitly approved launch assumption.

Reproduce the browser suite with `npm run build && npm test`. Local screenshots
and Lighthouse JSON are in ignored `qa/`; test traces/reports are also ignored.
The user subsequently requested source publication to the configured GitHub
repository. Source publication does not deploy or replace the public landing.
