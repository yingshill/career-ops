# Study Skill (Learning System) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable `study` skill — a router + three markdown doc-types + a spaced-repetition scheduler — that makes studying any topic deliberate, and proves it on the live Meta QA prep.

**Architecture:** A self-contained skill folder at `.claude/skills/study/` holding `SKILL.md` (trigger · router · ritual · note-taking), three `templates/*.template.md`, and `review.mjs` (the only code — a Leitner spaced-repetition CLI over a markdown deck). Pure functions are unit-tested with Node's built-in test runner; the markdown files are validated by use.

**Tech Stack:** Node.js ESM (`.mjs`), `node:test` + `node:assert/strict` (built-in, zero new deps), Markdown.

## Global Constraints

- ESM only: `.mjs` files, `import`/`export` syntax (repo has no `"type"` in package.json).
- Zero new dependencies: tests use built-in `node:test` + `node:assert/strict`; no jest/pytest/vitest.
- The skill folder must stay **self-contained** (no imports outside `.claude/skills/study/`) so it can later be copied to `~/.claude/skills/study/`.
- Recall-deck format is a Markdown table with columns exactly: `id | Q | A | box | due`.
- Leitner boxes 1–5 with intervals (days): `{1:1, 2:2, 3:4, 4:8, 5:16}`.
- Dates are `YYYY-MM-DD` strings, computed in UTC.
- Commit messages end with: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

### Task 1: Scaffold skill + SKILL.md

**Files:**
- Create: `.claude/skills/study/SKILL.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the `study` skill discoverable by Claude Code (auto-discovered from `.claude/skills/`).

- [ ] **Step 1: Create `.claude/skills/study/SKILL.md`** with this exact content:

````markdown
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
````

- [ ] **Step 2: Verify the file exists and has the key sections**

Run: `test -f .claude/skills/study/SKILL.md && grep -c -E "^## (1|2|3|4|5|6)\." .claude/skills/study/SKILL.md`
Expected: prints `6`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/study/SKILL.md
git commit -m "feat(study): scaffold study skill with router and ritual

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: The three doc-type templates

**Files:**
- Create: `.claude/skills/study/templates/study-note.template.md`
- Create: `.claude/skills/study/templates/practice-log.template.md`
- Create: `.claude/skills/study/templates/recall-deck.template.md`

**Interfaces:**
- Consumes: nothing.
- Produces: templates the skill copies when starting a topic. The recall-deck template defines the table format `review.mjs` parses (Tasks 3–7).

- [ ] **Step 1: Create `study-note.template.md`**

```markdown
# {Topic} — Study Note

**You're in:** the study note — *what I'm learning*. Plan-heavy early; fills with cited knowledge as we go.

## 🎯 Delivery goal & audience
- Goal:
- Audience:
- Why now:

## 📋 Study Plan
- [ ] Unit 1 —
- [ ] Unit 2 —

## 📊 Skill scorecard
| Skill | Status (🔴/🟡/🟢/⚪) | Note |
|---|---|---|

## 🧭 My Read (BOTTOM LINE)
_Bottom-line first, then themes._

## 📚 What it is (cited facts)
_Every fact carries `[R#]`. Tag unconfirmed `[VERIFY]`._

## ❓ Open questions
- [ ] [VERIFY] …

## 🗂 Reasoning trail
_Superseded hypotheses, kept not deleted._

## 📎 References
- [R1] …
```

- [ ] **Step 2: Create `practice-log.template.md`**

```markdown
# {Topic} — Practice Log (coaching journal)

**You're in:** the practice log — *how I'm doing*: attempts, mistakes, patterns, what's locked.

**Legend:** 🔴 shaky · 🟡 developing · 🟢 solid · ⚪ not yet drilled

## 📊 Skill scorecard
| Skill area | Status | Note |
|---|---|---|

## 🔁 Patterns I'm watching
_Recurring mistake → the rule to drill._

## 🟢 Locked
_Consistently solid — stop re-drilling._

## 🗒 Session log (newest first)
### {DATE} — Session 1
- Covered:
- Mistakes / patterns:
```

- [ ] **Step 3: Create `recall-deck.template.md`**

```markdown
# {Topic} — Recall Deck

> Spaced-repetition cards. List due: `node .claude/skills/study/review.mjs <this-file>`
> Grade: `… --grade <id> pass|fail`. Boxes 1–5 → 1/2/4/8/16 days. Pass: box+1. Fail: box→1.

| id | Q | A | box | due |
|----|---|---|-----|-----|
| 1 | {question} | {answer} | 1 | {YYYY-MM-DD} |
```

- [ ] **Step 4: Verify all three exist**

Run: `ls .claude/skills/study/templates/ | sort | tr '\n' ' '`
Expected: `practice-log.template.md recall-deck.template.md study-note.template.md `

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/study/templates/
git commit -m "feat(study): add study-note, practice-log, recall-deck templates

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: `review.mjs` — `addDays` + `parseDeck`

**Files:**
- Create: `.claude/skills/study/review.mjs`
- Test: `.claude/skills/study/review.test.mjs`

**Interfaces:**
- Produces:
  - `addDays(dateStr: string, n: number) -> string` (UTC, `YYYY-MM-DD`)
  - `parseDeck(md: string) -> { cards: Array<{id:string, q:string, a:string, box:number, due:string}>, skipped: string[] }`
  - `INTERVALS: {1:1,2:2,3:4,4:8,5:16}`

- [ ] **Step 1: Write the failing test** — create `.claude/skills/study/review.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays, parseDeck, INTERVALS } from './review.mjs';

test('INTERVALS are the Leitner steps', () => {
  assert.deepEqual(INTERVALS, { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 });
});

test('addDays adds days in UTC', () => {
  assert.equal(addDays('2026-06-26', 1), '2026-06-27');
  assert.equal(addDays('2026-06-30', 2), '2026-07-02');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
});

test('parseDeck reads valid card rows and skips the header/separator', () => {
  const md = [
    '| id | Q | A | box | due |',
    '|----|---|---|-----|-----|',
    '| 1 | What is regression testing? | Re-run known tests. | 2 | 2026-06-28 |',
  ].join('\n');
  const { cards, skipped } = parseDeck(md);
  assert.equal(cards.length, 1);
  assert.deepEqual(cards[0], { id: '1', q: 'What is regression testing?', a: 'Re-run known tests.', box: 2, due: '2026-06-28' });
  assert.equal(skipped.length, 0);
});

test('parseDeck skips malformed rows', () => {
  const md = [
    '| id | Q | A | box | due |',
    '|----|---|---|-----|-----|',
    '| 2 | too few cols |',
    '| 3 | bad box | a | notanumber | 2026-06-28 |',
    '| 4 | bad date | a | 1 | 2026-13-99x |',
  ].join('\n');
  const { cards, skipped } = parseDeck(md);
  assert.equal(cards.length, 0);
  assert.equal(skipped.length, 3);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test .claude/skills/study/review.test.mjs`
Expected: FAIL — cannot find module `./review.mjs` (not created yet).

- [ ] **Step 3: Create `review.mjs` with the minimal implementation**

```js
import { pathToFileURL } from 'url';

export const INTERVALS = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 };

export function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function parseDeck(md) {
  const cards = [];
  const skipped = [];
  const rows = md.split('\n').filter((l) => l.trim().startsWith('|'));
  for (const row of rows) {
    const cells = row.split('|').slice(1, -1).map((c) => c.trim());
    if (cells[0] === 'id' || /^-+$/.test(cells[0] || '')) continue; // header / separator
    if (cells.length !== 5) { skipped.push(row); continue; }
    const [id, q, a, box, due] = cells;
    const boxNum = Number(box);
    if (!Number.isInteger(boxNum) || boxNum < 1 || !/^\d{4}-\d{2}-\d{2}$/.test(due)) { skipped.push(row); continue; }
    cards.push({ id, q, a, box: boxNum, due });
  }
  return { cards, skipped };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test .claude/skills/study/review.test.mjs`
Expected: PASS (all tests in the file pass).

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/study/review.mjs .claude/skills/study/review.test.mjs
git commit -m "feat(study): review.mjs deck parsing + UTC date math

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: `review.mjs` — `dueCards`

**Files:**
- Modify: `.claude/skills/study/review.mjs`
- Test: `.claude/skills/study/review.test.mjs`

**Interfaces:**
- Consumes: `parseDeck` card shape from Task 3.
- Produces: `dueCards(cards, today: string) -> cards[]` (cards where `due <= today`).

- [ ] **Step 1: Append the failing test** to `review.test.mjs`:

```js
import { dueCards } from './review.mjs';

test('dueCards returns cards due on or before today', () => {
  const cards = [
    { id: '1', q: 'a', a: 'a', box: 1, due: '2026-06-25' },
    { id: '2', q: 'b', a: 'b', box: 1, due: '2026-06-26' },
    { id: '3', q: 'c', a: 'c', box: 1, due: '2026-06-27' },
  ];
  const due = dueCards(cards, '2026-06-26');
  assert.deepEqual(due.map((c) => c.id), ['1', '2']);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test .claude/skills/study/review.test.mjs`
Expected: FAIL — `dueCards` is not exported.

- [ ] **Step 3: Add the implementation** to `review.mjs`:

```js
export function dueCards(cards, today) {
  return cards.filter((c) => c.due <= today);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `node --test .claude/skills/study/review.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/study/review.mjs .claude/skills/study/review.test.mjs
git commit -m "feat(study): review.mjs due-card filter

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: `review.mjs` — `grade`

**Files:**
- Modify: `.claude/skills/study/review.mjs`
- Test: `.claude/skills/study/review.test.mjs`

**Interfaces:**
- Consumes: `INTERVALS`, `addDays` (Task 3); card shape.
- Produces: `grade(card, result: 'pass'|'fail', today: string) -> card` (new box + due).

- [ ] **Step 1: Append the failing test** to `review.test.mjs`:

```js
import { grade } from './review.mjs';

test('grade pass bumps the box and pushes due out', () => {
  const card = { id: '1', q: 'a', a: 'a', box: 2, due: '2026-06-26' };
  const out = grade(card, 'pass', '2026-06-26');
  assert.equal(out.box, 3);           // 2 -> 3
  assert.equal(out.due, '2026-06-30'); // today + INTERVALS[3] (4 days)
});

test('grade pass caps the box at 5', () => {
  const card = { id: '1', q: 'a', a: 'a', box: 5, due: '2026-06-26' };
  const out = grade(card, 'pass', '2026-06-26');
  assert.equal(out.box, 5);
  assert.equal(out.due, '2026-07-12'); // today + 16 days
});

test('grade fail resets the box to 1', () => {
  const card = { id: '1', q: 'a', a: 'a', box: 4, due: '2026-06-26' };
  const out = grade(card, 'fail', '2026-06-26');
  assert.equal(out.box, 1);
  assert.equal(out.due, '2026-06-27'); // today + 1 day
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test .claude/skills/study/review.test.mjs`
Expected: FAIL — `grade` is not exported.

- [ ] **Step 3: Add the implementation** to `review.mjs`:

```js
export function grade(card, result, today) {
  const box = result === 'pass' ? Math.min(5, card.box + 1) : 1;
  return { ...card, box, due: addDays(today, INTERVALS[box]) };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `node --test .claude/skills/study/review.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/study/review.mjs .claude/skills/study/review.test.mjs
git commit -m "feat(study): review.mjs Leitner grading

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: `review.mjs` — `renderTable` + `replaceTable`

**Files:**
- Modify: `.claude/skills/study/review.mjs`
- Test: `.claude/skills/study/review.test.mjs`

**Interfaces:**
- Consumes: card shape.
- Produces:
  - `renderTable(cards) -> string` (the `| id | Q | A | box | due |` block)
  - `replaceTable(md, cards) -> string` (md with its first table block swapped for the rendered cards; preamble/header preserved)

- [ ] **Step 1: Append the failing test** to `review.test.mjs`:

```js
import { renderTable, replaceTable } from './review.mjs';

test('renderTable emits a header, separator, and one row per card', () => {
  const out = renderTable([{ id: '1', q: 'a', a: 'b', box: 2, due: '2026-06-28' }]);
  const lines = out.split('\n');
  assert.equal(lines[0], '| id | Q | A | box | due |');
  assert.equal(lines[1], '|----|---|---|-----|-----|');
  assert.equal(lines[2], '| 1 | a | b | 2 | 2026-06-28 |');
});

test('replaceTable preserves the preamble and swaps the table', () => {
  const md = [
    '# Deck',
    '',
    'some preamble',
    '',
    '| id | Q | A | box | due |',
    '|----|---|---|-----|-----|',
    '| 1 | a | b | 1 | 2026-06-26 |',
  ].join('\n');
  const out = replaceTable(md, [{ id: '1', q: 'a', a: 'b', box: 2, due: '2026-06-28' }]);
  assert.ok(out.includes('some preamble'));
  assert.ok(out.includes('| 1 | a | b | 2 | 2026-06-28 |'));
  assert.ok(!out.includes('2026-06-26'));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test .claude/skills/study/review.test.mjs`
Expected: FAIL — `renderTable` / `replaceTable` not exported.

- [ ] **Step 3: Add the implementation** to `review.mjs`:

```js
export function renderTable(cards) {
  const header = '| id | Q | A | box | due |\n|----|---|---|-----|-----|';
  const rows = cards.map((c) => `| ${c.id} | ${c.q} | ${c.a} | ${c.box} | ${c.due} |`);
  return [header, ...rows].join('\n');
}

export function replaceTable(md, cards) {
  const lines = md.split('\n');
  const tableIdx = lines.map((l, i) => (l.trim().startsWith('|') ? i : -1)).filter((i) => i >= 0);
  if (tableIdx.length === 0) return `${md.trimEnd()}\n\n${renderTable(cards)}\n`;
  const first = tableIdx[0];
  const last = tableIdx[tableIdx.length - 1];
  return [...lines.slice(0, first), renderTable(cards), ...lines.slice(last + 1)].join('\n');
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `node --test .claude/skills/study/review.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/study/review.mjs .claude/skills/study/review.test.mjs
git commit -m "feat(study): review.mjs table render + in-place table replace

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: `review.mjs` — CLI (`main`) + error handling

**Files:**
- Modify: `.claude/skills/study/review.mjs`

**Interfaces:**
- Consumes: all functions from Tasks 3–6.
- Produces: a runnable CLI — `node review.mjs <deck.md>` lists due cards; `--grade <id> pass|fail` updates the deck file in place.

- [ ] **Step 1: Add the CLI to the bottom of `review.mjs`**

```js
import { readFileSync, writeFileSync, existsSync } from 'fs';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function main(argv) {
  const deckPath = argv[2];
  if (!deckPath) {
    console.error('Usage: node review.mjs <deck.md> [--grade <id> <pass|fail>]');
    process.exit(1);
  }
  if (!existsSync(deckPath)) {
    console.error(`Deck not found: ${deckPath}`);
    process.exit(1);
  }
  const md = readFileSync(deckPath, 'utf-8');
  const { cards, skipped } = parseDeck(md);
  if (skipped.length) console.error(`⚠️  Skipped ${skipped.length} malformed row(s).`);

  const gi = argv.indexOf('--grade');
  if (gi !== -1) {
    const id = argv[gi + 1];
    const result = argv[gi + 2];
    if (!['pass', 'fail'].includes(result)) {
      console.error('Grade must be pass|fail');
      process.exit(1);
    }
    const card = cards.find((c) => c.id === id);
    if (!card) {
      console.error(`No card with id ${id}`);
      process.exit(1);
    }
    const updated = grade(card, result, todayStr());
    const newCards = cards.map((c) => (c.id === id ? updated : c));
    writeFileSync(deckPath, replaceTable(md, newCards));
    console.log(`Card ${id}: ${result} → box ${updated.box}, next due ${updated.due}`);
    return;
  }

  if (!cards.length) {
    console.log('Deck is empty — add some cards.');
    return;
  }
  const due = dueCards(cards, todayStr());
  if (!due.length) {
    console.log('✅ Nothing due today.');
    return;
  }
  console.log(`📇 ${due.length} card(s) due today:\n`);
  for (const c of due) console.log(`  [${c.id}] Q: ${c.q}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv);
```

- [ ] **Step 2: Run the existing unit tests to confirm nothing broke**

Run: `node --test .claude/skills/study/review.test.mjs`
Expected: PASS (CLI addition doesn't touch the pure functions).

- [ ] **Step 3: Smoke-test the CLI end-to-end**

```bash
mkdir -p /tmp/study-smoke && cat > /tmp/study-smoke/deck.md <<'EOF'
# Smoke — Recall Deck

| id | Q | A | box | due |
|----|---|---|-----|-----|
| 1 | What is regression testing? | Re-run known tests after a change. | 1 | 2020-01-01 |
EOF
node .claude/skills/study/review.mjs /tmp/study-smoke/deck.md
node .claude/skills/study/review.mjs /tmp/study-smoke/deck.md --grade 1 pass
grep -q "box" /tmp/study-smoke/deck.md && tail -1 /tmp/study-smoke/deck.md
node .claude/skills/study/review.mjs /tmp/study-smoke/missing.md; echo "exit=$?"
```
Expected:
- First call prints `📇 1 card(s) due today:` then `[1] Q: What is regression testing?`
- Grade call prints `Card 1: pass → box 2, next due <16-days-after-grade? no — box 2 = 2 days>` (box becomes 2; due = today+2).
- The `tail -1` shows the row now has `box` = 2 and a future `due`.
- Missing-file call prints `Deck not found: …` and `exit=1`.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/study/review.mjs
git commit -m "feat(study): review.mjs CLI — list due + grade with file writeback

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Prove it — seed the Meta QA recall deck end-to-end

**Files:**
- Create: `interview-prep/meta-qa-analyst/recall-deck.md`
- Modify: `interview-prep/meta-qa-analyst/_set.yml` (register the deck)

**Interfaces:**
- Consumes: the `recall-deck` template (Task 2) + `review.mjs` (Tasks 3–7).
- Produces: the first real recall deck — completes the missing "retention" tool for the live prep.

- [ ] **Step 1: Create `interview-prep/meta-qa-analyst/recall-deck.md`** from the template, seeded with 6 cards distilled from the QA prep (use today's date as `due` so they all show on first run; replace `{TODAY}` with the actual `YYYY-MM-DD`):

```markdown
# Meta QA Analyst — Recall Deck

> Spaced-repetition cards. List due: `node .claude/skills/study/review.mjs interview-prep/meta-qa-analyst/recall-deck.md`
> Grade: `… --grade <id> pass|fail`. Boxes 1–5 → 1/2/4/8/16 days.

| id | Q | A | box | due |
|----|---|---|-----|-----|
| 1 | What is regression testing? | Re-run a known test set after any change to confirm nothing that worked is now broken. | 1 | {TODAY} |
| 2 | Severity vs priority? | Severity = technical impact; priority = business urgency to fix. | 1 | {TODAY} |
| 3 | The 4-step way to read code aloud? | What it does → trace inputs/outputs → edge case/bug → the test you'd write. | 1 | {TODAY} |
| 4 | What is model calibration? | Scores mean what they claim — among 0.8-confidence predictions, ~80% are truly positive. | 1 | {TODAY} |
| 5 | Why does Ads Ranking Calibration care about calibration? | Ranking/auction prices on predicted probabilities; miscalibration breaks bidding, revenue, trust. | 1 | {TODAY} |
| 6 | The honest gap line for "5+ yrs software QA"? | Quality background is AI/content side — benchmarking, UAT, unsafe-content testing; would ramp on the specific test-case tooling. | 1 | {TODAY} |
```

- [ ] **Step 2: Register the deck in `_set.yml`** — add under `files:`:

```yaml
  recall_deck: interview-prep/meta-qa-analyst/recall-deck.md
```

- [ ] **Step 3: Run the deck end-to-end**

Run: `node .claude/skills/study/review.mjs interview-prep/meta-qa-analyst/recall-deck.md`
Expected: `📇 6 card(s) due today:` followed by the six questions.

- [ ] **Step 4: Confirm the set linter still passes**

Run: `node check-prep-sync.mjs meta-qa-analyst`
Expected: `🟢 meta-qa-analyst — in sync`

- [ ] **Step 5: Commit**

```bash
git add interview-prep/meta-qa-analyst/recall-deck.md interview-prep/meta-qa-analyst/_set.yml
git commit -m "feat(study): seed Meta QA recall deck, proving the study skill end-to-end

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- §3 Architecture (skill folder, SKILL.md, templates, review.mjs) → Tasks 1, 2, 3–7. ✅
- §4 Router (extensible table) → Task 1 SKILL.md §2. ✅
- §5 Toolkit (3 doc-types) → Task 2 templates. ✅
- §6 Ritual (human gate, Study→Practice loop) → Task 1 SKILL.md §3. ✅
- §7 Note-taking model → Task 1 SKILL.md §5. ✅
- §8 review.mjs (parse, due, Leitner grade, writeback, errors) → Tasks 3–7. ✅
- §9 Extraction (self-contained folder) → Global Constraints + no external imports. ✅
- §10 Testing (review.mjs unit tests) → Tasks 3–7 test steps. ✅
- §11 "Prove on Meta prep" + recall deck is the new tool → Task 8. ✅

**Placeholder scan:** `{TODAY}` in Task 8 is an explicit, instructed substitution (replace with the run date), not an unfilled placeholder. No "TBD/TODO/handle edge cases" left.

**Type consistency:** card shape `{id:string, q, a, box:number, due:string}` is consistent across `parseDeck`, `dueCards`, `grade`, `renderTable`, `replaceTable`, and `main`. `INTERVALS` keys 1–5 match `grade`'s capped box. `addDays` used by `grade` and tested directly.
