# Learning System (`study` skill) — Design Spec

**Date:** 2026-06-26
**Status:** Approved design — pending implementation plan
**Author:** Yingshi Liu + Claude (brainstorming session)

---

## 1. Purpose

Build a reusable **learning system** that makes studying any topic deliberate and effective. It turns the ad-hoc study habits already used in this repo into a named toolkit with a consistent ritual, so each learning session knows *which tools and method to reach for*.

It must address four learning pain points, all of which the user confirmed matter:
- **Direction & progress** — rabbit-holing, losing the big picture, not knowing if improving.
- **Rigor & sources** — losing track of where facts came from, verified vs. assumed, fabrication risk.
- **Performance** — understanding a thing but freezing when it must be performed (interview, explain aloud, apply).
- **Retention** — understanding in the moment but not remembering later.

## 2. Scope decision

**Build it in career-ops now; design it for clean extraction to a personal cross-project skill later.**

- The skill lives in `career-ops/.claude/skills/study/`, written generically (no career-specific content baked into the skill code or templates).
- It is proven against the live Meta QA interview prep, then lifted out to `~/.claude/skills/study/` once the shape is settled.
- The only career-specific concern is *where filled artifacts land*, which is parameterized (inferred from context), not hardcoded.

## 3. Architecture & home

A standalone **`study` skill**:

```
.claude/skills/study/
  SKILL.md                      # trigger · router · ritual · tool usage · note-taking model
  templates/
    study-note.template.md
    practice-log.template.md
    recall-deck.template.md
  review.mjs                    # spaced-repetition scheduler (the only code)
```

- The skill **operationalizes** the Study Mode / Deep-dive / paper-study spec already in the user's global `CLAUDE.md`. That file remains the source of truth for the *philosophy*; the skill is the *runnable toolkit* (router + templates + script) that points back to it. No duplication.
- **Filled artifacts** live with the work they serve, per existing convention:
  - Interview prep → `interview-prep/{company}/`
  - Any other topic → `study/{topic}/`

## 4. The router (extensible)

The skill's first move is to **classify the learning type**, then prescribe the method and the subset of tools. The router is a simple table that the user/AI **append rows to** as new learning types emerge — it grows without a rebuild.

| Learning type | Method / protocol | Tools to pull |
|---|---|---|
| Interview / meeting prep | Deep-dive + practice-heavy | study-note · practice-log · recall-deck · mocks |
| Read a paper / long doc | Paper-study chapter loop (pace · triage · pause) | study-note · source-ledger · deliverable-hooks |
| Master a skill to *perform* (e.g. code-reading) | "I do → we do → you do" drills | practice-log · recall-deck |
| Memorize a body of facts (terms, vocab) | Spaced-repetition heavy | recall-deck · review.mjs |
| Evaluate a decision / option | Cited synthesis → options + recommendation | study-note (source ledger) |
| Explore a new domain broadly | Breadth-first map, then deepen | study-note · source-ledger |

The router decides **which ritual steps and tools apply** to a given topic — a vocab run is mostly recall, while a paper read is mostly study, so the steps that fire differ by type.

**Tool-name note:** "source-ledger" and "deliverable-hooks" in the table are **facets of the study note** (its cited-facts + references discipline, and a tagged "could-go-in-the-output" lane), not separate files. The physical tools are three: study note, practice log, recall deck.

## 5. The toolkit (doc-types)

Each tool maps to a pain and carries a **technique menu** so a topic can flex its method without leaving the tool.

### 5.1 Study note — *Direction + Rigor* *(already built)*
- **Owns:** the plan, the captured knowledge, and the source ledger.
- **Sections:** delivery goal/audience · study plan checklist · skill scorecard · my read (bottom line first) · what it is (cited facts `[R#]`) · open questions (`[VERIFY]`) · concept deep-dives · reasoning trail · references.
- **Technique menu:** scoping ritual · checkpoints · skim-vs-deep triage · "graduate this" gate · `[R#]` citations · verified/`[VERIFY]` tags · primary-source rule.
- **Split-when-it-grows rule:** for large/long-running topics, the "what it is" knowledge base can graduate into its own file (or a shared guide), leaving the study note focused on plan + direction.

### 5.2 Practice log — *Performance* *(already built)*
- **Owns:** how prep is going — attempts, mistakes, recurring patterns, what's locked.
- **Sections:** skill scorecard (🔴/🟡/🟢/⚪) · patterns I'm watching (recurring mistake → the rule) · locked (stop re-drilling) · session log (newest first).
- **Technique menu:** drills · narrate-aloud · timed mocks · pattern-watch · "I do → we do → you do."

### 5.3 Recall deck — *Retention* *(the gap — new)*
- **Owns:** spaced-repetition flashcards.
- **Format:** a human-readable, git-friendly markdown table: `| Q | A | box | due |`.
- **Fed to** `review.mjs` (Section 7).
- **Technique menu:** flashcards · spaced repetition · active recall · teach-back · self-quiz.

## 6. The mode ritual (lifecycle)

Runs with **audit-before-append** throughout (re-read the note before writing; never clobber the user's edits; flag conflicts instead of silently changing).

1. **Trigger** → learning intent, or a clearly-learning turn.
2. **Route** → classify learning type → method + tools (Section 4).
3. **Scope & Plan** → frame goal / audience / output; create the study note + plan checklist.
4. **Research** → map what needs learning; cite sources; **check off plan items as we go** until the plan is complete.
5. **🚪 Human gate (hard stop)** → the user confirms the plan, scope, and direction. Nothing proceeds until sign-off.
6. **Materials / resources** → assemble or create the study material, **or point to a course/reading** — "study this first."
7. **Per-unit loop — Study A → Practice A** (the core), for each plan unit in order:
   - **Study A** → the user reads/works the material and owns the notes (see Section 8 for the two note-taking gears).
   - **Practice A** → immediately drill/apply *that same unit*; log attempts, mistakes, patterns to the practice log.
   - **Recall A** → distill what stuck into the recall deck.
   - Study and practice may run **in parallel** on the same unit — learn A and exercise A together, not "finish all study, then practice."
8. **Checkpoint** → update the scorecard; "what stuck?"; propose the collaboration split.
9. **Graduate** → promote to a deliverable / `DECISIONS.md` / `ROADMAP.md` when it becomes real.

## 7. Note-taking model

Notes are **human-owned, AI-assisted**, with two interchangeable gears the user switches between freely:
- **You author** — the user writes their own notes.
- **I quick-capture → you refine** — the common mode: AI drafts concise, structured, cited notes from what was just covered; the user digests and modifies.

**Invariants:** AI audits before every append (no clobbering); AI flags conflicts rather than silently editing; the user is the owner and final editor; AI is a fast capture-and-audit tool, not the author of record.

## 8. The one script: `review.mjs`

The only code, because spaced repetition is the one pain automation genuinely helps.

- **Reads** a `recall-deck.md` whose cards are a markdown table `| Q | A | box | due |`.
- **Schedule:** Leitner boxes 1–5 with growing intervals (e.g. 1 / 2 / 4 / 8 / 16 days).
- **`node review.mjs <topic>`** → prints the cards **due today** (`due <= today`).
- **Grading:** a pass bumps a card up one box (longer interval); a fail resets it to box 1. The script updates `box`/`due` in the file (AI may also perform the grading in chat and edit the deck).
- **Errors:** missing deck → friendly message; malformed card row → skip + warn; empty/none-due → "nothing due today."
- **Output:** the deck stays human-editable markdown; all state lives in the file (no DB).

## 9. Extraction plan (future generalization)

- The skill folder is generic; extraction = copy `.claude/skills/study/` → `~/.claude/skills/study/`.
- Parameterize only the artifact location (interview-prep vs study vs another repo's folder), inferred from context.
- Generalize **after** the toolkit is proven on the Meta prep.

## 10. Testing & error handling

- **`review.mjs`** — a small unit test for box/date math (pass advances box + pushes `due`; fail resets to box 1; due-filter is `due <= today`) and for malformed/empty decks.
- **Templates + SKILL.md** — prose, validated by use against the live Meta prep.

## 11. What is new vs. already built

- **Already built organically** this session: study note (`qa-study-plan.md`), the source ledger (its References + cited facts), the practice log (`practice-log.md`).
- **Genuinely new:** the **router**, the **recall deck** + **`review.mjs`**, and packaging it all as the **`study` skill** with templates.

## 12. Open questions

- Exact spaced-repetition intervals (Leitner steps) — start simple, tune with use.
- Whether grading is AI-in-chat, a `review.mjs --grade` flag, or both — decide during planning.
- Trigger wording for the skill (auto-infer vs. an explicit `/study` invocation) — likely both.
