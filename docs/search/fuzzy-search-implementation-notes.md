# Fuzzy Search Implementation Notes

## Exact files changed

- `lib/skills.ts`
- `lib/data.ts`
- `lib/skills.test.ts`
- `docs/search/fuzzy-search-implementation-notes.md`

## Fuzzy matching approach used

The `/skills` catalog now uses an application-side fuzzy matcher in `lib/skills.ts`.

It keeps the existing `q`, `category`, `uploader`, and `sort` query-param model unchanged, then:

- normalizes search text to lowercase plain tokens
- checks for strong phrase matches
- scores token matches across searchable fields using:
  - exact token match
  - prefix match for partial words
  - substring match for longer partials
  - bounded Levenshtein-distance matching for misspellings and near matches

This approach was chosen because it fits the current stack cleanly, keeps behavior fully in one shared catalog-search helper, and avoids unnecessary Supabase or schema changes.

## Fields included in fuzzy search

Fuzzy search currently scores these fields:

- `title`
- `summary`
- `description`
- `categoryName`
- `uploaderName`
- `tags` when present on a skill object

This preserves the existing search surface and adds fuzzy behavior on top of it.

## How result relevance and ranking work

Search ranking is weighted by field importance:

- title matches are weighted highest
- summary matches are next
- description matches are lower-weight
- category and tags are lower-weight support signals
- uploader name is kept searchable with the lowest weight

Ranking favors:

- full-phrase matches over token-only matches
- title hits over lower-priority fields
- exact/prefix/substring matches over typo-tolerant fuzzy matches
- the existing selected sort order as the tie-breaker once relevance is equal

This keeps results relevant without making them feel random, while still preserving the current sort controls and URL-driven state.

## Supabase or database changes

No Supabase, schema, storage, auth, org-member, or RLS changes were needed.

The current catalog already loads the data needed for search, so fuzzy matching was implemented in the shared application search layer and reused from `lib/data.ts`.

## Follow-up improvements recommended

- Add highlighted match snippets in the UI if the catalog grows and users need more confidence about why a result matched.
- Consider indexed database-side fuzzy search only if catalog size grows enough that in-memory ranking becomes a bottleneck.
- Add optional synonym dictionaries later if teams want broader wording tolerance beyond typo and near-match handling.
