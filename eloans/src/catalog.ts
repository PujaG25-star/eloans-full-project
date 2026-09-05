import {loans as loansSrc, banks as banksSrc, insurance as insuranceSrc} from './data';
import {products as productsSrc, families as familiesSrc} from './content';
import {infoPages as infoPagesSrc} from './pages';
import {td} from './i18n';

/* ------------------------------------------------------------------
   Language-aware view of the catalogue.

   `content.ts`, `pages.ts` and `data.ts` stay authored in English and are
   never mutated. Reading any property here returns the value in the
   current interface language instead, so call sites keep writing
   `loans.find(...)`, `products.map(...)`, `infoPages[slug]` unchanged.

   `td` walks a value once per language and caches the result, so the
   repeated reads a render does are a map lookup, not a re-translation.
------------------------------------------------------------------ */

function localized<T extends object>(source: T): T {
  return new Proxy(source, {
    get: (_t, p) => (td(source) as Record<PropertyKey, unknown>)[p],
    has: (_t, p) => p in (td(source) as object),
    ownKeys: () => Reflect.ownKeys(td(source) as object),
    getOwnPropertyDescriptor: (_t, p) => Reflect.getOwnPropertyDescriptor(td(source) as object, p),
  });
}

export const loans = localized(loansSrc);
export const banks = localized(banksSrc);
export const insurance = localized(insuranceSrc);
export const products = localized(productsSrc);
export const families = localized(familiesSrc);
export const infoPages = localized(infoPagesSrc);
