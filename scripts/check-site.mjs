import { readFile } from 'node:fs/promises';
const page = await readFile('index.html', 'utf8');
const required = ['<main id="main">', 'src/css/main.css', 'src/js/app.js', 'id="demonstrator"', 'id="research"'];
const missing = required.filter(token => !page.includes(token));
if (missing.length) throw new Error(`Missing required site markers: ${missing.join(', ')}`);
console.log('Site structure check passed.');
