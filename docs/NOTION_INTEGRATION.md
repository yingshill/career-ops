# Notion integration — Career-Ops → Job Tracker

This fork adds a Notion bridge so Career-Ops evaluations flow into a Notion **Job Tracker** database. Humans still apply manually in each portal; once applied, a second command updates the same Notion row.

See [`integrations/notion/README.md`](../integrations/notion/README.md) for setup + env vars.

## Flow

```
/career-ops {job URL}
        │
        ▼
  (archetype + A-F evaluation — unchanged)
        │
        ▼
  Report (.md) + PDF (.pdf) + local tracker (.tsv)
        │
        ▼
  integrations/notion/sync.mjs upsert-eval  ← NEW
        │
        ▼
  Notion row in 📋 Job Tracker
      (Application Status = "Not Applied", Applied = ☐)

─────────── human applies in the portal ───────────

  integrations/notion/sync.mjs mark-applied  ← NEW
        │
        ▼
  Notion row updated
      (Application Status = "Applied", Applied = ☑)
```

## Hook points in Career-Ops

Two clean insertion points, both in the agent-facing `modes/` prompts (no core refactor needed):

1. **After evaluation** — at the end of `modes/oferta.md` (and `modes/auto-pipeline.md`), tell the agent to emit a JSON payload file and then run:

   ```bash
   node integrations/notion/sync.mjs upsert-eval --file <payload.json>
   ```

2. **After human application** — `modes/apply.md` instructs the agent to call:

   ```bash
   node integrations/notion/sync.mjs mark-applied --url <postingUrl> --status "Applied"
   ```

Both commands are idempotent and keyed on the posting URL (`Application Link`).

## Why a separate module

- Keeps upstream merges painless — all Notion code lives under `integrations/notion/`.
- Zero runtime dependencies beyond what Career-Ops already has (`dotenv` is already in `package.json`; native `fetch` is used for the Notion API).
- Works offline-safe — if `NOTION_TOKEN` / `NOTION_DATABASE_ID` are not set, the command fails fast without touching any other Career-Ops file.

## Next steps (not yet implemented)

- `modes/oferta.md` patch: emit the payload JSON next to the report and call `upsert-eval` automatically.
- `modes/apply.md` patch: call `mark-applied` after the user confirms submission.
- Optional: npm scripts `notion:upsert` / `notion:applied` in `package.json`.
