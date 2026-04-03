# Markdown MIME upload fix

## Exact files changed

- `lib/upload-utils.ts`
- `lib/upload-utils.test.ts`
- `components/upload/upload-form.tsx`
- `app/actions/skills.ts`
- `supabase/migrations/20260403094500_allow_octet_stream_markdown_uploads.sql`
- `docs/upload/markdown-mime-fix.md`

## Root cause

- The upload flow relied too heavily on the browser-reported `file.type`.
- Some browsers and operating systems report valid `.md` files as `application/octet-stream`, `text/plain`, or an empty string instead of `text/markdown`.
- The previous fix updated validation and the `contentType` option, but it did not normalize the actual uploaded file payload itself.
- In practice, the exact failing step was the Supabase Storage upload call: valid markdown files could still reach storage as `application/octet-stream`.
- Already-initialized Supabase environments also still had a bucket MIME allowlist that excluded `application/octet-stream`, so deployed environments could keep rejecting those uploads even after app code changed.

## How markdown validation now works

- Validation now uses both:
  - the `.md` filename extension
  - an allowlist of accepted markdown/plain-text MIME values
- A file is accepted only when:
  - the filename ends in `.md`
  - and the MIME type is accepted or missing
- Uploads no longer trust the browser MIME type for storage metadata.
- Accepted markdown uploads are now normalized twice before storage:
  - validation accepts the expected markdown/plain-text MIME variants
  - the actual upload payload is rebuilt with `text/markdown`
- The storage upload calls for both create and edit replacement uploads now send normalized markdown payloads and `contentType: text/markdown`.
- Rollback/restore uploads also normalize markdown blobs before re-uploading.
- A Supabase migration was added so existing environments allow `application/octet-stream` for `.md` uploads at the bucket level too.

## Which MIME types are accepted

- `text/markdown`
- `text/plain`
- `application/octet-stream`
- empty / missing MIME type

## Whether the `.md` extension is now used as part of validation

- Yes.
- The `.md` extension is required and is now part of both the client-side and server-side upload validation path.

## Short root-cause note

- This was primarily a storage content-type bug, not just a validation bug.
- It was not a separate hidden upload implementation.
- Both create-new-skill and edit-skill replacement uploads used the same incomplete storage upload pattern.
- For deployed environments, a Supabase bucket configuration update is also required, because old environments keep the previous bucket MIME allowlist until the new migration is applied.
