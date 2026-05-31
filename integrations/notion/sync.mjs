#!/usr/bin/env node
// integrations/notion/sync.mjs
// CLI: upsert Career-Ops results into the Notion Job Tracker database.
// Upsert key: Application Link (postingUrl).
//
// Usage:
//   node integrations/notion/sync.mjs upsert-eval --file <payload.json>
//   node integrations/notion/sync.mjs upsert-eval --url <postingUrl> --title <...> --company <...> --score <num|label>
//   node integrations/notion/sync.mjs mark-applied --url <postingUrl> [--status "Applied"]
//
// Env: NOTION_TOKEN, NOTION_DATABASE_ID

import { readFileSync, existsSync } from 'fs';
import { findPageByApplicationLink, createPage, updatePage } from './client.mjs';
import { toJobTrackerProperties } from './mapper.mjs';

function parseArgs(argv) {
	const args = {};
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (!a.startsWith('--')) continue;
		const key = a.slice(2);
		const next = argv[i + 1];
		if (next !== undefined && !next.startsWith('--')) {
			args[key] = next;
			i++;
		} else {
			args[key] = true;
		}
	}
	return args;
}

function loadPayload(args) {
	if (args.file) {
		if (!existsSync(args.file)) throw new Error(`File not found: ${args.file}`);
		return JSON.parse(readFileSync(args.file, 'utf-8'));
	}
	const payload = {};
	if (args.url) payload.postingUrl = args.url;
	if (args.title) payload.jobTitle = args.title;
	if (args.company) payload.company = args.company;
	if (args.location) payload.location = args.location;
	if (args.recruiter) payload.recruiter = args.recruiter;
	if (args.score) payload.matchScore = args.score;
	if (args.domain) payload.domain = args.domain;
	if (args.industry) payload.industry = args.industry;
	if (args['job-type']) payload.jobType = args['job-type'];
	if (args.status) payload.applicationStatus = args.status;
	if (args.keywords) {
		payload.keywords = String(args.keywords)
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
	}
	if (args.notes) payload.tailoringNotes = args.notes;
	if (args['posted-date']) payload.postedDate = args['posted-date'];
	return payload;
}

async function upsertByLink(payload, { defaultStatus } = {}) {
	if (!payload.postingUrl) throw new Error('postingUrl (--url) is required');
	const existing = await findPageByApplicationLink(payload.postingUrl);
	const properties = toJobTrackerProperties(payload);
	if (existing) {
		await updatePage(existing.id, properties);
		return { action: 'updated', pageId: existing.id };
	}
	if (defaultStatus && !payload.applicationStatus) {
		properties['Application Status'] = { status: { name: defaultStatus } };
	}
	const created = await createPage(properties);
	return { action: 'created', pageId: created.id };
}

function titleFromUrl(url) {
	try {
		const segments = new URL(url).pathname.split('/').filter(Boolean);
		const last = segments[segments.length - 1] || '';
		const slug = last
			.replace(/[-_]?\d{8,}$/, '')
			.replace(/[-_]/g, ' ')
			.trim();
		return slug || segments.slice(-2).join(' ') || url;
	} catch {
		return url;
	}
}

function printHelp() {
	console.log(`Notion Job Tracker sync

Commands:
  upsert-eval   Upsert a row after Career-Ops evaluation.
  mark-applied  Mark an existing row as applied.
  help          Show this message.

Examples:
  node integrations/notion/sync.mjs upsert-eval --file reports/2026-04-23-acme.json
  node integrations/notion/sync.mjs upsert-eval \\
    --url https://jobs.example.com/roles/123 \\
    --title "PM, Trust & Safety" --company Acme --score 4.2
  node integrations/notion/sync.mjs mark-applied \\
    --url https://jobs.example.com/roles/123 --status "Applied"
`);
}

async function main() {
	const [command, ...rest] = process.argv.slice(2);
	const args = parseArgs(rest);

	if (!command || command === 'help' || args.help) {
		printHelp();
		process.exit(0);
	}

	if (command === 'upsert-eval') {
		const payload = loadPayload(args);
		const result = await upsertByLink(payload, { defaultStatus: 'Not Applied' });
		console.log(`✓ ${result.action} Notion page ${result.pageId}`);
		return;
	}

	if (command === 'mark-applied') {
		if (!args.url) throw new Error('--url is required');
		const targetStatus = args.status || 'Applied';
		const existing = await findPageByApplicationLink(args.url);
		if (!existing) {
			const payload = loadPayload(args);
			payload.postingUrl = args.url;
			payload.applied = true;
			payload.applicationStatus = targetStatus;
			if (!payload.jobTitle) payload.jobTitle = args.title || titleFromUrl(args.url);
			const properties = toJobTrackerProperties(payload);
			const created = await createPage(properties);
			console.log(`✓ created (applied) Notion page ${created.id}`);
			return;
		}
		const updates = { applied: true, applicationStatus: targetStatus };
		if (args.title) updates.jobTitle = args.title;
		if (args.company) updates.company = args.company;
		const properties = toJobTrackerProperties(updates);
		await updatePage(existing.id, properties);
		console.log(`✓ marked applied: ${existing.id}`);
		return;
	}

	throw new Error(`Unknown command: ${command}. Run with 'help' to see options.`);
}

main().catch((err) => {
	console.error('Fatal:', err.message);
	process.exit(1);
});
