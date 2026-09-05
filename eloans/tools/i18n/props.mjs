/* Every JSX attribute whose value is a copy-shaped string literal,
   grouped by component and prop, so nothing is missed because a prop
   happens to be called `sub` rather than `subtitle`. */
import {readFileSync} from 'fs';
import * as fs2 from 'fs';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const ts = require('typescript');

const SRC = 'C:/Users/Lipu/Downloads/eloans-full-project/eloans/src/';
const OUT = 'C:/Users/Lipu/AppData/Local/Temp/claude/C--Users-Lipu-Downloads-eloans-full-project/f87d4c84-167a-47ad-8382-19cbaf2cd94b/scratchpad/';
const LUCIDE = new Set(JSON.parse(readFileSync(OUT + 'lucide.json', 'utf8')));

/* props that carry identifiers, routes, styling or DOM semantics */
const NEVER = new Set([
  'className', 'to', 'href', 'id', 'key', 'type', 'name', 'icon', 'ic', 'tone', 'src', 'rel', 'target',
  'role', 'style', 'width', 'height', 'size', 'fill', 'stroke', 'viewBox', 'd', 'x', 'y', 'cx', 'cy', 'r',
  'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'strokeDasharray', 'transform', 'fontSize', 'fontWeight',
  'fontFamily', 'textAnchor', 'rx', 'ry', 'x1', 'x2', 'y1', 'y2', 'points', 'offset', 'stopColor',
  'autoComplete', 'inputMode', 'pattern', 'accept', 'method', 'action', 'htmlFor', 'dataKey',
]);

const isCopy = (s) => {
  const v = s.trim();
  if (v.length < 2 || !/[A-Za-z]/.test(v)) return false;
  if (LUCIDE.has(v)) return false;
  if (/^\/[\w/:*-]*$/.test(v) || /^https?:|^mailto:|^tel:/.test(v)) return false;
  if (/^[a-z][\w-]*$/.test(v)) return false;
  if (/var\(|^#[0-9a-f]{3,}$|\d+px|\d+rem/.test(v)) return false;
  return true;
};

const rows = [];
for (const f of ['main.tsx', 'site.tsx', 'meta.tsx', 'DashArt.tsx', 'BankLogo.tsx']) {
  const src = readFileSync(SRC + f, 'utf8');
  const sf = ts.createSourceFile(SRC + f, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (node) => {
    if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const prop = node.name.getText(sf);
      const val = node.initializer.text;
      // 'value' is a form value on a DOM input but copy on our own components
      const domInput = /^[a-z]/.test((node.parent && node.parent.parent && (node.parent.parent.tagName || (node.parent.parent.openingElement||{}).tagName) || {getText:()=>''}).getText(sf));
      const skipProp = NEVER.has(prop) || (prop === 'value' && domInput);
      if (!skipProp && isCopy(val)) {
        const el = node.parent && node.parent.parent;
        const tag = el && el.tagName ? el.tagName.getText(sf)
          : (el && el.openingElement ? el.openingElement.tagName.getText(sf) : '?');
        rows.push({file: f, line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1, tag, prop, val});
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

fs2.writeFileSync(OUT+'props.json',JSON.stringify([...new Set(rows.map(r=>r.val))],null,1));
const g = {};
for (const r of rows) {
  const k = r.tag + ' . ' + r.prop;
  (g[k] = g[k] || []).push(r);
}
console.log('copy-bearing attributes:', rows.length, '\n');
console.log('count  component . prop            example');
for (const [k, v] of Object.entries(g).sort((a, b) => b[1].length - a[1].length)) {
  console.log(String(v.length).padStart(5) + '  ' + k.padEnd(26) + JSON.stringify(v[0].val).slice(0, 60));
}
