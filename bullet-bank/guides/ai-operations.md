# Domain Research: AI Program & Operations (AI Ops / LLMOps)

A researched brief on the AI-operations field — lifecycle, governance, eval, tooling, demand shifts — plus menus for tailoring resumes. Use it to select/frame bullets (`../domains/ai-operations.md`), mirror a JD's language, and speak credibly in interviews.

_Last researched: 2026-05-27._

> **Rule:** the menus are *vocabulary*, not data. Quantify bullets only with real numbers from `cv.md`. The guide tells you *which metric/term to name*, never *what number to claim*.

> **Lens note:** this domain is the *broad AI-ops/program* framing of Elena's Moody's LLM-eval work — distinct from the `trust-safety.md` content-moderation lens and the `risk-governance.md` advertiser-integrity lens. **One lens per resume.** Use this lens for AI Program Manager / AI Operations / Technical AI PM / LLMOps roles.

---

## 1. Lifecycle & frameworks
- **The AI/ML lifecycle (MLOps → LLMOps):** data → train/fine-tune/prompt → **evaluate** → deploy → **monitor** → iterate. AI Ops owns the right half — eval, deploy, monitor, iterate — not model training.
- **The eval loop (the core skill):** *offline* evals (golden/benchmark datasets, LLM-as-judge, human eval) gate a release; *online* evals (A/B, shadow, canary) verify in production; guardrail metrics + feedback loops catch regressions. Naming this loop signals fluency.
- **Production patterns:** RAG (retrieval-augmented generation), tool-use / function-calling, agents, and **MCP (Model Context Protocol** — open standard, Anthropic 2024) for connecting models to tools/data. **HITL/HOTL** (human-in / on-the-loop) for high-stakes decisions.
- **Maturity model:** prototype → pilot → production → governed-at-scale. Most orgs in 2026 are stuck moving pilots to production — the exact gap AI-ops hires fill.

## 2. Governance & regulation (2026) — a hiring driver
- **NIST AI RMF 1.0** (+ Generative AI Profile, NIST-AI-600-1) — **Govern · Map · Measure · Manage.** The dominant US voluntary scaffold; name it for governance-leaning AI roles.
- **ISO/IEC 42001:2023** — AI Management System (AIMS); the "ISO 27001 for AI." Certification interest rising.
- **EU AI Act** — phased: prohibited practices (Feb 2025), GPAI/foundation-model obligations (Aug 2025), high-risk system obligations (Aug 2026). Risk-tiered; drives demand for AI governance + eval roles.
- **Takeaway:** if a JD mentions responsible AI, model risk, or "AI adoption with guardrails," surface eval (C03), governance/rollback (C13), and incident/drift (C14) bullets.

## 3. Tooling & ecosystem
- **Eval & observability:** LangSmith, Langfuse, Arize Phoenix, Braintrust, Humanloop, Weights & Biases (Weave), OpenAI Evals, DeepEval, Ragas.
- **Orchestration / agents:** LangChain, LlamaIndex, Dify, n8n; CrewAI, AutoGen, LangGraph.
- **Serving / platform:** AWS Bedrock, Google Vertex AI, Azure AI Foundry, Databricks Mosaic, vLLM.
- **MLOps backbone:** MLflow, Kubeflow, SageMaker, Vertex Pipelines.
- **Monitoring / drift:** Arize, Fiddler, WhyLabs, Evidently.
- **Takeaway:** naming an eval/observability tool (or the *pattern* if you used a homegrown one) reads as production fluency; don't claim tools you haven't touched — map your real "Safety Index / eval harness" to the category.

## 4. What's changing now (2026)
- **From building to operating:** demand shifted from training models to **evaluating, deploying, monitoring, and governing** them in production — where Elena's experience sits.
- **Agentic systems:** multi-step tool-using agents need orchestration + guardrails + HITL; "don't let one LLM be everything" — contain errors with eval gates and human ownership.
- **LLM-as-judge + human eval blends:** automated grading scaled by humans for calibration; eval datasets are now a managed asset.
- **AI enablement / adoption:** a fast-growing slice — driving internal teams to actually use AI tools (change management, training, measurement) — maps to C08 + C04.

---

## 5. Core metrics — the AI-ops menu
*(reach for the JD's metric; phrase your real result in that vocabulary)*

**1. Eval quality · 评估质量**
- *Def:* accuracy / precision / recall / F1; for LLMs — faithfulness/groundedness, relevance, hallucination rate, task-success rate, win-rate (LLM-as-judge or human preference). LLM 输出质量：忠实度/相关性/幻觉率/任务成功率/胜率。
- *Use:* gate releases on an eval threshold; report eval-score deltas per model version. 用评估阈值卡发布，按模型版本报告分数变化。

**2. Safety guardrails · 安全护栏**
- *Def:* toxicity, PII leakage, jailbreak/refusal rate, bias/fairness. 毒性/PII 泄露/越狱率/拒答率/偏见。
- *Use:* guardrail thresholds that block promotion to production. 作为上线前的硬性护栏阈值。

**3. Reliability · 可靠性**
- *Def:* latency (p50/p95/p99), throughput (QPS, tokens/sec), uptime/availability, error rate. 延迟/吞吐/可用性/错误率。
- *Use:* SLOs for model services; alert on regressions. 模型服务 SLO + 回归告警。

**4. Cost efficiency · 成本效率**
- *Def:* cost per request / per 1K tokens, GPU utilization, cost per resolved task. 单请求/千 token 成本，GPU 利用率，单任务成本。
- *Use:* trade quality vs cost; justify model/routing choices. 质量-成本权衡，支撑模型与路由选型。

**5. Drift & monitoring · 漂移监控**
- *Def:* data drift, concept drift, embedding drift, eval-score regression over time. 数据漂移/概念漂移/嵌入漂移/评估分数回归。
- *Use:* catch silent degradation upstream, before outcomes move. 在结果恶化前于上游捕捉漂移。

**6. Adoption & impact · 采用与业务影响**
- *Def:* automation coverage / deflection rate, AHT reduction, productivity lift, CSAT, tool-adoption rate. 自动化覆盖/转化率，处理时长下降，生产力提升，满意度，工具采用率。
- *Use:* the business case — what the AI actually saved or unlocked. AI 的真实业务收益。

**7. Lifecycle health · 生命周期健康**
- *Def:* time-to-deploy, eval-pass / canary-pass rate, rollback rate, experiment velocity. 上线时长/评估通过率/灰度通过率/回滚率/实验速度。
- *Use:* readiness & rollback decisions; release governance. 发布就绪与回滚决策。

**Slicing dimensions:** model version · prompt version · use-case/intent · segment · region/language · cost tier. 分层：模型/提示版本、用例、人群、地区语言、成本层级。

## 6. Standard dashboards & artifacts
- **Eval scorecard** — offline + online eval metrics by model/prompt version (the release gate).
- **Model health dashboard** — latency, error rate, cost, throughput (the SLO view).
- **Drift monitor** — input/concept/embedding drift + eval-score trend with alert bands.
- **A/B experiment readout** — variant vs control on quality + business metric + guardrails.
- **Adoption funnel** — eligible volume → AI-handled → human-escalated → satisfied.
- **Cost dashboard** — spend by model/use-case, cost-per-task trend.
- **Model card / eval report** — the governance artifact (capabilities, limits, eval results, risks).

## 7. Role archetypes → competency emphasis
*(maps a JD to bullet-bank competencies — see `../COMPETENCIES.md`)*

| Archetype | Emphasize |
|-----------|-----------|
| AI Program Manager | C05, C03, C02, C08 |
| AI Operations Manager | C04, C03, C13, C14 |
| Technical / AI Product Manager | C05, C02, C10, C09 |
| LLMOps / Eval Lead | C03, C02, C13 |
| AI Enablement / Adoption | C08, C04, C02 |
| Responsible-AI / AI Governance | C13, C03, C07 |

## 8. Common JD requirements (map your bullets against these)
- LLM/GenAI in production (RAG, agents, prompt engineering)
- **Eval design** — datasets, LLM-as-judge, offline/online, quality thresholds
- Model monitoring, drift detection, production readiness & rollback
- Experiment design — A/B, shadow, canary
- Cross-functional with ML / Data Science / Eng (C08)
- Metrics fluency (§5) + SQL / Python
- Human-in-the-loop design; AI governance / responsible AI awareness
- Roadmap & prioritization for AI features (C10)

## 9. ATS vocabulary
AI operations, AI program management, LLMOps, MLOps, model evaluation, eval harness, golden dataset, LLM-as-judge, prompt engineering, RAG, agent, MCP, function calling, hallucination, groundedness, drift monitoring, A/B testing, shadow/canary, human-in-the-loop, model lifecycle, production readiness, rollback, feedback loop, NIST AI RMF, ISO 42001, EU AI Act, AI governance, responsible AI, automation coverage, deflection, model card

---

## Sources
- NIST AI RMF + Generative AI Profile — [nist.gov/itl/ai-risk-management-framework](https://www.nist.gov/itl/ai-risk-management-framework)
- ISO/IEC 42001:2023 — [iso.org/standard/81230.html](https://www.iso.org/standard/81230.html)
- EU AI Act timeline — [artificialintelligenceact.eu/implementation-timeline](https://artificialintelligenceact.eu/implementation-timeline/)
- Model Context Protocol — [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- LLM eval practice — [LangSmith](https://docs.smith.langchain.com/), [Arize Phoenix](https://phoenix.arize.com/), [Braintrust](https://www.braintrust.dev/)
