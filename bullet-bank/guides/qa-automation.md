# QA Automation Concepts — Primer (memorize sheet)

> **🧭 模型-QA 三件套**（互链不重复 — 定义→concepts · 怎么做→workflow · 查词→glossary）:
> - [qa-automation.md](./qa-automation.md) — **概念**（Top 8 · test types · 回归 · 标注） ◀ 你在这
> - [model-qa-workflow.md](./model-qa-workflow.md) — **流程**（intake · 12 步 · artifact · CSAM）
> - [model-qa-glossary.md](./model-qa-glossary.md) — **术语**（baseline · precision · calibration · drift）
>
> **概念归属(哪个概念放哪):**
> - 通用软件测试概念(test pyramid · regression · severity)→ **qa-automation**(本文)
> - ML / 模型评测术语(AUC · calibration · drift)→ **glossary**
> - 安全领域(policy · abuse · 法规)→ **[trust-safety](./trust-safety.md)**
> - precision/recall 两边都有:**测试概念**归 qa-automation · **模型指标**归 glossary。

> **🏷 Provenance:** 本表全部 = **[public]** 标准 QA/ML 概念定义(无需引用)。涉及 TikTok/Meta 的具体应用 + 引用的研究/法条见 [model-qa-workflow.md](./model-qa-workflow.md),那里已标 provenance + Sources。

**What this is:** the reusable **domain knowledge base** for QA-automation interview concepts. Per-company run-sheets (e.g. `interview-prep/meta-qa-analyst/`) **link** here instead of restating it. Tuned for a **QA Analyst** (concepts + honest bridge to AI/ML-eval work), not heavy SDET internals.

**How to use:** lock the **Top 8** cold; skim the deeper bank for what you have room for; rehearse the logic in 中文 (bottom) if that helps it stick.

---

## 🟢 Top 8 — lock these cold (~80% of what gets asked)

1. **Manual vs. automated testing** — Manual = a human runs the steps and judges the result. Automated = a script runs the steps and checks the result against an expected value. Automate the repetitive, high-volume, stable stuff; keep manual for exploratory and judgment-heavy cases.

2. **When to automate (and when not)** — Automate when a test is **run often, stable, and high-value** (regression, smoke, data validation). Don't automate one-offs, rapidly-changing UI, or anything needing human judgment — maintenance cost outweighs the payoff.

3. **Regression testing** — Re-running a known set of tests after any change to confirm **nothing that used to work is now broken.** The #1 reason teams automate. *Bridge: the Safety Index re-checks fixed precision/recall/FPR thresholds on every model release — regression testing for models.*

4. **The test pyramid** — Many fast **unit** tests at the bottom, fewer **integration** tests in the middle, few slow **end-to-end (E2E)** tests at the top. Push testing down the pyramid because lower = faster, cheaper, more stable.

5. **Test case anatomy** — A good test case = **precondition → steps → input → expected result**, compared to the **actual result** → pass/fail. The check itself is an **assertion** ("assert actual == expected").

6. **CI/CD + where tests fit** — Continuous Integration/Delivery: code changes trigger a pipeline that **runs the test suite on every commit/build and blocks the merge or release if tests fail.** The automated quality gate. *Bridge: auto-gate + rollback on regression is the same idea applied to model launches.*

7. **False positive vs. false negative in testing** — False positive = test fails but the product is fine (often a **flaky** test). False negative = test passes but a real bug slipped through (the dangerous one). *Bridge: this is precision vs. recall — home turf.*

8. **Severity vs. priority (bug triage)** — **Severity** = how bad the technical impact is. **Priority** = how urgently the business needs it fixed. A typo in the logo = low severity, high priority; a crash on an unused screen = high severity, low priority.

---

## Deeper bank (skim; pull what fits)

**🟢 First untangle two axes — "type" feels ambiguous because Level and Type get blended:**
- **LEVEL = how much is under test (scope):** unit → integration → E2E.
- **TYPE = what aspect you're checking:** functional, smoke, regression, performance…
- Every real test has both — e.g. *"an E2E functional test of login"* = whole-flow scope + checking it does the right thing. Separate the axes and the types stop overlapping.

**Test levels (scope)** — running example: a photo-sharing app
- **Unit** — one function/component in isolation. → *test the `like_count()` function alone.*
- **Integration** — two+ components together. → *the Like button correctly calls the counter service and the DB.*
- **End-to-end (E2E)** — the whole user flow, like a real user. → *log in → open a photo → tap Like → see the count rise.*

**Test types (what you check)** — same photo-sharing app
- **Smoke** — *"is the build even alive?"* Broad + shallow, right after a new build. → *app launches, login works, feed loads.* Fails → reject the build before deeper testing.
- **Sanity** — *"does this one fix work?"* Narrow + focused, after a small change. → *we fixed the Like counter; tap Like, confirm 4 → 5.* (Smoke = many features lightly; sanity = one feature deeply.)
- **Functional** — *"does it do what the spec says?"* → *right password logs in; wrong password shows an error.*
- **Non-functional** — *"how **well** does it do it?"* (qualities, not features):
  - **Performance** — speed under normal use → *search returns in < 200 ms.*
  - **Load vs. Stress** — *siblings*, same "volume dial," different target (load is **not** a kind of stress):
    - **Load** — turn the dial up to the **expected** peak; does it still meet targets? → *site rated for 50k Black-Friday users — stays fast at 50k?*
    - **Stress** — turn the dial **past** the limit to find the breaking point + see if it fails gracefully and recovers → *ramp 50k → 80k → 100k until it crashes; hard crash or graceful degrade?*
    - *(family: **spike** = sudden surge; **soak/endurance** = sustained load over hours.)*
  - **Security** — can it be broken into? → *can someone SQL-inject the login form?*
- **Regression** (also a type) — re-run known tests after a change to confirm nothing that worked broke (see Top 8 #3).
- *Bridge: the JD's "benchmarking / performance testing" = **performance** testing — the Safety Index measures model quality (precision/recall) against thresholds.*

**Structure & data**
- **Test plan** (strategy/scope) vs **test case** (one scenario) vs **test suite** (a grouped set).
- **Test data / fixtures** — the controlled inputs a test runs against.
- **Mocks / stubs** — fake versions of a dependency so you can test one piece in isolation.
- **Test coverage** — how much of the code/requirements the tests exercise. High coverage isn't automatically good; low coverage means blind spots.

**Automation craft**
- **Automation framework** — the structure that organizes test scripts (e.g. **data-driven** = same test, many inputs; **BDD / Given-When-Then** = plain-language scenarios).
- **Tools by layer** (name-drop, don't overclaim): UI → **Selenium / Cypress / Playwright**; API → **Postman / REST-assured**; unit → **pytest / Jest**.
- **Flaky test** — passes sometimes, fails others without a code change; erodes trust in the suite. Quarantine and fix it, never ignore it.
- **Shift-left** — test as early as possible to catch bugs cheap, before release.

**Process**
- **Bug/defect lifecycle** — New → Triaged → Assigned → Fixed → **Retest/Verify** → Closed (or Reopened).
- **Exit criteria / release readiness** — the agreed bar before shipping (e.g. all critical bugs closed, coverage met). *Bridge: you set exit criteria and gated launches on defect closure.*

---

## Your bridge line (if they probe automation depth)

🗣 *"My automation is in process and ML/eval pipelines — automated benchmarking that gates releases, automated routing that handled 65% of escalations, automated data-quality and validation scripts. The concepts — regression, gating, assertions, coverage, false positive vs. false negative — are how I already work. Where I'd ramp is your specific UI test-automation framework."*

🔴 Don't claim you've built Selenium/Cypress suites. Concepts + real ML/process automation is the honest, strong position.

---

## Likely questions → 1-line angle
- *"Manual vs automated?"* → definition + "automate repetitive/regression, keep manual for exploratory."
- *"When do you automate?"* → ROI: run-often + stable + high-value.
- *"Explain the test pyramid."* → unit-heavy bottom, E2E-light top, push tests down for speed/stability.
- *"What's regression testing?"* → re-run known tests after a change; bridge to the Safety Index.
- *"What makes a good test case?"* → clear precondition, steps, expected result, one assertion.
- *"Flaky test?"* → passes/fails without a code change; quarantine + fix, protect suite trust.

---

## 应用场景 → 见专门的 workflow 文件

一次 model 更新的完整 QA 流程（触发 → 交接 → 12 步执行 → sign-off）是 **workflow 深度展开**，不放在这张概念表里（concepts 归 concepts，workflow 归 workflow）。
→ workflow 见 **[model-qa-workflow.md](./model-qa-workflow.md)**（intake「先读文档、再问 SWE」、12 步执行、artifact 速查、CSAM 特殊处理、常见坑）。
→ 模型术语词汇表见 **[model-qa-glossary.md](./model-qa-glossary.md)**（baseline/candidate · precision/recall · calibration · A/B · drift · rollback…）。
→ 进阶/规模化问题见 **[qa-at-scale.md](./qa-at-scale.md)**（测试 tradeoff · CI/CD quality gates · 分布式系统测试 · 海量负载 · 跨团队质量流程）。

---

## 核心概念：标注（annotation / labeling / ground truth）

模型测试的「标准答案」——没有它就**算不出 precision/recall**。

- **是什么:** 人（或可信来源）给每条数据打上「正确答案」= **label / ground truth（真值）**。例:人工给 10000 条帖子标「违规/不违规」;给广告标「是否违反政策」。
- **怎么结合测试:** golden set = 一批**已标注**的数据（考卷+标准答案）→ 模型跑出 **predicted** → predicted 与 **label** 逐条比（= ML 版 assertion）:说违规+真违规 = TP;说违规+真没事 = FP（误报）;说没事+真违规 = FN（漏报）→ 由这些算 precision/recall/FPR。
- **🔴 标注质量 = 测试可信度:** 标注本身错了,指标全错（garbage in, garbage out）。校验数据就是查:标错没、标注者之间是否一致（inter-annotator agreement）、覆盖够不够。
- **从哪来:** 人工标注团队（trained reviewers 按 policy 标）、真实行为推导（用户点击/举报）、专家标注。
- **桥接 🟢:** 你在 T&S/Moody's 做的正是这个——对照标注评测模型、算 precision/recall、管 benchmark 质量。

---

## 中文版 — Top 8（帮助记忆，用英文作答）

1. **手动测试 vs. 自动化测试** —— 手动是人执行步骤、人来判断结果；自动化是脚本执行步骤、并把结果与「预期值」自动比对。重复、高频、稳定的用自动化；探索性、需要人判断的留给手动。

2. **什么时候该自动化** —— 当一个测试「跑得频繁、内容稳定、价值高」时自动化（回归、冒烟、数据校验）。一次性的、UI 频繁变动的、需要人判断的不要自动化，维护成本会超过收益。

3. **回归测试（regression）** —— **任何改动之后**（修 bug、加功能、改配置、升级依赖），重新跑一组「已知原本应该通过」的测试，确认这次改动**没有把原来正常工作的功能弄坏**。"Regression（退化）"就是功能倒退回有问题的状态。
   - **原理：** 改一处常会意外影响看似无关的另一处（副作用 / side effect）；回归测试是抓「意外破坏」的**安全网**。因为要反复重跑，这是团队做**自动化**最主要的原因，通常放进 CI/CD。
   - **例子①（电商）：** 修好「购物车数量不能更新」后，不只测这一处（那是 sanity），而是重跑 登录→加购→改数量→结账→付款，确认没顺手弄坏结账/付款。
   - **例子②（登录）：** 加了「手机号登录」新功能后，确认原来的**邮箱登录还能用**。
   - **区分：** sanity = 只确认「这一个修复生效没」（窄）；regression = 确认「有没有破坏别的已有功能」（广）。smoke = 「构建还活着吗」（浅）。
   - **桥接 🟢：** 你的 **Safety Index 就是模型版的回归测试**——每次发版自动重核 precision/recall/FPR 阈值，哪个指标退化就拦发布或回滚。

4. **测试金字塔** —— 底层是大量又快又便宜的**单元测试**，中间是较少的**集成测试**，顶层是少量又慢的**端到端（E2E）测试**。尽量把测试往下层压，因为越底层越快、越稳。

5. **一个测试用例的结构** —— 前置条件 → 步骤 → 输入 → **预期结果**，再和**实际结果**比对，得出通过/失败。这个比对动作叫**断言（assertion）**。

6. **CI/CD 与测试的位置** —— 持续集成/交付：代码一改动就触发流水线，**每次提交都自动跑测试，测试不过就拦住合并或发布**。这就是自动化的质量闸门。（桥接：你的「自动门控 + 回归即回滚」就是把这套用在模型发布上。）

7. **测试里的「假阳 vs. 假阴」** —— 假阳性 = 测试报错但产品其实没问题（常常是 **flaky** 不稳定测试）；假阴性 = 测试通过但真 bug 漏过去了（更危险的那种）。（桥接：这就是 precision 与 recall，你最熟。）

8. **严重程度 vs. 优先级** —— **Severity（严重度）** = 技术影响有多大；**Priority（优先级）** = 业务上多急着修。Logo 拼写错 = 低严重度、高优先级；没人用的页面崩溃 = 高严重度、低优先级。
