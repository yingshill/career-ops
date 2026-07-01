# Contractor Bulk-Apply Workflow

**You're in the workflow/playbook** — the repeatable procedure for bulk-applying to contract roles on contingent-workforce portals.

Connected docs:
- [Staffing outreach tracker](staffing-outreach.md) — the warm-rep + agency channel (parallel to this)
- [Applications tracker](applications.md) — where every application gets logged

Built 2026-06-30, distilled from the Meta CWX run (12 roles, 2 résumé batches). Provenance: workflow steps are **[verified]** from that live run; portal URLs are **[from staffing-outreach.md tracker]** and must be **verified-live on first visit** (portals change).

---

## 1. Where to run this — the portal map

The full, living portal list — status, registration, # applied, next action — is its own tracker: **[contractor-portal-map.md](contractor-portal-map.md)**. Open it, pick the next portal, run the steps below, then check it off.

In short: **TalentNet (by Magnit)** portals (Meta, Microsoft, Amazon, Wells Fargo, Boeing, Capgemini) share the exact Meta CWX UI, so this workflow applies 1:1; **Apple** uses willhire (similar UI). The staffing-agency channel is a separate motion — see [staffing-outreach.md](staffing-outreach.md).

---

## 1b. Three sourcing channels (run all three)

- **Channel 1 — Company contingent portals** (Meta/Microsoft/Amazon/Magnit). Self-serve. Pay tends to be **higher** (~$50/hr at Meta). Hit or miss on inventory depth (Meta rich; Microsoft/Magnit DS thin). Steps §2 below.
- **Channel 2 — Warm rep DMs.** A recruiter shops your profile across their reqs. Highest-leverage for warm vendors (Insight Global). See [staffing-outreach.md](staffing-outreach.md).
- **Channel 3 — Agency job boards (proactive sourcing).** Each staffing agency runs a **public, searchable job board** with live client reqs — apply directly. This is the **deepest volume** (Insight Global alone: 973 Data Analyst, 52 AML reqs). Pay varies a lot by niche — see the pay reality below.

**Channel 3 procedure** (same skeleton as §2, with differences):
1. **Scout first, no login needed** — the boards are public; search the niche, read the result list, gauge fit + **pay** before investing.
2. **Pay-scout is mandatory** — agency contract rates vary wildly: bigtech-adjacent data roles $42-53/hr, but AML/KYC ops and entry content-moderation run **$16-34/hr** (about half the Meta rate). Filter out the low-pay tail; don't apply on autopilot.
3. **Search the niche, not the keyword loosely** — e.g. "Trust and Safety" pulls in EHS/warehouse/campus-*safety* noise; the real T&S roles are "Content Moderation". Match by JD, not title.
4. **Apply uses your ONE profile résumé** (per agency) — Insight Global uploads one résumé under "My Resumes" and uses it for every apply; swap it to match the cluster.
5. **Warm boards = you may already be logged in** — Insight Global auto-recognized Elena (current consultant); apply uses the existing profile. On warm boards, consider Channel 2 (ping the rep with the shortlist) instead of cold-applying low-pay reqs.

Agency boards confirmed: **Insight Global** (`jobs.insightglobal.com` — warm, logged in) · TEKsystems · Apex · Robert Half (URLs in [staffing-outreach.md](staffing-outreach.md)).

---

## 2. The workflow — step by step

### Step 0 — Register (once per portal, human-only)
Sign up / SSO. **Login is always your step** — Claude cannot enter passwords or run SSO. Same for the **résumé upload** (native file dialog is human-only).

### Step 1 — Search & scope (Claude)
- Search each target title; **work the "All Jobs" section**, not "Job Matches" (Job Matches skews to already-applied / personalized).
- Bump rows-per-page to max; page through.
- **Match each role by location + tags + posted date, never title alone** — duplicate titles are everywhere (e.g., five "QA Analyst II" at one site).
- Output: a ranked, de-duplicated list, filtered to fit + viable location.

### Step 2 — Cluster by résumé route (Claude + you confirm)
Group similar roles so each cluster shares one tailored résumé. Don't blast one résumé across mismatched roles. Typical clusters → see §4.

### Step 3 — Résumé per cluster (Claude builds, you upload)
- Claude tailors a résumé via `build_pm_resume.py` (spec → ATS-clean .docx, 2-line bullet linter). Delivered as **editable .docx** in `output/`.
- **You upload it on the portal and set it as Default** (native dialog = your step), then say "done."
- ⚠️ Setting a new Default means **all subsequent quick-applies use it** until you switch back. Run one cluster per default.

### Step 4 — Apply (Claude, with a gate on the first)
- Two paths per role: **⚡ "Quick apply with default résumé"** (one click) or **"Apply"** (panel → pick résumé → APPLY).
- Claude verifies the Default résumé filename on the **first** apply of a batch, then drives the rest.
- **First submit of a new portal/résumé pauses for your OK** (each Apply is irreversible).

### Step 5 — Verify (Claude)
The card/button state is flaky (quick-apply sometimes hangs on "APPLYING…"). **Truth = the "Job Applications" / applied page.** Check it after each batch; retry any that didn't land via the full Apply flow.

### Step 6 — Log to the tracker (Claude)
- Write one TSV per role to `batch/tracker-additions/`, run `node merge-tracker.mjs --dry-run`, then the real merge, then `node verify-pipeline.mjs`.
- 🔴 **Dedup-bug watch:** `merge-tracker` fuzzy-matches roles sharing ≥2 words ≥4 chars within the same company (e.g., "Data Analyst" vs "Data **Labeling** Analyst"). It silently **skips** the collision. Always dry-run; hand-add any wrongly-skipped row (with a note) and re-verify. Short titles ("QA Analyst II") only share "analyst" → safe.
- Company string: use a consistent label like **"Meta (CWX)"**; score **N/A** for bulk applies (no A–F eval); pdf ❌; report `-`.

---

## 3. Human-only vs Claude-driven (the split)

| Human-only (you) | Claude-driven |
|---|---|
| Register / login / SSO | Search, scope, rank, cluster |
| Upload résumé + set Default (native dialog) | Tailor & build the résumé .docx |
| Approve the first irreversible submit | Fill forms, quick-apply, submit the rest |
| Final say on which résumé / which roles | Verify on applied page, log to tracker |

---

## 4. Résumé routes (which cluster gets which)

Reuse across portals — see [career-ops multi-route personas]. Four résumés now in `output/`:

- **QA / Trust & Safety** → `Yingshi_Liu_QA_Analyst.docx` (interview-proven; QA, T&S, AI-evaluator). Used for the Meta QA batch.
- **Data / technical** → `Yingshi_Liu_Data_Analyst.docx` (SQL/Python/dbt/Databricks/AWS; Data Analyst, Technical Analyst, BI). Used for the Meta data batch.
- **Trust & Safety / Integrity** → `Yingshi_Liu_Trust_Safety_Integrity.docx` (content moderation + fraud/risk monitoring + PRDs; integrity/community/anti-fraud roles). Used for the IG T&S applies (#130/131).
- **AML / KYC / Financial Crime** → `Yingshi_Liu_AML_KYC_FinancialCrime.docx` (AML/KYC, sanctions screening, CDD/EDD, FCRM). General financial-crime asset; **not** aimed at any one role.
- **On hold by default:** business-heavy roles (Business Analyst / HRIS / Workday), and PM/TPM (separate account `yingshill.fin`).

🔴 **One Moody's framing per target.** The QA/T&S/Integrity résumés frame Moody's as **content moderation / Safety OS**; the AML résumé frames the *same* role as **AML/sanctions/KYC screening** (her real domain). Both draw on real work, but **never put two framings of Moody's in front of the same employer/pipeline.** Pick the résumé whose Moody's framing matches the target, and keep it consistent. (Elena to confirm the AML framing is defensible before first use.)

---

## 5. Gotchas learned (Meta CWX run)
- Deep-linking to a job URL while logged-out bounces to `/auth` and can drop the session — navigate from the home page instead.
- Roles are W2 contracts via **third-party vendors** (e.g., Tundra Technical Solutions), typically **1-year, ~$50/hr**.
- Match Score on these portals reads low (often <60%) even for strong fits — don't over-weight it.
- Search results page sometimes hangs on a spinner — reset via `/jobs` then re-search.
- **Scout inventory before committing a portal.** Single-company pools vary hugely: Meta was rich (12 fits), Microsoft + Magnit DS were thin (1–2 fits, off-profile). Don't run a full setup before confirming there are fits.
- **Pay varies by niche, not just by portal.** On agency boards, data-analyst ~$42-53/hr but AML/KYC ops + entry content-moderation $16-34/hr. The well-paid AML-adjacent roles ($140-225k) are perm/senior, not contract. Scout pay before applying.
- Magnit Direct Sourcing's "600+ clients" is its client *base*, not visible postings (only ~8 of Magnit's own roles show). Cross-client pools don't surface client jobs directly.
