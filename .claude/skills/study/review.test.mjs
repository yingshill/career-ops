import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays, parseDeck, INTERVALS } from './review.mjs';
import { dueCards } from './review.mjs';

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

test('dueCards returns cards due on or before today', () => {
  const cards = [
    { id: '1', q: 'a', a: 'a', box: 1, due: '2026-06-25' },
    { id: '2', q: 'b', a: 'b', box: 1, due: '2026-06-26' },
    { id: '3', q: 'c', a: 'c', box: 1, due: '2026-06-27' },
  ];
  const due = dueCards(cards, '2026-06-26');
  assert.deepEqual(due.map((c) => c.id), ['1', '2']);
});

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
