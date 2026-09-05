/* Copy-shaped string literals in the component files that are NOT already
   an argument to t(). These are the module-level data arrays (nav, footer,
   trust strip, tables) whose values reach the DOM through {x} expressions. */
import {readFileSync, writeFileSync} from 'fs';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const ts = require('typescript');

const SRC = 'C:/Users/Lipu/Downloads/eloans-full-project/eloans/src/';
const OUT = 'C:/Users/Lipu/AppData/Local/Temp/claude/C--Users-Lipu-Downloads-eloans-full-project/f87d4c84-167a-47ad-8382-19cbaf2cd94b/scratchpad/';
const FILES = ['main.tsx', 'site.tsx'];

/* Things that are never shown to a person. */
/* Real lucide export names, so a genuine one-word label like "Careers" is
   kept while an icon like "ShieldCheck" is dropped. */
const LUCIDE = new Set(JSON.parse(readFileSync(OUT + 'lucide.json', 'utf8')));
const isIcon = (s) => LUCIDE.has(s);
const isRoute = (s) => /^\/[\w/:*-]*$/.test(s) || /^https?:|^mailto:|^tel:/.test(s);
const isIdent = (s) => /^[a-z][\w-]*$/.test(s);
/* A class list is *every* token looking like a utility class, with at
   least one dash or colon. Matching on substrings instead would reject
   real prose — "flexible" contains "flex", "score tracking" contains
   "tracking". */
const CLASS_TOKEN = /^[a-z0-9@:[\]()./%_-]+$/;
const isClassSoup = (s) => {
  const toks = s.trim().split(/\s+/);
  return toks.length > 0 && toks.every((x) => CLASS_TOKEN.test(x)) && toks.some((x) => /[-:]/.test(x));
};
const isCssish = (s) => /var\(|^#[0-9a-f]{3,}$|\d+px|\d+rem|^\d+(\.\d+)?%$/.test(s);

const looksLikeCopy = (s) => {
  const v = s.trim();
  if (v.length < 2) return false;
  if (!/[A-Za-z]/.test(v)) return false;
  if (isRoute(v) || isIdent(v) || isCssish(v) || isClassSoup(v)) return false;
  if (isIcon(v)) return false;                    // single CapWord => icon name
  if (!/[a-z]/.test(v) && v.length < 5) return false;
  return true;
};

const rows = [];
for (const f of FILES) {
  const src = readFileSync(SRC + f, 'utf8');
  const sf = ts.createSourceFile(SRC + f, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const insideT = (n) => {
    const p = n.parent;
    return p && ts.isCallExpression(p) && ts.isIdentifier(p.expression) && ['t','tf'].includes(p.expression.text) && p.arguments[0] === n;
  };

  const visit = (node) => {
    if (ts.isStringLiteral(node) && !insideT(node)) {
      const p = node.parent;
      const skip =
        ts.isImportDeclaration(p) || ts.isExportDeclaration(p) ||
        ts.isJsxAttribute(p) ||                       // handled by the attribute pass
        (ts.isPropertyAssignment(p) && p.name === node) ||
        ts.isLiteralTypeNode(p) ||
        ts.isModuleDeclaration(p);
      if (!skip && looksLikeCopy(node.text)) {
        const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
        rows.push({file: f, line, text: node.text});
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

writeFileSync(OUT + 'litgaps.json', JSON.stringify(rows, null, 1));

const byFile = {};
for (const r of rows) byFile[r.file] = (byFile[r.file] || 0) + 1;
console.log('literal gaps:', rows.length, JSON.stringify(byFile));

/* cluster by line so I can see which arrays they belong to */
const byLine = {};
for (const r of rows) {
  const k = r.file + ':' + r.line;
  (byLine[k] = byLine[k] || []).push(r.text);
}
const clusters = Object.entries(byLine).sort((a, b) => b[1].length - a[1].length);
console.log('\ndensest declaration sites:');
for (const [k, v] of clusters.slice(0, 20)) {
  console.log('  ' + k.padEnd(16) + String(v.length).padStart(3) + '  ' + JSON.stringify(v.slice(0, 4)).slice(0, 95));
}
