# Resume Build Protocol

**Why this exists:** the first batch of generated resumes produced **0 interviews / 5 rejections**. These rules are deliberately strict. Follow every one on every generation. No shortcuts.

---

## Principle 0 — Source of truth = the user's real, defensible experience (NOT cv.md)
`cv.md` is **one improvable input, not the benchmark.** The single source of truth is the user's real experience — approximated by the full pool of material: `cv.md` + the bullet bank + `interview-prep/*` + the story bank + whatever the user tells you. **Compose and reframe freely across all of it; don't gate a bullet on "is this exact sentence in cv.md."** You may also improve cv.md itself.

The one hard rule: **the underlying accomplishment and every metric must be true and defensible by the user in an interview.** Improvise the *phrasing, framing, and emphasis* — never the fact or the number. When you genuinely can't tell whether a specific claim/metric is real (e.g. from an AI-rebuilt story bank), give the user a **fast yes/no** rather than silently dropping or inflating it. (See DECISIONS "Resume source of truth = the user's real+defensible experience.")

---

## The flow (per JD)
1. **User shares the JD.**
2. **AI classifies it** and states, before building:
   - **Domain** (e.g., Trust & Safety, Risk Governance, Data Engineering) — which `bullet-bank/domains/*` file
   - **Lens / framework** — for ambiguous personas, which framing (e.g., Moody's *governance* lens vs *content-moderation* lens). **One lens per resume — never mix** (see DECISIONS "Both real, different lenses").
   - **Competencies** — the 4–6 from `bullet-bank/COMPETENCIES.md` the JD emphasizes (use the guide's archetype→competency map).
3. **AI asks the user how to handle the job title** (Principle 3 — always ask; see below).
4. **AI selects bullets** from the chosen domain/competencies, calibrates each to the 2-line rule, assembles a resume spec, renders, and runs the validators.
5. **Baseline combo template:** after a few builds for a given **domain + lens**, save a reusable baseline spec at `resume-specs/{route}-{domain}-{lens}.baseline.json` (summary, skills, education, and the default bullet set). Future resumes for that combo start from the baseline + per-JD overrides — so we're not rebuilding from zero each time.

`resume-specs/` is gitignored (personal). The builder renders a spec → the original template's exact formatting.

---

## Principle 1 — JD → Domain + Lens + Competencies (state it first)
Never start assembling until the domain, lens, and competency set are named and (ideally) confirmed. This is what makes the resume *targeted* instead of generic — the likely cause of the 0-interview batch.

## Principle 2 — Every bullet fills a FULL 2 lines (Arial 10)
- Target: each experience bullet occupies **~2 complete lines** at **Arial 10pt** in the template's text column.
- **Reject:** 1-line bullets (too thin); bullets that wrap with only a few words on line 2 (orphan tail — "looks empty"); bullets spilling to 3 lines.
- Concrete target band (template geometry, ~6.7in bullet column): **~165–195 characters** per bullet; second wrapped line must be **≥50% full**.
- The builder's validator computes actual Arial widths and flags `SHORT` / `ORPHAN` / `OVERFLOW`. **All bullets must read `OK` before delivery.** Lengthen with real specifics (tools, metrics, scope) — never padding/filler.

## Principle 3 — Job title: always ask, align to baseline
- The job title is **modified per JD** to mirror the target role, **but** stays aligned with the baseline resume identity (don't fabricate seniority).
- **Always ask the user** how to handle the title for each generation — options typically: (a) mirror the JD title exactly, (b) keep the real title, (c) dual title "Real (JD-aligned)". Never auto-decide.
- Apply the chosen title consistently across the relevant roles + summary.

## Principle 4 — ATS-clean, every time
- Single-column, no tables/text-boxes/images/headers-footers for content; standard section headings (Experience, Education, Skills).
- ASCII only — no smart quotes, em/en dashes, or special glyphs in body text (the validator flags these; the renderer normalizes).
- Real, parseable dates; standard fonts (Arial/Calibri); no bullets-as-images.
- Mirror the JD's exact keywords/skill phrasing where truthful (use the domain guide's ATS vocab).
- Filename: `FirstLast_Role.docx`.

---

## Tightening checklist (gate before delivery)
- [ ] Domain + lens + competencies named (Principle 1)
- [ ] Job-title handling confirmed with user (Principle 3)
- [ ] Every bullet validator status = `OK` (2 full lines, no orphan/overflow) (Principle 2)
- [ ] ATS check passes (no special chars, single column, standard headings) (Principle 4)
- [ ] One lens only; bullets all from the chosen domain; every metric real + user-defensible (improvise phrasing, never the fact/number — Principle 0)
- [ ] Delivered as editable .docx (never PDF) for user review

## Enforcement
`build_pm_resume.py <spec.json> <out.docx>` renders the spec into the template and auto-runs `validate_bullets()` (Arial-10 2-line check) + `ats_check()`, printing a per-bullet report. Treat any non-`OK` bullet or ATS flag as a blocker.
