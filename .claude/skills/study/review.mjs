import { readFileSync, writeFileSync, existsSync } from 'fs';
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

export function dueCards(cards, today) {
  return cards.filter((c) => c.due <= today);
}

export function grade(card, result, today) {
  const box = result === 'pass' ? Math.min(5, card.box + 1) : 1;
  return { ...card, box, due: addDays(today, INTERVALS[box]) };
}

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
