#!/usr/bin/env node
/**
 * sync-events-calendar.mjs
 * Syncs Approved events from data/events-pipeline.md → Google Calendar
 *
 * First-time setup (~5 min):
 *   1. Go to console.cloud.google.com
 *   2. Create a new project (or reuse one)
 *   3. APIs & Services → Enable APIs → search "Google Calendar API" → Enable
 *   4. APIs & Services → Credentials → Create Credentials → OAuth client ID
 *      → Application type: Desktop app → Download JSON
 *   5. Save the downloaded file as: .credentials/calendar-credentials.json
 *   6. Run: node sync-events-calendar.mjs
 *   7. Open the printed URL in your browser → authorize → done
 *      Token is saved automatically — no login needed on future runs.
 */

import { google } from 'googleapis';
import fs from 'fs';
import http from 'http';
import { URL } from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SCOPES       = ['https://www.googleapis.com/auth/calendar.events'];
const CREDS_PATH   = path.join(__dirname, '.credentials/calendar-credentials.json');
const TOKEN_PATH   = path.join(__dirname, '.credentials/calendar-token.json');
const PIPELINE     = path.join(__dirname, 'data/events-pipeline.md');
const CALENDAR_ID  = 'yingshiliu.j@gmail.com';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

// ── Auth ─────────────────────────────────────────────────────────────────────

async function authorize() {
  if (!fs.existsSync(CREDS_PATH)) {
    console.error(`\n❌  Credentials not found at: ${CREDS_PATH}`);
    console.error('    Follow the setup instructions at the top of this file.\n');
    process.exit(1);
  }

  const { installed } = JSON.parse(fs.readFileSync(CREDS_PATH));
  const oauth2 = new google.auth.OAuth2(
    installed.client_id,
    installed.client_secret,
    REDIRECT_URI
  );

  if (fs.existsSync(TOKEN_PATH)) {
    oauth2.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    return oauth2;
  }

  return getNewToken(oauth2);
}

function getNewToken(oauth2) {
  return new Promise((resolve, reject) => {
    const authUrl = oauth2.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

    console.log('\n🔐  First-time Google Calendar authorization');
    console.log('    Open this URL in your browser:\n');
    console.log(`    ${authUrl}\n`);

    const server = http.createServer(async (req, res) => {
      if (!req.url.startsWith('/oauth2callback')) return;

      const code = new URL(req.url, 'http://localhost:3000').searchParams.get('code');
      res.end('<h2>✅ Authorized! You can close this tab and return to the terminal.</h2>');
      server.close();

      try {
        const { tokens } = await oauth2.getToken(code);
        oauth2.setCredentials(tokens);
        fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
        console.log('✅  Token saved to .credentials/calendar-token.json\n');
        resolve(oauth2);
      } catch (err) {
        reject(err);
      }
    }).listen(3000, () => {
      console.log('    Waiting for authorization...');
    });
  });
}

// ── Pipeline parsing ──────────────────────────────────────────────────────────

function parseApprovedEvents(content) {
  const events = [];
  const lines = content.split('\n');

  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 11) continue;
    if (cols[0] === '#' || cols[0].startsWith('-')) continue; // header/separator

    const [num, status, date, time, name, host, location, type, price, score, url, cal] = cols;

    if (status !== 'Approved') continue;

    events.push({ num, date, time: time || 'TBD', name, host, location, type, price: price || 'TBD', score, url });
  }

  return events;
}

function updatePipelineSync(content, syncedNums) {
  const lines = content.split('\n');
  const today = new Date().toISOString().split('T')[0];

  const updated = lines.map(line => {
    if (!line.startsWith('|')) return line;
    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 10) return line;
    if (cols[0] === '#' || cols[0].startsWith('-')) return line;

    const num = cols[0];
    if (!syncedNums.includes(num)) return line;

    // Replace Status (index 1) with Synced, Cal (index 10) with ✅ date
    const parts = line.split('|');
    // find and update status and cal columns
    let colIdx = 0;
    const newParts = parts.map(p => {
      const trimmed = p.trim();
      if (trimmed === '') return p;
      colIdx++;
      if (colIdx === 2) return ` Synced   `; // Status col
      if (colIdx === 12) return ` ✅ ${today} `; // Cal col
      return p;
    });
    return newParts.join('|');
  });

  return updated.join('\n');
}

// ── Calendar event creation ───────────────────────────────────────────────────

function buildDatetime(date, time) {
  if (!date || date === 'TBD') return null;

  if (!time || time === 'TBD') {
    // All-day event
    return { date };
  }

  // datetime event — default duration 2 hours
  const [year, month, day] = date.split('-').map(Number);
  const [hour, min] = time.split(':').map(Number);
  const start = new Date(year, month - 1, day, hour, min);
  const end   = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const fmt = d => d.toISOString().replace('.000Z', '-07:00').slice(0, 19) + '-07:00';
  return { start: fmt(start), end: fmt(end) };
}

async function createCalendarEvent(auth, event) {
  const calendar = google.calendar({ version: 'v3', auth });
  const dt = buildDatetime(event.date, event.time);

  const resource = {
    summary: event.name,
    location: event.location,
    description: `Host: ${event.host}\nType: ${event.type}\nPrice: ${event.price}\nScore: ${event.score}/10\n\n${event.url}`,
    ...(dt?.date
      ? { start: { date: dt.date }, end: { date: dt.date } }
      : { start: { dateTime: dt?.start, timeZone: 'America/Los_Angeles' },
          end:   { dateTime: dt?.end,   timeZone: 'America/Los_Angeles' } }),
  };

  const res = await calendar.events.insert({ calendarId: CALENDAR_ID, resource });
  return res.data.htmlLink;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(PIPELINE)) {
    console.error(`\n❌  Pipeline not found: ${PIPELINE}`);
    console.error('    Run /career-ops events first to scan and approve events.\n');
    process.exit(1);
  }

  const content = fs.readFileSync(PIPELINE, 'utf8');
  const approved = parseApprovedEvents(content);

  if (approved.length === 0) {
    console.log('\n✅  No Approved events to sync. All caught up!\n');
    return;
  }

  console.log(`\n📅  Found ${approved.length} Approved event(s) to sync to ${CALENDAR_ID}:\n`);
  approved.forEach(e => console.log(`   • ${e.date} ${e.time !== 'TBD' ? e.time : ''} — ${e.name}`));
  console.log('');

  const auth = await authorize();
  const synced = [];

  for (const event of approved) {
    try {
      const link = await createCalendarEvent(auth, event);
      console.log(`   ✅  ${event.name} → ${link}`);
      synced.push(event.num);
    } catch (err) {
      console.error(`   ❌  ${event.name}: ${err.message}`);
    }
  }

  if (synced.length > 0) {
    const updated = updatePipelineSync(content, synced);
    fs.writeFileSync(PIPELINE, updated, 'utf8');
    console.log(`\n✅  Synced ${synced.length} event(s). Pipeline updated.\n`);
  }
}

main().catch(err => {
  console.error('\n❌ ', err.message, '\n');
  process.exit(1);
});
