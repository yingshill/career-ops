# Competency Registry

Shared vocabulary of competencies. Each has a stable ID, referenced by domain files in `domains/`. The same competency may appear in multiple domains; **bullets are always domain-specific** (see each domain file).

| ID | Competency | Definition |
|----|------------|------------|
| C01 | Policy & Enforcement Frameworks | Scope, definitions, enforcement criteria, decision guidelines, write-up standards. |
| C02 | AI / ML Application | Applying LLMs/ML to a workflow: model-assisted ops, classifiers, GenAI pilots. |
| C03 | Evaluation, Quality & Metrics | Eval strategy, precision/recall/FPR, model coverage, feedback loops. |
| C04 | Operations & Workflow Automation | Workflow redesign, tooling consolidation, throughput/handle-time, automation. |
| C05 | Cross-Functional Program / Product Delivery | End-to-end delivery, agile + waterfall, UAT, launches, on-time execution. |
| C06 | Data, Reporting & Analytics | SQL, dashboards (Tableau/Power BI), KPI reporting, data-driven decisions. |
| C07 | Governance, Compliance & Data Integrity | Taxonomy/SSOT, data quality, drift monitoring, audits, compliance milestones. |
| C08 | Stakeholder, Vendor & Enablement | Cross-functional alignment, vendor/SLA management, training, adoption. |
| C09 | Requirements, Specs & Documentation | BRD/MRD, technical specs, backlog grooming, documentation. |
| C10 | Roadmap & Prioritization | Roadmapping, MoSCoW/trade-off prioritization, capacity planning. |
| C11 | Data Pipelines & Architecture | ETL/ELT, lakehouse/medallion, streaming, schema design (data-eng domains). |
| C12 | Cloud Infrastructure & Cost | Cloud platforms, IaC, cost optimization, reliability/uptime (data-eng domains). |
| C13 | AI / Automation Governance | Governing automated enforcement: HITL/HOTL/HOOL tiering, model risk (SR 11-7), auditability/lineage, rollback triggers, NIST AI RMF. |
| C14 | Incident Response & RCA | Detect → triage → contain → root-cause → durable fix; postmortems feeding policy/model/SOP (NIST CSF, ITIL, PDCA). |
| C15 | SOP & Decision-Framework Design | Decision trees, reviewer guidance, evidence-chain standards, disambiguation templates, calibration & enablement. |

## Domain × Competency coverage
✅ = domain has bullets for this competency · — = not used by that domain

| ID | Trust & Safety | AI Ops | Product Ops | Data Engineering | Data Analytics |
|----|:--:|:--:|:--:|:--:|:--:|
| C01 | ✅ | — | — | — | — |
| C02 | ✅ | ✅ | — | ✅ | (planned) |
| C03 | ✅ | ✅ | — | — | (planned) |
| C04 | ✅ | ✅ | ✅ | ✅ | — |
| C05 | ✅ | ✅ | ✅ | ✅ | — |
| C06 | ✅ | ✅ | ✅ | ✅ | (planned) |
| C07 | ✅ | — | — | ✅ | (planned) |
| C08 | ✅ | ✅ | ✅ | — | — |
| C09 | ✅ | — | ✅ | — | — |
| C10 | ✅ | ✅ | ✅ | — | — |
| C11 | — | — | — | ✅ | — |
| C12 | — | — | — | ✅ | — |
| C13 | (planned) | ✅ | — | — | — |
| C14 | (planned) | ✅ | — | — | — |
| C15 | ✅ | — | ✅ | — | — |

_Add new competencies here (next ID) before using them in a domain file._

**AI Ops** (`domains/ai-operations.md`, guide `guides/ai-operations.md`) and **Product Ops** (`domains/product-operations.md`, guide `guides/product-operations.md`) are **PM/Elena persona lenses** alongside Trust & Safety — the same underlying Moody's/Flip/LeanData work, re-framed. Bullets drawing on shared work are cross-marked `⇄` across domain files; **never use two lenses on one resume.**

**Risk Governance (Actor & Advertiser Integrity)** is a **specialization of the Trust & Safety domain** (same PM/Elena persona) focused on advertiser risk (fraud/ATO/impersonation/bad debt). Bullets live in `domains/risk-governance.md` (Moody's governance lens + Flip); guide `guides/risk-governance.md`; glossary `guides/risk-governance-glossary.md`. Emphasizes C01, C15, C13, C14, C03, C06. **Note:** its Moody's bullets use the *governance* lens — don't mix with `trust-safety.md`'s content-moderation lens on one resume.
