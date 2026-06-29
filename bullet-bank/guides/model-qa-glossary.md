# Model QA Glossary — 模型测试相关术语（QA 视角）

> **🧭 模型-QA 三件套**（互链不重复 — 定义→concepts · 怎么做→workflow · 查词→glossary）:
> - [qa-automation.md](./qa-automation.md) — **概念**（Top 8 · test types · 回归 · 标注）
> - [model-qa-workflow.md](./model-qa-workflow.md) — **流程**（intake · 12 步 · artifact · CSAM）
> - [model-qa-glossary.md](./model-qa-glossary.md) — **术语**（baseline · precision · calibration · drift） ◀ 你在这
>
> **概念归属(哪个概念放哪):**
> - 通用软件测试概念(test pyramid · regression · severity)→ **qa-automation**
> - ML / 模型评测术语(AUC · calibration · drift)→ **glossary**(本文)
> - 安全领域(policy · abuse · 法规)→ **[trust-safety](./trust-safety.md)**
> - precision/recall 两边都有:**测试概念**归 qa-automation · **模型指标**归 glossary。

**这是什么:** 测试模型时会遇到的 ML / model 术语,从 QA 角度一句话讲清。
**🟢 = 对 Chad（ranking / calibration SWE）这轮尤其重要,优先记。**

> **🏷 Provenance:** 全部术语 = **[public]** 标准 ML/QA 定义(无需引用)· 「🟢 对 Chad 优先」的排序 = **[inferred]** 我按他岗位判断 · 「Chad 在 Ads Ranking Calibration」= **[verified]**(读自其 [LinkedIn](https://www.linkedin.com/in/chad-johnson-3012183/))。

---

## 1. 模型基础（lifecycle）
- **Model / 模型版本（version）** —— 一个训练出来的预测系统;每次训练产出一个 version。
- **Classifier（分类器）** 🟢你的本行 —— 把输入分到某个**类别**的模型(「属于哪一类?」):二分类(违规/不违规)或多分类(仇恨/暴力/裸露…);通常输出每类**分数**,再用阈值变标签。
  - T&S 里的「内容分类器」= 给内容打违规/质量分,**你 Safety Index 测的就是它**。
  - 对比:classifier 选**类别** · regression 预测**数值** · ranking 给内容**排序**(Chad 的世界,不是你的)。
  - **In code 长这样:**
    - 本质 = 一个函数:`score = clf.predict_proba(x)` → `label = "violation" if score >= threshold else "clean"`(分数 → 阈值 → 标签;calibration + threshold 就在这一步)。
    - 真模型不是手写规则,是 train 出来的对象(`clf.fit(X, y)`,权重)。
    - QA 读/写的是 **eval 代码**(predictions vs ground-truth labels → precision/recall),**不碰模型内部**。
- **Baseline vs Candidate** 🟢 —— baseline = 当前线上版;candidate = 待测新版 A。**模型测试 = 两者对比**。
- **Training data / training set** —— 训练用的数据（必须和评测集分开,否则等于作弊看答案）。
- **Feature（特征）** —— 喂给模型的输入信号（如广告类别、用户历史)。
- **Inference / prediction** —— 模型对一条输入给出的输出（predicted）。
- **Retrain / fine-tune** —— 用新数据重训 / 在已有模型上微调。
- **Endpoint** —— 模型对外服务的接口（你调它来跑预测）。

## 2. 评测指标（metrics）—— 核心
- **Ground truth / label / annotation** —— 正确答案（见 qa-automation.md「标注」）。
- **Confusion matrix（混淆矩阵）** —— TP / FP / FN / TN 四格,**所有指标的来源**。
- **Precision（精确率）** —— 模型说「是」的里面真的「是」的比例 → 抓**误报**。
- **Recall（召回率）** —— 所有真的「是」里模型抓到的比例 → 抓**漏报**。
- **FPR / FNR（假阳率 / 假阴率）** —— 误报率 / 漏报率。
- **Accuracy（准确率）** —— 全部预测里对的比例（类别不均衡时会骗人）。
- **F1 score** —— precision 和 recall 的调和平均（一个数平衡两者）。
- **Precision–Recall tradeoff** 🟢 —— 调阈值:阈值高 → precision↑ recall↓,反之亦然。
- **AUC / ROC** 🟢 —— **ROC 曲线下的面积**;一个数总结模型在**所有阈值**下的**区分/排序能力**。
  - ROC 曲线 = 扫阈值时 **TPR(recall) vs FPR** 描出的线;AUC = 它下面的面积。
  - 直觉:AUC = 「随机一个正、一个负,模型给正的打分更高」的概率;**1.0 完美 · 0.5 瞎猜**。
  - **只看排序、不看 calibration**(分数值准不准);**阈值无关**。
  - 🔴 违规稀少(低 prevalence / 类别不均衡)时用 **PR-AUC**(precision-recall);ROC-AUC 会虚高(干净样本基数大、FPR 分母巨大)。
- **Calibration（校准）** 🟢🟢 —— 模型给 0.8 的那批,真有 ~80% 是正 → **分数可信**。Chad 的本行。
- **Threshold / operating point（阈值 / 工作点）** 🟢 —— 把分数变成「是/否」的那条线;设在哪是关键决策。
- **Confidence / score（置信度 / 分数）** —— 模型输出的概率（0–1）,不是直接的是/否。

📌 **Benchmarking vs. Calibration**
- **EN:**
  - *Benchmarking* = the **whole evaluation activity** — run the model on a labeled set, compute a **suite of metrics**, compare to baseline, decide if it ships.
  - *Calibration* = **one specific property you benchmark** — are the predicted probabilities trustworthy (of those scored 0.8, do ~80% actually happen)?
  - A model can **rank well (high AUC) yet be miscalibrated**; when a **threshold acts on the absolute score**, calibration matters as much as AUC.
  - Analogy: benchmarking = the full health check-up; calibration = one item in it (is the blood-pressure reading accurate).
- **中文:** **Benchmarking** 是整个评测活动(在标注集上跑模型、算**一组**指标、和 baseline 比、判能不能上);**Calibration** 是其中**专门测的一个维度**——预测概率准不准(说 0.8 的那批,实际是不是 ~80% 发生)。模型可以**排序很好(AUC 高)但 calibration 很差**;当**阈值 / 排序 / 出价**依赖**绝对分数**时,calibration 和 AUC 一样要命。

📌 **Score-driven model（分数驱动的模型）— AUC vs Calibration vs Threshold**
- **EN:** A *score-driven model* outputs a continuous score (0–1) that downstream logic **acts on** — via a **threshold** ("risk > 0.8 → remove") or ranking. For these, benchmark BOTH:
  - **AUC** = is the *ordering* right? (separates bad from good across all thresholds)
  - **Calibration** = are the *score values* right? (of those scored 0.8, ~80% truly positive)
  - **Threshold / operating point** = where you cut (the precision/recall tradeoff)
  - A model can have **high AUC but bad calibration** — swap it in, keep the old threshold → overkill spikes (the A1 case).
- **中文:** 分数驱动模型 = 输出连续分数、下游靠它**卡阈值 / 排序**。要**同时** benchmark:**AUC**(顺序对不对)· **Calibration**(分数值准不准)· **阈值/工作点**(在哪切,精召权衡)。AUC 高 ≠ calibration 好;换模型沿用旧阈值就会**误杀飙升**。

## 3. 评测方法（methodology）
- **Golden set / eval set / test set** —— 已标注的评测数据（考卷）。
- **Train / validation / test split** —— 数据三分:训练 / 调参 / 最终评测,不能混。
- **Offline vs Online eval** 🟢 —— 离线（用历史标注数据测）vs 在线（上线后用真实流量 A/B 测）。
- **A/B test（对照实验）** 🟢 —— 一部分流量给新模型（treatment）、一部分给旧的（control），比真实效果。
- **Slice / segment 分析** 🟢 —— 按语言 / 地区 / 类型拆开看,防「整体涨、局部跌」。
- **Model regression（模型回归）** —— 新版在某指标上比旧版退化。
- **Backtest（回测）** —— 用过去的数据回放检验。

## 4. 模型质量问题（failure modes）
- **False positive / negative（误报 / 漏报）** —— 两类错误。
- **Drift（漂移）** 🟢 —— 线上数据随时间变了、模型变差。data drift（输入变）vs concept drift（规律变）。
- **Bias / fairness（偏差 / 公平性）** —— 模型在某些群体上系统性更差。
- **Overfitting / underfitting** —— 过拟合（只背住训练集）/ 欠拟合（没学够）。
- **Edge case / adversarial（边界 / 对抗）** —— 罕见的、或故意构造来骗模型的输入。
- **Hallucination（幻觉）** —— 生成 / LLM 模型编造不实内容（若涉及）。

## 5. 上线 & 运维（serving / rollout）
- **Shadow mode（影子模式）** —— 新模型先「只看不动」地跑,对比但不影响用户。
- **Canary / staged rollout（灰度 / 分阶段）** —— 先放给 1% 用户,没问题再扩。
- **Rollback（回滚）** 🟢 —— 出问题立刻退回上一个好版本（你的 Safety Index 自动做这个）。
- **Latency / throughput / QPS** —— 延迟 / 吞吐 / 每秒请求数（performance testing 看这些）。
- **Feature store** —— 统一存放、复用 feature 的系统。

---

## 🟢 Chad 这轮的「必懂 8 个」
baseline vs candidate · precision/recall · calibration · threshold · A/B test · slice 分析 · regression · rollback —— 这 8 个能串成一句话讲你怎么测一次 ranking 模型更新。
