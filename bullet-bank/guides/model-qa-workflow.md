# Model-Update QA Workflow + Playbook · 一次模型更新的完整测试流程

> **🧭 模型-QA 三件套 / The 3-doc set** (互链不重复 — 定义→concepts · 怎么做→workflow · 查词→glossary):
>
> - [qa-automation.md](./qa-automation.md) — **concepts 概念** (Top 8 · test types · regression · labeling)
> - [model-qa-workflow.md](./model-qa-workflow.md) — **workflow 流程** (intake · 12 steps · artifacts · CSAM) ◀ you are here
> - [model-qa-glossary.md](./model-qa-glossary.md) — **terms 术语** (baseline · precision · calibration · drift)
>
> **Concept routing ｜ 哪个概念放哪:**
>
> - general software-testing (test pyramid · regression · severity) → **qa-automation**
> - ML / model-eval terms (AUC · calibration · drift) → **glossary**
> - safety domain (policy · abuse · regulation) → **[trust-safety](./trust-safety.md)**
> - behavioral / situational interview Q&A (sacrificed quality · no-docs · bug triage · plan vs strategy · prioritize) → **[qa-at-scale](./qa-at-scale.md)** (frameworks) + your per-company run-sheet (your STAR)
> - precision/recall live in both (testing concept → qa-automation · model metric → glossary).

**What this is** The full QA flow for a model update, from "you're notified" to "you give a ship/no-ship call." ｜ 一个 model 更新从「被通知」到「给发布结论」的完整 QA 流程(workflow 深度展开)。
**Interview use** Directly answers the common question _"walk me through how you'd test a model change."_ ｜ 直接回答高频题。
**Bridge 🟢** This whole thing = your
**Safety Index** — you built and ran it, you're not "learning" it. ｜ 这整套 = 你的 Safety Index

> **🏷 Provenance:** Flow + QA/ML concepts = **[public]** · case scenarios = **[inferred]** illustrative (NOT real TikTok events, except those marked "real research") · cited research/law = **[verified]** (see [Sources](#sources)) · TikTok mechanics = **[public, secondary]** (industry reporting, not TikTok eng docs) · your résumé numbers = **🔴 [VERIFY — you confirm]**.

---

## English one-breath version (High-level Summary + delivery)

> Intake first — _what changed, which baseline, which eval set, the exit criteria._ Then: write a test plan → validate the eval data → run baseline + candidate on the **same** set → compute precision/recall/FPR (**benchmarking**) → compare + **regression-check** → **slice by segment** → **error-analysis** the new FP/FN with engineering → adversarial / unsafe-content checks → judge against **exit criteria** → file bugs + triage → **quality report with a go/no-go** → **release-readiness sign-off** (or retest after fixes).

---

## 1 · Trigger & handoff ｜ 触发 & 交接

**EN:** The trigger is usually a **Jira/Tasks ticket**, a SWE @-ing you on Workplace/Slack, or a build notification. The SWE says something like "we retrained model X, here's candidate A — validate it before we ship."
**中文:** 触发通常是一个 **Jira/Tasks ticket**、SWE 在 Workplace/Slack 上 @你、或一个 build 通知。SWE 会说「我们 retrain 了 X,出了新版 candidate A,上线前帮我 validate 一下」。

🔴 **Key insight ｜ 关键认知:** A SWE's handoff is often incomplete. A good QA doesn't start running the moment they hear "test A" — they first pin down _what to test, against what, with what data, what counts as pass._ ｜ SWE 给的信息常常不完整;好的 QA 先把「测什么、和谁比、用什么数据、什么算过」问清楚,否则测了也没意义。

**A good handoff should contain (chase it if missing) ｜ 一个「好的交接」应包含(没有就追问):** what changed + why · model version/access · baseline · eval set · pass criteria · risk areas/segment · timeline · test tooling. ｜ 改动内容+原因 · model 版本/访问 · baseline · eval 数据集 · 通过标准 · 风险点 · 时间线 · 跑测工具。

## 2 · Before you start: read the docs, then ask ｜ 动手前搞清背景:先读文档,再问人

🔴 **The senior move ｜ 资深做法:** read the artifacts first; only ask the SWE what the docs don't say or what needs judgment. Don't verbally ask "what changed" — that's written down. ｜ 先读 artifact,只在文档没写或需确认时才问 SWE。

**Read yourself first (background + scope, mostly no need to ask) ｜ 先自己读(基本不用问人):**

- **Ticket / Task** (Jira / Meta Tasks) — what changed, why, the goal. **First source.** ｜ 改什么、为什么、目标。**第一来源。**
- **PR / diff** (Meta internal: Phabricator) — the actual change + the author's summary (motivation). ｜ 实际改动 + 作者 summary(动机)。
- **Model card / model registry** — this version's training data, change, intended use, metrics. ｜ 该版本的训练数据、改动、用途、指标。
- **Design doc / PRD** — the motivation and approach for a larger change. ｜ 大改动的动机和方案。
- **Experiment / offline-eval record** — what they tried, how much it moved offline. ｜ 试了什么、离线涨了多少。
- → From these you read out: **what changed + why · A's version/access · baseline · eval set.** ｜ 从这些读出:改了什么+为什么 · A 的版本/访问 · baseline · eval 数据集。

**Then ask the SWE specific questions (only what docs lack / needs judgment) ｜ 再带着具体问题问 SWE:**

- **exit criteria / thresholds** (if not written) — which metrics count, what threshold. ｜ 通过标准/阈值(若没写明)。
- **which segment they most fear regressing** — that's the SWE's judgment, worth asking. ｜ 最担心哪个 segment 退化(SWE 的判断,值得问)。
- **timeline / is it blocking a launch.** ｜ 时间线/是否 blocking 发布。
- **confirm understanding** — paraphrase what you read back to them. ｜ 把你从文档读到的复述一遍让他确认。

🟢 **Interview point ｜ 面试点:** Saying "I read the ticket, diff, and model card to get the background, then bring specific questions to the SWE to confirm risk areas" reads far more senior than "I ask the SWE what changed." ｜ 比「问 SWE 改了什么」资深得多。

## 📓 Work-artifact cheatsheet ｜ 工作 artifact 速查 (what each term is + what QA reads from it)

These terms come up constantly — remember "what it is / what's inside / what you read from it." ｜ 记住「是什么 / 里面有什么 / 你从里面读什么」。

- **Ticket / Task** (Jira; Meta calls it **Tasks**) — a tracked work item, the smallest unit of work. ｜ 被追踪的「工作项」,工作的最小单位。
  - _Inside:_ title, description (what+why), owner, status, priority, linked PR/doc.
  - _QA reads:_ the change's background, goal, scope, links. **First source.**

- **PR (Pull Request) / diff** (GitHub: PR; Meta: **diff**, via Phabricator) — a proposed code/config change under review. ｜ 一次「待审核的代码/配置改动」。
  - _Inside:_ author **summary** (what+motivation), the code diff, reviewer comments, linked ticket.
  - _QA reads:_ exactly what code/config/data changed → infer which segments are affected.

- **Model card** — a model's "spec sheet" (standardized; concept from Google "Model Cards"). ｜ 模型的「说明书」。
  - _Inside:_ intended use, training data, per-segment metrics, known limits.
  - _QA reads:_ baseline metrics, where the model is strong/weak, what to focus testing on.

- **Model registry** — the system that stores + version-manages all models and metadata. ｜ 存放+版本管理所有模型及元数据的系统。
  - _QA reads:_ which is the current prod version (baseline), per-version metrics, lineage.

- **Eval / experiment record** (offline eval, often a notebook/dashboard) — the SWE's experiment results. ｜ SWE 跑实验的结果。
  - _QA reads:_ how much it moved offline, on which set → reproduce/extend.

- **Design doc** — the **"how"** technical plan (written before the change, narrative). ｜ 「怎么做」的技术方案。
  - _Inside:_ background/motivation, design, tradeoffs, risks, eval plan.
  - _QA reads:_ why the change, expected effect, the author's anticipated risks. (For understanding — you don't write test cases straight off it.)

- **PRD** (Product Requirements Doc) — the **"what to build + why"** (product/requirements layer). ｜ 「要做什么+为什么」(需求层)。
  - _QA reads:_ what the feature/model must satisfy, what success looks like → **your source for exit criteria.**
  - _When to read it:_ **a new feature / new model, or when no one gave you clear acceptance criteria**; not for small fixes/retrains (may not even exist).

- **Spec** (specification) 🟢 QA's direct basis — the **"exact, verifiable definition of correct behavior"**: input X → output Y, field non-negative, this case returns this error. ｜ 「确切、可验证的正确行为定义」。
  - _QA reads:_ **you write test cases straight off the spec** — each spec line = one executable check.
  - _In model work, "spec" often =_ policy / labeling guidelines (the exact definition of a violation), API spec, or eval success criteria.
  - _**Who writes it ｜ 谁写的:**_ Product (PRD) / Eng (API/tech spec) / **Policy** (content labeling guidelines) — **QA reads it + flags gaps; QA doesn't usually author it.** ｜ spec 由 Product/Eng/Policy 写;QA 是用它+提缺口,不从零写。

📌 **Which doc to read for which question ｜ 什么时候看哪个文档:**

- "**What changed & why**" → **Ticket** (background) → then **PR/diff** (specifics) ｜ 改了什么、为什么
- "**Exactly what code/data changed**" → **PR/diff** ｜ 具体改了哪些代码/数据
- "**Which version is baseline, per-segment history**" → **Model card/registry** ｜ baseline 是哪版、各 segment 历史
- "**Why designed this way, what risks**" → **Design doc** ｜ 为什么这么设计、有什么风险
- "**What the feature must satisfy, success bar (exit criteria)**" → **PRD** (new feature/model) ｜ 满足什么需求、成功标准
- "**The exact definition of correct behavior (basis for test cases)**" → **Spec / policy guidelines** ｜ 正确行为的确切定义
- "**What they tried offline, how much it moved**" → **Eval / experiment record** ｜ 离线试了什么、涨了多少

🟢 **String it together (interview) ｜ 面试串起来说:** "I read the **ticket** for context, the **diff** for what specifically changed, the **model card / registry** for baseline + per-segment metrics, the **design doc** for motivation and the author's anticipated risks — then bring specific questions to the SWE to confirm." ｜ (中文同上 §2 面试点。)

## 3 · After alignment, execute step by step

🟢 **Where the effort actually goes (rule of thumb, [inferred]) ｜ 精力实际花在哪:** the distribution is **uneven** — about **half** the work is **Step 2 (validate the eval data, ~25–30%) + Step 7 (error analysis, ~20–25%)**, the two **un-automatable, human-judgment** steps. **Steps 3–4 (run + compute) are automated and cheap** — running the benchmark is _not_ the work. Judging/reporting (9, 11, 12) is quick. ｜ 不均:约一半在**步骤2(校验数据)+步骤7(错误分析)**,这俩不能自动化;跑测(3、4)是自动的、最省力。 _(「data ≈ 80% of ML」是公认经验 [public];具体百分比是估算 [inferred]。)_

1. **Write the test plan / test cases** — scope + metrics + exit criteria; clear in-scope / out-of-scope. ｜ 写 test plan / test cases(范围+指标+exit criteria)。
2. **Prepare + validate the eval data** ⏳~25–30% — the golden set is the answer key; if it's wrong, every metric is meaningless. ｜ 准备+校验评测数据;数据错,指标全废。
   - _How / 怎么验:_ **representative** of recent production? · **label quality** (sample re-label vs policy + **IAA**) · **covers edge/new/rare cases** · **no train/eval overlap** (dedup) · **fresh** + enough positives.
   - _Output:_ a **trusted** eval set, or a list of data fixes to do **before** benchmarking. ｜ 产出可信评测集,或先修数据再跑。
   - _= your LeanData data-quality / validation scripts + Moody's eval datasets._
3. **Run baseline AND candidate A on the same eval set** — two prediction sets, "everything but the model held constant" (control variables). ｜ 同一 eval set 上分别跑 baseline 和 candidate(控制变量)。
4. **Compute metrics (benchmarking)** — precision / recall / FPR / accuracy + business metrics (for score-driven models, **calibration**, AUC). ｜ 算指标(benchmarking)。
5. **Compare + regression-check** — did the target metric rise? **Did anything else regress?** (= regression testing for models). ｜ 对比+回归检查。
   - _How:_ build a **baseline-vs-candidate table** (metric · baseline · candidate · Δ · pass?) — ① did the **target** improve, ② did any **guardrail** (precision/recall/FPR/calibration) get worse. ｜ 并排比目标+护栏指标。
   - _What counts as a regression:_ a metric drops **below its threshold / beyond tolerance** (Step-1 exit criteria) — **not** every tiny dip; rule out **noise** (sampling variance / significance); watch the **precision–recall trade-off**. ｜ 跌破阈值且非噪声才算退化。
   - _= your Safety Index:_ fixed thresholds, re-checked every release, **auto-gate + rollback on regression**. ｜ 就是你的 Safety Index 自动门控。
6. **Slice analysis (by segment)** — split by language/region/content-type/group. **Overall up but a segment down** is the most common trap. ｜ 切片分析(按 segment)。
7. **Error analysis (case / error review)** ⏳~20–25% — where "recall dropped 4%" becomes "dropped _because_ X"; the real signal. ｜ 错误分析:把指标变成原因。
   - _How / 怎么做:_ pull the **new FP/FN** (candidate wrong, baseline right) → **read the actual examples** → **cluster** by theme (a language? a new format? a subtype?) → **root-cause with eng: data / logic / threshold?** (read model logs + classifier code) → write up clusters + cause + blocker?
   - _= your "reproduce, document, and triage model failures with engineering."_
8. **Boundary & adversarial / safety testing** — construct edge cases + adversarial inputs, especially unsafe content. ｜ 边界 & 对抗 / 安全测试。
9. **Judge against exit criteria** — pass / fail / conditional pass. ｜ 对照 exit criteria 判定。
10. **File bugs + triage** — clean repro (which input, expected vs actual) + severity/priority, decide with the SWE. ｜ 提 bug + triage。
11. **Write the quality report + ship recommendation** — comparison, slices, error analysis, risks on one page → **go / no-go / fix-these-first**. ｜ 写 quality report + 发布建议。
12. **Release-readiness sign-off** — pass → sign off; fail → state the blocker, **retest** after the fix (back to step 3). ｜ Release-readiness sign-off;不过则修复后 retest(回第 3 步)。

## ⚠️ The hardest / most error-prone parts (difficulties + pitfalls, with TikTok case studies) ｜ 最难 / 最易出错的环节

**EN:** Each difficulty gets a **TikTok** case (the model in each case = a **content / quality classifier** — your real domain; **no FYP ranking**): scenario → how the metric/perf fools you → how it's found → root cause → how to prevent → 🟢 lesson.
**中文:** 每个难点配一个 TikTok case(case 里的 model = 内容/质量分类器,你的真实领域;**不涉 FYP ranking**)。

🔴 **Provenance:** **[verified]** A2 Perspective API & A3 Gender Shades are published research (see [Sources](#sources)); **[inferred]** the rest are **illustrative typical scenarios on TikTok's moderation context, NOT real TikTok events** — use as examples, don't say "TikTok actually did this." **[public, secondary]** TikTok platform mechanics (huge UGC feed, comments, sounds/challenges drive trends, creation/upload, TikTok Live, content scanned at upload+in-feed) are widely reported, not TikTok eng docs.

🔴 **Honesty boundary (must-read) ｜ 诚实边界:** the "model" in every case below = a **content-integrity / quality classifier** (violation detection, toxicity, low-quality demotion) — **your real domain (TikTok T&S)**. **Never** present yourself as having done **FYP engagement ranking / pCTR / the recommendation model** — that's not your work; **don't bring up FYP ranking** in the interview. Bridge to Chad's calibration like this: "I did calibration on **safety/content classifiers** (thresholds, precision/recall, the Safety Index) — **same discipline** as ranking calibration" — bridge the method, don't claim ranking itself. ｜ (中文同义,见上。)

### A. Benchmarking pitfalls (model quality — make a bad model "look good") ｜ Benchmarking 陷阱

**A1 · Calibration mismatch on a content-quality classifier ｜ 内容质量分类器的 calibration 失配** 🟢🟢 (your bridge to Chad = your Safety Index)

- **Scenario ｜ 场景:** a classifier scores feed content for "quality/violation" risk, and the **score drives the demotion/enforcement threshold**. The new version has higher offline AUC → swapped in, old threshold kept. ｜ 分数驱动降权/执法阈值,新版 AUC 高就直接换、沿用旧阈值。
- **How it fools you ｜ 怎么骗人:** AUC tests only **ordering**, not whether the **probability is accurate**; the new scores run systematically high (miscalibrated) — AUC looks great, calibration is broken. ｜ AUC 只测排序、不测概率准不准;新版分数偏高就乱。
- **The harm ｜ 问题:** a batch of content that should pass gets its risk systematically overstated and is **wrongly demoted/actioned (overkill spikes)**. ｜ 该放行的内容被误降权/误执法。
- **Find / cause / prevent ｜ 发现/根因/防:** a **reliability diagram** (predicted risk vs actual) shows high-band overestimation ← no recalibration → recalibrate on every model swap (Platt/isotonic) + reset thresholds; benchmark **ECE**, not just AUC. ｜ reliability diagram → 换模型必校准+重设阈值。
- **🟢 Good ranking ≠ trustworthy scores; your Safety Index sets exactly this threshold/operating point.** ｜ 排序好 ≠ 分数可信。

**A2 · Label bias in a comment-toxicity classifier ｜ 评论毒性分类器的标注偏差** (interaction environment)

- **Scenario ｜ 场景:** a model scores **comments under videos** for toxicity, to fold/demote them. Labels come from crowd annotation. ｜ 给评论打毒性分;标签来自众包标注。
- **How it fools you ｜ 怎么骗人:** overall AUC is good (most judged right); the bias hides in a subset, invisible to the aggregate. ｜ 整体 AUC 好,偏差藏在子集。
- **The harm ｜ 问题:** neutral comments with identity terms get scored highly toxic and wrongly folded. **[verified]** documented example: "I am a black man" → **80%** toxicity vs "I am a man" → 20% ("gay"/"transgender" also misjudged); Perspective API / Jigsaw, Dixon et al. 2018 (see [Sources](#sources)). ｜ 含身份词的中性评论被误判;Perspective API。
- **Find / cause / prevent ｜ 发现/根因/防:** an **identity-term probe** (swap only the identity word) for a fairness slice ← identity terms co-occur with attacks → spurious correlation → add balanced data + a bias benchmark set + check inter-annotator agreement. ｜ identity-term 探针 + 平衡数据 + IAA。
- **🟢 Label bias gets learned and the aggregate can't catch it; benchmarks must include probes + slices.** ｜ benchmark 必含探针+切片。

**A3 · Enforcement "overall good, locally broken" across segments ｜ 内容执法在 segment 上整体好、局部崩** (fairness)

- **Scenario ｜ 场景:** a violation/quality classifier has **great overall precision/recall**, about to expand. ｜ 整体 precision/recall 漂亮,准备扩用。
- **How it fools you ｜ 怎么骗人:** head/English samples dominate, pulling the aggregate up and **masking** over-enforcement or misses in some language/region/creator tier. **[verified]** parallel to Gender Shades (Buolamwini & Gebru 2018): overall high, but darker-skinned women error up to **34.7%** vs lighter men **0.8%** (see [Sources](#sources)). ｜ 聚合掩盖某 segment;类比 Gender Shades。
- **The harm ｜ 问题:** sliced by "language × region × creator tier," some non-English community sees **overkill (wrongful removals) spike** or misses spike. ｜ 某非英语社区误删/漏放暴涨。
- **Find / cause / prevent ｜ 发现/根因/防:** benchmark reported by **crossed segments** ← training data head-heavy + never sliced → always slice + set a floor for key subgroups. ｜ 按交叉 segment 报告 + 给关键子群设底线。
- **🟢 "Overall good" can hide a community being wrongly removed/missed; slicing is the only way to find it.** ｜ 切片是唯一发现法。

**A4 · Data leakage in classifier evaluation ｜ 内容分类器评测的数据泄漏**

- **Scenario ｜ 场景:** a violation classifier adds new features and retrains; offline **AUC jumps 0.82 → 0.99**, everyone's thrilled. ｜ 离线 AUC 从 0.82 跳 0.99。
- **How it fools you ｜ 怎么骗人:** 0.99 is suspiciously good — a feature contains "was this content later reported / judged violating" = a **label proxy (target leakage)**; offline it's peeking at the answer. ｜ feature 含标签代理,离线偷看答案。
- **The harm ｜ 问题:** in production, real misses/wrongful-removals **barely improve**. ｜ 上线后真实漏放/误删几乎没改善。
- **Find / cause / prevent ｜ 发现/根因/防:** feature importance shows one feature absurdly high → trace it to future/label info ← train/test not time-separated → strict **point-in-time isolation**; suspiciously good metrics → suspect leakage first. ｜ point-in-time 隔离;指标反常先怀疑泄漏。
- **🟢 "Too good to be true" is itself a red flag.** ｜ 「好得不真实」是 red flag。

**A5 · TikTok trend shift makes the benchmark stale ｜ 趋势变化让 benchmark 过时** (creation + interaction)

- **Scenario ｜ 场景:** a content-quality/integrity model scores precision 96% on **last month's** labeled set; team is satisfied. ｜ 上月标注集上 precision 96%。
- **How it fools you ｜ 怎么骗人:** in production misses spike, but re-testing on the old benchmark set still looks great (it's testing the past). ｜ 旧 benchmark 集重测依然漂亮。
- **The harm ｜ 问题:** new sounds/challenges/memes appear daily; the model has never seen them and is nearly blind. ｜ 新 challenge 每天冒出,模型没见过。
- **Find / cause / prevent ｜ 发现/根因/防:** online metrics (report rate) diverge from offline ← benchmark set static, can't keep up with trend velocity → refresh it with recent traffic + add new-challenge samples + online monitoring. ｜ 持续刷新 + 线上监控。
- **🟢 TikTok trends change daily; the offline benchmark must be refreshed often.** ｜ 离线 benchmark 必须高频刷新。

**A6 · Offline metrics ≠ real online effect ｜ 离线指标 ≠ 线上真实效果** (quality/demotion model)

- **Scenario ｜ 场景:** a content-quality/demotion model improves; offline **precision/recall rise clearly**; ship with confidence. ｜ 离线 precision/recall 显著提升。
- **How it fools you ｜ 怎么骗人:** offline uses historical labels + historical demotion logs, but the logs were shaped by the **old model** (selection bias); offline-good doesn't mean online **prevalence / user reports** actually drop. ｜ 历史日志有选择偏差。
- **The harm ｜ 问题:** online prevalence and user reports don't improve, or worsen → rollback. ｜ 线上 prevalence/举报没改善甚至更差。
- **Find / cause / prevent ｜ 发现/根因/防:** offline diverges from online ← biased logs + can't simulate the true distribution → offline is only a gate, **judge by online prevalence + reports + a held-out audit**. ｜ 离线只当 gate,线上为准。
- **🟢 Offline gains don't mean a real online drop; online results are the gold standard.** ｜ 线上结果才是金标准。

### B. Performance testing — own ①, ② is a ramp area ｜ 性能测试:认领 ①,② 是补强项

🔴 **"Performance testing" 有两个意思 — 只 claim 你简历上的那个:**

- **① Model performance benchmarking** (precision/recall/FPR, the quality gate) = **on your résumé, 真做过** —— Moody's _"automated benchmarking and performance-testing framework for AI models"_ = your **Safety Index** = the whole **§A** set above. **这才是「你的」performance testing,尽管 claim。**
- **② System / load performance** (latency / throughput / load 压测) = SRE / infra, **not on your résumé**,不是你的经历。

**If they mean ② (system load) ｜ 若问的是系统压测,概念讲得溜即可(不展开成你的经历):**

- 四类:**load**(预期峰值) · **stress**(超极限找断点) · **spike**(突发激增) · **soak**(长时间持续)。
- 盯 **p99 尾延迟 + 吞吐 + 错误率 + 饱和点(knee)**,不是平均。
- 然后诚实说:_"the concepts I know; the specific load-test tooling/process I'd ramp on fast."_ —— **不 claim 做过大型 load test。**(更多见 [qa-at-scale §4](./qa-at-scale.md)。)

### C. Process slips (low-level but common — just avoid) ｜ 流程疏忽

- **Testing the candidate without comparing to baseline** — no control, "good" is meaningless. ｜ 不和 baseline 比。
- **Forgetting regression** — only watching the target metric while others quietly regress. ｜ 忘了回归。
- **Not setting exit criteria upfront** — arguing "does this pass" after the fact, losing objectivity. ｜ exit criteria 没事先定。

🟢 **Interview killer move ｜ 面试杀手锏:** "How do you ensure model quality?" → don't just say "I run precision/recall"; say "I focus on the things that **most easily fool the metrics**: label quality, slicing by segment, recalibrating thresholds, guarding against data leakage, and offline-vs-online consistency." Instantly shifts you from "number-runner" to "someone who understands model quality." ｜ 从「跑数的」变成「懂模型质量的」。

## Bridge to your real experience 🟢 ｜ 桥接你的真实经验

**EN:** This whole thing **is** the Safety Index: every release, auto-run precision/recall/FPR on a fixed eval set, compare to baseline, block or roll back on regression. In the interview, walk the 12 steps, then land "this is exactly what I did at Moody's."
**中文:** 这整套就是 Safety Index:每次发版自动在固定 eval set 上跑 precision/recall/FPR、和 baseline 比、退化就拦发布或回滚。面试照 12 步讲,最后点一句「这正是我在 Moody's 做的」。

🔴 **[VERIFY — your résumé]** "Safety Index" and any specific numbers are **your claim** — I can't verify them; before the interview confirm each is true and defensible (against your real experience, per your "bullet = real + defensible" rule). ｜ 具体数字是你的 claim,面试前确认真实可辩护。

---

## 📎 Appendix — most severe content (CSAM): reference, not your day-to-day ｜ 附录:最严重内容(背景,非日常)

**Why here, not up top ｜ 为什么放底部:** this is **background you can speak to if asked**, not part of your normal QA flow — you almost certainly never touch raw CSAM. Know it, don't lead with it. ｜ 这是被问到能答的背景,不是你日常流程;基本不会碰到,知道即可、别主动展开。

- **EN:** The JD's "may be exposed to unsafe content" means violence / hate / adult etc.; **CSAM (child sexual abuse material) is the exception** — in the US, merely possessing/viewing it is itself a crime (18 U.S.C. §2252), so it does **not** go through ordinary labeling. ｜ JD 的「unsafe content」指暴力/仇恨/成人等;**CSAM 是例外**,持有/查看本身违法,不走普通标注。
- **Distinction ｜ 区分:** ordinary "involving minors" content can be labeled normally; **CSAM (child sexual exploitation)** is the untouchable category. ｜ 普通涉未成年人内容可正常标注;CSAM 才是碰不得的。
- **How it's handled ｜ 处理方式:** **hash matching** (PhotoDNA / NCMEC hash lists — auto-detect, no human views the original) → **mandatory NCMEC CyberTipline report** (18 U.S.C. §2258A) → a small, legally-authorized team handles it. ｜ hash matching → 强制上报 NCMEC → 专门受法律授权小团队。
- 🟢 If asked "how do you handle the most severe content," answering this shows compliance awareness. ｜ 被问到时答这套 = 显示懂合规,加分。
- **[verified]** §2258A mandatory NCMEC reporting + PhotoDNA (built by Microsoft, used by Meta/Google etc.), match → auto-report with no human review — verified (see [Sources](#sources)); §2252 possession being illegal is established law **[public]**. (Not legal advice; defer to official/legal.) ｜ 已核实;非法律意见。
- **Will QA handle raw CSAM? Almost certainly NOT directly ｜ QA 会直接碰 raw CSAM 吗?基本不会:**
  - **[public]** General QA/content roles don't review/label raw CSAM — it's legally walled off to a specialized, cleared team; your "unsafe content" exposure = **hate / violence / adult / harassment / spam**, not CSAM. ｜ 普通 QA 不直接看/标 raw CSAM,法律隔离到专门团队;你接触的是 hate/暴力/成人等,不是 CSAM。
  - **🔴 [VERIFY]** Ask the recruiter/HM: _"what content categories does the role cover, and what are the wellness protocols?"_ — the smart, legitimate way to learn your actual scope. ｜ 直接问招聘方:覆盖哪些类别 + wellness 保护。

---

## Sources

- **[verified]** Gender Shades — Buolamwini & Gebru (2018), _Intersectional Accuracy Disparities in Commercial Gender Classification_. Darker-skinned women error up to 34.7% vs lighter men 0.8% (IBM/Microsoft/Face++). https://proceedings.mlr.press/v81/buolamwini18a.html · http://gendershades.org
- **[verified]** Perspective API / Jigsaw identity-term bias — Dixon et al. (2018); e.g. "I am a black man" → 80% toxicity. https://www.perspectiveapi.com/research/ · https://journals.sagepub.com/doi/10.1177/20539517211046181
- **[verified]** CSAM mandatory reporting — 18 U.S.C. §2258A (LII). https://www.law.cornell.edu/uscode/text/18/2258A
- **[public, secondary]** TikTok platform/recommendation mechanics (watch-time/completion-driven, test-audience then widen) — industry reporting (not TikTok eng docs). https://blog.hootsuite.com/tiktok-algorithm/
- _Verified 2026-06-28; links were real and reachable at that time._
