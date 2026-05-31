# Domain Research: Trust & Safety

A researched brief on the T&S field — frameworks, regulation, tooling, AI shifts — plus practical menus for tailoring resumes. Use it to select/frame bullets (`../domains/trust-safety.md`), mirror a JD's language, and speak credibly in interviews.

_Last researched: 2026-05-26._

> **Rule:** the menus are *vocabulary*, not data. Quantify bullets only with real numbers from `cv.md`. The guide tells you *which metric/term to name*, never *what number to claim*.

---

## 1. Industry frameworks & standards
- **DTSP (Digital Trust & Safety Partnership)** — the dominant industry framework. Best Practices organized around **five commitments: Product Development · Governance · Enforcement · Improvement · Transparency.** Good scaffolding for describing T&S work end to end.
- **DTSP "Safe Framework" → ISO/IEC 25389** — approved by national standards bodies in Jan 2025; the 2025 Best Practices were updated to align. Used for internal assessments → third-party assessments. Naming ISO/IEC 25389 or DTSP signals current domain fluency.
- Other reference points: TSPA (Trust & Safety Professional Association) for the profession; platform Transparency Reports as the public artifact of enforcement.

## 2. Regulatory landscape (2026) — a major hiring driver
- **EU Digital Services Act (DSA)** — enforcement ramping; 2026 focus heavily on **age assurance / age verification** (EU-wide age-verification app piloting in DK/FR/GR/IT/ES). VLOPs face systemic-risk assessment obligations.
- **UK Online Safety Act (OSA)** — in force Mar 2025; Ofcom stepping up enforcement, **80+ investigations** into adult sites and **first fines** (incl. £1M for inadequate age assurance) since July 2025.
- **US KOSA (Kids Online Safety Act)** — Senate passed 91-3; in House negotiations as of 2026. Would empower **FTC + state AGs**, civil penalties **$50K+/violation**. Mirrors UK/EU/Australia "duty of care" model.
- **Takeaway for tailoring:** youth-safety / age-assurance / regulatory-compliance roles are growing fast. If a JD references DSA/OSA/KOSA/COPPA/age assurance, surface governance (C07), policy (C01), and cross-functional-with-Legal (C08) bullets.

## 3. Tooling & vendor ecosystem
T&S is ~**$11B of the ~$300B** business-process-services market; heavy buy-vs-build with vendor stacks complementing in-house teams.
- **Cinder** — T&S operations platform "for the AI era" (case mgmt, workflow automation).
- **ActiveFence (rebranding as "Alice")** — safety/security layer; works with TikTok, Amazon, and major AI foundation-model makers (also moderating AI-generated content / model safety).
- **Checkstep** — AI moderation for user- *and* AI-generated content, with auditability/transparency reporting.
- **TrustLab** — founders from Google/Reddit/ByteDance; misinformation + regulatory (DSA/OSA) reporting.
- Others: Cove, Intrinsic, SeroAI, OpenWeb, Spectrum Labs.
- **Takeaway:** naming familiarity with case-management/workflow tooling (or vendor management — C08) reads well; vendor/BPO management is a common JD ask.

## 4. AI / GenAI shifts (what's changing now)
- **Synthetic-media risk** — deepfakes, AI scams, misinformation; moderation must detect GenAI-derived content and distinguish human vs machine-generated.
- **LLM guardrails** — bias/misinformation/hallucination mitigation; eval + red-teaming as core T&S work (maps to C02/C03).
- **Agentic moderation** — automation with **governance + human-in-the-loop**; 2026 consensus: don't ask one LLM to "be everything" in high-stakes safety — contain mistakes with HITL and clear ownership.
- **Takeaway:** the LLM-evaluation / model-assisted-moderation story (C02, C03) is increasingly central — lead with it for AI-leaning T&S roles.

---

## 5. Core operational metrics — the guardrail framework
*(reach for the JD's metric; phrase your real result in that vocabulary)*

In automation-heavy T&S ops, three **guardrails** (Leakage, Overkill, Appeals) gate how far you push **Automation coverage** — you raise coverage only while guardrails hold, and temporarily reduce it during incidents. SLA/TAT/AHT measure ops throughput; Latency/uptime measure tooling reliability.

**1. Leakage / FN rate · 漏检率**
- *Def:* % of violating content automation missed (false negatives). 自动化未识别出的违规内容占比（漏检/FN）。
- *Target:* P0 leakage ≤ baseline; return to baseline within **24–48h** after model changes. P0 类别漏检不高于基线；模型变更后 24–48h 回到基线。
- *Measure:* FN audit sampling + backtests, sliced by region/language/surface/policy tier/model version. 漏检抽检 + 回溯评估，分层监控。

**2. Overkill / FP rate · 误杀率**
- *Def:* % of non-violating content incorrectly actioned (false positives). 非违规内容被错误处理的占比（误杀/FP）。
- *Target:* Keep below X%; avoid spikes (> +Y% over baseline) after launches. 控制在 X% 以下；上线后避免异常波动。
- *Measure:* QA sample of actioned content + appeal overturn rate, sliced by creator tier/region/language/surface. 处理结果抽检 + 申诉撤销率。

**3. Appeal rate + overturn rate · 申诉率 + 撤销率**
- *Def:* % appealed, and % of appeals that reverse enforcement. 被申诉的比例，以及申诉后撤销处罚的比例。
- *Target:* Stable or down WoW; alert on spikes after launches. 周环比稳定或下降；上线后飙升要告警。
- *Measure:* Appeals-pipeline dashboards, by policy category/region/creator tier. 申诉链路看板分层。

**4. Automation coverage · 自动化覆盖率**
- *Def:* % of total volume resolved without human review (Tier-1 share). 无需人工审核完成处理的占比。
- *Target:* Increase **only while guardrails hold** (Leakage/Overkill/Appeals); reduce temporarily during incidents. 仅在护栏稳定时提升；事故期间可临时降覆盖。
- *Measure:* Routing logs + action-ladder breakdown (auto-action vs HITL). 路由日志 + 动作梯度拆解。

**5. SLA / TAT + AHT (ops) · 时效 + 人效**
- *Def:* SLA = % resolved within window; TAT = end-to-end turnaround; AHT = avg handling time/case. SLA=时限内完成比例；TAT=端到端时长；AHT=单案平均处理时长。
- *Target:* e.g. **95% within 24h**; reverse a **+18% AHT** spike within **48h** without increasing leakage. 24h 内完成 95%；48h 内消除 AHT+18% 回归且不增漏检。
- *Measure:* Queue dashboards + staffing forecast, sliced by region/surface/policy tier. 队列看板 + 人力预测。

**6. Latency / uptime (tooling) · 延迟 + 可用性**
- *Def:* Model/tool response time and availability. 模型/工具的响应延迟与可用性。
- *Target:* P99 latency < X ms; uptime 99.9%+. P99 延迟 < X ms；可用性 99.9%+。
- *Measure:* Service monitoring (SLO/SLA dashboards) + incident logs. 服务监控 + 事故记录。

**Slicing dimensions (apply to all):** region · language · surface · modality · policy tier · model version · creator tier. 分层维度：地区/语言/场景/模态/政策层级/模型版本/创作者层级。

### Broader metric vocabulary (supplementary, for breadth/ATS)
Precision · Recall · F1 · prevalence · proactive detection rate · time-to-detection/action · recidivism · violative impressions · QA/audit pass rate · calibration agreement · throughput · backlog age · cost per review · model coverage · language/market coverage · MTTD (mean time to detect) · MTTR (mean time to resolve).

## 6. Standard dashboards & artifacts

### Flagship: Exec "System Health" dashboard (text mock)
*(the synthesized leadership view; tiles roll up the per-metric dashboards below)*
```
┌ Tile 1 ─ Leakage vs baseline (24h, 7d) + alert band      → metric 1
├ Tile 2 ─ Overkill + overturn rate (by creator tier)      → metrics 2,3
├ Tile 3 ─ Automation coverage by policy tier (stacked)    → metric 4
├ Tile 4 ─ Ops throughput: queue volume, SLA, AHT + forecast → metric 5
├ Tile 5 ─ Top regression slices (region, language, modality)
└ Tile 6 ─ Incidents: MTTD, MTTR, open mitigations          → metric 6
```
Reads as a guardrails-first health check: are Leakage/Overkill/Appeals in band → is it safe to hold/raise automation coverage → is ops keeping SLA → where are the regressions → what's on fire.

### Per-metric dashboards
*(each guardrail/metric has a home dashboard)*
- **FN audit / backtest dashboard** — leakage by region/language/surface/policy tier/model version → metric 1
- **QA + appeals dashboard** — overkill, appeal & overturn rates by creator tier → metrics 2, 3
- **Routing / action-ladder dashboard** — automation coverage, auto-action vs HITL → metric 4
- **Queue + staffing-forecast dashboard** — SLA/TAT/AHT, backlog age → metric 5
- **SLO / SLA service-monitoring dashboard** — latency, uptime, incidents → metric 6
- **Safety Index / quality scorecard** — precision/recall/FPR by policy area
- **Enforcement funnel** — reports → review → action → appeal → overturn
- **Transparency report** — public-facing enforcement artifact (regulatory)

## 7. Role archetypes → competency emphasis
*(maps a JD to bullet-bank competencies — see `../COMPETENCIES.md`)*

| Archetype | Emphasize |
|-----------|-----------|
| Policy Ops / Enforcement | C01, C04, C09 |
| AI / Technical T&S PM | C02, C03, C05 |
| Content Moderation Operations | C04, C01, C08 |
| Governance / Integrity / Data | C07, C06 |
| Regulatory / Youth Safety | C01, C07, C08 |
| T&S Program / Product Manager | C05, C01, C02, C06 |

## 8. Common JD requirements (map your bullets against these)
- Policy / enforcement experience; SOP & guideline authoring
- Content moderation / escalation operations
- Metrics fluency (§5) + SQL / dashboards
- Cross-functional with Eng, Legal, Policy, Data Science
- Vendor / BPO / outsourced-moderation management
- AI/ML for safety — classifiers, LLM evaluation, red-teaming, human-in-the-loop
- Regulatory awareness — DSA, OSA, KOSA, COPPA, age assurance

## 9. ATS vocabulary
Trust & Safety, content moderation, policy enforcement, escalation, SOP, prevalence, proactive detection, appeals, integrity, abuse, fraud, responsible AI, classifier, human-in-the-loop, red-teaming, QA, calibration, transparency report, BPO/vendor ops, age assurance, DSA, Online Safety Act, KOSA, risk, governance

---

## Sources
- DTSP Best Practices & Safe Framework / ISO/IEC 25389 — [dtspartnership.org/best-practices](https://dtspartnership.org/best-practices/), [Safe Framework spec](https://dtspartnership.org/the-safe-framework-specification/)
- Vendor ecosystem — [TechPolicy.Press: Evolving T&S Vendor Ecosystem](https://www.techpolicy.press/the-evolving-trust-and-safety-vendor-ecosystem/), [Cinder](https://cinder.ai/)
- Regulation 2026 — [Taylor Wessing: Online safety in 2026](https://www.taylorwessing.com/en/interface/2025/predictions-2026/enhancement-and-enforcement), [Cooley: KOSA](https://www.cooley.com/news/insight/2026/2026-03-05-comprehensive-online-safety-legislation-comes-to-the-us-how-kosa-is-copying-uk-eu-and-australian-laws)
- AI/GenAI T&S — [Accenture: Trust & Safety Operations](https://www.accenture.com/us-en/services/managed-services/trust-safety)
