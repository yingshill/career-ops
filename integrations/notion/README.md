# Notion Job Tracker integration

Syncs Career-Ops evaluations and application status into your Notion **Job Tracker** database.

**Upsert key:** `Application Link` (the posting URL).

## Setup

1. **Create a Notion internal integration** at <https://www.notion.so/profile/integrations> and copy its secret (`NOTION_TOKEN`).
2. **Share your Job Tracker database** with the integration (open the DB → ••• → *Connections* → add your integration).
3. Copy the **database ID** from the DB URL (the 32-char hash).
4. Add to your `.env`:

   ```env
   NOTION_TOKEN=secret_xxx
   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## Usage

After an evaluation, upsert the row:

```bash
# From a JSON payload (preferred from modes/oferta.md output)
node integrations/notion/sync.mjs upsert-eval --file reports/2026-04-23-acme.json

# Or inline
node integrations/notion/sync.mjs upsert-eval \
  --url https://jobs.example.com/roles/123 \
  --title "PM, Trust & Safety" \
  --company Acme \
  --location "Remote (US)" \
  --score 4.2 \
  --domain "Trust & Safety" \
  --keywords "Trust & Safety,Risk Governance" \
  --notes "Lead with ASIN-fraud enforcement story + governance loop."
```

After you apply in the portal:

```bash
node integrations/notion/sync.mjs mark-applied \
  --url https://jobs.example.com/roles/123 \
  --status "Applied"
```

## JSON payload shape

```json
{
  "postingUrl": "https://jobs.example.com/roles/123",
  "jobTitle": "PM, Trust & Safety",
  "company": "Acme",
  "location": "Remote (US)",
  "recruiter": "Jane Doe (LinkedIn)",
  "tailoringNotes": "Lead with ASIN-fraud enforcement story.",
  "jobType": "Full-time",
  "industry": "E-commerce",
  "domain": "Trust & Safety",
  "keywords": ["Trust & Safety", "Risk Governance"],
  "matchScore": 4.2,
  "postedDate": "2026-04-18",
  "applicationStatus": "Not Applied",
  "applied": false
}
```

- `matchScore` accepts a number (0-5) or a label (`strong` / `stretch` / `long shot`); it is normalized to one of 🟢 / 🟡 / 🔴.
- Only keys you include are written — safe for partial updates.

## Notes

- **Upsert only:** the module never deletes rows.
- **Unique key:** `Application Link`. If you re-run with the same URL, the existing row is updated in place.
- **Posted Date** expects `YYYY-MM-DD`.
- **Application Status** must be one of the values defined in the Notion DB schema: `Not Applied`, `Applied`, `Phone Screen`, `Video Interview`, `Onsite / Final`, `Offer`, `Accepted`, `Rejected`, `Withdrawn`.
