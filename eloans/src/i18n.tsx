import {useCallback, useEffect, useState} from 'react';

/* ------------------------------------------------------------------
   Interface language.

   Every user-facing string in the app goes through `t()`. English is the
   key as well as the source text, so a missing translation degrades to
   readable English rather than a blank or a raw key.

   `t()` is a plain module function rather than a hook. That is safe here
   because `Shell` — which wraps every route, the header and the footer —
   subscribes with `useLang()`, so a language change re-renders the whole
   tree and every `t()` call is evaluated again with the new language.

   Dictionaries are loaded on demand: English ships with no dictionary at
   all, and picking a language fetches just that one. Adding a language
   means adding it to `languages` and to `loaders`, then adding the
   matching file under `locales/`.
------------------------------------------------------------------ */

export type Lang = 'en' | 'hi' | 'bn' | 'mr' | 'or' | 'ta' | 'te';

export const languages: [Lang, string, string][] = [
  ['en', 'English', 'English'],
  ['hi', 'हिन्दी', 'Hindi'],
  ['bn', 'বাংলা', 'Bengali'],
  ['mr', 'मराठी', 'Marathi'],
  ['or', 'ଓଡ଼ିଆ', 'Odia'],
  ['ta', 'தமிழ்', 'Tamil'],
  ['te', 'తెలుగు', 'Telugu'],
];

type Dict = Record<string, string>;

const loaders: Record<Exclude<Lang, 'en'>, () => Promise<{default: Dict}>> = {
  hi: () => import('./locales/hi'),
  bn: () => import('./locales/bn'),
  mr: () => import('./locales/mr'),
  or: () => import('./locales/or'),
  ta: () => import('./locales/ta'),
  te: () => import('./locales/te'),
};

const KEY = 'eloans.lang';
const read = () => {try {return localStorage.getItem(KEY)} catch {return null}};
const isLang = (v: unknown): v is Lang => languages.some(([c]) => c === v);
const initial = (): Lang => {const v = read(); return isLang(v) ? v : 'en'};

/* The dictionary currently in memory. `dictLang` guards against using a
   half-swapped dictionary while another language is still loading. */
let dict: Dict = {};
let dictLang: Lang = 'en';
let current: Lang = initial();

const loaded = new Map<Lang, Dict>();

async function loadDict(l: Lang): Promise<void> {
  if (l === 'en') {dict = {}; dictLang = 'en'; return}
  const cached = loaded.get(l);
  if (cached) {dict = cached; dictLang = l; return}
  try {
    const m = await loaders[l]();
    loaded.set(l, m.default);
    dict = m.default;
    dictLang = l;
  } catch {
    /* a missing or broken dictionary must not take the page down —
       fall back to English text */
    dict = {};
    dictLang = l;
  }
}

/* Translate one string. Unknown keys return the English source.

   Non-strings pass through untouched, so `t()` can be wrapped around any
   value a component renders — `{t(row[1])}`, `{t(count)}`, `{t(node)}` —
   without the call site having to know what it holds. Icon names and
   routes live in props, never in rendered children, so they never reach
   here. */
export function t(s: string): string;
export function t<T>(s: T): T;
export function t(s: unknown): unknown {
  if (typeof s !== 'string' || !s || current === 'en' || dictLang !== current) return s;
  return dict[s] ?? s;
}

/* Translate a sentence that has values inside it.

     tf('{n} of {total} products', {n: 12, total: 37})

   The whole sentence is one dictionary key, so a translator can move the
   placeholders wherever that language needs them. A placeholder with no
   matching value is left as written rather than printed as "undefined". */
export function tf(s: string, vars: Record<string, string | number>): string {
  return t(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/* ------------------------------------------------------------------
   Structured content (the loan catalogue, the info pages, the bank and
   insurance tables) is authored as data, not markup. `td` walks a value
   and translates every human-readable string inside it, leaving machine
   identifiers alone.

   Results are cached per language and per object, so a page re-render
   does not re-walk the whole catalogue.
------------------------------------------------------------------ */

/* keys whose values are identifiers, icon names or routes */
const SKIP_KEYS = new Set(['id', 'icon', 'family', 'initials', 'rating', 't', 'href', 'to', 'slug', 'key']);

/* tuple positions that are identifiers, by the block type they sit in:
   'cards' items are [icon, heading, body]; 'links' items are [label, href, blurb] */
const TUPLE_SKIP: Record<string, number[]> = {cards: [0], links: [1]};

const cache = new WeakMap<object, Map<Lang, unknown>>();

function walk(v: unknown, blockType: string | null): unknown {
  if (typeof v === 'string') return t(v);
  if (v == null || typeof v !== 'object') return v;

  const hit = cache.get(v as object);
  const memo = hit?.get(current);
  if (memo !== undefined) return memo;

  let out: unknown;
  if (Array.isArray(v)) {
    const skip = blockType ? TUPLE_SKIP[blockType] ?? [] : [];
    out = v.map((item, i) => (typeof item === 'string' && skip.includes(i) ? item : walk(item, blockType)));
  } else {
    const rec = v as Record<string, unknown>;
    const bt = typeof rec.t === 'string' ? (rec.t as string) : blockType;
    const o: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(rec)) o[k] = SKIP_KEYS.has(k) ? val : walk(val, bt);
    out = o;
  }

  const m = hit ?? new Map<Lang, unknown>();
  m.set(current, out);
  if (!hit) cache.set(v as object, m);
  return out;
}

export function td<T>(v: T): T {
  if (current === 'en' || dictLang !== current) return v;
  return walk(v, null) as T;
}

/* Set before first paint so <html lang> is right for screen readers, and
   start fetching the dictionary so the first render is already translated
   where possible. */
export function applyStoredLang(): Promise<void> {
  const l = initial();
  document.documentElement.lang = l;
  current = l;
  return loadDict(l);
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(initial);
  /* bumped when a dictionary finishes loading for the language already in
     state — the language itself has not changed, so only this forces the
     re-render that swaps English out for the freshly loaded strings */
  const [, bump] = useState(0);

  useEffect(() => {document.documentElement.lang = lang}, [lang]);

  const setLang = useCallback((l: Lang) => {
    void loadDict(l).then(() => {
      current = l;
      setLangState(l);
      try {localStorage.setItem(KEY, l)} catch {/* private mode */}
      /* other mounted components pick the change up through the same event */
      window.dispatchEvent(new CustomEvent('eloans:lang', {detail: l}));
    });
  }, []);

  useEffect(() => {
    const on = (e: Event) => {
      const l = (e as CustomEvent).detail;
      if (isLang(l)) setLangState(l);
    };
    window.addEventListener('eloans:lang', on);
    return () => window.removeEventListener('eloans:lang', on);
  }, []);

  /* If the stored language was still loading when this mounted, re-render
     once it lands so the first paint is not stuck in English. */
  useEffect(() => {
    if (lang === 'en' || dictLang === lang) return;
    let live = true;
    void loadDict(lang).then(() => {
      if (!live) return;
      current = lang;
      bump((n) => n + 1);
    });
    return () => {live = false};
  }, [lang]);

  return {lang, setLang, t};
}
