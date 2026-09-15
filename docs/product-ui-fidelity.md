# Product UI reference and fixture adapter

The first landing demo was rejected because it invented a different application
interface. The September 13 correction uses the actual SciSpark product source
and public screenshots as the visual baseline.

Source workspace: `/Users/tongshan/Documents/SciSpark_paper_manager`. Working
tree inspected with HEAD `4e122b3`. Public screenshots in `docs/assets/readme/`
were captured from `908fa7c` with illustrative data; current source takes priority.
The product workspace was not modified.

| Demo surface | Product source | Preserved UI |
| --- | --- | --- |
| Shell | `components/layout/{AppShell,Sidebar,MobileNav}.tsx` | Grouped Discover/Knowledge/Tools navigation; 240px expanded, 60px collapsed; Home naming; profile footer; 50px mobile bar and drawer |
| Feed | `app/page.tsx`, `components/feed/RealFeedCard.tsx` | Greeting, refresh/publication row, paper category headers, 28px cards, title/summary/relevance/tags, source metadata, bookmark and feedback controls |
| Paper | `components/paper/{PaperHeader,PaperActions}.tsx` | Large title, authors/ID, summary panel, Save, Generate digest, Add to knowledge base, Read full text, related wiki |
| Wiki | `app/wiki/[...id]/page.tsx`, `components/wiki/{PageEditor,Backlinks}.tsx` | Back link, Save/Delete, type/tag/source metadata, Edit/Preview tabs, Markdown body, backlinks alongside the editor |
| Graph | `components/viz/{VizWorkspace,VizTabs,GraphView,FilterBar,Inspector}.tsx` | Pill view controls, type filters, community-colored network, derived node/edge counts, hover emphasis and selected-node inspector |
| Spark | `app/spark/page.tsx`, `components/spark/{SparkPanel,SeedCard,IdeaGallery}.tsx` | Direction field, Quick/Deep actions, seed results and Save/Develop controls, gallery cards and statuses |
| Companion | `components/companion/{CompanionMascot,QuickChat}.tsx` | Corner spark launcher, optional chat panel, close/focus behavior |
| Sparky | `components/chat/{ChatWorkspace,Composer,ReviewReport}.tsx` | Welcome/composer, Chat/Search/Review controls, source scope, replies and report save |
| Trending | `components/trending/{TrendingWorkspace,Leaderboard}.tsx` | Field chips, activity rows, expandable topics and related papers |
| Projects | `app/projects/{page,[id]/page}.tsx` | Search, new project, project cards, overview/pages/notes/conversations |
| History | `components/history/HistoryPageClient.tsx` | Conversations/Changes controls, saved sessions, change preview and guarded undo |

The product's local Halant/Geist families, Lucide icons, semantic palette, rounded
cards, pill buttons, and category colors are retained. Landing tour shortcuts and
interest presets are outside the product frame. They are demonstration controls,
not fictional app navigation.

The latest motion refinement also references
`src/components/chat/StreamingReply.tsx` and the stage labels in `ChatWorkspace.tsx`:
Sparky's thinking/responding indicator, short source-reading status, progressive
text, and citation/save controls after completion. The landing simulates this
sequence using the same existing local content across chat, digest, and Spark.
It does not call a model or display an invented internal reasoning trace.

## Deliberate fixture adaptations

- This is a standalone presentation adapter, not an embedded running product.
  It replaces vault/model calls with prepared data and in-memory interactions.
- Eighteen recent public papers fill the feed with six cards per interest, using
  a 2024–2025 publication window. Six foundational sources remain in the wiki,
  graph, and research-question examples. Paper summaries are authored paraphrases, not
  copied abstracts. Read full text opens the paper's public arXiv PDF.
- Saving a feed card stays on Home, as in the product. Adding a paper to the
  knowledge base opens the related wiki example. Saved edits survive navigation
  and explicit locale changes for this visit; Reset clears them.
- The graph renders 21 prepared paper/concept/idea nodes with 75 explicit example
  connections in SVG. It resembles the product's network UI but does not load
  Sigma/WebGL or a real vault. These edges are illustrative knowledge links,
  not publication citation claims. Citation view states that records are absent.
- Quick/Deep Spark and chat use authored responses inside the labeled interactive
  preview; no paid calls occur. Repeated fixture labels such as "Prepared example"
  are omitted from product screens. Idea-page actions open the
  corresponding question in the wiki presentation.
- All eight sidebar pages are demonstrated internally. Saved chat examples,
  created projects, and wiki/project note changes are retained during the visit.
  Undo restores a note only when its current contents still match that change.
  Trending curves are labeled illustrative; they are not live publication data.
- The macOS outer frame, tour controls, hero motion, and README framework were
  explicitly approved for the marketing presentation. They do not represent
  changes to the product itself. The cursor adapts the old landing's
  `home-mockup/cursor-demo` approach, using the current product's controls.
- The September 13 viewport refinement scales the entire desktop frame uniformly
  to fit the screen, preserving the app's internal proportions. Localized cursor
  explanations belong to the tour overlay. Mobile retains its unscaled layout.
- Product controls and fixture text are localized for the landing's three
  languages. This is not a claim about the product's own localization status.
- Product `design.md` explicitly requires white on the existing orange action
  fill and profile initial. The demo preserves that known 2.8:1 contrast
  exception; it does not claim those controls pass WCAG normal-text contrast.

The source product is Apache-2.0. Its license is retained in
[docs/licenses/scispark-product-Apache-2.0.txt](licenses/scispark-product-Apache-2.0.txt).
Adapter files identify the components they follow. Branding remains supplied art.
