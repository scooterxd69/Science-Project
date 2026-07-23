import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const page = await readFile('index.html', 'utf8');
const problems = [];
const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

if (duplicateIds.length) problems.push(`Duplicate IDs: ${[...new Set(duplicateIds)].join(', ')}`);
if (!/<main\b[^>]*\bid="main"/.test(page)) problems.push('Missing main content landmark.');
if (!/type="module"\s+src="src\/js\/app\.js"/.test(page)) problems.push('Missing application module.');

const references = [...page.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
for (const reference of references) {
  if (/^(?:https?:|mailto:|#|data:)/.test(reference)) continue;
  const file = resolve(reference.split('#')[0]);
  try { await access(file, constants.F_OK); } catch { problems.push(`Missing local asset: ${reference}`); }
}

for (const anchor of references.filter((reference) => reference.startsWith('#'))) {
  const target = anchor.slice(1);
  if (target && !ids.includes(target)) problems.push(`Broken in-page anchor: ${anchor}`);
}

if (problems.length) {
  console.error('AWCR debug log: FAIL');
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exitCode = 1;
} else {
  console.log('AWCR debug log: PASS');
  console.log(`- ${ids.length} unique page IDs inspected`);
  console.log(`- ${references.length} links and assets resolved`);
  console.log('- Required application entry points found');
}
