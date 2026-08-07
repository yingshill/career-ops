// integrations/notion/mapper.mjs
// Map Career-Ops evaluation/apply payloads to Notion Job Tracker properties.
// Target DB schema (as configured in Notion):
//   - Job Title (title)
//   - Company (text)
//   - Application Link (url)  <-- unique key for upsert
//   - Location (text)
//   - Recruiter (text)
//   - Tailoring Notes (text)
//   - Job Type (select)
//   - Industry (select)
//   - Domain (select)
//   - Keywords (multi_select)
//   - Match Score (select): 🟢 Strong fit | 🟡 Stretch | 🔴 Long shot
//   - Posted Date (date)
//   - Application Status (status): Not Applied, Applied, Phone Screen, ...
//   - Applied (checkbox)
//   - Found Date (created_time — read-only)

function text(value) {
	if (value == null || value === '') return undefined;
	return { rich_text: [{ type: 'text', text: { content: String(value).slice(0, 1900) } }] };
}

function title(value) {
	return { title: [{ type: 'text', text: { content: String(value || 'Untitled').slice(0, 1900) } }] };
}

function urlProp(value) {
	if (!value) return undefined;
	return { url: String(value) };
}

function select(name) {
	if (!name) return undefined;
	return { select: { name: String(name) } };
}

function multiSelect(values) {
	if (!values || !values.length) return undefined;
	return { multi_select: values.filter(Boolean).map((v) => ({ name: String(v) })) };
}

function statusProp(name) {
	if (!name) return undefined;
	return { status: { name: String(name) } };
}

function checkbox(value) {
	return { checkbox: Boolean(value) };
}

function date(dateStr) {
	if (!dateStr) return undefined;
	return { date: { start: dateStr } };
}

const SCORE_MAP = {
	strong: '🟢 Strong fit',
	stretch: '🟡 Stretch',
	longshot: '🔴 Long shot',
	long_shot: '🔴 Long shot',
};

function scoreFromNumber(n) {
	if (n >= 4.0) return '🟢 Strong fit';
	if (n >= 3.0) return '🟡 Stretch';
	return '🔴 Long shot';
}

// Normalize a numeric or string score to one of the 3 Match Score options.
export function toMatchScore(score) {
	if (score === undefined || score === null || score === '') return undefined;
	if (typeof score === 'number') return scoreFromNumber(score);
	const lower = String(score).toLowerCase().trim();
	if (SCORE_MAP[lower]) return SCORE_MAP[lower];
	if (lower.includes('strong')) return '🟢 Strong fit';
	if (lower.includes('stretch')) return '🟡 Stretch';
	if (lower.includes('long')) return '🔴 Long shot';
	const n = parseFloat(lower);
	if (!isNaN(n)) return scoreFromNumber(n);
	return undefined;
}

/**
 * Build a Notion properties object from a Career-Ops payload.
 * Only keys present in `input` are emitted — safe for partial updates.
 *
 * Required for a fresh create: postingUrl, jobTitle.
 */
export function toJobTrackerProperties(input) {
	const props = {};
	if (input.jobTitle !== undefined) props['Job Title'] = title(input.jobTitle);
	if (input.company !== undefined) props['Company'] = text(input.company);
	if (input.postingUrl !== undefined) props['Application Link'] = urlProp(input.postingUrl);
	if (input.location !== undefined) props['Location'] = text(input.location);
	if (input.recruiter !== undefined) props['Recruiter'] = text(input.recruiter);
	if (input.tailoringNotes !== undefined) props['Tailoring Notes'] = text(input.tailoringNotes);
	if (input.jobType !== undefined) props['Job Type'] = select(input.jobType);
	if (input.industry !== undefined) props['Industry'] = select(input.industry);
	if (input.domain !== undefined) props['Domain'] = select(input.domain);
	if (input.keywords !== undefined) props['Keywords'] = multiSelect(input.keywords);
	if (input.matchScore !== undefined) props['Match Score'] = select(toMatchScore(input.matchScore));
	if (input.postedDate !== undefined) props['Posted Date'] = date(input.postedDate);
	if (input.applicationStatus !== undefined) props['Application Status'] = statusProp(input.applicationStatus);
	if (input.applied !== undefined) props['Applied'] = checkbox(input.applied);

	for (const k of Object.keys(props)) {
		if (props[k] === undefined) delete props[k];
	}
	return props;
}
