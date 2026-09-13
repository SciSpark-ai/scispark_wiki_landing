# SciSpark landing page design plan

> The canonical visual and interaction contract is now [design.md](design.md).
> This file retains the interview and earlier proposals. Where they differ,
> follow `design.md`, including the signup label, hero content, theme coverage,
> benefit composition, and locale routes. The HTML study remains exploratory.

Status: core interview complete; proposed implementation details and layout
study ready for review. No production landing application has been built.

## Purpose and audience

Create a new landing page for SciSpark (`scispark_wiki`) aimed at researchers
across disciplines. The prior clinical landing page supplies visual references;
the current product supplies features, brand assets, and interface references.

Source repositories:

- Product: `/Users/tongshan/Documents/SciSpark_paper_manager`
- Prior landing: `/Users/tongshan/Documents/scispark-landing`
- Product GitHub: https://github.com/SciSpark-ai/scispark_wiki
- Deployed hosted beta: https://beta.scispark.ai/
- Replacement landing destination: https://landing.scispark.ai/

## Confirmed decisions

1. Hosted beta is the primary conversion path. At the planned landing launch,
   visitors create an account and immediately enter the hosted workspace.
   Invitation-only and waitlist framing do not fit this access model.
2. User confirms the hosted beta is deployed and identifies online vault storage
   as the hosted product direction. A mobile app is a future direction. The
   beta's public login/signup pages are verified; authenticated vault behavior
   has not been inspected. The supplied repository documents the local preview.
3. Installation and GitHub remain accessible secondary paths. Include Discord,
   LinkedIn, and X when their destinations are supplied.
4. Central promise: knowledge that grows with your research. The AI companion
   and unified workspace support that promise.
5. Personalized paper discovery is one of the most important features. Make it
   explicit in the hero and prominent in the interactive demonstration.
6. Use a small clickable demo with prepared example content: personalized Feed
   → open/read a paper → Wiki → Graph → Idea Spark. Allow direct tab switching.
7. Sparky is a subtle guide. Let the research interface lead, with Sparky inside
   the demo and in a few small expressive moments.
8. Keep the warm visual identity while modernizing presentation for a broad
   research audience: cream, espresso, orange, Halant/Geist, rounded surfaces,
   generous spacing, and crisp typography.
9. Demonstrate personalization with three selectable research-interest presets.
   Each has an instant prepared feed and a connected path through the wiki and
   ideas. Keep the interaction structure consistent across presets.
10. Launch in English, Chinese, and Japanese, including the demo, captions, and
    setup instructions. Provide a visible language switch. Simplified Chinese
    follows the previous landing's copy as a proposed default; the user has not
    separately specified a Chinese script or regional variant.
11. Confirmed launch offer: an included AI allowance plus an optional
    user-provided API key. The user says the allowance is coming in a near-term
    beta update and explicitly authorizes assuming it is available when the
    landing launches. Plan copy around both options. Exact allowance amounts
    and terms remain unspecified; do not invent a quota or unlimited usage.
12. Compact, demo-led page: hero → clickable demo → three concise benefits →
    hosted/local setup → FAQ → community links. Avoid a separate long feature
    showcase for every product tab.
13. Replace `landing.scispark.ai`. The user explicitly corrected the suggestion
    to replace `scispark.ai`; the main domain is outside this replacement scope.

## Visual direction and layout study

Local review artifact: [design-wireframe.html](design-wireframe.html). This is
an English layout study with desktop/phone inspection controls, not the finished
trilingual landing or the complete interactive demo. It tests composition and
hierarchy before production implementation.

The memorable interaction is changing a research interest and following its
papers into connected knowledge. The surrounding page stays quiet. Keep the
actual SciSpark wordmark, warm colors, and typography. Give the demo more space
than decorative illustrations. Use a centered hero, left-aligned research
content, and a broad workspace frame.

| Role | Proposed value | Rationale |
| --- | --- | --- |
| Page | `#FEFAF5` | Existing SciSpark cream |
| Warm region | `#F6F0E9` | Existing sidebar/secondary surface |
| Text | `#2B180A` | Existing espresso |
| Secondary text | `#716559` | Readable warm secondary copy; verify contrast |
| Accent | `#F97316` | Existing SciSpark orange |
| Border | `#E8D3C0` | Existing warm boundary color |

- Typography: licensed local Halant for Latin display/headings, Geist for body
  and controls, Geist Mono only for installation commands. Start around 68px
  desktop/40px phone for the hero; adjust after English/CJK rendered review.
- Proposed CJK treatment: locale-appropriate serif headings and sans-serif body
  with licensed local fonts or platform fallbacks. Final font assets remain an
  implementation selection; Halant does not provide full Chinese/Japanese text.
- Layout: outer width about 1200px, hero prose about 760px, 24px phone gutters,
  48–80px between major sections. Keep the preview near the hero rather than
  using the old large top spacer. Short copy wraps at phrase/sentence boundaries.
- Surfaces: 24–28px workspace/card corners, 12px controls; use warm fills with
  fine borders. Reserve shadow depth for the main workspace frame.
- Motion: respond to interest selection, tab changes, saving, and graph-node
  selection. No compulsory autoplay cursor, scroll hijacking, or delayed hero
  text. Prefer an optional user-started guided path. Respect reduced motion.
- Contrast: use readable text/action combinations. The source product's bright
  orange with small white text is a known contrast limitation; the landing can
  use dark orange-surface labels or an espresso CTA without recoloring the app.
- Scope of this visual refresh is the landing; product UI references remain
  faithful to the current real product rather than redesigning it.

Structural references: [OpenCode](https://opencode.ai/) places installation
choices directly next to its introductory message; adapt the copyable setup
pattern in SciSpark's secondary install section. [Claude Code](https://claude.com/product/claude-code)
uses a prominent product demonstration and explicit entry paths; adapt that
clarity to hosted signup and local installation. These references guide
structure; the existing SciSpark sources govern visual identity.

```text
Desktop
┌───────────────────────────────────────────────────────────────────┐
│ SciSpark       Explore   Get started   GitHub   Language   Try     │
│                                                                   │
│              Knowledge that grows with your research              │
│           Personalized discovery + connected understanding         │
│                  [Try SciSpark]  [Install locally]                 │
│                 Included AI usage; optional API key                │
│                                                                   │
│ Choose an interest:  [AI]  [Climate]  [Human behavior]               │
│ ┌───────────────────────────────────────────────────────────────┐ │
│ │ Navigation  │   Personalized Feed                             │ │
│ │ Feed        │   A paper       A paper       A paper            │ │
│ │ Wiki        │   Why this fits your interests / open            │ │
│ │ Graph       │                                                 │ │
│ │ Idea Spark  │   Sparky offers the next useful step             │ │
│ └───────────────────────────────────────────────────────────────┘ │
│            Discover → Read → Keep → Connect → Develop              │
│                                                                   │
│  Find relevant papers     Build knowledge       Develop ideas      │
│                                                                   │
│  Start in your browser              Install on your computer       │
│  Signup + online vault              Copyable verified commands    │
│                                                                   │
│  FAQ                                      Final CTA + community   │
└───────────────────────────────────────────────────────────────────┘

Phone: logo/language/menu → hero/CTA → interest selector → compact
demo tabs → one readable content view → next-step action → vertically
stacked benefits/setup/FAQ. Reflow the demo; do not shrink desktop UI.
```

## Live beta entry verification

- `https://beta.scispark.ai/` redirects to `/login?next=%2F`.
- The login page offers email/password sign-in and links to `/signup`.
- `https://beta.scispark.ai/signup` asks for email and a password of at least
  eight characters. It currently says: "You'll connect your own AI provider
  after signing in."
- No signup was submitted; post-signup access and allowance were not tested.
- Resolved timing: current signup describes BYOK; the user confirms an included
  allowance is planned shortly and should be assumed available for the landing
  launch. This is a user-authorized launch baseline, not a feature observed in
  the public signup inspection. No further availability clarification is needed.

## Proposed narrative and copy

These are working drafts, not approved final copy.

- Narrative: find papers matched to your interests, turn reading into connected
  knowledge, and develop your next idea with Sparky.
- Recommended headline, used in the layout study: "Knowledge that grows with
  your research." This directly expresses the selected central promise.
- Alternate headline retained for copy review: "Turn what you read into what
  you discover next."
- Subheadline candidate: "Discover papers matched to your interests, build
  connected knowledge from what you read, and explore your next idea with Sparky."
- Main CTA candidate: "Try SciSpark". Explain that signup opens the hosted beta.
  Proposed new-user destination: `https://beta.scispark.ai/signup`, with a
  separate Sign in link to `https://beta.scispark.ai/login` for existing users.
- Local path candidate: "Install locally". Use verified README setup steps;
  do not invent a one-command installer or desktop download.

## Confirmed page sequence and proposed details

The compact sequence is confirmed. Specific copy and visual details remain
proposals for the design review.

1. Header with actual SciSpark wordmark, short anchor navigation, GitHub, and the
   hosted CTA.
2. Hero with central promise, explicit personalized-discovery description,
   hosted CTA, and secondary local-install path.
3. Prominent clickable workspace preview beginning with personalized Feed.
   Let visitors follow one piece of research across the product.
4. Concise explanation of personalized discovery, connected knowledge, and
   developing ideas. Use product details and examples rather than generic claims.
5. Getting started: hosted account path plus an accessible local-install block.
6. Focused FAQ covering relevant access, storage, AI connection, and preview
   limitations after the hosted terms and capabilities are confirmed.
7. Closing hosted CTA and footer with repository/community links.

## Demo design proposal

- Reuse the current product's navigation language and visual hierarchy.
- Keep an obvious main action on each demonstrated screen and preserve state
  when following the paper into the wiki and its connections.
- Use prepared public or clearly illustrative content. The demo itself should
  not need accounts, uploads, private vault access, or live model requests.
- Keep the full hosted beta reachable from the demo.
- Demonstrate only implemented interactions; omit or clearly explain controls
  that are unavailable in the sample.
- Provide three selectable interest presets with prepared content; AI, climate,
  and human behavior are proposed examples, with final topics still open.
- Proposed preset topics: AI & computing, Climate & energy, Mind & behavior.
  Use illustrative content with an explicit example-workspace label. Do not
  attach fabricated DOIs, authors, results, or evidence claims to sample papers.
- Supporting features: show Sparky in the reading/asking path; mention Deep
  research and Projects in concise supporting copy/FAQ with links to the feature
  guide. The primary five-step demo stays focused. Optional visible navigation
  for extra pages must either open a prepared overview or be omitted, never be
  an unexplained dead control.

### Full interactive demo specification

| Stage | Visitor action | Visible result |
| --- | --- | --- |
| Personalized Feed | Select one of three interests; inspect Why this paper; open the featured paper | Matching prepared cards and relevance explanations; the selected paper opens in the reader |
| Read and ask | Select a prepared passage or question prompt | A prepared answer retains a link to the demonstrated passage; the researcher can choose Add to Wiki |
| Wiki | Add the paper, then open a linked concept | A visible saved state; a page connects the paper, a concept, notes, and the source reference |
| Graph | Select a paper or concept node | Its direct connections highlight; a readable inspector links back to the same wiki/source context |
| Idea Spark | Open a prepared idea | An idea seed with its motivating papers and a question to investigate; finish with the hosted CTA |

- Use prepared, deterministic data. The landing makes no AI requests, acquires
  no papers, and needs no user credentials to demonstrate the workflow.
- One featured paper per preset has the complete path. Other displayed paper
  cards open a useful prepared summary rather than leading to dead ends.
- State is explicit: selected interest, active stage, selected paper/concept,
  and per-preset saved state. Returning to an earlier stage preserves context.
- Changing interests opens that interest's Feed; retain per-preset progress for
  the current visit. Switching language preserves interest and demo position.
- Add to Wiki is idempotent; show success immediately and provide a Reset demo
  action. No implication that the sample was saved to the visitor's real vault.
- Stage navigation works independently: each stage has useful seeded content
  even before the visitor follows the guided path.
- Start without autoplay. A small Next step action guides visitors. Motion
  explains their actions; focus never moves without an intentional navigation.
- Phone: show one readable panel at a time with compact stage controls, a
  prominent featured paper, and a Show more papers action. Use a simplified
  graph plus a text list/inspector. Maintain 44px touch targets. The layout study
  currently shows just the featured card on phone to test the available space.

## Proposed implementation

- Build a fresh landing in the current workspace, borrowing verified visual
  tokens, production brand assets, and useful interaction patterns from the old
  landing. Keep both source repositories unchanged during implementation.
- Use Next.js App Router, TypeScript, Tailwind CSS, and next-intl, matching the
  previous landing's stack. Prefer statically rendered marketing content and a
  client-only demo island. Select supported compatible versions when scaffolding
  rather than inheriting the old dependency lockfile blindly.
- Use locale routes `/en`, `/zh`, `/ja`, with `/` redirecting to English. Include
  localized metadata, `lang`, canonical URLs, and alternate-language links.
  Switching language preserves the current section/demo state.
- Reuse local Halant/Geist with their licenses; select and license suitable CJK
  font coverage during build. CJK typography gets independent line-height and
  wrapping checks. Do not depend on runtime third-party font loading.
- Store copy, links, demo fixtures, and visual tokens centrally. Social links
  remain omitted when missing. A single beta URL configuration owns signup and
  sign-in links. No marketing backend, signup form, or waitlist DB is needed.
- Local installation shows the verified four-line clone/install/run sequence,
  with a working Copy button and a setup-guide link. Link directly to it from
  the hero. No invented `npx` installer, shell download, or local/hosted sync claim.
- Use CSS transitions initially; add a motion library only where the demo's
  interaction requires it. Use a small authored SVG graph with semantic HTML
  controls rather than importing the full application's graph/runtime stack.
- No analytics added by default. Select tracking separately if requested.

### Implementation sequence

1. Review this layout study and incorporate any visual/copy corrections.
2. Scaffold the chosen stack, local fonts/brand assets, locale routing, and
   marketing sections. Update `agents.md` with actual commands and versions.
3. Build the reusable demo stages and all three prepared interest paths; then
   complete English, Chinese, and Japanese copy and accessible labels.
4. Validate desktop/mobile layouts, navigation, demo state, translations, setup
   copying, and beta/repository links. Produce reviewable screenshots.
5. Prepare the replacement for `landing.scispark.ai` using the existing hosting
   project's verified configuration. Review a preview before changing the live
   domain; preserve the old deployment for rollback. No publication occurred as
   part of this planning task.

## Design review against the brief

- Central promise and personalized Feed both appear before scrolling into the
  demo. The first visible interaction is choosing a research interest.
- The one distinctive visual is the research workflow in the large preview.
  Keep secondary benefits as open columns rather than repeating a card grid.
- The cream/serif/orange choice follows the existing SciSpark brand and the
  user's explicit continuity request. It is not borrowed from the external
  agent-tool references.
- Hosted signup leads. Installation is visible in the hero and expanded later;
  the landing does not inherit the old clinical waitlist funnel.
- The standalone layout study tests English composition. It is not proof of
  the final three-language or full-workflow implementation.

## Build and launch decisions still open

- Final copy, layout, motion details, and responsive demo behavior.
- Localization implementation: CJK font coverage, translated metadata and
  accessible names, language-switch behavior, and responsive text layout.
- Detailed allowance terms only if quantitative copy is needed, post-signup
  setup, and hosted privacy facts that the landing needs to communicate. Public
  beta entry and email/password signup fields have been verified. Included AI
  plus optional BYOK is the confirmed launch baseline.
- Existing hosting project/repository mapping and final repository organization
  must be inspected during implementation. Destination is already confirmed as
  `landing.scispark.ai`; do not reopen that decision.
- Social destinations, which the user will supply later.

## Acceptance criteria for implementation

Planning-study verification: desktop rendering and the three interest presets
were inspected in the browser. The 390px phone layout was inspected and its
installation-block overflow fixed; page width and scrollWidth both measured
390px afterward. Short headings were refined after wrapping review. Full demo
interaction and Chinese/Japanese rendering remain implementation work.

- Desktop and mobile rendering preserves readable copy and meaningful demo
  interaction, without accidental one-word second lines or horizontal overflow.
- Validate rendered copy, demo labels, and controls in English, Chinese, and
  Japanese; do not assume Latin font metrics or literal translations fit CJK.
- Demo navigation works with keyboard and touch; focus and selected states are
  visible. Motion respects reduced-motion preferences.
- Hosted, GitHub, local setup, and social links use verified destinations.
- Product claims distinguish available features from planned mobile access.
- No stale clinical framing, unsubstantiated statistics/testimonials, or
  placeholder public links. Retain useful setup/privacy/cost information in
  concise language appropriate to visitors.
- Show rendered design for review before treating implementation as accepted.
  Publishing and building the hosted/mobile products are separate task scopes.
