// Injects the server-rendered markup into the built index.html (vite build → vite build --ssr → this).
import { readFile, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const out = process.argv[2] ?? 'dist';
const ssrDir = process.argv[3] ?? '.ssr';
const { render } = await import(pathToFileURL(path.resolve(ssrDir, 'entry-server.js')).href);
const html = await readFile(path.join(out, 'index.html'), 'utf8');
const app = render();
if (!html.includes('<div id="root"></div>')) throw new Error('root placeholder not found');
await writeFile(path.join(out, 'index.html'), html.replace('<div id="root"></div>', `<div id="root">${app}</div>`));
await rm(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${app.length} chars into ${out}/index.html`);
