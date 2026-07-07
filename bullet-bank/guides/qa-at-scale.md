# QA at Scale — senior / 规模化 + 行为情境问题（面试拔高）

**这是什么:** 给 SWE 面试官(如 Chad)准备的**进阶 QA 问题**——测试方法 tradeoff、CI/CD quality gates、分布式系统测试、海量负载性能测试、跨团队质量流程,以及**行为 / 情境真题**(§6:牺牲质量、无文档、bug 被关、自动化被跳过、plan vs strategy、排优先级)。
**配套:** 基础概念在 [qa-automation.md](./qa-automation.md);模型测试流程在 [model-qa-workflow.md](./model-qa-workflow.md)。这里是**规模化 & 策略 & 行为**层。
**每题结构:** Q(可能怎么问) → 答题框架 → 核心 tradeoff / 🟢 桥接你的经验。
**SST 说明:** 行为/情境题的**通用框架**是这里(可复用到任何公司);你的**个人 STAR 故事**在各公司 run-sheet,链接回这里、不重复。

> **🏷 Provenance:** 答题框架 + tradeoff + 工具名(JMeter/Locust/Chaos Monkey 等)= **[public]** 通用 QA/工程知识 · 🟢「桥接你的经验」里凡涉及具体数字/项目 = **🔴 [VERIFY]** 你的简历 claim,面试前自己确认真实可辩护。

---

## 1. 不同测试方法的 tradeoffs

**Q:** "How do you decide what to automate vs. test manually? Unit vs. E2E?"

**答题框架(三个轴 + 风险驱动):**
- **Manual vs Automated:**
  - 自动化 = 快、可重复、能 scale、适合回归;**但**前期+维护成本高、UI 易变就脆、判断不了 UX。
  - 手动 = 灵活、适合探索性/一次性/体验类;**但**慢、不可重复、不 scale。
- **Unit vs Integration vs E2E(金字塔):**
  - unit = 快/便宜/隔离,但漏集成 bug。
  - E2E = 真实/抓真 bug,但慢/flaky/贵。
  - **往下层压**(大量 unit、少量 E2E);E2E 只放关键用户路径。
- **ML 特有:** offline(快、便宜、但有偏) vs online A/B(真实、但慢、贵、有风险)。

**核心 tradeoff:** **speed × coverage × cost × confidence 不可兼得**。

🟢 **一句话答法:** "我用**风险驱动**——把稳定、高频、高价值的回归自动化,关键路径放少量 E2E,探索性留手动;深度投在 风险×影响 最高的地方。"

🟢 **桥接:** 你在 Moody's/TikTok 正是这么分配——自动化回归 benchmark + 路由验证,手动留给敏感内容判断。

## 2. CI/CD 里怎么实现 quality gates

**Q:** "How would you build quality gates into a CI/CD pipeline?"

**答题框架:** quality gate = 流水线里的**自动检查点**,不达标就**拦住合并/发布**。
- 每次 commit/PR 触发:lint → unit → integration → build → 部署 staging → smoke/E2E → 质量检查 → 任一不过就 block。
- **具体 gate:**
  - 必跑套件 100% 通过
  - coverage ≥ X%
  - 无新增 critical/high 漏洞
  - 性能回归 < Y%
  - (ML)benchmark 指标 ≥ 阈值,否则 block + rollback
- **工具:** GitHub Actions / Jenkins / Buildkite;SonarQube 看质量;canary / staged rollout 作运行时 gate。

**核心 tradeoff:** 闸门**太严**=质量高但拖慢、挡住开发;**太松**=快但回归溜进去。调阈值 + flaky 测试**隔离不阻塞**。

🟢 **桥接(强):** **你的 Safety Index 就是模型版的 CI/CD quality gate**——每次发版自动跑 precision/recall/FPR,不过就拦发布、退化就自动 rollback。你**建过这个 gate**。

## 3. 规模化思维 / 分布式系统测试

**Q:** "How do you test a distributed system at scale? You can't test everything."

**答题框架(测不全,所以换策略):**
- **核心难点:** 多服务、网络、异步、**部分失败(partial failure)**、最终一致性、竞态、非确定性。
- **Contract testing:** 测服务间的**接口契约**(如 Pact),而不是全链路 E2E——团队各测自己那段,接口对得上就行。
- **Chaos engineering:** 主动注入故障(杀节点、加延迟,如 Netflix Chaos Monkey)测韧性。
- **测部分失败:** 重试、幂等(idempotency)、超时、降级、最终一致性。
- **Testing in production:** 测不全就靠 **observability + 监控 + canary + shadow 流量**在线上兜底。

**核心 tradeoff:** 全链路 E2E 在分布式下**慢且脆** → 用 **contract test + 监控 + chaos** 替代「测所有组合」。

🟢 **桥接:** 你在大规模内容/ML 系统里做过自动化路由验证 + 线上监控,理解「测不全、靠分层 + 监控兜底」。

## 4. 海量负载下的性能测试

**Q:** "How do you performance-test a service under massive load?"

**答题框架:**
- **四类:** load(预期峰值)· stress(超过极限找断点)· spike(突发激增)· soak(长时间持续)。见 [qa-automation.md](./qa-automation.md) Load vs Stress。
- **关键指标:**
  - **尾延迟 p95/p99** —— 规模下用户感受的是尾部,不是平均(最重要)
  - 吞吐(QPS) · 错误率 · 资源利用率(CPU/内存) · 饱和点(knee)
- **怎么做:** 工具 JMeter / Locust / k6 / Gatling;造**贴近真实分布**的流量、逐步 ramp、找断点、测 autoscaling 和 failover/降级。

**核心 tradeoff:** 真实负载测试**贵且有风险**(别把 prod 打挂);合成流量**便宜但可能不像**真实流量。

🟢 **桥接:** 模型场景里=inference 吞吐、latency budget、流量激增下的稳定性——和你的 benchmark/性能视角相通。

## 5. 跨多团队 / 多产品的质量流程

**Q:** "How do you keep quality consistent across many teams and products?"

**答题框架:**
- **共享最低标准:** 统一 definition-of-done + 人人必过的 quality gate。
- **平台化:** 一个中心 QA/质量团队提供**工具、dashboard、最佳实践**,各团队复用。
- **可见的质量指标:** 跨团队看 defect escape rate、coverage、incident rate、SLA。
- **团队间用 contract testing** 管接口;**事故有 triage + postmortem** 闭环。
- **文化:** shift-left、开发自己 own 质量,QA 是**赋能**不是**守门**。

**核心 tradeoff:** **中心化标准**=一致但可能拖慢/不合所有团队;**去中心化**=灵活但不一致。平衡 = **共享最低线 + 线上之上团队自治**。

🟢 **桥接:** 你跨 vendor/团队(Moody's、TikTok)工作过,定过 exit criteria、做过质量 dashboard、和 eng/policy 跨职能协作——正是跨团队质量的实战。

---

## 6. 行为 / 情境真题（previously-asked behavioral / situational）

**这些是上一轮真实被问到的题。** 每题 = trap(考什么)→ framework(怎么答)→ 🟢 桥接。**通用框架在此(SST);你的个人 STAR 在各公司 run-sheet,链接回来不复制。**

> **🏷 Provenance:** frameworks = **[public]** 标准 QA 判断 · trap = **[inferred]** 我的解读 · 🟢 桥接里涉及你具体项目/数字 = **🔴 [VERIFY]** 你的 claim,确认真实再说。

**Q1 · "Tell me about a time you sacrificed quality to roll out a feature." ｜ 为赶发布牺牲质量的经历**

- **Trap:** 不是「你有没有偷工减料」,而是你会不会**有判断地**砍**安全的**那个角——留记录、留兜底。
- **Framework — a _bounded, documented_ tradeoff ｜ 有边界、有记录的取舍:**
  - 砍**最低风险面**的覆盖,保**关键路径**。
  - 把取舍**写明**——没覆盖什么、为什么(test debt)。
  - 加**兜底**——监控 / rollback / fast-follow,让风险**有界**。
  - 上线由**和 PM/lead 一起**拍板,不是一个人默默放行。
  - 心法:可让**低风险深度**,不让**高危覆盖**。

**Q2 · "What will you do if there's no documentation to test a feature?" ｜ 没有文档怎么测**

- **Trap:** 没有现成「正确答案」时你还能不能测——你是探索型还是只会跑脚本。
- **Framework — _build_ the oracle from every other source ｜ 自己造 oracle:**
  - **反推意图**——PRD/ticket/diff、相似功能、使用数据。
  - **问人**——找 PM/dev 聊 15 分钟胜过猜;边问边记。
  - **charter 式探索测试**——小 charter,上手试,建「预期行为」模型。
  - **用线上信号**——真实流量 + 日志告诉你「正常」长什么样。
  - **留下文档**——把推导出的行为+用例写下来,你**就成了**那份缺失的文档。

**Q3 · "What if developers are closing the bugs you submitted?" ｜ 开发把你提的 bug 关掉怎么办**

- **Trap:** 你是**情绪化**还是**用数据协作**。
- **Framework — diagnose _why_, then fix the system ｜ 先查原因,再修机制:**
  - **先分清为什么关**:无法复现 / works-as-designed / severity 分歧——各有不同打法。
  - **无法复现 → 消除一切怀疑**:清晰步骤、环境、录屏、确切数据 → 让它**无可辩驳**。
  - **"works as designed" → 回到 spec/PRD**;spec 没写就升级到 **PM 拍产品决定**。
  - **severity 分歧 → 共享 rubric**:用**用户/业务影响**论,不用「我觉得是 P1」。
  - **修机制**:提共享 definition-of-done / triage rubric,别每次重吵。
  - **姿态**:善意假设——目标一致,我带**证据不带对抗**。

**Q4 · "What if your test automation is getting skipped?" ｜ 你的自动化测试被跳过怎么办**

- **Trap:** 你懂不懂自动化**为什么失信**,会不会 **own 套件健康**。
- **Framework — skipped = a _symptom_ ｜ 跳过是症状:**
  - **为什么跳?** 几乎都是 **flaky / 太慢 / 失修**。
  - **flaky 最致命**——一个 flaky 测试毁掉对整套的信任 → **先隔离出阻塞路径,再修根因**。
  - **慢 → 提速**——并行、往金字塔下层压(多 unit、少 E2E)。
  - **让跳过可见**——skipped/flaky dashboard,变成被追踪的债而非静默 skip。
  - **绑到 gate**——只有 **green 是合并/发布的前置**,套件才有权力。

**Q5 · "When would you write a test _plan_ vs a test _strategy_?" ｜ test plan vs test strategy**(知识题,答得干脆)

|                      | **Test Strategy**                                              | **Test Plan**                                                 |
| -------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| **Altitude ｜ 高度** | org / product-wide ｜ 组织/产品级                             | one project / feature / release ｜ 单项目/功能/发布          |
| **Answers ｜ 回答**  | _"how do we test in general?"_ ｜ 总体怎么测                  | _"how do we test THIS, by when, who?"_ ｜ 这个怎么测、何时、谁 |
| **Contains ｜ 含**   | types, tools, environments, standards, automation philosophy  | scope, schedule, resources, entry/exit criteria, deliverables |
| **Lifespan ｜ 寿命** | stable, reused ｜ 稳定、复用                                  | per-release, rewritten ｜ 每次发布重写                       |

- **何时用哪个:** **strategy** = 给产品/团队定**方法论**(少而稳);**plan** = 一次有明确范围的发布(每次写)。
- 🟢 **Hook:** _strategy = the playbook (reused); plan = the game plan for one game (per-release)._ ｜ 战略=可复用的打法手册;计划=单场比赛的部署。

**Q6 · "How would you prioritize your testing?" ｜ 你怎么给测试排优先级**

- **Trap:** 风险驱动(资深)vs「从头测到尾」(初级,规模下不可能)。
- **Framework — risk = likelihood × impact ｜ 风险=概率×影响:**
  - **开口就说:** "I prioritize by **risk** — 测不完所有,深度放在风险最高处。"
  - **抬高优先级的:**
    - 业务/用户关键度——核心流程优先。
    - 影响面/危害——**高危内容(暴力、CSAM-adjacent)优先于低危**。
    - **改动面**——新增/改动的代码及其波及范围。
    - 复杂度 + 历史缺陷密度。
    - 使用频率;合规/安全路径(不可妥协)。
  - **降优先级:** 稳定、低流量、未改动的面 → 只做轻回归。

---

🟢 **通用拔高心法:** 这些题没有标准答案,面试官要看你**会不会权衡**。每题都落到一句「**这是 X 和 Y 之间的 tradeoff,我根据**风险/规模/成本**来选**」——比背定义高一个段位。
