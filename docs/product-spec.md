# Product spec

## Overview

`skill-share` is an internal marketplace for markdown-based ChatGPT and Codex skills used by Cars employees. It should make skills easy to discover, review, preview, and download while keeping access limited to trusted internal users.

## Primary goal

Create a simple internal destination where employees can contribute useful skill files and quickly find reusable skills created by other teams.

## Target users

- Employees with `@cars24.com` email addresses
- Internal contributors who upload or maintain skills
- Future admins who moderate content and metadata

## Core user stories

1. As a Cars employee, I can sign in with my work email and access the marketplace.
2. As a contributor, I can upload a markdown skill file and assign a category.
3. As a browser, I can search, sort, and filter skills by category and uploader.
4. As a browser, I can open a skill detail page and preview the markdown content.
5. As a browser, I can download the latest or a previous version of a skill.
6. As an admin, I can later moderate listings and manage problem content.

## Functional requirements

- Access control should allow only `@cars24.com` users.
- Users should be able to upload markdown files.
- Each skill should have:
  - title
  - slug
  - summary
  - category
  - uploader information
  - latest version
  - version history
  - markdown preview
  - download action
- Marketplace pages should support:
  - keyword search
  - sort options
  - category filters
  - uploader filters
- The data model should support an admin role even if moderation is not built in phase one.

## Non-goals for the initial scaffold

- Real Supabase connection
- Production auth flows
- Actual file uploads
- Full admin moderation UI
- Analytics, ratings, or comments

## Suggested domain model

### users

- `id`
- `email`
- `full_name`
- `role`
- `created_at`

### skill_categories

- `id`
- `name`
- `slug`

### skills

- `id`
- `slug`
- `title`
- `summary`
- `category_id`
- `uploader_id`
- `current_version_id`
- `created_at`
- `updated_at`

### skill_versions

- `id`
- `skill_id`
- `version`
- `storage_path`
- `markdown_body`
- `changelog`
- `created_by`
- `created_at`

## Access and security notes

- Enforce sign-in with Supabase Auth.
- Reject non-`@cars24.com` emails during sign-in or immediately after callback.
- Protect app routes with middleware.
- Store uploads in Supabase Storage with private-by-default access.

## Success criteria for the first product slice

- A Cars user can authenticate.
- A Cars user can browse a list of skills.
- A Cars user can open a detail page and preview markdown.
- A Cars user can upload a new skill version.
- The app structure is ready for moderation work later.
