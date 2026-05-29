# Chat Handoff

Last synced: 2026-05-29

## Current Working Context

The current active work is AppScreener MVP relationship-layer execution. The latest completed work is the locked V1 Trusted Adoption Graph, the first public graph layer for creator-tool, workflow-tool, and creator-workflow relationships.

V1 graph coverage now includes 26 accepted creator-tool relationships, 20 adoption-style creator-tool edges, 46 accepted workflow-tool relationships, and 9 derived accepted creator-workflow relationships.

Tool profile creator sections use trust-safe "Creators connected to..." language and only surface accepted `uses`/`teaches` edges there. Mention-only relationships remain excluded from verified adoption sections.

Creator profile pages now surface accepted `mentions` separately under "Tools Mentioned" and accepted `uses`/`teaches` under "Verified Tool Relationships". Mentioned tools are attention signals, not verified usage claims.

The user is highly sensitive to accidental changes outside the requested scope. The homepage Attention Heatmap / Daily Buzz design and homepage master module grid are locked.

## Immediate Next Priorities

1. Expand the trusted graph with evidence-backed creator-tool edges.
2. Add stronger relationship evidence/source capture before exposing confidence UI.
3. Improve search quality using graph-aware retrieval signals.
4. Redesign `/heatmap` into an exploration engine.
5. Strengthen `/tags/[tag]` ecosystem hubs with relationship traversal.

## Current Design Direction

AppScreener should feel like:

- AI ecosystem intelligence
- creator/tool/workflow discovery
- operational taxonomy and relationship mapping
- dense premium terminal UI
- Bloomberg/DexScreener/Linear/Vercel-like restraint

Avoid:

- generic SaaS landing page patterns
- Product Hunt clone behavior
- fake analytics
- bright neon/glossy UI
- oversized empty cards
- fabricated social proof

## Important Constraints

- Do not touch homepage Attention Heatmap / Daily Buzz unless explicitly asked.
- Do not touch homepage master grid/module layout unless explicitly asked.
- Do not change global nav unless explicitly asked.
- Do not fabricate creator-tool usage, mentions, quotes, endorsements, or unsupported metrics.
- Only accepted graph relationships can power public creator/tool/workflow UI.
- `mentions` are a separate relationship layer and must not be treated as verified usage or shown in adoption-style creator sections.
- On creator profile pages, accepted `mentions` should be shown as "Tools Mentioned" when present, even if verified usage is still pending.
- Public UI must not expose TAAFT/Favikon/Product Hunt provenance labels.
- Pending-review creators must remain hidden publicly.
- If a requested change would violate a locked area, stop and explain that it is restricted.

## Active UI Philosophy

Use compact, high-signal modules:

- thin borders
- dark fills
- subtle low-opacity glow
- tight spacing rhythm
- dense metadata rows
- compact cards
- clickable discovery loops

Prefer making existing information more usable over adding new content.

## Current Unresolved Issues

- V1 graph coverage is intentionally small; many tools still have no accepted public creator relationships.
- Workflow detail pages now surface accepted derived creator-workflow relationships when present.
- Empty states should remain compact and professional.
- Future-safe creator-tool types exist for `recommends`, `builds_with`, `switched_to`, and `abandoned`, but V1 public surfaces currently support only `uses`, `teaches`, and separated `mentions`.
- The Codex app may show `{"detail":"Bad Request"}` after tools; verify actual work with files/typecheck/build instead of assuming app failure.

## Exact Current Focus Areas

Current system under active refinement:

- V1 Trusted Adoption Graph

Current relevant files:

- `lib/types.ts`
- `lib/data.ts`
- `PROJECT_STATUS.md`
- `README.md`
- `CHAT_HANDOFF.md`

Current relationship rules:

- relationship arrays are the source of truth
- imported creator slug arrays are placeholders/inputs, not public proof
- creator `toolSlugs` are derived from accepted `uses`/`teaches` relationships, not mentions
- creator `workflowSlugs` are derived from accepted creator-workflow relationships
- workflow `toolSlugs` are derived from accepted workflow-tool relationships
- accepted mentions remain a real graph layer but should stay separate from adoption/usage claims
- creator profile relationship sections split verified `uses`/`teaches` from mention-only tool relationships

## Known Codex Workflow Constraints

- The app has repeatedly shown `{"detail":"Bad Request"}` after tool calls. This appears to be a Codex app/tool transport display issue.
- Continue by checking actual filesystem state, typecheck, and build.
- Avoid unnecessary tool calls when the user is asking for very small changes.
- Use `apply_patch` for file edits.
- Prefer `rg` and quoted paths, especially for routes like `app/tools/[slug]/page.tsx`.

## Important Implementation Notes For Next Session

- `PROJECT_STATUS.md` and `CHAT_HANDOFF.md` are now required state sync files.
- After meaningful implementation:
  1. Update the feature/system itself.
  2. Update `PROJECT_STATUS.md`.
  3. Update `README.md` if architecture/product capabilities changed.
  4. Update `CHAT_HANDOFF.md` with latest operational context.
- Check `git status` before assuming clean state.

## Current Product Decisions To Preserve

- Homepage Attention Heatmap clusters:
  - Trading & Markets
  - Growth & Sales
  - Daily Buzz
  - Builder Tools
  - Automation & Ops
- Daily Buzz color system is locked.
- `/tools/[slug]` should remain the canonical product intelligence profile page.
- `/heatmap` should remain a separate exploration page.
- `/tags/[tag]` should be the unified ecosystem tag destination.
- Public creator pages should only show accepted creators.
