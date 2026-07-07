# Bullet Bank — Composable Resume Bullets

A three-level system for assembling tailored resumes:

```
DOMAIN  →  COMPETENCY  →  BULLET POINTS
(field)    (skill area)    (1 real accomplishment, 1 framing)
```

- **Domain** = a professional field grounded in one persona's real history (e.g., Trust & Safety = PM/Elena; Data Engineering = DE/Lydia). A domain lists the competencies it covers.
- **Competency** = a named skill area drawn from the shared registry in [COMPETENCIES.md](COMPETENCIES.md). The **same competency can appear in many domains** (e.g., "Data & Reporting" is in both T&S and Data Engineering).
- **Bullet point** = one accomplishment in one framing. **Every bullet is unique to its domain** — even when two domains share a competency, their bullets are different (because they come from different real work).

## How the AI composes a resume
1. Read the target JD; map it to a **domain** (which persona/route applies) — see `routes/README.md`.
2. Select the **competencies** the JD emphasizes (3–6).
3. Pull bullets from those competencies; **one framing per accomplishment per resume** (see the source tags / cross-refs in each domain file — never put two framings of the same underlying work on one resume).
4. Order bullets under the real job where the work happened; mirror the JD's wording lightly.

Because competencies × bullets are modular, the same domain yields many different resumes depending on which competencies and bullets are chosen.

## Files
- `COMPETENCIES.md` — shared competency registry (IDs + definitions + domain coverage matrix). Generic vocabulary; tracked in git.
- `guides/{domain}.md` — **domain research brief**: frameworks, regulation, tooling, AI trends, metrics menu, dashboards, role archetypes→competencies, JD checklist, ATS vocab. Generic field knowledge (the "question set"); tracked in git. Informs *how* to select/frame bullets.
- `domains/{domain}.md` — per-domain bullets keyed by competency ID (the "answers"). **Personal data (real accomplishments) — gitignored.**

The guide is field knowledge; the domain file is your work. Read the guide to pick competencies + metric language for a JD, then pull bullets from the domain file.

## Domains
| Domain | Source persona / route | Status |
|--------|------------------------|--------|
| Trust & Safety | PM / Elena (`routes/pm`) | bullets + guide |
| Risk Governance (Actor/Advertiser Integrity) | PM / Elena (T&S specialization) | bullets + guide + glossary + interview prep |
| Data Engineering | DE / Lydia (`routes/data-engineer`) | bullets |
| Data Analytics | Data Analyst (`routes/data-analyst`) | planned |
| Product Operations | PM / Elena | planned (overlaps T&S) |

Guides present: `trust-safety.md`, `risk-governance.md`, `risk-governance-glossary.md`. Role interview packets live in `interview-prep/` (gitignored).
