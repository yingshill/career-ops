# Routes — Multi-Persona Career Search

career-ops runs **one workflow** (oferta, ofertas, pdf, apply, scan, pipeline, …) over **multiple interchangeable routes**. Each route is a self-contained persona with its own identity, CV, and targeting. You pick an **active route**; every mode reads that route's files.

## What is a route vs. a variant

- A **route** = a distinct persona: different identity (name/email) **and** different base CV / career history.
- A different *job title* you target with the *same* résumé is a **tailoring variant**, handled per-JD by the workflow (archetype detection rewrites the summary and reorders bullets). It is **not** a new route.

> Example: "Trust & Safety PM" and "Product Operation PM" are the **same** route (same person, same CV — Elena), just tailored per posting. "Data Engineer" (Lydia) is a **separate** route (different identity + CV).

## Routes

| Route slug | Persona | Covers | Identity | CV source |
|------------|---------|--------|----------|-----------|
| `pm` | Elena | Trust & Safety PM, Product Operation PM, Program/Project Mgmt | Yingshi (Elena) Liu | `routes/pm/cv.md` |
| `data-engineer` | Lydia | Data Engineer | Lydia Liu | `routes/data-engineer/cv.md` |
| `data-analyst` | _(TBD)_ | Data Analyst | _(TBD)_ | `routes/data-analyst/cv.md` |

## Per-route files (the contract)

Each `routes/{slug}/` folder owns three user-layer files — never auto-updated:

| File | Owns |
|------|------|
| `cv.md` | The persona's canonical CV (markdown). |
| `profile.yml` | Identity (name, email, contact line), `target_roles`, `archetypes`, comp, location. |
| `_profile.md` | Narrative, adaptive framing, proof points, negotiation scripts for this persona. |

## How the active route works

`config/profile.yml` carries one pointer:

```yaml
active_route: pm   # one of: pm | data-engineer | data-analyst
```

**Rule for the agent:** at the start of any mode, read `config/profile.yml` → `active_route`, then load that route's `cv.md`, `profile.yml`, and `_profile.md` from `routes/{active_route}/` instead of the root copies. The root `cv.md` / `config/profile.yml` remain a mirror of the active route so legacy scripts keep working.

**Switching routes:** say "switch to the data-engineer route" (or any slug). The agent updates `active_route` and syncs the root mirror from `routes/{slug}/`.

## Resume rendering

Resumes are delivered as **editable .docx** (never PDF — the user reviews the .docx and exports PDF herself). Two renderers, pick by need:

| Tool | Use when | Output | Notes |
|------|----------|--------|-------|
| `build_pm_resume.py` | You want the **exact original Word template formatting** (fonts, spacing, bullet styles from `DE_Lydia_Liu_Milliman.docx`). Default for real applications. | ~11KB | Edits the real template in place via python-docx; too large for the Drive connector — **deliver locally** (user opens / drags to Drive). Content is currently inline (PM/Elena → Apple JD); edit the script to retarget. |
| `generate-docx.py` | You need a **small file the Drive connector can upload** (~5KB), or a quick "Classic ATS" layout from a resume JSON. | ~5KB | Minimal dependency-free OOXML. Harden with settings.xml + docProps (already built in) so Google Docs opens it. Reads a resume JSON (see `output/elena-pm-apple.json` for the schema). |

`templates/cv-template.html` holds the HTML version of the Classic ATS layout (used by the PDF path / `generate-pdf.mjs`, kept for compatibility). See memory `resume-output-docx` and `career-ops-drive-folders` for the delivery + Drive-upload constraints.

## Google Drive

Generated resumes are filed under **My Drive › Career-Ops Resumes › {route folder}** (account: yingshiliu.j@gmail.com). The Drive connector can create/upload but cannot rename/move/delete, so folder cleanup (renames, deletions) is done manually.

## Notes

- Personas are intentionally isolated — identity, history, and framing do not bleed across routes.
- Reports, tracker, and Notion sync stay shared across routes (one pipeline); each evaluation runs against the active route's persona.
- See `DECISIONS.md` for the rationale and the PM-merge follow-up.
