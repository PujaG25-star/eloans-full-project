/* Merge a batch of translations into src/locales/<lang>.ts.

   The .ts files are the source of truth; this reads what is already there,
   merges the batch on top, and rewrites the file sorted and one entry per
   line so diffs stay readable.

   usage: node gen-locales.mjs <batch.json>
   batch shape: { "hi": { "English source": "translation", ... }, ... }
*/
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'fs';

const LOCALES = 'C:/Users/Lipu/Downloads/eloans-full-project/eloans/src/locales/';
const LANGS = ['hi', 'bn', 'mr', 'or', 'ta', 'te'];
const NAMES = {hi: 'Hindi', bn: 'Bengali', mr: 'Marathi', or: 'Odia', ta: 'Tamil', te: 'Telugu'};

if (!existsSync(LOCALES)) mkdirSync(LOCALES, {recursive: true});

const batchPath = process.argv[2];
let batch = batchPath ? JSON.parse(readFileSync(batchPath, 'utf8')) : {};

/* Compact form: {"English": ["hi","bn","mr","or","ta","te"]} — the English
   key is written once instead of once per language. Expanded here into the
   per-language shape the rest of this script uses. */
const firstVal = Object.values(batch)[0];
if (Array.isArray(firstVal)) {
  const wide = {};
  for (const l of LANGS) wide[l] = {};
  for (const [en, arr] of Object.entries(batch)) {
    if (!Array.isArray(arr) || arr.length !== LANGS.length) {
      console.error('bad row for ' + JSON.stringify(en) + ': expected ' + LANGS.length + ' translations, got ' + (Array.isArray(arr) ? arr.length : typeof arr));
      process.exit(1);
    }
    LANGS.forEach((l, i) => {wide[l][en] = arr[i]});
  }
  batch = wide;
}

/* Quality gate.

   The failure that actually happens when generating this much text is a
   Latin fragment fused into a word in another script — "சேர்க்கவum்". A
   *lowercase* Latin letter touching an Indic letter with no space between
   them is never legitimate.

   Uppercase is deliberately allowed: an acronym taking an Indic suffix —
   Telugu "NBFCలు", Hindi "EMIयाँ" — is correct, and standalone Latin
   tokens (EMI, GST, KYC, bank names) are fine anywhere. */
const INDIC = '\\u0900-\\u097F\\u0980-\\u09FF\\u0B00-\\u0B7F\\u0B80-\\u0BFF\\u0C00-\\u0C7F';
const FUSED = new RegExp('(?:[' + INDIC + '][a-z])|(?:[a-z][' + INDIC + '])');

const problems = [];
for (const l of LANGS) {
  for (const [en, tr] of Object.entries(batch[l] || {})) {
    if (typeof tr !== 'string' || !tr.trim()) {
      problems.push(l + '  EMPTY        ' + JSON.stringify(en));
      continue;
    }
    if (FUSED.test(tr)) problems.push(l + '  LATIN-FUSED  ' + JSON.stringify(en) + ' -> ' + JSON.stringify(tr));
    /* a placeholder dropped in translation would print a literal {n} value */
    const want = (en.match(/\{\w+\}/g) || []).sort().join(',');
    const got = (tr.match(/\{\w+\}/g) || []).sort().join(',');
    if (want !== got) problems.push(l + '  PLACEHOLDER  ' + JSON.stringify(en) + ' -> ' + JSON.stringify(tr));
  }
}
if (problems.length) {
  console.error('refusing to merge — ' + problems.length + ' problem(s):');
  for (const p of problems.slice(0, 40)) console.error('  ' + p);
  process.exit(1);
}

const readExisting = (l) => {
  const p = LOCALES + l + '.ts';
  if (!existsSync(p)) return {};
  const src = readFileSync(p, 'utf8');
  const start = src.indexOf('{');
  const end = src.lastIndexOf('}');
  if (start < 0 || end < 0) return {};
  try {
    return (0, eval)('(' + src.slice(start, end + 1) + ')');
  } catch (e) {
    console.error('could not parse ' + p + ': ' + e.message);
    process.exit(1);
  }
};

const esc = (s) => JSON.stringify(s);

let report = [];
for (const l of LANGS) {
  const existing = readExisting(l);
  const incoming = batch[l] || {};
  let added = 0, changed = 0;
  for (const [k, v] of Object.entries(incoming)) {
    if (!(k in existing)) added++;
    else if (existing[k] !== v) changed++;
    existing[k] = v;
  }
  const keys = Object.keys(existing).sort((a, b) => a.localeCompare(b));
  const body = keys.map((k) => '  ' + esc(k) + ': ' + esc(existing[k]) + ',').join('\r\n');
  const out =
    '/* ' + NAMES[l] + ' (' + l + ') interface strings.\r\n' +
    '   Keyed by the English source text. Generated \u2014 edit through the\r\n' +
    '   translation batches rather than by hand, or the next merge overwrites it.\r\n' +
    '   Missing keys fall back to English at runtime. */\r\n' +
    'const d: Record<string, string> = {\r\n' + body + '\r\n};\r\n\r\nexport default d;\r\n';
  writeFileSync(LOCALES + l + '.ts', out);
  report.push({lang: l, total: keys.length, added, changed});
}

console.log('lang  total  added  changed');
for (const r of report) console.log('  ' + r.lang.padEnd(4), String(r.total).padStart(5), String(r.added).padStart(6), String(r.changed).padStart(8));
