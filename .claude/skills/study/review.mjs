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
