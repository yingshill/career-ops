# Domain Research: Risk Governance (Actor & Advertiser Integrity)

A **specialization of Trust & Safety** focused on **actor/advertiser risk** — fraud, account takeover (ATO), impersonation, bad debt, policy circumvention — and the **2nd-line-of-defense policy role** that governs it. Distinct from content moderation: you govern *who transacts*, not just *what's posted*.

Companion files: `risk-governance-glossary.md` (EN/中文 terms) · `trust-safety.md` (shared metrics/regulatory base) · role prep in `interview-prep/`.

_Last researched: 2026-05-26._

> **Rule:** vocabulary & frameworks, not data. Quantify bullets only with real numbers.

---

## 1. What this domain governs — the actor map
| Actor | Core risks | Governance mechanisms | Key metrics |
|-------|-----------|----------------------|-------------|
| Personal Users | Harmful content, privacy, minor safety | Community Guidelines, age verification, parental controls (DSA/COPPA) | Removal rate, appeal overturn, harm incidents |
| Creators | Policy violations, CIB, LIVE abuse | Strike system, monetization gates, auto+human review, Content ID | Violation rate, FP/FN on strikes, appeal volume |
| **Advertisers** ← focus | ATO, impersonation, bad debt, circumvention, fraudulent creative | Advertiser KYC, credit-risk scoring, pre/post-serve ad review, suspension+appeal, payment-fraud detection | False action rate, ATO incident rate, bad-debt $-exposure, catch rate pre- vs post-serve |
| Merchants (Shop) | Counterfeit/IP, fake reviews, order fraud | Merchant KYC, catalog review, seller trust scoring, disputes | Counterfeit removal rate, suspension rate, dispute SLA |
| Developers / API | Data misuse, scraping, API abuse | Rate limiting, ToS enforcement, app review, data audits | API abuse rate, ToS violation rate, audit findings |

## 2. Three-layer governance framework
| Layer | What | Lens | 中文 |
|-------|------|------|------|
| **A — Actor Lifecycle** | Onboarding → Monitoring → Enforcement → Appeal | **WHAT** you govern | 广告主生命周期（对象） |
| **B — Ops Stack** | Policy · SOP design · Process-health metrics · Feedback loops | **HOW** you govern | 运营能力栈（手段） |
| **C — 7-Step Process** | Detection → Triage → Evidence Chain → Decision → Action → Appeal → Postmortem | **WHEN** you govern (per incident) | 7步流程引擎（节奏） |

- **A↔C:** each lifecycle stage triggers runs of the 7-step engine (e.g., Onboarding: Detection→…→Action when KYC fails).
- **B→C:** the ops stack powers each step (Policy defines what to detect; SOP drives triage/evidence; Feedback loop turns appeals→retrain signal).
- **Feedback loop** is the learning mechanism: every postmortem → policy update → SOP revision → tighter next detection.

## 3. The 7-step process engine
Detection → Triage → Evidence Chain → Decision → Action → Appeal → Postmortem. Maps ~1:1 to **ITIL incident management**, plus two additions: an explicit **evidence-chain** step (audit-defensible) and a **postmortem** that feeds policy/model/SOP (closes ticket *and* upgrades the system).

## 4. Industry frameworks (speak the interviewer's language)
**Risk & compliance**
- **Three Lines Model (IIA)** — 1st line Ops (owns risk) · **2nd line Governance/Policy (this role)** · 3rd line Audit (assurance). Most interview-relevant: "I'm 2nd line — I define the standards 1st-line Ops executes and that 3rd-line Audit validates."
- **ISO 31000** — Identify → Assess → Treat → Monitor → Review.
- **NIST CSF** — Identify → Protect → Detect → Respond → Recover (USDS likely references given US pressure).
- **COSO ERM** — board-level "why governance exists" framing.

**AI / automation governance**
- **NIST AI RMF** — Govern → Map → Measure → Manage (governs automated enforcement).
- **EU AI Act risk tiers** — ads enforcement classifiers likely "High Risk" → human oversight + audit trails required.
- **HITL / HOTL / HOOL** — confidence-tiered enforcement: e.g., <0.75 = human-in-loop · 0.75–0.98 = human-on-loop review · >0.98 = human-out-of-loop auto-action.
- **SR 11-7** — model risk management (validation, monitoring, outcomes testing) — applies to ML risk-scoring.

**Operational excellence**
- **PDCA** — Plan→Do→Check→Act (postmortem → policy update → SOP revision → next cycle).
- **Six Sigma DMAIC** — Define→Measure→Analyze→Improve→Control (blind audit → confusion-matrix slicing → policy exception → System Health Report).
- **ITIL Incident Mgmt** — ~1:1 with the 7-step process.

**Top 3 to know cold:** Three Lines Model (role position) · NIST AI RMF (automated enforcement) · PDCA (continuous-improvement loop).

## 5. Advertiser-risk metrics (extends the T&S metrics menu)
False action rate · ATO incident rate · bad-debt $-exposure · catch rate pre-serve vs post-serve · KYC pass/fail rate · credit-risk score distribution · impression/click/attribution fraud rates (IVT) · appeal overturn rate. Plus the T&S **guardrail framework** (Leakage/Overkill/Appeals gate Automation coverage) from `trust-safety.md §5`. Slice by: risk type (ATO/impersonation/bad debt) · region (CN-side vs global) · advertiser tier · surface · model version.

## 6. Confidence-tiered enforcement (HITL → HOOL)
A reusable enforcement-design pattern: high-confidence → auto-action (HOOL); mid-confidence → AI-assisted human review (HOTL); low-confidence or P0 → human-only (HITL). Every automated action carries an **audit trail** (data state + timestamps + source) so it's defensible to DSA/FTC regulators. Add an **ambiguity gate**: cap AI confidence on "ambiguous/evolving" policy clauses to force human review.

## 7. Generic stakeholder map (where a 2nd-line governance role sits)
*(role-agnostic; the specific TikTok org chart lives in the interview-prep packet)*

**Upstream (producers feeding you):** Legal & Compliance (regulatory mandates) · ML/Algorithm teams (risk model outputs, FP/FN signals) · Data Infrastructure (behavioral logs, account history) · Regional Policy Research · Clients/Advertisers (escalations, clarification requests).

**Downstream (consumers of your standards):** Ops/Enforcement (execute your SOPs) · Product & Eng (build your evidence-chain standards into systems) · Exec/Comms (your postmortems → governance narratives) · Advertisers (receive policy guidance, appeal outcomes) · Regulators (your audit trails become compliance evidence).

## 8. Role archetypes → competency emphasis
| Archetype | Emphasize (see `../COMPETENCIES.md`) |
|-----------|-----------|
| Risk Governance Policy Specialist | C01, C15, C13, C14 |
| Risk Strategy Specialist (technical) | C02, C13, C03 |
| Risk Strategy & Ops Analyst | C06, C03, C04 |
| Head of Policy Development (senior) | C01, C05, C08, C10 |

## 9. ATS vocabulary
actor/advertiser risk, ATO, impersonation, bad debt, KYC/KYB, policy circumvention, evidence chain, decision tree, graduated enforcement, SOP, calibration, appeals, second line of defense, model risk, HITL/HOOL, audit trail/lineage, RCA, postmortem, NIST AI RMF, Three Lines Model, DSA, transparency report

## Sources
- DTSP / ISO/IEC 25389, regulatory landscape — see `trust-safety.md` sources
- IIA Three Lines Model · NIST AI RMF (AI 100-1) · NIST CSF · ISO 31000 · SR 11-7 (Fed/OCC) · ITIL · Six Sigma DMAIC · PDCA (Deming)
