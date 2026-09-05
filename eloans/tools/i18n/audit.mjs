/* Two outputs:
     keys.json  every string that IS wired for translation (the set to translate)
     gaps.json  user-visible text that is NOT yet wired (the set still to fix)

   Wired means: passed to t() in a component, or reachable by td() inside the
   data modules. */
import {readFileSync, writeFileSync} from 'fs';
import {createRequire} from 'module';
import {pathToFileURL} from 'url';
const require = createRequire(import.meta.url);
const ts = require('typescript');

const SRC = 'C:/Users/Lipu/Downloads/eloans-full-project/eloans/src/';
const OUT = 'C:/Users/Lipu/AppData/Local/Temp/claude/C--Users-Lipu-Downloads-eloans-full-project/f87d4c84-167a-47ad-8382-19cbaf2cd94b/scratchpad/';
const COMPONENTS = ['main.tsx', 'site.tsx', 'meta.tsx', 'BankLogo.tsx', 'DashArt.tsx'];

const wired = new Map();   // string -> Set(origin)
const gaps = [];           // {file, line, kind, text}

const addWired = (s, origin) => {
  if (typeof s !== 'string') return;
  const v = s.trim();
  if (!v || !/[A-Za-z]/.test(v)) return;
  if (!wired.has(v)) wired.set(v, new Set());
  wired.get(v).add(origin);
};

/* ---------- data modules (wired through td) ---------- */
const SKIP_KEYS = new Set(['id', 'icon', 'family', 'initials', 'rating', 't', 'href', 'to', 'slug', 'key']);
const TUPLE_SKIP = {cards: [0], links: [1]};

const walk = (node, origin, blockType = null) => {
  if (node == null) return;
  if (typeof node === 'string') return addWired(node, origin);
  if (Array.isArray(node)) {
    const skip = blockType && TUPLE_SKIP[blockType] ? TUPLE_SKIP[blockType] : [];
    node.forEach((v, i) => {
      if (typeof v === 'string' && skip.includes(i)) return;
      walk(v, origin, blockType);
    });
    return;
  }
  if (typeof node === 'object') {
    const bt = typeof node.t === 'string' ? node.t : blockType;
    for (const [k, v] of Object.entries(node)) {
      if (SKIP_KEYS.has(k)) continue;
      walk(v, origin, bt);
    }
  }
};

const [content, pages, data] = await Promise.all([
  import(pathToFileURL(SRC + 'content.ts').href),
  import(pathToFileURL(SRC + 'pages.ts').href),
  import(pathToFileURL(SRC + 'data.ts').href),
]);
walk(content.families, 'content.ts');
walk(content.products, 'content.ts');
walk(pages.infoPages, 'pages.ts');
walk(data.loans, 'data.ts');
walk(data.banks, 'data.ts');
walk(data.insurance, 'data.ts');
addWired(data.RATES_AS_OF, 'data.ts');

/* ---------- component modules ---------- */
const TEXT_ATTRS = new Set(['placeholder', 'aria-label', 'alt', 'title', 'label', 'subtitle']);
/* components that call t() on the prop themselves */
const TRANSLATING = {Panel:['title'],PageHeader:['title','subtitle'],SectionTitle:['title','subtitle'],SemiGauge:['label'],Status:['text'],Head:['title','subtitle'],PageHero:['title','subtitle'],Slider:['label'],Metric:['label'],Field:['label'],LoanPortfolio:['title']};
const isIdentifierish = (s) =>
  !/[A-Za-z]/.test(s) || /^[a-z][\w-]*$/.test(s) || /^\/[\w/-]*$/.test(s) || /^https?:|^mailto:|^tel:/.test(s);

for (const f of COMPONENTS) {
  const src = readFileSync(SRC + f, 'utf8');
  const sf = ts.createSourceFile(SRC + f, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const at = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;

  const visit = (node) => {
    /* wired: t('...') and tf('...', vars) */
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && (node.expression.text === 't' || node.expression.text === 'tf')) {
      const a = node.arguments[0];
      if (a && ts.isStringLiteral(a)) addWired(a.text, f);
    }

    /* gap: raw JSX text still sitting in the markup */
    if (ts.isJsxText(node)) {
      const v = node.getFullText(sf).trim().replace(/\s*\n\s*/g, ' ');
      if (v && /[A-Za-z]{2}/.test(v) && !isIdentifierish(v)) gaps.push({file: f, line: at(node), kind: 'jsx-text', text: v});
    }

    /* a text attribute holding a bare string literal: wired if the component
       receiving it translates that prop itself, otherwise a real gap */
    if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const name = node.name.getText(sf);
      const v = node.initializer.text;
      if (TEXT_ATTRS.has(name) && v.trim() && /[A-Za-z]{2}/.test(v) && !isIdentifierish(v)) {
        const el = node.parent && node.parent.parent;
        const tag = el && el.tagName ? el.tagName.getText(sf) : (el && el.openingElement ? el.openingElement.tagName.getText(sf) : '?');
        const translated = TRANSLATING[tag];
        if (translated && translated.includes(name)) addWired(v, f);
        else gaps.push({file: f, line: at(node), kind: 'attr:' + name, tag, text: v});
      }
    }

    ts.forEachChild(node, visit);
  };
  visit(sf);
}

const keys = [...wired.keys()].sort((a, b) => a.localeCompare(b));
writeFileSync(OUT + 'keys.json', JSON.stringify(keys, null, 1));
writeFileSync(OUT + 'gaps.json', JSON.stringify(gaps, null, 1));

const words = keys.reduce((n, s) => n + s.split(/\s+/).length, 0);
console.log('WIRED  strings:', keys.length, ' words:', words);
console.log('GAPS   sites  :', gaps.length);
const byKind = {};
for (const g of gaps) byKind[g.kind] = (byKind[g.kind] || 0) + 1;
console.log('  by kind:', JSON.stringify(byKind));
const byFile = {};
for (const g of gaps) byFile[g.file] = (byFile[g.file] || 0) + 1;
console.log('  by file:', JSON.stringify(byFile));
console.log('\nfirst 15 gaps:');
for (const g of gaps.slice(0, 15)) console.log('  ' + (g.file + ':' + g.line).padEnd(16) + g.kind.padEnd(14) + JSON.stringify(g.text.slice(0, 70)));
