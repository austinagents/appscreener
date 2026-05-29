# AppScreener Project Status

Last synced: 2026-05-29

## Current Platform State

AppScreener is an AI ecosystem intelligence MVP, not just a homepage MVP. It currently includes:

- homepage intelligence command center
- tool intelligence profile pages
- category and tag exploration
- workflow intelligence surfaces
- creator taxonomy and accepted-only creator public UI
- dedicated heatmap exploration page
- watchlist, compare, moving/events/narratives/breaking-out surfaces
- private operator route
- TAAFT product ingestion artifacts
- creator ingestion/tagging foundation
- shared ecosystem color and tag systems

## Latest Completed Changes

- `/tools/[slug]` was hard-reset into a tool intelligence profile architecture.
- Tool profile pages now use:
  - local left sidebar
  - hero/tool identity card
  - Trending on AppScreener card
  - Why is this trending?
  - Creators connected to this tool
  - Popular in these workflows
  - Recent mentions
  - About metadata rail
  - Related tags
  - Tools often used with
  - Trending nearby
- Removed the local top search/action bar from `/tools/[slug]`.
- Removed the local AppScreener brand block from the `/tools/[slug]` sidebar.
- Tightened `/tools/[slug]` spacing and expanded page width usage.
- Adjusted `/tools/[slug]` sidebar vertical alignment.
- Homepage Trending timeframe toggles were removed because 7D/30D were not backed by independent ranking logic.
- Boost CTA arrows were removed; CTA buttons were subtly polished.
- Dedicated `/heatmap` page was created as a separate exploration surface from the homepage Attention Heatmap.
- Shared ecosystem tag directory was created through `lib/ecosystem-tags.ts`.
- V1 Trusted Adoption Graph was added as the first public relationship layer.
- Explicit accepted relationship arrays now power creator-tool, workflow-tool, and derived creator-workflow relationships.
- Existing creator `toolSlugs` and `workflowSlugs` are now derived from accepted graph relationships instead of imported placeholder arrays.
- V1 graph semantics now separate adoption relationships from mentions: creator `toolSlugs` and creator-workflow derivation use accepted `uses`/`teaches` relationships, while `mentions` remain a separate graph layer.
- Creator and workflow profile stale pending states were cleaned up to reflect accepted graph relationships when they exist.
- V1 Trusted Adoption Graph is now locked as the current relationship model: `uses`, `teaches`, and `mentions` are supported creator-tool relationship types; `recommends`, `builds_with`, `switched_to`, and `abandoned` remain typed for future use but are not surfaced publicly yet.
- `/tools/[slug]` creator sections now use trust-safe "Creators connected to..." language, show only accepted `uses`/`teaches` badges, and exclude mention-only relationships from adoption-style creator cards.
- Tool workflow cards no longer display seeded `creatorUsage` as public creator adoption; they only show verified creator relationship counts derived from accepted creator-workflow edges.
- Creator profile pages now separate accepted creator-tool relationships into "Verified Tool Relationships" for `uses`/`teaches` and "Tools Mentioned" for `mentions`, with mention rows treated as attention signals rather than verified usage.

## Current Active Architecture

### Frontend

- Next.js App Router
- Global styling in `app/globals.css`
- Reusable components under `components/`
- Local MVP data in `lib/data.ts`
- Static generation for tool/category/creator/tag/workflow pages

### Data

- Local seeded data drives the MVP.
- TAAFT import artifacts expand the tool universe.
- Supabase schema exists but Supabase is not required for local runtime.
- Creator import architecture exists, but pending-review creators stay hidden publicly.
- V1 Trusted Adoption Graph relationships are modeled explicitly in `lib/data.ts` using typed edges from `lib/types.ts`.
- Only accepted relationships power public creator/tool/workflow relationship surfaces.
- Mentions are accepted relationship signals but do not become verified usage or workflow adoption.
- Creator profiles surface accepted mention relationships separately as "Tools Mentioned" while keeping verified usage/teaching relationships distinct.

### Tag/Category Logic

- Broad categories remain top-level category concepts.
- Creator specialization tags and heatmap attention tags resolve through the shared ecosystem tag directory.
- Canonical tag route: `/tags/[tag]`.
- Homepage Attention Heatmap uses locked visual cluster colors and should not inherit destination tag colors.

## Runtime Behavior

Local dev:

```bash
npm start
```

Build:

```bash
npm run build
```

Typecheck:

```bash
npm run typecheck
```

The app builds without Supabase env vars by using local seeded data.

## Active Routes / Pages

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
- `/operator`

API preview routes:

- `/api/trending-tools`
- `/api/breakout-tools`
- `/api/workflows`
- `/api/creator-adoption`
- `/api/heatmaps`

## Current Ecosystem / Tag / Workflow Logic

- `lib/ecosystem-tags.ts` unifies creator and attention tags.
- `lib/attention-subcategories.ts` contains canonical attention subcategory tags:
  - Trading Bots
  - Prediction Markets
  - Market Analysis
  - Whale Tracking
  - Mass Email
  - Lead Generation
  - Cold Outreach
  - Web Scraping
  - Daily Buzz
  - Thumbnails
  - Websites
  - Vibe Coding
  - Debugging
  - 3D Assets
  - Research Agents
  - AI Employees
  - Video Editing
  - Automation
- `lib/creator-tags.ts` contains approved creator taxonomy.
- `lib/ecosystem-colors.ts` is the shared color foundation for ecosystem categories.
- Workflow relationships currently come from local workflow/tool/creator data in `lib/data.ts`.
- Workflow-tool relationships are explicit accepted graph edges derived from existing workflow stacks.
- Creator-tool relationships begin with a small manually reviewed accepted seed set.
- Creator-workflow relationships are conservatively derived from accepted creator-tool overlap with workflow stacks.
- V1 creator-tool relationship types are locked to `uses`, `teaches`, and `mentions`; future-safe typed states exist for `recommends`, `builds_with`, `switched_to`, and `abandoned`, but they are not public UI signals yet.
- Current accepted graph counts: 26 creator-tool relationships, 20 adoption-style creator-tool edges, 46 workflow-tool relationships, and 9 derived creator-workflow relationships.

## Known Issues

- The Codex desktop UI sometimes displays `{"detail":"Bad Request"}` after tool calls. This has been a tool transport/UI issue, not necessarily an app failure. Verify with typecheck/build and file diffs.
- Some `/tools/[slug]` pages have sparse creator/workflow/mention data. Empty states are intentional and trust-safe.
- V1 creator-tool coverage is intentionally small and high-confidence; many tools still have no accepted public creator relationships.
- Mention-only relationships are intentionally excluded from verified adoption sections.
- Creator profiles may show mentioned tools even when verified usage is pending.
- `npm run build` may show autoprefixer warnings about `start` support in CSS. Builds have still completed successfully.
- Current ranking data is local/static seed logic. It is not true independent live timeframe aggregation.
- `/tools/[slug]` left sidebar alignment was adjusted via route-specific CSS and may need a final visual check in browser.

## Pending UX Cleanup Items

- Final visual QA for `/tools/[slug]` across multiple tool slugs.
- Continue refining `/tools/[slug]` only if screenshots show spacing issues.
- Confirm sidebar top alignment against hero/trending card top edge after latest offset.
- Review mobile behavior for `/tools/[slug]`.
- Review dedicated `/heatmap` page for density and interaction readiness.
- Expand accepted creator-tool and creator-workflow relationship coverage before surfacing stronger social proof.

## Next Recommended Priorities

1. Continue expanding the V1 Trusted Adoption Graph with accepted creator-tool relationships.
2. Add stronger evidence/source capture for accepted relationship edges before exposing confidence UI.
3. Improve search quality.
4. Redesign `/heatmap` into a deeper exploration engine.
5. Strengthen `/tags/[tag]` ecosystem hubs.

## Current Deployment / Runtime Workflow

Safe local validation:

```bash
npm run typecheck
npm run build
```

Safe deploy flow:

```bash
git status
git add .
git commit -m "Describe change"
git push
```

Vercel is connected through GitHub. Avoid force-pushing unless the remote history is confirmed disposable.

## Recent Structural Decisions

- Homepage Attention Heatmap / Daily Buzz section is locked.
- Homepage master module grid is locked unless explicitly unlocked by the user.
- `/heatmap` page is a separate exploration engine, not an enlarged homepage widget.
- `/tools/[slug]` is the canonical AppScreener tool intelligence profile route.
- `/tags/[tag]` is the canonical shared ecosystem tag route.
- Public UI must not expose raw backend provenance labels.
- Use trust-safe empty states instead of fake creator usage, fake mentions, or fake workflow claims.
- Relationship arrays are the source of truth for public graph density; imported slug arrays are treated as inputs/placeholders, not public proof.
- Uses/teaches relationships can support verified adoption surfaces; mentions must remain separate from usage claims.
