import { readFile } from 'node:fs/promises';
const page = await readFile('index.html', 'utf8');
<<<<<<< HEAD
const required = [
  '<main id="main">',
  'src/css/main.css',
  'src/css/exhibit-mode.css',
  'src/css/exhibit-blueprint.css',
  'src/js/app.js',
  'id="demonstrator"',
  'id="research"',
  'id="exhibit-mode"'
];
=======
const required = ['<main id="main">', 'src/css/main.css', 'src/js/app.js', 'id="demonstrator"', 'id="research"'];
>>>>>>> 3dce786c4ad111227bf59759111f2b9bf8590176
const missing = required.filter(token => !page.includes(token));
if (missing.length) throw new Error(`Missing required site markers: ${missing.join(', ')}`);
console.log('Site structure check passed.');
