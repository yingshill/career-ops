---
name: study
description: Deliberate learning system — routes a topic to the right method and tools (study note, practice log, recall deck), runs a Study→Practice loop with a human gate, and schedules spaced-repetition reviews. Use when the user says "let's study/learn/dig into X" or a turn is clearly learning rather than building.
---

# Study — a deliberate learning system

Operationalizes the Study Mode / Deep-dive / paper-study spec in the user's global `CLAUDE.md` (that file owns the philosophy; this skill is the runnable toolkit).

## 1. Trigger
Activate when the user says "let's study / learn / dig into / understand X," or when a turn is clearly learning/research/prep rather than build/execute.

## 2. Route — pick method + tools by learning type
Append rows as new types emerge.

| Learning type | Method | Tools to pull |
|---|---|---|
| Interview / meeting prep | Deep-dive + practice-heavy | study-note · practice-log · recall-deck · mocks |
| Read a paper / long doc | Chapter loop (pace · triage · pause) | study-note · recall-deck |
| Master a skill to perform | "I do → we do → you do" drills | practice-log · recall-deck |
| Memorize facts (terms/vocab) | Spaced-repetition heavy | recall-deck · review.mjs |
| Evaluate a decision | Cited synthesis → options + recommendation | study-note |
| Explore a domain broadly | Breadth-first map, then deepen | study-note |

## 3. Ritual
1. Route (above).
2. Scope & Plan — frame goal/audience/output; create the study note from `templates/study-note.template.md`; open it.
3. Research — cite every fact `[R#]`, tag `[VERIFY]`, no fabrication; check off plan items.
4. 🚪 Human gate — STOP. The user confirms plan + scope before proceeding.
5. Materials — assemble study material or point to a course/reading.
6. Per-unit loop (for each plan unit A): Study A → Practice A (log to practice-log) → Recall A (add cards to recall-deck). Study and practice may run in parallel on the same unit.
7. Checkpoint — update the scorecard; "what stuck?"; propose the collaboration split.
8. Graduate — promote to a deliverable / DECISIONS.md / ROADMAP.md when real.

## 4. Doc-types (create from `templates/`)
- **study-note** (direction + rigor): plan · scorecard · cited facts · references.
- **practice-log** (performance): attempts · mistakes · patterns · scorecard.
- **recall-deck** (retention): flashcards fed to `review.mjs`.

Artifacts live with the work: `interview-prep/{company}/` for interviews, `study/{topic}/` otherwise.

## 5. Note-taking — human-owned, AI-assisted
Two interchangeable gears: (a) the user authors; (b) AI quick-captures concise cited notes → the user digests and modifies. Always audit before append (re-read first), never clobber, flag conflicts.

## 6. Spaced repetition
- List what's due: `node .claude/skills/study/review.mjs <path-to-recall-deck.md>`
- After review: `node .claude/skills/study/review.mjs <path> --grade <id> pass|fail`
- Pass bumps the card up a box (longer interval); fail resets it to box 1.
