# Domain Research: Trust & Safety

A researched brief on the T&S field — frameworks, regulation, tooling, AI shifts — plus practical menus for tailoring resumes. Use it to select/frame bullets (`../domains/trust-safety.md`), mirror a JD's language, and speak credibly in interviews.

_Last researched: 2026-05-26. Updated 2026-06-15 — added §10 incident response, §11 abuse/fraud taxonomy, §12 cross-cultural ops. Updated 2026-06-22 — added §13 operational reality (✅ practitioner-confirmed; the recsys/ranking layer public sources miss)._

> **Reusable across any social-media / UGC platform** — TikTok, Instagram, RedNote/Xiaohongshu, YouTube, Reddit, Snap, etc. The company-specific layer (résumé fusion, comp, facts) lives in each interview run-sheet; this guide is the shared domain knowledge.
>
> 📂 **Where this sits:** the shared **domain primer (Bucket B)**.
> - Per-company run-sheets in `interview-prep/{company}-{role}/` link here for depth.
> - Companion: [Elena's T&S bullets (Bucket A)](../domains/trust-safety.md).
> - Architecture: project `CLAUDE.md` → "Interview Prep — Knowledge Architecture".

> **Rule:** the menus are *vocabulary*, not data. Quantify bullets only with real numbers from `cv.md`. The guide tells you *which metric/term to name*, never *what number to claim*.

---

> **🏷 Provenance(本指南 — 往期 web 研究 + 一次从业者访谈的综合):**
> - 大部分领域通识 = **[public]**。
> - 🔴 **§2 法规的具体数字/日期/罚款/投票数**(DSA 试点国、OSA「80+ 调查 / £1M 罚款」、KOSA「91-3」「$50K/violation」「Senate passed」)、**§3 市场规模($11B / $300B)与厂商动态**(ActiveFence 改名 Alice、TrustLab 创始人背景等)= **[VERIFY — 具体数字,往期研究,本次未重核,会过时]**。面试别当确定事实背诵;要引用先重核。
> - **§13 运营实况** = **[verified — 从业者确认]**(TikTok content-ecosystem ops PM 访谈,见 Sources)。
> - **[R-meta]** Meta prevalence 方法 = **[verified]**(2026-06-22 核实,真实链接见 Sources)。
> - 🔴 **底部 Sources 链接除 [R-meta] 外,本次均未逐一重核** —— 引用前请点开确认仍可达、内容确实支持该 claim(防止失效/不准的链接)。

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

### Which metric measures which layer (don't conflate them) / 哪个指标在量哪一层
Risk/safety ops almost always has **three layers**, and a strong operator is precise about which metric belongs to which — conflating them is a tell. 风控/安全运营几乎都有**三层**，强运营会说清每个指标量的是哪一层：
- **Automated-detection layer (the "AI")** → **precision · recall · automation coverage · the PR operating point.** This layer can be a content **classifier/MLLM** (social platforms) **or** an **entity-matching + alert-scoring pipeline** (financial-crime screening — e.g. Moody's **Orbis**: entity resolution → screen vs. watchlists/adverse media → an ML model **scores each alert's match-confidence/relevance** for the reviewer). In both, the "AI" **triages/prioritizes for a human — it does not auto-decide** the high-stakes call. ｜自动检测层（即「AI」）：精确率·召回率·自动化覆盖·精召工作点。它可以是内容分类器/MLLM，也可以是实体匹配+告警打分流水线（金融犯罪筛查，如 Moody's Orbis：实体解析→对名单/不良媒体筛查→ML 给每条告警打**匹配置信度/相关性**给复审员）。两种情况里，「AI」都是**给人分诊/排序，不自动拍板**。
- **Human-review queue layer** → **SLA · TAT · AHT · backlog age · reviewer consistency (IAA / disposition adherence).** ｜人工复审队列层：SLA·处理时长·平均处理时长·积压时长·复审一致性（IAA/处置一致）。
- **System-outcome / guardrail layer** → **leakage (FN that escaped) · overkill (FP actioned) · appeal-overturn · prevalence.** ｜系统结果/护栏层：漏放·误杀·申诉改判·prevalence。

**Precision vs. FP rate — the difference is the denominator / 精确率 vs 误报率——区别在分母:**
- **Precision = TP/(TP+FP)** — of what you **flagged**, how much was real. *"When I act, how often am I right?"* ｜精确率：你**标记**的里有多少是真的。
- **FP rate = FP/(FP+TN)** — of all the **truly-clean** population, how much you wrongly flagged. ｜误报率：所有**真正干净**的里你错标了多少。
- 🔴 **At low prevalence (rare true hits — sanctions screening, content violations), FP rate can be tiny while precision is terrible**, because a small FP rate over a huge clean population produces FPs that swamp the few true positives. So you optimize **precision** (and corroborating signals), not FP rate alone. *(This is the "name-only false-positive flood" in screening, and the "precision is the hard one" rule on social platforms.)* ｜**低流行率下**（真命中稀少——制裁筛查、内容违规），误报率可以很小但精确率很烂，因为干净样本基数巨大、误报淹没了少量真命中；所以要优化**精确率**+佐证信号，而不是只看误报率。

### Setting a baseline ("water-level") — measurement methodology
*(many targets above are stated "≤ baseline" / "over baseline" — this is how you establish that baseline. Principle: you don't guess a baseline, you measure it. 基线不是拍脑袋，是测出来的。)*

1. **Define the metric operationally first** — numerator/denominator, policy scope, time window. 先把指标可测地定义：分子/分母、口径、时间窗。
2. **Measure by sampling + human labeling, not guessing.** For a prevalence-type metric, draw an **impression-weighted random sample of content *views***, human-label against policy, infer the proportion; sample across languages for a representative global figure. 用**按曝光加权**的随机抽样 + 人工标注推算占比，并跨语言抽样。 ✅ *This is Meta's published prevalence method (sampled views → reviewed → ratio) [R-meta].*
3. **Build it per slice, as a range — not a single point.** Establish mean + normal variance + seasonality (weekday/weekend, holidays) for each region/language/surface/policy tier; an aggregate baseline hides slice-level problems. 分片建，建带季节性的「正常范围」，而非一个总数。
4. **Separate a real level-change from a measurement/detection-change** (the most important step). ✅ *Meta states that improving label training **raised measured prevalence without any real increase in violating content** [R-meta]* — so a baseline shift can be a detection / policy / logging artifact, not real harm. This is the live-case "is it a real rise or a detection change?" instinct. 区分真实水位变化 vs 检测/口径/日志变化。
5. **Set control limits → turn the baseline into an alarm.** Mean ± N·σ (statistical process control) or a %-change threshold, tuned for false-alarm vs. miss. 用控制线（均值 ± Nσ）或变化%阈值把基线变成告警，权衡误报/漏报。 *(SPC = standard statistics, not a T&S-specific source.)*
6. **Back-test + re-baseline.** Validate the baseline + threshold against known past incidents; re-establish after any policy / model / market change. ✅ *Meta: enforcement & measurement methods are updated regularly, which affects historical comparisons [R-meta].* 回测验证 + 结构性变更后重建。

**Pitfalls / 常见错误:** raw counts instead of rates (volume growth ≠ a real rise) · one global number · a biased sample · mistaking better detection for a real spike · never refreshing. 用条数不用率 · 只看总数 · 样本有偏 · 把检测变强当真涨 · 从不更新。

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
Trust & Safety, content moderation, policy enforcement, escalation, SOP, prevalence, proactive detection, appeals, integrity, abuse, fraud, responsible AI, classifier, human-in-the-loop, red-teaming, QA, calibration, transparency report, BPO/vendor ops, age assurance, DSA, Online Safety Act, KOSA, risk, governance, incident response, early-warning, severity tiers, coordinated inauthentic behavior, fake engagement, scam, counterfeit, account takeover

---

## 10. Incident response & early-warning operations
*(The core of "safety operations / safety strategy" roles — the JD line "monitor platform risks + establish early-warning mechanisms for timely detection and response to critical incidents." Most ops/strategy T&S roles own this. Speak it fluently.)*

**Severity tiers** (define by **harm severity × reach × velocity**):
- **P0** — imminent real-world harm, legal-mandated, or viral: CSAM, credible threat to life, terrorism/violent-extremism going viral, active platform-wide exploit. Drop-everything, exec + Legal + PR looped, clock running.
- **P1** — serious harm spreading fast but contained to a surface/region; coordinated attack; regulator-visible.
- **P2** — meaningful but bounded; handle in normal ops with priority.
- **P3** — minor / low-reach; routine queue.

**Early-warning mechanisms** (detect *before* it blows up): anomaly detection on report-volume / prevalence spikes · trending-content + virality monitoring · keyword + perceptual-hash watchlists (e.g. CSAM hash-matching, known-violent-media) · external signals (news, regulator notices, press, X/Reddit chatter) · trusted-flagger / NGO / law-enforcement tips · red-team & threat-intel feeds.

**Incident lifecycle:** Detect → **Triage (assign severity)** → **Contain** (stop the spread) → Investigate / root-cause → Resolve / remediate → **Blameless postmortem** → Prevent (feed the pattern back into detection so MTTD drops next time).

**Containment levers** (act *without* over-enforcing platform-wide): downrank / limit distribution · interstitials & labels · temporarily lower automation thresholds on the affected slice · freeze a feature or surface · mass-action a verified cluster · geofence · hash-block. The art is containing the bleed while keeping overkill on good content low.

**Roles & cadence:** incident commander · on-call rotation · war room / bridge · comms owner (PR/Legal/Policy) · status updates on a fixed cadence. **Metrics:** MTTD, MTTR, time-to-contain, incident recurrence rate.

## 11. Platform abuse & fraud taxonomy (social media)
*(The JD's "content safety risks, fraudulent tactics, and abuse patterns." Know the categories, the detection signals, and the 中文 term — useful at China-origin platforms. This is the "fraudulent activities" half that pure content-policy candidates miss.)*

| Category | What it is (例) | Key detection signals |
|---|---|---|
| **Account integrity** | Fake accounts, bots, **Coordinated Inauthentic Behavior (CIB)** / sybil networks, **Account Takeover (ATO)** · 虚假账号 / 水军 / 盗号 | Registration velocity, device/IP clustering, behavioral similarity, sudden login-geo/device change (ATO) |
| **Engagement fraud** | Fake likes/follows/views, comment spam, like-farms, **fake reviews** · 刷量 / 刷单 / 虚假互动 | Engagement-velocity anomalies, follower/following ratios, reciprocity graphs, burst timing |
| **Scams & financial fraud** | Phishing, investment/crypto & romance scams, brand/celebrity **impersonation**, **off-platform redirect** scams · 诈骗 / 仿冒 / 引流到站外 | Link patterns, scripted DMs, new-account + outbound-link, victim reports, impersonation name/image match |
| **Content harms** | Hate, harassment/bullying, violent/graphic, **CSAM (P0 → NCMEC report)**, self-harm, **health/medical misinfo**, regulated goods · 仇恨 / 欺凌 / 血腥 / 自残 / 虚假医疗信息 | Classifier scores, hash-matching, report clustering, keyword + context models |
| **Commerce abuse** *(shopping / live-commerce platforms — RedNote, TikTok Shop, IG Shop)* | **Counterfeit / IP infringement**, prohibited products, deceptive listings, review manipulation, payment/transaction fraud, **undisclosed paid promotion** · 假货 / 违禁品 / 软广未标注 | Seller risk profile, listing-image match, price anomalies, chargeback/dispute rates, disclosure detection |
| **Minors safety** | Underage users, grooming, age-inappropriate exposure · 未成年人保护 | Age-assurance signals, interaction-pattern anomalies, grooming-language models |

**The two cross-cutting truths:** (1) almost every abuse type reduces to *find the coordinated pattern → convert to a rule → balance catch-rate vs. over-enforcement*; (2) abuse adapts adversarially, so detection must keep evolving — last quarter's rule decays.

## 12. Cross-cultural & multi-region safety operations
*(JD: "comfort with cross-cultural, multi-time-zone work" + "international teams." Especially relevant at China-origin platforms — RedNote, TikTok/ByteDance — and any global platform.)*

- **Follow-the-sun moderation** across regions/time-zones with clean handoff protocols and a shared case-management system, so an incident at 2am in one region is owned, not dropped.
- **Central policy, local enforcement:** policy intent is set centrally but **localized per market** — what counts as a violation differs by culture and law (political speech, nudity norms, regulated goods, defamation). The hard, valuable work is **translating policy intent across contexts without it fragmenting**.
- **Why bilingual / bicultural is a real edge:** you bridge HQ policy intent ↔ local-market enforcement and reviewer training, and you catch nuance a translation layer loses. At a China→US platform this is the localization core, not a nice-to-have.
- **Coordination mechanics:** cross-region escalation paths, language coverage in the reviewer pool + automation, localized SOPs and calibration so the *same* content gets the *same* decision across markets.
- **Human-/compliance-heavy moderation — a China-origin distinction.** 🔎 Chinese-origin platforms (e.g. Xiaohongshu/RedNote) run an **AI gate at upload** (clean content publishes instantly; flagged content → manual review, ≤48h on RedNote) plus large, *growing* human-moderation teams under regulator mandates (**CAC / 网信办**) — more human-/compliance-bound than the Western post-hoc detect-and-demote model. A China→US platform runs **both** this backbone *and* a Western-style recsys/demotion layer, reconciling two compliance regimes (regulator norms vs. US law / user expectations). Don't assume a China-origin platform = a US-tech "silent-demotion / LLM-judge" model — at RedNote, automation *fell* (~95%→80–85%) and human headcount *rose* (317→~1,000, 2025). [web research, 2026-06-22, partially re-verified; sources + verification status in `interview-prep/rednote-safety-strategy-operations/content-ops-answerkey.md`]

---

## 13. Operational reality — recsys-native safety ops (✅ practitioner-confirmed 2026-06-17)

*The internal/operational layer that public T&S sources (§1–§9, which skew to the visible enforcement + regulatory half) miss. Source: a TikTok content-ecosystem ops PM who owned "poor-quality content on the FYP," via the RedNote prep reconciliation. Tags: ✅ = practitioner-confirmed · 🟡 = reasoned-inference. Especially relevant for any **algorithmic-feed UGC platform** (TikTok, RedNote, Instagram, YouTube Shorts…).*

- **The recommendation funnel IS the safety surface.** ✅ On a ranked-feed platform, much safety work is not queue → takedown; it's **detect (models) → demote across recommendation stages** (cold start, ranking…). Speaking recsys is the insider signal.
- **Enforcement ≠ quality-demotion (two modes, different playbooks).** ✅ *Enforcement* = a takedown the creator sees and can appeal → watch **appeal/overturn**. *Quality demotion* = **silent ranking suppression — the creator doesn't know — so there is NO appeal**; measure with precision/recall + a held-out audit instead. Do not treat appeal/overturn as a universal guardrail; name the mode.
- **Incident containment for a quality spike = targeted model → sweep (+ backfill) → demote.** ✅ NOT blanket threshold-lowering — that ripples downstream across every metric. Stand up a small targeted (ML/MLLM) model for the new pattern, sweep all content incl. historical backfill, demote.
- **Baseline before you detect.** ✅ Establish the current "water-level" on the metric first, then run detection against it.
- **High-recall model + human review** → low leakage + high coverage (wide net; humans cut the false positives). ✅
- **The metric IS the job.** ✅ One sensitive metric (e.g. % poor-quality impressions on the feed) is the alarm, the diagnosis, and the proof-of-fix. **Metric *design* is a core differentiator**; leadership watches the whole dashboard, not one number.
- **Throughput is increasingly automated.** 🟡✅ SLA/TAT/AHT human-queue metrics matter less as the model/system handles volume; human review becomes the calibration / high-recall-backstop layer, not the engine.
- **Policy-to-ops consistency** = playbook + extensive training + **exams before a moderator can execute** + QA + **IAA (inter-annotator agreement)**. ✅ Highest-leverage operator move: improve the **annotation tooling/UI** (clearer instructions, **LLM-generated hints**). Calibration guides usually owned by Policy.
- **Decision altitude.** ✅ The ops seat **executes**; Policy + Legal own policy/regulation, and the demote-vs-remove + catch-vs-friction **strategy thresholds are leadership calls** (informed by data scientists). The **model precision/recall operating point** (hold high precision) is the operator's lane; the **strategy threshold** is top-down. Don't over-claim regulatory/policy ownership for an IC seat.
- **Industry direction:** replacing human moderators with **LLM judges**; the strategic asset is **collecting high-quality human-labeled data** to train the replacement model (cost frame: GPU vs. human-moderator). ✅
- **Org shape:** typically **one person owns one topic** (poor-quality, CSAM, scams…) — understand the whole team's scope. ✅

**Vocabulary to deploy:** recsys stages (cold start, ranking) · demotion vs. enforcement · silent demotion / no-appeal · baseline / water-level · backfill sweep · high-recall + human review · IAA · annotation-UI / LLM hints · metric design · LLM-judge.

---

## Sources
> **🏷 验证状态(2026-06-28 本次重核):**
> - ✅ **真实可达且支持大方向:** [R-meta] · [DTSP best-practices](https://dtspartnership.org/best-practices/) · [Cooley KOSA](https://www.cooley.com/news/insight/2026/2026-03-05-comprehensive-online-safety-legislation-comes-to-the-us-how-kosa-is-copying-uk-eu-and-australian-laws) · [Taylor Wessing predictions-2026](https://www.taylorwessing.com/en/interface/2025/predictions-2026/enhancement-and-enforcement)。
> - ⚠️ **但 §2 具体数字(£1M 罚款、80+ 调查、91-3、$50K/violation)本次未逐字对源核对** —— 大方向有据(Ofcom 在罚款+调查、KOSA 过参议院、DSA 主攻年龄验证),**精确数字面试前再核**。
> - ⚪ **未核(本次没点开):** TechPolicy.Press · Accenture · Safe Framework spec · Cinder。
- **Practitioner reconciliation — TikTok content-ecosystem ops PM, 2026-06-17** (sanitized; powers §13). Working record: `interview-prep/rednote-safety-strategy-operations/content-ops-answerkey.md`.
- DTSP Best Practices & Safe Framework / ISO/IEC 25389 — [dtspartnership.org/best-practices](https://dtspartnership.org/best-practices/), [Safe Framework spec](https://dtspartnership.org/the-safe-framework-specification/)
- Vendor ecosystem — [TechPolicy.Press: Evolving T&S Vendor Ecosystem](https://www.techpolicy.press/the-evolving-trust-and-safety-vendor-ecosystem/), [Cinder](https://cinder.ai/)
- Regulation 2026 — [Taylor Wessing: Online safety in 2026](https://www.taylorwessing.com/en/interface/2025/predictions-2026/enhancement-and-enforcement), [Cooley: KOSA](https://www.cooley.com/news/insight/2026/2026-03-05-comprehensive-online-safety-legislation-comes-to-the-us-how-kosa-is-copying-uk-eu-and-australian-laws)
- AI/GenAI T&S — [Accenture: Trust & Safety Operations](https://www.accenture.com/us-en/services/managed-services/trust-safety)
- **[R-meta]** Prevalence measurement methodology (sampled content views → human review → ratio; sampled across languages; improved labeling raises *measured* prevalence without a real increase; methods updated regularly → affects historical comparisons) — [Meta Transparency Center: Prevalence](https://transparency.meta.com/policies/improving/prevalence-metric/), [Community Standards Enforcement Report](https://transparency.meta.com/reports/community-standards-enforcement/) *(verified via WebSearch 2026-06-22; powers §5 "Setting a baseline")*
