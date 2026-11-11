// Injects server-rendered markup into the built index.html (vite build → vite build --ssr → this).
// Austria (default) goes into #root; Germany and the Netherlands are kept as inert <template>s that an inline
// script swaps in before the first paint when the link carries ?country=de|nl (the app then hydrates that markup).
import { readFile, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const out = process.argv[2] ?? 'dist';
const ssrDir = process.argv[3] ?? '.ssr';
const { render } = await import(pathToFileURL(path.resolve(ssrDir, 'entry-server.js')).href);
const file = path.join(out, 'index.html');
let html = await readFile(file, 'utf8');
if (!html.includes('<div id="root"></div>')) throw new Error('root placeholder not found');
const at = render('at');
const swap = `<template id="pre-de">${render('de')}</template><template id="pre-nl">${render('nl')}</template>` +
  `<script>(function(){var q=new URLSearchParams(location.search).get('country');var t=document.getElementById('pre-'+q);` +
  `if(t){document.getElementById('root').innerHTML=t.innerHTML;}document.documentElement.classList.remove('pre-swap');})();</script>`;
html = html.replace('<div id="root"></div>', `<div id="root">${at}</div>${swap}`);
await writeFile(file, html);
await rm(ssrDir, { recursive: true, force: true });
console.log(`prerendered at/de/nl (${html.length} chars) into ${file}`);
