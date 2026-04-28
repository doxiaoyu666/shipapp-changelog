---
name: changelog
description: Generate multilingual What's New from git commits for App Store releases. Reads commit history, generates user-friendly release notes in multiple languages, and optionally uploads to App Store Connect.
argument-hint: [app name] [--since <tag>]
---

# Changelog — Generate What's New

Generate user-friendly, multilingual What's New text from git commit history for App Store releases.

## Prerequisites

- `shipapp-changelog` CLI installed (clone repo, `npm install && npm run build`)
- For uploading: `shipapp-metadata` CLI configured (`shipapp-metadata init`)

## Arguments

- `[app name]` — optional. Used for uploading to ASC via shipapp-metadata
- `--since <tag|commit>` — optional. Start point for commit range (default: latest tag)

**Examples:**
- `/changelog` — generate from latest tag in current repo
- `/changelog tapal` — generate and upload for Tapal
- `/changelog fotime --since v2.1.0` — generate from specific tag

## Workflow

### Step 1 — Read git history

Run `shipapp-changelog log --cwd <project_dir>` to see what changed since last tag.

If user specified `--since`, use that ref. Otherwise auto-detect latest tag.

Show the grouped commits to the user so they know what's included.

### Step 2 — Generate What's New

Based on the commit data, write **user-friendly** release notes. Rules:

- Do NOT use raw commit messages — rewrite them for end users
- Group changes into natural categories (new features, improvements, fixes)
- Keep it concise (4-8 lines max)
- Tone: friendly, clear, benefit-focused
- No technical jargon (no "refactor", "migrate", "dependency bump")

### Step 3 — Generate multilingual versions

Create What's New in these languages:
- `en-US` — English
- `zh-Hans` — Chinese Simplified
- `zh-Hant` — Traditional Chinese
- `ja` — Japanese
- `ko` — Korean
- `fr-FR` — French
- `de-DE` — German
- `es-ES` — Spanish

Each language should be independently written, not machine-translated.

### Step 4 — Write JSON files

Write to the app's metadata directory (e.g., `ASO_Materials/` or user-specified dir).

Update only the `whats_new` field in each language JSON file. Keep other fields unchanged.

### Step 5 — Confirm and upload (optional)

If app name was provided, ask user to confirm, then upload:

```bash
shipapp-metadata push --app <keyword> --dir <metadata_dir> --only whats_new
```

## Content Rules

- No emoji in What's New text
- No version numbers in the text itself
- Focus on user benefits, not implementation details
- "Fixed a crash when..." not "fix: null pointer in AuthManager"
- Each language independently optimized
