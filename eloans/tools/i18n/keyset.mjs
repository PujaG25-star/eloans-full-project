/* The final set of strings to translate.

   Union of everything the extractors found, minus the things that must
   stay in English (or in their own script) no matter the interface
   language. */
import {readFileSync, writeFileSync} from 'fs';

const OUT = 'C:/Users/Lipu/AppData/Local/Temp/claude/C--Users-Lipu-Downloads-eloans-full-project/f87d4c84-167a-47ad-8382-19cbaf2cd94b/scratchpad/';
const J = (f) => JSON.parse(readFileSync(OUT + f, 'utf8'));

/* Words that collide with a lucide icon name but genuinely render as text,
   confirmed by the on-screen pseudo-localisation crawl. */
const CONFIRMED = ['Receipt', 'Currency', 'Verified', 'HQ', 'rate', 'rating', 'Off', 'On'];

/* Never translated:
   - ISO currency codes and the language picker's own names
   - the demo profile's personal details
   - Indian financial acronyms, which are used as-is in every language */
const KEEP_ENGLISH = new Set([
  'USD', 'AED', 'GBP', 'SGD', 'AUD', 'CAD', 'EUR', 'INR', 'JPY', 'CHF',
  'English', '· Hindi', '· Bengali', '· Marathi', '· Odia', '· Tamil', '· Telugu',
  'PG', 'Puja Gouda', 'puja@example.demo',
  'PAN', 'EMI', 'FOIR', 'NBFC', 'UPI', 'RBI', 'GST', 'NRI', 'SEBI', 'IFSC', 'KYC', 'CIBIL', 'OTP', 'CVV',
  'eLoans', 'ELOANSS', 'eLoans /',
]);

const all = new Set();
for (const s of J('keys.json')) all.add(s);
for (const r of J('litgaps.json')) all.add(r.text);
for (const s of J('props.json')) all.add(s);
for (const s of CONFIRMED) all.add(s);

for (const s of KEEP_ENGLISH) all.delete(s);

/* Lowercase one-word strings are record ids ('life', 'vehicle'), tone
   values ('info', 'warn') or DOM values ('_blank') that leaked in from the
   data walk — never copy, except the handful confirmed on screen. */
const CONFIRMED_LOWER = new Set(['rate', 'rating', 'fees']);
const isJunk = (s) =>
  s.startsWith('_') || (/^[a-z][\w-]*$/.test(s) && !CONFIRMED_LOWER.has(s));

const keys = [...all].filter((s) => s && s.trim() && !isJunk(s)).sort((a, b) => a.localeCompare(b));
writeFileSync(OUT + 'allkeys.json', JSON.stringify(keys, null, 1));

const pseudo = {hi: {}};
for (const k of keys) pseudo.hi[k] = '\u00BB' + k;
writeFileSync(OUT + 'pseudo.json', JSON.stringify(pseudo));

const words = keys.reduce((n, s) => n + s.trim().split(/\s+/).length, 0);
const chars = keys.reduce((n, s) => n + s.length, 0);
const b = {'1w': 0, '2-3w': 0, '4-8w': 0, '9-20w': 0, '20w+': 0};
for (const s of keys) {
  const w = s.trim().split(/\s+/).length;
  b[w === 1 ? '1w' : w <= 3 ? '2-3w' : w <= 8 ? '4-8w' : w <= 20 ? '9-20w' : '20w+']++;
}
console.log('FINAL KEY SET:', keys.length);
console.log('  words:', words, ' chars:', chars);
console.log('  buckets:', JSON.stringify(b));
