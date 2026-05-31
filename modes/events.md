# Mode: events — Job Search Event Scanner

## Purpose

Scan Luma, Eventbrite, Meetup, and community boards for **local workshops, meetups, and small community events** in the SF Bay Area. Prioritize free or low-cost events (under $50) that offer real networking and learning. Large expensive conferences ($200+) are deprioritized — flag them separately only if highly relevant.

---

## Step 1 — Load Context

Read `config/profile.yml`:
- `candidate.location` → default search city
- `target_roles.primary` + `target_roles.archetypes` → relevance scoring
- `personal.interests` → bonus relevance signals

---

## Step 2 — Search for Events

Run the following WebSearch queries in parallel. Today's date is available as `{currentDate}`.

**Focus: workshops, meetups, and local community events (free or under $50).**

**Luma — SF Bay Area workshops & meetups:**
- `site:lu.ma "San Francisco" AI workshop OR meetup 2026`
- `site:lu.ma "San Francisco" "trust and safety" OR "AI safety" OR "AI governance" 2026`
- `site:lu.ma "San Francisco" "revenue operations" OR RevOps OR "data analytics" workshop 2026`
- `site:lu.ma "San Francisco" career networking tech 2026`

**Eventbrite — SF Bay Area workshops & meetups:**
- `site:eventbrite.com "San Francisco" AI workshop 2026 free OR "$" -conference -summit`
- `site:eventbrite.com "San Francisco" tech networking meetup 2026`
- `site:eventbrite.com "San Francisco" "data analytics" OR "trust and safety" workshop 2026`

**Meetup.com — recurring community groups:**
- `site:meetup.com "San Francisco" AI safety OR "trust and safety" group 2026`
- `site:meetup.com "San Francisco" "revenue operations" OR "data engineering" group 2026`

**Community boards:**
- `"San Francisco" AI OR "trust and safety" workshop meetup free 2026 site:garysguide.com OR site:sf.aitinkerers.org`
- `"Bay Area" AI governance OR "responsible AI" workshop community 2026`

**Large conferences (collect separately — do NOT mix into main ranked list):**
- Only search if specifically asked. If found incidentally, add to a separate "Big Conferences" footnote section with price noted. Do not rank them alongside workshops.

Collect every distinct event. Deduplicate by name + date.

---

## Step 2b — Date Validation (REQUIRED — run before ranking)

**Hard filters — drop any event that fails ANY of these:**

| Rule | Drop if... |
|------|-----------|
| **Past event** | Event date is before today (`{currentDate}`). No exceptions. |
| **Wrong year** | Page title, URL, or description references a year older than the current year (e.g., "2024", "2025" without a confirmed 2026 edition). |
| **Unconfirmed date** | No specific date (day + month + year) can be extracted from the search result or landing page. Mark as `Unconfirmed` and exclude from the ranked table — list separately at the bottom as "Could not confirm date — verify manually." |
| **Duplicate edition** | If an event recurs annually and the search result shows last year's edition without a confirmed current-year page, drop it. Only include if a 2026-specific URL or registration page exists. |

**For recurring/monthly events** (e.g., meetups with no fixed next date):
- Include only if the event series is confirmed active in 2026 and the next occurrence is within 8 weeks.
- List date as `Next: {month} TBD` and note it is recurring.

**Verification step:** For any event where the date is ambiguous, do a follow-up WebSearch:
`"{event name}" 2026 date OR registration OR "register now"`
If a confirmed 2026 date still cannot be found after one follow-up search, drop the event.

---

## Step 3 — Rank Each Event

Score each event on these 5 dimensions (0–10 each):

| Dimension | Weight | Scoring Guide |
|-----------|--------|---------------|
| **Career Relevance** | 30% | 10 = exact match (AI Safety, T&S, AI Governance, RevOps); 7 = adjacent (general AI, data, ops); 4 = broad tech; 2 = tangential |
| **Accessibility** | 25% | 10 = Free; 8 = under $30; 6 = $30–$50; 3 = $50–$200; 0 = over $200 (hard cap — exclude from main list) |
| **Format Quality** | 20% | 10 = hands-on workshop or small roundtable (≤50 people, interactive); 7 = panel + networking; 5 = lecture/talk; 3 = virtual-only webinar |
| **Proximity** | 15% | 10 = SF neighborhood, walkable/BART-accessible; 7 = Bay Area (30–60 min); 4 = South Bay/East Bay (60+ min); 2 = outside CA |
| **Urgency** | 10% | 10 = within 2 weeks; 7 = 2–4 weeks; 5 = 4–8 weeks; 3 = 8+ weeks |

**Score = (Relevance×0.30) + (Accessibility×0.25) + (Format×0.20) + (Proximity×0.15) + (Urgency×0.10)**

**Hard price filter:** Any event costing **over $200** is automatically excluded from the main ranked list. Move it to a separate "FYI — Big Conferences" section at the bottom with price noted, in case the user wants to revisit.

Sort descending. Present top 12 (or all if fewer).

---

## Step 4 — Present for Approval

Show a ranked table:

```
# | Score | Date       | Event                          | Host     | Type       | Price         | Location        | URL
--|-------|------------|--------------------------------|----------|------------|---------------|-----------------|----
1 | 8.4   | 2026-05-10 | AI Safety SF Meetup            | Luma     | Meetup     | Free          | San Francisco   | lu.ma/xyz
2 | 7.9   | 2026-05-14 | Google Cloud Next              | Google   | Conference | $999 / $1799  | San Francisco   | cloud.google.com/...
...
```

**Price field rules:**
- Use `Free` for free events
- Use `$X` for single-tier pricing
- Use `$X / $Y` for the most relevant tier range (e.g., Early Bird / General)
- Use `Free–$X` if there's a free tier alongside paid tiers
- Use `TBD` if pricing is not listed
- Always look for pricing on the event's registration page during the search step — do a follow-up search if needed: `"{event name}" 2026 ticket price OR registration fee`

Then ask:
> "Which events do you want to add to your calendar? 
> Enter numbers (e.g., **1, 3, 5**), **all**, or **none**.
> You can also say **skip 2** to exclude one."

Wait for response.

---

## Step 5 — Write to Pipeline

For each approved event, append a row to `data/events-pipeline.md`.

**Table format:**
```
| # | Status   | Date       | Time  | Event                 | Host   | Location      | Type       | Price        | Score | URL               | Cal |
|---|----------|------------|-------|-----------------------|--------|---------------|------------|--------------|-------|-------------------|-----|
| 1 | Approved | 2026-05-10 | 18:00 | AI Safety SF Meetup   | Luma   | San Francisco | Meetup     | Free         | 8.4   | https://lu.ma/xyz | -   |
| 2 | Approved | 2026-05-14 | 09:00 | Google Cloud Next     | Google | Las Vegas     | Conference | $999 / $1799 | 7.9   | https://cloud...  | -   |
```

**Column rules:**
- `Status`: `Approved` on entry; updated to `Synced` by the script; `Attended` manually after
- `Time`: use 24h format (e.g., `18:00`). Use `TBD` if not listed.
- `Price`: `Free`, `$X`, `$X / $Y`, `Free–$X`, or `TBD` — see price field rules in Step 4
- `Cal`: `-` until synced; `✅ {date}` after script runs
- Sequential `#` continuing from last existing row (or start at 1)

If `data/events-pipeline.md` doesn't exist, create it with this header first:
```markdown
# Events Pipeline

| # | Status | Date | Time | Event | Host | Location | Type | Price | Score | URL | Cal |
|---|--------|------|------|-------|------|----------|------|-------|-------|-----|-----|
```

---

## Step 6 — Offer Calendar Sync

After writing to the pipeline, say:

> "{N} events added to your pipeline.
>
> Run `node sync-events-calendar.mjs` to sync them to your Google Calendar (yingshiliu.j@gmail.com).
>
> First time? You'll need to complete a one-time Google OAuth setup — the script will walk you through it (~5 minutes)."
