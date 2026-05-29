# AppScreener

AppScreener is a live AI ecosystem screener. The product is moving beyond a directory into an intelligence layer for tracking tools, creators, workflows, categories, attention pockets, and ecosystem relationships.

The MVP is intentionally dark, dense, and terminal-inspired. It should feel like an operational AI attention terminal, not a generic SaaS landing page or static AI tools directory.

## Current Platform Capabilities

- Homepage command center with Trending Tools, category filters, Creator Graph, Trending Workflows, Attention Heatmap, movement modules, and monetization surfaces.
- Tool intelligence profiles at `/tools/[slug]` with local sidebar navigation, hero identity, trending snapshot, ecosystem reasons, creator/workflow sections, recent mentions, related tags, related tools, and nearby movers.
- Dedicated `/heatmap` exploration page separate from the homepage heatmap widget.
- Unified ecosystem tag route at `/tags/[tag]` for creator tags and heatmap attention tags.
- Creator pages and creator tag pages with accepted-only public creator gating and separated verified-tool versus mentioned-tool relationship surfaces.
- Workflow pages and workflow listings backed by local workflow/tool relationships.
- V1 Trusted Adoption Graph with accepted creator-tool, workflow-tool, and derived creator-workflow relationships, now locked to trust-safe V1 semantics.
- Category pages backed by the shared category and ecosystem color systems.
- Compare, Watchlist, Breaking Out, Moving, Events, Narratives, and private Operator routes.
- LocalStorage watchlist behavior for tools, workflows, and categories.
- TAAFT import artifacts and logo validation pipeline for MVP product universe expansion.
- Creator import/tagging infrastructure with pending-review quality gate.

## Route Architecture

Public pages:

- `/`
- `/tools/[slug]`
- `/tags/[tag]`
- `/categories/[slug]`
- `/workflows`
- `/workflows/[slug]`
- `/creators`
- `/creators/[id]`
- `/creators/tags/[tag]`
- `/heatmap`
- `/breaking-out`
- `/moving`
- `/events`
- `/narratives`
- `/compare`
- `/watchlist`

Private/operator page:

- `/operator`

API preview routes:

- `/api/trending-tools`
- `/api/breakout-tools`
- `/api/workflows`
- `/api/creator-adoption`
- `/api/heatmaps`

## Major Systems

### Product Universe

Products are normalized into AppScreener tool records with canonical names, slugs, descriptions, websites, logos, categories, tags, use cases, lifecycle state, listing state, ranking seed values, and backend provenance fields.

TAAFT is the current canonical MVP ingestion source. TAAFT provenance is backend/admin-only and must not appear in public UI.

### Ranking And Movement

The app separates listing eligibility from organic movement:

- Listing answers: is this product real enough to track?
- Organic trending answers: is this product moving unusually fast right now?
- Sponsored/boost surfaces answer: who is paying to amplify visibility?

Current ranking behavior is local/static seed logic, not independent live 24H/7D/30D aggregation. Homepage timeframe toggles were removed to avoid unsupported controls.

### Ecosystem Tags

`lib/ecosystem-tags.ts` is the shared ecosystem tag resolver.

It combines:

- creator specialization tags from `lib/creator-tags.ts`
- attention subcategory tags from `lib/attention-subcategories.ts`

The canonical unified route is:

- `/tags/[tag]`

Creator tag pages may remain as legacy-compatible surfaces, but new ecosystem navigation should prefer `/tags/[tag]`.

### Attention Tags

Homepage Attention Heatmap is a locked design surface. It is a compact taxonomy panel, not a literal heatmap chart.

Locked homepage clusters:

- Trading & Markets
- Growth & Sales
- Daily Buzz
- Builder Tools
- Automation & Ops

The dedicated `/heatmap` page has a separate job: ecosystem exploration, relationship navigation, and deeper attention discovery. Do not make it a larger copy of the homepage module.

### Creator Intelligence

Creator tagging infrastructure exists with:

- primary specialization
- specialization tags
- creator types
- platform focus
- audience tags
- influence tags
- workflow tags
- tool category tags
- backend-only confidence/source/notes fields

Public creator UI must only show accepted creators. Pending-review creators remain backend/operator-only. Do not restore fake creator personas.

Creator profile relationship sections keep relationship types separate:

- `uses` and `teaches` appear under "Verified Tool Relationships".
- `mentions` appear under "Tools Mentioned".
- Mentioned tools are not labeled as used tools or converted into verified adoption.

### Trusted Adoption Graph

V1 graph relationships are explicit local edge arrays in `lib/data.ts` with types in `lib/types.ts`.

The first public graph layer includes:

- creator-tool relationships
- workflow-tool relationships
- creator-workflow relationships

Relationship arrays are the source of truth. Existing creator `toolSlugs` and `workflowSlugs` are derived from accepted relationships, while workflow `toolSlugs` are derived from accepted workflow-tool relationships.

Only `accepted` relationships can power public UI. Pending or rejected relationships must remain hidden from public relationship surfaces.

V1 distinguishes adoption from attention:

- `uses` and `teaches` can support verified adoption surfaces.
- `mentions` are a separate graph layer and must not be treated as verified usage.
- Creator-workflow relationships are derived only from accepted adoption-style creator-tool overlap, not from mentions alone.

Supported V1 creator-tool relationship types are `uses`, `teaches`, and `mentions`. Future-safe typed states exist for `recommends`, `builds_with`, `switched_to`, and `abandoned`, but they are not surfaced publicly yet.

Current accepted V1 graph coverage: 26 creator-tool relationships, 20 adoption-style creator-tool relationships, 46 workflow-tool relationships, and 9 derived creator-workflow relationships.

### Tool Intelligence Profiles

`/tools/[slug]` is the canonical AI product intelligence profile page.

Current structure:

- local left sidebar
- hero identity card
- Trending on AppScreener card
- Why is this trending?
- Creators connected to this tool
- Popular in these workflows
- Recent mentions
- About metadata rail
- Related tags
- Tools often used with
- Trending nearby

The page should prioritize creator/tool/workflow ecosystem intelligence over directory-style metadata.

## Data Relationships

Current local relationships live primarily in `lib/data.ts`:

- tools
- workflows
- creators
- creator signals
- relationship edges
- categories
- creator-tool relationships
- workflow-tool relationships
- creator-workflow relationships

Relationship surfaces derive from:

- workflow-tool overlap
- creator-tool associations
- creator-workflow associations
- category overlap
- related tool arrays
- ecosystem tags

Do not fabricate creator usage, social mentions, endorsements, or unsupported analytics. If a relationship is missing, use compact trust-safe empty states.

Current V1 relationship coverage is intentionally small and trust-first. Aggregate tool metrics such as `creatorMentions` and `workflowInclusions` are movement signals, not proof of public creator attribution.

Future creator and tool pages should keep verified adoption and frequent mentions separate rather than merging them into one social-proof bucket.

## Local Development Workflow

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Validation:

```bash
npm run typecheck
npm run build
npm run logos:validate
```

The production build writes to `.next-prod` because `package.json` uses:

```bash
NEXT_DIST_DIR=.next-prod next build
```

## Deployment Workflow

Current GitHub remote:

```text
https://github.com/austinagents/appscreener.git
```

Normal safe flow:

```bash
git status
npm run typecheck
npm run build
git add .
git commit -m "Describe change"
git push
```

Vercel is connected to GitHub. Pushing the active deployment branch creates a preview/production deployment depending on Vercel project settings.

If local and remote histories diverge, do not force push unless the remote history has been explicitly confirmed disposable.

## Import And QA Scripts

```bash
npm run import:taaft
npm run import:creators
npm run creators:avatars
npm run logos:fetch
npm run logos:validate
```

## Environment

Copy `.env.example` to `.env.local` when needed:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_ADMIN_PASSWORD=appscreener-admin
```

Supabase is not required for the current local MVP. Missing Supabase env vars should not block local build.

The current admin password logic is MVP-only and should move server-side before serious production use.

## Core Product Philosophy

AppScreener should answer:

- What AI tools are moving?
- Which creators are connected to them?
- Which workflows include them?
- What tags/categories connect them?
- Where is AI attention rotating?

Public UI should use AppScreener-native language such as:

- Active Tracking
- Discovery Verified
- Verified Momentum
- Indexed
- Under Observation

Public UI should not expose raw source provenance such as TAAFT/Favikon/Product Hunt labels unless explicitly intended for operator/admin use.

## Important Design Constraints

- Homepage Attention Heatmap / Daily Buzz layout is locked.
- Homepage master module grid is locked unless explicitly unlocked.
- Avoid fake metrics, fake creator endorsements, fake social mentions, and unsupported live-source claims.
- Keep UI dense, premium, operational, and terminal-native.
- Prefer trust-safe empty states over fabricated completeness.
