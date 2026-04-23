// integrations/notion/client.mjs
// Minimal Notion REST API client for the Job Tracker integration.
// Uses native fetch (Node 18+). Reads NOTION_TOKEN and NOTION_DATABASE_ID
// from env / .env (via dotenv if installed).

try {
	await import('dotenv/config');
} catch {
	// dotenv is optional — env vars may be injected by the shell.
}

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function getEnv() {
	const token = process.env.NOTION_TOKEN;
	const databaseId = process.env.NOTION_DATABASE_ID;
	if (!token) throw new Error('Missing NOTION_TOKEN env var');
	if (!databaseId) throw new Error('Missing NOTION_DATABASE_ID env var');
	return { token, databaseId };
}

async function notionFetch(path, options = {}) {
	const { token } = getEnv();
	const res = await fetch(`${NOTION_API}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			'Notion-Version': NOTION_VERSION,
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Notion API ${res.status}: ${text}`);
	}
	return res.json();
}

// Find a page in the Job Tracker database by its Application Link (unique key).
export async function findPageByApplicationLink(url) {
	if (!url) return null;
	const { databaseId } = getEnv();
	const data = await notionFetch(`/databases/${databaseId}/query`, {
		method: 'POST',
		body: JSON.stringify({
			filter: {
				property: 'Application Link',
				url: { equals: url },
			},
			page_size: 1,
		}),
	});
	return data.results?.[0] || null;
}

export async function createPage(properties) {
	const { databaseId } = getEnv();
	return notionFetch('/pages', {
		method: 'POST',
		body: JSON.stringify({
			parent: { database_id: databaseId },
			properties,
		}),
	});
}

export async function updatePage(pageId, properties) {
	return notionFetch(`/pages/${pageId}`, {
		method: 'PATCH',
		body: JSON.stringify({ properties }),
	});
}
