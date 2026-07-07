# Roadmap — career-ops (Yingshi Liu)

_Last updated: 2026-06-03_

## Done
- **Events arc** (networking, 2026-05-29→31): `modes/events.md` (scan Luma/Eventbrite/Meetup for free/≤$50 Bay Area workshops + meetups), `sync-events-calendar.mjs` (Google Calendar sync), `data/events-pipeline.md` tracker, per-event prep notes in `data/events/` (personal, gitignored). Wired into `SKILL.md` as `/career-ops events`. First event attended: Agent Campus / FounderGro @ TikTok SJ (2026-06-07) — warm-channel founder prep captured (Clawvard, AdalFlow, Heji, Infron, Rena Labs).
- **Scanner location filter**: `scan.mjs` gained `buildLocationFilter` (config `location_filter.allowed`; remote/blank always pass) — supports the contractor/local URGENT focus.
- **Multi-route architecture** (`routes/` + `active_route`): `pm` (Elena, active, complete), `sa-fde` (Iris, Solutions Architect / Forward Deployed Engineer — full profile + CV + _profile, 2026-06-03), `data-engineer` (Lydia, CV only), `data-analyst` (empty).
- **Resume system**: Classic ATS layout; two renderers — `build_pm_resume.py` (exact original-template formatting, local delivery) and `generate-docx.py` (small uploadable minimal-OOXML). Delivery = editable .docx, never PDF.
- **Bullet-bank system** (`bullet-bank/`): three layers —
  - `COMPETENCIES.md` registry (C01–C15) + domain×competency matrix (cols: T&S, AI Ops, Product Ops, Data Eng, Data Analytics)
  - `guides/` domain research (tracked): `trust-safety.md`, `risk-governance.md`, `risk-governance-glossary.md` (EN/中文), **`ai-operations.md`**, **`product-operations.md`**
  - `domains/` bullets (gitignored): `trust-safety.md`, **`ai-operations.md`**, **`product-operations.md`**, `risk-governance.md` (Elena); `data-engineering.md` (Lydia)
- **Elena persona expanded to 3 lenses** (2026-05-27): Trust & Safety + AI Program/Operations + Product Operations — same real CV, re-framed; one lens per resume (`⇄` cross-marks shared work). `portals.yml` filters tightened to match.
- **Risk Governance** captured as a T&S specialization: reusable guide + glossary + competencies C13–C15.
- **Interview prep**: `interview-prep/tiktok-risk-governance-policy-specialist.md` (org structure, 4 pillars, scripts EN/中文, 8 cases, market intel) — gitignored.
- **Applications**: #86 Apple/TSG (Applied), #87 BFC (Applied). Pipeline health 🟢.
- **PM-route scan + pipeline (2026-05-27)**: scanned 44 → triaged 15 → evaluated (reports 088–102). Apply tier (≥4.2): Reddit AI Enforcement Analyst (4.7), Pinterest T&S Tools PM (4.6), Twitch Legal PM (4.3), Airbnb BizOps Lead Cities (4.2). First baseline resume built: **Reddit AI Enforcement Analyst** (`resume-specs/reddit-ai-enforcement-analyst.json` → `output/Elena_AI_Enforcement_Analyst_Reddit.docx`), enforcement-quality lens, analyst titles, 15/15 bullets pass 2-line + ATS gates.
- Security/hygiene: gitignored `credentials/`, `routes/**` data, `reports/*.notion.json`, `bullet-bank/domains/`, `interview-prep/`.

## Active — RESUME BUILD ARC
- ✅ **Risk Governance bullets** built (`domains/risk-governance.md`, C01/C15/C13/C14/C03/C06).
- ✅ **Builder wired** (`build_pm_resume.py` is spec-driven: JSON spec → template formatting) + **validators** (Arial-10 2-line check + ATS) + **`RESUME-BUILD-PROTOCOL.md`** (the 4 tightened principles). Tested end-to-end.
- **Next:** run the per-JD flow — JD → state domain/lens/competencies → ask job-title handling → assemble spec (every bullet must pass the 2-line validator) → render → review. Build the TikTok Risk Governance resume as the first real one.
- **Baseline combo templates:** save `resume-specs/{route}-{domain}-{lens}.baseline.json` after a few builds per combo.
- **Moody's framing** ⚠️: both lenses kept; one lens per resume (governance bullets ≠ content-mod bullets on the same resume).

## Backlog
- Generalize `build_pm_resume.py` (read content from route `cv.md` + JD keyword/competency selection).
- Define Data Engineer persona (`profile.yml` + `_profile.md`) and Data Analyst route (from scratch).
- Add `portfolio_url` to profile once provided; wire into outreach.
- Data Analytics / Product Ops domain guides + bullets.

### sa-fde route (new, 2026-06-03 — runs alongside; contractor stays primary)
- ⚠️ **Real email for Iris** — `irisliu.sa@gmail.com` is a placeholder; confirm/replace before this route applies anywhere. Add the SA/FDE LinkedIn URL too.
- **AWS Solutions Architect Associate (SAA) cert** — ~$150, ~3–4 wks; frequent SA gate, high ROI. Not on CV until earned.
- **FDE interview prep** — DS&A + system design — required before targeting FDE-lead roles. SA/SE roles are the faster, lower-coding entry.
- **SA/FDE bullet-bank domain** — add `guides/` + `domains/` files (solution design, deployment, technical translation) reusing competencies where possible.
- **`portals.yml` queries** — add SA/FDE/SE/Customer-Engineer positives + a non-frontier company set (Databricks, Snowflake, dbt Labs, Retool, Vercel, Glean, etc.) for when this route activates.
- **Portfolio artifact** — a public "deploy an LLM/agent to a real workflow" POC-to-prod demo (the strongest SA/FDE proof point).

## Repo hygiene (2026-05-31 audit)
- **Branch mismatch:** on `feature/notion-job-tracker`, but the Notion feature is already merged in history; current WIP is the Resume + Events arcs. Land WIP and cut a correctly-named branch (or rename), don't keep piling unrelated arcs on this branch.
- **Never-committed meta-docs:** `ROADMAP.md`, `DECISIONS.md`, `RESUME-BUILD-PROTOCOL.md` are untracked — they exist only on disk. Commit them.
- **Fixed:** `data/events/` + `data/events-pipeline.md` were not gitignored (personal networking prep — contacts, scripts); added to `.gitignore` so they can't be staged. Never committed, so nothing leaked.

## Bugs / cleanup
- **`merge-tracker.mjs` fuzzy dedup** over-merges distinct same-company roles (clobbered 4 rows + skipped 2 on the 2026-05-27 batch; repaired by hand). Fix: dedup on job-ID/URL, not fuzzy title. verify-pipeline doesn't catch this.
- Resume contact email mismatch: `cv.md` uses `yingshill.fin@gmail.com`, `config/profile.yml` uses `elenaliu.de@gmail.com`. Reddit resume used the cv.md address — confirm which is canonical before sending.

## Manual (connector can't do)
- Google Drive: delete broken duplicate uploads in PM (Elena) folder (`Elena_Liu_PM_Apple_Deployment_Tools` v1/v2/v3); rename folder → "PM (Elena)"; delete empty "Product Operation PM" folder.

## Open questions
- Resume-build direction (see "Active" — confirming now).
- Portfolio URL; Data Analyst identity + real history.
