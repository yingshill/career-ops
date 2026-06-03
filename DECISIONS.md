# Decisions Log — career-ops (Yingshi Liu)

Append-only. Newest at top. See global instructions for format.

---

## New route: sa-fde (Solutions Architect / Forward Deployed Engineer), persona Iris Liu
**Date:** 2026-06-03
**Context:** User wants to pivot into Solutions Architect / Forward Deployed Engineer roles — the intersection of tech + sales/communication, which is her documented strength, and a structurally high-demand market (every company adopting AI needs people to deploy it). Her real history (LLM tools shipped to prod, ML classifiers, evaluation loops, AWS + Databricks certs, dbt/GCP stack, CS master's in progress, vendor/customer-facing work) genuinely supports it. Triggered while evaluating the free AWS Summit LA 2026 event, which flips from "skip" to relevant under this route.
**Options considered:** (1) Treat SA/FDE as a tailoring *variant* of the existing PM (Elena) route — same identity, reframed per JD. (2) Stand up a full new *route* with its own identity and base CV. On flavor: SA-lead vs FDE-lead vs blended. On identity: reuse Elena vs new persona name. On timing vs urgent contractor mode: alongside vs sequence-after vs new-primary.
**Decision:** New full **route `sa-fde`**, **blended SA+FDE** identity, **new distinct persona "Iris Liu"** (per user choice — mirrors the Elena/Lydia separate-identity pattern), running **alongside** the urgent contractor push (`active_route` stays `pm`; this is the longer-term FT pivot). Created `routes/sa-fde/{profile.yml,cv.md,_profile.md}` (same real history reframed toward customer-facing AI deployment), registered in `routes/README.md`, added slug to the `active_route` enum comments. Logged honest gaps in `_profile.md`: FDE live-coding bar (SA/SE is the faster entry), missing AWS Solutions Architect Associate cert (~$150, high-ROI action — not on CV until earned), and ops/analyst title history needing a bridge story. Non-frontier target list respects the avoid-frontier-labs note.
**Tradeoffs:** Gained: a high-demand route aligned to her real strength, reusing existing pipeline/tracker/renderers; clean isolation from the T&S/PM and DE tracks. Gave up: another identity + LinkedIn to maintain; **the persona email `irisliu.sa@gmail.com` is a PROPOSED placeholder — must be a real inbox she owns before this route sends any application** (flagged in profile.yml and to the user). FDE-lead roles require interview prep (DS&A + system design) not yet done. Did not switch the active route — near-term income priority (contractor) is unchanged.

## Resume source of truth = the user's real+defensible experience, not cv.md (cv.md is a living input)
**Date:** 2026-05-27
**Context:** A bullet audit anchored on cv.md flagged the entire `risk-governance.md` set as "unverified," because those (real) sanctions/governance accomplishments were never written into cv.md. The user clarified the Moody's sanctions work AND content-moderation work are both real — i.e. cv.md is incomplete, and treating it as the rigid single source of truth was the wrong frame.
**Options considered:** (a) keep cv.md as the strict SST and audit every bullet against its literal text; (b) treat cv.md as one improvable input and let the AI compose/reframe bullets across the full pool of real material (cv.md + story bank + interview-prep + what the user tells me), bounded only by truthfulness.
**Decision:** Adopt (b). The SST is the **user's real, defensible experience**, not the cv.md file. The AI may freely improvise/compose/reframe bullet *craft* (wording, framing, emphasis, which accomplishment to surface) and may improve cv.md itself. The one hard rule: every accomplishment and metric must be true and **defensible by the user in an interview** — improvise the phrasing, never the fact or the number. When genuinely unsure a specific claim/metric is real (e.g. from the AI-rebuilt story bank), give the user a fast yes/no rather than silently dropping or inflating it. Codified in `RESUME-BUILD-PROTOCOL.md`, the bullet-bank headers, and `modes/_profile.md`; supersedes the prior "all metrics real *from cv.md*" framing.
**Tradeoffs:** Gained: bullets draw on the user's full real history (not just what cv.md happened to capture), faster builds, cv.md becomes improvable. Gave up: the simple mechanical "does it match cv.md" fabrication check — replaced by a defensibility standard that depends on the user's attestation (the AI can no longer self-verify truth, only flag uncertainty). Mitigated by the yes/no-on-doubt rule.

## Expand Elena (PM) persona from T&S-only to 3 domains: + AI Operations + Product Operations
**Date:** 2026-05-27
**Context:** A 44→15 scan showed Trust & Safety alone is a narrow, partly-contracting funnel (several T&S orgs in the batch were in active layoffs). The user asked to expand to ~2 more high-demand domains. Key reframe: Elena's bullets are T&S-*framed*, but the underlying Moody's/Flip/LeanData work (LLM eval, tool consolidation, drift guardrails, launches) is really AI-ops and product-ops work pointed at T&S JDs.
**Options considered:** (a) AI Program/Operations; (b) AI Governance & Risk/Compliance (GRC); (c) Product Operations (general); (d) Strategy & Business Ops. Data Analytics/Engineering were excluded — they belong to the separate Lydia/data-analyst routes and would muddy Elena's identity.
**Decision:** Expand the Elena PM persona to **three domains/lenses**: Trust & Safety (existing) + **AI Program/Operations** (`ai-operations`) + **Product Operations** (`product-operations`). Built a generic guide + personal bullet file for each (keyed to existing competencies C02–C15 — no new competencies needed), updated the COMPETENCIES matrix (added AI Ops + Product Ops columns), and tightened `portals.yml` (added LLMOps/MLOps/AI Program/Platform Operations positives; added Software Engineer/ML Engineer/Data Scientist/Designer/Communications/etc. negatives to cut the bare-"AI" IC-noise that slipped through). **One lens per resume** — shared accomplishments are cross-marked `⇄` across domain files so they're never double-used.
**Tradeoffs:** Gained: ~3–4× the addressable role pool, all still genuinely supported by the real CV and on the AI/safety north star; reusable research. Gave up: more bullet-bank surface to maintain; per-JD builds now must first pick *which* of three lenses (added a step to the build protocol). Did NOT add GRC/Strategy-Ops (deferred) to avoid over-expanding in one pass.

## Tightened, spec-driven resume generation (after 0-interview batch)
**Date:** 2026-05-26
**Context:** The first batch of generated resumes yielded 0 interviews / 5 rejections. The user set four principles to make generation actually work.
**Decision:** Adopt `RESUME-BUILD-PROTOCOL.md` and make `build_pm_resume.py` spec-driven with built-in validators. Principles: (1) every build starts by naming domain + lens + competencies from the JD, and saves a reusable `domain+lens` baseline spec after a few builds; (2) every experience bullet must fill ~2 full lines at Arial 10 (no 1-liners, orphan tails, or 3-line overflow) — enforced by an Arial-width estimator (`bullet_status`); (3) job titles are modified per JD but the user is **always asked** how to handle them; (4) ATS-clean body text, enforced by `ats_flags`. The builder renders a JSON spec into the original template's exact formatting and prints a per-bullet validation report; any non-`OK` bullet or ATS flag blocks delivery.
**Tradeoffs:** Gained: targeted, full-looking, ATS-safe resumes with an automated quality gate; reusable baselines. Gave up: more up-front structure per build (spec authoring + passing the gate) vs. quick one-offs — which is the point.

## Composable bullet-bank architecture (domain → competency → bullet, + guides + interview-prep)
**Date:** 2026-05-26
**Context:** Tailoring resumes per role needed reusable, recombinable building blocks rather than one-off rewrites, plus a place for researched domain knowledge and role-specific interview prep — without mixing generic field knowledge with personal data.
**Options considered:** (a) per-role resume files; (b) a flat bullet list; (c) a three-layer composable system.
**Decision:** `bullet-bank/` with three layers — a shared **competency registry** (C01–C15), per-**domain bullet files** (personal, gitignored) keyed by competency, and per-domain **research guides** (generic, tracked: metrics, frameworks, regulation, tooling). Competencies are shared across domains; bullets are always domain-unique. Role-specific interview prep lives in `interview-prep/` (gitignored). Risk Governance (actor/advertiser integrity) is modeled as a **specialization of the Trust & Safety domain** (same Elena persona), not a separate route.
**Tradeoffs:** Gained: combinatorial tailoring, clean generic/personal split for git, reusable research. Gave up: more files to maintain; the bank is not yet wired into the resume builder (manual selection for now).

## Dual resume renderer; deliver from the original Word template
**Date:** 2026-05-26
**Context:** The minimal-OOXML renderer (`generate-docx.py`) produced a flat, generated-looking layout the user rejected ("really bad"); she wanted the exact look of her existing template (`DE_Lydia_Liu_Milliman.docx`) with real PM content (real titles, original cv.md bullets) plus JD keywords — not rewritten/inflated bullets or retitled roles.
**Options considered:** (a) keep improving the minimal renderer; (b) edit the original template docx in place to swap content while preserving its formatting; (c) maintain both.
**Decision:** Keep **both renderers** for different needs. `build_pm_resume.py` edits the original template in place (python-docx) to preserve exact formatting — the default for real applications, delivered **locally** because its ~11KB size (theme/numbering/styles) exceeds what the Drive connector can reliably accept via inline base64 (~7-8KB ceiling). `generate-docx.py` stays for cases needing a small, Drive-uploadable file. Resume content uses **real titles and original bullets** + JD keywords layered into Overview/Skills — no title inflation.
**Tradeoffs:** Gained: template-faithful output the user trusts, honest titles, and a fallback small renderer. Gave up: a single code path; template-based files can't be auto-uploaded to Drive (manual drag), and `build_pm_resume.py` content is currently inline rather than parameterized.

## Merge Trust & Safety PM and Product Operation PM into one PM route
**Date:** 2026-05-23
**Context:** The multi-route setup initially had separate `ts-pm` and `product-ops-pm` routes. But both draw on the same person (Elena, same email) and the same underlying CV (Product Operations Specialist at Moody's, T&S infra at Flip/LeanData, IT PM at Modis). They differ only in emphasis, which the per-JD tailoring already handles.
**Options considered:** (a) keep two separate PM routes/personas; (b) merge into one PM route and tailor per posting.
**Decision:** Merge into a single `pm` route (Elena). Renamed `routes/ts-pm` → `routes/pm`, removed `routes/product-ops-pm`, set `active_route: pm`. Three routes total now: `pm`, `data-engineer`, `data-analyst`. Defined the route-vs-variant principle in `routes/README.md`: a route = distinct identity + base CV; a job-title emphasis = a tailoring variant.
**Tradeoffs:** Gained: no duplicate near-identical personas to keep in sync, simpler structure. Gave up: separate base resumes for the two PM framings (now produced by tailoring one CV per JD). Google Drive folders "Trust & Safety PM (Elena)" and "Product Operation PM" remain until manually renamed/deleted — the Drive connector cannot rename or delete.

## Resume delivery format → editable .docx via minimal OOXML
**Date:** 2026-05-23
**Context:** User requires resumes as editable .docx (reviews, then exports PDF herself), and the docx must not have messy formatting. First implementation used python-docx (~39KB output), which was too large to upload reliably through the Drive connector's inline base64.
**Options considered:** (a) python-docx; (b) pandoc; (c) hand-built minimal OOXML.
**Decision:** Rewrote `generate-docx.py` to emit minimal, dependency-free OOXML (~4KB) in the Classic ATS layout. Removes the python-docx dependency and keeps files small enough for connector uploads. Verified valid (python-docx reads it; byte-exact Drive round-trip).
**Tradeoffs:** Gained: tiny files, no dependency, reliable upload. Gave up: python-docx's convenience helpers; bullets use a "• " text prefix with hanging indent rather than Word list numbering (ATS-clean, editable).

## Multi-route persona architecture
**Date:** 2026-05-21
**Context:** Yingshi runs more than one parallel job search under different professional identities (e.g., Elena = Trust & Safety PM, Lydia = Data Engineer). The system only supported a single user layer (`cv.md`, `config/profile.yml`, `modes/_profile.md`), forcing one persona at a time and risking cross-contamination between tracks.
**Options considered:**
1. Separate git branches per persona — heavy, breaks shared pipeline (tracker/reports).
2. Separate clones of career-ops per persona — duplicates the whole system, hard to update.
3. `routes/{slug}/` folders inside one repo, with an `active_route` pointer and a root mirror. — chosen.
**Decision:** Introduce `routes/` with one folder per persona, each owning `cv.md`, `profile.yml`, `_profile.md` (all user-layer, never auto-updated). `config/profile.yml` carries `active_route`; the agent loads the active route's files and keeps the root `cv.md`/`profile.yml` as a mirror so legacy scripts keep working. Four routes: `ts-pm` (Elena, kept as-is), `data-engineer` (Lydia, redo persona), `data-analyst` (new), `product-ops-pm` (new). Identities are **separate per route** (own name + email). New-route CVs built from scratch.
**Tradeoffs:** Gained: clean isolation between tracks, one shared pipeline (tracker/reports/Notion), cheap route switching, update-safe. Gave up: some duplication of profile structure across routes; the agent must remember to resolve `active_route` at the start of every mode (documented in `routes/README.md`).

## Default resume template → classic ATS layout
**Date:** 2026-05-21
**Context:** User supplied `DE_Lydia_Liu_Milliman.docx` and asked to use its layout as the default resume format. The prior `cv-template.html` was a designed style (Space Grotesk + DM Sans, gradient, color accents, skill pills, separate Projects section).
**Options considered:** (a) keep designed template, (b) adopt the docx's plain ATS layout as default, (c) keep both.
**Decision:** Replace `templates/cv-template.html` with a classic ATS layout matching the docx: centered name + pipe-separated contact line, bold uppercase section headers with a bottom rule, OVERVIEW paragraph, categorized CORE SKILLS lines, EXPERIENCE rows (`Title···Dates` / `Company···Location`) with bullets, and a combined CERTIFICATION & EDUCATION section. Kept bundled DM Sans for clean rendering; dropped color/gradient/pills.
**Tradeoffs:** Gained: cleaner ATS parsing, matches the user's preferred format, applies to all routes. Gave up: the more distinctive branded visual identity of the prior template (`generate-pdf.mjs` is unaffected — it never parsed the CV; the agent fills the template tokens at generation time).
