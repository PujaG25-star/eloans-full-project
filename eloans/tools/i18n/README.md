# i18n tooling

How the interface language works, and how to keep it complete when copy changes.

## How translation is wired

`src/i18n.tsx` is the runtime:

- `t(s)` — translate one string. English is the key *and* the fallback, so a
  missing translation shows readable English, never a blank or a raw key.
  Non-strings pass through untouched, so `{t(row[1])}` is safe whatever the
  cell holds.
- `tf(s, vars)` — a sentence with values in it: `tf('{n} of {total} products',
  {n, total})`. The whole sentence is one key, so a translator can move the
  placeholders where the language needs them.
- `td(value)` — deep-translates a structure (the loan catalogue, the info
  pages, the bank and insurance tables), skipping ids, icon names and routes.
  Results are cached per language and per object.

`t()` is a plain function rather than a hook. That is safe because `Shell`
wraps every route and subscribes with `useLang()`, so a language change
re-renders the whole tree and every `t()` call is evaluated again.

`src/catalog.ts` re-exports `loans`, `banks`, `insurance`, `products`,
`families` and `infoPages` behind a proxy that runs `td()` on read, so call
sites keep using them unchanged. **Import catalogue data from `./catalog`,
not from `./data`, `./content` or `./pages`** — the raw modules are the
English source and are never translated.

Dictionaries live in `src/locales/<lang>.ts` and are loaded on demand:
English ships no dictionary at all, and picking a language fetches only that
one.

## Adding copy

Wrap it in `t()` (or `tf()` if it has values in it), then regenerate the key
list and translate the new keys. Data files under `src/content.ts`,
`src/pages.ts` and `src/data.ts` need no wrapping — `td()` reaches them.

## Regenerating the key list

The extractors need the classic TypeScript compiler API. The project itself
is on TypeScript 7 (the native port), which does not expose it, so install a
5.x alongside for tooling only:

```bash
npm i -D typescript@5.9
```

Then, from `src/`:

```bash
node --experimental-strip-types --import ../tools/i18n/tsregister.mjs ../tools/i18n/audit.mjs
node ../tools/i18n/literals.mjs
node ../tools/i18n/props.mjs
node ../tools/i18n/keyset.mjs
```

- `audit.mjs` — strings reachable through `t()`/`tf()` and through `td()` in
  the data modules. Also reports **gaps**: user-visible text with no
  translation path at all. This should print `GAPS sites: 0`.
- `literals.mjs` — copy-shaped literals in the component files (the nav,
  footer and table arrays that reach the DOM through `{x}`).
- `props.mjs` — copy passed as a prop, grouped by component, so nothing is
  missed because a prop is called `sub` rather than `subtitle`.
- `keyset.mjs` — the union, minus an explicit do-not-translate list (ISO
  currency codes, the language picker's own names, the demo profile's
  personal details, and the acronyms PAN/EMI/FOIR/NBFC/UPI, which are used
  as-is in every language). Writes `keys.json`.

## Merging translations

Batches use a compact shape — the English key once, then the six
translations in the order `hi, bn, mr, or, ta, te`:

```json
{
  "Loan amount": ["ऋण राशि", "ঋণের পরিমাণ", "कर्जाची रक्कम", "ଋଣ ପରିମାଣ", "கடன் தொகை", "రుణ మొత్తం"]
}
```

```bash
node tools/i18n/merge.mjs batch.json
```

It merges into the existing `src/locales/*.ts`, rewrites them sorted one
entry per line, and reports added/changed counts per language. The per-language
shape (`{"hi": {...}, "bn": {...}}`) is accepted too.

## Verifying nothing is missed

Static checks cannot see text built at runtime, so the real check is
**pseudo-localisation**: build a dictionary that maps every key to itself
with a marker prefix, load it as one language, walk every route, and report
any on-screen text *without* the marker. Anything it finds is copy with no
translation path.

```js
// build the pseudo dictionary
const keys = require('./tools/i18n/keys.json');
const batch = {}; for (const k of keys) batch[k] = ['»' + k, k, k, k, k, k];
```

Merge it as `hi`, load the app, switch to Hindi, then in the console walk
each route collecting text nodes that do not contain `»`. Restore the real
dictionaries afterwards. The last full run over 49 routes reported **0**.
