// Saves fresh fallback data into src/data/snapshot.json.
// Usage: npm run snapshot -- https://your-deployment.vercel.app   (defaults to http://localhost:3000)
import { writeFile } from 'node:fs/promises';

const base = process.argv[2] ?? 'http://localhost:3000';
const res = await fetch(`${base}/api/snapshot`);
if (!res.ok) throw new Error(`Snapshot request failed: ${res.status}`);
const json = await res.json();
await writeFile(new URL('../src/data/snapshot.json', import.meta.url), JSON.stringify(json) + '\n');
console.log(`Saved ${Object.keys(json.tickers).length} tickers to src/data/snapshot.json`);
