# Markdown MIME upload fix

## Exact files changed

- `lib/upload-utils.ts`
- `lib/upload-utils.test.ts`
- `components/upload/upload-form.tsx`
- `app/actions/skills.ts`
- `docs/upload/markdown-mime-fix.md`

## Root cause

- The upload flow relied too heavily on the browser-reported `file.type`.
- Some browsers and operating systems report valid `.md` files as `application/octet-stream`, `text/plain`, or an empty string instead of `text/markdown`.
- The server upload code was also forwarding the raw browser MIME type to Supabase Storage.
- Because the storage bucket only allows markdown/plain-text MIME types, a valid `.md` file reported as `application/octet-stream` could be rejected during upload.

## How markdown validation now works

- Validation now uses both:
  - the `.md` filename extension
  - an allowlist of accepted markdown/plain-text MIME values
- A file is accepted only when:
  - the filename ends in `.md`
  - and the MIME type is accepted or missing
- Uploads no longer trust the browser MIME type for storage metadata.
- Accepted markdown uploads are now stored with a normalized content type of `text/markdown`.

## Which MIME types are accepted

- `text/markdown`
- `text/plain`
- `application/octet-stream`
- empty / missing MIME type

## Whether the `.md` extension is now used as part of validation

- Yes.
- The `.md` extension is required and is now part of both the client-side and server-side upload validation path.
