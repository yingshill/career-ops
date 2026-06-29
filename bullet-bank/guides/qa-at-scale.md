# QA at Scale — senior / 规模化问题（面试拔高）

**这是什么:** 给 SWE 面试官(如 Chad)准备的**进阶 QA 问题**——测试方法 tradeoff、CI/CD quality gates、分布式系统测试、海量负载性能测试、跨团队质量流程。
**配套:** 基础概念在 [qa-automation.md](./qa-automation.md);模型测试在 [model-qa-workflow.md](./model-qa-workflow.md)。这里是**规模化 & 策略**层。
**每题结构:** Q(可能怎么问) → 答题框架 → 核心 tradeoff → 🟢 桥接你的经验。

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

🟢 **通用拔高心法:** 这些题没有标准答案,面试官要看你**会不会权衡**。每题都落到一句「**这是 X 和 Y 之间的 tradeoff,我根据**风险/规模/成本**来选**」——比背定义高一个段位。
